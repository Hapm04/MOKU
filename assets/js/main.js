(function(){
  const config = window.MOKU_CONFIG || {};
  const i18n = window.MOKU_I18N || {};
  const page = window.MOKU_PAGE || 'home';
  const base = window.MOKU_BASE || '';
  const state = {
    lang: localStorage.getItem('moku-lang') || 'en',
    cart: JSON.parse(localStorage.getItem('moku-cart') || '[]'),
    filter: 'all'
  };

  const $ = (selector, scope=document) => scope.querySelector(selector);
  const $$ = (selector, scope=document) => Array.from(scope.querySelectorAll(selector));
  const langData = () => i18n[state.lang] || i18n.en;
  const asset = (name) => base + 'assets/images/' + name;
  const routes = {
    home: base + 'trang-chu/',
    about: base + 'gioi-thieu/',
    products: base + 'san-pham/',
    news: base + 'tin-tuc/',
    contact: base + 'lien-he/'
  };

  function get(path){
    return path.split('.').reduce((obj,key)=> obj && obj[key], langData()) || '';
  }

  function setCommon(){
    const t = langData();
    document.documentElement.lang = state.lang;
    document.title = t.metaTitle;
    const meta = $('meta[name="description"]');
    if(meta) meta.setAttribute('content', t.metaDescription);

    $$('[data-i18n]').forEach(el => { el.textContent = get(el.dataset.i18n); });
    $$('.company-name').forEach(el => el.textContent = config.companyName || 'MOKU Kitchenware Co., Ltd.');
    $$('.company-address').forEach(el => el.textContent = config.address || 'Nguyen Thi Thap Street, District 7, Ho Chi Minh City, Vietnam');
    $$('.company-email').forEach(el => el.textContent = config.email || 'info@mokukitchenware.com');
    $$('.company-phone').forEach(el => el.textContent = config.phone || '+84 28 7300 XXXX');
    $$('.company-website').forEach(el => el.textContent = (config.website || 'www.mokukitchenware.com').replace(/^https?:\/\//,''));

    $$('.email-link').forEach(a => { a.href = 'mailto:' + (config.email || 'info@mokukitchenware.com'); });
    $$('.phone-link').forEach(a => { a.href = config.phoneHref || '#'; });
    $$('.quote-link').forEach(a => { a.href = config.quoteLink || '#'; });
    $$('.zalo-link').forEach(a => { a.href = config.zaloLink || '#'; });
    $$('.messenger-link').forEach(a => { a.href = config.messengerLink || '#'; });
    $$('.map-link').forEach(a => { a.href = config.mapLink || '#'; });
    $$('.website-link').forEach(a => { a.href = config.website || '#'; });

    $$('[data-route]').forEach(a => {
      const key = a.dataset.route;
      a.href = routes[key] || base;
      a.classList.toggle('active', page === key || (page === 'home' && key === 'home'));
    });
    $$('.lang-switch button').forEach(btn => btn.classList.toggle('active', btn.dataset.lang === state.lang));
    $$('[data-product-menu]').forEach(el => {
      const index = Number(el.dataset.productMenu);
      if(t.productList[index]) el.textContent = t.productList[index].name;
    });
    renderCartPanel();
  }

  function formatMoney(value){
    const amount = Number(value || 0);
    if(state.lang === 'vi') return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
    return 'VND ' + new Intl.NumberFormat('en-US').format(amount);
  }

  function findProduct(sku){
    return langData().productList.find(p => p.sku === sku) || (i18n.en && i18n.en.productList || []).find(p => p.sku === sku);
  }

  function featureCards(){
    return langData().features.map(item => `
      <article class="feature-card reveal">
        <span>${item.icon}</span>
        <h3>${item.title}</h3>
        <p>${item.desc}</p>
      </article>
    `).join('');
  }

  function statsHtml(stats){
    return `<div class="stats">${stats.map(s=>`<div><strong>${s[0]}</strong><span>${s[1]}</span></div>`).join('')}</div>`;
  }

  function productsHtml(limit){
    const t = langData();
    let products = t.productList;
    if (state.filter !== 'all') products = products.filter(p => p.cat === state.filter);
    if (limit) products = products.slice(0, limit);
    return products.map(p => `
      <article class="product-card reveal" data-category="${p.cat}">
        <img src="${asset(p.img)}" alt="${escapeHtml(p.name)}">
        <div class="product-card__body">
          <span class="badge">${t.products[p.cat] || t.products.all}</span>
          <h3>${p.name}</h3>
          <p>${p.desc}</p>
          <div class="product-card__bottom">
            <div class="product-card__meta">
              <span>${p.viName}</span>
              <strong class="product-price">${formatMoney(p.price)}</strong>
            </div>
            <button class="add-quote add-cart" type="button" data-add-product="${escapeHtml(p.sku)}">${t.common.addToQuote}</button>
          </div>
        </div>
      </article>
    `).join('');
  }

  function productFilters(){
    const t = langData();
    const filters = [['all',t.products.all],['board',t.products.board],['utensils',t.products.utensils],['serveware',t.products.serveware],['care',t.products.care],['organizer',t.products.organizer]];
    return `<div class="filter-bar reveal" aria-label="Product filters">${filters.map(([key,label]) => `<button class="filter-btn ${state.filter===key?'active':''}" type="button" data-product-filter="${key}">${label}</button>`).join('')}</div>`;
  }

  function newsHtml(limit){
    const list = limit ? langData().newsList.slice(0, limit) : langData().newsList;
    return list.map(n => `
      <article class="news-card reveal">
        <img src="${asset(n.img)}" alt="${escapeHtml(n.title)}">
        <div>
          <time>${n.date}</time>
          <h3>${n.title}</h3>
          <p>${n.desc}</p>
        </div>
      </article>
    `).join('');
  }

  function renderHome(){
    const t = langData();
    $('#pageRoot').innerHTML = `
      <section class="hero">
        <div class="container hero__grid">
          <div class="hero__content reveal">
            <p class="eyebrow">${t.home.eyebrow}</p>
            <h1>${t.home.title}</h1>
            <p class="hero__desc">${t.home.desc}</p>
            <div class="hero__actions">
              <a href="${routes.products}" class="btn btn--primary">${t.common.viewProducts}</a>
              <a href="${config.quoteLink || '#'}" class="btn btn--outline quote-link" target="_blank" rel="noopener">${t.common.requestQuote}</a>
            </div>
          </div>
          <div class="hero__visual reveal">
            <img src="${asset('hero-kitchen.jpg')}" alt="MOKU wooden kitchenware">
            <div class="hero-card hero-card--one">${t.home.cardOne}</div>
            <div class="hero-card hero-card--two">${t.home.cardTwo}</div>
          </div>
        </div>
      </section>
      <section class="features"><div class="container feature-grid">${featureCards()}</div></section>
      <section class="section about">
        <div class="container about__grid">
          <div class="section-image reveal"><img src="${asset('about-wood.jpg')}" alt="MOKU craftsmanship"></div>
          <div class="section-content reveal">
            <p class="eyebrow">${t.home.aboutEyebrow}</p><h2>${t.home.aboutTitle}</h2>
            <p>${t.home.aboutDesc1}</p><p>${t.home.aboutDesc2}</p>
            ${statsHtml(t.home.stats)}
            <div class="button-row"><a href="${routes.about}" class="btn btn--outline">${t.common.learnMore}</a></div>
          </div>
        </div>
      </section>
      <section class="section products section--cream">
        <div class="container">
          <div class="section-heading reveal"><p class="eyebrow">${t.common.productMenu}</p><h2>${t.home.productsTitle}</h2><p>${t.home.productsDesc}</p></div>
          <div class="product-grid">${productsHtml(6)}</div>
          <div class="button-row" style="justify-content:center"><a class="btn btn--primary" href="${routes.products}">${t.common.viewProducts}</a></div>
        </div>
      </section>
      <section class="section category-section">
        <div class="container">
          <div class="section-heading reveal"><p class="eyebrow">MOKU</p><h2>${t.home.categoryTitle}</h2><p>${t.home.categoryDesc}</p></div>
          <div class="category-grid">${t.categories.map(c=>`<a class="category-card reveal" href="${routes.products}">${c}<span>→</span></a>`).join('')}</div>
        </div>
      </section>
      <section class="section news">
        <div class="container">
          <div class="section-heading reveal"><p class="eyebrow">${t.common.navNews}</p><h2>${t.home.newsTitle}</h2><p>${t.home.newsDesc}</p></div>
          <div class="news-grid">${newsHtml(3)}</div>
        </div>
      </section>
      <section class="partners">
        <div class="container reveal"><h2>${t.home.partnersTitle}</h2><p>${t.home.partnersDesc}</p><div class="partner-row"><span>D2C</span><span>Retail</span><span>Gifts</span><span>HORECA</span><span>Studio</span></div></div>
      </section>
      ${contactSection(false)}
    `;
  }

  function pageHero(title, desc){
    const t = langData();
    return `<section class="page-hero"><div class="container reveal"><div class="breadcrumb"><a href="${routes.home}">${t.common.navHome}</a> / ${title}</div><h1>${title}</h1><p class="section-lead">${desc}</p></div></section>`;
  }

  function renderAbout(){
    const t = langData();
    $('#pageRoot').innerHTML = `
      ${pageHero(t.about.title, t.about.desc)}
      <section class="section about">
        <div class="container about__grid">
          <div class="section-image reveal"><img src="${asset('logo.jpg')}" alt="MOKU logo"></div>
          <div class="section-content reveal">
            <p class="eyebrow">${t.about.subtitle}</p>
            <h2>${t.about.originTitle}</h2><p>${t.about.originDesc}</p>
            <h3>${t.about.philosophyTitle}</h3><p>${t.about.philosophyDesc}</p>
            <h3>${t.about.logoTitle}</h3><p>${t.about.logoDesc}</p>
          </div>
        </div>
      </section>
      <section class="section section--cream">
        <div class="container">
          <div class="mission-grid">
            <article class="mission-card reveal"><h3>🎯 ${t.about.visionTitle}</h3><p>${t.about.vision}</p></article>
            <article class="mission-card reveal"><h3>🌱 ${t.about.missionTitle}</h3><p>${t.about.mission}</p></article>
          </div>
        </div>
      </section>
      <section class="section">
        <div class="container">
          <div class="section-heading reveal"><p class="eyebrow">MOKU</p><h2>${t.about.coreTitle}</h2></div>
          <div class="value-grid">${t.coreValues.map((v,i)=>`<article class="value-card reveal"><strong>${i+1}</strong><h3>${v.title}</h3><p>${v.desc}</p></article>`).join('')}</div>
        </div>
      </section>
      <section class="section section--cream"><div class="container"><div class="value-grid">${t.values.map(v=>`<article class="value-card reveal"><strong>${v.letter}</strong><h3>${v.title}</h3><p>${v.desc}</p></article>`).join('')}</div></div></section>
    `;
  }

  function renderProducts(){
    const t = langData();
    $('#pageRoot').innerHTML = `
      ${pageHero(t.products.title, t.products.desc)}
      <section class="section products section--cream">
        <div class="container">
          ${productFilters()}
          <div class="product-grid" id="productGrid">${productsHtml()}</div>
        </div>
      </section>
      <section class="section category-section"><div class="container"><div class="section-heading reveal"><p class="eyebrow">MOKU</p><h2>${t.home.categoryTitle}</h2><p>${t.home.categoryDesc}</p></div><div class="category-grid">${t.categories.map(c=>`<div class="category-card reveal">${c}<span>✓</span></div>`).join('')}</div></div></section>
    `;
  }

  function renderNews(){
    const t = langData();
    $('#pageRoot').innerHTML = `
      ${pageHero(t.news.title, t.news.desc)}
      <section class="section"><div class="container"><div class="news-grid">${newsHtml()}</div></div></section>
      <section class="section section--cream"><div class="container"><div class="section-heading reveal"><p class="eyebrow">SEO</p><h2>${t.home.newsTitle}</h2><p>${t.home.newsDesc}</p></div></div></section>
    `;
  }

  function contactSection(withHero=true){
    const t = langData();
    return `${withHero ? pageHero(t.contact.title, t.contact.desc) : ''}
      <section class="section contact">
        <div class="container contact__grid">
          <div class="contact-card reveal">
            <p class="eyebrow">${t.common.contactInfo}</p><h2>${t.contact.title}</h2><p>${t.contact.desc}</p>
            <div class="contact-list">
              <div><strong>${t.common.address}:</strong> <span class="company-address"></span></div>
              <a class="phone-link" href="#"><strong>${t.common.hotline}:</strong> <span class="company-phone"></span></a>
              <a class="email-link" href="#"><strong>${t.common.email}:</strong> <span class="company-email"></span></a>
              <a class="website-link" href="#" target="_blank" rel="noopener"><strong>${t.common.website}:</strong> <span class="company-website"></span></a>
            </div>
            <div class="button-row"><a class="btn btn--primary quote-link" target="_blank" rel="noopener" href="#">${t.common.requestQuote}</a><a class="btn btn--outline map-link" target="_blank" rel="noopener" href="#">${t.common.map}</a></div>
          </div>
          <form class="quote-form reveal" id="quoteForm">
            <h3>${t.contact.formTitle}</h3>
            <label>${t.contact.name}<input name="name" placeholder="${t.contact.placeholderName}" required></label>
            <label>${t.contact.phone}<input name="phone" placeholder="${t.contact.placeholderPhone}" required></label>
            <label>${t.contact.product}<select name="product"><option>${t.contact.quoteOption}</option>${t.productList.map(p=>`<option>${p.name} - ${formatMoney(p.price)}</option>`).join('')}</select></label>
            <label>${t.contact.message}<textarea name="message" rows="5" placeholder="${t.contact.placeholderMessage}"></textarea></label>
            <button class="btn btn--primary" type="submit">${t.common.sendRequest}</button>
            <p class="form-note" id="formNote">${t.contact.formNote}</p>
          </form>
        </div>
      </section>`;
  }

  function renderContact(){ $('#pageRoot').innerHTML = contactSection(true); }

  function render404(){
    const t = langData();
    $('#pageRoot').innerHTML = `${pageHero(t.notFound.title,t.notFound.desc)}<section class="section"><div class="container"><a class="btn btn--primary" href="${routes.home}">${t.common.backHome}</a></div></section>`;
  }

  function renderPage(){
    if(page === 'about') renderAbout();
    else if(page === 'products') renderProducts();
    else if(page === 'news') renderNews();
    else if(page === 'contact') renderContact();
    else if(page === '404') render404();
    else renderHome();
    setCommon();
    bindDynamic();
    observeReveals();
  }

  function bindDynamic(){
    $$('[data-add-product]').forEach(btn => btn.addEventListener('click', () => addCart(btn.dataset.addProduct)));
    $$('[data-product-filter]').forEach(btn => btn.addEventListener('click', () => { state.filter = btn.dataset.productFilter; renderPage(); }));
    const quoteForm = $('#quoteForm');
    if(quoteForm){ quoteForm.addEventListener('submit', e => { e.preventDefault(); $('#formNote').textContent = langData().contact.success; quoteForm.reset(); }); }
  }

  function addCart(sku){
    const product = findProduct(sku);
    if(!product) return;
    const existing = state.cart.find(item => item.sku === sku);
    if(existing) existing.qty += 1;
    else state.cart.push({sku, price: Number(product.price), qty: 1});
    saveCart();
    renderCartPanel();
    openCartPanel();
  }

  function saveCart(){ localStorage.setItem('moku-cart', JSON.stringify(state.cart)); }

  function cartCount(){ return state.cart.reduce((total, item) => total + Number(item.qty || 0), 0); }
  function cartTotal(){ return state.cart.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.qty || 0), 0); }

  function renderCartPanel(){
    const t = langData();
    const count = $('#quoteCount');
    if(count) count.textContent = cartCount();
    const box = $('#quoteItems');
    if(!box) return;
    if(state.cart.length === 0){
      box.innerHTML = `<p class="empty-note">${t.cart.empty}</p>`;
    } else {
      box.innerHTML = state.cart.map(item => {
        const product = findProduct(item.sku) || {name:item.sku, price:item.price};
        const price = Number(item.price || product.price || 0);
        const qty = Number(item.qty || 1);
        return `<div class="quote-item cart-item">
          <div class="cart-item__info">
            <strong>${product.name}</strong>
            <span>${formatMoney(price)} × ${qty}</span>
          </div>
          <div class="cart-item__tools">
            <div class="qty-control" aria-label="${t.cart.qty}">
              <button type="button" data-cart-decrease="${escapeHtml(item.sku)}">−</button>
              <span>${qty}</span>
              <button type="button" data-cart-increase="${escapeHtml(item.sku)}">+</button>
            </div>
            <button class="cart-remove" type="button" data-remove-quote="${escapeHtml(item.sku)}">${t.cart.remove}</button>
          </div>
        </div>`;
      }).join('');
    }
    const title = $('#quotePanelTitle');
    if(title) title.textContent = t.cart.title;
    const openBtn = $('#openQuoteLink');
    if(openBtn) openBtn.textContent = t.cart.openQuote;
    const clearBtn = $('#clearQuote');
    if(clearBtn) clearBtn.textContent = t.cart.clear;
    const subtotal = $('#cartSubtotalLabel');
    if(subtotal) subtotal.textContent = t.cart.subtotal;
    const total = $('#cartTotal');
    if(total) total.textContent = formatMoney(cartTotal());

    $$('[data-remove-quote]').forEach(btn => btn.addEventListener('click', () => {
      state.cart = state.cart.filter(item => item.sku !== btn.dataset.removeQuote);
      saveCart();
      renderCartPanel();
    }));
    $$('[data-cart-increase]').forEach(btn => btn.addEventListener('click', () => {
      const item = state.cart.find(p => p.sku === btn.dataset.cartIncrease);
      if(item) item.qty += 1;
      saveCart();
      renderCartPanel();
    }));
    $$('[data-cart-decrease]').forEach(btn => btn.addEventListener('click', () => {
      const item = state.cart.find(p => p.sku === btn.dataset.cartDecrease);
      if(item){ item.qty -= 1; }
      state.cart = state.cart.filter(p => Number(p.qty) > 0);
      saveCart();
      renderCartPanel();
    }));
  }

  function openCartPanel(){ const panel = $('#quotePanel'); panel.classList.add('active'); panel.setAttribute('aria-hidden','false'); }
  function closeCartPanel(){ const panel = $('#quotePanel'); panel.classList.remove('active'); panel.setAttribute('aria-hidden','true'); }

  function observeReveals(){
    const items = $$('.reveal');
    if(!('IntersectionObserver' in window)){ items.forEach(el=>el.classList.add('visible')); return; }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if(entry.isIntersecting){ entry.target.classList.add('visible'); observer.unobserve(entry.target); } });
    }, {threshold:.12});
    items.forEach(el => observer.observe(el));
  }

  function escapeHtml(str){ return String(str).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s])); }

  document.addEventListener('DOMContentLoaded', () => {
    const navToggle = $('#navToggle');
    const navLinks = $('#navLinks');
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('active');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    navLinks.addEventListener('click', e => { if(e.target.matches('a')){ navLinks.classList.remove('active'); navToggle.setAttribute('aria-expanded','false'); } });
    $$('.lang-switch button').forEach(btn => btn.addEventListener('click', () => { state.lang = btn.dataset.lang; localStorage.setItem('moku-lang', state.lang); renderPage(); }));
    $('#openQuote').addEventListener('click', openCartPanel);
    $('#floatQuote').addEventListener('click', openCartPanel);
    $('#closeQuote').addEventListener('click', closeCartPanel);
    $('#quotePanel').addEventListener('click', e => { if(e.target.id === 'quotePanel') closeCartPanel(); });
    $('#clearQuote').addEventListener('click', () => { state.cart = []; saveCart(); renderCartPanel(); });
    $('#openQuoteLink').addEventListener('click', () => { window.open(config.quoteLink || '#', '_blank', 'noopener'); });
    renderPage();
  });
})();
