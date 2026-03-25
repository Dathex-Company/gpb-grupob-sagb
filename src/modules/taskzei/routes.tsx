import React from 'react';
import { AgendaInteligenteLayout } from './layout/AgendaInteligenteLayout';

// Rota inicial do módulo, base para futura abstração de router
export const taskzeiRoutes = {
  path: '/agenda-inteligente',
  element: <AgendaInteligenteLayout />
};
