import React, { useState } from 'react';
import { useCultural } from '../../context/CulturalContext';
import { ImageUpload } from '../ui/ImageUpload';
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
  Trash
} from 'lucide-react';
import { PostCard } from './PostCard';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { WorkItem, Achievement } from '../../types/cultural';

export const UserProfile: React.FC = () => {
  const { state, dispatch } = useCultural();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(state.currentUser);
  const [activeTab, setActiveTab] = useState<'posts'|'portfolio'|'gallery'|'achievements'>('posts');
  const [newWork, setNewWork] = useState<Partial<WorkItem>>({});
  const [newAchievement, setNewAchievement] = useState<Partial<Achievement>>({});

  const handleSaveProfile = () => {
    dispatch({
      type: 'UPDATE_USER',
      payload: editedProfile
    });
    setIsEditing(false);
  };

  const handleAddWork = () => {
    if (!newWork.title || !newWork.description) return;

    const work: WorkItem = {
      id: crypto.randomUUID(),
      title: newWork.title,
      description: newWork.description,
      date: new Date(newWork.date || Date.now()),
      category: newWork.category || 'OTROS',
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

  const userPosts = state.posts.filter(post => post.userId === state.currentUser.id);

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
          <ImageUpload
            value={editedProfile.avatar}
            onChange={(image) => setEditedProfile({ ...editedProfile, avatar: image })}
            variant="profile"
            className="relative"
          />
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
              {userPosts.length}
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
              {/* Repeat for other social networks */}
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
              {/* Repeat for other social networks */}
            </div>
          )}
        </div>

        {/* Portfolio Tabs */}
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

          <div className="mt-6">
            {activeTab === 'posts' && (
              <div className="space-y-6">
                {userPosts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))}
                {userPosts.length === 0 && (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                    No hay publicaciones para mostrar
                  </p>
                )}
              </div>
            )}

            {activeTab === 'portfolio' && (
              <div className="space-y-6">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Categoría
                      </label>
                      <select
                        value={editedProfile.portfolio?.category || ''}
                        onChange={(e) => setEditedProfile({
                          ...editedProfile,
                          portfolio: {
                            ...editedProfile.portfolio,
                            category: e.target.value as any
                          }
                        })}
                        className="w-full p-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <option value="">Seleccionar categoría...</option>
                        {/* Add categories */}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Disciplina
                      </label>
                      <input
                        type="text"
                        value={editedProfile.portfolio?.discipline || ''}
                        onChange={(e) => setEditedProfile({
                          ...editedProfile,
                          portfolio: {
                            ...editedProfile.portfolio,
                            discipline: e.target.value
                          }
                        })}
                        className="w-full p-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
                        placeholder="Tu disciplina artística"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Trayectoria
                      </label>
                      <textarea
                        value={editedProfile.portfolio?.trajectory || ''}
                        onChange={(e) => setEditedProfile({
                          ...editedProfile,
                          portfolio: {
                            ...editedProfile.portfolio,
                            trajectory: e.target.value
                          }
                        })}
                        className="w-full p-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
                        rows={6}
                        placeholder="Describe tu trayectoria artística..."
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {state.currentUser.portfolio ? (
                      <>
                        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                            Información Profesional
                          </h3>
                          <div className="space-y-4">
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                              <Award className="h-5 w-5" />
                              <span>Categoría: {state.currentUser.portfolio.category}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                              <Briefcase className="h-5 w-5" />
                              <span>Disciplina: {state.currentUser.portfolio.discipline}</span>
                            </div>
                          </div>
                        </div>
                        <div className="prose dark:prose-invert max-w-none">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                            Trayectoria
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300">
                            {state.currentUser.portfolio.trajectory}
                          </p>
                        </div>
                      </>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                        No hay información de portfolio disponible
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'gallery' && (
              <div className="space-y-6">
                {isEditing && (
                  <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg mb-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Nuevo Trabajo
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Título
                        </label>
                        <input
                          type="text"
                          value={newWork.title || ''}
                          onChange={(e) => setNewWork({ ...newWork, title: e.target.value })}
                          className="w-full p-2 bg-white dark:bg-gray-800 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Descripción
                        </label>
                        <textarea
                          value={newWork.description || ''}
                          onChange={(e) => setNewWork({ ...newWork, description: e.target.value })}
                          className="w-full p-2 bg-white dark:bg-gray-800 rounded-lg"
                          rows={3}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Fecha
                        </label>
                        <input
                          type="date"
                          value={newWork.date ? format(new Date(newWork.date), 'yyyy-MM-dd') : ''}
                          onChange={(e) => setNewWork({ ...newWork, date: new Date(e.target.value) })}
                          className="w-full p-2 bg-white dark:bg-gray-800 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Imagen
                        </label>
                        <ImageUpload
                          value={newWork.image}
                          onChange={(image) => setNewWork({ ...newWork, image })}
                        />
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newWork.isCurrent || false}
                          onChange={(e) => setNewWork({ ...newWork, isCurrent: e.target.checked })}
                          className="mr-2"
                        />
                        <label className="text-sm text-gray-700 dark:text-gray-300">
                          Trabajo Actual
                        </label>
                      </div>
                      <button
                        onClick={handleAddWork}
                        className="w-full bg-cultural-escenicas text-white py-2 rounded-lg hover:bg-cultural-escenicas/90"
                      >
                        Agregar Trabajo
                      </button>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {editedProfile.portfolio?.works.map(work => (
                    <div key={work.id} className="bg-white dark:bg-gray-700 rounded-lg shadow overflow-hidden">
                      {work.image && (
                        <img
                          src={work.image.data}
                          alt={work.title}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {work.title}
                          </h4>
                          {isEditing && (
                            <button
                              onClick={() => handleDeleteWork(work.id)}
                              className="text-red-500 hover:text-red-600"
                            >
                              <Trash className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                          {work.description}
                        </p>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-cultural-escenicas">
                            {work.isCurrent ? 'Trabajo Actual' : 'Trabajo Anterior'}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400">
                            {format(work.date, 'MMM yyyy', { locale: es })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'achievements' && (
              <div className="space-y-6">
                {isEditing && (
                  <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg mb-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Nuevo Logro
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Título
                        </label>
                        <input
                          type="text"
                          value={newAchievement.title || ''}
                          onChange={(e) => setNewAchievement({ ...newAchievement, title: e.target.value })}
                          className="w-full p-2 bg-white dark:bg-gray-800 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Descripción
                        </label>
                        <textarea
                          value={newAchievement.description || ''}
                          onChange={(e) => setNewAchievement({ ...newAchievement, description: e.target.value })}
                          className="w-full p-2 bg-white dark:bg-gray-800 rounded-lg"
                          rows={3}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Institución
                        </label>
                        <input
                          type="text"
                          value={newAchievement.institution || ''}
                          onChange={(e) => setNewAchievement({ ...newAchievement, institution: e.target.value })}
                          className="w-full p-2 bg-white dark:bg-gray-800 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Fecha
                        </label>
                        <input
                          type="date"
                          value={newAchievement.date ? format(new Date(newAchievement.date), 'yyyy-MM-dd') : ''}
                          onChange={(e) => setNewAchievement({ ...newAchievement, date: new Date(e.target.value) })}
                          className="w-full p-2 bg-white dark:bg-gray-800 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Tipo
                        </label>
                        <select
                          value={newAchievement.type || 'award'}
                          onChange={(e) => setNewAchievement({ ...newAchievement, type: e.target.value as any })}
                          className="w-full p-2 bg-white dark:bg-gray-800 rounded-lg"
                        >
                          <option value="award">Premio</option>
                          <option value="recognition">Reconocimiento</option>
                          <option value="certification">Certificación</option>
                        </select>
                      </div>
                      <button
                        onClick={handleAddAchievement}
                        className="w-full bg-cultural-escenicas text-white py-2 rounded-lg hover:bg-cultural-escenicas/90"
                      >
                        Agregar Logro
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-6">
                  {editedProfile.portfolio?.achievements.map(achievement => (
                    <div key={achievement.id} className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                            {achievement.title}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {achievement.institution}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {format(achievement.date, 'MMM yyyy', { locale: es })}
                          </span>
                          {isEditing && (
                            <button
                              onClick={() => handleDeleteAchievement(achievement.id)}
                              className="text-red-500 hover:text-red-600"
                            >
                              <Trash className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="mt-4 text-gray-600 dark:text-gray-300">
                        {achievement.description}
                      </p>
                      <div className="mt-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                          achievement.type === 'award'
                            ? 'bg-yellow-100 text-yellow-800'
                            : achievement.type === 'recognition'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {achievement.type === 'award' ? 'Premio' :
                           achievement.type === 'recognition' ? 'Reconocimiento' :
                           'Certificación'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};