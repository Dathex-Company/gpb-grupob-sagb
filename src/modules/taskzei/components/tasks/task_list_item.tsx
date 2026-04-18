import React from 'react';
import { TaskzeiTask } from '../../types/task.types';

interface TaskListItemProps {
  task: TaskzeiTask;
  onClick: (task: TaskzeiTask) => void;
  onComplete: (id: string, e: React.MouseEvent) => void;
}

export const TaskListItem: React.FC<TaskListItemProps> = ({ task, onClick, onComplete }) => {
  const isCompleted = task.status === 'concluida';

  const getPriorityColor = () => {
    switch (task.priority) {
      case 'alta': return 'text-red-600 bg-red-50 border-red-200';
      case 'media': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'baixa': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusLabel = () => {
    switch (task.status) {
      case 'aberta': return 'Aberta';
      case 'em_andamento': return 'Em Andamento';
      case 'concluida': return 'Concluída';
      default: return task.status;
    }
  };

  return (
    <div 
      onClick={() => onClick(task)}
      className="group p-3 mb-2 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow hover:border-gray-200 transition-all cursor-pointer flex items-center gap-4"
    >
      <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
        <button 
          onClick={(e) => onComplete(task.id, e)}
          className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
            isCompleted 
              ? 'bg-cyan-600 border-cyan-600 text-white' 
              : 'border-gray-300 hover:border-cyan-500'
          }`}
        >
          {isCompleted && (
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className={`text-sm font-medium truncate ${isCompleted ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
          {task.title}
        </h3>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0 text-xs">
        {task.dueDate && (
          <div className={`flex items-center gap-1 ${isCompleted ? 'text-gray-400' : 'text-gray-500'}`}>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{new Date(task.dueDate).toLocaleDateString('pt-BR')}</span>
          </div>
        )}
        
        {task.assigneeName && (
          <div className={`flex items-center gap-1 ${isCompleted ? 'text-gray-400' : 'text-gray-600'}`}>
            <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold">
              {task.assigneeName.charAt(0)}
            </div>
          </div>
        )}

        <div className={`px-2 py-0.5 rounded border font-medium ${getPriorityColor()} ${isCompleted ? 'opacity-50' : ''}`}>
          {task.priority === 'alta' ? 'Alta' : task.priority === 'media' ? 'Média' : 'Baixa'}
        </div>

        <div className={`px-2 py-0.5 rounded border font-medium ${
          isCompleted ? 'bg-gray-100 text-gray-500 border-gray-200' : 'bg-gray-50 text-gray-600 border-gray-200'
        }`}>
          {getStatusLabel()}
        </div>
      </div>
    </div>
  );
};
