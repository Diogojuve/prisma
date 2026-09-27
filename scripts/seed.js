'use strict';

const path = require('node:path');
const fs = require('node:fs');
const bcrypt = require('bcryptjs');
const Database = require('better-sqlite3');

const ROOT = path.resolve(__dirname, '..');
const dbPath = path.join(ROOT, 'data', 'prisma.sqlite');
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

async function seed() {
  console.log('Sembrando base de datos SQLite con datos iniciales del campus USMP...');

  const passwordHash = await bcrypt.hash('Prism2026!', 10);
  const now = new Date().toISOString();
  const futureStory = new Date(Date.now() + 24 * 3600 * 1000).toISOString();

  // Usuarios iniciales
  const users = [
    {
      name: 'Carlos Ríos',
      email: 'carlos.rios@usmp.pe',
      career: 'Ingeniería de Sistemas',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&q=80',
    },
    {
      name: 'Haina Rodríguez',
      email: 'haina.rodriguez@usmp.pe',
      career: 'Ingeniería de Sistemas',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&q=80',
    },
    {
      name: 'Carlos Mendoza',
      email: 'carlos.mendoza@usmp.pe',
      career: 'Arquitectura',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80',
    },
    {
      name: 'Sofía Paredes',
      email: 'sofia.paredes@usmp.pe',
      career: 'Psicología',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&q=80',
    },
    {
      name: 'Ana Torres',
      email: 'ana.torres@usmp.pe',
      career: 'Derecho',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&q=80',
    },
  ];

  const insertUser = db.prepare(`
    INSERT OR IGNORE INTO users (name, email, password_hash, career, avatar, created_at)
    VALUES (@name, @email, @hash, @career, @avatar, @now)
  `);

  for (const u of users) {
    insertUser.run({ ...u, hash: passwordHash, now });
  }

  // Obtener IDs
  const carlos = db.prepare('SELECT id FROM users WHERE email = ?').get('carlos.rios@usmp.pe');
  const haina = db.prepare('SELECT id FROM users WHERE email = ?').get('haina.rodriguez@usmp.pe');
  const mendoza = db.prepare('SELECT id FROM users WHERE email = ?').get('carlos.mendoza@usmp.pe');
  const sofia = db.prepare('SELECT id FROM users WHERE email = ?').get('sofia.paredes@usmp.pe');

  // Posts iniciales
  const posts = [
    {
      user_id: haina.id,
      body: '¿Alguien sabe si mañana hay clases? Vi que pusieron algo en el portal pero no entiendo bien 😅',
      category: 'General',
      image: null,
      created_at: new Date(Date.now() - 3600 * 1000).toISOString(),
    },
    {
      user_id: mendoza.id,
      body: 'Acabo de terminar mi maqueta del proyecto final 🏗️ Tres noches sin dormir pero valió totalmente la pena. ¿Quién para un café en el patio?',
      category: 'Académico',
      image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=75',
      created_at: new Date(Date.now() - 7200 * 1000).toISOString(),
    },
    {
      user_id: sofia.id,
      body: '¿Alguien quiere hacer grupo de estudio para el examen del viernes? Nos reunimos en la biblioteca a las 2:00 pm 📚',
      category: 'General',
      image: null,
      created_at: new Date(Date.now() - 10800 * 1000).toISOString(),
    },
  ];

  const insertPost = db.prepare(`
    INSERT INTO posts (user_id, body, category, image, created_at)
    VALUES (@user_id, @body, @category, @image, @created_at)
  `);

  const existingPosts = db.prepare('SELECT COUNT(*) AS c FROM posts').get().c;
  if (existingPosts === 0) {
    for (const p of posts) {
      insertPost.run(p);
    }
  }

  // Historias
  const existingStories = db.prepare('SELECT COUNT(*) AS c FROM stories').get().c;
  if (existingStories === 0) {
    const insertStory = db.prepare(`
      INSERT INTO stories (user_id, image, created_at, expires_at)
      VALUES (?, ?, ?, ?)
    `);
    insertStory.run(haina.id, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80', now, futureStory);
    insertStory.run(mendoza.id, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80', now, futureStory);
  }

  console.log('✅ Base de datos sembrada con éxito.');
}

seed().catch(console.error);
