import React, { useState } from 'react';
import { ImageUpload } from '../ui/ImageUpload';
import { useCultural } from '../../context/CulturalContext';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, Users, CheckSquare, ContactIcon, Camera } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const userProfileSchema = z.object({
  username: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  birthDate: z.string().optional(),
  category: z.enum(['CINE Y MEDIOS AUDIOVISUALES', 'ARTES VISUALES', 'ARTES ESCÉNICAS Y MUSICALES', 'PROMOCIÓN DEL LIBRO Y LA LECTURA', 'PATRIMONIO CULTURAL', 'ECONOMÍA CULTURAL', 'OTROS']),
  biography: z.string().max(200, 'La biografía no puede exceder las 200 palabras'),
  image: z.object({
    data: z.string(),
    type: z.string()
  }).optional()
});

type UserProfileForm = z.infer<typeof userProfileSchema>;

export const UserProfile: React.FC = () => {
  const { state } = useCultural();
  const [isEditing, setIsEditing] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<UserProfileForm>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      username: 'Usuario',
      email: 'usuario@example.com',
      category: 'OTROS',
      biography: ''
    }
  });

  const handleImageChange = (image: { data: string; type: string } | undefined) => {
    setValue('image', image);
  };

  const onSubmit = (data: UserProfileForm) => {
    console.log('Profile updated:', data);
    setIsEditing(false);
  };

  // Calculate statistics
  const stats = {
    events: state.events.length,
    birthdays: state.birthdays.length,
    tasks: state.tasks.length,
    contacts: state.contacts.length
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="relative h-48 bg-cultural-escenicas">
          <div className="absolute -bottom-16 left-6">
            <div className="relative">
              {watch('image')?.data ? (
                <img
                  src={watch('image')?.data}
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800"
                />
              ) : (
                <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <Camera className="w-8 h-8 text-gray-400" />
                </div>
              )}
              {isEditing && (
                <div className="absolute bottom-0 right-0">
                  <ImageUpload
                    value={watch('image')}
                    onChange={handleImageChange}
                    className="w-8 h-8"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="pt-20 px-6 pb-6">
          {isEditing ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Nombre de Usuario
                  </label>
                  <input
                    type="text"
                    {...register('username')}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-cultural-escenicas focus:ring focus:ring-cultural-escenicas focus:ring-opacity-50"
                  />
                  {errors.username && (
                    <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Email
                  </label>
                  <input
                    type="email"
                    {...register('email')}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-cultural-escenicas focus:ring focus:ring-cultural-escenicas focus:ring-opacity-50"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Fecha de Nacimiento
                  </label>
                  <input
                    type="date"
                    {...register('birthDate')}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-cultural-escenicas focus:ring focus:ring-cultural-escenicas focus:ring-opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Categoría
                  </label>
                  <select
                    {...register('category')}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-cultural-escenicas focus:ring focus:ring-cultural-escenicas focus:ring-opacity-50"
                  >
                    <option value="CINE Y MEDIOS AUDIOVISUALES">Cine y Medios Audiovisuales</option>
                    <option value="ARTES VISUALES">Artes Visuales</option>
                    <option value="ARTES ESCÉNICAS Y MUSICALES">Artes Escénicas y Musicales</option>
                    <option value="PROMOCIÓN DEL LIBRO Y LA LECTURA">Promoción del Libro y la Lectura</option>
                    <option value="PATRIMONIO CULTURAL">Patrimonio Cultural</option>
                    <option value="ECONOMÍA CULTURAL">Economía Cultural</option>
                    <option value="OTROS">Otros</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Biografía
                </label>
                <textarea
                  {...register('biography')}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-cultural-escenicas focus:ring focus:ring-cultural-escenicas focus:ring-opacity-50"
                  placeholder="Cuéntanos sobre ti (máximo 200 palabras)"
                />
                {errors.biography && (
                  <p className="mt-1 text-sm text-red-600">{errors.biography.message}</p>
                )}
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cultural-escenicas hover:bg-cultural-escenicas/90"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {watch('username')}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400">{watch('email')}</p>
                  {watch('birthDate') && (
                    <p className="text-gray-500 dark:text-gray-400">
                      {format(new Date(watch('birthDate')), "d 'de' MMMM, yyyy", { locale: es })}
                    </p>
                  )}
                  <p className="text-gray-500 dark:text-gray-400 mt-2">{watch('category')}</p>
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-cultural-escenicas text-white rounded-md hover:bg-cultural-escenicas/90"
                >
                  Editar Perfil
                </button>
              </div>

              {watch('biography') && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Biografía
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">{watch('biography')}</p>
                </div>
              )}

              <div className="border-t dark:border-gray-700 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Estadísticas
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
                    <Calendar className="h-6 w-6 mx-auto mb-2 text-cultural-escenicas" />
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.events}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Eventos</div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
                    <Calendar className="h-6 w-6 mx-auto mb-2 text-cultural-visuales" />
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.birthdays}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Cumpleaños</div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
                    <CheckSquare className="h-6 w-6 mx-auto mb-2 text-cultural-musicales" />
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.tasks}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Tareas</div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
                    <Users className="h-6 w-6 mx-auto mb-2 text-cultural-escenicas" />
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.contacts}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Contactos</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};