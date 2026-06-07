import React from 'react';
import { TabId } from '../../../../types';
import NagiShell from '../components/NagiShell';

interface NAGIPageProps {
  onBack?: () => void;
  onOpenTab?: (tab: TabId) => void;
}

const NAGIPage: React.FC<NAGIPageProps> = ({ onBack, onOpenTab }) => {
  return (
    <NagiShell
      onBack={onBack || (() => {})}
      onOpenTab={onOpenTab}
    />
  );
};

export default NAGIPage;
