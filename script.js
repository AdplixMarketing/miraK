/* Mira K site. Reads the catalog in data/works.js and draws every page from it. */
(function () {
  'use strict';
  var SITE = window.SITE || {}, WORKS = window.WORKS || [];
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ESC[c]; }); }
  function money(n) { return '$' + Number(n).toLocaleString('en-US'); }
  function dims(w) { return w.size.w + ' x ' + w.size.h + ' in'; }
  function workUrl(w) { return 'work.html?id=' + encodeURIComponent(w.id); }

  function lum(hex) {
    var n = parseInt(hex.slice(1), 16);
    var c = [n >> 16 & 255, n >> 8 & 255, n & 255].map(function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  }
  /* Buttons and the colored band take the darkest pigment of the painting in view,
     as long as white text stays readable on it. */
  function inkPage(w) {
    var p = ((w && w.pigments) || []).slice().sort(function (a, b) { return lum(a.hex) - lum(b.hex); })[0];
    if (p && 1.05 / (lum(p.hex) + 0.05) >= 4.5) document.documentElement.style.setProperty('--deep', p.hex);
    var sorted = ((w && w.pigments) || []).slice().sort(function (a, b) { return lum(a.hex) - lum(b.hex); });
    if (sorted.length) document.documentElement.style.setProperty('--mid', sorted[Math.floor(sorted.length / 2)].hex);
  }
  /* "Loading the palette": brush each group of swatches in when it scrolls into view. */
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.35 }) : null;
  function watch() {
    Array.prototype.forEach.call(document.querySelectorAll('.swatches:not(.in), .chips:not(.in)'), function (el) { if (io) io.observe(el); else el.classList.add('in'); });
  }

  function minPrint(w) { return w.prints && w.prints.length ? Math.min.apply(null, w.prints.map(function (p) { return p.price; })) : null; }
  function isAvailable(w) { return !!(w.original && !w.original.sold); }
  function priceLines(w) {
    var out = [], mp = minPrint(w);
    if (w.original) out.push(w.original.sold ? '<span class="sold">Original sold</span>' : 'Original ' + money(w.original.price));
    if (mp !== null) out.push('Prints from ' + money(mp));
    return out.join('<br>');
  }
  function img(w, cls, eager) {
    return '<img class="painting ' + (cls || '') + '" src="' + esc(w.image) + '" alt="' + esc(w.alt) + '" width="' + w.size.w * 50 + '" height="' + w.size.h * 50 + '"' + (eager === true ? ' fetchpriority="high"' : eager === 'now' ? '' : ' loading="lazy" decoding="async"') + '>';
  }
  function swatches(w) {
    return '<ul class="swatches" aria-label="Paint colors used in ' + esc(w.title) + '">' + (w.pigments || []).map(function (p, i) {
      return '<li class="swatch" style="--c:' + esc(p.hex) + ';--i:' + i + '"><span class="swatch-stroke"><span class="swatch-paint"></span></span><span class="swatch-name">' + esc(p.name) + '</span></li>';
    }).join('') + '</ul>';
  }
  function chips(w) {
    return '<span class="chips" aria-hidden="true">' + (w.pigments || []).map(function (p, i) { return '<span style="--c:' + esc(p.hex) + ';--i:' + i + '"></span>'; }).join('') + '</span>';
  }
  function card(w, eager) {
    return '<a class="card" href="' + workUrl(w) + '">' + img(w, '', eager) + chips(w) +
      '<span class="card-title">' + esc(w.title) + '</span>' +
      '<span class="card-meta">' + esc(w.medium) + ', ' + dims(w) + '</span>' +
      '<span class="card-price">' + priceLines(w) + '</span></a>';
  }
  /* With a Stripe link the button goes to checkout. Without one it opens the contact form with the piece filled in. */
  function buyButton(w, what, price, link) {
    var label = (link ? 'Buy ' : 'Ask to buy ') + what + ' for ' + money(price);
    var href = link || 'contact.html?piece=' + encodeURIComponent(w.id) + '&want=' + encodeURIComponent(what);
    return '<a class="button" href="' + esc(href) + '">' + esc(label) + '</a>';
  }

  /* shared chrome */
  Array.prototype.forEach.call(document.querySelectorAll('[data-artist]'), function (el) { if (SITE.artist) el.textContent = SITE.artist; });
  var strip = $('.preview'); if (strip && SITE.preview) strip.hidden = false;
  var ig = $('[data-instagram]'); if (ig && SITE.instagram) { ig.href = SITE.instagram; ig.hidden = false; }
  var yr = $('[data-year]'); if (yr) yr.textContent = new Date().getFullYear();

  /* home */
  var hero = $('#hero-piece');
  if (hero && WORKS.length) {
    var f = WORKS[0];
    inkPage(f);
    hero.innerHTML = '<a class="hero-art" style="--ar:' + (f.size.w / f.size.h) + '" href="' + workUrl(f) + '" aria-label="' + esc(f.title) + '">' + img(f, '', true) + '</a>' + swatches(f) +
      '<div class="hero-info"><h2>' + esc(f.title) + '</h2><p class="muted">' + esc(f.medium) + ', ' + dims(f) + '</p>' +
      '<p class="price">' + priceLines(f) + '</p><a class="button" href="' + workUrl(f) + '">View painting</a></div>';
    var recent = $('#recent');
    if (recent) recent.innerHTML = WORKS.slice(1, 6).map(function (x) { return card(x); }).join('');
  }

  /* paintings page */
  var all = $('#all-works');
  if (all) {
    var subject = 'All', onlyAvailable = false, empty = $('#no-works');
    var draw = function () {
      var list = WORKS.filter(function (w) { return (subject === 'All' || w.subject === subject) && (!onlyAvailable || isAvailable(w)); });
      all.innerHTML = list.map(function (x) { return card(x); }).join('');
      empty.hidden = list.length > 0;
      watch();
    };
    var set = function (s) {
      subject = s;
      Array.prototype.forEach.call(document.querySelectorAll('.filter'), function (b) { b.setAttribute('aria-pressed', String(b.dataset.filter === s)); });
      draw();
    };
    document.addEventListener('click', function (e) {
      var b = e.target.closest('.filter'); if (b) set(b.dataset.filter);
      if (e.target.closest('#show-all')) { onlyAvailable = false; $('#only-available').checked = false; set('All'); }
    });
    $('#only-available').addEventListener('change', function (e) { onlyAvailable = e.target.checked; draw(); });
    draw();
  }

  /* one painting */
  var workEl = $('#work');
  if (workEl) {
    var id = new URLSearchParams(location.search).get('id');
    var w = WORKS.filter(function (x) { return x.id === id; })[0];
    if (!w) {
      workEl.innerHTML = '<div class="empty"><h1>That painting is not here</h1><p class="muted" style="margin-top:1rem">The link may be old, or the piece was taken down.</p><a class="button" href="paintings.html">See all paintings</a></div>';
      workEl.classList.remove('work');
    } else {
      inkPage(w);
      document.title = w.title + ' | ' + (SITE.artist || 'Paintings');
      var md = $('meta[name="description"]'); if (md) md.content = w.title + ', ' + w.medium + ', ' + dims(w) + '. ' + w.alt;
      var buy = '';
      var hasLink = !!((w.original && w.original.link) || (w.prints || []).some(function (p) { return p.link; }));
      if (w.original) {
        buy += '<div class="buy-row"><h2>The original</h2>' + (w.original.sold
          ? '<p class="sold">Sold. This one has gone to its new home.</p>'
          : '<p class="buy-note">' + esc(SITE.originalNote || 'One of a kind.') + '</p>' + buyButton(w, 'the original', w.original.price, w.original.link)) + '</div>';
      }
      if (w.prints && w.prints.length) {
        buy += '<div class="buy-row"><h2>Prints</h2><label class="visually-hidden" for="print-size">Print size</label><select id="print-size">' +
          w.prints.map(function (p, i) { return '<option value="' + i + '">' + esc(p.size) + ', ' + money(p.price) + '</option>'; }).join('') +
          '</select><span id="print-buy"></span></div>';
      }
      if (!buy) buy = '<div class="buy-row"><p class="sold">Not for sale right now.</p></div>';
      /* scale drawing: units are inches, the sofa is 84 in wide */
      var px = 70 - w.size.w / 2, py = 54 - w.size.h;
      var scale = py < 4 ? '' : '<figure class="scale"><svg viewBox="0 0 140 100" role="img" aria-label="' + esc(w.title) + ' drawn to scale above a seven foot sofa">' +
        '<line x1="0" y1="96" x2="140" y2="96" stroke="currentColor" stroke-width=".4"/>' +
        '<g fill="none" stroke="currentColor" stroke-width=".5"><rect x="28" y="64" width="84" height="18" rx="2"/><rect x="24" y="72" width="8" height="22" rx="2"/><rect x="108" y="72" width="8" height="22" rx="2"/><rect x="32" y="80" width="76" height="12" rx="1.5"/><line x1="70" y1="80" x2="70" y2="92"/><line x1="34" y1="92" x2="34" y2="96"/><line x1="106" y1="92" x2="106" y2="96"/></g>' +
        '<image href="' + esc(w.image) + '" x="' + px + '" y="' + py + '" width="' + w.size.w + '" height="' + w.size.h + '" preserveAspectRatio="none"/>' +
        '</svg><figcaption>The original to scale, above a 7 foot sofa.</figcaption></figure>';
      workEl.innerHTML = '<div class="work-figure">' + img(w, '', true) + '<h2>Mixed from</h2>' + swatches(w) + '</div><div class="work-info">' +
        '<div><h1>' + esc(w.title) + '</h1><p class="muted">' + esc(w.medium) + ', ' + dims(w) + ', ' + esc(w.year) + '</p></div>' +
        '<div class="buy">' + buy + '<p class="buy-note">' + (hasLink ? 'Secure checkout by Stripe. ' : '') + '<a href="policies.html">Shipping and returns</a></p></div>' +
        (w.story ? '<p>' + esc(w.story) + '</p>' : '') + scale + '</div>';
      var sel = $('#print-size');
      if (sel) {
        var drawPrint = function () { var p = w.prints[+sel.value]; $('#print-buy').innerHTML = buyButton(w, 'the ' + p.size + ' print', p.price, p.link); };
        sel.addEventListener('change', drawPrint); drawPrint();
      }
      var more = $('#more');
      if (more) more.innerHTML = WORKS.filter(function (x) { return x.id !== w.id; }).slice(0, 3).map(function (x) { return card(x, 'now'); }).join('');
    }
  }

  /* sample sales copy on the home page comes from the catalog file so it gets reviewed with everything else */
  Array.prototype.forEach.call(document.querySelectorAll('[data-copy]'), function (el) { var t = SITE[el.getAttribute('data-copy')]; if (t) el.textContent = t; });

  /* contact form */
  var form = $('#contact-form');
  if (form) {
    var q = new URLSearchParams(location.search), piece = WORKS.filter(function (x) { return x.id === q.get('piece'); })[0];
    if (piece) {
      inkPage(piece);
      var want = q.get('want') || 'a piece';
      if (/original/.test(want) && piece.original && piece.original.sold) {
        form.elements.message.value = 'Hi, I see the original of "' + piece.title + '" has sold. I would like to ask about prints or similar paintings.';
        $('#contact-lead').textContent = 'The original of this painting has sold. Ask about prints or similar work below.';
      } else {
        form.elements.message.value = 'Hi, I would like to buy ' + want + ' of "' + piece.title + '."\n\nMy shipping city and state: ';
        $('#contact-lead').textContent = 'Send this note and you will get a reply with payment and shipping details.';
      }
    }
    var status = $('#form-status');
    var fail = function (name, msg) {
      var el = form.elements[name], err = $('#' + name + '-error');
      el.setAttribute('aria-invalid', msg ? 'true' : 'false'); err.textContent = msg || ''; err.hidden = !msg;
      return !msg;
    };
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.elements.name.value.trim(), email = form.elements.email.value.trim(), message = form.elements.message.value.trim();
      var ok = [fail('name', name ? '' : 'Enter your name.'),
        fail('email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? '' : 'Enter an email address like name@example.com.'),
        fail('message', message ? '' : 'Write a short message.')].every(Boolean);
      status.className = 'form-status';
      if (!ok) { status.textContent = ''; var bad = $('[aria-invalid="true"]', form); if (bad) bad.focus(); return; }
      if (form.elements.website.value) return; /* spam trap */
      if (!SITE.email) { status.className = 'form-status is-error'; status.textContent = 'Messages cannot be sent from this page yet. Please check back soon.'; return; }
      var btn = $('button', form); btn.disabled = true; btn.textContent = 'Sending';
      fetch('https://formsubmit.co/ajax/' + encodeURIComponent(SITE.email), {
        method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name: name, email: email, message: message, _subject: 'Message from the website' })
      }).then(function (r) { if (!r.ok) throw new Error(); form.reset(); status.textContent = 'Message sent. You will get a reply by email.'; })
        .catch(function () { status.className = 'form-status is-error'; status.textContent = 'The message did not send. Check your connection and send it again.'; })
        .then(function () { btn.disabled = false; btn.textContent = 'Send message'; });
    });
  }
  watch();
})();
