/* ══════════════════════════════════════
   LINEDECOR — app.js
   Lógica completa da loja
   ══════════════════════════════════════ */

const API = 'http://localhost:3000/api';

// Produtos de demonstração (quando servidor não está rodando)
const PRODUTOS_DEMO = [
  {id:1,nome:'Vaso Cerâmica Atena',descricao:'Vaso artesanal em cerâmica esmaltada.',preco:289,preco_original:null,categoria:'Vasos',emoji:'🏺',estoque:15,vendas:42,badge:'Novo'},
  {id:2,nome:'Kit Velas Âmbar Selvagem',descricao:'Kit com 3 velas de cera de soja.',preco:149,preco_original:210,categoria:'Velas',emoji:'🕯️',estoque:30,vendas:87,badge:'Oferta'},
  {id:3,nome:'Quadro Abstrato Ouro',descricao:'Impressão de arte abstrata com moldura dourada.',preco:420,preco_original:null,categoria:'Quadros',emoji:'🖼️',estoque:8,vendas:31,colecao:'Premium'},
  {id:4,nome:'Planta Kokedama Zen',descricao:'Planta em bola de musgo, estilo japonês.',preco:195,preco_original:null,categoria:'Plantas',emoji:'🪴',estoque:20,vendas:55,badge:'Novo'},
  {id:5,nome:'Vaso Mármore Nero',descricao:'Vaso premium em mármore preto polido.',preco:560,preco_original:null,categoria:'Premium',emoji:'🏺',estoque:5,vendas:18},
  {id:6,nome:'Luminária Arco Dourado',descricao:'Luminária de arco em metal dourado.',preco:380,preco_original:480,categoria:'Iluminação',emoji:'💡',estoque:12,vendas:29,badge:'Oferta'},
];

// ── Estado global ──────────────────────
const state = {
  produtos: [],
  cart: [],
  filtro: 'todos',
  busca: '',
  ordenar: 'vendas',
  colecao: '',
  cupomAplicado: null,
  desconto: 0
};

// ══ UTILITÁRIOS ════════════════════════
const fmt = v => 'R$ ' + Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2 });

let toastTimer;
function toast(msg, tipo = 'ok') {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = tipo === 'erro' ? 'error show' : 'show';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 3000);
}

function showSpinner(containerId) {
  const el = document.getElementById(containerId);
  if (el) el.innerHTML = '<div style="display:flex;justify-content:center;padding:60px"><div class="spinner"></div></div>';
}

// ══ NAVBAR ═════════════════════════════
window.addEventListener('scroll', () => {
  document.getElementById('navbar')?.classList.toggle('scrolled', window.scrollY > 60);
});

// ══ BUSCA ══════════════════════════════
function openSearch() {
  document.getElementById('search-bar').classList.add('open');
  document.getElementById('search-input').focus();
}
function closeSearch() {
  document.getElementById('search-bar').classList.remove('open');
  document.getElementById('search-input').value = '';
  state.busca = '';
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeSearch();
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); openSearch(); }
});

