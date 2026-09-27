'use strict';

// ESTADO GLOBAL DE LA APLICACIÓN
const state = {
  user: {
    name: 'Carlos Ríos',
    career: 'Ingeniería de Sistemas',
    handle: '@carlos.rios',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80',
  },
  activeRoute: 'inicio',
  activeTab: 'Para ti',
  categoryFilter: 'General',
  posts: [
    {
      id: 1,
      author: 'Haina Rodríguez',
      career: 'Ingeniería de Sistemas · hace 1h',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
      category: 'General',
      text: '¿Alguien sabe si mañana hay clases? Vi que pusieron algo en el portal pero no entiendo bien 😅',
      image: null,
      likes: 24,
      liked: false,
      comments: 8,
      pins: 3,
    },
    {
      id: 2,
      author: 'Carlos Mendoza',
      career: 'Arquitectura · hace 2h',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
      category: 'Académico',
      text: 'Acabo de terminar mi maqueta del proyecto final 🏗️ Tres noches sin dormir pero valió totalmente la pena. ¿Quién para un café en el patio?',
      image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=75',
      likes: 72,
      liked: true,
      comments: 15,
      pins: 9,
    },
    {
      id: 3,
      author: 'Sofía Paredes',
      career: 'Psicología · hace 3h',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
      category: 'Eventos',
      text: '¿Alguien quiere hacer grupo de estudio para el examen del viernes? Nos reunimos en la biblioteca a las 2:00 pm 📚',
      image: null,
      likes: 18,
      liked: false,
      comments: 12,
      pins: 2,
    },
  ],
  chats: [
    { u: 'Carlos', t: '¿Alguien está en biblioteca?', h: '10:32', img: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&q=70', me: true },
    { u: 'María', t: 'Yo 👋', h: '10:33', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=70', me: false },
    { u: 'Carlos', t: '¿Está llena?', h: '10:33', img: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&q=70', me: true },
    { u: 'José', t: 'Sí 💀 no queda ni un solo asiento libre', h: '10:34', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=70', me: false },
    { u: 'Ana', t: '¿Mañana hay examen de cálculo?', h: '10:35', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&q=70', me: false },
    { u: 'Carlos', t: 'Sí, a las 8am 😁', h: '10:36', img: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&q=70', me: true },
  ],
  market: [
    { name: 'Calculadora Casio FX-991 LA Plus', price: 'S/ 80', status: 'Usado · Buen estado', loc: 'Carlos R. · Campus Central', img: 'https://images.unsplash.com/photo-1564473185935-58113cba1e80?w=600&q=70', wa: '51987654321' },
    { name: 'Libro de Cálculo Larson 9ed', price: 'S/ 35', status: 'Usado · Regular', loc: 'María S. · Biblioteca', img: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&q=70', wa: '51987654322' },
    { name: 'Teclado Mecánico RGB HyperX', price: 'S/ 120', status: 'Usado · Como nuevo', loc: 'José P. · Ingeniería', img: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=70', wa: '51987654323' },
    { name: 'Polo Universitario USMP Talla S', price: 'S/ 25', status: 'Nuevo', loc: 'Ana T. · Letras', img: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&q=70', wa: '51987654324' },
    { name: 'Tía Veneno & Jugos San Martín', price: 'S/ 10', status: 'Abierto · Menús y jugos', loc: 'A 45m · Frente a puerta 2', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=70', wa: '51987654325' },
    { name: 'Multicopias & Librería Sur', price: 'S/ 0.10', status: 'Abierto · Copias y anillados', loc: 'A 80m · Pabellón B', img: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=70', wa: '51987654326' },
  ],
  notifs: [
    { t: 'María Sánchez dio like a tu publicación.', d: '“¿Alguien sabe si mañana hay clases?”', time: 'hace 5 min', unread: true },
    { t: 'Carlos Mendoza comentó en tu publicación:', d: '“Yo también necesito eso, gracias!”', time: 'hace 12 min', unread: true },
    { t: 'Ana Torres comenzó a seguirte.', d: '', time: 'hace 1h', unread: true },
    { t: 'Tienes un nuevo mensaje de José Paredes.', d: '“¿Vendes la calculadora?”', time: 'hace 2h', unread: false },
    { t: '¡Randomly: Encontraste un nuevo rival!', d: 'Comienza a chatear antes de que expire el tiempo.', time: 'hace 3h', unread: false },
  ],
  randomly: {
    searching: false,
    matched: false,
    timer: 120,
    interval: null,
  },
  pendingImage: null,
};

// ELEMENTOS DOM
const mainView = document.getElementById('main-view');
const toastBox = document.getElementById('toast');
const authModal = document.getElementById('auth-modal');
const rightSidebar = document.getElementById('right-sidebar');

// TOAST HELPER
let toastTimer = null;
function toast(msg) {
  clearTimeout(toastTimer);
  toastBox.textContent = msg;
  toastBox.hidden = false;
  toastTimer = setTimeout(() => { toastBox.hidden = true; }, 3000);
}
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ============================================================================
// WEBSOCKETS EN TIEMPO REAL (SOCKET.IO)
// ============================================================================
let socket = null;
function initWebSocket() {
  if (typeof io !== 'function') {
    console.warn('[WebSockets] Socket.io client no disponible.');
    return;
  }
  if (socket && socket.connected) return;

  socket = io({
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
  });

  socket.on('connect', () => {
    console.log('%c[PRISM WEBSOCKETS] 🟢 Conectado al campus en tiempo real (ID: ' + socket.id + ')', 'color: #00ff88; font-weight: bold;');
    if (state.user && state.user.name) {
      socket.emit('user:identify', state.user);
    }
    socket.emit('chat:get_history');
  });

  socket.on('presence:update', (data) => {
    if (!data) return;
    const onlineEl = document.getElementById('chat-online-count');
    if (onlineEl) {
      onlineEl.textContent = `${data.onlineCount} alumno${data.onlineCount > 1 ? 's' : ''} conectado${data.onlineCount > 1 ? 's' : ''}`;
    }
  });

  socket.on('chat:message', (msg) => {
    const isMe = state.user && (state.user.name === msg.u);
    const item = {
      u: msg.u,
      t: msg.t,
      h: msg.h || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      img: msg.img || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&q=70',
      me: isMe,
    };
    state.chats.push(item);

    if (state.activeRoute === 'chat') {
      const stream = document.getElementById('chat-stream');
      if (stream) {
        const bubble = document.createElement('div');
        bubble.className = `bubble-msg ${isMe ? 'me' : ''}`;
        bubble.innerHTML = `
          ${!isMe ? `<div class="bubble-sender">${escapeHtml(item.u)}</div>` : ''}
          <div>${escapeHtml(item.t)}</div>
          <div class="bubble-time">${item.h}</div>
        `;
        stream.appendChild(bubble);
        stream.scrollTop = stream.scrollHeight;
      }
    } else {
      if (!isMe) {
        toast(`💬 ${item.u}: ${item.t.slice(0, 32)}...`);
      }
    }
  });

  socket.on('chat:history', (messages) => {
    if (Array.isArray(messages) && messages.length > 0) {
      state.chats = messages.map(m => ({
        u: m.u,
        t: m.t,
        h: m.h,
        img: m.img,
        me: state.user && state.user.name === m.u,
      }));
      if (state.activeRoute === 'chat') {
        renderChat();
      }
    }
  });

  socket.on('feed:new_post', (data) => {
    if (!data || !data.post) return;
    const author = data.authorName || 'Un estudiante';
    if (state.user && state.user.name !== author) {
      toast(`📢 [En vivo] ${author} publicó en el campus`);
      fetchFeed();
    }
  });

  socket.on('feed:post_liked', (data) => {
    if (!data) return;
    const p = state.posts.find(item => item.id === data.postId);
    if (p) {
      p.likes = data.likes;
      if (state.activeRoute === 'inicio') renderInicio();
    }
  });

  socket.on('feed:post_deleted', (data) => {
    if (!data) return;
    state.posts = state.posts.filter(item => item.id !== data.postId);
    if (state.activeRoute === 'inicio') renderInicio();
  });
}

// CONSULTA AL FEED CON REDIS CACHE
async function fetchFeed() {
  const t0 = performance.now();
  try {
    const res = await fetch('/api/feed');
    if (!res.ok) return;
    const duration = Math.round(performance.now() - t0);
    const cacheStatus = res.headers.get('x-cache') || 'MISS';
    const cacheProvider = res.headers.get('x-cache-provider') || 'SQLite';
    const feedVer = res.headers.get('x-feed-version') || '1';

    // Logging en consola para demostración al docente
    if (cacheStatus === 'HIT') {
      console.log(`%c[PRISM REDIS] ⚡ X-Cache: HIT | ${cacheProvider} (${duration}ms) | v${feedVer}`, 'color: #00ff88; font-weight: bold; background: #18050e; padding: 2px 6px; border-radius: 4px;');
    } else {
      console.log(`%c[PRISM REDIS] 🔄 X-Cache: MISS | ${cacheProvider} (${duration}ms) -> Guardado en Upstash`, 'color: #ff9900; font-weight: bold; background: #18050e; padding: 2px 6px; border-radius: 4px;');
    }

    // Actualizar badge de monitoreo en la interfaz
    const badge = document.getElementById('redis-cache-hits');
    const latSpan = document.getElementById('redis-latency');
    if (badge) {
      badge.textContent = cacheStatus;
      badge.style.color = cacheStatus === 'HIT' ? '#00ff88' : '#ff9900';
    }
    if (latSpan) latSpan.textContent = `${duration}ms`;

    const data = await res.json();
    if (data && Array.isArray(data.posts) && data.posts.length > 0) {
      state.posts = data.posts.map(p => ({
        id: p.id,
        author: p.author ? p.author.name : 'Estudiante USMP',
        career: p.author ? `${p.author.career} · hace poco` : 'USMP Filial Sur',
        avatar: p.author && p.author.avatar ? p.author.avatar : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80',
        category: p.category || 'General',
        text: p.body,
        image: p.image,
        likes: p.likes || 0,
        liked: Boolean(p.liked),
        comments: 0,
        pins: 0,
      }));
      renderInicio();
    }
  } catch (err) {
    console.warn('[Feed Fetch]', err);
  }
}
window.fetchFeed = fetchFeed;

// AUTENTICACIÓN
async function initSession() {
  try {
    const res = await fetch('/api/me');
    const data = await res.json();
    if (data && data.user) {
      state.user = {
        name: data.user.name,
        career: data.user.career || 'USMP Arequipa',
        handle: '@' + data.user.name.toLowerCase().replace(/\s+/g, '.'),
        avatar: data.user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80',
      };
      updateSidebarUser();
    }

    // Comprobar si hay Temp Data / Flash messages
    try {
      const tempRes = await fetch('/api/temp-data');
      const tempData = await tempRes.json();
      if (tempData && tempData.flash) {
        toast(`✨ ${tempData.flash.message}`);
      }
    } catch {}

    // Cargar feed real desde el backend
    await fetchFeed();

    // Inicializar WebSockets para chat y presencia en tiempo real
    initWebSocket();
  } catch {}
  updateSidebarUser();
  handleNavigation();
}

function updateSidebarUser() {
  document.getElementById('sidebar-user-name').textContent = state.user.name;
  document.getElementById('sidebar-user-handle').textContent = state.user.handle;
  document.getElementById('sidebar-avatar-img').src = state.user.avatar;
  const count = state.notifs.filter(n => n.unread).length;
  const badge = document.getElementById('badge-notif');
  if (badge) badge.textContent = count;
}

window.toggleUserMenu = function() {
  if (confirm(`¿Cerrar sesión de ${state.user.name}?`)) {
    fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
    authModal.hidden = false;
  }
};

window.setAuthMode = function(mode) {
  const isLogin = mode === 'login';
  document.getElementById('tab-login').classList.toggle('is-active', isLogin);
  document.getElementById('tab-register').classList.toggle('is-active', !isLogin);
  document.getElementById('form-login').hidden = !isLogin;
  document.getElementById('form-register').hidden = isLogin;
};

window.handleLogin = async function(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const errBox = document.getElementById('login-error');
  errBox.hidden = true;

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Credenciales inválidas');
    state.user = {
      name: data.user.name,
      career: data.user.career || 'USMP Arequipa',
      handle: '@' + data.user.name.toLowerCase().replace(/\s+/g, '.'),
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80',
    };
    updateSidebarUser();
    authModal.hidden = true;
    toast(`🎉 Bienvenido al campus, ${data.user.name}!`);
    handleNavigation();
  } catch (err) {
    errBox.textContent = err.message;
    errBox.hidden = false;
  }
};

window.handleRegister = async function(e) {
  e.preventDefault();
  const name = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const career = document.getElementById('reg-career').value;
  const password = document.getElementById('reg-password').value;
  const confirmPassword = document.getElementById('reg-confirm').value;
  const errBox = document.getElementById('reg-error');
  errBox.hidden = true;

  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, career, password, confirmPassword }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al registrarte');
    state.user = {
      name: data.user.name,
      career: data.user.career,
      handle: '@' + data.user.name.toLowerCase().replace(/\s+/g, '.'),
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80',
    };
    updateSidebarUser();
    authModal.hidden = true;
    toast(`✅ Cuenta creada con éxito para ${data.user.name}!`);
    handleNavigation();
  } catch (err) {
    errBox.textContent = err.message;
    errBox.hidden = false;
  }
};

// NAVEGACIÓN Y RUTAS
function syncNav(route) {
  state.activeRoute = route;
  document.querySelectorAll('[data-route]').forEach(el => {
    el.classList.toggle('is-active', el.dataset.route === route);
  });
}

function handleNavigation() {
  const hash = window.location.hash.replace(/^#\/?/, '').split('?')[0] || 'inicio';
  syncNav(hash);

  if (hash === 'chat') {
    rightSidebar.style.display = 'none';
    renderChat();
  } else if (hash === 'randomly') {
    rightSidebar.style.display = 'none';
    renderRandomly();
  } else if (hash === 'market') {
    rightSidebar.style.display = 'none';
    renderMarket();
  } else if (hash === 'notif') {
    rightSidebar.style.display = 'none';
    renderNotif();
  } else if (hash === 'perfil') {
    rightSidebar.style.display = 'none';
    renderPerfil();
  } else {
    rightSidebar.style.display = 'flex';
    renderInicio();
  }
}
window.addEventListener('hashchange', handleNavigation);

// ==========================================================================
// 1. VISTA INICIO (EXACTA AL FIGMA)
// ==========================================================================
function renderInicio() {
  const categories = ['General', 'Académico', 'Eventos', 'Confesiones', 'Marketplace'];
  const filteredPosts = state.categoryFilter === 'Todos' ? state.posts : state.posts.filter(p => p.category === state.categoryFilter || state.categoryFilter === 'General');

  mainView.innerHTML = `
    <!-- 1. HISTORIAS -->
    <section class="ui-card stories-card">
      <div class="stories-row">
        <!-- TU HISTORIA -->
        <div class="story-capsule" onclick="document.getElementById('story-file-input').click()">
          <div class="story-circle add-circle">+</div>
          <span class="story-label">Tu historia</span>
        </div>
        <!-- HISTORIAS DE AMIGOS -->
        <div class="story-capsule" onclick="toast('📸 Viendo historia de María')">
          <div class="story-circle avatar-circle">
            <img class="story-img" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80" alt="María" />
          </div>
          <span class="story-label">María</span>
        </div>
        <div class="story-capsule" onclick="toast('📸 Viendo historia de José')">
          <div class="story-circle avatar-circle">
            <img class="story-img" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" alt="José" />
          </div>
          <span class="story-label">José</span>
        </div>
        <div class="story-capsule" onclick="toast('📸 Viendo historia de Ana')">
          <div class="story-circle avatar-circle">
            <img class="story-img" src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80" alt="Ana" />
          </div>
          <span class="story-label">Ana</span>
        </div>
        <div class="story-capsule" onclick="toast('📸 Viendo historia de Luis')">
          <div class="story-circle avatar-circle">
            <img class="story-img" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80" alt="Luis" />
          </div>
          <span class="story-label">Luis</span>
        </div>
      </div>
    </section>

    <!-- 2. COMPOSITOR DE PUBLICACIONES -->
    <section class="ui-card composer-card">
      <div class="composer-top-row">
        <img class="composer-avatar" src="${state.user.avatar}" alt="${state.user.name}" />
        <input id="post-input-text" class="composer-input-field" placeholder="¿Qué está pasando en el campus?" onkeydown="if(event.key==='Enter') publishNewPost()" />
      </div>
      <div id="image-preview-container" style="display:none;margin-top:12px;position:relative;">
        <img id="image-preview-element" src="" style="max-height:160px;border-radius:14px;border:1px solid rgba(255,255,255,0.1);" alt="Preview" />
        <button style="position:absolute;top:6px;left:6px;background:#0009;color:#fff;border-radius:50%;width:24px;height:24px;" onclick="cancelImage()">×</button>
      </div>
      <div class="composer-bottom-row">
        <button class="pill-action-btn" type="button" onclick="document.getElementById('post-file-input').click()">
          <span>📷</span> <span>Foto</span>
        </button>
        <button class="pill-action-btn" type="button" onclick="toast('🎥 Función de video habilitada para versión móvil')">
          <span>🎥</span> <span>Video</span>
        </button>
        <button class="pill-action-btn" type="button" onclick="toast('😀 Elige tu sticker o GIF favorito')">
          <span>😀</span> <span>GIF</span>
        </button>
        <span style="flex:1;"></span>
        <button class="btn-pink" type="button" onclick="publishNewPost()">Publicar</button>
      </div>
    </section>

    <!-- 3. SWITCHER "PARA TI" / "SIGUIENDO" -->
    <div class="feed-tabs-switcher">
      <div class="switcher-tab ${state.activeTab === 'Para ti' ? 'is-active' : ''}" onclick="switchFeedTab('Para ti')">Para ti</div>
      <div class="switcher-tab ${state.activeTab === 'Siguiendo' ? 'is-active' : ''}" onclick="switchFeedTab('Siguiendo')">Siguiendo</div>
    </div>

    <!-- 4. FILTROS DE CATEGORÍAS -->
    <div class="category-filter-row">
      ${categories.map(c => `
        <div class="category-pill ${state.categoryFilter === c ? 'is-active' : ''}" onclick="filterCategory('${c}')">${c}</div>
      `).join('')}
    </div>

    <!-- 5. STREAM DE PUBLICACIONES -->
    <div class="post-stream">
      ${filteredPosts.map(p => `
        <article class="post-box" id="post-${p.id}">
          <header class="post-head-row">
            <img class="author-avatar" src="${p.avatar}" alt="${p.author}" />
            <div class="author-meta">
              <div class="author-name">${p.author}</div>
              <div class="author-career-time">${p.career}</div>
            </div>
            <span class="category-badge-post">${p.category}</span>
            <span class="post-menu-dots">···</span>
          </header>
          <div class="post-content-text">${p.text}</div>
          ${p.image ? `<div class="post-image-attachment"><img src="${p.image}" alt="Post image" /></div>` : ''}
          <footer class="post-action-row">
            <button class="action-pill ${p.liked ? 'is-liked' : ''}" onclick="toggleLike(${p.id})">
              <span>${p.liked ? '❤️' : '🤍'}</span> <span>${p.likes}</span>
            </button>
            <button class="action-pill" onclick="toast('💬 8 comentarios en este post')">
              <span>💬</span> <span>${p.comments}</span>
            </button>
            <button class="action-pill" onclick="toast('📌 Publicación guardada')">
              <span>📌</span> <span>${p.pins}</span>
            </button>
            <button class="btn-share-corner" onclick="sharePost('${p.author}')" title="Compartir">↗</button>
          </footer>
        </article>
      `).join('')}
    </div>
  `;
}

window.switchFeedTab = function(tab) {
  state.activeTab = tab;
  renderInicio();
};

window.filterCategory = function(cat) {
  state.categoryFilter = cat;
  renderInicio();
};

window.filterByTag = function(tag) {
  toast(`Filtrando feed por #${tag}`);
  state.categoryFilter = 'Académico';
  renderInicio();
};

window.toggleLike = async function(id) {
  const p = state.posts.find(item => item.id === id);
  if (!p) return;
  p.liked = !p.liked;
  p.likes += p.liked ? 1 : -1;
  renderInicio();

  try {
    await fetch(`/api/posts/${id}/like`, { method: 'POST' });
  } catch {}
};

window.sharePost = function(author) {
  toast(`📋 Enlace copiado: post de ${author}`);
};

window.deletePost = async function(id) {
  if (!confirm('¿Deseas eliminar esta publicación?')) return;
  try {
    const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
    if (res.ok) {
      state.posts = state.posts.filter(p => p.id !== id);
      toast('🗑️ Publicación eliminada (Caché Redis invalidado)');
      renderInicio();
    }
  } catch {}
};

window.publishNewPost = async function() {
  const input = document.getElementById('post-input-text');
  if (!input || !input.value.trim()) {
    toast('⚠️ Escribe algo antes de publicar.');
    return;
  }
  const text = input.value.trim();
  const image = state.pendingImage;

  try {
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body: text, category: state.categoryFilter || 'General', image }),
    });
    if (res.ok) {
      input.value = '';
      cancelImage();
      toast('🎉 ¡Publicado con éxito! (Caché invalidado)');
      await fetchFeed();
      return;
    }
  } catch {}

  state.posts.unshift({
    id: Date.now(),
    author: state.user.name,
    career: state.user.career + ' · ahora',
    avatar: state.user.avatar,
    category: state.categoryFilter || 'General',
    text,
    image,
    likes: 0,
    liked: false,
    comments: 0,
    pins: 0,
  });

  input.value = '';
  cancelImage();
  toast('🎉 ¡Publicado con éxito en el campus!');
  renderInicio();
};

// MANEJO DE IMÁGENES
const fileInput = document.getElementById('post-file-input');
if (fileInput) {
  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      state.pendingImage = reader.result;
      const previewCont = document.getElementById('image-preview-container');
      const previewImg = document.getElementById('image-preview-element');
      if (previewCont && previewImg) {
        previewImg.src = state.pendingImage;
        previewCont.style.display = 'block';
      }
    };
    reader.readAsDataURL(file);
  });
}

window.cancelImage = function() {
  state.pendingImage = null;
  const previewCont = document.getElementById('image-preview-container');
  if (previewCont) previewCont.style.display = 'none';
};

const storyInput = document.getElementById('story-file-input');
if (storyInput) {
  storyInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    toast('📸 ¡Historia de 24 horas subida con éxito!');
  });
}

