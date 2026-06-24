import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createUser, fetchUsers, updateUserRole, type UserWithRole } from "@/lib/users";
import { MANAGEABLE_ROLES, ROLE_LABELS, type AppRole } from "@/lib/roles";
import { toast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";

const AdminUsers = () => {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    full_name: "",
    role: "client" as AppRole,
  });

  const load = () => fetchUsers().then(setUsers).catch((e) => {
    toast({ title: "Erro", description: e.message, variant: "destructive" });
  });

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await createUser({
        email: form.email,
        password: form.password,
        full_name: form.full_name || undefined,
        role: form.role,
      });
      toast({ title: "Usuário criado com sucesso" });
      setForm({ email: "", password: "", full_name: "", role: "client" });
      load();
    } catch (err) {
      toast({
        title: "Erro",
        description: err instanceof Error ? err.message : "Não foi possível criar o usuário",
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
  };

  const handleRoleChange = async (userId: string, role: AppRole) => {
    try {
      await updateUserRole(userId, role);
      toast({ title: "Perfil atualizado" });
      load();
    } catch (err) {
      toast({
        title: "Erro",
        description: err instanceof Error ? err.message : "Não foi possível atualizar o perfil",
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout>
      <h1 className="font-heading text-2xl md:text-3xl font-bold mb-6">Usuários</h1>

      <form
        onSubmit={handleCreate}
        className="bg-card border border-border rounded-lg p-4 mb-6 grid gap-3 md:grid-cols-2 lg:grid-cols-5 md:items-end"
      >
        <div>
          <Label htmlFor="user-name">Nome</Label>
          <Input
            id="user-name"
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            placeholder="Opcional"
          />
        </div>
        <div>
          <Label htmlFor="user-email">E-mail *</Label>
          <Input
            id="user-email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="user-password">Senha *</Label>
          <Input
            id="user-password"
            type="password"
            required
            minLength={6}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
        <div>
          <Label>Perfil *</Label>
          <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v as AppRole })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MANAGEABLE_ROLES.map((r) => (
                <SelectItem key={r} value={r}>
                  {ROLE_LABELS[r]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" disabled={busy}>
          <Plus size={16} /> Cadastrar usuário
        </Button>
      </form>

      <div className="bg-card border border-border rounded-lg divide-y divide-border">
        {users.length === 0 ? (
          <p className="p-4 text-sm text-muted-foreground">Nenhum usuário cadastrado.</p>
        ) : (
          users.map((u) => (
            <div key={u.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="font-medium">{u.full_name || u.email}</div>
                <div className="text-xs text-muted-foreground">{u.email}</div>
              </div>
              <Select
                value={u.role ?? undefined}
                onValueChange={(v) => handleRoleChange(u.id, v as AppRole)}
              >
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Sem perfil" />
                </SelectTrigger>
                <SelectContent>
                  {MANAGEABLE_ROLES.map((r) => (
                    <SelectItem key={r} value={r}>
                      {ROLE_LABELS[r]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