// ══ CARRINHO ═══════════════════════════
function openCart()  {
  document.getElementById('cart-drawer').classList.add('open');
  document.getElementById('cart-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  document.getElementById('cart-drawer').classList.remove('open');
  document.getElementById('cart-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

function addToCart(id) {
  const produto = state.produtos.find(p => p.id === id);
  if (!produto) return;
  if (produto.estoque <= 0) { toast('⚠ Produto sem estoque!', 'erro'); return; }

  const existing = state.cart.find(i => i.id === id);
  if (existing) {
    if (existing.qty >= produto.estoque) { toast('⚠ Estoque insuficiente!', 'erro'); return; }
    existing.qty++;
  } else {
    state.cart.push({ ...produto, qty: 1 });
  }
  saveCart();
  updateCartUI();
  toast(`✓ ${produto.nome} adicionado!`);
  openCart();
}

function changeQty(id, delta) {
  const item = state.cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) state.cart = state.cart.filter(i => i.id !== id);
  saveCart();
  updateCartUI();
}

function removeFromCart(id) {
  state.cart = state.cart.filter(i => i.id !== id);
  saveCart();
  updateCartUI();
}

function saveCart() {
  localStorage.setItem('linedecor_cart', JSON.stringify(state.cart));
}
function loadCart() {
  try {
    const saved = localStorage.getItem('linedecor_cart');
    if (saved) state.cart = JSON.parse(saved);
  } catch { state.cart = []; }
}

function updateCartUI() {
  const count = state.cart.reduce((a, i) => a + i.qty, 0);
  const total = state.cart.reduce((a, i) => a + i.preco * i.qty, 0);

  document.querySelectorAll('.cart-count').forEach(el => el.textContent = count);
  const totalEl = document.getElementById('cart-total-val');
  if (totalEl) totalEl.textContent = fmt(total);

  const itemsEl = document.getElementById('cart-items');
  if (!itemsEl) return;

  if (state.cart.length === 0) {
    itemsEl.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🛍️</div>
        <p>Seu carrinho está vazio</p>
      </div>`;
    return;
  }

  itemsEl.innerHTML = state.cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-emoji">${item.emoji}</div>
      <div>
        <div class="cart-item-name">${item.nome}</div>
        <div class="cart-item-cat">${item.categoria}</div>
        <div class="cart-qty">
          <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
          <button class="qty-btn" onclick="removeFromCart(${item.id})" style="margin-left:4px;font-size:12px">🗑</button>
        </div>
      </div>
      <div class="cart-item-price">${fmt(item.preco * item.qty)}</div>
    </div>
  `).join('');
}

// ══ PRODUTOS ═══════════════════════════
async function loadProdutos() {
  showSpinner('produtos-grid');
  try {
    const params = new URLSearchParams();
    if (state.filtro !== 'todos') params.set('categoria', state.filtro);
    if (state.busca) params.set('busca', state.busca);
    if (state.colecao) params.set('colecao', state.colecao);
    params.set('ordenar', state.ordenar);

    const res = await fetch(`${API}/produtos?${params}`);
    state.produtos = await res.json();
    renderProdutos();
  } catch {
    // Modo offline: usa produtos de demonstração
    let prods = [...PRODUTOS_DEMO];
    if (state.filtro !== 'todos') prods = prods.filter(p => p.categoria === state.filtro);
    if (state.colecao === 'Premium') prods = prods.filter(p => p.categoria === 'Premium' || p.colecao === 'Premium');
    if (state.busca) prods = prods.filter(p => (p.nome + ' ' + (p.descricao || '')).toLowerCase().includes(state.busca.toLowerCase()));
    if (state.ordenar === 'preco_asc') prods.sort((a,b) => a.preco - b.preco);
    else if (state.ordenar === 'preco_desc') prods.sort((a,b) => b.preco - a.preco);
    else if (state.ordenar === 'novidades') prods.reverse();
    else prods.sort((a,b) => (b.vendas || 0) - (a.vendas || 0));
    state.produtos = prods;
    renderProdutos();
  }
}

function renderProdutos() {
  const grid = document.getElementById('produtos-grid');
  if (!grid) return;

  if (state.produtos.length === 0) {
    grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:var(--warm);padding:60px;font-family:var(--ff-mono);font-size:11px;letter-spacing:2px">Nenhum produto encontrado.</p>';
    return;
  }

  grid.innerHTML = state.produtos.map(p => `
    <div class="prod-card reveal" data-id="${p.id}">
      <a href="produto.html?id=${p.id}" class="prod-img" style="text-decoration:none;color:inherit">
        <div class="prod-emoji">${p.emoji}</div>
        ${p.badge ? `<span class="prod-badge badge ${p.badge === 'Novo' ? 'badge-dark' : 'badge-rust'}">${p.badge}</span>` : ''}
        ${p.estoque === 0 ? '<span class="prod-badge badge badge-stone" style="left:auto;right:16px">Esgotado</span>' : ''}
        <button class="prod-fav" aria-label="Favoritar" onclick="event.preventDefault();event.stopPropagation();toggleFav(this, ${p.id})">♡</button>
        <button class="prod-quick ${p.estoque === 0 ? 'disabled' : ''}"
          onclick="event.preventDefault();event.stopPropagation();${p.estoque > 0 ? `addToCart(${p.id})` : ''}">
          ${p.estoque > 0 ? '+ Adicionar ao Carrinho' : 'Sem Estoque'}
        </button>
      </a>
      <div class="prod-info">
        <div class="prod-cat">${p.categoria}</div>
        <a href="produto.html?id=${p.id}" style="text-decoration:none;color:inherit"><div class="prod-name">${p.nome}</div></a>
        <p class="prod-desc">${p.descricao || ''}</p>
        <div class="prod-price-row">
          <div>
            ${p.preco_original ? `<span class="prod-old">${fmt(p.preco_original)}</span>` : ''}
            <span class="prod-price">${fmt(p.preco)}</span>
          </div>
          <div class="prod-stars">★★★★${p.vendas > 30 ? '★' : '☆'}</div>
        </div>
        <div class="prod-estoque ${p.estoque < 5 ? 'low' : ''}">
          ${p.estoque > 0 ? `${p.estoque} em estoque` : 'Esgotado'}
        </div>
      </div>
    </div>
  `).join('');

  // Ativar reveal
  requestAnimationFrame(() => {
    document.querySelectorAll('.prod-card.reveal').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 60);
    });
  });
}