// ==========================================================================
// 2. VISTA CHAT GLOBAL
// ==========================================================================
function renderChat() {
  mainView.innerHTML = `
    <div class="chat-container-ui">
      <div class="ui-card" style="display:flex;align-items:center;justify-content:space-between;padding:14px 20px;">
        <div>
          <h2 style="font-size:20px;font-weight:800;margin:0;">💬 Chat Global USMP</h2>
          <small style="color:var(--text-muted);"><span class="green-dot"></span> <span id="chat-online-count">Conectado en vivo</span> — Filial Sur Arequipa</small>
        </div>
        <div style="display:flex;gap:8px;">
          <span class="category-pill is-active">🌍 Global</span>
          <span class="category-pill" onclick="toast('Canales por facultad disponibles en la siguiente fase')">🏫 Mi Carrera</span>
        </div>
      </div>

      <div class="ui-card chat-stream-box" id="chat-stream">
        ${state.chats.map(c => `
          <div class="bubble-msg ${c.me ? 'me' : ''}">
            ${!c.me ? `<div class="bubble-sender">${escapeHtml(c.u)}</div>` : ''}
            <div>${escapeHtml(c.t)}</div>
            <div class="bubble-time">${c.h}</div>
          </div>
        `).join('')}
      </div>

      <div style="display:flex;gap:10px;align-items:center;">
        <input id="chat-msg-input" class="composer-input-field" placeholder="Escribe un mensaje para todo el campus..." onkeydown="if(event.key==='Enter') sendChat()" />
        <button class="btn-pink" onclick="sendChat()">Enviar →</button>
      </div>
    </div>
  `;
  const stream = document.getElementById('chat-stream');
  if (stream) stream.scrollTop = stream.scrollHeight;
}

