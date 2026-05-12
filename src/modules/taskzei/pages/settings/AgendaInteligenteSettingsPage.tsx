import React from 'react';
import { NotificationTestPanel } from '../../components/notifications/NotificationTestPanel';

export const AgendaInteligenteSettingsPage: React.FC = () => {
  return (
    <div
      className="flex flex-col h-full overflow-hidden p-8"
      style={{
        backgroundColor: 'var(--sagb-surface)',
        borderRadius: 'var(--sagb-radius-xl)',
        border: '1px solid var(--sagb-line)',
        boxShadow: 'var(--sagb-shadow)',
      }}
    >
      <div className="max-w-4xl mx-auto w-full space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--sagb-text)' }}>
            Configurações
          </h1>
          <p className="mt-2 font-medium" style={{ color: 'var(--sagb-muted)' }}>
            Ajustes do módulo Agenda Inteligente.
          </p>
        </div>

        {/* Seção: Teste de Notificações */}
        <section>
          <div className="mb-4">
            <h2 className="text-[15px] font-semibold" style={{ color: 'var(--sagb-text)' }}>
              Notificações
            </h2>
            <p className="text-[12px] mt-0.5" style={{ color: 'var(--sagb-muted)' }}>
              Dispare notificações de teste para validar o fluxo de e-mail (Resend/SendGrid) e push (OneSignal).
            </p>
          </div>
          <NotificationTestPanel />
        </section>

        {/* Placeholder para futuras configurações */}
        <div
          className="rounded-xl p-6 flex items-center justify-center h-32 border-dashed"
          style={{
            border: '1px dashed var(--sagb-line)',
            backgroundColor: 'var(--sagb-bg)',
            color: 'var(--sagb-muted)',
          }}
        >
          <p className="font-medium text-[13px]">[ Mais configurações em breve ]</p>
        </div>
      </div>
    </div>
  );
};
