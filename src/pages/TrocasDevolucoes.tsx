import PageLayout from "@/components/PageLayout";
import SimplePage from "@/components/SimplePage";

const TrocasDevolucoes = () => (
  <PageLayout>
    <SimplePage
      title="Trocas e Devoluções"
      subtitle="Política aplicável a produtos fornecidos pela BETHEL."
    >
      <h2 className="font-heading text-xl font-semibold text-foreground mt-6">Prazo</h2>
      <p>
        O cliente tem até 7 (sete) dias corridos, contados a partir do recebimento do produto,
        para solicitar troca ou devolução, conforme o Código de Defesa do Consumidor.
      </p>
      <h2 className="font-heading text-xl font-semibold text-foreground mt-6">Condições</h2>
      <p>
        Os produtos devem estar sem uso, em sua embalagem original, acompanhados de nota fiscal e
        de todos os acessórios. Itens personalizados ou produzidos sob medida não se enquadram
        em troca, salvo por defeito de fabricação.
      </p>
      <h2 className="font-heading text-xl font-semibold text-foreground mt-6">Como solicitar</h2>
      <p>
        Entre em contato pelos canais oficiais informando o número da nota fiscal e o motivo da
        solicitação. Nossa equipe orientará o procedimento de coleta e análise.
      </p>
    </SimplePage>
  </PageLayout>
);

export default TrocasDevolucoes;