// ── Favoritos (localStorage) ──
function toggleFav(btn, id) {
  const favs = JSON.parse(localStorage.getItem('linedecor_favs') || '[]');
  const idx = favs.indexOf(id);
  if (idx === -1) { favs.push(id); btn.textContent = '♥'; btn.style.color = 'var(--rust)'; }
  else            { favs.splice(idx, 1); btn.textContent = '♡'; btn.style.color = ''; }
  localStorage.setItem('linedecor_favs', JSON.stringify(favs));
}

// ── Filtros ──
function setFiltro(categoria, btn) {
  state.filtro = categoria;
  state.colecao = '';
  document.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  loadProdutos();
}

function setOrdenar(val) {
  state.ordenar = val;
  loadProdutos();
}

function setColecao(val) {
  state.colecao = val || '';
  state.filtro = 'todos';
  document.querySelectorAll('.filter-tab').forEach((b, i) => b.classList.toggle('active', i === (val === 'Premium' ? 1 : val === 'Kits' ? 2 : 0)));
  loadProdutos();
}

// ── Busca ──
let buscaTimer;
document.addEventListener('input', e => {
  if (e.target.id === 'search-input') {
    clearTimeout(buscaTimer);
    buscaTimer = setTimeout(() => {
      state.busca = e.target.value.trim();
      if (state.busca.length > 1 || state.busca.length === 0) {
        loadProdutos();
        if (state.busca) closeSearch();
      }
    }, 400);
  }
});

// ══ CATEGORIAS ═════════════════════════
async function loadCategorias() {
  const tabsEl = document.getElementById('filter-tabs');
  if (!tabsEl) return;
  try {
    const res = await fetch(`${API}/categorias`);
    const cats = await res.json();
    const extras = cats.map(c =>
      `<button class="filter-tab" data-cat="${c.categoria}" onclick="setFiltro('${c.categoria}', this)">${c.categoria} <span style="opacity:.5">(${c.total})</span></button>`
    ).join('');
    tabsEl.insertAdjacentHTML('beforeend', extras);
  } catch {
    ['Vasos','Velas','Quadros','Plantas','Iluminação','Premium'].forEach(cat => {
      const n = PRODUTOS_DEMO.filter(p => p.categoria === cat).length;
      if (n > 0) tabsEl.insertAdjacentHTML('beforeend', `<button class="filter-tab" data-cat="${cat}" onclick="setFiltro('${cat}', this)">${cat} <span style="opacity:.5">(${n})</span></button>`);
    });
  }
}

