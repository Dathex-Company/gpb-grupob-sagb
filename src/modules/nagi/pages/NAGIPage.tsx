import React from 'react';
import { TabId } from '../../../../types';
import NagiShell from '../components/NagiShell';
import { NagiSection } from '../components/NAGIView';

interface NAGIPageProps {
  onBack?: () => void;
  onOpenTab?: (tab: TabId) => void;
  initialSection?: NagiSection;
}

const NAGIPage: React.FC<NAGIPageProps> = ({ onBack, onOpenTab, initialSection }) => {
  return (
    <NagiShell
      onBack={onBack || (() => {})}
      onOpenTab={onOpenTab}
      initialSection={initialSection}
    />
  );
};

export default NAGIPage;
