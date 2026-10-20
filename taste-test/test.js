const answers = [];
let step = 0;
const $ = (id) => document.getElementById(id);

function render() {
  const q = QUESTIONS[step];
  const last = step === QUESTIONS.length - 1;
  $('progress-text').textContent = `${step + 1}/${QUESTIONS.length}`;
  $('bar-fill').style.width = `${((step + 1) / QUESTIONS.length) * 100}%`;
  $('bar').setAttribute('aria-valuenow', step + 1);
  $('question').textContent = q.text;
  $('prev').disabled = step === 0;
  $('next').textContent = last ? '결과 보기' : '다음';
  $('next').disabled = answers[step] === undefined;

  $('options').replaceChildren(...q.options.map((o, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'option';
    btn.innerHTML = `${icon(o.icon)}<span>${o.label}</span><span class="check">${icon('check', 24)}</span>`;
    btn.addEventListener('click', () => choose(i));
    return btn;
  }));
  markSelected();

  const area = $('question-area');
  area.classList.remove('slide');
  void area.offsetWidth; // 애니메이션 재시작
  area.classList.add('slide');
  $('question').focus({ preventScroll: true });
}

function markSelected() {
  [...$('options').children].forEach((btn, i) => {
    const on = answers[step] === i;
    btn.classList.toggle('selected', on);
    btn.setAttribute('aria-pressed', on);
  });
}

// 선택만 기록하고, 이동은 "다음" 버튼으로
function choose(i) {
  answers[step] = i;
  markSelected();
  $('next').disabled = false;
}

$('prev').addEventListener('click', () => {
  if (step > 0) { step--; render(); }
});

$('next').addEventListener('click', () => {
  if (answers[step] === undefined) return;
  if (step === QUESTIONS.length - 1) {
    location.href = `result.html?a=${answers.join('')}`;
  } else {
    step++;
    render();
  }
});

render();
