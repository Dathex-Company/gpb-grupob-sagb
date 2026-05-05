import React from 'react';

const PROVIDER_COLORS: Record<string, string> = {
  whatsapp: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  clickup: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  gmail: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  titan: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  meta_facebook: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'google-calendar': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  supabase: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
};

interface ProviderBadgeProps {
  provider: string;
}

export function ProviderBadge({ provider }: ProviderBadgeProps) {
  const colorClass = PROVIDER_COLORS[provider] || 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';

  return (
    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${colorClass}`}>
      {provider}
    </span>
  );
}
