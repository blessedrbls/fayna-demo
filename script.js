'use strict';

// Налаштування: усе, що потрібно змінювати, зібрано тут

/* Ціни, грн: за 1 кг або за 1 шт (одиниця вказана в MENU).
   TODO: УСІ ЦІНИ ПРИБЛИЗНІ. Прайсу в Instagram не видно без входу,
   тому значення поставлено орієнтовно. Замініть реальними. */
const PRICES = {
  pork_shashlyk: 750,
  pork_ribs: 650,
  pork_steak: 700,
  chicken_shashlyk: 550,

  grill_vegetables: 400,
  grill_mushrooms: 450,
  coal_potatoes: 250,

  buns: 25,
  lavash: 35,

  sauce_bbq: 60,
  sauce_garlic: 60,
};

/* Надбавка за формат кейтерингу (фіксована сума за подію, грн).
   Формула: ціна на гостя × гості + надбавка за формат.
   TODO: суми приблизні, уточніть у клієнта. */
const FORMATS = [
  { id: 'furshet', title: 'Фуршет',     sub: 'Без розсадки, гості стоять',      fee: 0 },
  { id: 'banquet', title: 'Банкет',     sub: 'Гості за столами, з офіціантами', fee: 3000 },
  { id: 'bbq',     title: 'BBQ-фуршет', sub: 'Мангал і кухар на місці',         fee: 2500 },
];

/* Username у Telegram, куди надходитимуть заявки (без @).
   Поки тут YOUR_USERNAME, заявка не відкриває Telegram, а лише показує екран подяки. */
const TELEGRAM_USERNAME = 'YOUR_USERNAME';

const GUESTS_MIN = 5;
const GUESTS_MAX = 500;
const GUESTS_DEFAULT = 50;

const CATEGORIES = [
  { id: 'all',    title: 'Усі' },
  { id: 'meat',   title: "М'ясо" },
  { id: 'veg',    title: 'Овочі та гарніри' },
  { id: 'bakery', title: 'Випічка' },
  { id: 'sauces', title: 'Соуси' },
];

/* Меню.
   unit: 'кг' або 'шт' (ціна з PRICES саме за цю одиницю)
   step: на скільки змінюється кількість у замовленні шашлику
   portion: скільки одиниць іде на одного гостя в калькуляторі кейтерингу
   img: шлях до фото (напр. 'assets/menu/shashlyk.jpg') або null, тоді буде плейсхолдер
   default: true означає, що позиція одразу відмічена в калькуляторі
   TODO: позиції складені за роликами з Instagram (свинина, реберця, стейки, шашлик,
   овочі, випічка). Соуси додано як приклад. Звірте з реальним меню. */
const MENU = [
  { id: 'pork_shashlyk',    cat: 'meat',   name: 'Шашлик зі свинячої шиї', unit: 'кг', step: 0.5, portion: 0.25, desc: 'Класичний маринад з цибулею', img: null, default: true },
  { id: 'pork_ribs',        cat: 'meat',   name: 'Свинячі реберця',        unit: 'кг', step: 0.5, portion: 0.25, desc: 'Запечені на грилі', img: null },
  { id: 'pork_steak',       cat: 'meat',   name: 'Стейк зі свинини',       unit: 'кг', step: 0.5, portion: 0.25, desc: 'Шийна частина, на решітці', img: null },
  { id: 'chicken_shashlyk', cat: 'meat',   name: 'Курячий шашлик',         unit: 'кг', step: 0.5, portion: 0.25, desc: 'Філе стегна', img: null },

  { id: 'grill_vegetables', cat: 'veg',    name: 'Овочі-гриль',            unit: 'кг', step: 0.5, portion: 0.15, desc: 'Баклажан, перець, цукіні, томати', img: null, default: true },
  { id: 'grill_mushrooms',  cat: 'veg',    name: 'Печериці на мангалі',    unit: 'кг', step: 0.5, portion: 0.1,  desc: 'З часником і зеленню', img: null },
  { id: 'coal_potatoes',    cat: 'veg',    name: 'Картопля на вугіллі',    unit: 'кг', step: 0.5, portion: 0.15, desc: 'З салом і кропом', img: null },

  { id: 'buns',             cat: 'bakery', name: 'Булочки',                unit: 'шт', step: 1,   portion: 1,    desc: 'Свіжа випічка до м\'яса', img: null, default: true },
  { id: 'lavash',           cat: 'bakery', name: 'Лаваш',                  unit: 'шт', step: 1,   portion: 0.5,  desc: 'Тонкий, вірменський', img: null },

  { id: 'sauce_bbq',        cat: 'sauces', name: 'Соус BBQ',               unit: 'шт', step: 1,   portion: 0.1,  desc: 'Баночка 200 г', img: null, default: true },
  { id: 'sauce_garlic',     cat: 'sauces', name: 'Часниковий соус',        unit: 'шт', step: 1,   portion: 0.1,  desc: 'Баночка 200 г', img: null },
];

