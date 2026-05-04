import React, { useState } from 'react';
import { ModuleRoute } from '../../core/modules/module.types';
import { MentoriasDashboardPage } from './pages/MentoriasDashboardPage';
import { MentoriasLibraryPage } from './pages/MentoriasLibraryPage';
import { MentoriaDetailPage } from './pages/MentoriaDetailPage';

const MentoriasModuleContainer: React.FC = () => {
  const [view, setView] = useState<'dashboard' | 'library' | 'detail'>('dashboard');
  const [selectedId, setSelectedId] = useState<string | undefined>();

  const handleNavigate = (newView: 'dashboard' | 'library' | 'detail', id?: string) => {
    setView(newView);
    setSelectedId(id);
  };

  const handleBackToSagB = () => {
    window.dispatchEvent(new CustomEvent('sagb:navigate', { detail: 'ecosystem' }));
  };

  switch (view) {
    case 'dashboard':
      return <MentoriasDashboardPage onNavigate={handleNavigate} onBackToSagB={handleBackToSagB} />;
    case 'library':
      return <MentoriasLibraryPage onNavigate={handleNavigate} />;
    case 'detail':
      return <MentoriaDetailPage id={selectedId} onBack={() => setView('library')} />;
    default:
      return <MentoriasDashboardPage onNavigate={handleNavigate} onBackToSagB={handleBackToSagB} />;
  }
};

export const mentoriasRoutes: ModuleRoute = {
  path: '/mentorias',
  element: <MentoriasModuleContainer />,
  fullscreen: true
};
