import React from 'react';
import { CentralPageShell } from '../components/CentralPageShell';
import { SectionPanel } from '../components/SectionPanel';

const shortcuts = ['Criar sistema novo', 'Criar módulo novo', 'Criar tabela Supabase', 'Criar API', 'Criar componente', 'Criar integração', 'Criar agente técnico', 'Fazer deploy', 'Refatorar legado', 'Reaproveitar módulo existente'];

const DevModePage: React.FC = () => (
  <CentralPageShell title="Modo Dev / Programador" subtitle="Atalhos para responder rapidamente qual padrão consultar antes de construir.">
    <SectionPanel title="Antes de construir">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
        {shortcuts.map((shortcut) => <article key={shortcut} className="rounded-2xl border border-sagb-line bg-sagb-bg-2 p-4 text-[12px] font-black text-sagb-text">{shortcut}</article>)}
      </div>
    </SectionPanel>
  </CentralPageShell>
);
export default DevModePage;

