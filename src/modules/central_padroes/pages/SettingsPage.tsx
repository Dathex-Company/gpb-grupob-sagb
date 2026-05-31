import React from 'react';
import { CentralPageShell } from '../components/CentralPageShell';
import { SectionPanel } from '../components/SectionPanel';

const SettingsPage: React.FC = () => <CentralPageShell title="Configurações da Central" subtitle="Área futura para papéis, permissões, destinos de sync e políticas de publicação."><SectionPanel title="Configurações V1"><p className="text-[12px] text-sagb-muted">Nesta versão, as configurações são documentais e preservam a compatibilidade com governance_rules.</p></SectionPanel></CentralPageShell>;
export default SettingsPage;

