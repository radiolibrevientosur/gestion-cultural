import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  Calendar, 
  Users, 
  CheckSquare, 
  Camera, 
  Link as LinkIcon,
  Instagram,
  Facebook,
  Twitter,
  Globe,
  Image as ImageIcon,
  FileText,
  Edit3,
  Plus,
  X,
  Upload
} from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useCultural } from '../../context/CulturalContext';
import { ImageUpload } from '../ui/ImageUpload';

const userProfileSchema = z.object({
  username: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  birthDate: z.string().optional(),
  category: z.enum(['CINE Y MEDIOS AUDIOVISUALES', 'ARTES VISUALES', 'ARTES ESCÉNICAS Y MUSICALES', 'PROMOCIÓN DEL LIBRO Y LA LECTURA', 'PATRIMONIO CULTURAL', 'ECONOMÍA CULTURAL', 'OTROS']),
  biography: z.string().max(1000, 'La biografía no puede exceder las 1000 palabras'),
  portfolio: z.array(z.object({
    title: z.string(),
    description: z.string(),
    imageUrl: z.string(),
    link: z.string().optional()
  })).optional(),
  socialLinks: z.object({
    website: z.string().url().optional(),
    instagram: z.string().optional(),
    facebook: z.string().optional(),
    twitter: z.string().optional()
  }),
  image: z.object({
    data: z.string(),
    type: z.string()
  }).optional(),
  coverImage: z.object({
    data: z.string(),
    type: z.string()
  }).optional()
});

type UserProfileForm = z.infer<typeof userProfileSchema>;

interface PortfolioItem {
  title: string;
  description: string;
  imageUrl: string;
  link?: string;
}

interface PortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: PortfolioItem) => void;
  initialData?: PortfolioItem;
}

