import React from 'react';

// 1. Superfície principal (Container Base)
export const PremiumSurface: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
    <div className={`bg-[#0B0F19] text-slate-200 min-h-screen relative overflow-hidden font-sans ${className}`}>
        {/* Glow de fundo base controlado */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>
        {children}
    </div>
);

// 2. Cabeçalho Oficial
export const PremiumHeader: React.FC<{ title: string; subtitle?: string; rightAction?: React.ReactNode; className?: string }> = ({ title, subtitle, rightAction, className = '' }) => (
    <header className={`mb-12 border-b border-slate-800 pb-8 relative shrink-0 ${className}`}>
        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[60px] pointer-events-none -z-10"></div>
        <div className="flex justify-between items-start">
            <div>
                <h1 className="text-3xl font-black text-white tracking-tight mb-2 flex items-center gap-3">
                    {title}
                </h1>
                {subtitle && <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em]">{subtitle}</p>}
            </div>
            {rightAction && (
                <div>{rightAction}</div>
            )}
        </div>
    </header>
);

// 3. Card Base (Dashboard Cards)
interface PremiumCardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    hoverGlow?: boolean;
}
export const PremiumCard: React.FC<PremiumCardProps> = ({ children, className = '', onClick, hoverGlow = true }) => {
    const Component = onClick ? 'button' : 'div';
    const interactClasses = onClick ? `text-left transition-all ${hoverGlow ? 'hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] hover:border-blue-500/30 hover:bg-slate-800/80 cursor-pointer' : ''}` : '';
    
    return (
        <Component 
            onClick={onClick}
            className={`group bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 shadow-lg relative overflow-hidden flex flex-col min-h-[180px] z-10 ${interactClasses} ${className}`}
        >
            {hoverGlow && <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-[40px] pointer-events-none group-hover:bg-blue-500/10 transition-colors"></div>}
            <div className="relative z-10 flex flex-col h-full w-full">
                {children}
            </div>
        </Component>
    );
};

// 4. Badge/Chip de Status
export type BadgeStatus = 'Oficial' | 'Homologado' | 'Recomendado' | 'Experimental' | 'Legado' | 'Proibido' | 'Default';
export const PremiumBadge: React.FC<{ status: BadgeStatus; label?: string; className?: string }> = ({ status, label, className = '' }) => {
    let colorClass = "bg-slate-800 text-slate-400 border-slate-700";
    if (status === "Oficial") colorClass = "bg-blue-900/40 text-blue-400 border-blue-800/50";
    else if (status === "Homologado") colorClass = "bg-green-900/40 text-green-400 border-green-800/50";
    else if (status === "Recomendado") colorClass = "bg-emerald-900/40 text-emerald-400 border-emerald-800/50";
    else if (status === "Experimental") colorClass = "bg-purple-900/40 text-purple-400 border-purple-800/50";
    else if (status === "Legado") colorClass = "bg-orange-900/40 text-orange-400 border-orange-800/50";
    else if (status === "Proibido") colorClass = "bg-red-900/40 text-red-400 border-red-800/50";

    return (
        <span className={`text-[9px] font-bold px-2 py-1 rounded-md border uppercase tracking-widest inline-flex items-center justify-center whitespace-nowrap ${colorClass} ${className}`}>
            {label || status}
        </span>
    );
};

// 5. Botões
interface PremiumButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    icon?: React.ReactNode;
}
export const PremiumButton: React.FC<PremiumButtonProps> = ({ children, variant = 'primary', icon, className = '', ...props }) => {
    let variantClass = "bg-blue-600 text-white hover:bg-blue-500 border border-blue-500/50";
    if (variant === 'secondary') variantClass = "bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700";
    if (variant === 'danger') variantClass = "bg-red-900/50 text-red-400 hover:bg-red-900/80 border border-red-800/50";
    if (variant === 'ghost') variantClass = "bg-transparent text-slate-400 hover:text-slate-200 border border-transparent hover:bg-slate-800/50";

    return (
        <button 
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm ${variantClass} ${className}`}
            {...props}
        >
            {icon && <span className="w-4 h-4 flex items-center justify-center">{icon}</span>}
            {children}
        </button>
    );
};

// 6. Inputs e Selects
export const PremiumInput: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { icon?: React.ReactNode }> = ({ className = '', icon, ...props }) => (
    <div className={`flex items-center bg-slate-900/50 border border-slate-700 text-slate-300 rounded-xl px-3 py-2.5 focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/20 transition-all w-full shadow-inner ${className}`}>
        {icon && <span className="text-slate-500 mr-2 flex items-center">{icon}</span>}
        <input 
            className="bg-transparent border-none outline-none text-sm text-slate-200 w-full placeholder:text-slate-600"
            {...props}
        />
    </div>
);

export const PremiumSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = ({ className = '', children, ...props }) => (
    <select 
        className={`bg-slate-900/80 border border-slate-700 text-slate-300 text-xs rounded-xl px-3 py-2.5 outline-none focus:border-blue-500/50 transition-all appearance-none cursor-pointer shadow-inner pr-8 ${className}`}
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1em 1em' }}
        {...props}
    >
        {children}
    </select>
);
