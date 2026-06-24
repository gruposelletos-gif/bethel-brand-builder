import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createUser,
  fetchUsers,
  formatErrorMessage,
  resetUserPassword,
  updateUserRole,
  type UserWithRole,
} from "@/lib/users";
import { MANAGEABLE_ROLES, ROLE_LABELS, type AppRole } from "@/lib/roles";
import { toast } from "@/hooks/use-toast";
import { KeyRound, Plus } from "lucide-react";

const AdminUsers = () => {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [busy, setBusy] = useState(false);
  const [passwordResetUser, setPasswordResetUser] = useState<UserWithRole | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resettingPassword, setResettingPassword] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    full_name: "",
    role: "client" as AppRole,
  });

  const load = () => fetchUsers().then(setUsers).catch((e) => {
    toast({ title: "Erro", description: formatErrorMessage(e, "Não foi possível carregar os usuários"), variant: "destructive" });
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
        description: formatErrorMessage(err, "Não foi possível criar o usuário"),
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
        description: formatErrorMessage(err, "Não foi possível atualizar o perfil"),
        variant: "destructive",
      });
    }
  };

  const openPasswordReset = (user: UserWithRole) => {
    setPasswordResetUser(user);
    setNewPassword("");
    setConfirmPassword("");
  };

  const closePasswordReset = () => {
    setPasswordResetUser(null);
    setNewPassword("");
    setConfirmPassword("");
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordResetUser) return;

    if (newPassword.length < 8) {
      toast({
        title: "Senha curta demais",
        description: "Use no mínimo 8 caracteres.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Senhas não conferem",
        description: "Digite a mesma senha nos dois campos.",
        variant: "destructive",
      });
      return;
    }

    setResettingPassword(true);
    try {
      await resetUserPassword(passwordResetUser.id, newPassword);
      toast({
        title: "Senha redefinida",
        description: `A senha de ${passwordResetUser.email} foi atualizada.`,
      });
      closePasswordReset();
    } catch (err) {
      toast({
        title: "Erro",
        description: formatErrorMessage(err, "Não foi possível redefinir a senha"),
        variant: "destructive",
      });
    } finally {
      setResettingPassword(false);
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
            minLength={8}
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
              <div className="flex flex-col sm:flex-row gap-2 sm:items-center w-full sm:w-auto">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto"
                  onClick={() => openPasswordReset(u)}
                >
                  <KeyRound size={16} aria-hidden />
                  Redefinir senha
                </Button>
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
            </div>
          ))
        )}
      </div>

      <Dialog open={!!passwordResetUser} onOpenChange={(open) => !open && closePasswordReset()}>
        <DialogContent>
          <form onSubmit={handlePasswordReset}>
            <DialogHeader>
              <DialogTitle>Redefinir senha</DialogTitle>
              <DialogDescription>
                Defina uma nova senha para{" "}
                <span className="font-medium text-foreground">{passwordResetUser?.email}</span>.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div>
                <Label htmlFor="new-password">Nova senha</Label>
                <Input
                  id="new-password"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Mínimo de 8 caracteres"
                />
              </div>
              <div>
                <Label htmlFor="confirm-password">Confirmar senha</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repita a nova senha"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Use uma senha forte com letras, números e símbolos. Evite senhas comuns como 12345678.
              </p>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={closePasswordReset}>
                Cancelar
              </Button>
              <Button type="submit" disabled={resettingPassword}>
                {resettingPassword ? "Salvando..." : "Salvar nova senha"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminUsers;
