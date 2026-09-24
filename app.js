const view = document.getElementById('view');
const state = {
  filter: 'General',
  tab: 'Para ti',
  marketCat: 'Todos',
  notifFilter: 'Todo',
  notifs: [
    {t:'María Sánchez dio like a tu publicación.', d:'“¿Alguien sabe si mañana hay clases?”', time:'hace 5 min', unread:true},
    {t:'Carlos Mendoza comentó en tu publicación:', d:'“Yo también necesito eso, gracias!”', time:'hace 12 min', unread:true},
    {t:'Ana Torres comenzó a seguirte.', d:'', time:'hace 1h', unread:true},
    {t:'Tienes un nuevo mensaje de José Paredes.', d:'“¿Vendes la calculadora?”', time:'hace 2h', unread:false},
    {t:'¡Randomly: Encontraste un nuevo rival!', d:'Comienza a chatear antes de que el tiempo expire.', time:'hace 3h', unread:false},
    {t:'Sofía Lima está interesada en tu Calculadora Casio.', d:'', time:'hace 5h', unread:false},
  ],
  posts: [
    {name:'Haina Rodríguez', info:'Ingeniería de Sistemas · hace 1h', cat:'General', text:'¿Alguien sabe si mañana hay clases? Vi que pusieron algo en el portal pero no entiendo bien 😅', likes:24, comments:8, shares:3},
    {name:'Carlos Mendoza', info:'Arquitectura · 4° ciclo · hace 2h', cat:'Académico', text:'Acabo de terminar mi maqueta del proyecto final 🏗 Tres noches sin dormir pero valió la pena.', likes:72, comments:15, shares:9},
    {name:'Sofía Paredes', info:'Psicología · 3° ciclo · hace 3h', cat:'Eventos', text:'¿Alguien quiere hacer grupo de estudio para el examen del viernes? Biblioteca 2pm 📚', likes:18, comments:12, shares:2},
  ],
  products: [
    {n:'Calculadora Casio FX-991', p:'S/ 80', e:'Usado · Buen estado', u:'Carlos R. · Campus Central', img:'https://images.unsplash.com/photo-1564473185935-58113cba1e80?w=600&q=60'},
    {n:'Libro de Cálculo Larson 9ed', p:'S/ 35', e:'Usado · Regular', u:'María S. · Biblioteca', img:'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&q=60'},
    {n:'Teclado Mecánico RGB HyperX', p:'S/ 120', e:'Usado · Como nuevo', u:'José P. · Ingeniería', img:'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=60'},
    {n:'Polo universitario USMP S', p:'S/ 25', e:'Nuevo', u:'Ana T. · Letras', img:'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&q=60'},
    {n:'Control PS5 DualSense', p:'S/ 180', e:'Usado · Buen estado', u:'Luis V. · Residencia', img:'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&q=60'},
    {n:'Libro Algoritmos Cormen', p:'S/ 45', e:'Usado · Regular', u:'Sofía L. · Sistemas', img:'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&q=60'},
  ],
  chats: [
    {u:'Carlos', t:'¿Alguien está en biblioteca?', h:'10:32', img:'https://i.pravatar.cc/60?img=12'},
    {u:'María', t:'Yo 👋', h:'10:33', img:'https://i.pravatar.cc/60?img=47'},
    {u:'Carlos', t:'¿Está llena?', h:'10:33', img:'https://i.pravatar.cc/60?img=12'},
    {u:'José', t:'Sí 💀 no queda ni un asiento', h:'10:34', img:'https://i.pravatar.cc/60?img=53'},
    {u:'Ana', t:'¿Mañana hay examen de cálculo?', h:'10:35', img:'https://i.pravatar.cc/60?img=44'},
    {u:'Sofía', t:'Gracias por el aviso 🙏', h:'10:37', img:'https://i.pravatar.cc/60?img=45'},
  ]
};

