import React, { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Cake, Mail, Phone, Award, Heart, Share2, Edit, Trash } from 'lucide-react';
import type { ArtistBirthday } from '../../types/cultural';
import { useCultural } from '../../context/CulturalContext';
import { ShareModal } from './ShareModal';
import { BirthdayForm } from './BirthdayForm';

interface BirthdayCardProps {
  birthday: ArtistBirthday;
}

export const BirthdayCulturalCard: React.FC<BirthdayCardProps> = ({ birthday }) => {
  const { dispatch } = useCultural();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth();
  };

  const toggleFavorite = () => {
    dispatch({
      type: 'UPDATE_BIRTHDAY',
      payload: { ...birthday, isFavorite: !birthday.isFavorite }
    });
  };

  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este cumpleaños?')) {
      dispatch({
        type: 'DELETE_BIRTHDAY',
        payload: birthday.id
      });
    }
  };

  if (isEditing) {
    return (
      <BirthdayForm
        birthday={birthday}
        onComplete={() => setIsEditing(false)}
      />
    );
  }

  return (
    <>
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden ${
        isToday(birthday.birthDate) ? 'ring-2 ring-cultural-visuales' : ''
      }`}>
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{birthday.name}</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{birthday.role}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsShareModalOpen(true)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
              >
                <Share2 className="h-5 w-5" />
              </button>
              <button
                onClick={toggleFavorite}
                className={`p-2 ${birthday.isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'}`}
              >
                <Heart className="h-5 w-5" fill={birthday.isFavorite ? "currentColor" : "none"} />
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
              >
                <Edit className="h-5 w-5" />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
              >
                <Trash className="h-5 w-5" />
              </button>
              <Cake className={`h-6 w-6 ${
                isToday(birthday.birthDate) ? 'text-cultural-visuales' : 'text-gray-400 dark:text-gray-500'
              }`} />
            </div>
          </div>

          {birthday.image && (
            <div className="mt-4">
              <img
                src={birthday.image.data}
                alt={birthday.name}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          )}

          <div className="mt-4">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Award className="h-4 w-4 mr-2" />
              <span>{birthday.discipline}</span>
            </div>
            
            <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Mail className="h-4 w-4 mr-2" />
              <a href={`mailto:${birthday.contactInfo.email}`} className="hover:text-cultural-visuales">
                {birthday.contactInfo.email}
              </a>
            </div>
            
            <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Phone className="h-4 w-4 mr-2" />
              <a href={`tel:${birthday.contactInfo.phone}`} className="hover:text-cultural-visuales">
                {birthday.contactInfo.phone}
              </a>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">Trayectoria</h4>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-3">{birthday.trajectory}</p>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Cumpleaños: {format(birthday.birthDate, "d 'de' MMMM", { locale: es })}
            </p>
          </div>
        </div>
      </div>

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title={`¡Feliz Cumpleaños ${birthday.name}!`}
        text={`🎂 ${birthday.name}
📅 ${format(birthday.birthDate, "d 'de' MMMM", { locale: es })}
🎭 ${birthday.role} - ${birthday.discipline}
        
¡Celebremos juntos este día especial!`}
      />
    </>
  );
};