const PortfolioModal: React.FC<PortfolioModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData
}) => {
  const [formData, setFormData] = useState<PortfolioItem>(initialData || {
    title: '',
    description: '',
    imageUrl: '',
    link: ''
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {initialData ? 'Editar' : 'Nuevo'} Trabajo
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={(e) => {
          e.preventDefault();
          onSave(formData);
          onClose();
        }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Título
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-cultural-escenicas focus:ring focus:ring-cultural-escenicas focus:ring-opacity-50"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Descripción
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-cultural-escenicas focus:ring focus:ring-cultural-escenicas focus:ring-opacity-50"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              URL de la imagen
            </label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-cultural-escenicas focus:ring focus:ring-cultural-escenicas focus:ring-opacity-50"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Enlace (opcional)
            </label>
            <input
              type="url"
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-cultural-escenicas focus:ring focus:ring-cultural-escenicas focus:ring-opacity-50"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-cultural-escenicas text-white rounded-md hover:bg-cultural-escenicas/90"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const UserProfile: React.FC = () => {
  const { state } = useCultural();
  const [isEditing, setIsEditing] = useState(false);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [editingPortfolioItem, setEditingPortfolioItem] = useState<PortfolioItem | undefined>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<UserProfileForm>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      username: 'Usuario',
      email: 'usuario@example.com',
      category: 'OTROS',
      biography: '',
      socialLinks: {
        website: '',
        instagram: '',
        facebook: '',
        twitter: ''
      }
    }
  });

  const handleImageChange = (image: { data: string; type: string } | undefined) => {
    setValue('image', image);
  };

  const handleCoverImageChange = (image: { data: string; type: string } | undefined) => {
    setValue('coverImage', image);
  };

  const handleAddPortfolioItem = (item: PortfolioItem) => {
    if (editingPortfolioItem) {
      setPortfolioItems(portfolioItems.map(i => 
        i === editingPortfolioItem ? item : i
      ));
      setEditingPortfolioItem(undefined);
    } else {
      setPortfolioItems([...portfolioItems, item]);
    }
  };

  const handleEditPortfolioItem = (item: PortfolioItem) => {
    setEditingPortfolioItem(item);
    setShowPortfolioModal(true);
  };

  const handleDeletePortfolioItem = (item: PortfolioItem) => {
    setPortfolioItems(portfolioItems.filter(i => i !== item));
  };

  const onSubmit = (data: UserProfileForm) => {
    console.log('Profile updated:', data);
    setIsEditing(false);
  };

  const stats = {
    events: state.events.length,
    birthdays: state.birthdays.length,
    tasks: state.tasks.length,
    contacts: state.contacts.length
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {/* Cover Image Section */}
        <div className="relative h-48">
          {isEditing ? (
            <ImageUpload
              value={watch('coverImage')}
              onChange={handleCoverImageChange}
              className="w-full h-full"
            />
          ) : (
            <div className={`w-full h-full ${
              watch('coverImage')?.data
                ? ''
                : 'bg-cultural-escenicas'
            }`}>
              {watch('coverImage')?.data && (
                <img
                  src={watch('coverImage').data}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          )}
          
          <div className="absolute -bottom-16 left-6">
            <div className="relative group">
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
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <Upload className="h-8 w-8 text-white" />
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      handleImageChange({
                        data: reader.result as string,
                        type: file.type
                      });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </div>
          </div>
        </div>

        <div className="pt-20 px-6 pb-6">
          {isEditing ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Info */}
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
              </div>

              {/* Social Links */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Redes Sociales
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Sitio Web
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                        <Globe className="h-4 w-4" />
                      </span>
                      <input
                        type="url"
                        {...register('socialLinks.website')}
                        className="flex-1 block w-full rounded-none rounded-r-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-cultural-escenicas focus:ring focus:ring-cultural-escenicas focus:ring-opacity-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Instagram
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                        <Instagram className="h-4 w-4" />
                      </span>
                      <input
                        type="text"
                        {...register('socialLinks.instagram')}
                        placeholder="@usuario"
                        className="flex-1 block w-full rounded-none rounded-r-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-cultural-escenicas focus:ring focus:ring-cultural-escenicas focus:ring-opacity-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Facebook
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                        <Facebook className="h-4 w-4" />
                      </span>
                      <input
                        type="text"
                        {...register('socialLinks.facebook')}
                        placeholder="username"
                        className="flex-1 block w-full rounded-none rounded-r-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-cultural-escenicas focus:ring focus:ring-cultural-escenicas focus:ring-opacity-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Twitter
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                        <Twitter className="h-4 w-4" />
                      </span>
                      <input
                        type="text"
                        {...register('socialLinks.twitter')}
                        placeholder="@usuario"
                        className="flex-1 block w-full rounded-none rounded-r-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-cultural-escenicas focus:ring focus:ring-cultural-escenicas focus:ring-opacity-50"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Biography */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Biografía
                </label>
                <textarea
                  {...register('biography')}
                  rows={6}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-cultural-escenicas focus:ring focus:ring-cultural-escenicas focus:ring-opacity-50"
                  placeholder="Cuéntanos sobre ti..."
                />
                {errors.biography && (
                  <p className="mt-1 text-sm text-red-600">{errors.biography.message}</p>
                )}
              </div>

              {/* Action Buttons */}
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
              {/* View Mode */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {watch('username')}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400">{watch('email')}</p>
                  {watch('birthDate') && (
                    <p className="text-gray-500 dark:text-gray-400">
                      {new Date(watch('birthDate')).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
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

              {/* Biography Section */}
              {watch('biography') && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Biografía
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">{watch('biography')}</p>
                </div>
              )}

              {/* Portfolio Section */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Portfolio
                  </h3>
                  <button
                    onClick={() => {
                      setEditingPortfolioItem(undefined);
                      setShowPortfolioModal(true);
                    }}
                    className="px-3 py-1 text-sm bg-cultural-escenicas text-white rounded-md hover:bg-cultural-escenicas/90 flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Añadir Trabajo
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {portfolioItems.map((item, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                          {item.title}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {item.description}
                        </p>
                        <div className="mt-4 flex justify-between items-center">
                          {item.link && (
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-cultural-escenicas hover:underline flex items-center gap-1"
                            >
                              <LinkIcon className="h-4 w-4" />
                              Ver más
                            </a>
                          )}
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditPortfolioItem(item)}
                              className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeletePortfolioItem(item)}
                              className="p-1 text-red-500 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Links */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Redes Sociales
                </h3>
                <div className="flex space-x-4">
                  {watch('socialLinks.website') && (
                    <a
                      href={watch('socialLinks.website')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 dark:text-gray-400 hover:text-cultural-escenicas"
                    >
                      <Globe className="h-6 w-6" />
                    </a>
                  )}
                  {watch('socialLinks.instagram') && (
                    <a
                      href={`https://instagram.com/${watch('socialLinks.instagram')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 dark:text-gray-400 hover:text-cultural-escenicas"
                    >
                      <Instagram className="h-6 w-6" />
                    </a>
                  )}
                  {watch('socialLinks.facebook') && (
                    <a
                      href={`https://facebook.com/${watch('socialLinks.facebook')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 dark:text-gray-400 hover:text-cultural-escenicas"
                    >
                      <Facebook className="h-6 w-6" />
                    </a>
                  )}
                  {watch('socialLinks.twitter') && (
                    <a
                      href={`https://twitter.com/${watch('socialLinks.twitter')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 dark:text-gray-400 hover:text-cultural-escenicas"
                    >
                      <Twitter className="h-6 w-6" />
                    </a>
                  )}
                </div>
              </div>

              {/* Statistics */}
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

      <PortfolioModal
        isOpen={showPortfolioModal}
        onClose={() => {
          setShowPortfolioModal(false);
          setEditingPortfolioItem(undefined);
        }}
        onSave={handleAddPortfolioItem}
        initialData={editingPortfolioItem}
      />
    </div>
  );
};
