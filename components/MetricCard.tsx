import React from 'react';

export type MetricBadge = 'real' | 'demo' | 'integration' | 'warning' | 'error';

export interface MetricCardProps {
  title: string;
  value: number | string;
  unit?: string;
  badge?: MetricBadge;
  trend?: 'up' | 'down' | 'neutral';
  status?: 'normal' | 'warning' | 'error' | 'success';
  subtitle?: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
}

const getBadgeConfig = (badge: MetricBadge) => {
  switch (badge) {
    case 'real':
      return { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Real' };
    case 'demo':
      return { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Demo' };
    case 'integration':
      return { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Em integração' };
    case 'warning':
      return { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Atenção' };
    case 'error':
      return { bg: 'bg-rose-100', text: 'text-rose-700', label: 'Erro' };
    default:
      return { bg: 'bg-slate-100', text: 'text-slate-700', label: 'Info' };
  }
};

const getStatusColor = (status: MetricCardProps['status']) => {
  switch (status) {
    case 'warning':
      return 'text-amber-600';
    case 'error':
      return 'text-rose-600';
    case 'success':
      return 'text-emerald-600';
    default:
      return 'text-slate-700';
  }
};

const getTrendIcon = (trend: MetricCardProps['trend']) => {
  switch (trend) {
    case 'up':
      return '↗';
    case 'down':
      return '↘';
    default:
      return '→';
  }
};

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  badge,
  trend,
  status = 'normal',
  subtitle,
  description,
  className = '',
  children
}) => {
  const badgeConfig = badge ? getBadgeConfig(badge) : null;
  const statusColor = getStatusColor(status);
  const trendIcon = trend ? getTrendIcon(trend) : null;

  return (
    <div className={`p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between relative ${className}`}>
      {badgeConfig && (
        <div className="absolute top-2 right-2">
          <span className={`px-1.5 py-0.5 ${badgeConfig.bg} ${badgeConfig.text} text-[8px] font-black rounded uppercase`}>
            {badgeConfig.label}
          </span>
        </div>
      )}
      
      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</div>
      
      <div className="flex items-baseline gap-1 mt-2">
        <div className={`text-3xl font-black ${statusColor}`}>
          {typeof value === 'number' ? value.toLocaleString('pt-BR') : value}
        </div>
        {unit && <div className="text-sm font-bold text-slate-500">{unit}</div>}
        {trendIcon && <div className="text-sm text-slate-400">{trendIcon}</div>}
      </div>
      
      {subtitle && (
        <div className="mt-1 text-[11px] text-slate-500 font-semibold">{subtitle}</div>
      )}
      
      {description && (
        <div className="mt-2 text-[10px] text-slate-400">{description}</div>
      )}
      
      {children && (
        <div className="mt-4 pt-3 border-t border-slate-100">
          {children}
        </div>
      )}
    </div>
  );
};

export default MetricCard;