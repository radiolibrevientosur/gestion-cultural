import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCultural } from '../../context/CulturalContext';
import { ImageUpload } from '../ui/ImageUpload';
import type { CulturalEvent, RecurrenceType } from '../../types/cultural';
import { CalendarDays, Users, Tags, FileText, Phone, AtSign, DollarSign, RefreshCw } from 'lucide-react';

const recurrenceSchema = z.object({
  type: z.enum(['none', 'daily', 'weekly', 'monthly', 'custom'] as const),
  interval: z.number().optional(),
  endDate: z.string().optional(),
  daysOfWeek: z.array(z.number().min(0).max(6)).optional(),
});

const eventSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  eventType: z.enum(['Taller', 'Espectáculo', 'Exposición', 'Concierto', 'Conferencia'] as const),
  discipline: z.enum(['Teatro', 'Danza', 'Artes Visuales', 'Música', 'Literatura'] as const),
  date: z.string().min(1, 'La fecha es requerida'),
  location: z.string().min(3, 'La ubicación es requerida'),
  targetAudience: z.enum(['Infantil', 'Adultos', 'Todos']),
  cost: z.object({
    type: z.enum(['free', 'paid']),
    amount: z.number().optional()
  }),
  responsiblePerson: z.object({
    name: z.string().min(3, 'El nombre es requerido'),
    phone: z.string().min(6, 'El teléfono es requerido'),
    socialMedia: z.string().optional()
  }),
  technicalRequirements: z.array(z.string()),
  image: z.object({
    data: z.string(),
    type: z.string()
  }).optional(),
  tags: z.array(z.string()),
  isFavorite: z.boolean().default(false),
  recurrence: recurrenceSchema.default({ type: 'none' })
});

interface EventFormProps {
  onComplete?: () => void;
}