window.sendChat = function() {
  const input = document.getElementById('chat-msg-input');
  if (!input || !input.value.trim()) return;
  const text = input.value.trim();
  input.value = '';

  if (socket && socket.connected) {
    socket.emit('chat:send', { text, user: state.user });
  } else {
    state.chats.push({
      u: state.user.name,
      t: text,
      h: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      me: true,
    });
    renderChat();
  }
};

// ==========================================================================
// 3. VISTA RANDOMLY
// ==========================================================================
function renderRandomly() {
  const r = state.randomly;
  mainView.innerHTML = `
    <div class="ui-card randomly-arena-box">
      <div style="font-size:56px;margin-bottom:8px;">🎲</div>
      <h2 style="font-size:28px;font-weight:900;">Randomly USMP</h2>
      <p style="color:var(--text-muted);font-size:14px;margin-top:6px;">Conoce a alguien del campus que está conectado ahora mismo.<br/>Responde dentro de 2 minutos o pierdes el duelo.</p>

      ${r.matched ? `
        <div style="background:rgba(255,46,99,0.15);border:1px solid var(--pink);border-radius:18px;padding:16px;margin:18px 0;">
          <strong style="color:var(--pink);font-size:16px;">¡Rival Encontrado: Ana Torres (Arquitectura)!</strong>
          <div class="timer-countdown">${formatTimer(r.timer)}</div>
          <div style="display:flex;gap:10px;margin-top:12px;">
            <input id="randomly-input" class="composer-input-field" placeholder="Escribe para reiniciar el contador..." />
            <button class="btn-pink" onclick="toast('⏱️ Reloj de 2 minutos reiniciado'); state.randomly.timer = 120; renderRandomly();">Enviar</button>
          </div>
          <button class="pill-action-btn" style="margin-top:14px;" onclick="quitRandomly()">Rendirse / Salir</button>
        </div>
      ` : r.searching ? `
        <div style="padding:28px 0;">
          <div style="font-size:40px;animation:spin 1.5s linear infinite;display:inline-block;">🔎</div>
          <h3 style="margin-top:12px;">Buscando rival en el campus...</h3>
          <p style="color:var(--text-muted);font-size:13px;">Explorando entre los 247 alumnos en línea.</p>
        </div>
      ` : `
        <div class="ui-card" style="background:rgba(255,46,99,0.1);border-color:rgba(255,46,99,0.2);margin:18px auto;max-width:320px;">
          👥 <strong style="color:var(--pink);font-size:20px;">247</strong> personas online
        </div>
        <div style="text-align:left;max-width:320px;margin:0 auto 18px;background:var(--card-inner);padding:14px;border-radius:14px;">
          <strong style="display:block;font-size:12px;color:var(--text-muted);margin-bottom:8px;">PREFERENCIAS:</strong>
          <label style="display:block;font-size:13px;margin-bottom:6px;"><input type="radio" checked /> Cualquier estudiante</label>
          <label style="display:block;font-size:13px;margin-bottom:6px;"><input type="radio" /> Mi universidad (USMP)</label>
          <label style="display:block;font-size:13px;"><input type="radio" /> Mi carrera (${state.user.career})</label>
        </div>
        <button class="btn-pink btn-block" style="padding:14px;font-size:16px;max-width:320px;margin:0 auto;" onclick="startRandomly()">ENCONTRAR MATCH 🎲</button>
      `}

      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:24px;border-top:1px solid rgba(255,255,255,0.06);padding-top:16px;">
        <div><strong style="color:var(--pink);font-size:20px;">3</strong><br/><small style="color:var(--text-muted);">Victorias</small></div>
        <div><strong style="font-size:20px;">1</strong><br/><small style="color:var(--text-muted);">Derrotas</small></div>
        <div><strong style="color:var(--green);font-size:20px;">3</strong><br/><small style="color:var(--text-muted);">Racha</small></div>
      </div>
    </div>
  `;
}

