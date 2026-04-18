import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { XIcon, SaveIcon, UserIcon, MicIcon, BriefcaseIcon } from '../../../../components/Icon';
import { AgenteDraft, AGENTE_TIPO_VALUES, AGENTE_STATUS_VALUES, AGENTE_NIVEL_EXPERIENCIA_VALUES, AGENTE_CANAL_ATENDIMENTO_VALUES, AGENTE_FUNCAO_COMERCIAL_VALUES } from '../types';

// Esquema de Validação Zod Expandido
const agenteSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  nome_exibicao: z.string().optional(),
  email: z.string().email('Email inválido'),
  telefone: z.string().optional(),
  tipo: z.enum(AGENTE_TIPO_VALUES),
  status: z.enum(AGENTE_STATUS_VALUES),
  funcao: z.enum(AGENTE_FUNCAO_COMERCIAL_VALUES),
  vertical: z.string().min(2, 'Informe a vertical do agente (ex: Odonto)'),
  nivel_experiencia: z.enum(AGENTE_NIVEL_EXPERIENCIA_VALUES),
  canal_atendimento: z.enum(AGENTE_CANAL_ATENDIMENTO_VALUES),
  capacidade_concorrente: z.number().min(1).max(200),
  especialidades: z.array(z.string()).optional(),
  foto_url: z.union([z.literal(''), z.string().url()]).optional(),
  persona: z.object({
    bio: z.string().min(10, 'A bio deve ser mais descritiva'),
    tom_voz: z.string().min(5, 'Descreva o tom de voz'),
    objetivos: z.array(z.string()).optional()
  }).optional(),
  voz: z.object({
    provider: z.string().optional(),
    voice_id: z.string().optional(),
    velocidade: z.number().min(0.5).max(2.0).default(1.0),
    pitch: z.number().min(0.5).max(2.0).default(1.0)
  }).optional()
});

type AgenteFormValues = z.infer<typeof agenteSchema>;

interface AgentFormProps {
  initialData?: AgenteDraft;
  onSubmit: (data: AgenteDraft) => void;
  onCancel: () => void;
  title?: string;
  submitLabel?: string;
}