// ══ CHECKOUT ═══════════════════════════
function openCheckout() {
  if (state.cart.length === 0) { toast('⚠ Adicione produtos ao carrinho!', 'erro'); return; }
  state.cupomAplicado = null;
  state.desconto = 0;
  document.getElementById('ch-cupom').value = '';
  document.getElementById('cupom-msg').textContent = '';
  closeCart();
  document.getElementById('checkout-modal').classList.add('open');
  renderCheckoutSummary();
}

const FRETE_GRATIS = 299;
function renderCheckoutSummary() {
  const subtotal = state.cart.reduce((a, i) => a + i.preco * i.qty, 0);
  const frete = subtotal >= FRETE_GRATIS ? 0 : 25;
  const total = Math.max(0, subtotal - state.desconto + frete);
  document.getElementById('checkout-summary').innerHTML = `
    <div style="border:1px solid var(--sand);padding:16px;margin-bottom:20px">
      ${state.cart.map(i => `
        <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--sand);font-size:13px">
          <span>${i.emoji} ${i.nome} × ${i.qty}</span>
          <strong>${fmt(i.preco * i.qty)}</strong>
        </div>
      `).join('')}
      <div style="display:flex;justify-content:space-between;padding:8px 0;font-size:13px"><span>Subtotal</span><span>${fmt(subtotal)}</span></div>
      ${state.desconto ? `<div style="display:flex;justify-content:space-between;padding:8px 0;font-size:13px;color:var(--green)"><span>Desconto (${state.cupomAplicado})</span><span>-${fmt(state.desconto)}</span></div>` : ''}
      <div style="display:flex;justify-content:space-between;padding:8px 0;font-size:13px"><span>Frete</span><span>${frete === 0 ? 'Grátis ✓' : fmt(frete)}</span></div>
      ${subtotal < FRETE_GRATIS ? `<p style="font-size:11px;color:var(--stone);margin-top:4px">Frete grátis acima de R$ ${FRETE_GRATIS}</p>` : ''}
      <div style="display:flex;justify-content:space-between;padding-top:12px;font-family:var(--ff-head);font-size:1.2rem;font-weight:700;border-top:1px solid var(--sand)">
        <span>Total</span><span>${fmt(total)}</span>
      </div>
    </div>`;
}

