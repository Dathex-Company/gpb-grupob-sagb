export const karaokeManifest = {
  id: 'karaoke',
  internalName: 'karaoke',
  displayName: 'Karaokê SagB',
  title: 'Karaokê SagB',
  description: 'Player sincronizado para revisão e leitura guiada das sessões do Studio.',
  icon: 'Play', // fallback icon
  version: '1.0.0',
  type: 'core',
  baseRoute: '/karaoke',
  owner: {
    type: 'agent' as const,
    id: 'nanis-pelta',
    displayName: 'Nanis Pelta'
  },
  initialStatus: 'active' as const
};
