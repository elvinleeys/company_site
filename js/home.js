// 메인 화면: 스크롤해서 섹션이 보이면 부드럽게 나타나게 한다 (design-guide 9번, 400ms)

(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !('IntersectionObserver' in window)) return;

  // 첫 화면(히어로)은 바로 보여야 하므로 제외
  var sections = document.querySelectorAll('main .section');
  if (!sections.length) return;

  document.documentElement.classList.add('js-reveal');

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target); // 한 번만
    });
  }, { rootMargin: '0px 0px -10% 0px' });

  sections.forEach(function (section) {
    section.classList.add('reveal');
    observer.observe(section);

    // 키보드로 숨은 섹션 안에 들어오면 바로 보여준다
    section.addEventListener('focusin', function () {
      section.classList.add('is-visible');
    });
  });
})();
