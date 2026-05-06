// ── Mock User Database & Auth Utilities ──────────────────────────────────────
// Fully client-side authentication using localStorage

export type UserRole = "admin" | "officer";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  badge: string;
  department: string;
}

// ── Mock Users (pre-created by system admin) ─────────────────────────────────
export const USERS: User[] = [
  {
    id: "usr_001",
    name: "Admin User",
    email: "admin@police.gov.np",
    password: "admin123",
    role: "admin",
    badge: "NPD-4821",
    department: "Traffic Division HQ",
  },
  {
    id: "usr_002",
    name: "Officer Ram Thapa",
    email: "ram@police.gov.np",
    password: "officer123",
    role: "officer",
    badge: "NPD-7753",
    department: "Kathmandu Metro Unit",
  },
  {
    id: "usr_003",
    name: "Officer Sita Sharma",
    email: "sita@police.gov.np",
    password: "officer123",
    role: "officer",
    badge: "NPD-3190",
    department: "Lalitpur Patrol Unit",
  },
  {
    id: "usr_004",
    name: "SI Bikash Karki",
    email: "bikash@police.gov.np",
    password: "officer123",
    role: "officer",
    badge: "NPD-5502",
    department: "Highway Division",
  },
];

// ── Session type (stored in localStorage, no password) ───────────────────────
export interface Session {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  badge: string;
  department: string;
  loginAt: string;
}

const STORAGE_KEY = "platedetect_session";

// ── Auth Functions ───────────────────────────────────────────────────────────

export function login(email: string, password: string): Session | null {
  const user = USERS.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!user) return null;

  const session: Session = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    badge: user.badge,
    department: user.department,
    loginAt: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }

  return session;
}

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

export function logout(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export function isLoggedIn(): boolean {
  return getSession() !== null;
}

export function isAdmin(): boolean {
  return getSession()?.role === "admin";
}
