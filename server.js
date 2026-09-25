'use strict';

const path = require('node:path');
const fs = require('node:fs');
const crypto = require('node:crypto');
const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const Database = require('better-sqlite3');

const app = express();
const ROOT = __dirname;
const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const USMP_EMAIL_ONLY = process.env.USMP_EMAIL_ONLY === 'true';
const SESSION_DAYS = 30;
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const PASSWORD_MAX_BYTES = 512;
const rateBuckets = new Map();

const configuredDatabase = process.env.DATABASE_PATH || path.join(ROOT, 'data', 'prisma.sqlite');
const databaseFile = path.isAbsolute(configuredDatabase)
  ? configuredDatabase
  : path.resolve(ROOT, configuredDatabase);

fs.mkdirSync(path.dirname(databaseFile), { recursive: true });
const db = new Database(databaseFile);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');
db.pragma('busy_timeout = 5000');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL COLLATE NOCASE UNIQUE,
    password_hash TEXT NOT NULL,
    career TEXT NOT NULL DEFAULT 'Sin especificar',
    avatar TEXT,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS sessions (
    token_hash TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    body TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'General',
    image TEXT,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS post_likes (
    post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TEXT NOT NULL,
    PRIMARY KEY (post_id, user_id)
  );

  CREATE TABLE IF NOT EXISTS activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    category TEXT NOT NULL DEFAULT 'Ayuda',
    people_needed INTEGER NOT NULL DEFAULT 1,
    location TEXT NOT NULL DEFAULT 'Por definir',
    event_date TEXT,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS activity_members (
    activity_id INTEGER NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    joined_at TEXT NOT NULL,
    PRIMARY KEY (activity_id, user_id)
  );

  CREATE TABLE IF NOT EXISTS stories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    image TEXT NOT NULL,
    created_at TEXT NOT NULL,
    expires_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
  CREATE INDEX IF NOT EXISTS idx_posts_created ON posts(created_at DESC);
  CREATE INDEX IF NOT EXISTS idx_activities_created ON activities(created_at DESC);
  CREATE INDEX IF NOT EXISTS idx_stories_expiry ON stories(expires_at);
  CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read, created_at DESC);
`);

const POST_CATEGORIES = new Set(['General', 'Académico', 'Comunidad']);
const ACTIVITY_CATEGORIES = new Set(['Deporte', 'Juego', 'Estudio', 'Transporte', 'Ayuda', 'Otro']);

function now() {
  return new Date().toISOString();
}

function cleanText(value, maxLength = 500) {
  if (value === undefined || value === null) return '';
  return String(value)
    .replace(/\u0000/g, '')
    .replace(/[\u0001-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, ' ')
    .trim()
    .slice(0, maxLength);
}

function normalizeEmail(value) {
  return cleanText(value, 254).trim().toLowerCase();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isAllowedEmail(email) {
  return !USMP_EMAIL_ONLY || email.endsWith('@usmp.edu.pe');
}

function isValidImage(value) {
  if (!value) return true;
  if (typeof value !== 'string') return false;
  const match = value.match(/^data:(image\/(?:jpe?g|png|webp|gif|heic|heif|avif));base64,([a-z0-9+/=\s]+)$/i);
  if (!match) return false;

  try {
    const bytes = Buffer.from(match[2].replace(/\s/g, ''), 'base64');
    if (!bytes.length || bytes.length > MAX_IMAGE_BYTES) return false;
    const mime = match[1].toLowerCase();
    if (mime === 'image/jpeg' || mime === 'image/jpg') return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
    if (mime === 'image/png') return bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
    if (mime === 'image/gif') return bytes.subarray(0, 4).toString('ascii') === 'GIF8';
    if (mime === 'image/webp') return bytes.subarray(0, 4).toString('ascii') === 'RIFF' && bytes.subarray(8, 12).toString('ascii') === 'WEBP';
    if (mime === 'image/heic' || mime === 'image/heif' || mime === 'image/avif') {
      return bytes.subarray(4, 8).toString('ascii') === 'ftyp';
    }
    return false;
  } catch {
    return false;
  }
}

function passwordForHash(password) {
  return crypto.createHash('sha256').update(password, 'utf8').digest('hex');
}

function rateLimit(windowMs, maxRequests, scope) {
  return (req, res, next) => {
    const client = req.user ? `user:${req.user.id}` : `ip:${req.ip || req.socket.remoteAddress || 'unknown'}`;
    const key = `${scope}:${client}`;
    const currentTime = Date.now();
    const current = rateBuckets.get(key);
    const bucket = !current || current.resetAt <= currentTime
      ? { count: 0, resetAt: currentTime + windowMs }
      : current;

    bucket.count += 1;
    rateBuckets.set(key, bucket);
    res.setHeader('RateLimit-Limit', String(maxRequests));
    res.setHeader('RateLimit-Remaining', String(Math.max(0, maxRequests - bucket.count)));
    res.setHeader('RateLimit-Reset', String(Math.ceil(bucket.resetAt / 1000)));

    if (bucket.count > maxRequests) {
      res.setHeader('Retry-After', String(Math.ceil((bucket.resetAt - currentTime) / 1000)));
      return res.status(429).json({ error: 'Demasiados intentos. Espera un momento y vuelve a intentar.' });
    }
    return next();
  };
}

function sameOriginGuard(req, res, next) {
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) return next();

  const fetchSite = req.get('sec-fetch-site');
  if (fetchSite && !['same-origin', 'none'].includes(fetchSite)) {
    return res.status(403).json({ error: 'Origen de solicitud no permitido.' });
  }

  const origin = req.get('origin');
  const referer = req.get('referer');
  const expectedOrigin = `${req.protocol}://${req.get('host')}`;
  if (origin && origin !== expectedOrigin) {
    return res.status(403).json({ error: 'Origen de solicitud no permitido.' });
  }
  if (!origin && referer) {
    try {
      if (new URL(referer).origin !== expectedOrigin) return res.status(403).json({ error: 'Origen de solicitud no permitido.' });
    } catch {
      return res.status(403).json({ error: 'Origen de solicitud no permitido.' });
    }
  }
  return next();
}

