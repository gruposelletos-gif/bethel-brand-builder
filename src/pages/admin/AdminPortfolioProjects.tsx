import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { fetchPortfolioProjects, portfolioCoverUrl, type PortfolioProject } from "@/lib/portfolio-projects";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Pencil, Trash2 } from "lucide-react";

const AdminPortfolioProjects = () => {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);

  const load = () =>
    fetchPortfolioProjects()
      .then(setProjects)
      .catch((e) => toast({ title: "Erro", description: e.message, variant: "destructive" }));

  useEffect(() => {
    load();
  }, []);

  const remove = async (project: PortfolioProject) => {
    if (!confirm(`Excluir o projeto "${project.title}"?`)) return;
    const { error } = await supabase.from("portfolio_projects").delete().eq("id", project.id);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Projeto excluído" });
    load();
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold">Projetos finalizados</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie os projetos exibidos na seção Portfólio da página inicial.
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/projetos/novo">
            <Plus size={16} /> Novo projeto
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {projects.length === 0 ? (
          <p className="text-sm text-muted-foreground col-span-full border border-dashed border-border rounded-lg p-6 text-center">
            Nenhum projeto cadastrado.
          </p>
        ) : (
          projects.map((project) => (
            <article key={project.id} className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="aspect-[4/3] bg-muted">
                {portfolioCoverUrl(project) ? (
                  <img
                    src={portfolioCoverUrl(project)}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                ) : null}
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <h2 className="font-heading font-bold leading-snug">{project.title}</h2>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{project.description}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {project.images.length} foto(s) · Ordem {project.sort_order}
                    {!project.active && " · Inativo"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" asChild className="flex-1">
                    <Link to={`/admin/projetos/${project.id}`}>
                      <Pencil size={14} /> Editar
                    </Link>
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => remove(project)}>
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminPortfolioProjects;
