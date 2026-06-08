import React, { useMemo } from 'react';
import DevRoomView from '../components/DevRoomView';
import { Agent } from '../../../../types';
import { quadroDeEliteConnector } from '../services/quadroDeEliteConnector';

interface SalaDevPageProps {
  agents?: Agent[];
}

export const SalaDevPage: React.FC<SalaDevPageProps> = ({ agents = [] }) => {
  // Filtra apenas os agentes da Sala Dev (CA-01 a CA-18) vindos do Quadro de Elite
  // Se nenhum agente for encontrado, passa array vazio — o hook usará fallback mock
  const salaDevAgents = useMemo(
    () => quadroDeEliteConnector.filterSalaDevAgents(agents),
    [agents]
  );

  return <DevRoomView agents={salaDevAgents} />;
};

export default SalaDevPage;
