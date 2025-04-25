import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCultural } from '../../context/CulturalContext';
import { ImageUpload } from '../ui/ImageUpload';
import type { CulturalEvent, Category, EventType } from '../../types/cultural';
import { CalendarDays, Users, Tags, FileText, Phone, AtSign, DollarSign, RefreshCw, HelpCircle } from 'lucide-react';

const CATEGORIES: Category[] = [
  'CINE Y MEDIOS AUDIOVISUALES',
  'ARTES VISUALES',
  'ARTES ESCÉNICAS Y MUSICALES',
  'PROMOCIÓN DEL LIBRO Y LA LECTURA',
  'PATRIMONIO CULTURAL',
  'ECONOMÍA CULTURAL',
  'OTROS'
];

const EVENT_TYPES: Record<Category, string[]> = {
  'CINE Y MEDIOS AUDIOVISUALES': ['cine foro', 'proyección de cine', 'radio', 'realización audiovisual'],
  'ARTES VISUALES': ['dibujo y pintura', 'escultura', 'fotografía', 'constructivismo', 'arte conceptual', 'muralismo'],
  'ARTES ESCÉNICAS Y MUSICALES': ['teatro', 'danza', 'música', 'circo'],
  'PROMOCIÓN DEL LIBRO Y LA LECTURA': ['creación y expresividad literaria', 'promoción de lectura', 'club de libros'],
  'PATRIMONIO CULTURAL': ['historia local', 'historia general', 'costumbres y tradiciones', 'cultura popular', 'identidad cultural'],
  'ECONOMÍA CULTURAL': ['industrias culturales', 'proyectos culturales', 'portafolios culturales (emprendimientos)', 'finanzas culturales'],
  'OTROS': []
};

const recurrenceSchema = z.object({
  type: z.enum(['none', 'daily', 'weekly', 'monthly', 'custom'] as const),
  interval: z.number().optional(),
  endDate: z.string().optional(),
  daysOfWeek: z.array(z.number().min(0).max(6)).optional(),
});

const eventSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  category: z.enum(CATEGORIES),
  eventType: z.string().refine((val) => val.length > 0, {
    message: 'Selecciona un tipo de evento'
  }),
  discipline: z.enum(['Teatro', 'Danza', 'Artes Visuales', 'Música', 'Literatura']),
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
  technicalRequirements: z.array(z.string()).default([]),
  image: z.object({
    data: z.string(),
    type: z.string()
  }).optional(),
  tags: z.array(z.string()).default([]),
  isFavorite: z.boolean().default(false),
  recurrence: recurrenceSchema.default({ type: 'none' })
});

interface EventFormProps {
  event?: CulturalEvent;
  onComplete?: () => void;
}

export const EventoCulturalForm: React.FC<EventFormProps> = ({ event, onComplete }) => {
  const { dispatch } = useCultural();
  const [selectedCategory, setSelectedCategory] = useState<Category | ''>('');
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<CulturalEvent>({
    resolver: zodResolver(eventSchema),
    defaultValues: event || {
      cost: { type: 'free' },
      technicalRequirements: [],
      tags: [],
      isFavorite: false,
      recurrence: { type: 'none' },
      discipline: 'Teatro'
    }
  });

  const costType = watch('cost.type');
  const recurrenceType = watch('recurrence.type');
  const category = watch('category');

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value as Category;
    setSelectedCategory(newCategory);
    setValue('category', newCategory);
    setValue('eventType', '');
  };

  const onSubmit = async (data: CulturalEvent) => {
    console.log('Datos del formulario:', data);
    try {
      const action = event ? 'UPDATE_EVENT' : 'ADD_EVENT';
      const payload = {
        ...data,
        id: event?.id || crypto.randomUUID(),
        date: new Date(data.date),
        imageBase64: data.image?.data || null
      };
      
      console.log('Dispatching:', payload);
      dispatch({
        type: action,
        payload
      });
      onComplete?.();
    } catch (error) {
      console.error('Error detallado:', error);
      alert('Error al guardar el evento. Por favor, intente nuevamente.');
    }
  };

  const handleImageChange = (image: { data: string; type: string } | undefined) => {
    setValue('image', image);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
      <div className="px-6 py-4 bg-cultural-escenicas text-white">
        <h2 className="text-xl font-bold">{event ? 'Editar' : 'Nuevo'} Evento Cultural</h2>
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

        {/* Categoría y Tipo de Evento */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center">
              Categoría
              <div className="relative ml-2 group">
                <HelpCircle className="h-4 w-4 text-gray-400" />
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all w-48 text-center">
                  Selecciona la categoría principal del evento
                </div>
              </div>
            </label>
            <select
              {...register('category')}
              onChange={handleCategoryChange}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-cultural-escenicas focus:ring focus:ring-cultural-escenicas focus:ring-opacity-50"
            >
              <option value="">Seleccionar categoría...</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center">
              Tipo de Evento
              <div className="relative ml-2 group">
                <HelpCircle className="h-4 w-4 text-gray-400" />
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all w-48 text-center">
                  {category ? 'Selecciona el tipo específico de evento' : 'Primero selecciona una categoría'}
                </div>
              </div>
            </label>
            <select
              {...register('eventType')}
              disabled={!category}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-cultural-escenicas focus:ring focus:ring-cultural-escenicas focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Seleccionar tipo...</option>
              {category && EVENT_TYPES[category].map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {errors.eventType && (
              <p className="mt-1 text-sm text-red-600">{errors.eventType.message}</p>
            )}
          </div>
        </div>

        {/* Disciplina */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Disciplina
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
            {event ? 'Guardar Cambios' : 'Crear Evento'}
          </button>
        </div>
      </form>
    </div>
  );
};
