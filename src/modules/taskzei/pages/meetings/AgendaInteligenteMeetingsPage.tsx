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

const STATUS_COLORS: Record<string, string> = {
  agendada: 'border-blue-200 bg-blue-50 text-blue-700',
  em_andamento: 'border-green-200 bg-green-50 text-green-700',
  concluida: 'border-gray-200 bg-gray-50 text-gray-600',
  cancelada: 'border-red-200 bg-red-50 text-red-600',
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
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="border-b border-[#e8ecf1] px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-[#414854] tracking-tight">Reuniões</h1>
            <p className="text-[12px] text-[#6f7887] mt-0.5">
              {meetings.length} reunião(ns) — {meetings.filter(m => m.status === 'agendada').length} pendente(s)
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={loadMeetings}
              className="rounded-lg border border-[#d9dee5] bg-white px-3 py-1.5 text-[12px] font-medium text-[#6f7887] hover:bg-[#f5f6f7] transition-colors"
            >
              ↻ Atualizar
            </button>
            <button
              onClick={() => setShowCreate(!showCreate)}
              className="rounded-lg bg-[#68c7be] px-3 py-1.5 text-[12px] font-medium text-white hover:bg-[#5ab8af] transition-colors"
            >
              {showCreate ? 'Cancelar' : '+ Nova Reunião'}
            </button>
          </div>
        </div>

        {/* Create form inline */}
        {showCreate && (
          <div className="mt-3 p-4 rounded-xl border border-[#d9dee5] bg-[#fcfcfd] space-y-3">
            <input
              type="text"
              value={formData.title}
              onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
              placeholder="Título da reunião *"
              className="w-full rounded-lg border border-[#d9dee5] px-3 py-2 text-[13px] focus:outline-none focus:border-[#87a8cf]"
            />
            <textarea
              value={formData.description}
              onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
              placeholder="Descrição (opcional)"
              className="w-full rounded-lg border border-[#d9dee5] px-3 py-2 text-[13px] focus:outline-none focus:border-[#87a8cf] resize-none"
              rows={2}
            />
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-[11px] font-medium text-[#6f7887] mb-1">Data</label>
                <input
                  type="date"
                  value={formData.meetingDate}
                  onChange={e => setFormData(p => ({ ...p, meetingDate: e.target.value }))}
                  className="w-full rounded-lg border border-[#d9dee5] px-3 py-2 text-[13px] focus:outline-none focus:border-[#87a8cf]"
                />
              </div>
              <div className="flex-1">
                <label className="block text-[11px] font-medium text-[#6f7887] mb-1">Horário</label>
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={e => setFormData(p => ({ ...p, startTime: e.target.value }))}
                  className="w-full rounded-lg border border-[#d9dee5] px-3 py-2 text-[13px] focus:outline-none focus:border-[#87a8cf]"
                />
              </div>
              <div className="w-24">
                <label className="block text-[11px] font-medium text-[#6f7887] mb-1">Duração (min)</label>
                <input
                  type="number"
                  value={formData.durationMinutes}
                  onChange={e => setFormData(p => ({ ...p, durationMinutes: parseInt(e.target.value) || 60 }))}
                  className="w-full rounded-lg border border-[#d9dee5] px-3 py-2 text-[13px] focus:outline-none focus:border-[#87a8cf]"
                  min={15}
                  step={15}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleCreateMeeting}
                disabled={!formData.title.trim()}
                className="rounded-lg bg-[#68c7be] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#5ab8af] disabled:opacity-40 transition-colors"
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
          <div className="flex items-center justify-center h-32 text-[13px] text-[#95a0b1]">Carregando...</div>
        ) : meetings.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-[13px] text-[#95a0b1]">
            Nenhuma reunião encontrada
          </div>
        ) : (
          <div className="divide-y divide-[#e8ecf1]">
            {meetings.map(meeting => (
              <div
                key={meeting.id}
                onClick={() => handleMeetingClick(meeting)}
                className={`px-6 py-3 hover:bg-[#fcfcfd] cursor-pointer transition-colors ${
                  selectedMeeting?.id === meeting.id ? 'bg-[#eaf7f5]' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-[13px] font-medium text-[#414854]">{meeting.title}</h3>
                    {meeting.description && (
                      <p className="text-[12px] text-[#6f7887] mt-0.5 line-clamp-1">{meeting.description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-1.5 text-[11px] text-[#95a0b1]">
                      {meeting.meetingDate && <span>{meeting.meetingDate}</span>}
                      {meeting.startTime && <span>às {meeting.startTime}</span>}
                      {meeting.durationMinutes && <span>({meeting.durationMinutes}min)</span>}
                      <span>•</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${STATUS_COLORS[meeting.status] || ''}`}>
                        {STATUS_LABELS[meeting.status] || meeting.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-right text-[11px] text-[#95a0b1] shrink-0 ml-4">
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl border border-[#d9dee5] w-full max-w-2xl max-h-[80vh] flex flex-col mx-4"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-[#e8ecf1] px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#414854]">{meeting.title}</h2>
              <p className="text-[12px] text-[#6f7887] mt-0.5">
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
                className="rounded-lg border border-[#d9dee5] px-2 py-1 text-[11px] font-medium focus:outline-none focus:border-[#87a8cf]"
              >
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              <button onClick={onClose} className="text-[#95a0b1] hover:text-[#6f7887]">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          {meeting.description && (
            <p className="mt-2 text-[12px] text-[#6f7887]">{meeting.description}</p>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto px-6 py-4 space-y-6">
          {/* Agenda Items */}
          <div>
            <h3 className="text-[13px] font-semibold text-[#414854] mb-2">Pauta</h3>
            {meeting.agendaItems && meeting.agendaItems.length > 0 ? (
              <ul className="space-y-1">
                {meeting.agendaItems
                  .sort((a, b) => a.sortOrder - b.sortOrder)
                  .map(item => (
                    <li key={item.id} className="flex items-center gap-2 text-[12px] text-[#6f7887]">
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        item.status === 'discutido' ? 'bg-[#68c7be]' : item.status === 'adiado' ? 'bg-yellow-400' : 'bg-[#d9dee5]'
                      }`} />
                      <span className={item.status === 'discutido' ? 'line-through text-[#95a0b1]' : ''}>
                        {item.title}
                      </span>
                      <span className="text-[10px] text-[#95a0b1]">
                        ({item.status === 'pendente' ? 'Pendente' : item.status === 'discutido' ? 'Discutido' : 'Adiado'})
                      </span>
                    </li>
                  ))}
              </ul>
            ) : (
              <p className="text-[12px] text-[#95a0b1] italic">Nenhum item de pauta</p>
            )}
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                value={newAgendaTitle}
                onChange={e => setNewAgendaTitle(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddAgenda()}
                placeholder="Adicionar item à pauta..."
                className="flex-1 rounded-lg border border-[#d9dee5] px-3 py-1.5 text-[12px] focus:outline-none focus:border-[#87a8cf]"
              />
              <button
                onClick={handleAddAgenda}
                disabled={!newAgendaTitle.trim()}
                className="rounded-lg bg-[#68c7be] px-3 py-1.5 text-[11px] font-medium text-white hover:bg-[#5ab8af] disabled:opacity-40"
              >
                + Adicionar
              </button>
            </div>
          </div>

          {/* Decisions */}
          <div>
            <h3 className="text-[13px] font-semibold text-[#414854] mb-2">Decisões</h3>
            {meeting.decisions && meeting.decisions.length > 0 ? (
              <div className="space-y-2">
                {meeting.decisions.map(decision => (
                  <div key={decision.id} className="rounded-lg border border-[#e8ecf1] p-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[12px] font-medium text-[#414854]">{decision.title}</p>
                        {decision.responsible && (
                          <p className="text-[11px] text-[#6f7887] mt-0.5">Responsável: {decision.responsible}</p>
                        )}
                        {decision.deadline && (
                          <p className="text-[11px] text-[#6f7887]">Prazo: {decision.deadline}</p>
                        )}
                      </div>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${
                        decision.status === 'concluida' ? 'bg-green-50 text-green-700 border-green-200' :
                        decision.status === 'em_andamento' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        decision.status === 'cancelada' ? 'bg-gray-50 text-gray-500 border-gray-200' :
                        'bg-yellow-50 text-yellow-700 border-yellow-200'
                      }`}>
                        {decision.status === 'aberta' ? 'Aberta' :
                         decision.status === 'em_andamento' ? 'Em Andamento' :
                         decision.status === 'concluida' ? 'Concluída' : 'Cancelada'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[12px] text-[#95a0b1] italic">Nenhuma decisão registrada</p>
            )}
            <div className="mt-2 space-y-2">
              <input
                type="text"
                value={newDecisionData.title}
                onChange={e => setNewDecisionData(p => ({ ...p, title: e.target.value }))}
                placeholder="Nova decisão..."
                className="w-full rounded-lg border border-[#d9dee5] px-3 py-1.5 text-[12px] focus:outline-none focus:border-[#87a8cf]"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newDecisionData.responsible}
                  onChange={e => setNewDecisionData(p => ({ ...p, responsible: e.target.value }))}
                  placeholder="Responsável (opcional)"
                  className="flex-1 rounded-lg border border-[#d9dee5] px-3 py-1.5 text-[12px] focus:outline-none focus:border-[#87a8cf]"
                />
                <input
                  type="date"
                  value={newDecisionData.deadline}
                  onChange={e => setNewDecisionData(p => ({ ...p, deadline: e.target.value }))}
                  className="w-36 rounded-lg border border-[#d9dee5] px-3 py-1.5 text-[12px] focus:outline-none focus:border-[#87a8cf]"
                />
                <button
                  onClick={handleAddDecision}
                  disabled={!newDecisionData.title.trim()}
                  className="rounded-lg bg-[#a78cc6] px-3 py-1.5 text-[11px] font-medium text-white hover:bg-[#9678b8] disabled:opacity-40"
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
