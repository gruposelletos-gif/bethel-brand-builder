import PageLayout from "@/components/PageLayout";
import SimplePage from "@/components/SimplePage";

const PoliticaPrivacidade = () => (
  <PageLayout>
    <SimplePage
      title="Política de Privacidade"
      subtitle="Como tratamos seus dados em conformidade com a LGPD."
    >
      <h2 className="font-heading text-xl font-semibold text-foreground mt-6">Coleta de dados</h2>
      <p>
        Coletamos apenas os dados necessários para atendimento comercial: nome, e-mail, telefone
        e informações fornecidas em formulários de contato e orçamento.
      </p>
      <h2 className="font-heading text-xl font-semibold text-foreground mt-6">Uso das informações</h2>
      <p>
        Utilizamos seus dados exclusivamente para responder solicitações, elaborar orçamentos e
        manter comunicação comercial relacionada aos nossos produtos e serviços.
      </p>
      <h2 className="font-heading text-xl font-semibold text-foreground mt-6">Compartilhamento</h2>
      <p>
        Não compartilhamos dados com terceiros, exceto quando exigido por lei ou para
        viabilizar a entrega de produtos solicitados.
      </p>
      <h2 className="font-heading text-xl font-semibold text-foreground mt-6">Seus direitos</h2>
      <p>
        Você pode solicitar, a qualquer momento, acesso, correção ou exclusão dos seus dados
        através dos nossos canais oficiais de contato.
      </p>
    </SimplePage>
  </PageLayout>
);

export default PoliticaPrivacidade;
