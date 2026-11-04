/* =================================================================
   Portafolio Ariana Capuñay — interacciones
================================================================= */
(function () {
  'use strict';

  const $  = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  const DATA = window.PROJECTS || [];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- AURA ---------------- */
  (function () {
    const aura = $('#aura');
    if (!aura || !matchMedia('(hover:hover) and (pointer:fine)').matches) return;
    let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y;
    addEventListener('mousemove', e => {
      x = e.clientX; y = e.clientY;
      aura.classList.add('live');
    });
    (function loop () {
      cx += (x - cx) * .08; cy += (y - cy) * .08;
      aura.style.transform = `translate(${cx}px, ${cy}px)`;
      requestAnimationFrame(loop);
    })();
  })();

  /* ---------------- DRAWER ---------------- */
  (function () {
    const btn = $('#navBtn'), dr = $('#drawer'), hd = $('.hd');
    const set = on => {
      dr.classList.toggle('open', on);
      hd.classList.toggle('open', on);
      document.body.classList.toggle('stop', on);
      btn.setAttribute('aria-expanded', String(on));
      dr.setAttribute('aria-hidden', String(!on));
      $('span', btn).textContent = on ? 'Cerrar' : 'Menú';
    };
    btn.addEventListener('click', () => set(!dr.classList.contains('open')));
    dr.addEventListener('click', e => { if (e.target.closest('a')) set(false); });
    addEventListener('keydown', e => { if (e.key === 'Escape' && dr.classList.contains('open')) set(false); });
  })();

  $('#up').addEventListener('click', () =>
    scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }));

  /* ---------------- PANELES ---------------- */
  const panels = $('#panels');
  const dial = $('#dial');

  const SLOT = ['a', 'b', 'c'];

  panels.innerHTML = DATA.map((p, i) => {
    const n = String(i + 1).padStart(2, '0');

    const shots = p.gallery.slice(0, 3).map((g, k) => `
      <figure class="shot shot--${SLOT[k]}" data-p="${i}" data-k="${k}"
              data-depth="${[0.10, -0.16, 0.22][k]}"
              role="button" tabindex="0"
              aria-label="Ampliar la pieza ${k + 1} de ${p.title}">
        <span class="shot__frame">
          <img src="${g}" alt="${p.title} — pieza ${k + 1}" loading="lazy">
        </span>
        <b class="shot__n" aria-hidden="true">${String(k + 1).padStart(2, '0')}</b>
      </figure>`).join('');

    const pal = (p.palette || []).length
      ? `<div><dt>Paleta</dt><dd class="swatchline">${p.palette.map(c =>
          `<i style="background:${c.hex}" title="${c.hex}"></i>`).join('')}<u>${p.palette.map(c => c.hex).join(' · ')}</u></dd></div>`
      : '';

    const band = `<span>${p.title}</span><i>✦</i>`.repeat(6);

    return `
      <article class="panel" id="p-${p.id}" data-n="${n}">
        <div class="band" aria-hidden="true"><div class="band__t">${band}</div></div>

        <div class="panel__in">
          <div class="panel__txt">
            <p class="panel__kind"><s></s>${n} · ${p.catLabel}</p>
            <h3 class="panel__t">${p.title}</h3>
            <p class="panel__tag">${p.subtitle} · ${p.year}</p>

            <dl class="rows">
              <div><dt>El proyecto</dt><dd>${p.desc}</dd></div>
              <div><dt>El reto</dt><dd>${p.problem}</dd></div>
              <div><dt>Cómo lo resolví</dt><dd>${p.solution}</dd></div>
              <div><dt>Curso</dt><dd>${p.course}</dd></div>
              ${pal}
            </dl>

            <div class="chipline">${p.tools.map(t => `<span>${t}</span>`).join('')}</div>
            <p class="panel__hint">${p.gallery.length} ${p.gallery.length === 1 ? 'pieza' : 'piezas'} · clic para ampliar</p>
          </div>

          <div class="collage collage--${Math.min(p.gallery.length, 3)}">${shots}</div>
        </div>
      </article>`;
  }).join('');

  dial.innerHTML = DATA.map((p, i) => `
    <li><button data-go="${i}" aria-label="Ir a ${p.title}">${String(i + 1).padStart(2, '0')}</button></li>`).join('');

  dial.addEventListener('click', e => {
    const b = e.target.closest('[data-go]');
    if (!b) return;
    const el = $$('.panel')[+b.dataset.go];
    if (!el) return;
    // offsetTop es relativo a .deck (que está posicionado): hay que usar el rect
    const y = el.getBoundingClientRect().top + scrollY;
    scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
  });

  /* marca el panel visible en la rueda lateral */
  const items = $$('#dial li');
  const panelIO = new IntersectionObserver(es => {
    es.forEach(en => {
      if (!en.isIntersecting) return;
      const i = $$('.panel').indexOf(en.target);
      items.forEach((li, k) => li.classList.toggle('on', k === i));
    });
  }, { threshold: .45 });
  $$('.panel').forEach(p => panelIO.observe(p));

  /* la rueda solo aparece dentro del deck */
  new IntersectionObserver(es => dial.classList.toggle('live', es[0].isIntersecting),
    { threshold: .04 }).observe($('#deck'));

  /* ---------------- PARALLAX DEL COLLAGE ---------------- */
  (function () {
    if (reduced) return;
    const layers = $$('.shot[data-depth]');
    if (!layers.length) return;
    let going = false;

    function move () {
      const mid = innerHeight / 2;
      layers.forEach(l => {
        const r = l.getBoundingClientRect();
        if (r.bottom < -200 || r.top > innerHeight + 200) return;
        const off = ((r.top + r.height / 2) - mid) / mid;   // -1 … 1
        l.style.setProperty('--py', (off * parseFloat(l.dataset.depth) * 110).toFixed(1) + 'px');
      });
      going = false;
    }
    addEventListener('scroll', () => { if (!going) { requestAnimationFrame(move); going = true; } }, { passive: true });
    addEventListener('resize', move);
    move();
  })();

  /* ---------------- TILT 3D AL PASAR EL CURSOR ---------------- */
  (function () {
    if (reduced || !matchMedia('(hover:hover) and (pointer:fine)').matches) return;
    $$('.shot').forEach(fig => {
      const fr = $('.shot__frame', fig);
      fig.addEventListener('pointermove', e => {
        const r = fig.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5;
        const y = (e.clientY - r.top) / r.height - .5;
        fr.style.transform = `perspective(900px) rotateX(${(-y * 7).toFixed(2)}deg) rotateY(${(x * 9).toFixed(2)}deg) scale(1.03)`;
      });
      fig.addEventListener('pointerleave', () => { fr.style.transform = ''; });
    });
  })();

  /* ---------------- PALETA ---------------- */
  (function () {
    const box = $('#chips');
    const src = DATA.find(p => p.palette && p.palette.length);
    if (!box || !src) return;
    box.innerHTML = src.palette.map(c => `
      <button class="chip" data-hex="${c.hex}" title="Copiar ${c.hex}">
        <i style="background:${c.hex}"></i><u>${c.hex}</u><small>${c.name}</small>
      </button>`).join('');
    box.addEventListener('click', e => {
      const ch = e.target.closest('.chip');
      if (!ch) return;
      const done = () => { ch.classList.add('copied'); setTimeout(() => ch.classList.remove('copied'), 1500); };
      if (navigator.clipboard) navigator.clipboard.writeText(ch.dataset.hex).then(done).catch(done);
      else done();
    });
  })();

  /* ---------------- ZOOM ---------------- */
  const zoom = $('#zoom'), zImg = $('#zImg');
  let zp = 0, zk = 0;

  function paintZ () {
    const p = DATA[zp];
    zImg.src = p.gallery[zk];
    zImg.alt = `${p.title} — pieza ${zk + 1}`;
    $('#zTitle').textContent = p.title;
    $('#zN').textContent = `${zk + 1} / ${p.gallery.length}`;
    $('#zBox').scrollTop = 0;
  }
  let zBack = null;
  function openZ (pi, ki) {
    zBack = document.activeElement;
    zp = pi; zk = ki; paintZ();
    zoom.hidden = false;
    document.body.classList.add('stop');
    requestAnimationFrame(() => {
      zoom.classList.add('live');
      $('#zX').focus();
    });
  }
  function closeZ () {
    zoom.classList.remove('live');
    document.body.classList.remove('stop');
    setTimeout(() => { zoom.hidden = true; }, 340);
    if (zBack && zBack.focus) zBack.focus();
  }
  function stepZ (d) {
    const g = DATA[zp].gallery;
    zk = (zk + d + g.length) % g.length;
    paintZ();
  }

  panels.addEventListener('click', e => {
    const f = e.target.closest('.shot');
    if (f) openZ(+f.dataset.p, +f.dataset.k);
  });
  panels.addEventListener('keydown', e => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const f = e.target.closest('.shot');
    if (!f) return;
    e.preventDefault();
    openZ(+f.dataset.p, +f.dataset.k);
  });

  $('#zX').addEventListener('click', closeZ);
  $('#zPrev').addEventListener('click', () => stepZ(-1));
  $('#zNext').addEventListener('click', () => stepZ(1));
  $('#zBox').addEventListener('click', e => { if (e.target === e.currentTarget) closeZ(); });

  addEventListener('keydown', e => {
    if (zoom.hidden) return;
    if (e.key === 'Escape')     closeZ();
    if (e.key === 'ArrowLeft')  stepZ(-1);
    if (e.key === 'ArrowRight') stepZ(1);
  });

  let tx = 0;
  $('#zBox').addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
  $('#zBox').addEventListener('touchend', e => {
    const d = e.changedTouches[0].clientX - tx;
    if (Math.abs(d) > 70) stepZ(d < 0 ? 1 : -1);
  }, { passive: true });

  /* ---------------- REVEAL ---------------- */
  const io = new IntersectionObserver(es => {
    es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: .12, rootMargin: '0px 0px -5% 0px' });

  ['.over', '.giant', '.intro__sub', '.key', '.intro__r',
   '.perfil__side', '.perfil__body', '.deck__hd',
   '.panel__txt', '.color > *', '.fin > *'].forEach(sel => {
    $$(sel).forEach(el => { el.classList.add('rv'); io.observe(el); });
  });

  /* las piezas entran con un barrido, una tras otra */
  const shotIO = new IntersectionObserver(es => {
    es.forEach(en => {
      if (!en.isIntersecting) return;
      const k = +en.target.dataset.k || 0;
      setTimeout(() => en.target.classList.add('in'), k * 140);
      shotIO.unobserve(en.target);
    });
  }, { threshold: .2 });
  $$('.shot').forEach(s => shotIO.observe(s));

})();
