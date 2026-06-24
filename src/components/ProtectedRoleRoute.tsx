import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import type { AppRole } from "@/lib/roles";

interface ProtectedRoleRouteProps {
  children: ReactNode;
  roles: AppRole[];
  fallbackMessage?: string;
}

const ProtectedRoleRoute = ({
  children,
  roles,
  fallbackMessage = "Sua conta não tem permissão para acessar esta área.",
}: ProtectedRoleRouteProps) => {
  const { user, role, loading, hasRole } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">
        Carregando...
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  if (!role || !hasRole(roles)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 text-center">
        <h1 className="font-heading text-2xl font-bold mb-2">Acesso restrito</h1>
        <p className="text-muted-foreground max-w-md">{fallbackMessage}</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoleRoute;