function setActive(){
  document.querySelectorAll('[data-route]').forEach(a=>{
    a.classList.toggle('active', '#/'+a.dataset.route === location.hash || (location.hash==='' && a.dataset.route==='inicio'));
  });
  const unread = state.notifs.filter(n=>n.unread).length;
  const b = document.getElementById('nav-badge'); if(b) b.textContent = unread;
}

function layoutInicio(){
  const cats = ['General','Académico','Eventos','Confesiones','Marketplace'];
  const posts = state.posts.filter(p=>state.filter==='General'?true:p.cat===state.filter || state.filter==='General');
  return `<div class="grid-3"><div>
    <div class="card"><div class="stories">
      <div class="story add"><div>+</div>Tu historia</div>
      ${['María-47','José-53','Ana-44','Luis-59'].map(s=>{const[n,i]=s.split('-');return `<div class="story"><img src="https://i.pravatar.cc/80?img=${i}"/>${n}</div>`}).join('')}
    </div></div>
    <div class="card composer" style="margin-top:14px">
      <div class="row"><img src="https://i.pravatar.cc/60?img=12" style="width:40px;border-radius:50%"/><input id="composer" placeholder="¿Qué está pasando en el campus?" /></div>
      <div class="row" style="margin-top:10px"><button class="pill">📷 Foto</button><button class="pill">🎥 Video</button><button class="pill">😀 GIF</button><span style="flex:1"></span><button class="btn" onclick="publish()">Publicar</button></div>
    </div>
    <div class="tabs" style="margin-top:14px"><button class="${state.tab==='Para ti'?'active':''}" onclick="setTab('Para ti')">Para ti</button><button class="${state.tab==='Siguiendo'?'active':''}" onclick="setTab('Siguiendo')">Siguiendo</button></div>
    <div class="row" style="margin-top:10px;flex-wrap:wrap">${cats.map(c=>`<button class="pill ${state.filter===c?'active':''}" onclick="setFilter('${c}')">${c}</button>`).join('')}</div>
    ${posts.map((p,i)=>`<div class="card post"><div class="meta"><img src="https://i.pravatar.cc/60?img=${20+i*5}"/><div><b>${p.name}</b><div style="color:var(--mut);font-size:12px">${p.info}</div></div><span class="tag">${p.cat}</span></div><p>${p.text}</p><div class="actions"><button class="pill" onclick="like(${i})">🤍 ${p.likes}</button><button class="pill">💬 ${p.comments}</button><button class="pill">📌 ${p.shares}</button></div></div>`).join('')}
  </div><div class="right">
    <div class="card"><b><span class="dot"></span>247 conectados</b>
      ${[['María Sánchez','Medicina',47],['José Paredes','Derecho',53],['Ana Torres','Arquitectura',44],['Luis Vega','Ingeniería Civil',59],['Sofía Lima','Psicología',45]].map(x=>`<div class="person"><img src="https://i.pravatar.cc/60?img=${x[2]}"/><div><b>${x[0]}</b><small>${x[1]}</small></div></div>`).join('')}
    </div>
    <div class="card"><b>Tendencias</b><div style="margin-top:8px;display:grid;gap:8px"><div><span class="trend">#ExamenesFinales</span> <small style="float:right;color:var(--mut)">142 posts</small></div><div><span class="trend">#ProyectoGrupal</span> <small style="float:right;color:var(--mut)">89 posts</small></div><div><span class="trend">#FeriadoUniversitario</span> <small style="float:right;color:var(--mut)">74 posts</small></div><div><span class="trend">#NuevosCursos</span> <small style="float:right;color:var(--mut)">61 posts</small></div></div></div>
    <div class="card" style="text-align:center"><div style="font-size:32px">🎲</div><b>¿Conoces a alguien nuevo?</b><p style="color:var(--mut)">Randomly conecta contigo al instante</p><a href="#/randomly" class="btn" style="display:block;text-decoration:none">Jugar ahora</a></div>
  </div></div>`;
}

