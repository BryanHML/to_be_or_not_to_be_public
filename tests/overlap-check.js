// Overlap check: plays the page and reports anything that lands on the corner
// controls (music, language). Open the site, paste this into the browser
// console and read the result (empty `issues` = nothing clashed). Try several
// window sizes, including a phone held sideways. It turns animations off, so
// reload the page afterwards.
(async () => {
  const st = document.createElement('style');
  st.textContent = '*{transition:none!important;animation:none!important}';
  document.head.appendChild(st);
  // "No" ignores taps less than 300ms apart; fake the clock instead of waiting.
  const real = performance.now.bind(performance);
  let off = 0;
  performance.now = () => real() + off;

  const $ = (id) => document.getElementById(id);
  const no = $('no');
  const yes = $('yes');
  const R = (el) => el.getBoundingClientRect();
  const hit = (a, b) => !(a.right <= b.left || a.left >= b.right || a.bottom <= b.top || a.top >= b.bottom);
  const ctrls = () => [['lang', document.querySelector('.lang')], ['music', $('music')]]
    .filter(([, e]) => !e.hidden).map(([n, e]) => [n, R(e)]);
  const issues = {};
  const check = (things) => {
    for (const [n, r] of things) for (const [c, cr] of ctrls()) if (hit(r, cr)) issues[`${n} x ${c}`] = (issues[`${n} x ${c}`] || 0) + 1;
  };
  const ask = () => {
    const t = [['card', R($('ask-card'))], ['yes', R(yes)]];
    if (!no.hidden && !no.classList.contains('is-gone')) t.push(['no', R(no)]);
    document.querySelectorAll('.fav:not(.is-leaving)').forEach((f) => t.push(['sticker', R(f)]));
    check(t);
  };
  const until = async (f) => { while (!f()) await new Promise((r) => setTimeout(r, 50)); };

  // 10 rounds, alternating languages: 8 dodges, yes, envelope, letter, replay.
  for (let run = 0; run < 10; run++) {
    document.querySelector(`[data-lang=${run % 2 ? 'zh' : 'en'}]`).click();
    ask();
    for (let i = 0; i < 8; i++) { off += 400; no.click(); ask(); }
    yes.click();
    await until(() => !$('envelope-screen').hidden);
    check([['envelope title', R(document.querySelector('.envelope-title'))], ['envelope', R(document.querySelector('.envelope'))]]);
    $('open-letter').click();
    await until(() => !$('letter-screen').hidden);
    check([['letter', R(document.querySelector('.letter-wrap'))], ['replay', R($('replay'))]]);
    $('replay').click();
  }
  console.log({ size: `${innerWidth}x${innerHeight}`, issues });
})();