/* Галерея. src: шлях до фото в assets/gallery/ або null, тоді буде плейсхолдер.
   size: '', 'wide' або 'tall' (розмір плитки).
   TODO: замініть плейсхолдери реальними фото. */
const GALLERY = [
  { src: null, alt: 'Шашлик на мангалі',      size: 'wide' },
  { src: null, alt: 'Реберця на грилі',       size: 'tall' },
  { src: null, alt: 'Стейки',                 size: '' },
  { src: null, alt: 'Овочі-гриль',            size: '' },
  { src: null, alt: 'BBQ на свіжому повітрі', size: 'tall' },
  { src: null, alt: 'Випічка',                size: '' },
  { src: null, alt: 'Святковий стіл',         size: 'wide' },
  { src: null, alt: 'Мангал',                 size: '' },
];

// Утиліти

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const money = (n) => new Intl.NumberFormat('uk-UA').format(Math.round(n)) + ' ₴';
const qtyText = (q, unit) => new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 1 }).format(q) + ' ' + unit;
const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
const plural = (n, one, few, many) => {
  const m10 = n % 10, m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
  return many;
};
const catTitle = (id) => (CATEGORIES.find((c) => c.id === id) || {}).title || '';
const itemById = (id) => MENU.find((d) => d.id === id);
const priceOf = (id) => {
  const p = PRICES[id];
  if (typeof p !== 'number') console.warn(`[PRICES] немає ціни для "${id}"`);
  return typeof p === 'number' ? p : 0;
};

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === 'class') node.className = v;
    else if (k === 'text') node.textContent = v;
    else node.setAttribute(k, v === true ? '' : v);
  }
  for (const c of [].concat(children)) if (c) node.append(c);
  return node;
}

// якщо фото нема або файл не знайдено, показуємо плейсхолдер
function media(src, alt) {
  const placeholder = () => el('div', { class: 'ph', role: 'img', 'aria-label': `фото: ${alt}` }, el('span', { class: 'ph__label', text: 'фото' }));
  if (!src) return placeholder();
  const img = el('img', { src, alt, loading: 'lazy', decoding: 'async' });
  img.addEventListener('error', () => img.replaceWith(placeholder()), { once: true });
  return img;
}

// Меню

function renderFilters() {
  const wrap = $('#menu-filters');
  CATEGORIES.forEach((c, i) => {
    wrap.append(el('button', { class: 'chip', type: 'button', role: 'tab', 'aria-selected': String(i === 0), 'data-cat': c.id, text: c.title }));
  });
  wrap.addEventListener('click', (e) => {
    const btn = e.target.closest('.chip');
    if (!btn) return;
    $$('.chip', wrap).forEach((b) => b.setAttribute('aria-selected', String(b === btn)));
    renderMenu(btn.dataset.cat);
  });
}

function renderMenu(cat = 'all') {
  const grid = $('#menu-grid');
  grid.replaceChildren();
  MENU.filter((d) => cat === 'all' || d.cat === cat).forEach((d) => {
    grid.append(
      el('article', { class: 'dish' }, [
        el('div', { class: 'dish__media' }, media(d.img, d.name)),
        el('div', { class: 'dish__body' }, [
          el('span', { class: 'dish__cat', text: catTitle(d.cat) }),
          el('h3', { class: 'dish__name', text: d.name }),
          d.desc ? el('p', { class: 'dish__desc', text: d.desc }) : null,
          el('div', { class: 'dish__meta' }, [
            el('span', { class: 'dish__weight', text: `за 1 ${d.unit}` }),
            el('span', { class: 'dish__price', text: money(priceOf(d.id)) }),
          ]),
        ]),
      ])
    );
  });
}

// Шашлик на замовлення (кошик)

const cart = new Map(); // id -> кількість

function cartTotal() {
  let sum = 0;
  cart.forEach((q, id) => { sum += priceOf(id) * q; });
  return sum;
}

