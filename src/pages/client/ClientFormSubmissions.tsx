import { useEffect, useState } from "react";
import ClientLayout from "@/components/ClientLayout";
import { fetchFormSubmissions, type FormSubmission } from "@/lib/form-submissions";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ClientFormSubmissions = () => {
  const [items, setItems] = useState<FormSubmission[]>([]);

  useEffect(() => {
    fetchFormSubmissions()
      .then(setItems)
      .catch((e) => toast({ title: "Erro", description: e.message, variant: "destructive" }));
  }, []);

  return (
    <ClientLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold">Meus formulários</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Aqui aparecem apenas os formulários que você enviou estando logado.
          </p>
        </div>
        <Button asChild>
          <Link to="/contato">Enviar novo formulário</Link>
        </Button>
      </div>

      <div className="space-y-4">
        {items.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-6 text-sm text-muted-foreground">
            Você ainda não enviou nenhum formulário logado. Acesse a página de contato para enviar um.
          </div>
        ) : (
          items.map((item) => (
            <article key={item.id} className="bg-card border border-border rounded-lg p-5">
              <h2 className="font-heading font-bold text-lg">{item.assunto}</h2>
              <p className="text-xs text-muted-foreground mb-3">
                {format(new Date(item.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </p>
              <div className="grid sm:grid-cols-2 gap-2 text-sm mb-3">
                <p><span className="font-medium">Nome:</span> {item.nome}</p>
                <p><span className="font-medium">E-mail:</span> {item.email}</p>
                <p><span className="font-medium">Telefone:</span> {item.telefone}</p>
                {item.empresa && <p><span className="font-medium">Empresa:</span> {item.empresa}</p>}
              </div>
              <p className="text-sm whitespace-pre-wrap">{item.mensagem}</p>
            </article>
          ))
        )}
      </div>
    </ClientLayout>
  );
};

export default ClientFormSubmissions;
