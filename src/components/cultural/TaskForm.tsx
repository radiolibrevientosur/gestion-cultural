import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCultural } from '../../context/CulturalContext';
import type { CulturalTask } from '../../types/cultural';

const taskSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  status: z.enum(['pending', 'in-progress', 'completed']).default('pending'),
  priority: z.enum(['low', 'medium', 'high']),
  assignedTo: z.string().min(3, 'El responsable es requerido'),
  dueDate: z.string().min(1, 'La fecha límite es requerida'),
  checklist: z.array(z.object({
    id: z.string(),
    task: z.string(),
    completed: z.boolean()
  })).default([]),
  isFavorite: z.boolean().default(false)
});

interface TaskFormProps {
  onComplete?: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onComplete }) => {
  const { dispatch } = useCultural();
  const { register, handleSubmit, formState: { errors } } = useForm<CulturalTask>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      status: 'pending',
      checklist: [],
      isFavorite: false
    }
  });

  const onSubmit = (data: any) => {
    dispatch({
      type: 'ADD_TASK',
      payload: {
        ...data,
        id: crypto.randomUUID(),
        dueDate: new Date(data.dueDate)
      }
    });
    onComplete?.();
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-6 py-4 bg-cultural-musicales text-white">
        <h2 className="text-xl font-bold">Nueva Tarea</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Título</label>
            <input
              type="text"
              {...register('title')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cultural-musicales focus:ring focus:ring-cultural-musicales focus:ring-opacity-50"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha Límite</label>
            <input
              type="datetime-local"
              {...register('dueDate')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cultural-musicales focus:ring focus:ring-cultural-musicales focus:ring-opacity-50"
            />
            {errors.dueDate && (
              <p className="mt-1 text-sm text-red-600">{errors.dueDate.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Prioridad</label>
            <select
              {...register('priority')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cultural-musicales focus:ring focus:ring-cultural-musicales focus:ring-opacity-50"
            >
              <option value="">Seleccionar prioridad...</option>
              <option value="low">Baja</option>
              <option value="medium">Media</option>
              <option value="high">Alta</option>
            </select>
            {errors.priority && (
              <p className="mt-1 text-sm text-red-600">{errors.priority.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Asignado a</label>
            <input
              type="text"
              {...register('assignedTo')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cultural-musicales focus:ring focus:ring-cultural-musicales focus:ring-opacity-50"
            />
            {errors.assignedTo && (
              <p className="mt-1 text-sm text-red-600">{errors.assignedTo.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Descripción</label>
          <textarea
            {...register('description')}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cultural-musicales focus:ring focus:ring-cultural-musicales focus:ring-opacity-50"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => onComplete?.()}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cultural-musicales hover:bg-cultural-musicales/90"
          >
            Crear Tarea
          </button>
        </div>
      </form>
    </div>
  );
};