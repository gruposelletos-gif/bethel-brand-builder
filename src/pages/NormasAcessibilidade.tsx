import PageLayout from "@/components/PageLayout";
import SimplePage from "@/components/SimplePage";

const NormasAcessibilidade = () => (
  <PageLayout>
    <SimplePage
      title="Normas de Acessibilidade"
      subtitle="Trabalhamos em rigorosa conformidade com as normas brasileiras."
    >
      <h2 className="font-heading text-xl font-semibold text-foreground mt-6">NBR 9050</h2>
      <p>
        Estabelece critérios e parâmetros técnicos para projetos, construção, instalação e
        adaptação de edificações, mobiliário, espaços e equipamentos urbanos garantindo
        acessibilidade.
      </p>
      <h2 className="font-heading text-xl font-semibold text-foreground mt-6">NBR 16537</h2>
      <p>
        Define a aplicação da sinalização tátil no piso — alerta e direcional — para orientação
        e segurança de pessoas com deficiência visual em rotas acessíveis.
      </p>
      <h2 className="font-heading text-xl font-semibold text-foreground mt-6">Nosso compromisso</h2>
      <p>
        Todos os produtos BETHEL são fabricados respeitando dimensões, cores, contrastes e
        relevos exigidos pelas normas, assegurando segurança e conformidade legal aos projetos.
      </p>
    </SimplePage>
  </PageLayout>
);

export default NormasAcessibilidade;
