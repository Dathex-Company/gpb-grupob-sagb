import React from 'react';
import { integrationHub } from '../../hub-integracao/services/integrationService';

const CRM_ZIPLIA_URL = 'http://localhost:3000';

export const CrmZipliaGatewayPage: React.FC = () => {
  const [to, setTo] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [sending, setSending] = React.useState(false);
  const [result, setResult] = React.useState<string | null>(null);

  const handleOpenCrm = () => {
    window.open(CRM_ZIPLIA_URL, '_blank', 'noopener,noreferrer');
  };

  const handleSendWhatsAppPoc = async () => {
    if (!to.trim() || !message.trim()) return;

    try {
      setSending(true);
      setResult(null);
      const response = await integrationHub.sendWhatsAppMessage({
        to: to.trim(),
        message: message.trim()
      });
      setResult(`Mensagem enviada via Hub. ID externo: ${response.externalId}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Falha ao enviar mensagem via Hub';
      setResult(`Erro: ${errorMessage}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex-1 p-10 bg-white dark:bg-sagb-bg text-gray-900 dark:text-sagb-text min-h-full transition-colors duration-300">
      <header className="mb-8">
        <h1 className="text-3xl font-black uppercase tracking-tighter">CRM Ziplia</h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 mt-2">
          Acesso ao CRM externo da Venture Ziplia, mantendo o SagB como cockpit principal.
        </p>
      </header>

      <section className="bg-gray-50 dark:bg-sagb-card rounded-2xl p-8 border border-gray-200 dark:border-sagb-border max-w-3xl">
        <h2 className="text-xl font-bold mb-3">Conector Externo</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Este módulo funciona como ponte. O CRM permanece fora do runtime interno do SagB, dentro da estrutura da Ziplia.
        </p>

        <div className="space-y-2 mb-6 text-sm text-gray-600 dark:text-gray-400">
          <p><span className="font-semibold">Origem:</span> Venture Ziplia</p>
          <p><span className="font-semibold">Tipo:</span> Acesso externo</p>
          <p><span className="font-semibold">URL padrão:</span> {CRM_ZIPLIA_URL}</p>
        </div>

        <button
          onClick={handleOpenCrm}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          Abrir CRM Ziplia
        </button>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-sagb-border">
          <h3 className="text-lg font-semibold mb-3">POC WhatsApp via Hub de Integrações</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Fluxo CRM → Hub → WhatsApp (Meta). Requer credenciais da integração <code>int_waba_01</code> no Hub.
          </p>

          <div className="grid gap-3">
            <input
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="Número destino (ex: 5511999999999)"
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-sagb-border bg-white dark:bg-sagb-bg"
            />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Mensagem"
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-sagb-border bg-white dark:bg-sagb-bg min-h-[100px]"
            />
            <button
              onClick={handleSendWhatsAppPoc}
              disabled={sending || !to.trim() || !message.trim()}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-medium rounded-lg transition-colors"
            >
              {sending ? 'Enviando...' : 'Enviar via Hub'}
            </button>
            {result ? <div className="text-sm text-gray-700 dark:text-gray-300">{result}</div> : null}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CrmZipliaGatewayPage;