function layoutChat(){
  return `<div class="card"><div class="row"><button class="pill active">🌍 Global</button><button class="pill">💬 Privados</button></div><h3 style="margin:12px 0 0">Chat Global</h3><small style="color:var(--mut)">• 247 conectados — USMP Arequipa</small></div>
  <div class="card chatbox" style="margin-top:12px" id="chatlist">
    ${state.chats.map(c=>`<div><b style="color:var(--acc2);font-size:12px">${c.u}</b><div class="row" style="align-items:flex-end"><img src="${c.img}" style="width:32px;border-radius:50%"/><div class="bubble">${c.t}</div><small style="color:var(--mut)">${c.h}</small></div></div>`).join('')}
    <div class="bubble me">Sí, a las 8am 😁</div>
  </div>
  <div class="row" style="margin-top:12px"><input id="chatinput" class="search" style="margin:0" placeholder="Escribe un mensaje..."/><button class="btn" onclick="sendChat()">→</button></div>`;
}

function layoutRandom(){
  return `<div style="max-width:520px;margin:0 auto"><div class="card" style="text-align:center;padding:32px">
    <div style="font-size:56px">🎲</div><h1>Randomly</h1><p style="color:var(--mut)">Conoce a alguien que está conectado ahora mismo.<br/>Responde dentro de 2 minutos o pierdes.</p>
    <div class="card" style="background:rgba(255,46,99,.12)">👥 <b style="color:var(--acc2);font-size:22px">247</b> personas online</div>
    <div style="text-align:left;margin-top:14px;color:var(--mut)">Preferencias:<br/>
    <label><input type="radio" checked/> Cualquier persona</label><br/><label><input type="radio"/> Mi universidad (USMP)</label><br/><label><input type="radio"/> Mi carrera</label></div>
    <button class="btn" style="width:100%;margin-top:16px" onclick="findRandom()">ENCONTRAR</button>
    <div id="rmsg" style="margin-top:10px;color:var(--acc2)"></div>
    <div class="stats"><div><b style="color:var(--acc2)">3</b><br/><small>Victorias</small></div><div><b>1</b><br/><small>Derrotas</small></div><div><b style="color:var(--green)">3</b><br/><small>Racha</small></div></div>
  </div></div>`;
}

function layoutMarket(){
  const cats=['Todos','📚 Libros','💻 Tecnología','🎓 Universidad','👕 Ropa','🎮 Gaming','🖊 Otros'];
  return `<div class="row"><div><h2 style="margin:0">PRISM Market</h2><small style="color:var(--mut)">Compra y vende dentro de la comunidad USMP Arequipa</small></div><span style="flex:1"></span><button class="btn">+ Vender</button></div>
  <input class="search" placeholder="🔍 Buscar productos..." oninput="searchM(this.value)"/>
  <div class="row" style="flex-wrap:wrap">${cats.map(c=>`<button class="pill ${state.marketCat===c?'active':''}" onclick="setCat('${c}')">${c}</button>`).join('')}</div>
  <div class="market-grid" style="margin-top:14px" id="mgrid">${state.products.map(p=>`<div class="card prod"><img loading="lazy" src="${p.img}"/><div class="p"><small style="background:#0008;padding:2px 8px;border-radius:99px">${p.e}</small><div class="price">${p.p}</div><b>${p.n}</b><div style="color:var(--mut);font-size:12px">${p.u}</div></div></div>`).join('')}</div>`;
}