function cartText() {
  return [...cart].map(([id, q]) => {
    const d = itemById(id);
    return `${d.name} ${qtyText(q, d.unit)}`;
  }).join(', ');
}

function setQty(id, q) {
  const d = itemById(id);
  q = Math.max(0, Math.round(q / d.step) * d.step);
  if (q > 0) cart.set(id, q); else cart.delete(id);
  updateCart();
}

function renderCart() {
  const list = $('#cart-list');
  CATEGORIES.filter((c) => c.id !== 'all').forEach((c) => {
    const items = MENU.filter((d) => d.cat === c.id);
    if (!items.length) return;
    list.append(
      el('div', { class: 'dishes__group' }, [
        el('p', { class: 'dishes__group-title', text: c.title }),
        el('div', { class: 'cart__items' }, items.map((d) =>
          el('div', { class: 'cart__row', 'data-id': d.id }, [
            el('span', { class: 'cart__name' }, [
              el('span', { class: 'option__title', text: d.name }),
              el('span', { class: 'option__sub', text: `${money(priceOf(d.id))} / ${d.unit}` }),
            ]),
            el('span', { class: 'stepper' }, [
              el('button', { type: 'button', class: 'stepper__btn', 'data-act': 'dec', 'aria-label': `Менше: ${d.name}`, text: '−' }),
              el('span', { class: 'stepper__val', 'aria-live': 'polite', text: qtyText(0, d.unit) }),
              el('button', { type: 'button', class: 'stepper__btn', 'data-act': 'inc', 'aria-label': `Більше: ${d.name}`, text: '+' }),
            ]),
          ])
        )),
      ])
    );
  });
  list.addEventListener('click', (e) => {
    const btn = e.target.closest('.stepper__btn');
    if (!btn) return;
    const id = btn.closest('.cart__row').dataset.id;
    const d = itemById(id);
    setQty(id, (cart.get(id) || 0) + (btn.dataset.act === 'inc' ? d.step : -d.step));
  });
}

function updateCart() {
  $$('#cart-list .cart__row').forEach((row) => {
    const d = itemById(row.dataset.id);
    const q = cart.get(d.id) || 0;
    $('.stepper__val', row).textContent = qtyText(q, d.unit);
    row.classList.toggle('is-active', q > 0);
    $('[data-act="dec"]', row).disabled = q === 0;
  });
  const total = cartTotal();
  $('#cart-total').textContent = money(total);
  $('#cart-mini-total').textContent = money(total);
  $('#cart-lines').replaceChildren(...[...cart].map(([id, q]) => {
    const d = itemById(id);
    return el('li', {}, [el('span', { text: `${d.name}, ${qtyText(q, d.unit)}` }), el('span', { text: money(priceOf(id) * q) })]);
  }));
  $('#cart-hint').hidden = cart.size > 0;
  $('#cart-attach-text').textContent = cart.size ? `${cartText()}. Разом ${money(total)}` : 'поки порожнє';
  if (cart.size) $('#f-cart-error').textContent = '';
}

// Калькулятор кейтерингу

const calcState = { guests: GUESTS_DEFAULT, format: FORMATS[0].id, dishes: new Set(MENU.filter((d) => d.default).map((d) => d.id)) };
let calcAttached = false;

const perGuest = (id) => priceOf(id) * itemById(id).portion;

function calculate({ guests, format, dishes }) {
  const g = clamp(Math.round(Number(guests) || GUESTS_MIN), GUESTS_MIN, GUESTS_MAX);
  const perPerson = [...dishes].reduce((sum, id) => sum + perGuest(id), 0);
  const fee = (FORMATS.find((f) => f.id === format) || FORMATS[0]).fee;
  return { guests: g, perPerson, fee, total: Math.round(perPerson * g + fee) };
}

function portionText(d) {
  if (d.unit === 'кг') return `${Math.round(d.portion * 1000)} г на гостя`;
  if (d.portion >= 1) return `${d.portion} шт на гостя`;
  return `1 шт на ${Math.round(1 / d.portion)} гостей`;
}