const authRateLimit = rateLimit(15 * 60 * 1000, 30, 'auth');
const postRateLimit = rateLimit(60 * 60 * 1000, 30, 'post');
const storyRateLimit = rateLimit(60 * 60 * 1000, 20, 'story');
const activityRateLimit = rateLimit(60 * 60 * 1000, 20, 'activity');
const joinRateLimit = rateLimit(60 * 60 * 1000, 80, 'join');
const likeRateLimit = rateLimit(60 * 60 * 1000, 120, 'like');

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    career: user.career,
    avatar: user.avatar || null,
    createdAt: user.created_at,
  };
}

function getUserById(id) {
  return db.prepare('SELECT * FROM users WHERE id = ?').get(id);
}

function createSession(res, userId) {
  const token = crypto.randomBytes(32).toString('hex');
  const createdAt = now();
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 86400000).toISOString();

  db.prepare(`
    INSERT INTO sessions (token_hash, user_id, expires_at, created_at)
    VALUES (?, ?, ?, ?)
  `).run(hashToken(token), userId, expiresAt, createdAt);

  res.cookie('prism_session', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: IS_PRODUCTION,
    path: '/',
    maxAge: SESSION_DAYS * 86400000,
  });
}

function clearSession(req, res) {
  const token = req.cookies && req.cookies.prism_session;
  if (token) db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(hashToken(token));
  res.clearCookie('prism_session', {
    httpOnly: true,
    sameSite: 'lax',
    secure: IS_PRODUCTION,
    path: '/',
  });
}

function currentUser(req) {
  const token = req.cookies && req.cookies.prism_session;
  if (!token) return null;

  const user = db.prepare(`
    SELECT u.*
    FROM sessions s
    JOIN users u ON u.id = s.user_id
    WHERE s.token_hash = ? AND s.expires_at > ?
  `).get(hashToken(token), now());

  if (!user) {
    db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(hashToken(token));
    return null;
  }
  return user;
}

function requireAuth(req, res, next) {
  const user = currentUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Tu sesión no está activa. Inicia sesión nuevamente.' });
  }
  req.user = user;
  return next();
}

function asyncRoute(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}

function getPost(postId, userId) {
  return db.prepare(`
    SELECT
      p.id,
      p.body,
      p.category,
      p.image,
      p.created_at,
      u.id AS user_id,
      u.name,
      u.career,
      u.avatar,
      (SELECT COUNT(*) FROM post_likes pl WHERE pl.post_id = p.id) AS likes,
      EXISTS(SELECT 1 FROM post_likes pl2 WHERE pl2.post_id = p.id AND pl2.user_id = @userId) AS liked
    FROM posts p
    JOIN users u ON u.id = p.user_id
    WHERE p.id = @postId
  `).get({ postId, userId });
}

