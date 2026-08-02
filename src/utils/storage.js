const STORAGE_KEYS = {
  PROFILE: 'duram_profile',
  GOALS: 'duram_goals',
  COUPONS: 'duram_coupons',
  SUBMISSIONS: 'duram_submissions',
  USER_COUPONS: 'duram_user_coupons',
  POINT_HISTORY: 'duram_point_history',
};

// Initial Presets based on README.md
export const DEFAULT_PROFILE = {
  name: '민준이 (동생)',
  avatar: '🧒',
  points: 18,
  totalEarned: 32,
  currentStreak: 5,
  parentPin: '1234',
};

export const DEFAULT_GOALS = [
  {
    id: 'goal-1',
    title: '도요새 화상수업 예습',
    description: '수업 시작 전 교재 10분 읽어보기',
    frequency: 'weekly',
    points: 1,
    category: 'study',
    icon: 'Bird',
    createdAt: new Date().toISOString(),
    active: true,
  },
  {
    id: 'goal-2',
    title: '책 100페이지 읽고 독서록 작성',
    description: '이번 달 추천 도서 한 권 완독 후 느낀 점 작성하기',
    frequency: 'monthly',
    points: 1,
    category: 'reading',
    icon: 'BookOpen',
    createdAt: new Date().toISOString(),
    active: true,
  },
  {
    id: 'goal-3',
    title: '매일 스스로 양치하고 세수하기',
    description: '아침 일찍 일어나서 스스로 깨끗하게 씻기',
    frequency: 'daily',
    points: 1,
    category: 'habit',
    icon: 'Sparkles',
    createdAt: new Date().toISOString(),
    active: true,
  },
  {
    id: 'goal-4',
    title: '내 방 및 공부 책상 스스로 정돈하기',
    description: '공부 마친 후 책과 학용품 제자리에 두기',
    frequency: 'daily',
    points: 1,
    category: 'chores',
    icon: 'Home',
    createdAt: new Date().toISOString(),
    active: true,
  },
  {
    id: 'goal-5',
    title: '일일 수학 & 국어 학습지 2장 풀기',
    description: '오답 노트까지 스스로 점검하기',
    frequency: 'daily',
    points: 2,
    category: 'study',
    icon: 'Calculator',
    createdAt: new Date().toISOString(),
    active: true,
  },
];

export const DEFAULT_REWARDS = [
  {
    id: 'reward-15p',
    title: '1만 원 이하 선물 교환권',
    requiredPoints: 15,
    description: '원하는 문구류, 스티커북, 또는 1만 원 이하 자유 아이템',
    category: 'gift',
    icon: 'Gift',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'reward-20p',
    title: '1만 5천 원 이하 선물 교환권',
    requiredPoints: 20,
    description: '보드게임, 책, 도서상품권 등',
    category: 'gift',
    icon: 'Gift',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'reward-30p',
    title: '2만 원 이하 선물 교환권',
    requiredPoints: 30,
    description: '원하는 장난감이나 학용품 세트',
    category: 'gift',
    icon: 'Sparkles',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'reward-40p',
    title: '2만 5천 원 이하 선물 교환권',
    requiredPoints: 40,
    description: '특별한 간식 박스 및 원하는 캐릭터 굿즈',
    category: 'gift',
    icon: 'Package',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'reward-50p',
    title: '3만 원 이하 특별 대형 선물',
    requiredPoints: 50,
    description: '최고 달성 보상! 부모님과 함께 고르는 큰 선물',
    category: 'gift',
    icon: 'Trophy',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'reward-game',
    title: '주말 자유 게임시간 1시간 연장',
    requiredPoints: 10,
    description: '토요일 또는 일요일 편한 시간에 사용 가능',
    category: 'activity',
    icon: 'Gamepad2',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'reward-snack',
    title: '맛있는 떡볶이 & 파티 외식권',
    requiredPoints: 12,
    description: '원하는 메뉴 배달 주문 또는 외식하기',
    category: 'treat',
    icon: 'Utensils',
    createdAt: new Date().toISOString(),
  },
];

