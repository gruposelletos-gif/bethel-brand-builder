import PageLayout from "@/components/PageLayout";
import SimplePage from "@/components/SimplePage";

const Blog = () => (
  <PageLayout>
    <SimplePage
      title="Blog BETHEL"
      subtitle="Conteúdos sobre acessibilidade, normas técnicas e segurança em ambientes adaptados."
    >
      <p>
        Em breve publicaremos artigos sobre <strong>NBR 9050</strong>, <strong>NBR 16537</strong>,
        boas práticas em sinalização tátil e cases de implantação.
      </p>
      <p>
        Acompanhe nossas redes sociais e entre em contato para sugestões de pauta.
      </p>
    </SimplePage>
  </PageLayout>
);

export default Blog;
