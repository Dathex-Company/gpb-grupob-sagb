import React from 'react';
import DevRoomView from '../components/DevRoomView';
import { Agent } from '../../../../types';

interface SalaDevPageProps {
  agents?: Agent[];
}

export const SalaDevPage: React.FC<SalaDevPageProps> = ({ agents = [] }) => {
  return <DevRoomView agents={agents} />;
};

export default SalaDevPage;