function formatTimer(s) {
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return `${m}:${rem < 10 ? '0' : ''}${rem}`;
}

window.startRandomly = function() {
  state.randomly.searching = true;
  renderRandomly();
  setTimeout(() => {
    state.randomly.searching = false;
    state.randomly.matched = true;
    state.randomly.timer = 120;
    renderRandomly();
  }, 1200);
};

window.quitRandomly = function() {
  state.randomly.matched = false;
  state.randomly.searching = false;
  toast('Saliste del duelo de Randomly');
  renderRandomly();
};

// ==========================================================================
// 4. VISTA MARKET
// ==========================================================================
function renderMarket() {
  mainView.innerHTML = `
    <div class="view-title-header">
      <h2>🛒 PRISM Market & Negocios</h2>
      <p>Compra, venta y tiendas cercanas a la USMP Filial Sur Arequipa</p>
    </div>
    <div style="margin-bottom:16px;">
      <input class="composer-input-field" style="width:100%;" placeholder="🔍 Buscar productos, libros, fotocopias, menús..." oninput="toast('Buscando productos...')" />
    </div>
    <div class="market-catalog-grid">
      ${state.market.map(m => `
        <div class="market-item-card">
          <img class="market-item-img" src="${m.img}" alt="${m.name}" />
          <div class="market-item-body">
            <span style="font-size:10px;background:#0008;padding:2px 8px;border-radius:10px;align-self:flex-start;color:var(--text-muted);">${m.status}</span>
            <div class="market-item-price">${m.price}</div>
            <div class="market-item-title">${m.name}</div>
            <div class="market-item-dist">📍 ${m.loc}</div>
            <a href="https://wa.me/${m.wa}?text=Hola,%20te%20contacto%20desde%20PRISM%20USMP" target="_blank" rel="noopener" class="market-btn-wa-link">
              💬 Pedir por WhatsApp
            </a>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// ==========================================================================
// 5. VISTA NOTIFICACIONES
// ==========================================================================
function renderNotif() {
  mainView.innerHTML = `
    <div class="view-title-header" style="display:flex;align-items:center;justify-content:space-between;">
      <div>
        <h2>🔔 Notificaciones</h2>
        <p>${state.notifs.filter(n => n.unread).length} avisos sin leer</p>
      </div>
      <button class="pill-action-btn" onclick="state.notifs.forEach(n=>n.unread=false); renderNotif(); toast('Notificaciones leídas');">Marcar todo como leído</button>
    </div>
    <div style="display:flex;flex-direction:column;gap:12px;">
      ${state.notifs.map(n => `
        <div class="ui-card" style="border-left:4px solid ${n.unread ? 'var(--pink)' : 'transparent'};">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <strong>${n.t}</strong>
            <small style="color:var(--pink);font-weight:700;">${n.time}</small>
          </div>
          ${n.d ? `<p style="color:var(--text-muted);margin-top:4px;font-size:13px;">${n.d}</p>` : ''}
        </div>
      `).join('')}
    </div>
  `;
}

// ==========================================================================
// 6. VISTA PERFIL
// ==========================================================================
function renderPerfil() {
  mainView.innerHTML = `
    <div class="ui-card" style="padding:0;overflow:hidden;">
      <div style="height:140px;background:linear-gradient(90deg, #3d0c20, #19050e);"></div>
      <div style="padding:0 24px 24px;margin-top:-40px;">
        <div style="display:flex;justify-content:space-between;align-items:flex-end;">
          <img src="${state.user.avatar}" style="width:84px;height:84px;border-radius:50%;border:3px solid var(--pink);box-shadow:var(--pink-glow);" alt="${state.user.name}" />
          <button class="pill-action-btn" onclick="toggleUserMenu()">⏻ Salir</button>
        </div>
        <div style="margin-top:14px;">
          <h2 style="font-size:24px;font-weight:800;margin:0;">${state.user.name}</h2>
          <small style="color:var(--text-muted);font-size:13px;">${state.user.handle} · ${state.user.career}</small>
          <p style="margin:10px 0 0;font-size:14px;color:#e8d8de;">Estudiante de Ingeniería de Sistemas 💻 · 5° ciclo<br/>Amante del código, la música y el buen café ☕</p>
          <small style="color:var(--text-muted);display:block;margin-top:6px;">🏫 USMP Filial Sur Arequipa · 📅 Ingresó en 2022</small>
        </div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);text-align:center;margin-top:18px;background:var(--card-inner);border-radius:14px;padding:12px;">
          <div><strong style="font-size:18px;">127</strong><br/><small style="color:var(--text-muted);">Seguidores</small></div>
          <div><strong style="font-size:18px;">83</strong><br/><small style="color:var(--text-muted);">Siguiendo</small></div>
          <div><strong style="font-size:18px;">24</strong><br/><small style="color:var(--text-muted);">Posts</small></div>
        </div>
      </div>
    </div>
  `;
}

// INICIO AUTOMÁTICO
initSession();
