import React, { useState } from 'react';
import { useCultural } from '../../context/CulturalContext';
import { ImageUpload } from '../ui/ImageUpload';
import { Feed } from './Feed';
import { 
  User, 
  Settings, 
  Link as LinkIcon, 
  Edit, 
  Award,
  Users,
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  Linkedin,
  Globe,
  Calendar,
  Briefcase,
  Plus,
  Trash,
  Image
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { WorkItem, Achievement, Category } from '../../types/cultural';

const CATEGORIES: Category[] = [
  "CINE Y MEDIOS AUDIOVISUALES",
  "ARTES VISUALES",
  "ARTES ESCÉNICAS Y MUSICALES",
  "PROMOCIÓN DEL LIBRO Y LA LECTURA",
  "PATRIMONIO CULTURAL",
  "ECONOMÍA CULTURAL",
  "OTROS"
];

export const UserProfile: React.FC = () => {
  const { state, dispatch } = useCultural();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(state.currentUser);
  const [activeTab, setActiveTab] = useState<'posts'|'portfolio'|'gallery'|'achievements'>('posts');
  const [newWork, setNewWork] = useState<Partial<WorkItem>>({});
  const [newAchievement, setNewAchievement] = useState<Partial<Achievement>>({});
  const [newGalleryItem, setNewGalleryItem] = useState<{ image?: { data: string; type: string }; title: string; description: string }>({
    title: '',
    description: ''
  });

  const handleSaveProfile = () => {
    dispatch({
      type: 'UPDATE_USER',
      payload: editedProfile
    });
    setIsEditing(false);
  };

  const handleAddWork = () => {
    if (!newWork.title || !newWork.description || !newWork.category) return;

    const work: WorkItem = {
      id: crypto.randomUUID(),
      title: newWork.title,
      description: newWork.description,
      date: new Date(newWork.date || Date.now()),
      category: newWork.category,
      image: newWork.image,
      url: newWork.url,
      isCurrent: newWork.isCurrent || false
    };

    setEditedProfile({
      ...editedProfile,
      portfolio: {
        ...editedProfile.portfolio!,
        works: [...(editedProfile.portfolio?.works || []), work]
      }
    });

    setNewWork({});
  };

  const handleAddAchievement = () => {
    if (!newAchievement.title || !newAchievement.description || !newAchievement.institution) return;

    const achievement: Achievement = {
      id: crypto.randomUUID(),
      title: newAchievement.title,
      description: newAchievement.description,
      date: new Date(newAchievement.date || Date.now()),
      institution: newAchievement.institution,
      type: newAchievement.type || 'award'
    };

    setEditedProfile({
      ...editedProfile,
      portfolio: {
        ...editedProfile.portfolio!,
        achievements: [...(editedProfile.portfolio?.achievements || []), achievement]
      }
    });

    setNewAchievement({});
  };

  const handleAddGalleryItem = () => {
    if (!newGalleryItem.image || !newGalleryItem.title) return;

    const galleryItem = {
      id: crypto.randomUUID(),
      ...newGalleryItem,
      date: new Date()
    };

    setEditedProfile({
      ...editedProfile,
      portfolio: {
        ...editedProfile.portfolio!,
        gallery: [...(editedProfile.portfolio?.gallery || []), galleryItem]
      }
    });

    setNewGalleryItem({ title: '', description: '' });
  };

  const handleDeleteWork = (workId: string) => {
    setEditedProfile({
      ...editedProfile,
      portfolio: {
        ...editedProfile.portfolio!,
        works: editedProfile.portfolio!.works.filter(w => w.id !== workId)
      }
    });
  };

  const handleDeleteAchievement = (achievementId: string) => {
    setEditedProfile({
      ...editedProfile,
      portfolio: {
        ...editedProfile.portfolio!,
        achievements: editedProfile.portfolio!.achievements.filter(a => a.id !== achievementId)
      }
    });
  };

  const handleDeleteGalleryItem = (itemId: string) => {
    setEditedProfile({
      ...editedProfile,
      portfolio: {
        ...editedProfile.portfolio!,
        gallery: editedProfile.portfolio!.gallery.filter(item => item.id !== itemId)
      }
    });
  };

  const renderPortfolioTab = () => (
    <div className="space-y-8">
      {isEditing ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Nuevo Trabajo
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Título"
              value={newWork.title || ''}
              onChange={(e) => setNewWork({ ...newWork, title: e.target.value })}
              className="p-2 border rounded-lg dark:bg-gray-700"
            />
            <select
              value={newWork.category || ''}
              onChange={(e) => setNewWork({ ...newWork, category: e.target.value as Category })}
              className="p-2 border rounded-lg dark:bg-gray-700"
            >
              <option value="">Seleccionar categoría...</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <textarea
              placeholder="Descripción"
              value={newWork.description || ''}
              onChange={(e) => setNewWork({ ...newWork, description: e.target.value })}
              className="p-2 border rounded-lg dark:bg-gray-700"
            />
            <input
              type="url"
              placeholder="URL (opcional)"
              value={newWork.url || ''}
              onChange={(e) => setNewWork({ ...newWork, url: e.target.value })}
              className="p-2 border rounded-lg dark:bg-gray-700"
            />
            <div className="col-span-2">
              <ImageUpload
                value={newWork.image}
                onChange={(image) => setNewWork({ ...newWork, image })}
              />
            </div>
            <button
              onClick={handleAddWork}
              className="col-span-2 bg-cultural-escenicas text-white p-2 rounded-lg"
            >
              Agregar Trabajo
            </button>
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {editedProfile.portfolio?.works.map(work => (
          <div key={work.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            {work.image && (
              <img src={work.image.data} alt={work.title} className="w-full h-48 object-cover" />
            )}
            <div className="p-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{work.title}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">{work.description}</p>
              {isEditing && (
                <button
                  onClick={() => handleDeleteWork(work.id)}
                  className="mt-2 text-red-500 hover:text-red-700"
                >
                  <Trash className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderGalleryTab = () => (
    <div className="space-y-8">
      {isEditing && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Nueva Imagen
          </h3>
          <div className="space-y-4">
            <ImageUpload
              value={newGalleryItem.image}
              onChange={(image) => setNewGalleryItem({ ...newGalleryItem, image })}
            />
            <input
              type="text"
              placeholder="Título"
              value={newGalleryItem.title}
              onChange={(e) => setNewGalleryItem({ ...newGalleryItem, title: e.target.value })}
              className="w-full p-2 border rounded-lg dark:bg-gray-700"
            />
            <textarea
              placeholder="Descripción"
              value={newGalleryItem.description}
              onChange={(e) => setNewGalleryItem({ ...newGalleryItem, description: e.target.value })}
              className="w-full p-2 border rounded-lg dark:bg-gray-700"
            />
            <button
              onClick={handleAddGalleryItem}
              className="w-full bg-cultural-escenicas text-white p-2 rounded-lg"
            >
              Agregar a Galería
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {editedProfile.portfolio?.gallery?.map(item => (
          <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <img src={item.image.data} alt={item.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{item.title}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
              {isEditing && (
                <button
                  onClick={() => handleDeleteGalleryItem(item.id)}
                  className="mt-2 text-red-500 hover:text-red-700"
                >
                  <Trash className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAchievementsTab = () => (
    <div className="space-y-8">
      {isEditing && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Nuevo Logro
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Título"
              value={newAchievement.title || ''}
              onChange={(e) => setNewAchievement({ ...newAchievement, title: e.target.value })}
              className="p-2 border rounded-lg dark:bg-gray-700"
            />
            <input
              type="text"
              placeholder="Institución"
              value={newAchievement.institution || ''}
              onChange={(e) => setNewAchievement({ ...newAchievement, institution: e.target.value })}
              className="p-2 border rounded-lg dark:bg-gray-700"
            />
            <select
              value={newAchievement.type || 'award'}
              onChange={(e) => setNewAchievement({ ...newAchievement, type: e.target.value as Achievement['type'] })}
              className="p-2 border rounded-lg dark:bg-gray-700"
            >
              <option value="award">Premio</option>
              <option value="recognition">Reconocimiento</option>
              <option value="certification">Certificación</option>
            </select>
            <input
              type="date"
              value={newAchievement.date?.toISOString().split('T')[0] || ''}
              onChange={(e) => setNewAchievement({ ...newAchievement, date: new Date(e.target.value) })}
              className="p-2 border rounded-lg dark:bg-gray-700"
            />
            <textarea
              placeholder="Descripción"
              value={newAchievement.description || ''}
              onChange={(e) => setNewAchievement({ ...newAchievement, description: e.target.value })}
              className="col-span-2 p-2 border rounded-lg dark:bg-gray-700"
            />
            <button
              onClick={handleAddAchievement}
              className="col-span-2 bg-cultural-escenicas text-white p-2 rounded-lg"
            >
              Agregar Logro
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {editedProfile.portfolio?.achievements.map(achievement => (
          <div key={achievement.id} className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {achievement.title}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {achievement.institution} • {format(achievement.date, 'd MMM yyyy', { locale: es })}
                </p>
                <p className="mt-2 text-gray-700 dark:text-gray-300">
                  {achievement.description}
                </p>
              </div>
              {isEditing && (
                <button
                  onClick={() => handleDeleteAchievement(achievement.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      {/* Cover Image */}
      <div className="h-48 bg-gradient-to-r from-cultural-escenicas to-cultural-visuales relative">
        {isEditing && (
          <div className="absolute inset-0 flex items-center justify-center">
            <ImageUpload
              value={editedProfile.coverImage}
              onChange={(image) => setEditedProfile({ ...editedProfile, coverImage: image })}
              className="w-full h-full"
            />
          </div>
        )}
      </div>

      {/* Profile Header */}
      <div className="relative px-6 py-4">
        <div className="flex items-end -mt-16">
          <div className="relative">
            <ImageUpload
              value={editedProfile.avatar}
              onChange={(image) => setEditedProfile({ ...editedProfile, avatar: image })}
              variant="profile"
              className="w-32 h-32"
            />
          </div>
          <div className="ml-4 flex-1">
            <div className="flex items-center justify-between">
              <div>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.name}
                    onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                    className="text-2xl font-bold bg-transparent border-b border-gray-300 dark:border-gray-600"
                  />
                ) : (
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {state.currentUser.name}
                  </h1>
                )}
                <p className="text-gray-600 dark:text-gray-400">@{state.currentUser.username}</p>
              </div>
              <div className="flex space-x-4">
                {isEditing ? (
                  <button
                    onClick={handleSaveProfile}
                    className="px-4 py-2 bg-cultural-escenicas text-white rounded-lg hover:bg-cultural-escenicas/90"
                  >
                    Guardar
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-center space-x-8 mt-6 border-t border-b border-gray-200 dark:border-gray-700 py-4">
          <div className="text-center">
            <span className="block text-2xl font-bold text-gray-900 dark:text-white">
              {state.posts.filter(post => post.userId === state.currentUser.id).length}
            </span>
            <span className="text-gray-600 dark:text-gray-400">Publicaciones</span>
          </div>
          <div className="text-center">
            <span className="block text-2xl font-bold text-gray-900 dark:text-white">
              {state.currentUser.followers.length}
            </span>
            <span className="text-gray-600 dark:text-gray-400">Seguidores</span>
          </div>
          <div className="text-center">
            <span className="block text-2xl font-bold text-gray-900 dark:text-white">
              {state.currentUser.following.length}
            </span>
            <span className="text-gray-600 dark:text-gray-400">Siguiendo</span>
          </div>
        </div>

        {/* Bio */}
        <div className="mt-6">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Biografía Corta
                </label>
                <textarea
                  value={editedProfile.bio}
                  onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                  className="w-full p-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  rows={2}
                  placeholder="Breve descripción..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Biografía Extendida
                </label>
                <textarea
                  value={editedProfile.extendedBio}
                  onChange={(e) => setEditedProfile({ ...editedProfile, extendedBio: e.target.value })}
                  className="w-full p-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  rows={6}
                  placeholder="Tu historia completa..."
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                {state.currentUser.bio || 'No hay biografía disponible'}
              </p>
              {state.currentUser.extendedBio && (
                <div className="mt-4 text-gray-600 dark:text-gray-400">
                  {state.currentUser.extendedBio}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Social Links */}
        <div className="mt-6">
          {isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Instagram
                </label>
                <input
                  type="text"
                  value={editedProfile.socialLinks?.instagram || ''}
                  onChange={(e) => setEditedProfile({
                    ...editedProfile,
                    socialLinks: {
                      ...editedProfile.socialLinks,
                      instagram: e.target.value
                    }
                  })}
                  className="w-full p-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  placeholder="@usuario"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Twitter
                </label>
                <input
                  type="text"
                  value={editedProfile.socialLinks?.twitter || ''}
                  onChange={(e) => setEditedProfile({
                    ...editedProfile,
                    socialLinks: {
                      ...editedProfile.socialLinks,
                      twitter: e.target.value
                    }
                  })}
                  className="w-full p-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  placeholder="@usuario"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Facebook
                </label>
                <input
                  type="text"
                  value={editedProfile.socialLinks?.facebook || ''}
                  onChange={(e) => setEditedProfile({
                    ...editedProfile,
                    socialLinks: {
                      ...editedProfile.socialLinks,
                      facebook: e.target.value
                    }
                  })}
                  className="w-full p-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  placeholder="facebook.com/usuario"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Website
                </label>
                <input
                  type="text"
                  value={editedProfile.socialLinks?.website || ''}
                  onChange={(e) => setEditedProfile({
                    ...editedProfile,
                    socialLinks: {
                      ...editedProfile.socialLinks,
                      website: e.target.value
                    }
                  })}
                  className="w-full p-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  placeholder="https://..."
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-4">
              {state.currentUser.socialLinks?.instagram && (
                <a
                  href={`https://instagram.com/${state.currentUser.socialLinks.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-pink-600 hover:text-pink-700"
                >
                  <Instagram className="h-5 w-5" />
                  <span>{state.currentUser.socialLinks.instagram}</span>
                </a>
              )}
              {state.currentUser.socialLinks?.twitter && (
                <a
                  href={`https://twitter.com/${state.currentUser.socialLinks.twitter.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-400 hover:text-blue-500"
                >
                  <Twitter className="h-5 w-5" />
                  <span>{state.currentUser.socialLinks.twitter}</span>
                </a>
              )}
              {state.currentUser.socialLinks?.facebook && (
                <a
                  href={state.currentUser.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                >
                  <Facebook className="h-5 w-5" />
                  <span>{state.currentUser.socialLinks.facebook}</span>
                </a>
              )}
              {state.currentUser.socialLinks?.website && (
                <a
                  href={state.currentUser.socialLinks.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-700"
                >
                  <Globe className="h-5 w-5" />
                  <span>{state.currentUser.socialLinks.website}</span>
                </a>
              )}
            </div>
          )}
        </div>

        {/* Tabs Navigation */}
        <div className="mt-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('posts')}
                className={`px-1 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'posts'
                    ? 'border-cultural-escenicas text-cultural-escenicas'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Publicaciones
              </button>
              <button
                onClick={() => setActiveTab('portfolio')}
                className={`px-1 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'portfolio'
                    ? 'border-cultural-escenicas text-cultural-escenicas'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Portfolio
              </button>
              <button
                onClick={() => setActiveTab('gallery')}
                className={`px-1 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'gallery'
                    ? 'border-cultural-escenicas text-cultural-escenicas'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Galería
              </button>
              <button
                onClick={() => setActiveTab('achievements')}
                className={`px-1 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'achievements'
                    ? 'border-cultural-escenicas text-cultural-escenicas'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Logros
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="mt-6">
            {activeTab === 'posts' && (
              <Feed userId={state.currentUser.id} />
            )}

            {activeTab === 'portfolio' && renderPortfolioTab()}
            {activeTab === 'gallery' && renderGalleryTab()}
            {activeTab === 'achievements' && renderAchievementsTab()}
          </div>
        </div>
      </div>
    </div>
  );
};