async function aplicarCupom() {
  const codigo = document.getElementById('ch-cupom').value.trim().toUpperCase();
  if (!codigo) { toast('Digite um cupom', 'erro'); return; }
  const subtotal = state.cart.reduce((a, i) => a + i.preco * i.qty, 0);
  try {
    const res = await fetch(`${API}/cupons/validar?codigo=${encodeURIComponent(codigo)}&total=${subtotal}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.erro);
    state.cupomAplicado = data.cupom;
    state.desconto = data.desconto;
    document.getElementById('cupom-msg').textContent = `✓ Cupom aplicado! Desconto de ${data.tipo === 'percentual' ? data.valor + '%' : fmt(data.valor)}`;
    renderCheckoutSummary();
    toast('Cupom aplicado!');
  } catch (e) {
    // Modo offline: cupons demo
    let desconto = 0;
    if (codigo === 'BEMVINDO10' && subtotal >= 100) { desconto = subtotal * 0.1; state.cupomAplicado = 'BEMVINDO10'; }
    else if (codigo === 'FRETE299' && subtotal >= 299) { desconto = 25; state.cupomAplicado = 'FRETE299'; }
    else { toast('Cupom inválido', 'erro'); return; }
    state.desconto = desconto;
    document.getElementById('cupom-msg').textContent = `✓ Cupom aplicado!`;
    renderCheckoutSummary();
    toast('Cupom aplicado!');
  }
}

function closeCheckout() {
  document.getElementById('checkout-modal').classList.remove('open');
}

async function finalizarPedido() {
  const nome  = document.getElementById('ch-nome')?.value.trim();
  const email = document.getElementById('ch-email')?.value.trim();
  const telefone = document.getElementById('ch-telefone')?.value.trim();
  const cep   = document.getElementById('ch-cep')?.value.trim().replace(/\D/g, '');
  const end   = document.getElementById('ch-endereco')?.value.trim();

  if (!nome || !email) { toast('⚠ Preencha nome e e-mail!', 'erro'); return; }
  if (!telefone) { toast('⚠ Informe o telefone/WhatsApp!', 'erro'); return; }
  if (!end) { toast('⚠ Informe o endereço de entrega!', 'erro'); return; }

  const subtotal = state.cart.reduce((a, i) => a + i.preco * i.qty, 0);
  const frete = subtotal >= FRETE_GRATIS ? 0 : 25;
  const total = Math.max(0, subtotal - state.desconto + frete);

  const body  = {
    nome, email, telefone, endereco: end,
    cep: cep || undefined,
    subtotal, frete, desconto: state.desconto, cupom: state.cupomAplicado,
    total,
    itens: state.cart.map(i => ({ id: i.id, nome: i.nome, qty: i.qty, preco: i.preco, emoji: i.emoji }))
  };

  try {
    const res  = await fetch(`${API}/pedidos`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const data = await res.json();
    if (!res.ok) throw new Error(data.erro);

    toast(`✓ Pedido #${data.id} realizado! Confirmação enviada por email.`);
    state.cart = [];
    saveCart();
    updateCartUI();
    closeCheckout();
    loadProdutos(); // atualiza estoque
    document.getElementById('ch-nome').value = '';
    document.getElementById('ch-email').value = '';
    document.getElementById('ch-telefone').value = '';
    document.getElementById('ch-cep').value = '';
    document.getElementById('ch-endereco').value = '';
    document.getElementById('ch-cupom').value = '';
  } catch (err) {
    // Modo offline: salva pedido localmente e simula sucesso
    const pedidos = JSON.parse(localStorage.getItem('linedecor_pedidos_offline') || '[]');
    const id = pedidos.length + 1;
    body.id = id;
    body.codigo = 'LD' + Date.now().toString(36).toUpperCase();
    pedidos.push(body);
    localStorage.setItem('linedecor_pedidos_offline', JSON.stringify(pedidos));
    toast(`✓ Pedido #${id} registrado! (modo demonstração - instale Node.js para envio real)`);
    state.cart = [];
    saveCart();
    updateCartUI();
    closeCheckout();
    document.getElementById('ch-nome').value = '';
    document.getElementById('ch-email').value = '';
    document.getElementById('ch-telefone').value = '';
    document.getElementById('ch-cep').value = '';
    document.getElementById('ch-endereco').value = '';
    document.getElementById('ch-cupom').value = '';
  }
}

// ══ NEWSLETTER ═════════════════════════
async function subscribeNewsletter() {
  const input = document.getElementById('newsletter-email');
  const email = input?.value.trim();
  if (!email || !email.includes('@')) { toast('⚠ E-mail inválido!', 'erro'); return; }
  try {
    const res  = await fetch(`${API}/newsletter`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
    const data = await res.json();
    if (!res.ok) throw new Error(data.erro);
    toast('✓ Cadastrado! Seu cupom chegará em breve 🎉');
    input.value = '';
  } catch (err) {
    localStorage.setItem('linedecor_newsletter_offline', JSON.stringify([...(JSON.parse(localStorage.getItem('linedecor_newsletter_offline') || '[]')), email]));
    toast('✓ Cadastrado! (modo demonstração)');
    input.value = '';
  }
}

// ══ REVEAL (scroll) ════════════════════
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.07 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ══ CEP MASK ═══════════════════════════
document.addEventListener('input', e => {
  if (e.target.id === 'ch-cep') {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length > 5) v = v.slice(0, 5) + '-' + v.slice(5, 8);
    e.target.value = v;
  }
});

// ══ INIT ═══════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  loadCart();
  updateCartUI();
  loadProdutos();
  loadCategorias();
});
