import React, { useEffect, useState } from 'react';
import { useMeetingStore } from '../../store/meeting.store';
import { taskzeiFacade } from '../../services/taskzei.facade';
import type { Meeting, Decision, MeetingAgendaItem } from '../../types/meeting.types';

const STATUS_LABELS: Record<string, string> = {
  agendada: 'Agendada',
  em_andamento: 'Em Andamento',
  concluida: 'Concluída',
  cancelada: 'Cancelada',
};

const STATUS_COLORS: Record<string, React.CSSProperties> = {
  agendada: {
    borderColor: 'var(--sagb-blue)',
    backgroundColor: 'color-mix(in srgb, var(--sagb-blue) 8%, transparent)',
    color: 'var(--sagb-blue)',
  },
  em_andamento: {
    borderColor: 'var(--sagb-primary)',
    backgroundColor: 'color-mix(in srgb, var(--sagb-primary) 8%, transparent)',
    color: 'var(--sagb-primary)',
  },
  concluida: {
    borderColor: 'var(--sagb-line)',
    backgroundColor: 'var(--sagb-bg)',
    color: 'var(--sagb-muted)',
  },
  cancelada: {
    borderColor: 'var(--sagb-red)',
    backgroundColor: 'color-mix(in srgb, var(--sagb-red) 8%, transparent)',
    color: 'var(--sagb-red)',
  },
};