export const EventoCulturalForm: React.FC<EventFormProps> = ({ onComplete }) => {
  const { dispatch } = useCultural();
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<CulturalEvent>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      cost: { type: 'free' },
      technicalRequirements: [],
      tags: [],
      isFavorite: false,
      recurrence: { type: 'none' }
    }
  });

  const costType = watch('cost.type');
  const recurrenceType = watch('recurrence.type');

  const onSubmit = async (data: CulturalEvent) => {
    try {
      dispatch({
        type: 'ADD_EVENT',
        payload: { ...data, id: crypto.randomUUID(), date: new Date(data.date) }
      });
      onComplete?.();
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Error al guardar el evento. Por favor, intente nuevamente.');
    }
  };

  const handleImageChange = (image: { data: string; type: string } | undefined) => {
    setValue('image', image);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
      <div className="px-6 py-4 bg-cultural-escenicas text-white">
        <h2 className="text-xl font-bold">Nuevo Evento Cultural</h2>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        {/* Título y Descripción */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Título del Evento
            </label>
            <input
              type="text"
              {...register('title')}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-cultural-escenicas focus:ring focus:ring-cultural-escenicas focus:ring-opacity-50"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Descripción
            </label>
            <textarea
              {...register('description')}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-cultural-escenicas focus:ring focus:ring-cultural-escenicas focus:ring-opacity-50"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>
        </div>

        {/* Imagen */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            Imagen del Evento
          </label>
          <ImageUpload
            value={watch('image')}
            onChange={handleImageChange}
            className="w-full"
          />
        </div>

        {/* Tipo y Disciplina */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Tipo de Evento
            </label>
            <select
              {...register('eventType')}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-cultural-escenicas focus:ring focus:ring-cultural-escenicas focus:ring-opacity-50"
            >
              <option value="">Seleccionar tipo...</option>
              <option value="Taller">Taller</option>
              <option value="Espectáculo">Espectáculo</option>
              <option value="Exposición">Exposición</option>
              <option value="Concierto">Concierto</option>
              <option value="Conferencia">Conferencia</option>
            </select>
            {errors.eventType && (
              <p className="mt-1 text-sm text-red-600">{errors.eventType.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Disciplina Artística
            </label>
            <select
              {...register('discipline')}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-cultural-escenicas focus:ring focus:ring-cultural-escenicas focus:ring-opacity-50"
            >
              <option value="">Seleccionar disciplina...</option>
              <option value="Teatro">Teatro</option>
              <option value="Danza">Danza</option>
              <option value="Artes Visuales">Artes Visuales</option>
              <option value="Música">Música</option>
              <option value="Literatura">Literatura</option>
            </select>
            {errors.discipline && (
              <p className="mt-1 text-sm text-red-600">{errors.discipline.message}</p>
            )}
          </div>
        </div>

        {/* Fecha y Recurrencia */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Fecha y Hora
            </label>
            <input
              type="datetime-local"
              {...register('date')}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-cultural-escenicas focus:ring focus:ring-cultural-escenicas focus:ring-opacity-50"
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Recurrencia
            </label>
            <select
              {...register('recurrence.type')}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-cultural-escenicas focus:ring focus:ring-cultural-escenicas focus:ring-opacity-50"
            >
              <option value="none">Sin recurrencia</option>
              <option value="daily">Diario</option>
              <option value="weekly">Semanal</option>
              <option value="monthly">Mensual</option>
              <option value="custom">Personalizado</option>
            </select>

            {recurrenceType !== 'none' && (
              <div className="mt-4 space-y-4">
                {recurrenceType === 'custom' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Intervalo (días)
                    </label>
                    <input
                      type="number"
                      {...register('recurrence.interval', { valueAsNumber: true })}
                      min="1"
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-cultural-escenicas focus:ring focus:ring-cultural-escenicas focus:ring-opacity-50"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Fecha de finalización
                  </label>
                  <input
                    type="date"
                    {...register('recurrence.endDate')}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-cultural-escenicas focus:ring focus:ring-cultural-escenicas focus:ring-opacity-50"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Ubicación y Público */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Ubicación
            </label>
            <input
              type="text"
              {...register('location')}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-cultural-escenicas focus:ring focus:ring-cultural-escenicas focus:ring-opacity-50"
            />
            {errors.location && (
              <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Público Objetivo
            </label>
            <select
              {...register('targetAudience')}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-cultural-escenicas focus:ring focus:ring-cultural-escenicas focus:ring-opacity-50"
            >
              <option value="">Seleccionar público...</option>
              <option value="Infantil">Infantil</option>
              <option value="Adultos">Adultos</option>
              <option value="Todos">Todos</option>
            </select>
            {errors.targetAudience && (
              <p className="mt-1 text-sm text-red-600">{errors.targetAudience.message}</p>
            )}
          </div>
        </div>

        {/* Costo */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Costo
          </label>
          <div className="flex items-center space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                {...register('cost.type')}
                value="free"
                className="form-radio text-cultural-escenicas"
              />
              <span className="ml-2 text-gray-700 dark:text-gray-200">Gratuito</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                {...register('cost.type')}
                value="paid"
                className="form-radio text-cultural-escenicas"
              />
              <span className="ml-2 text-gray-700 dark:text-gray-200">Pago</span>
            </label>
          </div>
          {costType === 'paid' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Monto
              </label>
              <input
                type="number"
                {...register('cost.amount', { valueAsNumber: true })}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-cultural-escenicas focus:ring focus:ring-cultural-escenicas focus:ring-opacity-50"
                placeholder="0.00"
                step="0.01"
              />
            </div>
          )}
        </div>

        {/* Responsable */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Nombre del Responsable
            </label>
            <input
              type="text"
              {...register('responsiblePerson.name')}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-cultural-escenicas focus:ring focus:ring-cultural-escenicas focus:ring-opacity-50"
            />
            {errors.responsiblePerson?.name && (
              <p className="mt-1 text-sm text-red-600">{errors.responsiblePerson.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Teléfono
            </label>
            <input
              type="tel"
              {...register('responsiblePerson.phone')}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-cultural-escenicas focus:ring focus:ring-cultural-escenicas focus:ring-opacity-50"
            />
            {errors.responsiblePerson?.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.responsiblePerson.phone.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Red Social
            </label>
            <input
              type="text"
              {...register('responsiblePerson.socialMedia')}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-cultural-escenicas focus:ring focus:ring-cultural-escenicas focus:ring-opacity-50"
              placeholder="@usuario"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => onComplete?.()}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cultural-escenicas hover:bg-cultural-escenicas/90"
          >
            Crear Evento
          </button>
        </div>
      </form>
    </div>
  );
};