import React from 'react';
import { TaskzeiTask } from '../../types/task.types';

interface TaskDrawerProps {
  task: TaskzeiTask | null;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (id: string) => void;
  onChangeStatus: (id: string, status: TaskzeiTask['status']) => void;
}

export const TaskDrawer: React.FC<TaskDrawerProps> = ({ 
  task, 
  isOpen, 
  onClose,
  onComplete,
  onChangeStatus
}) => {
  if (!isOpen || !task) return null;

  const isCompleted = task.status === 'concluida';

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/20 z-40 transition-opacity"
        onClick={onClose}
      />
      
      <div className="fixed right-0 top-0 h-full w-[500px] bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out border-l border-gray-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex gap-2">
            <button 
              onClick={() => onComplete(task.id)}
              className={`px-3 py-1.5 text-xs font-bold rounded-md flex items-center gap-1.5 transition-colors ${
                isCompleted 
                  ? 'bg-cyan-50 text-cyan-700 hover:bg-cyan-100' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              {isCompleted ? 'Concluída' : 'Marcar Concluída'}
            </button>
            <select
              value={task.status}
              onChange={(e) => onChangeStatus(task.id, e.target.value as TaskzeiTask['status'])}
              className="text-xs font-bold bg-white border border-gray-200 rounded-md px-3 py-1.5 text-gray-700 hover:bg-gray-50 outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
            >
              <option value="aberta">Aberta</option>
              <option value="em_andamento">Em Andamento</option>
              <option value="concluida">Concluída</option>
            </select>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{task.title}</h2>

            <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-8 text-sm">
              <div>
                <span className="block text-gray-500 mb-1">Responsável</span>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                    {task.assigneeName?.charAt(0) || '?'}
                  </div>
                  <span className="font-medium text-gray-800">{task.assigneeName || 'Não atribuído'}</span>
                </div>
              </div>
              
              <div>
                <span className="block text-gray-500 mb-1">Prazo</span>
                <span className="font-medium text-gray-800">
                  {task.dueDate ? new Date(task.dueDate).toLocaleDateString('pt-BR') : 'Sem prazo'}
                </span>
              </div>

              <div>
                <span className="block text-gray-500 mb-1">Prioridade</span>
                <span className="font-medium text-gray-800 capitalize">{task.priority}</span>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-sm font-bold text-gray-800 mb-2">Descrição</h3>
              <p className="text-gray-600 text-sm whitespace-pre-wrap leading-relaxed">
                {task.description || 'Nenhuma descrição fornecida.'}
              </p>
            </div>

            {task.checklist && task.checklist.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                  Checklist
                  <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                    {task.checklist.filter(c => c.completed).length}/{task.checklist.length}
                  </span>
                </h3>
                <div className="space-y-2">
                  {task.checklist.map(item => (
                    <div key={item.id} className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        checked={item.completed}
                        readOnly
                        className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500 cursor-pointer"
                      />
                      <span className={`text-sm ${item.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                        {item.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-gray-100 pt-8">
              <h3 className="text-sm font-bold text-gray-800 mb-4">Comentários</h3>
              
              <div className="flex gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-700 font-bold shrink-0">
                  V
                </div>
                <div className="flex-1">
                  <div className="border border-gray-200 rounded-lg focus-within:border-cyan-500 focus-within:ring-1 focus-within:ring-cyan-500 overflow-hidden">
                    <textarea 
                      className="w-full p-3 text-sm outline-none resize-none bg-transparent min-h-[80px]"
                      placeholder="Adicione um comentário..."
                    ></textarea>
                    <div className="bg-gray-50 px-3 py-2 flex justify-end border-t border-gray-100">
                      <button className="px-3 py-1.5 bg-cyan-600 text-white text-xs font-bold rounded hover:bg-cyan-700 transition-colors">
                        Comentar
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {task.comments && task.comments.length > 0 ? (
                <div className="space-y-5">
                  {task.comments.map(comment => (
                    <div key={comment.id} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-bold shrink-0">
                        {comment.authorName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-sm text-gray-800">{comment.authorName}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(comment.createdAt).toLocaleDateString('pt-BR')} às {new Date(comment.createdAt).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
                          </span>
                        </div>
                        <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg rounded-tl-none border border-gray-100">
                          {comment.content}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">Nenhum comentário ainda.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
