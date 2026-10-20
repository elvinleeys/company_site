/* 어떤원두 — 구독 안내 페이지 스크립트
   1) 모바일 메뉴 열고 닫기  2) 플랜 요약 계산  3) 소개용 체험 안내창
   요금은 index.html의 data-price / data-times에서 읽어옵니다 (예시 데이터). */
(function () {
  'use strict';

  var won = function (n) { return n.toLocaleString('ko-KR') + '원'; };

  /* 1) 모바일 메뉴 */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  /* 2) 플랜 요약 */
  var form = document.getElementById('plan-form');
  var dialog = document.getElementById('demo-dialog');
  if (!form) return;

  var out = {};
  document.querySelectorAll('[data-out]').forEach(function (el) { out[el.dataset.out] = el; });

  var current = { summary: '' };

  function update() {
    var size = form.querySelector('input[name="size"]:checked');
    var cycle = form.querySelector('input[name="cycle"]:checked');
    if (!size || !cycle) return;

    var unit = Number(size.dataset.price);
    var times = Number(cycle.dataset.times);
    var total = unit * times;

    out.size.textContent = size.dataset.timesLabel;
    out.cycle.textContent = cycle.value;
    out.unit.textContent = won(unit);
    out.times.textContent = times + '회';
    out.total.textContent = won(total);

    current.summary = size.value + ' · ' + cycle.value + ' · 한 달 ' + won(total);
  }

  form.addEventListener('change', update);
  update();

  /* 3) 소개용 체험 안내창 (실제 신청·결제 없음) */
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    out['dialog-summary'].textContent = current.summary;
    if (dialog && typeof dialog.showModal === 'function') {
      dialog.showModal();
    }
  });

  if (dialog) {
    dialog.querySelectorAll('[data-close-dialog]').forEach(function (btn) {
      btn.addEventListener('click', function () { dialog.close(); });
    });
  }
})();
