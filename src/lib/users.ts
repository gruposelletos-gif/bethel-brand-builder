import { supabase } from "@/integrations/supabase/client";
import type { AppRole } from "@/lib/roles";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
}

export interface UserWithRole extends Profile {
  role: AppRole | null;
}

interface ManageUsersResponse {
  success?: boolean;
  error?: string;
  user?: UserWithRole;
}

const parseManageUsersResponse = (data: unknown): ManageUsersResponse => {
  if (!data) return {};
  if (typeof data === "string") {
    try {
      return JSON.parse(data) as ManageUsersResponse;
    } catch {
      return {};
    }
  }
  if (typeof data === "object") return data as ManageUsersResponse;
  return {};
};

const invokeManageUsers = async <T = ManageUsersResponse>(
  body: Record<string, unknown>,
): Promise<T> => {
  const { data, error } = await supabase.functions.invoke("manage-users", { body });
  const payload = parseManageUsersResponse(data);

  if (typeof payload.error === "string" && payload.error.trim()) {
    throw new Error(payload.error);
  }

  if (error) {
    throw new Error(error.message || "Erro ao comunicar com o servidor");
  }

  return payload as T;
};

export const fetchUsers = async (): Promise<UserWithRole[]> => {
  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, email, full_name, created_at")
    .order("created_at", { ascending: false });

  if (profilesError) throw profilesError;

  const { data: roles, error: rolesError } = await supabase
    .from("user_roles")
    .select("user_id, role");

  if (rolesError) throw rolesError;

  const roleMap = new Map((roles ?? []).map((r) => [r.user_id, r.role as AppRole]));

  return (profiles ?? []).map((p) => ({
    ...p,
    role: roleMap.get(p.id) ?? null,
  }));
};

export const createUser = async (payload: {
  email: string;
  password: string;
  full_name?: string;
  role: AppRole;
}) => {
  const data = await invokeManageUsers<{ user: UserWithRole }>({
    action: "create",
    ...payload,
  });

  if (!data.user) throw new Error("Usuário criado, mas a resposta veio incompleta");
  return data.user;
};

export const updateUserRole = async (user_id: string, role: AppRole) => {
  const data = await invokeManageUsers({ action: "update_role", user_id, role });
  if (!data.success) throw new Error("Não foi possível atualizar o perfil");
};

export const resetUserPassword = async (user_id: string, password: string) => {
  const data = await invokeManageUsers({ action: "reset_password", user_id, password });
  if (!data.success) {
    throw new Error("Não foi possível redefinir a senha. Tente uma senha mais forte e diferente da atual.");
  }
};

export const formatErrorMessage = (err: unknown, fallback: string) => {
  if (err instanceof Error && err.message.trim() && err.message !== "{}") {
    return err.message;
  }
  if (typeof err === "string" && err.trim()) return err;
  return fallback;
};