function getPostsForUser(ownerId, viewerId, limit, offset = 0) {
  return db.prepare(`
    SELECT
      p.id,
      p.body,
      p.category,
      p.image,
      p.created_at,
      u.id AS user_id,
      u.name,
      u.career,
      u.avatar,
      (SELECT COUNT(*) FROM post_likes pl WHERE pl.post_id = p.id) AS likes,
      EXISTS(SELECT 1 FROM post_likes pl2 WHERE pl2.post_id = p.id AND pl2.user_id = @viewerId) AS liked
    FROM posts p
    JOIN users u ON u.id = p.user_id
    WHERE p.user_id = @ownerId
    ORDER BY p.created_at DESC
    LIMIT @limit OFFSET @offset
  `).all({ ownerId, viewerId, limit, offset });
}

function getActivity(activityId, userId) {
  const activity = db.prepare(`
    SELECT
      a.id,
      a.owner_id,
      a.title,
      a.description,
      a.category,
      a.people_needed,
      a.location,
      a.event_date,
      a.created_at,
      u.id AS owner_user_id,
      u.name AS owner_name,
      u.career AS owner_career,
      u.avatar AS owner_avatar,
      COUNT(am.user_id) AS joined,
      EXISTS(SELECT 1 FROM activity_members am2 WHERE am2.activity_id = a.id AND am2.user_id = @userId) AS joined_by_me
    FROM activities a
    JOIN users u ON u.id = a.owner_id
    LEFT JOIN activity_members am ON am.activity_id = a.id
    WHERE a.id = @activityId
    GROUP BY a.id
  `).get({ activityId, userId });

  if (!activity) return null;
  const total = 1 + activity.people_needed;
  return {
    id: activity.id,
    title: activity.title,
    description: activity.description,
    category: activity.category,
    peopleNeeded: activity.people_needed,
    location: activity.location,
    eventDate: activity.event_date,
    createdAt: activity.created_at,
    owner: {
      id: activity.owner_user_id,
      name: activity.owner_name,
      career: activity.owner_career,
      avatar: activity.owner_avatar,
    },
    joined: activity.joined,
    total,
    remaining: Math.max(total - activity.joined, 0),
    joinedByMe: Boolean(activity.joined_by_me),
    isOwner: activity.owner_id === userId,
  };
}

function serializePost(post) {
  return {
    id: post.id,
    body: post.body,
    category: post.category,
    image: post.image || null,
    createdAt: post.created_at,
    author: {
      id: post.user_id,
      name: post.name,
      career: post.career,
      avatar: post.avatar || null,
    },
    likes: post.likes,
    liked: Boolean(post.liked),
  };
}

function serializeStory(story) {
  return {
    id: story.id,
    image: story.image,
    createdAt: story.created_at,
    author: {
      id: story.user_id,
      name: story.name,
      career: story.career,
      avatar: story.avatar || null,
    },
  };
}

function serializeActivity(activity) {
  return activity;
}

function serializeNotification(notification) {
  return {
    id: notification.id,
    type: notification.type,
    message: notification.message,
    isRead: Boolean(notification.is_read),
    createdAt: notification.created_at,
  };
}

function validationError(res, message) {
  return res.status(400).json({ error: message });
}

function boundedLimit(value, fallback, maximum) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isInteger(parsed) || parsed < 1) return fallback;
  return Math.min(parsed, maximum);
}

function isValidDateOnly(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'same-origin');
  res.setHeader('Permissions-Policy', 'camera=(self), microphone=(), geolocation=()');
  res.setHeader('Content-Security-Policy', "default-src 'self'; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'");
  if (IS_PRODUCTION) res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});
app.use(express.json({ limit: '8mb' }));
app.use(cookieParser());
app.use('/api', (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});
app.use('/api', sameOriginGuard);

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'prism', database: 'sqlite' });
});

app.get('/api/me', (req, res) => {
  const user = currentUser(req);
  res.json({ user: user ? publicUser(user) : null });
});

