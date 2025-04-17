import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCultural } from '../../context/CulturalContext';
import type { ArtistBirthday } from '../../types/cultural';

const birthdaySchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  birthDate: z.string().min(1, 'La fecha es requerida'),
  role: z.string().min(3, 'El rol es requerido'),
  trajectory: z.string().min(10, 'La trayectoria debe tener al menos 10 caracteres'),
  discipline: z.enum(['Teatro', 'Danza', 'Artes Visuales', 'Música', 'Literatura'] as const),
  contactInfo: z.object({
    email: z.string().email('Email inválido'),
    phone: z.string().min(6, 'El teléfono es requerido')
  }),
  image: z.string().optional(),
  isFavorite: z.boolean().default(false)
});

interface BirthdayFormProps {
  onComplete?: () => void;
}

export const BirthdayForm: React.FC<BirthdayFormProps> = ({ onComplete }) => {
  const { dispatch } = useCultural();
  const { register, handleSubmit, formState: { errors } } = useForm<ArtistBirthday>({
    resolver: zodResolver(birthdaySchema),
    defaultValues: {
      isFavorite: false
    }
  });

  const onSubmit = (data: any) => {
    dispatch({
      type: 'ADD_BIRTHDAY',
      payload: {
        ...data,
        id: crypto.randomUUID(),
        birthDate: new Date(data.birthDate)
      }
    });
    onComplete?.();
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-6 py-4 bg-cultural-visuales text-white">
        <h2 className="text-xl font-bold">Nuevo Cumpleaños</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              {...register('name')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cultural-visuales focus:ring focus:ring-cultural-visuales focus:ring-opacity-50"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
            <input
              type="date"
              {...register('birthDate')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cultural-visuales focus:ring focus:ring-cultural-visuales focus:ring-opacity-50"
            />
            {errors.birthDate && (
              <p className="mt-1 text-sm text-red-600">{errors.birthDate.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Rol</label>
            <input
              type="text"
              {...register('role')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cultural-visuales focus:ring focus:ring-cultural-visuales focus:ring-opacity-50"
              placeholder="Ej: Actor, Director, Músico..."
            />
            {errors.role && (
              <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Disciplina Artística</label>
            <select
              {...register('discipline')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cultural-visuales focus:ring focus:ring-cultural-visuales focus:ring-opacity-50"
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              {...register('contactInfo.email')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cultural-visuales focus:ring focus:ring-cultural-visuales focus:ring-opacity-50"
            />
            {errors.contactInfo?.email && (
              <p className="mt-1 text-sm text-red-600">{errors.contactInfo.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Teléfono</label>
            <input
              type="tel"
              {...register('contactInfo.phone')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cultural-visuales focus:ring focus:ring-cultural-visuales focus:ring-opacity-50"
            />
            {errors.contactInfo?.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.contactInfo.phone.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Trayectoria</label>
          <textarea
            {...register('trajectory')}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cultural-visuales focus:ring focus:ring-cultural-visuales focus:ring-opacity-50"
          />
          {errors.trajectory && (
            <p className="mt-1 text-sm text-red-600">{errors.trajectory.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">URL de la Imagen</label>
          <input
            type="url"
            {...register('image')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cultural-visuales focus:ring focus:ring-cultural-visuales focus:ring-opacity-50"
            placeholder="https://ejemplo.com/imagen.jpg"
          />
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
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cultural-visuales hover:bg-cultural-visuales/90"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
};