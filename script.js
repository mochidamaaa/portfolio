/* ==========================================================================
   Mochida Manato - Works Portfolio
   共通スクリプト（レスポンシブ版）
   ========================================================================== */

/* ---------- WORKSページ：上下にホバーすると作品が切り替わるカルーセル ----------
   1920×1080固定キャンバスを廃止したため、カード寸法・間隔・表示位置は
   実際のレンダリングサイズから毎回計測する（固定pxのハードコードをしない）。
   これによりウィンドウ幅・高さが変わっても正しく追従する。
   モバイル幅（CSS側のブレークポイントで通常の縦積みリストに切り替わる範囲）では
   transformは常に none に固定されるため、以下の処理があっても見た目には影響しない。
   ========================================================================== */
(function worksCarousel() {
  var track = document.getElementById('worksTrack');
  if (!track) return;

  var viewport = track.parentElement; // .works-viewport
  var cards = Array.prototype.slice.call(track.querySelectorAll('.work-card'));
  var upZone = document.getElementById('worksHoverUp');
  var downZone = document.getElementById('worksHoverDown');

  var index = 0;
  var hoverTimer = null;
  var isTransitioning = false;

  function isDesktopLayout() {
    return window.matchMedia('(min-width: 1025px)').matches;
  }

  function render() {
    if (!isDesktopLayout()) {
      // モバイル／タブレットは通常の縦積みリスト表示なのでtransformは不要
      cards.forEach(function (card, i) {
        card.classList.toggle('is-active', i === index);
      });
      return;
    }

    var activeCard = cards[index];
    if (!activeCard) return;

    // アクティブなカードをビューポート中央付近に表示する位置を実測して計算
    var viewportH = viewport.clientHeight;
    var cardTop = activeCard.offsetTop;
    var cardH = activeCard.offsetHeight;
    var targetY = viewportH * 0.18 - cardTop; // 上寄りに見せていた元デザインに合わせる

    track.style.transform = 'translateY(' + targetY + 'px)';
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
    if (!isDesktopLayout()) return;
    stopHover();
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
      if (isDesktopLayout() && i !== index) {
        e.preventDefault();
        goTo(i);
      }
    });
  });

  // ウィンドウサイズが変わるたびにカード位置を再計算
  var resizeTimer = null;
  window.addEventListener('resize', function () {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(render, 100);
  });

  window.addEventListener('DOMContentLoaded', render);
  render();
})();