app.post('/api/auth/register', authRateLimit, asyncRoute(async (req, res) => {
  const name = cleanText(req.body && req.body.name, 80);
  const email = normalizeEmail(req.body && req.body.email);
  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  const confirmPassword = typeof req.body?.confirmPassword === 'string' ? req.body.confirmPassword : '';
  const career = cleanText(req.body && req.body.career, 100) || 'Sin especificar';

  if (name.length < 2) return validationError(res, 'Escribe un nombre de al menos 2 caracteres.');
  if (!isValidEmail(email)) return validationError(res, 'Escribe un correo electrónico válido.');
  if (!isAllowedEmail(email)) return validationError(res, 'Por ahora solo se admiten correos de la USMP.');
  if (password.length < 8) return validationError(res, 'La contraseña debe tener al menos 8 caracteres.');
  if (password.length > 128 || Buffer.byteLength(password, 'utf8') > PASSWORD_MAX_BYTES) {
    return validationError(res, 'La contraseña es demasiado larga.');
  }
  if (password !== confirmPassword) return validationError(res, 'Las contraseñas no coinciden.');

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) return res.status(409).json({ error: 'Ya existe una cuenta con ese correo. Inicia sesión.' });

  const passwordHash = await bcrypt.hash(passwordForHash(password), 12);
  let userId;
  try {
    const result = db.prepare(`
      INSERT INTO users (name, email, password_hash, career, created_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(name, email, passwordHash, career, now());
    userId = result.lastInsertRowid;
  } catch (error) {
    if (String(error.code).includes('CONSTRAINT')) {
      return res.status(409).json({ error: 'Ya existe una cuenta con ese correo. Inicia sesión.' });
    }
    throw error;
  }

  const user = getUserById(userId);
  createSession(res, user.id);
  return res.status(201).json({ user: publicUser(user) });
}));

app.post('/api/auth/login', authRateLimit, asyncRoute(async (req, res) => {
  const email = normalizeEmail(req.body && req.body.email);
  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  if (!isValidEmail(email) || !isAllowedEmail(email) || !password || password.length > 128 || Buffer.byteLength(password, 'utf8') > PASSWORD_MAX_BYTES) {
    return validationError(res, 'Ingresa tu correo y contraseña.');
  }

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  let valid = user ? await bcrypt.compare(passwordForHash(password), user.password_hash) : false;
  // Permite recuperar cuentas creadas por una versión anterior del prototipo.
  if (user && !valid) valid = await bcrypt.compare(password, user.password_hash);
  if (!user || !valid) {
    return res.status(401).json({ error: 'Correo o contraseña incorrectos. Verifica tus datos.' });
  }

  createSession(res, user.id);
  return res.json({ user: publicUser(user) });
}));

app.post('/api/auth/logout', (req, res) => {
  clearSession(req, res);
  res.json({ ok: true });
});

app.get('/api/feed', requireAuth, (req, res) => {
  const userId = req.user.id;
  const postLimit = boundedLimit(req.query.posts, 40, 50);
  const storyLimit = boundedLimit(req.query.stories, 20, 30);
  const activityLimit = boundedLimit(req.query.activities, 30, 50);
  db.prepare('DELETE FROM stories WHERE expires_at <= ?').run(now());
  const posts = db.prepare(`
    SELECT
      p.id,
      p.body,
      p.category,
      p.image,
      p.created_at,
      u.id AS user_id,
      u.name,
      u.career,
      u.avatar,
      (SELECT COUNT(*) FROM post_likes pl WHERE pl.post_id = p.id) AS likes,
      EXISTS(SELECT 1 FROM post_likes pl2 WHERE pl2.post_id = p.id AND pl2.user_id = @userId) AS liked
    FROM posts p
    JOIN users u ON u.id = p.user_id
    ORDER BY p.created_at DESC
    LIMIT @postLimit
  `).all({ userId, postLimit });

  const stories = db.prepare(`
    SELECT s.id, s.user_id, s.image, s.created_at, u.name, u.career, u.avatar
    FROM stories s
    JOIN users u ON u.id = s.user_id
    WHERE s.expires_at > ?
    ORDER BY s.created_at DESC
    LIMIT ?
  `).all(now(), storyLimit);

  const activities = db.prepare(`
    SELECT a.id
    FROM activities a
    ORDER BY a.created_at DESC
    LIMIT ?
  `).all(activityLimit).map((row) => getActivity(row.id, userId)).filter(Boolean);

  const unreadNotifications = db.prepare(`
    SELECT COUNT(*) AS count FROM notifications WHERE user_id = ? AND is_read = 0
  `).get(userId).count;

  res.json({
    posts: posts.map(serializePost),
    stories: stories.map(serializeStory),
    activities: activities.map(serializeActivity),
    unreadNotifications,
  });
});

app.post('/api/posts', requireAuth, postRateLimit, (req, res) => {
  const body = cleanText(req.body && req.body.body, 1200);
  const category = POST_CATEGORIES.has(req.body?.category) ? req.body.category : 'General';
  const image = req.body?.image || null;

  if (!body && !image) return validationError(res, 'Escribe algo o toma una foto para publicar.');
  if (!isValidImage(image)) return validationError(res, 'La imagen no es válida o supera 4 MB.');
  const postCount = db.prepare('SELECT COUNT(*) AS count FROM posts WHERE user_id = ?').get(req.user.id).count;
  if (postCount >= 100) return res.status(429).json({ error: 'Alcanzaste el límite de publicaciones. Inténtalo más tarde.' });

  const result = db.prepare(`
    INSERT INTO posts (user_id, body, category, image, created_at)
    VALUES (?, ?, ?, ?, ?)
  `).run(req.user.id, body, category, image, now());
  const post = getPost(result.lastInsertRowid, req.user.id);
  res.status(201).json({ post: serializePost(post) });
});

app.post('/api/posts/:id/like', requireAuth, likeRateLimit, (req, res) => {
  const postId = Number(req.params.id);
  if (!Number.isInteger(postId)) return validationError(res, 'Publicación no válida.');
  const postOwner = db.prepare('SELECT user_id FROM posts WHERE id = ?').get(postId);
  if (!postOwner) return res.status(404).json({ error: 'La publicación ya no existe.' });

  const exists = db.prepare('SELECT 1 FROM post_likes WHERE post_id = ? AND user_id = ?').get(postId, req.user.id);
  if (!exists) {
    db.prepare(`
      INSERT INTO post_likes (post_id, user_id, created_at) VALUES (?, ?, ?)
    `).run(postId, req.user.id, now());
    if (postOwner.user_id !== req.user.id) {
      const message = `${req.user.name} le dio me gusta a tu publicación.`;
      db.prepare('DELETE FROM notifications WHERE user_id = ? AND type = ? AND message = ?')
        .run(postOwner.user_id, 'like', message);
      db.prepare(`INSERT INTO notifications (user_id, type, message, created_at) VALUES (?, 'like', ?, ?)`)
        .run(postOwner.user_id, message, now());
    }
  } else {
    db.prepare('DELETE FROM post_likes WHERE post_id = ? AND user_id = ?').run(postId, req.user.id);
  }

  const post = getPost(postId, req.user.id);
  if (!post) return res.status(404).json({ error: 'La publicación ya no existe.' });
  res.json({ post: serializePost(post) });
});

app.post('/api/activities', requireAuth, activityRateLimit, (req, res) => {
  const title = cleanText(req.body && req.body.title, 120);
  const description = cleanText(req.body && req.body.description, 800);
  const category = ACTIVITY_CATEGORIES.has(req.body?.category) ? req.body.category : 'Ayuda';
  const peopleNeeded = Number(req.body && req.body.peopleNeeded);
  const location = cleanText(req.body && req.body.location, 120) || 'Por definir';
  const eventDate = cleanText(req.body && req.body.eventDate, 40) || null;
  if (eventDate && !isValidDateOnly(eventDate)) return validationError(res, 'La fecha de la actividad no es válida.');

  if (title.length < 4) return validationError(res, 'Ponle un título a la actividad.');
  if (!Number.isInteger(peopleNeeded) || peopleNeeded < 1 || peopleNeeded > 50) {
    return validationError(res, 'Indica cuántas personas necesitas, entre 1 y 50.');
  }
  const activityCount = db.prepare(`
    SELECT COUNT(*) AS count FROM activities WHERE owner_id = ? AND created_at >= ?
  `).get(req.user.id, new Date(Date.now() - 86400000).toISOString()).count;
  if (activityCount >= 20) return res.status(429).json({ error: 'Alcanzaste el límite diario de actividades.' });

  const createActivity = db.transaction(() => {
    const result = db.prepare(`
      INSERT INTO activities
        (owner_id, title, description, category, people_needed, location, event_date, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(req.user.id, title, description, category, peopleNeeded, location, eventDate, now());
    db.prepare(`
      INSERT INTO activity_members (activity_id, user_id, joined_at) VALUES (?, ?, ?)
    `).run(result.lastInsertRowid, req.user.id, now());
    return result.lastInsertRowid;
  });
  const activityId = createActivity();

  const activity = getActivity(activityId, req.user.id);
  res.status(201).json({ activity });
});

app.post('/api/activities/:id/join', requireAuth, joinRateLimit, (req, res) => {
  const activityId = Number(req.params.id);
  if (!Number.isInteger(activityId)) return validationError(res, 'Actividad no válida.');

  const activity = db.prepare('SELECT * FROM activities WHERE id = ?').get(activityId);
  if (!activity) return res.status(404).json({ error: 'La actividad ya no existe.' });

  const toggleMembership = db.transaction(() => {
    const alreadyJoined = db.prepare(`
      SELECT 1 FROM activity_members WHERE activity_id = ? AND user_id = ?
    `).get(activityId, req.user.id);

    if (alreadyJoined) {
      if (activity.owner_id === req.user.id) {
        return { status: 400, error: 'Eres quien creó la actividad; no puedes salir de ella.' };
      }
      db.prepare('DELETE FROM activity_members WHERE activity_id = ? AND user_id = ?').run(activityId, req.user.id);
      return { joined: false };
    }

    const count = db.prepare('SELECT COUNT(*) AS count FROM activity_members WHERE activity_id = ?').get(activityId).count;
    if (count >= 1 + activity.people_needed) {
      return { status: 409, error: 'Esta actividad ya alcanzó el número de participantes.' };
    }

    db.prepare(`
      INSERT INTO activity_members (activity_id, user_id, joined_at) VALUES (?, ?, ?)
    `).run(activityId, req.user.id, now());

    if (activity.owner_id !== req.user.id) {
      const message = `${req.user.name} se conectó a “${activity.title}”.`;
      db.prepare(`
        DELETE FROM notifications
        WHERE user_id = ? AND type = 'activity' AND message = ?
      `).run(activity.owner_id, message);
      db.prepare(`
        INSERT INTO notifications (user_id, type, message, created_at)
        VALUES (?, 'activity', ?, ?)
      `).run(activity.owner_id, message, now());
    }
    return { joined: true };
  });

  let outcome;
  try {
    outcome = toggleMembership.immediate();
  } catch {
    return res.status(409).json({ error: 'La actividad se está actualizando. Inténtalo de nuevo.' });
  }
  if (outcome.error) return res.status(outcome.status).json({ error: outcome.error });

  const updated = getActivity(activityId, req.user.id);
  res.json({ activity: updated });
});

app.post('/api/stories', requireAuth, storyRateLimit, (req, res) => {
  const image = req.body && req.body.image;
  if (!isValidImage(image) || !image) return validationError(res, 'Toma una foto para subir tu historia.');
  const activeStories = db.prepare(`
    SELECT COUNT(*) AS count FROM stories WHERE user_id = ? AND expires_at > ?
  `).get(req.user.id, now()).count;
  if (activeStories >= 5) return res.status(429).json({ error: 'Ya tienes demasiadas historias activas. Espera a que expiren.' });

  const createdAt = now();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  const result = db.prepare(`
    INSERT INTO stories (user_id, image, created_at, expires_at) VALUES (?, ?, ?, ?)
  `).run(req.user.id, image, createdAt, expiresAt);
  const story = db.prepare(`
    SELECT s.id, s.user_id, s.image, s.created_at, u.name, u.career, u.avatar
    FROM stories s JOIN users u ON u.id = s.user_id WHERE s.id = ?
  `).get(result.lastInsertRowid);
  res.status(201).json({ story: serializeStory(story) });
});

app.delete('/api/stories/:id', requireAuth, (req, res) => {
  const result = db.prepare('DELETE FROM stories WHERE id = ? AND user_id = ?').run(Number(req.params.id), req.user.id);
  if (!result.changes) return res.status(404).json({ error: 'La historia no existe.' });
  res.json({ ok: true });
});

app.get('/api/profile', requireAuth, (req, res) => {
  const user = req.user;
  const postCount = db.prepare('SELECT COUNT(*) AS count FROM posts WHERE user_id = ?').get(user.id).count;
  const storyCount = db.prepare(`
    SELECT COUNT(*) AS count FROM stories WHERE user_id = ? AND expires_at > ?
  `).get(user.id, now()).count;
  const activityCount = db.prepare('SELECT COUNT(*) AS count FROM activities WHERE owner_id = ?').get(user.id).count;

  res.json({
    user: publicUser(user),
    stats: { posts: postCount, stories: storyCount, activities: activityCount },
  });
});

app.get('/api/profile/posts', requireAuth, (req, res) => {
  const limit = boundedLimit(req.query.limit, 20, 50);
  const offsetValue = Number.parseInt(req.query.offset, 10);
  const offset = Number.isInteger(offsetValue) && offsetValue > 0 ? Math.min(offsetValue, 10000) : 0;
  const rows = getPostsForUser(req.user.id, req.user.id, limit, offset);
  const total = db.prepare('SELECT COUNT(*) AS count FROM posts WHERE user_id = ?').get(req.user.id).count;
  res.json({
    posts: rows.map(serializePost),
    hasMore: offset + rows.length < total,
    nextOffset: offset + rows.length,
  });
});

app.patch('/api/profile', requireAuth, (req, res) => {
  const name = cleanText(req.body && req.body.name, 80);
  const career = cleanText(req.body && req.body.career, 100) || 'Sin especificar';
  const avatar = req.body && Object.prototype.hasOwnProperty.call(req.body, 'avatar')
    ? (req.body.avatar || null)
    : req.user.avatar;

  if (name.length < 2) return validationError(res, 'El nombre debe tener al menos 2 caracteres.');
  if (!isValidImage(avatar)) return validationError(res, 'La foto no es válida o supera 4 MB.');

  db.prepare('UPDATE users SET name = ?, career = ?, avatar = ? WHERE id = ?')
    .run(name, career, avatar, req.user.id);
  const user = getUserById(req.user.id);
  res.json({ user: publicUser(user) });
});

app.get('/api/notifications', requireAuth, (req, res) => {
  const notifications = db.prepare(`
    SELECT id, type, message, is_read, created_at
    FROM notifications WHERE user_id = ?
    ORDER BY created_at DESC LIMIT 50
  `).all(req.user.id);
  const unreadNotifications = db.prepare(`
    SELECT COUNT(*) AS count FROM notifications WHERE user_id = ? AND is_read = 0
  `).get(req.user.id).count;
  res.json({ notifications: notifications.map(serializeNotification), unreadNotifications });
});

app.post('/api/notifications/read', requireAuth, (req, res) => {
  db.prepare('UPDATE notifications SET is_read = 1 WHERE user_id = ?').run(req.user.id);
  res.json({ ok: true });
});

// Keep the repository files usable as a single Render web service without
// exposing the SQLite file or the Node entry point as public assets.
app.use((req, res, next) => {
  if (/^\/(?:\.git|data|node_modules)(?:\/|$)/i.test(req.path) || /^\/(?:server\.js|package(?:-lock)?\.json|requirements\.txt|\.env)/i.test(req.path)) {
    return res.status(404).end();
  }
  return next();
});

app.use('/api', (req, res) => res.status(404).json({ error: 'Ruta no encontrada.' }));
app.get('/sw.js', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.sendFile(path.join(ROOT, 'sw.js'));
});
app.use(express.static(ROOT, { index: 'index.html' }));
app.get('*', (req, res) => res.sendFile(path.join(ROOT, 'index.html')));

