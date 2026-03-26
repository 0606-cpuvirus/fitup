// ═══════════════════════════════════════════════════════════════
// appwrite.js — Shared Appwrite Config & SDK Initialization
// ═══════════════════════════════════════════════════════════════

import { Client, Account, Databases, Storage, ID, Query, Permission, Role }
  from 'https://cdn.jsdelivr.net/npm/appwrite@16.0.2/+esm';

// ── Appwrite Constants ───────────────────────────────────────
export const ENDPOINT          = 'https://sgp.cloud.appwrite.io/v1';
export const PROJECT_ID        = '69c4f26a0002b9a7a16a';
export const DATABASE_ID       = 'fitup_db';
export const COL_USERS_PROFILE = 'users_profile';
export const COL_WEIGHT_HISTORY= 'weight_history';
export const COL_FOOD_ITEMS    = 'food_items';
export const COL_DAILY_LOGS    = 'daily_logs';
export const COL_MEAL_ENTRIES  = 'meal_entries';
export const BUCKET_FOOD_PHOTOS= 'food_photos';

// ── SDK Instances ────────────────────────────────────────────
export const client = new Client();
client.setEndpoint(ENDPOINT).setProject(PROJECT_ID);

export const account   = new Account(client);
export const databases = new Databases(client);
export const storage   = new Storage(client);

// Re-export SDK helpers
export { ID, Query, Permission, Role };

// ── Auth Helper ──────────────────────────────────────────────
export async function getCurrentUser() {
  try {
    return await account.get();
  } catch (_) {
    window.location.href = 'index.html';
    return null;
  }
}

// ── User Permissions Helper ──────────────────────────────────
export function userPermissions(userId) {
  return [
    Permission.read(Role.user(userId)),
    Permission.update(Role.user(userId)),
    Permission.delete(Role.user(userId)),
  ];
}

// ── TDEE & Macro Calculations ────────────────────────────────
const ACTIVITY_MULTIPLIERS = {
  sedentary:   1.2,
  light:       1.375,
  moderate:    1.55,
  active:      1.725,
  very_active: 1.9,
};

export function calcTDEE(weight_kg, height_cm, age, activity_level) {
  const bmr = (10 * weight_kg) + (6.25 * height_cm) - (5 * age) + 5;
  return Math.round(bmr * (ACTIVITY_MULTIPLIERS[activity_level] || 1.2));
}

export function calcTargets(maintenance, goal) {
  let daily;
  if (goal === 'lose')      daily = maintenance - 500;
  else if (goal === 'gain') daily = maintenance + 300;
  else                      daily = maintenance;
  return {
    daily_calorie_target: daily,
    protein_target_g:  Math.round(((daily * 0.30) / 4) * 10) / 10,
    carbs_target_g:    Math.round(((daily * 0.40) / 4) * 10) / 10,
    fats_target_g:     Math.round(((daily * 0.30) / 9) * 10) / 10,
  };
}

export function calcBMI(weight_kg, height_cm) {
  return Math.round((weight_kg / Math.pow(height_cm / 100, 2)) * 10) / 10;
}

// ── Preset Food Items ────────────────────────────────────────
export const PRESET_FOODS = [
  { name:'Paratha (Oil)',   icon_key:'paratha_oil',  category:'breakfast', serving_unit:'piece', serving_size:1, calories:300, protein_g:5,  carbs_g:38, fats_g:14 },
  { name:'Paratha (Dry)',   icon_key:'paratha_dry',  category:'breakfast', serving_unit:'piece', serving_size:1, calories:200, protein_g:5,  carbs_g:38, fats_g:4  },
  { name:'Boiled Egg',      icon_key:'boiled_egg',   category:'breakfast', serving_unit:'piece', serving_size:1, calories:77,  protein_g:6,  carbs_g:1,  fats_g:5  },
  { name:'Fried Egg',       icon_key:'fried_egg',    category:'breakfast', serving_unit:'piece', serving_size:1, calories:110, protein_g:7,  carbs_g:1,  fats_g:9  },
  { name:'Milk Tea (Mug)',  icon_key:'milk_tea',     category:'drink',     serving_unit:'cup',   serving_size:1, calories:120, protein_g:4,  carbs_g:16, fats_g:5  },
  { name:'Black Coffee',    icon_key:'coffee',       category:'drink',     serving_unit:'cup',   serving_size:1, calories:5,   protein_g:0,  carbs_g:1,  fats_g:0  },
  { name:'Rice (Cooked)',   icon_key:'rice',         category:'lunch',     serving_unit:'cup',   serving_size:1, calories:206, protein_g:4,  carbs_g:45, fats_g:0  },
  { name:'Roti (Wheat)',    icon_key:'roti',         category:'lunch',     serving_unit:'piece', serving_size:1, calories:120, protein_g:3,  carbs_g:25, fats_g:1  },
  { name:'Banana',          icon_key:'banana',       category:'snack',     serving_unit:'piece', serving_size:1, calories:89,  protein_g:1,  carbs_g:23, fats_g:0  },
  { name:'Apple',           icon_key:'apple',        category:'snack',     serving_unit:'piece', serving_size:1, calories:95,  protein_g:0,  carbs_g:25, fats_g:0  },
];

