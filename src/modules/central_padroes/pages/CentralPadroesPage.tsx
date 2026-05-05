import React, { useEffect, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { BookIcon, CalendarIcon } from '../../../../components/Icon';
import { manifest } from '../manifest';
import {
  GovernanceRule,
  listGovernanceRules,
  publishGovernanceRule,
  saveGovernanceRuleDraft,
} from '../services/governanceRulesService';

const CentralPadroesPage: React.FC = () => {
  const [docsAberto, setDocsAberto] = useState(false);
  const [governanceDocs, setGovernanceDocs] = useState<GovernanceRule[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<GovernanceRule | null>(null);
  const [editorContent, setEditorContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const docs = await listGovernanceRules();
        setGovernanceDocs(docs);
        const first = docs[0] || null;
        setSelectedDoc(first);
        setEditorContent(first?.content_md || '');
      } catch (error) {
        setFeedback(`Falha ao carregar regras do Supabase: ${String((error as Error)?.message || error)}`);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const stats = useMemo(() => {
    const total = governanceDocs.length;
    const ativos = governanceDocs.filter((doc) => doc.sync_status === 'synced').length;
    const parciais = governanceDocs.filter((doc) => doc.sync_status === 'failed').length;
    const pendentes = governanceDocs.filter((doc) => doc.sync_status === 'pending').length;

    return { total, ativos, parciais, pendentes };
  }, [governanceDocs]);

  const categoryMap: Array<{ key: string; title: string; docs: GovernanceRule[]; accent: string }> = [
    {
      key: 'normas',
      title: 'Normas Oficiais',
      docs: governanceDocs.filter((doc) => doc.domain === 'normas'),
      accent: 'text-sagb-blue'
    },
    {
      key: 'operacional',
      title: 'Governança Operacional',
      docs: governanceDocs.filter((doc) => doc.domain === 'operacional'),
      accent: 'text-sagb-text'
    },
    {
      key: 'templates',
      title: 'Templates de Apoio',
      docs: governanceDocs.filter((doc) => doc.domain === 'templates'),
      accent: 'text-sagb-text'
    }
  ];

  const getStatusBadge = (status: string) => {
    if (status === 'synced') return 'bg-emerald-500';
    if (status === 'pending') return 'bg-amber-500';
    return 'bg-red-500';
  };

  const openDoc = (doc: GovernanceRule) => {
    setSelectedDoc(doc);
    setEditorContent(doc.content_md || '');
    setDocsAberto(true);
  };

  const refreshRules = async (focusId?: string) => {
    const docs = await listGovernanceRules();
    setGovernanceDocs(docs);
    const focused = (focusId && docs.find((doc) => doc.id === focusId)) || docs[0] || null;
    setSelectedDoc(focused);
    setEditorContent(focused?.content_md || '');
  };

  const handleSaveDraft = async () => {
    if (!selectedDoc) return;
    try {
      setSaving(true);
      setFeedback(null);
      const updated = await saveGovernanceRuleDraft(selectedDoc, editorContent);
      await refreshRules(updated.id);
      setFeedback('Rascunho salvo no Supabase com status pending.');
    } catch (error) {
      setFeedback(`Falha ao salvar rascunho: ${String((error as Error)?.message || error)}`);
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!selectedDoc) return;
    try {
      setPublishing(true);
      setFeedback(null);
      const result = await publishGovernanceRule(selectedDoc, editorContent);
      await refreshRules(result.rule.id);
      setFeedback(`Publicação concluída. Sync status: ${result.rule.sync_status}`);
    } catch (error) {
      setFeedback(`Falha ao publicar: ${String((error as Error)?.message || error)}`);
      await refreshRules(selectedDoc.id);
    } finally {
      setPublishing(false);
    }
  };

  const renderDocsModal = () => {
    if (!docsAberto) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
        <div className="bg-sagb-panel rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          <div className="p-6 border-b border-sagb-line flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-sagb-text">{selectedDoc?.title || 'Documento de Governança'}</h2>
              <p className="text-[12px] text-sagb-muted">
                {selectedDoc?.sync_target_path || 'docs/governanca_sagb/_readme.md'}
              </p>
              <div className="flex items-center gap-4 mt-2 text-[10px] text-sagb-muted">
                <div className="flex items-center gap-1">
                  <CalendarIcon className="w-3 h-3" />
                  <span>Criado: {selectedDoc?.created_at || '—'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <CalendarIcon className="w-3 h-3" />
                  <span>Última: {selectedDoc?.updated_at || '—'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>Versão: {selectedDoc?.version || 0}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setDocsAberto(false)}
              className="px-4 py-2 rounded-lg bg-sagb-bg hover:bg-sagb-bg-2 text-sagb-text font-semibold"
            >
              Fechar
            </button>
          </div>

          <div className="p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-2 gap-4">
            <section className="space-y-2">
              <div className="text-[10px] font-black uppercase tracking-widest text-sagb-muted">Editor Markdown</div>
              <textarea
                value={editorContent}
                onChange={(event) => setEditorContent(event.target.value)}
                className="w-full min-h-[420px] p-3 rounded-lg bg-sagb-bg border border-sagb-line text-[12px] text-sagb-text font-mono"
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveDraft}
                  disabled={saving || publishing || !selectedDoc}
                  className="px-4 py-2 rounded-lg bg-sagb-bg-2 border border-sagb-line text-[12px] font-semibold disabled:opacity-50"
                >
                  {saving ? 'Salvando...' : 'Salvar rascunho'}
                </button>
                <button
                  onClick={handlePublish}
                  disabled={publishing || saving || !selectedDoc}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white text-[12px] font-semibold disabled:opacity-50"
                >
                  {publishing ? 'Publicando...' : 'Publicar'}
                </button>
              </div>
              {selectedDoc?.last_sync_error && (
                <div className="text-[10px] text-red-500">Erro sync: {selectedDoc.last_sync_error}</div>
              )}
              {feedback && <div className="text-[10px] text-sagb-muted">{feedback}</div>}
            </section>

            <section>
              <div className="text-[10px] font-black uppercase tracking-widest text-sagb-muted mb-2">Preview</div>
              <article className="prose prose-sm max-w-none text-[12px] text-sagb-text">
                <ReactMarkdown>{editorContent || '_Documento vazio._'}</ReactMarkdown>
              </article>
            </section>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 p-10 bg-sagb-bg text-[12px] text-sagb-text font-inter">
      <header className="mb-10 flex justify-between items-start gap-6">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">Central de Padrões</h1>
          <p className="text-sagb-muted mt-2 text-[12px]">
            A base da verdade oficial de stack, design, naming e arquitetura do SagB.
          </p>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-black text-sagb-muted uppercase tracking-widest mb-1">Módulo Oficial</div>
          <div className="text-lg font-bold text-sagb-text">Central de Padrões</div>
          <div className="mt-2 text-[12px] text-sagb-muted">
            Responsável: <span className="font-semibold text-sagb-text">{manifest.owner?.displayName || 'A definir'}</span>
          </div>
          <button
            onClick={() => selectedDoc && openDoc(selectedDoc)}
            className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-[12px] font-semibold"
          >
            <BookIcon className="w-4 h-4" />
            Docs
          </button>
        </div>
      </header>

      <section className="bg-sagb-bg-2 p-6 rounded-2xl border border-sagb-line">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-[12px] font-bold text-sagb-text mb-2">Responsabilidade do Módulo</h2>
            <p className="text-[12px] opacity-80 mb-2">
              <strong>Agente responsável:</strong> {manifest.owner?.displayName || 'A definir'}
            </p>
            <p className="text-[12px] text-sagb-muted">
              Esta central é o ponto oficial para padronização de design system, stack, nomenclaturas e guardrails técnicos do SagB.
            </p>
          </div>

          <div>
            <h2 className="text-[12px] font-bold text-sagb-text mb-2">Objetivo Operacional</h2>
            <p className="text-[12px] text-sagb-muted">
              Evitar duplicação de decisões técnicas e garantir que novos módulos sigam um padrão único, auditável e reutilizável.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <article className="bg-sagb-panel p-4 rounded-xl border border-sagb-line">
          <div className="text-[10px] text-sagb-muted">Documentos</div>
          <div className="text-xl font-black text-sagb-text">{stats.total}</div>
        </article>
        <article className="bg-sagb-panel p-4 rounded-xl border border-green-500/20">
          <div className="text-[10px] text-sagb-muted">🟢 Synced</div>
          <div className="text-xl font-black text-sagb-text">{stats.ativos}</div>
        </article>
        <article className="bg-sagb-panel p-4 rounded-xl border border-sagb-line">
          <div className="text-[10px] text-sagb-muted">🟡 Failed</div>
          <div className="text-xl font-black text-sagb-text">{stats.parciais}</div>
        </article>
        <article className="bg-sagb-panel p-4 rounded-xl border border-sagb-line">
          <div className="text-[10px] text-sagb-muted">🔴 Pendentes</div>
          <div className="text-xl font-black text-sagb-text">{stats.pendentes}</div>
        </article>
      </section>

      <section id="governanca-docs" className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {categoryMap.map((category) => (
          <article key={category.key} className="bg-sagb-panel p-5 rounded-2xl border border-sagb-line">
            <div className="flex items-center justify-between mb-3">
              <h3 className={`text-[12px] font-bold ${category.accent}`}>{category.title}</h3>
              <span className="text-[10px] text-sagb-muted">{category.docs.length} docs</span>
            </div>

            <ul className="space-y-2">
              {category.docs.map((doc) => (
                <li key={doc.id}>
                  <button
                    onClick={() => openDoc(doc)}
                    className="w-full text-left px-3 py-2 rounded-lg border border-sagb-line hover:bg-sagb-bg transition"
                  >
                    <div className="flex items-start gap-2 mb-1">
                      <span className={`inline-block w-2.5 h-2.5 rounded-full ${getStatusBadge(doc.status)}`} />
                      <div className="flex-1">
                        <div className="text-[12px] font-semibold text-sagb-text">{doc.title}</div>
                        <div className="text-[10px] text-sagb-muted mt-0.5">{doc.rule_key}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-[10px] text-sagb-muted">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="w-2.5 h-2.5" />
                        <span>{doc.created_at}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="w-2.5 h-2.5" />
                        <span>{doc.updated_at}</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-sagb-muted mt-1">status: {doc.sync_status} • versão: {doc.version}</p>
                  </button>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      {loading && <div className="mt-4 text-[12px] text-sagb-muted">Carregando regras de governança...</div>}

      {renderDocsModal()}
    </div>
  );
};

export default CentralPadroesPage;