function renderCalcOptions() {
  const formats = $('#calc-formats');
  FORMATS.forEach((f) => {
    formats.append(
      el('label', { class: 'option' }, [
        el('input', { type: 'radio', name: 'format', value: f.id, checked: f.id === calcState.format }),
        el('span', { class: 'option__text' }, [
          el('span', { class: 'option__title', text: f.title }),
          el('span', { class: 'option__sub', text: f.sub }),
          el('span', { class: 'option__sub', text: f.fee ? `+ ${money(f.fee)}` : 'без надбавки' }),
        ]),
      ])
    );
  });
  formats.addEventListener('change', (e) => {
    calcState.format = e.target.value;
    updateCalc();
  });

  const dishes = $('#calc-dishes');
  CATEGORIES.filter((c) => c.id !== 'all').forEach((c) => {
    const items = MENU.filter((d) => d.cat === c.id);
    if (!items.length) return;
    dishes.append(
      el('div', { class: 'dishes__group' }, [
        el('p', { class: 'dishes__group-title', text: c.title }),
        el('div', { class: 'dishes__list' }, items.map((d) =>
          el('label', { class: 'option option--dish' }, [
            el('input', { type: 'checkbox', value: d.id, checked: calcState.dishes.has(d.id) }),
            el('span', { class: 'option__text' }, [
              el('span', { class: 'option__name' }, [
                el('span', { class: 'option__title', text: d.name }),
                el('span', { class: 'option__sub', text: portionText(d) }),
              ]),
              el('span', { class: 'option__price', text: money(perGuest(d.id)) }),
            ]),
          ])
        )),
      ])
    );
  });
  dishes.addEventListener('change', (e) => {
    if (e.target.type !== 'checkbox') return;
    e.target.checked ? calcState.dishes.add(e.target.value) : calcState.dishes.delete(e.target.value);
    updateCalc();
  });
}

function initGuests() {
  const range = $('#guests-range');
  const number = $('#guests-number');
  const setFill = () => range.style.setProperty('--fill', ((range.value - GUESTS_MIN) / (GUESTS_MAX - GUESTS_MIN)) * 100 + '%');

  range.addEventListener('input', () => {
    number.value = range.value;
    calcState.guests = Number(range.value);
    setFill();
    updateCalc();
  });
  // під час набору рахуємо з урахуванням меж, але не переписуємо поле
  number.addEventListener('input', () => {
    const v = Number(number.value);
    if (number.value === '' || Number.isNaN(v)) return;
    calcState.guests = clamp(Math.round(v), GUESTS_MIN, GUESTS_MAX);
    range.value = calcState.guests;
    setFill();
    updateCalc();
  });
  // після виходу з поля приводимо число до меж
  const fix = () => { number.value = calcState.guests; };
  number.addEventListener('change', fix);
  number.addEventListener('blur', fix);
  setFill();
}

function calcSummaryText() {
  const r = calculate(calcState);
  const format = FORMATS.find((f) => f.id === calcState.format).title;
  const names = MENU.filter((d) => calcState.dishes.has(d.id)).map((d) => d.name);
  return { r, format, names, short: `${format}, ${r.guests} ${plural(r.guests, 'гість', 'гості', 'гостей')}, ${names.length} ${plural(names.length, 'позиція', 'позиції', 'позицій')}, орієнтовно ${money(r.total)}` };
}

function updateCalc() {
  const r = calculate(calcState);
  $('#calc-total').textContent = money(r.total);
  $('#calc-mini-total').textContent = money(r.total);
  $('#calc-per-person').textContent = money(r.perPerson);
  $('#calc-guests').textContent = r.guests;
  $('#calc-fee').textContent = money(r.fee);
  $('#calc-hint').hidden = calcState.dishes.size > 0;
  if (calcAttached) $('#calc-attach-text').textContent = calcSummaryText().short;
}

// Галерея + lightbox

let lbIndex = 0;
let lbReturnFocus = null;

function renderGallery() {
  const grid = $('#gallery-grid');
  GALLERY.forEach((g, i) => {
    const btn = el('button', {
      class: 'gallery__item' + (g.size ? ` gallery__item--${g.size}` : ''),
      type: 'button',
      'aria-label': `Відкрити фото: ${g.alt}`,
    }, media(g.src, g.alt));
    btn.addEventListener('click', () => openLightbox(i));
    grid.append(btn);
  });
}

function showLightboxItem(i) {
  lbIndex = (i + GALLERY.length) % GALLERY.length;
  const g = GALLERY[lbIndex];
  const m = media(g.src, g.alt);
  if (m.tagName === 'IMG') m.removeAttribute('loading');
  $('#lightbox-media').replaceChildren(m);
  $('#lightbox-caption').textContent = `${g.alt} (${lbIndex + 1}/${GALLERY.length})`;
}