// ── Food Icon SVGs ───────────────────────────────────────────
const SVG_PRESETS = {
  paratha_oil: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="20" fill="#d4a054"/><circle cx="24" cy="24" r="16" fill="#c4903c" opacity=".7"/><circle cx="24" cy="24" r="11" fill="#b8832e" opacity=".5"/><ellipse cx="18" cy="18" rx="6" ry="3" fill="#f5d98e" opacity=".45" transform="rotate(-30 18 18)"/><ellipse cx="30" cy="22" rx="4" ry="2" fill="#f5d98e" opacity=".35" transform="rotate(20 30 22)"/></svg>`,
  paratha_dry: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="20" fill="#c9a96e"/><circle cx="24" cy="24" r="16" fill="#b8955a" opacity=".6"/><circle cx="24" cy="24" r="11" fill="#a78348" opacity=".4"/><path d="M14 24q5-3 10 0t10 0" stroke="#8b6d3a" stroke-width="1" fill="none" opacity=".4"/></svg>`,
  boiled_egg: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><ellipse cx="24" cy="25" rx="16" ry="18" fill="#f5f0e8"/><ellipse cx="24" cy="25" rx="16" ry="18" fill="none" stroke="#e0d8cc" stroke-width="1"/><circle cx="24" cy="26" r="8" fill="#f5c842"/><circle cx="24" cy="26" r="5" fill="#f0b800"/></svg>`,
  fried_egg: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><ellipse cx="24" cy="26" rx="20" ry="16" fill="#faf5eb" opacity=".95"/><ellipse cx="24" cy="26" rx="20" ry="16" fill="none" stroke="#e8dfd0" stroke-width=".7"/><ellipse cx="22" cy="24" rx="18" ry="14" fill="#fff" opacity=".6"/><circle cx="24" cy="25" r="8" fill="#f5c842"/><circle cx="24" cy="25" r="5.5" fill="#f0a500"/><ellipse cx="21" cy="23" rx="2" ry="1.2" fill="#fff" opacity=".5"/></svg>`,
  milk_tea: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><rect x="12" y="14" width="22" height="26" rx="3" fill="#e8ddd0"/><rect x="14" y="18" width="18" height="18" rx="2" fill="#c4956a"/><path d="M34 22q6 0 6 6t-6 6" stroke="#e8ddd0" stroke-width="2.5" fill="none"/><path d="M18 16q2-4 5-4q3 0 5 4" stroke="#d4c4b0" stroke-width="1.2" fill="none" opacity=".5"/><path d="M22 14q1-3 2-3q1 0 2 3" stroke="#d4c4b0" stroke-width="1" fill="none" opacity=".4"/></svg>`,
  coffee: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><rect x="12" y="16" width="22" height="24" rx="3" fill="#6b4c3a"/><rect x="14" y="20" width="18" height="16" rx="2" fill="#3d2616"/><path d="M34 24q5 0 5 5t-5 5" stroke="#6b4c3a" stroke-width="2.5" fill="none"/><path d="M18 18q2-4 5-4q3 0 5 4" stroke="#8b7060" stroke-width="1.2" fill="none" opacity=".5"/><path d="M22 16q1-3 2-3q1 0 2 3" stroke="#8b7060" stroke-width="1" fill="none" opacity=".4"/></svg>`,
  rice: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path d="M8 30q0 12 16 12q16 0 16-12z" fill="#e8ddd4"/><path d="M8 30q0 12 16 12q16 0 16-12" fill="none" stroke="#d4c8bc" stroke-width="1"/><ellipse cx="24" cy="30" rx="16" ry="5" fill="#f5f0ea"/><circle cx="18" cy="28" r="1.5" fill="#fff"/><circle cx="24" cy="26" r="1.5" fill="#fff"/><circle cx="28" cy="29" r="1.2" fill="#fff"/><circle cx="21" cy="30" r="1" fill="#fff"/><circle cx="26" cy="27" r="1.3" fill="#fff"/><circle cx="16" cy="30" r="1" fill="#fff"/><circle cx="30" cy="27" r="1" fill="#fff"/></svg>`,
  roti: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="20" fill="#d4a86a"/><circle cx="24" cy="24" r="16" fill="none" stroke="#c49458" stroke-width=".8" opacity=".5"/><circle cx="24" cy="24" r="12" fill="none" stroke="#c49458" stroke-width=".6" opacity=".4"/><circle cx="24" cy="24" r="7" fill="none" stroke="#c49458" stroke-width=".5" opacity=".3"/><circle cx="18" cy="20" r="2" fill="#c49458" opacity=".25"/><circle cx="28" cy="28" r="1.5" fill="#c49458" opacity=".2"/></svg>`,
  banana: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path d="M14 38q-2-8 4-18q6-10 16-12q2 0 2 2q-8 4-12 12q-4 8-2 16q0 2-2 2q-4 0-6-2z" fill="#f5d442"/><path d="M34 8q2 0 2 2q-8 4-12 12q-4 8-2 16" stroke="#e8c420" stroke-width="1" fill="none"/><path d="M34 8q1-2 2-2q1 0 0 2" fill="#8b7030"/></svg>`,
  apple: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><ellipse cx="24" cy="28" rx="14" ry="16" fill="#e84057"/><ellipse cx="20" cy="28" rx="10" ry="14" fill="#f04060" opacity=".6"/><ellipse cx="18" cy="22" rx="4" ry="3" fill="#f56080" opacity=".4"/><rect x="23" y="8" width="2" height="8" rx="1" fill="#6b4c3a"/><ellipse cx="28" cy="12" rx="5" ry="3" fill="#22d3a0" transform="rotate(30 28 12)" opacity=".8"/></svg>`,
};

