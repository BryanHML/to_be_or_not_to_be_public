(() => {
  'use strict';

  const C = window.CONFIG;
  const urlLang = new URLSearchParams(location.search).get('lang');
  let lang = C.text[urlLang] ? urlLang : C.defaultLang;
  let T = C.text[lang]; // the words in the current language
  const $ = (id) => document.getElementById(id);
  const fill = (s) => String(s).split('{herName}').join(C.herName).split('{yourName}').join(C.yourName);
  const rand = (min, max) => min + Math.random() * (max - min);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const els = {
    scene: $('scene'),
    stars: $('stars'),
    shooting: $('shooting'),
    ground: $('ground'),
    fireflies: $('fireflies'),
    favs: $('favs'),
    ask: $('ask'),
    kicker: $('kicker'),
    subtitle: $('subtitle'),
    card: $('ask-card'),
    choices: $('choices'),
    yes: $('yes'),
    no: $('no'),
    slot: $('no-slot'),
    envelopeScreen: $('envelope-screen'),
    openLetter: $('open-letter'),
    letterScreen: $('letter-screen'),
    replay: $('replay'),
    music: $('music'),
    musicToggle: $('music-toggle'),
    musicVolume: $('music-volume'),
    song: $('song'),
    lang: document.querySelector('.lang')
  };

  // How many "no" attempts it takes for the button to leave for good.
  const LAST_NO = T.messages.length - 1;

  /* ------------------------------------------------------------------ */
  /* Scene                                                               */
  /* ------------------------------------------------------------------ */

  function makeStars() {
    const area = window.innerWidth * window.innerHeight;
    const count = Math.round(Math.min(150, Math.max(50, area / 9000)));
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const s = document.createElement('span');
      const roll = Math.random();
      const size = roll < 0.12 ? 3 : roll < 0.5 ? 2 : 1.5;
      s.className = 'star';
      s.style.left = rand(0, 100) + '%';
      s.style.top = rand(0, 62) + '%';
      s.style.width = s.style.height = size + 'px';
      s.style.animationDelay = rand(0, 4).toFixed(2) + 's';
      s.style.animationDuration = rand(2.4, 4.4).toFixed(2) + 's';
      frag.appendChild(s);
    }
    els.stars.replaceChildren(frag);
  }

  function makeFireflies() {
    const count = window.innerWidth < 600 ? 6 : 10;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const f = document.createElement('span');
      const delay = rand(0, 3).toFixed(2) + 's';
      f.className = 'firefly';
      f.style.left = rand(3, 97) + '%';
      f.style.top = rand(62, 95) + '%';
      f.style.animationDelay = delay + ', ' + delay;
      f.style.animationDuration = rand(4, 7).toFixed(2) + 's, ' + rand(2, 3.4).toFixed(2) + 's';
      frag.appendChild(f);
    }
    els.fireflies.replaceChildren(frag);
  }

  function shootingStar() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const angle = rand(14, 34);
    const rad = angle * Math.PI / 180;
    const dist = Math.max(w, h) * rand(0.35, 0.55);
    const el = document.createElement('span');
    el.className = 'shoot';
    el.style.width = (w < 600 ? rand(80, 130) : rand(130, 210)) + 'px';
    el.style.left = rand(-0.05, 0.7) * w + 'px';
    el.style.top = rand(0, 0.3) * h + 'px';
    els.shooting.appendChild(el);

    const from = `translate(0, 0) rotate(${angle}deg)`;
    const to = `translate(${Math.cos(rad) * dist}px, ${Math.sin(rad) * dist}px) rotate(${angle}deg)`;
    const anim = el.animate(
      [
        { transform: from, opacity: 0 },
        { opacity: 1, offset: 0.12 },
        { transform: to, opacity: 0 }
      ],
      { duration: rand(1000, 1600), easing: 'ease-in' }
    );
    anim.onfinish = () => el.remove();

    window.setTimeout(shootingStar, rand(2500, 7000));
  }

  // Swap the drawn sky and hills for the painted backgrounds.
  function applyArtwork() {
    const { landscape, portrait } = C.background || {};
    if (!landscape && !portrait) return;
    const picture = document.createElement('picture');
    picture.className = 'backdrop';
    if (portrait && landscape) {
      const source = document.createElement('source');
      source.media = '(orientation: portrait)';
      source.srcset = portrait;
      picture.appendChild(source);
    }
    const img = document.createElement('img');
    els.backdropImg = img;
    img.alt = '';
    img.decoding = 'async';
    img.src = landscape || portrait;
    // Fade in once loaded; the plain night gradient shows until then.
    img.addEventListener('load', () => picture.classList.add('is-loaded'));
    img.addEventListener('error', () => {
      els.backdropImg = null;
      picture.remove();
      els.scene.classList.remove('scene--art');
    });
    picture.appendChild(img);
    els.scene.prepend(picture);
    els.scene.classList.add('scene--art');
  }

  // The painting's moon, mapped onto the screen (the image is scaled to cover it).
  function keepClearRect() {
    const img = els.backdropImg;
    const zones = C.background && C.background.keepClear;
    if (!img || !zones || !img.naturalWidth) return null;
    const portrait = window.matchMedia('(orientation: portrait)').matches;
    const zone = portrait ? zones.portrait : zones.landscape;
    if (!zone) return null;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const scale = Math.max(vw / img.naturalWidth, vh / img.naturalHeight);
    const ox = (vw - img.naturalWidth * scale) / 2;
    const oy = (vh - img.naturalHeight * scale) / 2;
    const w = img.naturalWidth * scale;
    const h = img.naturalHeight * scale;
    return { left: ox + zone[0] * w, top: oy + zone[1] * h, right: ox + zone[2] * w, bottom: oy + zone[3] * h };
  }

  /* ------------------------------------------------------------------ */
  /* Screen 1: the question                                              */
  /* ------------------------------------------------------------------ */

  let noCount = 0;
  let lastDodge = 0;
  let noGone = false;
  let answered = false;
  let yesScale = 1;

  function renderAsk() {
    const i = Math.min(noCount, LAST_NO);
    els.kicker.textContent = T.messages[i];
    els.kicker.classList.toggle('is-teasing', noCount > 0);
    if (noCount > 0 && !reduceMotion) {
      els.kicker.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 300, easing: 'ease-out' });
    }
    els.no.textContent = T.noLabels[Math.min(noCount, T.noLabels.length - 1)];
    yesScale = Math.min(1 + noCount * 0.32, maxYesScale());
    els.yes.style.transform = `scale(${yesScale})`;
  }

  // "Yes" grows downwards, or upwards when the buttons sit at the bottom (phone + artwork).
  function yesGrowsUp() {
    const originY = parseFloat(getComputedStyle(els.yes).transformOrigin.split(' ')[1]);
    return originY > els.yes.offsetHeight / 2;
  }

  // The column the question sits in ("yes" ends up centred in it once "no" leaves).
  function askCenterX() {
    const r = els.ask.getBoundingClientRect();
    return r.left + r.width / 2;
  }

  // Keep the growing "yes" inside the screen (and off the question).
  function maxYesScale() {
    const w = els.yes.offsetWidth || 1;
    const h = els.yes.offsetHeight || 1;
    const c = els.choices.getBoundingClientRect();
    const cx = askCenterX();
    const byWidth = (Math.min(cx, window.innerWidth - cx) * 2 * 0.94) / w;
    const byHeight = yesGrowsUp()
      ? (c.top + h - els.card.getBoundingClientRect().bottom - 16) / h
      : (window.innerHeight - c.top - 16) / h;
    return Math.max(1, Math.min(4.2, byWidth, byHeight));
  }

  // Where the scaled "yes" will end up.
  function yesRect(scale) {
    const w = els.yes.offsetWidth * scale;
    const h = els.yes.offsetHeight * scale;
    const cx = askCenterX();
    const c = els.choices.getBoundingClientRect();
    const top = yesGrowsUp() ? c.top + els.yes.offsetHeight - h : c.top;
    return { left: cx - w / 2, top, right: cx + w / 2, bottom: top + h };
  }

  function overlaps(a, b, pad) {
    return !(a.right + pad < b.left || a.left - pad > b.right || a.bottom + pad < b.top || a.top - pad > b.bottom);
  }

  function freeNoButton() {
    const r = els.no.getBoundingClientRect();
    const gap = parseFloat(getComputedStyle(els.choices).columnGap) || 0;

    // Fill the hole the button leaves so "yes" glides to the centre instead of jumping.
    els.slot.style.display = 'block';
    els.slot.style.width = r.width + 'px';
    els.slot.style.marginLeft = '0px';

    // Pin it exactly where it was, then let it animate from there.
    els.no.style.transition = 'none';
    els.no.classList.add('is-free');
    els.no.style.left = r.left + 'px';
    els.no.style.top = r.top + 'px';
    void els.no.offsetWidth;
    els.no.style.transition = '';

    requestAnimationFrame(() => {
      els.slot.style.width = '0px';
      els.slot.style.marginLeft = -gap + 'px';
    });
  }

  // Each attempt sends the button further from where the question sits.
  function pickNoSpot(n) {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const bw = els.no.offsetWidth;
    const bh = els.no.offsetHeight;
    const m = 12;
    const ox = askCenterX();
    const oy = els.choices.getBoundingClientRect().top + bh / 2;
    const reach = Math.hypot(Math.max(ox, vw - ox), Math.max(oy, vh - oy));
    const frac = Math.min(0.95, 0.2 + (n - 1) * 0.1);
    const avoid = [yesRect(yesScale), els.card.getBoundingClientRect(), keepClearRect(), musicRect(), els.lang.getBoundingClientRect()].filter(Boolean);
    const current = els.no.getBoundingClientRect();

    for (let attempt = 0; attempt < 400; attempt++) {
      // Widen the band a little if nothing fits.
      const d = reach * frac * rand(0.9, 1.1) * (attempt > 200 ? rand(0.6, 1) : 1);
      const a = rand(0, Math.PI * 2);
      const x = ox + Math.cos(a) * d - bw / 2;
      const y = oy + Math.sin(a) * d - bh / 2;
      if (x < m || y < m || x > vw - bw - m || y > vh - bh - m) continue;
      const box = { left: x, top: y, right: x + bw, bottom: y + bh };
      if (avoid.some((r) => overlaps(box, r, 16))) continue;
      if (Math.hypot(x - current.left, y - current.top) < bw) continue;
      return { x, y };
    }
    // Fallback: any corner that's clear of "yes".
    const corners = [
      { x: m, y: m },
      { x: vw - bw - m, y: m },
      { x: m, y: vh - bh - m },
      { x: vw - bw - m, y: vh - bh - m }
    ];
    return corners.find((c) => !overlaps({ left: c.x, top: c.y, right: c.x + bw, bottom: c.y + bh }, avoid[0], 8)) || corners[0];
  }

  function sendNoAway() {
    const r = els.no.getBoundingClientRect();
    const goRight = r.left + r.width / 2 > window.innerWidth / 2;
    els.no.classList.add('is-gone');
    els.no.style.left = (goRight ? window.innerWidth + 200 : -r.width - 200) + 'px';
    els.no.style.top = -r.height - 200 + 'px';
    els.no.style.transform = `rotate(${goRight ? 40 : -40}deg)`;
    els.no.setAttribute('tabindex', '-1');
    window.setTimeout(() => {
      if (noGone) els.no.hidden = true;
    }, 750);
  }

  function dodge(event) {
    if (answered || noGone) return;
    if (event) event.preventDefault();
    const now = performance.now();
    if (now - lastDodge < 300) return; // one touch fires several events; count it once
    lastDodge = now;

    if (noCount === 0) freeNoButton();
    noCount++;
    renderAsk();

    let noTarget = null; // where "no" is heading, so the pop-up doesn't land under it
    if (noCount >= LAST_NO) {
      noGone = true;
      sendNoAway();
    } else {
      const spot = pickNoSpot(noCount);
      els.no.style.left = spot.x + 'px';
      els.no.style.top = spot.y + 'px';
      els.no.style.transform = `rotate(${(noCount % 2 ? 1 : -1) * rand(6, 14)}deg)`;
      noTarget = { left: spot.x, top: spot.y, right: spot.x + els.no.offsetWidth, bottom: spot.y + els.no.offsetHeight };
    }

    showFav(noCount, noTarget);
  }

  /* ------------------------------------------------------------------ */
  /* Her favourite things                                                */
  /* ------------------------------------------------------------------ */

  function clearFavs() {
    els.favs.querySelectorAll('.fav').forEach((f) => {
      f.classList.add('is-leaving');
      window.setTimeout(() => f.remove(), 320);
    });
  }

  function showFav(n, noTarget) {
    clearFavs();
    const src = C.items && C.items[n];
    const label = (T.itemLabels && T.itemLabels[n]) || '';
    if (!src && !label) return;

    const fav = document.createElement('div');
    fav.className = 'fav';
    const inner = document.createElement('div');
    inner.className = 'fav-inner';
    fav.appendChild(inner);

    const placeholder = () => {
      const p = document.createElement('div');
      p.className = 'fav-placeholder';
      p.textContent = label;
      inner.replaceChildren(p);
    };
    if (src) {
      const img = document.createElement('img');
      img.alt = label;
      img.src = src;
      img.onerror = placeholder;
      inner.appendChild(img);
    } else {
      placeholder();
    }

    els.favs.appendChild(fav);
    const size = fav.offsetWidth;
    const spot = pickFavSpot(size, noTarget);
    fav.style.left = spot.x + 'px';
    fav.style.top = spot.y + 'px';
  }

  function pickFavSpot(size, noTarget) {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const m = 10;
    const yes = yesRect(yesScale);
    const avoid = [els.card.getBoundingClientRect(), yes, noTarget, keepClearRect(), musicRect(), els.lang.getBoundingClientRect()].filter(Boolean);
    // Try with breathing room first, then snugger.
    for (const pad of [12, 4]) {
      for (let attempt = 0; attempt < 300; attempt++) {
        const x = rand(m, vw - size - m);
        const y = rand(m, vh - size - m);
        const box = { left: x, top: y, right: x + size, bottom: y + size };
        if (!avoid.some((r) => overlaps(box, r, pad))) return { x, y };
      }
    }
    // Nowhere fully clear: at least stay out from behind "yes".
    const above = yes.top - size - m;
    return { x: m, y: Math.max(m, above) };
  }

  /* ------------------------------------------------------------------ */
  /* Screens 2 & 3: envelope and letter                                  */
  /* ------------------------------------------------------------------ */

  function fillLetter() {
    $('greeting').textContent = fill(T.letter.greeting);
    const paras = document.createDocumentFragment();
    T.letter.paragraphs.forEach((text) => {
      const p = document.createElement('p');
      p.textContent = fill(text);
      paras.appendChild(p);
    });
    $('paragraphs').replaceChildren(paras);
    $('closing').textContent = fill(T.letter.closing);
    $('date').textContent = T.date;
    if (C.envelopeSticker) {
      const envSticker = $('envelope-sticker');
      envSticker.src = C.envelopeSticker;
      envSticker.hidden = false;
      envSticker.onerror = () => { envSticker.hidden = true; };
    }
    if (C.letterSticker) {
      const sticker = $('sticker');
      sticker.src = C.letterSticker;
      sticker.hidden = false;
      sticker.onerror = () => { sticker.hidden = true; };
    }
  }

  function leave(el, then) {
    if (reduceMotion) {
      el.hidden = true;
      then();
      return;
    }
    el.classList.add('is-leaving');
    window.setTimeout(() => {
      el.hidden = true;
      el.classList.remove('is-leaving');
      then();
    }, 380);
  }

  function sayYes() {
    if (answered) return;
    answered = true;
    clearFavs();
    els.no.hidden = true;
    leave(els.ask, () => {
      els.envelopeScreen.hidden = false;
      els.openLetter.focus({ preventScroll: true });
    });
  }

  function openLetter() {
    leave(els.envelopeScreen, () => {
      els.letterScreen.hidden = false;
      $('paper-scroll').scrollTop = 0;
    });
  }

  function replay() {
    noCount = 0;
    noGone = false;
    answered = false;
    els.no.className = 'btn btn-no';
    els.no.removeAttribute('style');
    els.no.removeAttribute('tabindex');
    els.no.hidden = false;
    els.slot.removeAttribute('style');
    els.letterScreen.hidden = true;
    els.envelopeScreen.hidden = true;
    els.ask.hidden = false;
    renderAsk();
  }

  /* ------------------------------------------------------------------ */
  /* Wiring                                                              */
  /* ------------------------------------------------------------------ */

  function onResize() {
    makeStars();
    if (!answered) {
      yesScale = Math.min(1 + noCount * 0.32, maxYesScale());
      els.yes.style.transform = `scale(${yesScale})`;
    }
    // Pull a stranded "no" back on screen (unless it has already left for good).
    if (els.no.classList.contains('is-free') && !noGone) {
      const r = els.no.getBoundingClientRect();
      const x = Math.min(Math.max(12, r.left), window.innerWidth - r.width - 12);
      const y = Math.min(Math.max(12, r.top), window.innerHeight - r.height - 12);
      els.no.style.left = x + 'px';
      els.no.style.top = y + 'px';
    }
  }

  /* ------------------------------------------------------------------ */
  /* Language                                                            */
  /* ------------------------------------------------------------------ */

  function applyLang(next) {
    lang = next;
    T = C.text[lang];
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : lang;
    document.title = T.pageTitle;
    const title = $('title');
    title.replaceChildren(...T.title.flatMap((line, i) => {
      const span = document.createElement('span');
      span.textContent = line;
      // English needs a space between the two lines when they share one row.
      return i && lang !== 'zh' ? [' ', span] : [span];
    }));
    document.querySelectorAll('[data-t]').forEach((el) => { el.textContent = T[el.dataset.t]; });
    document.querySelectorAll('[data-t-label]').forEach((el) => el.setAttribute('aria-label', T[el.dataset.tLabel]));
    els.lang.querySelectorAll('[data-lang]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    els.subtitle.textContent = fill(T.subtitle);
    fillLetter();
    renderMusic();
    renderAsk();
  }

  function init() {
    applyLang(lang);
    els.lang.addEventListener('click', (e) => {
      const b = e.target.closest('[data-lang]');
      if (!b || b.dataset.lang === lang) return;
      applyLang(b.dataset.lang);
      // Keep the choice on reload.
      try {
        const url = new URL(location.href);
        url.searchParams.set('lang', lang);
        history.replaceState(null, '', url);
      } catch (err) { /* file:// in some browsers */ }
    });
    applyArtwork();
    makeStars();
    makeFireflies();
    renderAsk();
    if (!reduceMotion) window.setTimeout(shootingStar, 1200);

    // Mouse: it runs the moment the cursor gets close.
    els.no.addEventListener('pointerenter', (e) => {
      if (e.pointerType === 'mouse') dodge(e);
    });
    // Touch / pen: it runs on touch, before a tap can land.
    els.no.addEventListener('pointerdown', dodge);
    els.no.addEventListener('touchstart', dodge, { passive: false });
    // Keyboard (Enter / Space) and anything that slipped through.
    els.no.addEventListener('click', dodge);

    els.yes.addEventListener('click', sayYes);
    els.openLetter.addEventListener('click', openLetter);
    els.replay.addEventListener('click', replay);

    let resizeTimer;
    window.addEventListener('resize', () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(onResize, 150);
    });
  }

  /* ------------------------------------------------------------------ */
  /* Music                                                               */
  /* ------------------------------------------------------------------ */

  // iPhones ignore audio.volume, so the volume goes through a Web Audio gain node.
  const music = { started: false, ctx: null, gain: null, volume: 0.5, muted: false };
  const START_EVENTS = ['pointerup', 'touchend', 'click', 'keydown'];

  function musicRect() {
    return els.music.hidden ? null : els.music.getBoundingClientRect();
  }

  function musicTarget() {
    return music.muted ? 0 : music.volume;
  }

  function fadeMusic(to, seconds) {
    if (music.gain) {
      const g = music.gain.gain;
      const now = music.ctx.currentTime;
      g.cancelScheduledValues(now);
      g.setValueAtTime(g.value, now);
      g.linearRampToValueAtTime(to, now + seconds);
    } else {
      els.song.volume = to;
    }
  }

  function startMusic() {
    if (music.started) return;
    music.started = true;
    START_EVENTS.forEach((ev) => document.removeEventListener(ev, startMusic, true));

    // Keep playing with the iPhone's silent switch on (Safari 17+).
    try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) { /* not supported */ }

    const AC = window.AudioContext || window.webkitAudioContext;
    if (AC && !music.ctx) {
      try {
        music.ctx = new AC();
        music.gain = music.ctx.createGain();
        music.gain.gain.value = 0;
        music.ctx.createMediaElementSource(els.song).connect(music.gain).connect(music.ctx.destination);
      } catch (e) {
        music.ctx = null;
        music.gain = null;
      }
    }
    if (music.ctx) music.ctx.resume();
    if (!music.gain) els.song.volume = 0;

    els.song.play()
      .then(() => fadeMusic(musicTarget(), 2.5)) // soft fade-in
      .catch(() => {
        // Not allowed yet (e.g. the tap didn't count): try again on the next one.
        music.started = false;
        armMusic();
      });
  }

  function armMusic() {
    START_EVENTS.forEach((ev) => document.addEventListener(ev, startMusic, true));
  }

  function renderMusic() {
    els.music.classList.toggle('is-muted', music.muted);
    els.musicToggle.setAttribute('aria-pressed', String(music.muted));
    els.musicToggle.setAttribute('aria-label', music.muted ? T.unmute : T.mute);
  }

  function setupMusic() {
    if (!C.music || !C.music.src) return;
    music.volume = typeof C.music.volume === 'number' ? C.music.volume : 0.5;
    els.song.src = C.music.src;
    els.musicVolume.value = Math.round(music.volume * 100);
    els.music.hidden = false;
    document.body.classList.add('has-music');
    renderMusic();

    els.musicToggle.addEventListener('click', () => {
      music.muted = !music.muted;
      renderMusic();
      if (music.started) fadeMusic(musicTarget(), 0.25);
    });

    els.musicVolume.addEventListener('input', () => {
      music.volume = els.musicVolume.value / 100;
      if (music.muted && music.volume > 0) {
        music.muted = false;
        renderMusic();
      }
      if (music.started) fadeMusic(musicTarget(), 0.08);
    });

    // Pause when she switches away from the page, carry on when she's back.
    document.addEventListener('visibilitychange', () => {
      if (!music.started) return;
      if (document.hidden) els.song.pause();
      else els.song.play().catch(() => {});
    });

    armMusic();
  }

  /* ------------------------------------------------------------------ */
  /* Loading: wait for pictures and fonts before she can tap anything    */
  /* ------------------------------------------------------------------ */

  const LOAD_TIMEOUT = 15000; // never keep her waiting longer than this
  const LOADER_MIN = 700;     // avoid a split-second flash on fast connections

  function preloadImage(src) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => (img.decode ? img.decode().catch(() => {}) : Promise.resolve()).then(resolve);
      img.onerror = resolve; // a missing picture just shows its placeholder
      img.src = src;
    });
  }

  // Same families as --font-cute / --font-hand / --font-body in css/style.css.
  const FONTS = {
    zh: { cute: '"ZCOOL KuaiLe"', hand: '"Ma Shan Zheng"', body: '"Noto Sans SC"' },
    en: { cute: '"Fredoka"', hand: '"Caveat"', body: '"Nunito"' }
  };

  // Both languages, so switching doesn't flash the fallback font.
  function preloadFonts() {
    if (!document.fonts || !document.fonts.load) return [];
    return Object.keys(C.text).flatMap((l) => {
      const t = C.text[l];
      const f = FONTS[l];
      if (!f) return [];
      const letterText = [t.letter.greeting, ...t.letter.paragraphs, t.letter.closing, t.date].map(fill).join('');
      const cuteText = t.title.join('') + t.yes + t.envelopeTitle + t.noLabels.join('');
      const bodyText = t.messages.join('') + fill(t.subtitle) + t.envelopeSub + t.envelopeHint + t.replay;
      return [
        document.fonts.load(`28px ${f.cute}`, cuteText),
        document.fonts.load(`24px ${f.hand}`, letterText),
        document.fonts.load(`400 18px ${f.body}`, bodyText),
        document.fonts.load(`500 18px ${f.body}`, bodyText)
      ];
    }).map((p) => p.catch(() => {}));
  }

  function preloadAll() {
    const bg = C.background || {};
    const images = [bg.landscape, bg.portrait, C.envelopeSticker, C.letterSticker]
      .concat(Object.values(C.items || {}))
      .filter(Boolean);
    const tasks = images.map(preloadImage).concat(preloadFonts());

    const bar = $('loader-fill');
    let done = 0;
    tasks.forEach((t) => t.then(() => {
      done++;
      bar.style.width = Math.round((done / tasks.length) * 100) + '%';
    }));

    const timeout = new Promise((resolve) => window.setTimeout(resolve, LOAD_TIMEOUT));
    const minimum = new Promise((resolve) => window.setTimeout(resolve, LOADER_MIN));
    return Promise.all([Promise.race([Promise.all(tasks), timeout]), minimum]);
  }

  function hideLoader() {
    const loader = $('loader');
    renderAsk(); // re-measure now the fonts are in
    loader.classList.add('is-done');
    window.setTimeout(() => loader.remove(), 700);
  }

  init();
  setupMusic();
  preloadAll().then(hideLoader);
})();
