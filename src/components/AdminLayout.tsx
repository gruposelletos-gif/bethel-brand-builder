import { ReactNode } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { LogOut, Package, LayoutDashboard, Tags } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo-bethel.png";

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? "bg-primary text-primary-foreground"
        : "text-muted-foreground hover:bg-muted hover:text-foreground"
    }`;

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <aside className="md:w-64 md:min-h-screen bg-card border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="BETHEL" className="h-10 w-auto" />
            <span className="font-heading text-sm font-bold">Admin</span>
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          <NavLink to="/admin" end className={navClass}>
            <LayoutDashboard size={18} /> Dashboard
          </NavLink>
          <NavLink to="/admin/produtos" className={navClass}>
            <Package size={18} /> Produtos
          </NavLink>
          <NavLink to="/admin/categorias" className={navClass}>
            <Tags size={18} /> Categorias
          </NavLink>
        </nav>
        <div className="p-3 border-t border-border space-y-2">
          <p className="text-xs text-muted-foreground truncate px-2">{user?.email}</p>
          <Button variant="outline" size="sm" onClick={handleLogout} className="w-full">
            <LogOut size={16} /> Sair
          </Button>
        </div>
      </aside>
      <main className="flex-1 p-4 md:p-8 overflow-x-hidden">{children}</main>
    </div>
  );
};

export default AdminLayout;