export function renderFoodIcon(icon_type, icon_key, size = 40) {
  if (icon_type === 'emoji') {
    const d = document.createElement('div');
    d.style.cssText = `width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center;font-size:${size * 0.6}px;`;
    d.textContent = icon_key;
    return d;
  }
  if (icon_type === 'photo') {
    const img = document.createElement('img');
    img.src = storage.getFilePreview(BUCKET_FOOD_PHOTOS, icon_key).toString();
    img.style.cssText = `width:${size}px;height:${size}px;border-radius:50%;object-fit:cover;`;
    img.alt = 'food';
    return img;
  }
  // svg_preset
  const d = document.createElement('div');
  d.style.cssText = `width:${size}px;height:${size}px;`;
  d.innerHTML = SVG_PRESETS[icon_key] || `<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="18" fill="#7c5cfc" opacity=".3"/><text x="24" y="28" text-anchor="middle" fill="#f0f0ff" font-size="14">?</text></svg>`;
  return d;
}

// ── localStorage Cache Helpers ───────────────────────────────
export function cacheSet(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) {}
}
export function cacheGet(key) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; } catch (_) { return null; }
}
export function cacheClear() {
  try {
    localStorage.removeItem('fitup_profile');
    const keys = Object.keys(localStorage).filter(k => k.startsWith('fitup_log_'));
    keys.forEach(k => localStorage.removeItem(k));
  } catch (_) {}
}

// ── Date Helpers ─────────────────────────────────────────────
export function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

export function formatDateHuman(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' });
}
