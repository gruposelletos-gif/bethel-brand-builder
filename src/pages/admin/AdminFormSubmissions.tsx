import { useCallback, useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import FormConfigEditor from "@/components/admin/FormConfigEditor";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import {
  deleteFormSubmission,
  fetchFormSubmissions,
  type FormSubmission,
} from "@/lib/form-submissions";
import { toast } from "@/hooks/use-toast";
import { Trash2, RefreshCw, Inbox, Settings2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const AdminFormSubmissions = () => {
  const { isAdmin, loading: authLoading, hasRole, user } = useAuth();
  const [items, setItems] = useState<FormSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  const canView = hasRole(["admin", "viewer"]);

  const load = useCallback(async () => {
    if (!user || !canView) return;
    setLoading(true);
    try {
      const data = await fetchFormSubmissions();
      setItems(data);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Erro desconhecido";
      toast({ title: "Erro ao carregar formulários", description: message, variant: "destructive" });
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [user, canView]);

  useEffect(() => {
    if (authLoading) return;
    if (!user || !canView) {
      setLoading(false);
      return;
    }
    void load();
  }, [authLoading, user, canView, load]);

  const remove = async (id: string) => {
    if (!confirm("Excluir este formulário?")) return;
    try {
      await deleteFormSubmission(id);
      toast({ title: "Formulário excluído" });
      void load();
    } catch (err) {
      toast({
        title: "Erro",
        description: err instanceof Error ? err.message : "Não foi possível excluir",
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="font-heading text-2xl md:text-3xl font-bold mb-2 text-balance">
          Formulários
        </h1>
        <p className="text-sm text-muted-foreground text-pretty">
          Gerencie os envios recebidos e configure como os formulários aparecem no site.
        </p>
      </div>

      <Tabs defaultValue="recebidos" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="recebidos" className="gap-2">
            <Inbox size={14} aria-hidden="true" /> Recebidos
          </TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="configurar" className="gap-2">
              <Settings2 size={14} aria-hidden="true" /> Configurar
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="recebidos" className="space-y-4">
          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => void load()}
              disabled={loading || authLoading}
            >
              <RefreshCw size={14} aria-hidden="true" /> Atualizar
            </Button>
          </div>

          {authLoading || loading ? (
            <div role="status" className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
              Carregando formulários…
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border bg-muted/20 p-6 text-sm text-muted-foreground text-pretty">
              Nenhum formulário recebido ainda.
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-muted-foreground tabular-nums">
                {items.length} {items.length === 1 ? "formulário" : "formulários"}
              </p>
              {items.map((item) => (
                <article key={item.id} className="rounded-lg border border-border bg-card p-5 shadow-sm">
                  <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <h2 className="font-heading text-lg font-bold text-balance">
                        {item.assunto ??
                          (item.tipo === "orcamento_produto" ? "Orçamento de Produto" : "Formulário")}
                      </h2>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(new Date(item.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        {item.tipo === "orcamento_produto" && (
                          <span className="ml-2 inline-flex rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                            Orçamento
                          </span>
                        )}
                        {item.tipo === "contato" && (
                          <span className="ml-2 inline-flex rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                            Contato
                          </span>
                        )}
                      </p>
                    </div>
                    {isAdmin && (
                      <Button size="sm" variant="outline" onClick={() => remove(item.id)}>
                        <Trash2 size={14} aria-hidden="true" /> Excluir
                      </Button>
                    )}
                  </div>
                  <div className="mb-3 grid gap-2 text-sm sm:grid-cols-2">
                    {item.nome && <p><span className="font-medium">Nome:</span> {item.nome}</p>}
                    {item.email && <p><span className="font-medium">E-mail:</span> {item.email}</p>}
                    {item.telefone && <p><span className="font-medium">Telefone:</span> {item.telefone}</p>}
                    {item.empresa && <p><span className="font-medium">Empresa:</span> {item.empresa}</p>}
                    {item.product_name && (
                      <p className="sm:col-span-2">
                        <span className="font-medium">Produto:</span> {item.product_name}
                        {item.product_slug && (
                          <span className="text-muted-foreground"> ({item.product_slug})</span>
                        )}
                      </p>
                    )}
                  </div>
                  {item.mensagem ? (
                    <p className="whitespace-pre-wrap text-sm text-pretty">
                      <span className="font-medium">Observação: </span>
                      {item.mensagem}
                    </p>
                  ) : (
                    <p className="text-sm italic text-muted-foreground/70">Sem observação informada.</p>
                  )}
                </article>
              ))}
            </div>
          )}
        </TabsContent>

        {isAdmin && (
          <TabsContent value="configurar">
            <FormConfigEditor />
          </TabsContent>
        )}
      </Tabs>
    </AdminLayout>
  );
};

export default AdminFormSubmissions;
