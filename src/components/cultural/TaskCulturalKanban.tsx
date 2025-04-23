import React, { useState } from 'react';
import { useCultural } from '../../context/CulturalContext';
import { CheckSquare, Clock, User, Share2, Edit, Trash } from 'lucide-react';
import type { CulturalTask } from '../../types/cultural';
import { ShareModal } from './ShareModal';
import { TaskForm } from './TaskForm';

const COLUMNS = [
  { id: 'pending', title: 'Pendientes', color: 'bg-yellow-100' },
  { id: 'in-progress', title: 'En Progreso', color: 'bg-blue-100' },
  { id: 'completed', title: 'Completadas', color: 'bg-green-100' }
] as const;

export const TaskCulturalKanban: React.FC = () => {
  const { state, dispatch } = useCultural();
  const [editingTask, setEditingTask] = useState<CulturalTask | null>(null);
  const [sharingTask, setSharingTask] = useState<CulturalTask | null>(null);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDrop = (e: React.DragEvent, status: CulturalTask['status']) => {
    const taskId = e.dataTransfer.getData('taskId');
    const task = state.tasks.find(t => t.id === taskId);
    if (task) {
      dispatch({
        type: 'UPDATE_TASK',
        payload: { ...task, status }
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDelete = (taskId: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
      dispatch({
        type: 'DELETE_TASK',
        payload: taskId
      });
    }
  };

  if (editingTask) {
    return (
      <TaskForm
        task={editingTask}
        onComplete={() => setEditingTask(null)}
      />
    );
  }

  return (
    <div className="h-full min-h-[600px] bg-gray-50 dark:bg-gray-900 p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Tareas Culturales</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
        {COLUMNS.map(column => (
          <div
            key={column.id}
            className={`${column.color} dark:bg-gray-800 p-4 rounded-lg shadow`}
            onDrop={(e) => handleDrop(e, column.id)}
            onDragOver={handleDragOver}
          >
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">{column.title}</h3>
            
            <div className="space-y-4">
              {state.tasks
                .filter(task => task.status === column.id)
                .map(task => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    className="bg-white dark:bg-gray-700 p-4 rounded shadow-sm cursor-move hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-gray-900 dark:text-white">{task.title}</h4>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSharingTask(task)}
                          className="p-1 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white"
                        >
                          <Share2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setEditingTask(task)}
                          className="p-1 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(task.id)}
                          className="p-1 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">{task.description}</p>
                    
                    <div className="mt-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
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
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
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

      {sharingTask && (
        <ShareModal
          isOpen={Boolean(sharingTask)}
          onClose={() => setSharingTask(null)}
          title={sharingTask.title}
          text={`📋 Tarea: ${sharingTask.title}
👤 Asignada a: ${sharingTask.assignedTo}
📅 Fecha límite: ${new Date(sharingTask.dueDate).toLocaleDateString()}
📝 Descripción: ${sharingTask.description}
🔄 Estado: ${sharingTask.status === 'pending' ? 'Pendiente' : sharingTask.status === 'in-progress' ? 'En progreso' : 'Completada'}
⚡ Prioridad: ${sharingTask.priority}`}
        />
      )}
    </div>
  );
};