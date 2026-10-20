// 공통 동작: 모바일 메뉴 열고 닫기, 헤더 Primary 버튼 표시 조절

(function () {
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('site-nav');

  if (toggle && nav) {
    function setOpen(open) {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
      nav.classList.toggle('is-open', open);
    }

    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  // 한 화면에 Primary 버튼은 1개: 페이지 안의 Primary 버튼이 보이는 동안 헤더 버튼을 숨긴다
  var headerCta = document.querySelector('.site-header__cta');
  var pageCta = document.querySelector('[data-page-primary]');

  if (headerCta && pageCta && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      var visible = entries[0].isIntersecting;
      headerCta.classList.toggle('is-hidden', visible);
      if (visible) {
        headerCta.setAttribute('tabindex', '-1');
        headerCta.setAttribute('aria-hidden', 'true');
      } else {
        headerCta.removeAttribute('tabindex');
        headerCta.removeAttribute('aria-hidden');
      }
    }).observe(pageCta);
  }
})();
