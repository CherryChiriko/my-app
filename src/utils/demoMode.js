import { getTodayISO } from "./dateHelper";

export const DEMO_USER_ID = "demo-user";
export const DEMO_MODE_STORAGE_KEY = "revu_demo_mode";

const now = new Date().toISOString();

// Helper: return YYYY-MM-DD for `daysAgo` days before today.
const dateOffset = (daysAgo) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
};

// 5 most recent days, most recent = today, oldest = 4 days ago.
// Numbers are hand-picked to look like a plausible, slightly-improving
// study pattern rather than a flat line.
export const demoActivityRows = [
  {
    date: dateOffset(4),
    cards_reviewed: 8,
    cards_learned: 4,
    time_studied_seconds: 620,
    total_xp: 140,
  },
  {
    date: dateOffset(3),
    cards_reviewed: 5,
    cards_learned: 5,
    time_studied_seconds: 540,
    total_xp: 120,
  },
  {
    date: dateOffset(2),
    cards_reviewed: 9,
    cards_learned: 2,
    time_studied_seconds: 610,
    total_xp: 150,
  },
  {
    date: dateOffset(1),
    cards_reviewed: 7,
    cards_learned: 3,
    time_studied_seconds: 480,
    total_xp: 110,
  },
  {
    date: dateOffset(0),
    cards_reviewed: 10,
    cards_learned: 4,
    time_studied_seconds: 730,
    total_xp: 180,
  },
];

export const demoProfile = {
  id: DEMO_USER_ID,
  username: "demo",
  email: "demo@revu.local",
  created_at: now,
  global_streak: 4,
  global_max_streak: 9,
  global_last_active: now,
  review_limit: 10,
  learn_limit: 5,
  avatar_url: null,
  avatar_history: [],
  avatar_icon: "D",
  avatar_color: "#10b981",
  date_format: "monday",
  default_deck_view: "large",
  heatmap_metric: "consistency",
  has_completed_onboarding: true,
  completed_tutorials: {
    general: true,
    dashboard: true,
    decks: true,
    study: true,
  },
  lifetime_xp: 1280,
  plan_id: "pro",
  subscription_status: "active",
  import_usage_month: getTodayISO().slice(0, 7),
  imported_cards_this_month: 0,
  is_demo: true,
};

export const demoSession = {
  access_token: "demo-access-token",
  token_type: "bearer",
  user: {
    id: DEMO_USER_ID,
    email: demoProfile.email,
    user_metadata: {
      username: demoProfile.username,
      is_demo: true,
    },
  },
  is_demo: true,
};

export const demoDecks = [
  {
    id: "demo-deck-basics",
    deck_id: "demo-deck-basics",
    user_id: DEMO_USER_ID,
    name: "Travel Spanish",
    description: "Useful cards for airports, cafes, and getting unstuck.",
    language: "Spanish",
    study_mode: "A",
    tags: ["travel", "phrases"],
    cards_count: 5,
    active_cards_count: 5,
    new_count: 3,
    due_count: 2,
    waiting_count: 0,
    familiar_count: 2,
    solid_count: 0,
    mastered_count: 0,
    suspended_count: 0,
    status: "active",
    last_reviewed: getTodayISO(),
    created_at: "2026-08-28T09:00:00.000Z",
  },
  {
    id: "demo-deck-hanzi",
    deck_id: "demo-deck-hanzi",
    user_id: DEMO_USER_ID,
    name: "HSK 1 Characters",
    description: "A tiny stroke-order friendly character set.",
    language: "Chinese",
    study_mode: "C",
    tags: ["hsk", "characters"],
    cards_count: 3,
    active_cards_count: 3,
    new_count: 2,
    due_count: 1,
    waiting_count: 0,
    familiar_count: 1,
    solid_count: 0,
    mastered_count: 0,
    suspended_count: 0,
    status: "active",
    last_reviewed: null,
    created_at: "2026-08-30T09:00:00.000Z",
  },
];

const baseProgress = {
  user_id: DEMO_USER_ID,
  ease_factor: 2.5,
  review_interval: 0,
  repetitions: 0,
  suspended: false,
  due_date: null,
  last_studied: null,
};

