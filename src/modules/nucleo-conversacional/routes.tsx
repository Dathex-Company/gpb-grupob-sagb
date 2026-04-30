import React from 'react';
import { ModuleRoute } from '../../core/modules/module.types';
import ConversationsView from './pages/ConversationsView';

export const routes: ModuleRoute = {
  path: '/conversas/*',
  element: <ConversationsView />
};

