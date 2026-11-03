(function () {
  var slides = Array.prototype.slice.call(document.querySelectorAll('.slide'));
  var total = slides.length;
  var count = document.getElementById('count');
  var bar = document.getElementById('progress');
  var i = 0;
  var ANIM = 'header, .card, .stat, .tl-item, .ag, .steps-line span, .lane, .node, .foundation > div, .outcomes > div, .callout, ' +
    '.sp, .hub-c, .hub-note, .dk, .panel, .ms-t, .mini-dash > div, .step, .af, .code, .en, .en-h, .fn, .demo, .rec, .th, ' +
    '.ring-l, .g-row, .miles, .o-lead, .o-n, .o-biz, .cert, .aw, .vals > div, .rs, .udp-col, .udp-core, .chip-s, .md, .udp-res > div, .close h2, .close .q, .cover-left > *, .illus';

  slides.forEach(function (s, n) {
    var f = s.querySelector('footer');
    if (f) f.setAttribute('data-page', (n + 1) + ' / ' + total);
    Array.prototype.forEach.call(s.querySelectorAll(ANIM), function (el, k) {
      el.classList.add('anim');
      el.style.setProperty('--d', Math.min(k * 45, 1400) + 'ms');
    });
  });

  function fit() {
    var k = Math.min(window.innerWidth / 1280, window.innerHeight / 720) * 0.96;
    slides.forEach(function (s) { s.style.transform = 'scale(' + k + ')'; });
  }

  function countUp(s) {
    Array.prototype.forEach.call(s.querySelectorAll('[data-count]'), function (el) {
      var to = parseFloat(el.getAttribute('data-count'));
      var dec = parseInt(el.getAttribute('data-dec') || '0', 10);
      var t0 = null;
      function tick(t) {
        if (!t0) t0 = t;
        var p = Math.min((t - t0) / 1200, 1);
        var v = to * (1 - Math.pow(1 - p, 3));
        el.textContent = v.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }

  function go(n) {
    i = Math.max(0, Math.min(total - 1, n));
    slides.forEach(function (s, idx) {
      var on = idx === i;
      s.classList.toggle('active', on);
      Array.prototype.forEach.call(s.querySelectorAll('.anim'), function (el) {
        el.classList.remove('in');
        if (on) { void el.offsetWidth; el.classList.add('in'); }
      });
    });
    countUp(slides[i]);
    count.textContent = (i + 1) + ' / ' + total;
    bar.style.width = ((i + 1) / total * 100) + '%';
    history.replaceState(null, '', '#' + (i + 1));
  }

  document.addEventListener('keydown', function (e) {
    if (['ArrowRight', 'PageDown', ' ', 'Enter'].indexOf(e.key) > -1) { e.preventDefault(); go(i + 1); }
    else if (['ArrowLeft', 'PageUp', 'Backspace'].indexOf(e.key) > -1) { e.preventDefault(); go(i - 1); }
    else if (e.key === 'Home') go(0);
    else if (e.key === 'End') go(total - 1);
    else if (e.key === 'f' || e.key === 'F') toggleFs();
    else if (e.key === 'p' || e.key === 'P') window.print();
  });

  function toggleFs() {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
    else document.exitFullscreen();
  }

  document.getElementById('prev').onclick = function () { go(i - 1); };
  document.getElementById('next').onclick = function () { go(i + 1); };
  document.getElementById('fs').onclick = toggleFs;
  document.getElementById('deck').addEventListener('click', function (e) {
    if (e.target.closest('a,button')) return;
    go(e.clientX > window.innerWidth / 2 ? i + 1 : i - 1);
  });

  window.addEventListener('resize', fit);
  fit();
  go(parseInt(location.hash.slice(1), 10) - 1 || 0);
})();