function openLightbox(i) {
  const lb = $('#lightbox');
  lbReturnFocus = document.activeElement;
  showLightboxItem(i);
  lb.hidden = false;
  document.body.classList.add('no-scroll');
  requestAnimationFrame(() => lb.classList.add('is-open'));
  $('.lightbox__close', lb).focus();
}

function closeLightbox() {
  const lb = $('#lightbox');
  lb.classList.remove('is-open');
  document.body.classList.remove('no-scroll');
  setTimeout(() => { lb.hidden = true; }, 200);
  if (lbReturnFocus) lbReturnFocus.focus();
}

function initLightbox() {
  const lb = $('#lightbox');
  $('.lightbox__close', lb).addEventListener('click', closeLightbox);
  $('.lightbox__prev', lb).addEventListener('click', () => showLightboxItem(lbIndex - 1));
  $('.lightbox__next', lb).addEventListener('click', () => showLightboxItem(lbIndex + 1));
  lb.addEventListener('click', (e) => { if (e.target === lb) closeLightbox(); });

  document.addEventListener('keydown', (e) => {
    if (lb.hidden) return;
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowLeft') showLightboxItem(lbIndex - 1);
    else if (e.key === 'ArrowRight') showLightboxItem(lbIndex + 1);
    else if (e.key === 'Tab') {
      // фокус не виходить за межі lightbox
      const btns = $$('button', lb);
      const first = btns[0];
      const last = btns[btns.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  // свайпи на телефоні
  let x0 = null;
  lb.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) showLightboxItem(lbIndex + (dx < 0 ? 1 : -1));
    x0 = null;
  });
}

// Форма заявки

function todayISO() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

function normalizePhone(raw) {
  const digits = String(raw).replace(/\D/g, '');
  if (/^380\d{9}$/.test(digits)) return '+' + digits;
  if (/^0\d{9}$/.test(digits)) return '+38' + digits;
  return null;
}

function formatDateUA(iso) {
  const [y, m, d] = iso.split('-');
  return `${d}.${m}.${y}`;
}

function orderMode() {
  return $('#order-form').elements.type.value;
}

function setOrderMode(mode) {
  const form = $('#order-form');
  form.elements.type.value = mode;
  $$('[data-mode]', form).forEach((n) => { n.hidden = n.dataset.mode !== mode; });
  $('#calc-attach').hidden = mode !== 'catering' || !calcAttached;
  updateAddressField();
  $('#f-comment').placeholder = mode === 'catering' ? 'Наприклад: весілля, без свинини' : 'Наприклад: нарізати, додати серветки';
}

function updateAddressField() {
  const form = $('#order-form');
  const show = orderMode() === 'takeaway' && form.elements.delivery.value === 'delivery';
  $('#address-field').hidden = !show;
}

// повертає { поле: текст помилки }; перевіряє лише поля поточного типу заявки
function validateOrder(data) {
  const errors = {};
  if (data.name.trim().length < 2) errors.name = "Вкажіть ім'я (мінімум 2 літери).";
  if (!data.phone.trim()) errors.phone = 'Вкажіть телефон.';
  else if (!normalizePhone(data.phone)) errors.phone = 'Формат: +380 XX XXX XX XX або 0XX XXX XX XX.';
  if (!data.date) errors.date = 'Оберіть дату.';
  else if (data.date < todayISO()) errors.date = 'Дата не може бути в минулому.';

  if (data.type === 'catering') {
    if (!data.place.trim()) errors.place = 'Вкажіть місце проведення.';
    const g = Number(data.guests);
    if (data.guests === '') errors.guests = 'Вкажіть кількість гостей.';
    else if (!Number.isInteger(g) || g < GUESTS_MIN || g > GUESTS_MAX) errors.guests = `Від ${GUESTS_MIN} до ${GUESTS_MAX} гостей.`;
  } else {
    if (data.delivery === 'delivery' && !data.address.trim()) errors.address = 'Вкажіть адресу доставки.';
    if (cart.size === 0) errors.cart = 'Додайте хоча б одну позицію в замовлення вище.';
  }
  return errors;
}

function buildMessage(data) {
  const head = data.type === 'catering' ? 'Заявка на кейтеринг з сайту Fayna Gostyna' : 'Замовлення шашлику з сайту Fayna Gostyna';
  const lines = [
    head,
    '',
    `Ім'я: ${data.name.trim()}`,
    `Телефон: ${normalizePhone(data.phone)}`,
    `Дата: ${formatDateUA(data.date)}${data.type === 'takeaway' && data.time ? ', ' + data.time : ''}`,
  ];
  if (data.type === 'catering') {
    lines.push(`Місце: ${data.place.trim()}`, `Гостей: ${Number(data.guests)}`);
  } else {
    lines.push(data.delivery === 'delivery' ? `Доставка: ${data.address.trim()}` : 'Самовивіз');
    lines.push('', 'Замовлення:');
    cart.forEach((q, id) => {
      const d = itemById(id);
      lines.push(`${d.name}: ${qtyText(q, d.unit)} = ${money(priceOf(id) * q)}`);
    });
    lines.push(`Разом: ${money(cartTotal())}`);
  }
  if (data.comment.trim()) lines.push('', `Коментар: ${data.comment.trim()}`);
  if (data.type === 'catering' && calcAttached) {
    const s = calcSummaryText();
    lines.push(
      '',
      'Розрахунок з калькулятора:',
      `Формат: ${s.format}`,
      `Страви: ${s.names.join(', ') || 'не обрано'}`,
      `Гостей у розрахунку: ${s.r.guests}`,
      `Орієнтовна сума: ${money(s.r.total)}`
    );
  }
  return lines.join('\n');
}

function initForm() {
  const form = $('#order-form');
  const thanks = $('#thanks');
  const fields = ['name', 'phone', 'date', 'address', 'guests', 'place', 'cart'];
  $('#f-date').min = todayISO();

  const showErrors = (errors) => {
    fields.forEach((f) => {
      const msg = errors[f] || '';
      $(`#f-${f}-error`).textContent = msg;
      const input = form.elements[f];
      if (!input) return;
      input.setAttribute('aria-invalid', String(Boolean(msg)));
      if (msg) input.setAttribute('aria-describedby', `f-${f}-error`);
      else input.removeAttribute('aria-describedby');
    });
  };

  form.addEventListener('change', (e) => {
    if (e.target.name === 'type') { setOrderMode(e.target.value); showErrors({}); }
    if (e.target.name === 'delivery') updateAddressField();
  });

  // прибираємо помилку поля, щойно її виправили
  form.addEventListener('input', (e) => {
    const name = e.target.name;
    if (!fields.includes(name) || e.target.getAttribute('aria-invalid') !== 'true') return;
    const err = validateOrder(Object.fromEntries(new FormData(form)))[name];
    if (!err) { $(`#f-${name}-error`).textContent = ''; e.target.setAttribute('aria-invalid', 'false'); }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    const errors = validateOrder(data);
    showErrors(errors);
    const firstInvalid = fields.find((f) => errors[f]);
    if (firstInvalid) {
      if (form.elements[firstInvalid]) form.elements[firstInvalid].focus();
      else $('#cart-attach').scrollIntoView({ block: 'center' });
      return;
    }

    const text = buildMessage(data);
    const url = `https://t.me/${TELEGRAM_USERNAME}?text=${encodeURIComponent(text)}`;
    if (TELEGRAM_USERNAME && TELEGRAM_USERNAME !== 'YOUR_USERNAME') {
      window.open(url, '_blank', 'noopener');
    } else {
      console.info('[Демо] TELEGRAM_USERNAME не задано. Посилання на заявку:\n' + url + '\n\n' + text);
    }

    form.hidden = true;
    thanks.hidden = false;
    thanks.focus();
  });

  $('#thanks-reset').addEventListener('click', () => {
    form.reset();
    showErrors({});
    cart.clear();
    updateCart();
    calcAttached = false;
    setOrderMode('takeaway');
    thanks.hidden = true;
    form.hidden = false;
    form.elements.name.focus();
  });

  $('#cart-to-order').addEventListener('click', () => setOrderMode('takeaway'));
  $('#calc-to-order').addEventListener('click', () => {
    calcAttached = true;
    $('#f-guests').value = calculate(calcState).guests;
    $('#calc-attach-text').textContent = calcSummaryText().short;
    setOrderMode('catering');
  });
  $('#calc-detach').addEventListener('click', () => {
    calcAttached = false;
    $('#calc-attach').hidden = true;
  });

  setOrderMode('takeaway');
}

// Старт

document.addEventListener('DOMContentLoaded', () => {
  renderFilters();
  renderMenu();
  renderCart();
  updateCart();
  renderCalcOptions();
  initGuests();
  updateCalc();
  renderGallery();
  initLightbox();
  initForm();
  $('#year').textContent = new Date().getFullYear();
});