export const demoCards = [
  {
    ...baseProgress,
    id: "demo-card-1",
    card_id: "demo-card-1",
    deck_id: "demo-deck-basics",
    front: "Where is the train station?",
    back: "¿Dónde está la estación de tren?",
    audioUrl: null,
    created_at: "2026-08-28T09:01:00.000Z",
    status: "new",
  },
  {
    ...baseProgress,
    id: "demo-card-2",
    card_id: "demo-card-2",
    deck_id: "demo-deck-basics",
    front: "A coffee, please.",
    back: "Un café, por favor.",
    audioUrl: null,
    created_at: "2026-08-28T09:02:00.000Z",
    status: "due",
    review_interval: 1,
    repetitions: 1,
    due_date: getTodayISO(),
    last_studied: "2026-09-03T09:00:00.000Z",
  },
  {
    ...baseProgress,
    id: "demo-card-3",
    card_id: "demo-card-3",
    deck_id: "demo-deck-basics",
    front: "I need help.",
    back: "Necesito ayuda.",
    audioUrl: null,
    created_at: "2026-08-28T09:03:00.000Z",
    status: "new",
  },
  {
    ...baseProgress,
    id: "demo-card-4",
    card_id: "demo-card-4",
    deck_id: "demo-deck-basics",
    front: "How much does this cost?",
    back: "¿Cuánto cuesta esto?",
    audioUrl: null,
    created_at: "2026-08-28T09:04:00.000Z",
    status: "due",
    review_interval: 3,
    repetitions: 2,
    due_date: getTodayISO(),
    last_studied: "2026-09-01T09:00:00.000Z",
  },
  {
    ...baseProgress,
    id: "demo-card-5",
    card_id: "demo-card-5",
    deck_id: "demo-deck-basics",
    front: "Thank you very much.",
    back: "Muchas gracias.",
    audioUrl: null,
    created_at: "2026-08-28T09:05:00.000Z",
    status: "new",
  },
  {
    ...baseProgress,
    id: "demo-card-6",
    card_id: "demo-card-6",
    deck_id: "demo-deck-hanzi",
    front: "你",
    reading: "ni3",
    back: "you",
    audioUrl: null,
    tones: [3],
    strokeColors: ["#f97316"],
    created_at: "2026-08-30T09:01:00.000Z",
    status: "new",
  },
  {
    ...baseProgress,
    id: "demo-card-7",
    card_id: "demo-card-7",
    deck_id: "demo-deck-hanzi",
    front: "好",
    reading: "hao3",
    back: "good",
    audioUrl: null,
    tones: [3],
    strokeColors: ["#f97316"],
    created_at: "2026-08-30T09:02:00.000Z",
    status: "due",
    review_interval: 1,
    repetitions: 1,
    due_date: getTodayISO(),
    last_studied: "2026-09-03T09:00:00.000Z",
  },
  {
    ...baseProgress,
    id: "demo-card-8",
    card_id: "demo-card-8",
    deck_id: "demo-deck-hanzi",
    front: "学",
    reading: "xue2",
    back: "to study",
    audioUrl: null,
    tones: [2],
    strokeColors: ["#3b82f6"],
    created_at: "2026-08-30T09:03:00.000Z",
    status: "new",
  },
];

export const demoStreakRows = {
  decks: [
    {
      deck_id: "demo-deck-basics",
      deck_streak: 3,
      max_streak: 6,
      streak_state: "active",
      date: getTodayISO(),
    },
    {
      deck_id: "demo-deck-hanzi",
      deck_streak: 2,
      max_streak: 4,
      streak_state: "inactive",
      date: getTodayISO(),
    },
  ],
  global: {
    global_streak: 4,
    max_global_streak: 9,
    streak_state: "active",
  },
};

export const isDemoUserId = (userId) => userId === DEMO_USER_ID;
export const isDemoSession = (session) =>
  session?.is_demo === true || isDemoUserId(session?.user?.id);

export const isDemoModeEnabled = () => {
  try {
    return localStorage.getItem(DEMO_MODE_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
};

export const setDemoModeEnabled = (enabled) => {
  try {
    if (enabled) localStorage.setItem(DEMO_MODE_STORAGE_KEY, "true");
    else localStorage.removeItem(DEMO_MODE_STORAGE_KEY);
  } catch {
    // localStorage can be unavailable in private browser contexts.
  }
};
