import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCultural } from '../../context/CulturalContext';
import { ImageUpload } from '../ui/ImageUpload';
import type { PressArticle } from '../../types/cultural';

const pressArticleSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  author: z.string().min(3, 'El autor es requerido'),
  summary: z.string().min(10, 'El resumen debe tener al menos 10 caracteres'),
  content: z.string().min(50, 'El contenido debe tener al menos 50 caracteres'),
  category: z.enum(['CINE Y MEDIOS AUDIOVISUALES', 'ARTES VISUALES', 'ARTES ESCÉNICAS Y MUSICALES', 'PROMOCIÓN DEL LIBRO Y LA LECTURA', 'PATRIMONIO CULTURAL', 'ECONOMÍA CULTURAL', 'OTROS']),
  tags: z.string().transform(tags => tags.split(',').map(tag => tag.trim())),
  image: z.object({
    data: z.string(),
    type: z.string()
  }).optional(),
  isFavorite: z.boolean().default(false)
});

interface PressArticleFormProps {
  article?: PressArticle;
  onComplete?: () => void;
}

export const PressArticleForm: React.FC<PressArticleFormProps> = ({ article, onComplete }) => {
  const { dispatch } = useCultural();
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<z.infer<typeof pressArticleSchema>>({
    resolver: zodResolver(pressArticleSchema),
    defaultValues: article ? {
      ...article,
      tags: article.tags.join(', '),
      image: article.image,
      isFavorite: article.isFavorite
    } : {
      tags: '',
      isFavorite: false
    }
  });

  const handleImageChange = (image: { data: string; type: string } | undefined) => {
    setValue('image', image);
  };

  const onSubmit = (data: z.infer<typeof pressArticleSchema>) => {
    const payload: PressArticle = {
      ...data,
      id: article?.id || crypto.randomUUID(),
      date: article?.date || new Date(),
      reactions: article?.reactions || { like: 0, love: 0, celebrate: 0, interesting: 0 },
      comments: article?.comments || []
    };

    dispatch({
      type: article ? 'UPDATE_PRESS_ARTICLE' : 'ADD_PRESS_ARTICLE',
      payload
    });

    onComplete?.();
  };

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
      <div className="px-6 py-4 bg-cultural-escenicas text-white">
        <h2 className="text-xl font-bold">{article ? 'Editar' : 'Nuevo'} Artículo de Prensa</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            Imagen Principal
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
              Título
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
              Autor
            </label>
            <input
              type="text"
              {...register('author')}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-cultural-escenicas focus:ring focus:ring-cultural-escenicas focus:ring-opacity-50"
            />
            {errors.author && (
              <p className="mt-1 text-sm text-red-600">{errors.author.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Categoría
            </label>
            <select
              {...register('category')}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-cultural-escenicas focus:ring focus:ring-cultural-escenicas focus:ring-opacity-50"
            >
              <option value="">Seleccionar categoría...</option>
              <option value="CINE Y MEDIOS AUDIOVISUALES">Cine y Medios Audiovisuales</option>
              <option value="ARTES VISUALES">Artes Visuales</option>
              <option value="ARTES ESCÉNICAS Y MUSICALES">Artes Escénicas y Musicales</option>
              <option value="PROMOCIÓN DEL LIBRO Y LA LECTURA">Promoción del Libro y la Lectura</option>
              <option value="PATRIMONIO CULTURAL">Patrimonio Cultural</option>
              <option value="ECONOMÍA CULTURAL">Economía Cultural</option>
              <option value="OTROS">Otros</option>
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Etiquetas (separadas por comas)
            </label>
            <input
              type="text"
              {...register('tags')}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-cultural-escenicas focus:ring focus:ring-cultural-escenicas focus:ring-opacity-50"
              placeholder="Ej: cultura, arte, sociedad"
            />
            {errors.tags && (
              <p className="mt-1 text-sm text-red-600">{errors.tags.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Resumen
          </label>
          <textarea
            {...register('summary')}
            rows={2}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-cultural-escenicas focus:ring focus:ring-cultural-escenicas focus:ring-opacity-50"
          />
          {errors.summary && (
            <p className="mt-1 text-sm text-red-600">{errors.summary.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Contenido
          </label>
          <textarea
            {...register('content')}
            rows={6}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-cultural-escenicas focus:ring focus:ring-cultural-escenicas focus:ring-opacity-50"
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
          )}
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
            {article ? 'Guardar Cambios' : 'Publicar'}
          </button>
        </div>
      </form>
    </div>
  );
};