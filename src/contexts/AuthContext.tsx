import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { AppRole } from "@/lib/roles";

type AuthCtx = {
  user: User | null;
  session: Session | null;
  role: AppRole | null;
  isAdmin: boolean;
  isViewer: boolean;
  isClient: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  hasRole: (roles: AppRole | AppRole[]) => boolean;
};

const Ctx = createContext<AuthCtx | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);

  const loadRole = async (uid: string) => {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", uid)
      .maybeSingle();

    if (error) {
      console.error("Erro ao carregar perfil:", error.message);
      setRole(null);
      return;
    }

    setRole((data?.role as AppRole | undefined) ?? null);
  };

  const resetAuth = () => {
    setRole(null);
  };

  useEffect(() => {
    let mounted = true;

    const applySession = async (s: Session | null) => {
      if (!mounted) return;
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        await loadRole(s.user.id);
      } else {
        resetAuth();
      }
      if (mounted) setLoading(false);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      void applySession(s);
    });

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      void applySession(s);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const { error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (!error) return { error: null };

    const message =
      error.message === "Invalid login credentials"
        ? "E-mail ou senha incorretos. Verifique os dados e tente novamente."
        : error.message;

    return { error: message };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    resetAuth();
  };

  const hasRole = useCallback(
    (roles: AppRole | AppRole[]) => {
      if (!role) return false;
      const list = Array.isArray(roles) ? roles : [roles];
      return list.includes(role);
    },
    [role],
  );

  const isAdmin = role === "admin";
  const isViewer = role === "viewer";
  const isClient = role === "client";

  return (
    <Ctx.Provider
      value={{
        user,
        session,
        role,
        isAdmin,
        isViewer,
        isClient,
        loading,
        signIn,
        signOut,
        hasRole,
      }}
    >
      {children}
    </Ctx.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};
