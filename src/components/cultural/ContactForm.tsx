import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCultural } from '../../context/CulturalContext';
import { ImageUpload } from '../ui/ImageUpload';
import type { Contact } from '../../types/cultural';

const contactSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  role: z.string().min(3, 'El rol es requerido'),
  discipline: z.enum(['Teatro', 'Danza', 'Artes Visuales', 'Música', 'Literatura'] as const),
  email: z.string().email('Email inválido'),
  phone: z.string().min(6, 'El teléfono es requerido'),
   whatsapp: z.string().optional(),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  notes: z.string().optional(),
  image: z.object({
    data: z.string(),
    type: z.string()
  }).optional(),
  isFavorite: z.boolean().default(false)
});

interface ContactFormProps {
  contact?: Contact;
  onComplete?: () => void;
}

export const ContactForm: React.FC<ContactFormProps> = ({ contact, onComplete }) => {
  const { dispatch } = useCultural();
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<Contact>({
    resolver: zodResolver(contactSchema),
    defaultValues: contact || {
      isFavorite: false
    }
  });

  const handleImageChange = (image: { data: string; type: string } | undefined) => {
    setValue('image', image);
  };

  const onSubmit = (data: Contact) => {
    const action = contact ? 'UPDATE_CONTACT' : 'ADD_CONTACT';
    dispatch({
      type: action,
      payload: {
        ...data,
        id: contact?.id || crypto.randomUUID()
      }
    });
    onComplete?.();
  };

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
      <div className="px-6 py-4 bg-cultural-escenicas text-white">
        <h2 className="text-xl font-bold">{contact ? 'Editar' : 'Nuevo'} Contacto</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            Imagen
          </label>
          <ImageUpload
            value={watch('image')}
            onChange={handleImageChange}
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Nombre
            </label>
            <input
              type="text"
              {...register('name')}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-cultural-escenicas focus:ring focus:ring-cultural-escenicas focus:ring-opacity-50"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Rol
            </label>
            <input
              type="text"
              {...register('role')}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-cultural-escenicas focus:ring focus:ring-cultural-escenicas focus:ring-opacity-50"
              placeholder="Ej: Actor, Director, Músico..."
            />
            {errors.role && (
              <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
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
              Teléfono
            </label>
            <input
              type="tel"
              {...register('phone')}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-cultural-escenicas focus:ring focus:ring-cultural-escenicas focus:ring-opacity-50"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>
        </div>
<div>
  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
    WhatsApp
  </label>
  <input
    type="text"
    {...register('whatsapp')}
    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-cultural-escenicas focus:ring focus:ring-cultural-escenicas focus:ring-opacity-50"
    placeholder="Ej: +541112345678"
  />
</div>

<div>
  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
    Instagram
  </label>
  <input
    type="text"
    {...register('instagram')}
    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-cultural-escenicas focus:ring focus:ring-cultural-escenicas focus:ring-opacity-50"
    placeholder="@usuario"
  />
</div>

<div>
  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
    Facebook
  </label>
  <input
    type="text"
    {...register('facebook')}
    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-cultural-escenicas focus:ring focus:ring-cultural-escenicas focus:ring-opacity-50"
    placeholder="facebook.com/usuario"
  />
</div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Notas
          </label>
          <textarea
            {...register('notes')}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-cultural-escenicas focus:ring focus:ring-cultural-escenicas focus:ring-opacity-50"
          />
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
            {contact ? 'Guardar Cambios' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  );
};