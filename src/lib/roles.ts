export type AppRole = "admin" | "viewer" | "client" | "user";

export const ROLE_LABELS: Record<AppRole, string> = {
  admin: "Administrador",
  viewer: "Visualizador",
  client: "Cliente",
  user: "Usuário",
};

export const MANAGEABLE_ROLES: AppRole[] = ["admin", "viewer", "client"];

export const roleHomePath = (role: AppRole | null): string => {
  if (role === "admin") return "/admin";
  if (role === "viewer") return "/admin/formularios";
  if (role === "client") return "/cliente/formularios";
  return "/auth";
};