function layoutNotif(){
  const fs=['Todo','Social','Mensajes','Randomly','Marketplace'];
  return `<h2 style="margin:0">Notificaciones</h2><small style="color:var(--mut)">${state.notifs.filter(n=>n.unread).length} sin leer</small>
  <div class="row" style="margin:12px 0;flex-wrap:wrap">${fs.map(f=>`<button class="pill ${state.notifFilter===f?'active':''}" onclick="setNF('${f}')">${f}</button>`).join('')}<span style="flex:1"></span><button class="pill" onclick="readAll()">Marcar todo como leído</button></div>
  ${state.notifs.map(n=>`<div class="card" style="margin-bottom:10px;${n.unread?'border-color:var(--acc)':''}"><b>${n.t}</b><div style="color:var(--mut)"><i>${n.d}</i></div><small style="color:var(--acc2)">${n.time}</small>${n.unread?' <span style="float:right;color:var(--acc)">●</span>':''}</div>`).join('')}`;
}

function layoutPerfil(){
  return `<div class="card"><div class="cover"></div><div class="row"><img class="avatar-big" src="https://i.pravatar.cc/120?img=12"/><div><h2 style="margin:0">Carlos Ríos</h2><small style="color:var(--mut)">@carlos.rios</small></div><span style="flex:1"></span><button class="btn">Seguir</button></div>
  <p>Estudiante de Ingeniería de Sistemas 💻 · 5° ciclo<br/>Amante del código, la música y el café ☕</p><small style="color:var(--mut)">🏫 USMP Arequipa · 📅 Ingresó en 2022</small>
  <div class="stats"><div><b>127</b><br/><small>Seguidores</small></div><div><b>83</b><br/><small>Siguiendo</small></div><div><b>24</b><br/><small>Posts</small></div></div></div>
  <div class="card" style="margin-top:12px"><b>🎲 Randomly</b><div class="stats"><div><b style="color:var(--green)">4</b><br/><small>Victorias</small></div><div><b style="color:var(--acc2)">1</b><br/><small>Derrotas</small></div><div><b>4</b><br/><small>Racha</small></div></div></div>`;
}

function render(){
  setActive();
  const h = location.hash || '#/inicio';
  if(h.startsWith('#/chat')) view.innerHTML = layoutChat();
  else if(h.startsWith('#/randomly')) view.innerHTML = layoutRandom();
  else if(h.startsWith('#/market')) view.innerHTML = layoutMarket();
  else if(h.startsWith('#/notif')) view.innerHTML = layoutNotif();
  else if(h.startsWith('#/perfil')) view.innerHTML = layoutPerfil();
  else view.innerHTML = layoutInicio();
}
window.addEventListener('hashchange', render);

window.setFilter = f => { state.filter=f; render(); };
window.setTab = t => { state.tab=t; render(); };
window.setCat = c => { state.marketCat=c; render(); };
window.setNF = f => { state.notifFilter=f; render(); };
window.readAll = () => { state.notifs.forEach(n=>n.unread=false); render(); };
window.like = i => { state.posts[i].likes++; render(); };
window.publish = () => { const el=document.getElementById('composer'); if(!el||!el.value.trim()) return; state.posts.unshift({name:'Carlos Ríos',info:'Ing. Sistemas · ahora',cat:'General',text:el.value,likes:0,comments:0,shares:0}); render(); };
window.sendChat = () => { const el=document.getElementById('chatinput'); if(!el||!el.value.trim()) return; state.chats.push({u:'Tú',t:el.value,h:'ahora',img:'https://i.pravatar.cc/60?img=12'}); render(); };
window.searchM = q => { const g=document.getElementById('mgrid'); if(!g) return; const f=state.products.filter(p=>p.n.toLowerCase().includes(q.toLowerCase())); g.innerHTML=f.map(p=>`<div class="card prod"><img loading="lazy" src="${p.img}"/><div class="p"><div class="price">${p.p}</div><b>${p.n}</b><div style="color:var(--mut);font-size:12px">${p.u}</div></div></div>`).join(''); };
window.findRandom = () => { const m=document.getElementById('rmsg'); if(m) m.textContent='Buscando rival en USMP Arequipa... 🎲'; setTimeout(()=>{ if(document.getElementById('rmsg')) document.getElementById('rmsg').textContent='¡Rival encontrado! Tienes 2:00 para responder ⏱'; },1200); };

render();
