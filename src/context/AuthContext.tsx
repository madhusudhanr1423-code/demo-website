// MOCK auth. Replace this single file with real auth later.
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Profile } from "@/types";
import { setApiUser } from "@/lib/api";

type User = { id: string; email: string };
type AuthValue = {
  user: User | null;
  profile: Profile | null;
  isAdmin: boolean;
  ready: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, phone: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<Omit<Profile, "id" | "role">>) => Promise<void>;
};

const KEY = "temple-mock-auth";
const AuthContext = createContext<AuthValue | null>(null);
const wait = () => new Promise((r) => setTimeout(r, 400));
const idFor = (email: string) => "u_" + email.toLowerCase().replace(/[^a-z0-9]/g, "");

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const s = JSON.parse(raw);
        setUser(s.user);
        setProfile(s.profile);
        setApiUser(s.user.id);
      }
    } catch {}
    setReady(true);
  }, []);

  const persist = (u: User | null, p: Profile | null) => {
    setUser(u);
    setProfile(p);
    setApiUser(u?.id ?? null);
    if (u) localStorage.setItem(KEY, JSON.stringify({ user: u, profile: p }));
    else localStorage.removeItem(KEY);
  };

  const make = (email: string, name: string, phone: string) => {
    const id = idFor(email);
    const lang = localStorage.getItem("temple-lang") ?? "te";
    const p: Profile = {
      id, full_name: name, phone, role: email.toLowerCase().includes("admin") ? "admin" : "user",
      preferred_language: lang, whatsapp_number: phone,
    };
    persist({ id, email }, p);
  };

  const value: AuthValue = {
    user,
    profile,
    ready,
    isAdmin: profile?.role === "admin",
    login: async (email) => {
      await wait();
      make(email, email.split("@")[0] ?? "", "");
    },
    signup: async (name, email, phone) => {
      await wait();
      make(email, name, phone);
    },
    logout: () => persist(null, null),
    updateProfile: async (data) => {
      await wait();
      if (user && profile) persist(user, { ...profile, ...data });
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
