import React from 'react';
import { useCultural } from '../../context/CulturalContext';
import { CheckSquare, Clock, User } from 'lucide-react';
import type { CulturalTask } from '../../types/cultural';

const COLUMNS = [
  { id: 'pending', title: 'Pendientes', color: 'bg-yellow-100' },
  { id: 'in-progress', title: 'En Progreso', color: 'bg-blue-100' },
  { id: 'completed', title: 'Completadas', color: 'bg-green-100' }
] as const;

export const TaskCulturalKanban: React.FC = () => {
  const { state, dispatch } = useCultural();

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDrop = (e: React.DragEvent, status: CulturalTask['status']) => {
    const taskId = e.dataTransfer.getData('taskId');
    dispatch({
      type: 'UPDATE_TASK_STATUS',
      payload: { id: taskId, status }
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="h-full min-h-[600px] bg-gray-50 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Tareas Culturales</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
        {COLUMNS.map(column => (
          <div
            key={column.id}
            className={`${column.color} p-4 rounded-lg shadow`}
            onDrop={(e) => handleDrop(e, column.id)}
            onDragOver={handleDragOver}
          >
            <h3 className="font-semibold text-gray-900 mb-4">{column.title}</h3>
            
            <div className="space-y-4">
              {state.tasks
                .filter(task => task.status === column.id)
                .map(task => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    className="bg-white p-4 rounded shadow-sm cursor-move hover:shadow-md transition-shadow"
                  >
                    <h4 className="font-medium text-gray-900">{task.title}</h4>
                    <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                    
                    <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        <span>{task.assignedTo}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    {task.checklist.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex items-center text-sm text-gray-500">
                          <CheckSquare className="h-4 w-4 mr-1" />
                          <span>
                            {task.checklist.filter(item => item.completed).length} / {task.checklist.length}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};