const AgentForm: React.FC<AgentFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  title = 'Configurar Agente Comercial',
  submitLabel = 'Salvar Configurações'
}) => {
  const [especialidadeInput, setEspecialidadeInput] = useState('');
  const [activeTab, setActiveTab] = useState<'basico' | 'dna' | 'voz'>('basico');

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<AgenteFormValues>({
    resolver: zodResolver(agenteSchema),
    defaultValues: {
      nome: initialData?.nome || '',
      nome_exibicao: initialData?.nome_exibicao || '',
      email: initialData?.email || '',
      telefone: initialData?.telefone || '',
      tipo: initialData?.tipo || 'IA_HIBRIDO',
      status: initialData?.status || 'ATIVO',
      funcao: initialData?.funcao || 'SDR',
      vertical: initialData?.vertical || '',
      nivel_experiencia: initialData?.nivel_experiencia || 'PLENO',
      canal_atendimento: initialData?.canal_atendimento || 'MULTICANAL',
      capacidade_concorrente: initialData?.capacidade_concorrente || 10,
      especialidades: initialData?.especialidades || [],
      foto_url: initialData?.foto_url || '',
      persona: initialData?.persona || { bio: '', tom_voz: '', objetivos: [] },
      voz: initialData?.voz || { provider: 'ElevenLabs', voice_id: '', velocidade: 1.0, pitch: 1.0 }
    }
  });

  const especialidades = watch('especialidades') || [];

  const handleAddEspecialidade = () => {
    if (!especialidadeInput.trim()) return;
    setValue('especialidades', [...especialidades, especialidadeInput.trim()]);
    setEspecialidadeInput('');
  };

  const submitAction = (data: AgenteFormValues) => {
    const cleanData = { ...data };
    if (cleanData.foto_url === '') delete cleanData.foto_url;
    onSubmit(cleanData as AgenteDraft);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] shadow-2xl overflow-hidden flex flex-col border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-slate-50 border-b border-slate-200">
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">{title}</h2>
            <p className="text-sm text-slate-500">Configure o DNA, a voz e as especialidades do seu agente.</p>
          </div>
          <button onClick={onCancel} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <XIcon className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 bg-white px-6">
          <button
            onClick={() => setActiveTab('basico')}
            className={`py-4 px-6 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'basico' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            <UserIcon className="w-4 h-4" /> Dados Básicos
          </button>
          <button
            onClick={() => setActiveTab('dna')}
            className={`py-4 px-6 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'dna' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            <BriefcaseIcon className="w-4 h-4" /> DNA & Persona
          </button>
          <button
            onClick={() => setActiveTab('voz')}
            className={`py-4 px-6 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'voz' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            <MicIcon className="w-4 h-4" /> Configuração de Voz
          </button>
        </div>

        {/* Scrollable Form Content */}
        <form id="agent-form" onSubmit={handleSubmit(submitAction)} className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-50/30">
          
          {activeTab === 'basico' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-2">
              <div className="space-y-6">
                <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest pl-1">Identidade do Agente</h3>
                
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">NOME COMPLETO</label>
                    <input {...register('nome')} className={`w-full px-4 py-3 bg-white border ${errors.nome ? 'border-rose-500' : 'border-slate-200'} rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-medium`} placeholder="Ex: Ricardo Silva" />
                    {errors.nome && <p className="text-rose-500 text-[10px] font-bold mt-1 ml-1">{errors.nome.message}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">E-MAIL PROFISSIONAL</label>
                    <input {...register('email')} className={`w-full px-4 py-3 bg-white border ${errors.email ? 'border-rose-500' : 'border-slate-200'} rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-medium`} placeholder="ricardo@squad.com" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">FUNÇÃO COMERCIAL</label>
                    <select {...register('funcao')} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 font-bold text-slate-700">
                      {AGENTE_FUNCAO_COMERCIAL_VALUES.map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">VERTICAL / SEGMENTO</label>
                    <input {...register('vertical')} className={`w-full px-4 py-3 bg-white border ${errors.vertical ? 'border-rose-500' : 'border-slate-200'} rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 font-medium`} placeholder="Ex: Odonto" />
                  </div>
                </div>
              </div>

              <div className="space-y-6 border-l border-slate-200 pl-8">
                <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest pl-1">Capacidade Operacional</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">TIPO DE AGENTE</label>
                    <select {...register('tipo')} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl font-bold">
                      {AGENTE_TIPO_VALUES.map(v => <option key={v} value={v}>{v.replace('_', ' ')}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">EXP. LEVEL</label>
                      <select {...register('nivel_experiencia')} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl font-bold">
                        {AGENTE_NIVEL_EXPERIENCIA_VALUES.map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">CAPACIDADE (CONC.)</label>
                      <input type="number" {...register('capacidade_concorrente', { valueAsNumber: true })} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl font-black text-center" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'dna' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-2">
               <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest pl-1">Identidade Psicológica e Comportamental</h3>
               <div className="grid grid-cols-1 gap-6">
                 <div>
                   <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">BIO / PERSONA (Quem é esse agente?)</label>
                   <textarea {...register('persona.bio')} rows={4} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-3xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 font-medium leading-relaxed" placeholder="Descreva a história, o cargo e o jeito de ser do agente..." />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">TOM DE VOZ & COMPORTAMENTO</label>
                    <input {...register('persona.tom_voz')} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl font-medium" placeholder="Ex: Amigável, técnico, consultivo..." />
                 </div>
               </div>
            </div>
          )}

          {activeTab === 'voz' && (
            <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-2">
               <div className="bg-blue-600 rounded-3xl p-6 text-white flex items-center gap-6 shadow-xl shadow-blue-500/20">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                    <MicIcon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black tracking-tight">Síntese de Voz Nativa</h4>
                    <p className="text-blue-100 text-sm opacity-80 font-medium">Configure como o agente irá falar com o cliente final.</p>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">PROVIDER</label>
                    <select {...register('voz.provider')} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl font-black text-slate-700">
                      <option value="ElevenLabs">ElevenLabs (Premium)</option>
                      <option value="OpenAI">OpenAI (TTS-1)</option>
                      <option value="Google">Google Cloud TTS</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">VOICE ID</label>
                    <input {...register('voz.voice_id')} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl font-mono text-sm" placeholder="Ex: jQvE2bS7N... (ID do provider)" />
                  </div>
               </div>

               <div className="space-y-4 bg-slate-100 p-6 rounded-3xl">
                  <div className="flex justify-between text-xs font-black text-slate-400 px-1">
                    <span>CADÊNCIA / VELOCIDADE</span>
                    <span className="text-blue-600">{watch('voz.velocidade')}x</span>
                  </div>
                  <input type="range" step="0.1" min="0.5" max="2.0" {...register('voz.velocidade', { valueAsNumber: true })} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
               </div>
            </div>
          )}

        </form>

        {/* Footer */}
        <div className="flex items-center justify-between p-8 bg-white border-t border-slate-200">
          <button type="button" onClick={onCancel} className="px-8 py-4 bg-slate-100 text-slate-600 font-black rounded-2xl hover:bg-slate-200 transition-all text-sm tracking-tight">CANCELAR</button>
          <button type="submit" form="agent-form" className="px-10 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 text-sm tracking-tight flex items-center gap-3">
            <SaveIcon className="w-5 h-5" /> {submitLabel.toUpperCase()}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgentForm;