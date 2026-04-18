import React from 'react';
import NAGIView from '../components/NAGIView';

interface NAGIPageProps {
  onBack?: () => void;
}

const NAGIPage: React.FC<NAGIPageProps> = ({ onBack }) => {
  return <NAGIView onBack={onBack} />;
};

export default NAGIPage;
