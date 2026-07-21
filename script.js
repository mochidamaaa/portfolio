/* ==========================================================================
   Mochida Manato - Works Portfolio
   共通スクリプト
   ========================================================================== */

/* ---------- 1. ウィンドウサイズに合わせて1920×1080のページを縮小表示 ---------- */
(function fitStage() {
  var page = document.querySelector('.page');
  if (!page) return;

  function resize() {
    var scaleX = window.innerWidth / 1920;
    var scaleY = window.innerHeight / 1080;
    var scale = Math.min(scaleX, scaleY);
    page.style.transform = 'scale(' + scale + ')';
  }

  window.addEventListener('resize', resize);
  window.addEventListener('DOMContentLoaded', resize);
  resize();
})();

/* ---------- 2. WORKSページ：上下にホバーすると作品が切り替わるカルーセル ---------- */
(function worksCarousel() {
  var track = document.getElementById('worksTrack');
  if (!track) return;

  var cards = Array.prototype.slice.call(track.querySelectorAll('.work-card'));
  var upZone = document.getElementById('worksHoverUp');
  var downZone = document.getElementById('worksHoverDown');

  var index = 0;
  var CARD_H = 550;
  var GAP = 40;
  var OFFSET = 100; // ビューポート内でカードを見せる開始位置
  var hoverTimer = null;
  var isTransitioning = false;

  function render() {
    var y = OFFSET - index * (CARD_H + GAP);
    track.style.transform = 'translateY(' + y + 'px)';
    cards.forEach(function (card, i) {
      card.classList.toggle('is-active', i === index);
    });
  }

  function goTo(newIndex) {
    if (isTransitioning) return;
    index = (newIndex + cards.length) % cards.length;
    isTransitioning = true;
    render();
    window.setTimeout(function () {
      isTransitioning = false;
    }, 700);
  }

  function next() { goTo(index + 1); }
  function prev() { goTo(index - 1); }

  function startHover(dir) {
    stopHover();
    // ホバーした瞬間にまず1つ切り替え、その後一定間隔で自動送り
    dir === 1 ? next() : prev();
    hoverTimer = window.setInterval(function () {
      dir === 1 ? next() : prev();
    }, 900);
  }

  function stopHover() {
    if (hoverTimer) {
      window.clearInterval(hoverTimer);
      hoverTimer = null;
    }
  }

  if (upZone) {
    upZone.addEventListener('mouseenter', function () { startHover(-1); });
    upZone.addEventListener('mouseleave', stopHover);
  }
  if (downZone) {
    downZone.addEventListener('mouseenter', function () { startHover(1); });
    downZone.addEventListener('mouseleave', stopHover);
  }

  // カードクリックでもその作品をアクティブにできるように
  cards.forEach(function (card, i) {
    card.addEventListener('click', function (e) {
      if (i !== index) {
        e.preventDefault();
        goTo(i);
      }
    });
  });

  render();
})();
