import React, { useEffect, useRef, useState } from 'react';

type MermaidRendererProps = { code: string };

let renderIdCounter = 0;

export const MermaidRenderer: React.FC<MermaidRendererProps> = ({ code }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const render = async () => {
      try {
        const mermaid = (await import('mermaid')).default;
        
        // Inicializa com tema base compatível com light/dark
        mermaid.initialize({
          startOnLoad: false,
          theme: 'base',
          securityLevel: 'loose',
          fontFamily: '"Rubik", system-ui, sans-serif',
          themeVariables: {
            primaryColor: '#4f46e5',
            primaryTextColor: '#1f2937',
            primaryBorderColor: '#4f46e5',
            lineColor: '#5b6472',
            secondaryColor: '#eef2ff',
            tertiaryColor: '#f6f7fb',
            background: '#ffffff',
            mainBkg: '#eef2ff',
            nodeBorder: '#4f46e5',
            clusterBkg: '#f8f9fd',
            clusterBorder: '#d1d5db',
            titleColor: '#1f2937',
            edgeLabelBackground: '#ffffff',
            fontSize: '13px',
          },
        });

        if (cancelled) return;

        // Limpa e normaliza o código
        let cleanCode = code
          .replace(/\r\n/g, '\n')
          .replace(/\r/g, '\n')
          .trim();

        // Remove fences acidentais se presentes
        cleanCode = cleanCode.replace(/^```mermaid\s*\n?/, '').replace(/^```\s*\n?/, '').replace(/\n?```\s*$/, '');

        const id = `mermaid-${++renderIdCounter}-${Math.random().toString(36).slice(2, 7)}`;
        const { svg } = await mermaid.render(id, cleanCode);
        
        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg;
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(String((err as Error)?.message || err).slice(0, 200));
          setLoading(false);
        }
      }
    };

    render();
    return () => { cancelled = true; };
  }, [code]);

  if (error) {
    return (
      <div className="cp-mermaid-fallback">
        <div className="cp-mermaid-fallback-header">
          <span>⚠️ Diagrama não renderizado</span>
          <small>{error}</small>
        </div>
        <pre className="cp-mermaid-fallback-code">{code.trim()}</pre>
      </div>
    );
  }

  return (
    <div className="cp-mermaid" ref={containerRef}>
      {loading && <span className="cp-mermaid-loading">Carregando diagrama...</span>}
    </div>
  );
};