const getTodayStr = (offsetDays = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

export const DEFAULT_SUBMISSIONS = [
  {
    id: 'sub-demo-1',
    goalId: 'goal-3',
    goalTitle: '매일 스스로 양치하고 세수하기',
    points: 1,
    date: getTodayStr(-2),
    timestamp: new Date(Date.now() - 2 * 86400000).toISOString(),
    childNote: '아침 8시에 세수하고 양치 깔끔히 완료했어요!',
    status: 'approved',
    parentFeedback: '참 잘했어요! 스스로 하는 습관 최고 👍',
    approvedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'sub-demo-2',
    goalId: 'goal-5',
    goalTitle: '일일 수학 & 국어 학습지 2장 풀기',
    points: 2,
    date: getTodayStr(-1),
    timestamp: new Date(Date.now() - 1 * 86400000).toISOString(),
    childNote: '수학 오답까지 모두 다 맞췄습니다!',
    status: 'approved',
    parentFeedback: '오답 정리까지 꼼꼼하네요 +2P 드립니다!',
    approvedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 'sub-demo-3',
    goalId: 'goal-1',
    goalTitle: '도요새 화상수업 예습',
    points: 1,
    date: getTodayStr(0),
    timestamp: new Date().toISOString(),
    childNote: '수업 전 단어장 먼저 읽었어요.',
    status: 'pending',
  },
];

export const DEFAULT_USER_COUPONS = [
  {
    id: 'pass-1',
    couponId: 'reward-game',
    title: '주말 자유 게임시간 1시간 연장',
    pointsSpent: 10,
    code: 'DURAM-9921',
    redeemedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    status: 'active',
    icon: 'Gamepad2',
  },
];

export const DEFAULT_POINT_HISTORY = [
  {
    id: 'hist-1',
    type: 'earn',
    amount: 1,
    title: '매일 스스로 양치하고 세수하기 달성',
    date: getTodayStr(-2),
    timestamp: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'hist-2',
    type: 'earn',
    amount: 2,
    title: '일일 수학 & 국어 학습지 2장 풀기 달성',
    date: getTodayStr(-1),
    timestamp: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 'hist-3',
    type: 'spend',
    amount: 10,
    title: '주말 자유 게임시간 1시간 연장 쿠폰 교환',
    date: getTodayStr(-3),
    timestamp: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
];

// Helper Storage Getters & Setters
export function loadFromStorage(key, defaultValue) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error loading key ${key} from storage:`, err);
    return defaultValue;
  }
}

export function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error saving key ${key} to storage:`, err);
  }
}

export const Storage = {
  getProfile: () => loadFromStorage(STORAGE_KEYS.PROFILE, DEFAULT_PROFILE),
  saveProfile: (p) => saveToStorage(STORAGE_KEYS.PROFILE, p),

  getGoals: () => loadFromStorage(STORAGE_KEYS.GOALS, DEFAULT_GOALS),
  saveGoals: (g) => saveToStorage(STORAGE_KEYS.GOALS, g),

  getCoupons: () => loadFromStorage(STORAGE_KEYS.COUPONS, DEFAULT_REWARDS),
  saveCoupons: (c) => saveToStorage(STORAGE_KEYS.COUPONS, c),

  getSubmissions: () => loadFromStorage(STORAGE_KEYS.SUBMISSIONS, DEFAULT_SUBMISSIONS),
  saveSubmissions: (s) => saveToStorage(STORAGE_KEYS.SUBMISSIONS, s),

  getUserCoupons: () => loadFromStorage(STORAGE_KEYS.USER_COUPONS, DEFAULT_USER_COUPONS),
  saveUserCoupons: (uc) => saveToStorage(STORAGE_KEYS.USER_COUPONS, uc),

  getPointHistory: () => loadFromStorage(STORAGE_KEYS.POINT_HISTORY, DEFAULT_POINT_HISTORY),
  savePointHistory: (ph) => saveToStorage(STORAGE_KEYS.POINT_HISTORY, ph),
};
