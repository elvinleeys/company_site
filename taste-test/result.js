const picks = [...(new URLSearchParams(location.search).get('a') || '')].map(Number);
const valid = picks.length === QUESTIONS.length
  && picks.every((p, i) => Number.isInteger(p) && p < QUESTIONS[i].options.length);

if (!valid) {
  location.replace('index.html'); // 답변 없이 들어오면 처음으로
} else {
  show();
}

function show() {
  // 답변별 맛 점수의 평균 = 내 취향
  const pref = AXES.map((_, k) =>
    picks.reduce((sum, p, i) => sum + QUESTIONS[i].options[p].taste[k], 0) / picks.length);

  const top3 = BEANS
    .map((b) => ({ b, dist: b.taste.reduce((s, v, k) => s + (v - pref[k]) ** 2, 0) }))
    .sort((x, y) => x.dist - y.dist)
    .slice(0, 3)
    .map((x) => x.b);

  document.getElementById('cards').innerHTML = top3.map((b, i) => card(b, i, pref)).join('');

  // 물음표 → 느낌표 전환 (400ms는 CSS transition)
  setTimeout(() => document.getElementById('reveal-badge').classList.add('found'), 400);
}

function card(b, rank, pref) {
  // 내 취향이 높고 이 원두도 강한 맛 하나를 추천 이유로 연결
  const k = AXES.reduce((best, _, j) => (pref[j] * b.taste[j] > pref[best] * b.taste[best] ? j : best), 0);
  const axis = AXES[k];

  const rows = AXES.map((a, j) => `
    <li class="taste">
      <span class="taste-name">${a.name}</span>
      <span class="dots" aria-hidden="true">${'●'.repeat(b.taste[j])}${'○'.repeat(5 - b.taste[j])}</span>
      <span class="sr">5점 만점에 ${b.taste[j]}점</span>
      <span class="taste-hint">${a.hint}</span>
    </li>`).join('');

  return `
    <li class="card">
      <figure class="photo">
        <img class="coffee-img" src="${b.image}" alt="${b.name} 원두 사진" loading="lazy">
        <figcaption class="rank">${rank + 1}순위</figcaption>
      </figure>
      <h2>${b.name}</h2>
      <ul class="tags">${b.tags.map((t) => `<li>${t}</li>`).join('')}</ul>
      <p>${b.desc}</p>
      <p class="price">200g ${b.price.toLocaleString('ko-KR')}원 <span class="note">(예시 가격)</span></p>
      <p class="reason">'${axis.like}'에 끌리신다면, ${axis.name}(${axis.hint})이 5점 만점에 ${b.taste[k]}점인 이 원두가 잘 맞을 것 같아요.</p>
      <ul class="tastes">${rows}</ul>
      <p class="credit">사진: ${b.credit}</p>
    </li>`;
}
