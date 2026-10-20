/* 어떤원두 · 원두 소개 페이지 동작
   데이터는 beans-data.js (예시 데이터) 에서 가져온다. */
(function () {
  'use strict';

  var data = window.BEANS_DATA;
  var beans = data.beans;
  var tasteLabels = data.tasteLabels;

  var filtersEl = document.getElementById('filters');
  var gridEl = document.getElementById('bean-grid');
  var countEl = document.getElementById('result-count');
  var glossaryEl = document.getElementById('glossary');
  var tableEl = document.getElementById('compare-table');
  var dialogEl = document.getElementById('bean-dialog');
  var dialogBodyEl = document.getElementById('dialog-body');

  var currentMood = 'all';

  /* ---------- 등장 애니메이션 ----------
     화면에 들어온 요소에 .is-visible 을 붙이고, 한꺼번에 들어오면 0.5단계씩 차례로 나타낸다.
     IntersectionObserver 가 없으면 .reveal 을 붙이지 않아 처음부터 보인다. */
  var observer = null;
  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(function (entries) {
      var n = 0;
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.style.setProperty('--i', Math.min(n++, 5));
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });
  }

  function reveal(els) {
    if (!observer) return;
    Array.prototype.forEach.call(els, function (el) {
      el.classList.add('reveal');
      observer.observe(el);
    });
  }

  /* 선형 아이콘 (선 1.5px, 둥근 끝 — 굵기·끝 모양은 CSS) */
  var TASTE_ICONS = {
    acidity: '<ellipse cx="12" cy="13" rx="8" ry="6.5"/><path d="M12 6.5c0-2 1.5-3 3-3"/>',
    nutty: '<path d="M12 3c4.5 3 6.5 7 6.5 10a6.5 6.5 0 0 1-13 0c0-3 2-7 6.5-10z"/><path d="M12 9v9"/>',
    sweet: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
    bitter: '<path d="M12 3c1 4 5 5.5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 .3 1.5 1 2 1.5 2C10.5 8 11 5.5 12 3z"/>',
    body: '<path d="M5 8h11v6a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5V8z"/><path d="M16 10h2a2 2 0 0 1 0 4h-2"/>',
  };

  function tasteIcon(key) {
    return '<svg class="taste-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">' + TASTE_ICONS[key] + '</svg>';
  }

  function formatPrice(n) {
    return n.toLocaleString('ko-KR') + '원';
  }

  /* 5단계 점. 화면 낭독기에는 "5점 중 4점"으로 읽힌다 */
  function dots(score) {
    var html = '<span class="dots" role="img" aria-label="5점 중 ' + score + '점">';
    for (var i = 1; i <= 5; i++) {
      html += '<span class="dot' + (i <= score ? ' is-on' : '') + '"></span>';
    }
    return html + '</span>';
  }

  /* 원두 일러스트 (사진 자료 전까지 쓰는 자리표시 이미지) */
  function beanImage(bean, large) {
    var tone = 'color-mix(in srgb, var(--color-roast), var(--color-espresso) ' + bean.tone + '%)';
    return '<div class="bean-image" style="--bean-tone: ' + tone + '">' +
      '<svg viewBox="0 0 96 120" role="img" aria-label="' + bean.origin + ' 원두 일러스트">' +
      '<ellipse class="bean-shape" cx="48" cy="60" rx="38" ry="52" transform="rotate(20 48 60)"/>' +
      '<path class="bean-crease" d="M40 12c14 22-14 40 2 62s-8 30-4 40" transform="rotate(20 48 60) translate(6 -2)"/>' +
      '</svg></div>';
  }

  function tagsHtml(tags) {
    return '<ul class="tags">' + tags.map(function (t) { return '<li class="tag">' + t + '</li>'; }).join('') + '</ul>';
  }

  /* ---------- 필터 ---------- */
  function renderFilters() {
    filtersEl.innerHTML = data.moods.map(function (m) {
      return '<button type="button" class="chip" data-mood="' + m.id + '" aria-pressed="' + (m.id === currentMood) + '">' +
        m.label + '</button>';
    }).join('');
  }

  filtersEl.addEventListener('click', function (e) {
    var chip = e.target.closest('.chip');
    if (!chip) return;
    currentMood = chip.getAttribute('data-mood');
    var chips = filtersEl.querySelectorAll('.chip');
    for (var i = 0; i < chips.length; i++) {
      chips[i].setAttribute('aria-pressed', chips[i] === chip ? 'true' : 'false');
    }
    renderCards();
  });

  /* ---------- 카드 목록 ---------- */
  function renderCards() {
    var list = beans.filter(function (b) {
      return currentMood === 'all' || b.moods.indexOf(currentMood) !== -1;
    });

    countEl.textContent = '원두 ' + list.length + '종';

    if (!list.length) {
      gridEl.innerHTML = '<li class="empty">아직 이 맛의 원두가 없어요. 다른 맛을 골라보실래요?</li>';
      reveal(gridEl.children);
      return;
    }

    /* 구성 순서: 이미지 → 이름 → 맛 태그 → 한 줄 설명 → 가격 (카드 전체가 버튼) */
    gridEl.innerHTML = list.map(function (b) {
      return '<li><button type="button" class="bean-card" data-id="' + b.id + '" aria-haspopup="dialog">' +
        beanImage(b) +
        '<span class="bean-info">' +
        '<span class="bean-origin">' + b.origin + ' · ' + b.roast + '</span>' +
        '<h3>' + b.name + '</h3>' +
        tagsHtml(b.tags) +
        '<span class="bean-line">' + b.line + '</span>' +
        '<span class="bean-price">' + formatPrice(b.price) + ' <small>/ 200g</small></span>' +
        '</span></button></li>';
    }).join('');
    reveal(gridEl.children);
  }

  gridEl.addEventListener('click', function (e) {
    var card = e.target.closest('.bean-card');
    if (card) openDialog(card.getAttribute('data-id'));
  });

  /* ---------- 상세 대화상자 ---------- */
  function openDialog(id) {
    var b = beans.filter(function (x) { return x.id === id; })[0];
    if (!b) return;

    var rows = tasteLabels.map(function (t) {
      var v = b.tastes[t.key];
      return '<div class="taste-row">' +
        '<div class="taste-head">' + tasteIcon(t.key) + '<span>' + t.label + '</span>' + dots(v.s) + '</div>' +
        '<p class="taste-note">' + v.note + '</p></div>';
    }).join('');

    dialogBodyEl.innerHTML =
      '<div class="dialog-image">' + beanImage(b, true) +
      '<button type="button" class="dialog-close" aria-label="닫기">' +
      '<svg class="icon" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>' +
      '<div class="dialog-content">' +
      '<p class="bean-origin">' + b.origin + ' · ' + b.roast + '</p>' +
      '<h2 id="dialog-title">' + b.name + '</h2>' +
      tagsHtml(b.tags) +
      '<p>' + b.line + '</p>' +
      '<p class="dialog-fit">' + b.fit + ' 잘 어울려요.</p>' +
      '<div class="taste-list">' + rows + '</div>' +
      '<p class="bean-price">' + formatPrice(b.price) + ' <small>/ 200g</small></p>' +
      '<div class="dialog-actions">' +
      '<button type="button" class="button button--secondary" data-close>다른 원두 보기</button>' +
      '<a class="button button--text" href="../taste-test/index.html">내 취향인지 테스트해 보기</a>' +
      '</div></div>';

    document.body.classList.add('is-locked');
    dialogEl.showModal();
  }

  dialogEl.addEventListener('click', function (e) {
    /* 바깥(배경) 클릭, 닫기 버튼, '다른 원두 보기' 모두 닫기 */
    if (e.target === dialogEl || e.target.closest('.dialog-close') || e.target.closest('[data-close]')) {
      dialogEl.close();
    }
  });
  dialogEl.addEventListener('close', function () {
    document.body.classList.remove('is-locked');
  });

  /* ---------- 맛 용어 풀이 + 비교표 ---------- */
  function renderGlossary() {
    glossaryEl.innerHTML = tasteLabels.map(function (t) {
      return '<div class="glossary-item"><dt>' + tasteIcon(t.key) + t.label + '</dt><dd>' + t.desc + '</dd></div>';
    }).join('');
  }

  function renderCompare() {
    var head = '<caption class="visually-hidden">원두별 맛 비교표</caption><thead><tr><th scope="col">원두</th>' +
      tasteLabels.map(function (t) { return '<th scope="col">' + t.label + '</th>'; }).join('') + '</tr></thead>';

    var body = '<tbody>' + beans.map(function (b) {
      return '<tr><th scope="row">' + b.name + '<small>' + b.origin + '</small></th>' +
        tasteLabels.map(function (t) {
          return '<td data-label="' + t.label + '">' + dots(b.tastes[t.key].s) + '</td>';
        }).join('') + '</tr>';
    }).join('') + '</tbody>';

    tableEl.innerHTML = head + body;
  }

  renderFilters();
  renderCards();
  renderGlossary();
  renderCompare();

  reveal(document.querySelectorAll(
    '.section__title, .section .section__lead, .filters, .glossary, .compare-wrap, .cta-line, .bean-note'
  ));
})();
