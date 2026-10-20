// 예시 데이터: 질문·원두 정보·가격은 제공된 자료가 없어 임의로 만든 목업입니다. TODO(확인 필요)
// taste 배열 순서 = AXES 순서 (1~5점)
const AXES = [
  { name: '산미', hint: '과일처럼 상큼한 신맛', like: '상큼한 맛' },
  { name: '고소함', hint: '견과류처럼 구수한 맛', like: '고소한 맛' },
  { name: '단맛', hint: '캐러멜처럼 은은한 단맛', like: '달콤한 맛' },
  { name: '쓴맛', hint: '다크초콜릿 같은 쌉싸름함', like: '진하고 쌉싸름한 맛' },
  { name: '바디감', hint: '입안에 남는 묵직한 느낌', like: '묵직한 느낌' },
];

const ICON_PATHS = {
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  flame: '<path d="M12 3c1 4 5 6 5 11a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-6 1-10z"/>',
  heart: '<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/>',
  drop: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>',
  leaf: '<path d="M5 19c0-8 5-14 14-14 0 9-6 14-14 14zM5 19l8-8"/>',
  cup: '<path d="M5 9h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5V9zM16 10h2a2 2 0 0 1 0 4h-2M8 3v3M12 3v3"/>',
  snow: '<path d="M12 3v18M4.2 7.5l15.6 9M19.8 7.5l-15.6 9"/>',
  bolt: '<path d="M13 3L5 14h6l-1 7 8-11h-6l1-7z"/>',
  moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
};

function icon(name, size = 32) {
  return `<svg class="icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON_PATHS[name]}</svg>`;
}

// 답변 → 맛 점수 매핑 테이블 (규칙 기반 목업)
const QUESTIONS = [
  {
    text: '아침엔 어떤 커피가 당기세요?',
    options: [
      { label: '가볍고 상큼하게', icon: 'sun', taste: [5, 2, 3, 1, 1] },
      { label: '고소하고 든든하게', icon: 'leaf', taste: [1, 5, 3, 2, 4] },
      { label: '달콤하게 기분 좋게', icon: 'heart', taste: [3, 3, 5, 1, 3] },
      { label: '진하게, 정신이 번쩍 들게', icon: 'bolt', taste: [1, 3, 1, 5, 5] },
    ],
  },
  {
    text: '둘 중 더 끌리는 맛은요?',
    options: [
      { label: '과일 같은 상큼한 맛', icon: 'drop', taste: [5, 2, 3, 1, 2] },
      { label: '고소하고 묵직한 맛', icon: 'leaf', taste: [1, 5, 2, 3, 5] },
      { label: '초콜릿처럼 달콤한 맛', icon: 'heart', taste: [2, 3, 5, 2, 3] },
    ],
  },
  {
    text: '커피는 보통 어떻게 마셔요?',
    options: [
      { label: '아무것도 안 넣고 그대로', icon: 'cup', taste: [4, 3, 2, 3, 2] },
      { label: '우유를 넣어 부드럽게', icon: 'moon', taste: [1, 4, 4, 3, 4] },
      { label: '얼음 가득 시원하게', icon: 'snow', taste: [4, 3, 3, 2, 2] },
    ],
  },
  {
    text: '한 모금 마셨을 때, 어떤 느낌이 좋아요?',
    options: [
      { label: '입안이 산뜻하게 정리돼요', icon: 'sun', taste: [4, 2, 3, 1, 1] },
      { label: '진한 여운이 오래 남아요', icon: 'flame', taste: [1, 3, 2, 4, 5] },
      { label: '부드럽게 스르륵 넘어가요', icon: 'moon', taste: [2, 3, 4, 1, 3] },
    ],
  },
  {
    text: '커피는 주로 언제 마셔요?',
    options: [
      { label: '집중해야 할 때', icon: 'bolt', taste: [2, 3, 1, 5, 4] },
      { label: '쉬어가는 오후', icon: 'cup', taste: [3, 3, 4, 1, 3] },
      { label: '식사 후 개운하게', icon: 'leaf', taste: [4, 2, 2, 2, 2] },
    ],
  },
];

// image: 원두 사진 (Wikimedia Commons, credit에 작성자·라이선스). 원산지와 완전히 일치하지 않는 사진 포함 TODO(확인 필요)
const BEANS = [
  { name: '에티오피아 예가체프', image: 'images/bean1.jpg', credit: 'Ninaras · CC BY-SA 4.0', tags: ['과일향', '꽃향'], desc: '블루베리처럼 상큼하고 가벼워요.', price: 19500, taste: [5, 2, 3, 1, 2] },
  { name: '케냐 AA', image: 'images/bean2.jpg', credit: 'Go2africa · CC BY-SA 4.0', tags: ['베리', '새콤달콤'], desc: '잘 익은 베리처럼 새콤하게 톡 쏴요.', price: 21900, taste: [5, 2, 2, 2, 3] },
  { name: '코스타리카 타라수', image: 'images/bean3.jpg', credit: 'Sarah Murray · CC BY-SA 2.0', tags: ['달콤', '상큼'], desc: '꿀처럼 달콤한 끝맛에 산뜻함이 더해져요.', price: 20500, taste: [4, 3, 4, 1, 3] },
  { name: '콜롬비아 수프리모', image: 'images/bean4.jpg', credit: 'Roger Burger · CC0', tags: ['캐러멜', '균형'], desc: '캐러멜 같은 단맛이 편안하게 이어져요.', price: 18900, taste: [3, 3, 4, 2, 3] },
  { name: '브라질 산토스', image: 'images/bean5.jpg', credit: 'lageandre · CC BY-SA 4.0', tags: ['견과류', '고소'], desc: '볶은 아몬드처럼 구수하고 부드러워요.', price: 17900, taste: [2, 5, 3, 2, 3] },
  { name: '과테말라 안티구아', image: 'images/bean6.jpg', credit: 'Chuck Grimmett · CC0', tags: ['초콜릿', '묵직'], desc: '초콜릿 향이 고소하게 남는 든든한 맛이에요.', price: 19900, taste: [3, 4, 3, 3, 4] },
  { name: '인도네시아 만델링', image: 'images/bean7.jpg', credit: 'Susansumi · CC BY-SA 4.0', tags: ['진한', '쌉싸름'], desc: '쌉싸름하고 묵직해서 잠이 확 깨요.', price: 18500, taste: [1, 3, 2, 5, 5] },
];
