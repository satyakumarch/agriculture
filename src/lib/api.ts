// Central API utility — connects frontend to MongoDB backend
const BASE_URL = 'http://localhost:4000/api';

const getToken = () => localStorage.getItem('token') || '';

const headers = (withAuth = false) => ({
  'Content-Type': 'application/json',
  ...(withAuth ? { Authorization: `Bearer ${getToken()}` } : {}),
});

// ── Auth ──────────────────────────────────────────────────────────────────
export const apiRegister = (data: { name: string; email: string; password: string }) =>
  fetch(`${BASE_URL}/auth/register`, { method: 'POST', headers: headers(), body: JSON.stringify(data) }).then(r => r.json());

export const apiLogin = (data: { email: string; password: string }) =>
  fetch(`${BASE_URL}/auth/login`, { method: 'POST', headers: headers(), body: JSON.stringify(data) }).then(r => r.json());

// ── Expenses ──────────────────────────────────────────────────────────────
export const apiGetExpenses = () =>
  fetch(`${BASE_URL}/expenses`, { headers: headers(true) }).then(r => r.json());

export const apiAddExpense = (data: object) =>
  fetch(`${BASE_URL}/expenses`, { method: 'POST', headers: headers(true), body: JSON.stringify(data) }).then(r => r.json());

export const apiDeleteExpense = (id: string) =>
  fetch(`${BASE_URL}/expenses/${id}`, { method: 'DELETE', headers: headers(true) }).then(r => r.json());

// ── Marketplace Listings ──────────────────────────────────────────────────
export const apiGetListings = (params?: { category?: string; search?: string }) => {
  const q = new URLSearchParams(params as any).toString();
  return fetch(`${BASE_URL}/listings${q ? '?' + q : ''}`, { headers: headers() }).then(r => r.json());
};

export const apiAddListing = (data: object) =>
  fetch(`${BASE_URL}/listings`, { method: 'POST', headers: headers(true), body: JSON.stringify(data) }).then(r => r.json());

// ── Seed Calculations ─────────────────────────────────────────────────────
export const apiSaveSeedCalc = (data: object) =>
  fetch(`${BASE_URL}/seedcalculations`, { method: 'POST', headers: headers(true), body: JSON.stringify(data) }).then(r => r.json());

export const apiGetSeedCalcs = () =>
  fetch(`${BASE_URL}/seedcalculations`, { headers: headers(true) }).then(r => r.json());

// ── Farm Analysis (AI Decision Engine) ───────────────────────────────────
export const apiSaveFarmAnalysis = (data: object) =>
  fetch(`${BASE_URL}/farmanalyses`, { method: 'POST', headers: headers(true), body: JSON.stringify(data) }).then(r => r.json());

export const apiGetFarmAnalyses = () =>
  fetch(`${BASE_URL}/farmanalyses`, { headers: headers(true) }).then(r => r.json());

// ── Profit Predictions ────────────────────────────────────────────────────
export const apiSaveProfitPrediction = (data: object) =>
  fetch(`${BASE_URL}/profitpredictions`, { method: 'POST', headers: headers(true), body: JSON.stringify(data) }).then(r => r.json());

export const apiGetProfitPredictions = () =>
  fetch(`${BASE_URL}/profitpredictions`, { headers: headers(true) }).then(r => r.json());

// ── Drone Bookings ────────────────────────────────────────────────────────
export const apiGetDroneBookings = () =>
  fetch(`${BASE_URL}/dronebookings`, { headers: headers(true) }).then(r => r.json());

export const apiAddDroneBooking = (data: object) =>
  fetch(`${BASE_URL}/dronebookings`, { method: 'POST', headers: headers(true), body: JSON.stringify(data) }).then(r => r.json());

export const apiUpdateDroneBooking = (id: string, status: string) =>
  fetch(`${BASE_URL}/dronebookings/${id}`, { method: 'PATCH', headers: headers(true), body: JSON.stringify({ status }) }).then(r => r.json());

// ── Community ─────────────────────────────────────────────────────────────
export const apiGetMessages = (topic?: string) => {
  const q = topic ? `?topic=${topic}` : '';
  return fetch(`${BASE_URL}/community${q}`, { headers: headers() }).then(r => r.json());
};

export const apiPostMessage = (data: object) =>
  fetch(`${BASE_URL}/community`, { method: 'POST', headers: headers(true), body: JSON.stringify(data) }).then(r => r.json());

export const apiLikeMessage = (id: string) =>
  fetch(`${BASE_URL}/community/${id}/like`, { method: 'PATCH', headers: headers() }).then(r => r.json());

// ── Contact ───────────────────────────────────────────────────────────────
export const apiSubmitContact = (data: object) =>
  fetch(`${BASE_URL}/contact`, { method: 'POST', headers: headers(), body: JSON.stringify(data) }).then(r => r.json());

// ── Health check ──────────────────────────────────────────────────────────
export const apiHealth = () =>
  fetch(`${BASE_URL}/health`).then(r => r.json()).catch(() => ({ status: 'offline' }));