export const AgendaInteligenteMeetingsPage: React.FC = () => {
  const { meetings, setMeetings, addMeeting } = useMeetingStore();
  const [loading, setLoading] = useState(true);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    meetingDate: '',
    startTime: '',
    durationMinutes: 60,
  });

  useEffect(() => {
    loadMeetings();
  }, []);

  const loadMeetings = async () => {
    setLoading(true);
    try {
      const data = await taskzeiFacade.loadMeetings();
      setMeetings(data);
    } catch (err) {
      console.error('[MeetingsPage] Erro ao carregar reuniões:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMeeting = async () => {
    if (!formData.title.trim()) return;
    try {
      const meeting = await taskzeiFacade.createMeeting({
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        meetingDate: formData.meetingDate || undefined,
        startTime: formData.startTime || undefined,
        durationMinutes: formData.durationMinutes,
        status: 'agendada',
      });
      addMeeting(meeting);
      setShowCreate(false);
      setFormData({ title: '', description: '', meetingDate: '', startTime: '', durationMinutes: 60 });
    } catch (err) {
      console.error('[MeetingsPage] Erro ao criar reunião:', err);
    }
  };

  const handleMeetingClick = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
  };

  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      style={{
        backgroundColor: 'var(--sagb-surface)',
        borderRadius: 'var(--sagb-radius-xl)',
        border: '1px solid var(--sagb-line)',
        boxShadow: 'var(--sagb-shadow)',
        fontFamily: "'Rubik', sans-serif",
      }}
    >
      {/* Header */}
      <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--sagb-line)' }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold tracking-tight" style={{ color: 'var(--sagb-text)' }}>
              Reuniões
            </h1>
            <p className="text-[12px] mt-0.5" style={{ color: 'var(--sagb-muted)' }}>
              {meetings.length} reunião(ns) — {meetings.filter(m => m.status === 'agendada').length} pendente(s)
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={loadMeetings}
              className="rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors"
              style={{
                border: '1px solid var(--sagb-line)',
                backgroundColor: 'var(--sagb-surface)',
                color: 'var(--sagb-muted)',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--sagb-bg)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--sagb-surface)'; }}
            >
              ↻ Atualizar
            </button>
            <button
              onClick={() => setShowCreate(!showCreate)}
              className="rounded-lg px-3 py-1.5 text-[12px] font-medium text-white transition-colors"
              style={{ backgroundColor: 'var(--sagb-primary)' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'color-mix(in srgb, var(--sagb-primary) 80%, black)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--sagb-primary)'; }}
            >
              {showCreate ? 'Cancelar' : '+ Nova Reunião'}
            </button>
          </div>
        </div>

        {/* Create form inline */}
        {showCreate && (
          <div
            className="mt-3 p-4 space-y-3"
            style={{
              borderRadius: 'var(--sagb-radius-xl)',
              border: '1px solid var(--sagb-line)',
              backgroundColor: 'var(--sagb-bg)',
            }}
          >
            <input
              type="text"
              value={formData.title}
              onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
              placeholder="Título da reunião *"
              style={{
                width: '100%',
                borderRadius: 'var(--sagb-radius-lg)',
                border: '1px solid var(--sagb-line)',
                padding: '8px 12px',
                fontSize: 13,
                color: 'var(--sagb-text)',
                outline: 'none',
                backgroundColor: 'var(--sagb-surface)',
              }}
            />
            <textarea
              value={formData.description}
              onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
              placeholder="Descrição (opcional)"
              rows={2}
              style={{
                width: '100%',
                borderRadius: 'var(--sagb-radius-lg)',
                border: '1px solid var(--sagb-line)',
                padding: '8px 12px',
                fontSize: 13,
                color: 'var(--sagb-text)',
                outline: 'none',
                resize: 'none',
                backgroundColor: 'var(--sagb-surface)',
              }}
            />
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-[11px] font-medium mb-1" style={{ color: 'var(--sagb-muted)' }}>
                  Data
                </label>
                <input
                  type="date"
                  value={formData.meetingDate}
                  onChange={e => setFormData(p => ({ ...p, meetingDate: e.target.value }))}
                  style={{
                    width: '100%',
                    borderRadius: 'var(--sagb-radius-lg)',
                    border: '1px solid var(--sagb-line)',
                    padding: '8px 12px',
                    fontSize: 13,
                    color: 'var(--sagb-text)',
                    outline: 'none',
                    backgroundColor: 'var(--sagb-surface)',
                  }}
                />
              </div>
              <div className="flex-1">
                <label className="block text-[11px] font-medium mb-1" style={{ color: 'var(--sagb-muted)' }}>
                  Horário
                </label>
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={e => setFormData(p => ({ ...p, startTime: e.target.value }))}
                  style={{
                    width: '100%',
                    borderRadius: 'var(--sagb-radius-lg)',
                    border: '1px solid var(--sagb-line)',
                    padding: '8px 12px',
                    fontSize: 13,
                    color: 'var(--sagb-text)',
                    outline: 'none',
                    backgroundColor: 'var(--sagb-surface)',
                  }}
                />
              </div>
              <div className="w-24">
                <label className="block text-[11px] font-medium mb-1" style={{ color: 'var(--sagb-muted)' }}>
                  Duração (min)
                </label>
                <input
                  type="number"
                  value={formData.durationMinutes}
                  onChange={e => setFormData(p => ({ ...p, durationMinutes: parseInt(e.target.value) || 60 }))}
                  min={15}
                  step={15}
                  style={{
                    width: '100%',
                    borderRadius: 'var(--sagb-radius-lg)',
                    border: '1px solid var(--sagb-line)',
                    padding: '8px 12px',
                    fontSize: 13,
                    color: 'var(--sagb-text)',
                    outline: 'none',
                    backgroundColor: 'var(--sagb-surface)',
                  }}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleCreateMeeting}
                disabled={!formData.title.trim()}
                className="rounded-lg px-4 py-2 text-[13px] font-medium text-white disabled:opacity-40 transition-colors"
                style={{ backgroundColor: 'var(--sagb-primary)' }}
                onMouseEnter={(e) => {
                  if (!formData.title.trim()) return;
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'color-mix(in srgb, var(--sagb-primary) 80%, black)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--sagb-primary)';
                }}
              >
                Criar Reunião
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-32 text-[13px]" style={{ color: 'var(--sagb-muted)' }}>
            Carregando...
          </div>
        ) : meetings.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-[13px]" style={{ color: 'var(--sagb-muted)' }}>
            Nenhuma reunião encontrada
          </div>
        ) : (
          <div style={{ borderTop: '1px solid var(--sagb-line)' }}>
            {meetings.map(meeting => (
              <div
                key={meeting.id}
                onClick={() => handleMeetingClick(meeting)}
                className="px-6 py-3 cursor-pointer transition-colors"
                style={{
                  borderBottom: '1px solid var(--sagb-line)',
                  backgroundColor: selectedMeeting?.id === meeting.id
                    ? 'color-mix(in srgb, var(--sagb-primary) 6%, transparent)'
                    : 'transparent',
                }}
                onMouseEnter={(e) => {
                  if (selectedMeeting?.id !== meeting.id) {
                    (e.currentTarget as HTMLDivElement).style.backgroundColor = 'var(--sagb-bg)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedMeeting?.id !== meeting.id) {
                    (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent';
                  }
                }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-[13px] font-medium" style={{ color: 'var(--sagb-text)' }}>
                      {meeting.title}
                    </h3>
                    {meeting.description && (
                      <p className="text-[12px] mt-0.5 line-clamp-1" style={{ color: 'var(--sagb-muted)' }}>
                        {meeting.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-1.5 text-[11px]" style={{ color: 'var(--sagb-muted)' }}>
                      {meeting.meetingDate && <span>{meeting.meetingDate}</span>}
                      {meeting.startTime && <span>às {meeting.startTime}</span>}
                      {meeting.durationMinutes && <span>({meeting.durationMinutes}min)</span>}
                      <span>•</span>
                      <span
                        className="px-1.5 py-0.5 rounded text-[10px] font-medium"
                        style={{
                          border: '1px solid',
                          ...STATUS_COLORS[meeting.status],
                        }}
                      >
                        {STATUS_LABELS[meeting.status] || meeting.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-right text-[11px] shrink-0 ml-4" style={{ color: 'var(--sagb-muted)' }}>
                    {meeting.agendaItems?.length || 0} itens
                    <br />
                    {meeting.decisions?.length || 0} decisões
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Meeting detail modal */}
      {selectedMeeting && (
        <MeetingDetailModal
          meeting={selectedMeeting}
          onClose={() => setSelectedMeeting(null)}
          onRefresh={loadMeetings}
        />
      )}
    </div>
  );
};

// ─── Modal de Detalhe ────────────────────────────────────────────────

interface MeetingDetailModalProps {
  meeting: Meeting;
  onClose: () => void;
  onRefresh: () => void;
}

const DECISION_STATUS_COLORS: Record<string, React.CSSProperties> = {
  concluida: {
    borderColor: 'var(--sagb-primary)',
    backgroundColor: 'color-mix(in srgb, var(--sagb-primary) 8%, transparent)',
    color: 'var(--sagb-primary)',
  },
  em_andamento: {
    borderColor: 'var(--sagb-blue)',
    backgroundColor: 'color-mix(in srgb, var(--sagb-blue) 8%, transparent)',
    color: 'var(--sagb-blue)',
  },
  cancelada: {
    borderColor: 'var(--sagb-line)',
    backgroundColor: 'var(--sagb-bg)',
    color: 'var(--sagb-muted)',
  },
  aberta: {
    borderColor: 'var(--sagb-amber)',
    backgroundColor: 'color-mix(in srgb, var(--sagb-amber) 8%, transparent)',
    color: 'var(--sagb-amber)',
  },
};

const MeetingDetailModal: React.FC<MeetingDetailModalProps> = ({ meeting, onClose, onRefresh }) => {
  const [newAgendaTitle, setNewAgendaTitle] = useState('');
  const [newDecisionData, setNewDecisionData] = useState({ title: '', responsible: '', deadline: '' });
  const [statusUpdating, setStatusUpdating] = useState(false);

  const handleAddAgenda = async () => {
    if (!newAgendaTitle.trim()) return;
    try {
      await taskzeiFacade.addAgendaItem(meeting.id, {
        title: newAgendaTitle.trim(),
        sortOrder: (meeting.agendaItems?.length || 0) + 1,
        status: 'pendente',
      });
      setNewAgendaTitle('');
      onRefresh();
    } catch (err) {
      console.error('[MeetingDetail] Erro ao adicionar pauta:', err);
    }
  };

  const handleAddDecision = async () => {
    if (!newDecisionData.title.trim()) return;
    try {
      await taskzeiFacade.addDecision({
        meetingId: meeting.id,
        title: newDecisionData.title.trim(),
        responsible: newDecisionData.responsible.trim() || undefined,
        deadline: newDecisionData.deadline || undefined,
        status: 'aberta',
      });
      setNewDecisionData({ title: '', responsible: '', deadline: '' });
      onRefresh();
    } catch (err) {
      console.error('[MeetingDetail] Erro ao adicionar decisão:', err);
    }
  };

  const handleStatusChange = async (newStatus: Meeting['status']) => {
    setStatusUpdating(true);
    try {
      await taskzeiFacade.updateMeeting(meeting.id, { status: newStatus });
      onRefresh();
    } catch (err) {
      console.error('[MeetingDetail] Erro ao atualizar status:', err);
    } finally {
      setStatusUpdating(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.15)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[80vh] flex flex-col mx-4"
        style={{
          backgroundColor: 'var(--sagb-surface)',
          borderRadius: 'var(--sagb-radius-2xl)',
          border: '1px solid var(--sagb-line)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--sagb-line)' }}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold" style={{ color: 'var(--sagb-text)' }}>
                {meeting.title}
              </h2>
              <p className="text-[12px] mt-0.5" style={{ color: 'var(--sagb-muted)' }}>
                {meeting.meetingDate && `${meeting.meetingDate} `}
                {meeting.startTime && `às ${meeting.startTime}`}
                {meeting.durationMinutes && ` • ${meeting.durationMinutes}min`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={meeting.status}
                onChange={e => handleStatusChange(e.target.value as Meeting['status'])}
                disabled={statusUpdating}
                style={{
                  borderRadius: 'var(--sagb-radius-lg)',
                  border: '1px solid var(--sagb-line)',
                  padding: '4px 8px',
                  fontSize: 11,
                  fontWeight: 500,
                  color: 'var(--sagb-text)',
                  backgroundColor: 'var(--sagb-surface)',
                  outline: 'none',
                }}
              >
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              <button
                onClick={onClose}
                style={{ color: 'var(--sagb-muted)' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--sagb-text)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--sagb-muted)'; }}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          {meeting.description && (
            <p className="mt-2 text-[12px]" style={{ color: 'var(--sagb-muted)' }}>
              {meeting.description}
            </p>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto px-6 py-4 space-y-6">
          {/* Agenda Items */}
          <div>
            <h3 className="text-[13px] font-semibold mb-2" style={{ color: 'var(--sagb-text)' }}>
              Pauta
            </h3>
            {meeting.agendaItems && meeting.agendaItems.length > 0 ? (
              <ul className="space-y-1">
                {meeting.agendaItems
                  .sort((a, b) => a.sortOrder - b.sortOrder)
                  .map(item => (
                    <li key={item.id} className="flex items-center gap-2 text-[12px]" style={{ color: 'var(--sagb-muted)' }}>
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          backgroundColor: item.status === 'discutido'
                            ? 'var(--sagb-primary)'
                            : item.status === 'adiado'
                              ? 'var(--sagb-amber)'
                              : 'var(--sagb-line)',
                        }}
                      />
                      <span
                        style={{
                          textDecoration: item.status === 'discutido' ? 'line-through' : 'none',
                          color: item.status === 'discutido' ? 'var(--sagb-muted)' : 'var(--sagb-text)',
                        }}
                      >
                        {item.title}
                      </span>
                      <span className="text-[10px]" style={{ color: 'var(--sagb-muted)' }}>
                        ({item.status === 'pendente' ? 'Pendente' : item.status === 'discutido' ? 'Discutido' : 'Adiado'})
                      </span>
                    </li>
                  ))}
              </ul>
            ) : (
              <p className="text-[12px] italic" style={{ color: 'var(--sagb-muted)' }}>
                Nenhum item de pauta
              </p>
            )}
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                value={newAgendaTitle}
                onChange={e => setNewAgendaTitle(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddAgenda()}
                placeholder="Adicionar item à pauta..."
                style={{
                  flex: 1,
                  borderRadius: 'var(--sagb-radius-lg)',
                  border: '1px solid var(--sagb-line)',
                  padding: '6px 12px',
                  fontSize: 12,
                  color: 'var(--sagb-text)',
                  outline: 'none',
                  backgroundColor: 'var(--sagb-surface)',
                }}
              />
              <button
                onClick={handleAddAgenda}
                disabled={!newAgendaTitle.trim()}
                className="rounded-lg px-3 py-1.5 text-[11px] font-medium text-white disabled:opacity-40"
                style={{ backgroundColor: 'var(--sagb-primary)' }}
                onMouseEnter={(e) => {
                  if (!newAgendaTitle.trim()) return;
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'color-mix(in srgb, var(--sagb-primary) 80%, black)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--sagb-primary)';
                }}
              >
                + Adicionar
              </button>
            </div>
          </div>

          {/* Decisions */}
          <div>
            <h3 className="text-[13px] font-semibold mb-2" style={{ color: 'var(--sagb-text)' }}>
              Decisões
            </h3>
            {meeting.decisions && meeting.decisions.length > 0 ? (
              <div className="space-y-2">
                {meeting.decisions.map(decision => (
                  <div
                    key={decision.id}
                    className="p-3"
                    style={{
                      borderRadius: 'var(--sagb-radius-lg)',
                      border: '1px solid var(--sagb-line)',
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[12px] font-medium" style={{ color: 'var(--sagb-text)' }}>
                          {decision.title}
                        </p>
                        {decision.responsible && (
                          <p className="text-[11px] mt-0.5" style={{ color: 'var(--sagb-muted)' }}>
                            Responsável: {decision.responsible}
                          </p>
                        )}
                        {decision.deadline && (
                          <p className="text-[11px]" style={{ color: 'var(--sagb-muted)' }}>
                            Prazo: {decision.deadline}
                          </p>
                        )}
                      </div>
                      <span
                        className="px-1.5 py-0.5 rounded text-[10px] font-medium"
                        style={{
                          border: '1px solid',
                          ...(DECISION_STATUS_COLORS[decision.status] || DECISION_STATUS_COLORS.aberta),
                        }}
                      >
                        {decision.status === 'aberta' ? 'Aberta' :
                         decision.status === 'em_andamento' ? 'Em Andamento' :
                         decision.status === 'concluida' ? 'Concluída' : 'Cancelada'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[12px] italic" style={{ color: 'var(--sagb-muted)' }}>
                Nenhuma decisão registrada
              </p>
            )}
            <div className="mt-2 space-y-2">
              <input
                type="text"
                value={newDecisionData.title}
                onChange={e => setNewDecisionData(p => ({ ...p, title: e.target.value }))}
                placeholder="Nova decisão..."
                style={{
                  width: '100%',
                  borderRadius: 'var(--sagb-radius-lg)',
                  border: '1px solid var(--sagb-line)',
                  padding: '6px 12px',
                  fontSize: 12,
                  color: 'var(--sagb-text)',
                  outline: 'none',
                  backgroundColor: 'var(--sagb-surface)',
                }}
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newDecisionData.responsible}
                  onChange={e => setNewDecisionData(p => ({ ...p, responsible: e.target.value }))}
                  placeholder="Responsável (opcional)"
                  style={{
                    flex: 1,
                    borderRadius: 'var(--sagb-radius-lg)',
                    border: '1px solid var(--sagb-line)',
                    padding: '6px 12px',
                    fontSize: 12,
                    color: 'var(--sagb-text)',
                    outline: 'none',
                    backgroundColor: 'var(--sagb-surface)',
                  }}
                />
                <input
                  type="date"
                  value={newDecisionData.deadline}
                  onChange={e => setNewDecisionData(p => ({ ...p, deadline: e.target.value }))}
                  style={{
                    width: 144,
                    borderRadius: 'var(--sagb-radius-lg)',
                    border: '1px solid var(--sagb-line)',
                    padding: '6px 12px',
                    fontSize: 12,
                    color: 'var(--sagb-text)',
                    outline: 'none',
                    backgroundColor: 'var(--sagb-surface)',
                  }}
                />
                <button
                  onClick={handleAddDecision}
                  disabled={!newDecisionData.title.trim()}
                  className="rounded-lg px-3 py-1.5 text-[11px] font-medium text-white disabled:opacity-40"
                  style={{ backgroundColor: 'var(--sagb-blue)' }}
                  onMouseEnter={(e) => {
                    if (!newDecisionData.title.trim()) return;
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'color-mix(in srgb, var(--sagb-blue) 80%, black)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--sagb-blue)';
                  }}
                >
                  + Decisão
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
