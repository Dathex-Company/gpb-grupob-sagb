import React from 'react';
import { TaskzeiTask } from '../../types/task.types';
import { TaskListItem } from './task_list_item';

interface TaskListProps {
  tasks: TaskzeiTask[];
  onTaskClick: (task: TaskzeiTask) => void;
  onCompleteTask: (id: string, e: React.MouseEvent) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, onTaskClick, onCompleteTask }) => {
  if (tasks.length === 0) return null;

  return (
    <div className="flex flex-col">
      {tasks.map(task => (
        <TaskListItem 
          key={task.id} 
          task={task} 
          onClick={onTaskClick} 
          onComplete={onCompleteTask} 
        />
      ))}
    </div>
  );
};
