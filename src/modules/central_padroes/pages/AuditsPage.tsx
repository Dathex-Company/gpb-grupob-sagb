import React from 'react';
import { CentralPageShell } from '../components/CentralPageShell';
import { SectionPanel } from '../components/SectionPanel';

const AuditsPage: React.FC = () => <CentralPageShell title="Auditorias e Evidências" subtitle="Área preparada para achados, evidências, severidade e planos de ação."><SectionPanel title="Status V1" description="Estrutura criada; persistência real de evidências depende da etapa de Storage/RLS." ><p className="text-[12px] text-sagb-muted">Nenhuma auditoria formal registrada nesta implantação local.</p></SectionPanel></CentralPageShell>;
export default AuditsPage;

