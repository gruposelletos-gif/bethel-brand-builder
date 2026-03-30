import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Images } from "lucide-react";
import p1 from "@/assets/portfolio-1.jpg";
import p2 from "@/assets/portfolio-2.jpg";
import p3 from "@/assets/portfolio-3.jpg";
import p4 from "@/assets/portfolio-4.jpg";
import p5 from "@/assets/portfolio-5.jpg";
import p6 from "@/assets/portfolio-6.jpg";
import p7 from "@/assets/portfolio-7.jpg";
import ab1 from "@/assets/aeroporto-belem-1.jpg";
import ab2 from "@/assets/aeroporto-belem-2.jpg";
import ab3 from "@/assets/aeroporto-belem-3.jpg";
import ab4 from "@/assets/aeroporto-belem-4.jpg";
import ab5 from "@/assets/aeroporto-belem-5.jpg";
import ab6 from "@/assets/aeroporto-belem-6.jpg";
import ab7 from "@/assets/aeroporto-belem-7.jpg";
import ab8 from "@/assets/aeroporto-belem-8.jpg";
import c1 from "@/assets/cury-1.jpg";
import c2 from "@/assets/cury-2.jpg";
import c3 from "@/assets/cury-3.jpg";
import c4 from "@/assets/cury-4.jpg";
import c5 from "@/assets/cury-5.jpg";
import c6 from "@/assets/cury-6.jpg";
import c7 from "@/assets/cury-7.jpg";

interface Project {
  title: string;
  description: string;
  cover: string;
  images: string[];
}

const projects: Project[] = [
  {
    title: "Elemento Tátil em PVC – Obra Escola de Dança Vila Olímpia",
    description:
      "Instalação completa de piso tátil direcional e de alerta em PVC, garantindo acessibilidade e segurança em todos os ambientes da Escola de Dança Vila Olímpia.",
    cover: p1,
    images: [p1, p2, p3, p4, p5, p6, p7],
  },
  {
    title: "Aeroporto Internacional de Belém – COP 30",
    description:
      "Instalação de piso tátil direcional e de alerta em aço inox no Aeroporto Internacional de Belém, preparando a infraestrutura de acessibilidade para a COP 30.",
    cover: ab3,
    images: [ab1, ab2, ab3, ab4, ab5, ab6, ab7, ab8],
  },
  {
    title: "Obra Residencial – Construtora Cury",
    description:
      "Instalação de piso tátil de alerta em PVC nas áreas comuns do empreendimento residencial da Construtora Cury, incluindo escadas, elevadores e portas corta-fogo.",
    cover: c5,
    images: [c1, c2, c3, c4, c5, c6, c7],
  },
];

const PortfolioSection = () => {
  const [openProject, setOpenProject] = useState<number | null>(null);
  const [lightbox, setLightbox] = useState<{ projectIdx: number; imgIdx: number } | null>(null);

  const openLightbox = (projectIdx: number, imgIdx: number) => {
    setLightbox({ projectIdx, imgIdx });
  };

  const closeLightbox = () => setLightbox(null);

  const navigate = (dir: number) => {
    if (!lightbox) return;
    const imgs = projects[lightbox.projectIdx].images;
    const next = (lightbox.imgIdx + dir + imgs.length) % imgs.length;
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

        {/* Project Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, pIdx) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="rounded-xl overflow-hidden bg-card border border-border shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer card-3d"
              onClick={() => setOpenProject(openProject === pIdx ? null : pIdx)}
            >
              {/* Cover */}
              <div className="aspect-[4/3] overflow-hidden relative">
                <img
                  src={project.cover}
                  alt={project.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 to-transparent" />
                <div className="absolute bottom-3 right-3 bg-background/80 backdrop-blur-sm text-foreground text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                  <Images size={14} />
                  {project.images.length} fotos
                </div>
              </div>

              {/* Info */}
              <div className="p-5">
                <h3 className="font-heading text-base font-bold text-foreground mb-2 leading-snug">
                  {project.title}
                </h3>
                <p className="font-body text-muted-foreground text-sm leading-relaxed">
                  {project.description}
                </p>
                <span className="inline-block mt-3 text-primary text-sm font-semibold">
                  {openProject === pIdx ? "Fechar galeria ▲" : "Ver galeria ▼"}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Expanded Gallery */}
        <AnimatePresence>
          {openProject !== null && (
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
                    {projects[openProject].title}
                  </h3>
                  <button
                    onClick={() => setOpenProject(null)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                  {projects[openProject].images.map((img, iIdx) => (
                    <motion.div
                      key={iIdx}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: iIdx * 0.05 }}
                      className="aspect-[4/3] rounded-lg overflow-hidden cursor-pointer group/img"
                      onClick={(e) => {
                        e.stopPropagation();
                        openLightbox(openProject, iIdx);
                      }}
                    >
                      <img
                        src={img}
                        alt={`${projects[openProject].title} - Foto ${iIdx + 1}`}
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

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
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
              onClick={(e) => { e.stopPropagation(); navigate(-1); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white z-10"
            >
              <ChevronLeft size={36} />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); navigate(1); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white z-10"
            >
              <ChevronRight size={36} />
            </button>

            <motion.img
              key={lightbox.imgIdx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              src={projects[lightbox.projectIdx].images[lightbox.imgIdx]}
              alt=""
              className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />

            <div className="absolute bottom-4 text-white/60 text-sm">
              {lightbox.imgIdx + 1} / {projects[lightbox.projectIdx].images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default PortfolioSection;
