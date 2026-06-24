import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Images } from "lucide-react";
import {
  fetchPortfolioProjects,
  portfolioCoverUrl,
  portfolioImageUrls,
  type PortfolioProject,
} from "@/lib/portfolio-projects";

const PortfolioSection = () => {
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["portfolio-projects"],
    queryFn: () => fetchPortfolioProjects(true),
    staleTime: 60_000,
  });

  const [openProjectId, setOpenProjectId] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<{ projectId: string; imgIdx: number } | null>(null);

  const openProject = projects.find((p) => p.id === openProjectId) ?? null;
  const lightboxProject = lightbox
    ? projects.find((p) => p.id === lightbox.projectId)
    : null;
  const lightboxImages = lightboxProject ? portfolioImageUrls(lightboxProject.images) : [];

  const openLightbox = (projectId: string, imgIdx: number) => {
    setLightbox({ projectId, imgIdx });
  };

  const closeLightbox = () => setLightbox(null);

  const navigate = (dir: number) => {
    if (!lightbox || lightboxImages.length === 0) return;
    const next = (lightbox.imgIdx + dir + lightboxImages.length) % lightboxImages.length;
    setLightbox({ ...lightbox, imgIdx: next });
  };

  return (
    <section id="portfolio" className="section-padding bg-muted">
      <div className="container-bethel">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
            <span className="text-gradient">Projetos Finalizados</span>
          </h2>
          <div className="w-20 h-1 gradient-primary mx-auto mt-4 rounded-full" />
          <p className="font-body text-muted-foreground text-lg mt-6 max-w-3xl mx-auto leading-relaxed">
            Confira alguns projetos já executados pela Bethel, com soluções voltadas para{" "}
            <span className="text-primary font-semibold">acessibilidade</span>,{" "}
            <span className="text-primary font-semibold">segurança</span> e qualidade de execução.
          </p>
        </motion.div>

        {isLoading ? (
          <p className="text-center text-muted-foreground">Carregando projetos...</p>
        ) : projects.length === 0 ? (
          <p className="text-center text-muted-foreground">Nenhum projeto disponível no momento.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                isOpen={openProjectId === project.id}
                onToggle={() =>
                  setOpenProjectId(openProjectId === project.id ? null : project.id)
                }
              />
            ))}
          </div>
        )}

        <AnimatePresence>
          {openProject && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
              className="overflow-hidden mt-8"
            >
              <div className="bg-card border border-border rounded-xl p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-heading text-lg md:text-xl font-bold text-foreground">
                    {openProject.title}
                  </h3>
                  <button
                    onClick={() => setOpenProjectId(null)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                  {portfolioImageUrls(openProject.images).map((img, iIdx) => (
                    <motion.div
                      key={`${openProject.id}-${iIdx}`}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: iIdx * 0.05 }}
                      className="aspect-[4/3] rounded-lg overflow-hidden cursor-pointer group/img"
                      onClick={(e) => {
                        e.stopPropagation();
                        openLightbox(openProject.id, iIdx);
                      }}
                    >
                      <img
                        src={img}
                        alt={`${openProject.title} - Foto ${iIdx + 1}`}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-500"
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {lightbox && lightboxProject && lightboxImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white/80 hover:text-white z-10"
            >
              <X size={28} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(-1);
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white z-10"
            >
              <ChevronLeft size={36} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(1);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white z-10"
            >
              <ChevronRight size={36} />
            </button>

            <motion.img
              key={lightbox.imgIdx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              src={lightboxImages[lightbox.imgIdx]}
              alt=""
              className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />

            <div className="absolute bottom-4 text-white/60 text-sm">
              {lightbox.imgIdx + 1} / {lightboxImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

const ProjectCard = ({
  project,
  isOpen,
  onToggle,
}: {
  project: PortfolioProject;
  isOpen: boolean;
  onToggle: () => void;
}) => {
  const cover = portfolioCoverUrl(project);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      className="rounded-xl overflow-hidden bg-card border border-border shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer card-3d"
      onClick={onToggle}
    >
      <div className="aspect-[4/3] overflow-hidden relative">
        {cover && (
          <img
            src={cover}
            alt={project.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 to-transparent" />
        <div className="absolute bottom-3 right-3 bg-background/80 backdrop-blur-sm text-foreground text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5">
          <Images size={14} />
          {project.images.length} fotos
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-heading text-base font-bold text-foreground mb-2 leading-snug">
          {project.title}
        </h3>
        <p className="font-body text-muted-foreground text-sm leading-relaxed">
          {project.description}
        </p>
        <span className="inline-block mt-3 text-primary text-sm font-semibold">
          {isOpen ? "Fechar galeria ▲" : "Ver galeria ▼"}
        </span>
      </div>
    </motion.div>
  );
};

export default PortfolioSection;