app.use((error, req, res, next) => {
  console.error(error);
  if (res.headersSent) return next(error);
  if (error instanceof SyntaxError && (error.status === 400 || error.type === 'entity.parse.failed')) {
    return res.status(400).json({ error: 'El servidor recibió datos inválidos.' });
  }
  return res.status(500).json({ error: 'Ocurrió un problema en el servidor. Inténtalo de nuevo.' });
});

const cleanupTask = db.transaction(() => {
  const currentTime = now();
  db.prepare('DELETE FROM sessions WHERE expires_at <= ?').run(currentTime);
  db.prepare('DELETE FROM stories WHERE expires_at <= ?').run(currentTime);
  db.prepare('DELETE FROM notifications WHERE created_at <= ?').run(new Date(Date.now() - 90 * 86400000).toISOString());
  for (const [key, bucket] of rateBuckets) {
    if (bucket.resetAt <= Date.now()) rateBuckets.delete(key);
  }
});
function runCleanup() {
  try {
    cleanupTask();
  } catch (error) {
    console.error('No se pudo ejecutar la limpieza periódica:', error.message);
  }
}
runCleanup();
setInterval(runCleanup, 60 * 60 * 1000).unref();

if (require.main === module) {
  app.listen(PORT, HOST, () => {
    console.log(`PRISM escuchando en http://${HOST}:${PORT}`);
  });
}

module.exports = app;
