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
  const { data, error } = await supabase.functions.invoke("manage-users", {
    body: { action: "create", ...payload },
  });

  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return data.user as UserWithRole;
};

export const updateUserRole = async (user_id: string, role: AppRole) => {
  const { data, error } = await supabase.functions.invoke("manage-users", {
    body: { action: "update_role", user_id, role },
  });

  if (error) throw error;
  if (data?.error) throw new Error(data.error);
};
