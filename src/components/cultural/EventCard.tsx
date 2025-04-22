import React, { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, MapPin, Users, Share2, Heart, Edit, Trash } from 'lucide-react';
import type { CulturalEvent } from '../../types/cultural';
import { useCultural } from '../../context/CulturalContext';
import { ShareModal } from './ShareModal';
import { EventoCulturalForm } from './EventoCulturalForm';

interface EventCardProps {
  event: CulturalEvent;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const { dispatch } = useCultural();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const toggleFavorite = () => {
    dispatch({
      type: 'UPDATE_EVENT',
      payload: { ...event, isFavorite: !event.isFavorite }
    });
  };

  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este evento?')) {
      dispatch({
        type: 'DELETE_EVENT',
        payload: event.id
      });
    }
  };

  if (isEditing) {
    return (
      <EventoCulturalForm
        event={event}
        onComplete={() => setIsEditing(false)}
      />
    );
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        {event.image?.data && (
          <div className="relative h-48 w-full">
            <img
              src={event.image.data}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{event.title}</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{event.description}</p>
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
                className={`p-2 ${event.isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'}`}
              >
                <Heart className="h-5 w-5" fill={event.isFavorite ? "currentColor" : "none"} />
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
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{format(event.date, "d 'de' MMMM 'a las' HH:mm", { locale: es })}</span>
            </div>
            
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{event.location}</span>
              {event.locationUrl && (
                <a
                  href={event.locationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-cultural-escenicas hover:underline"
                >
                  Ver mapa
                </a>
              )}
            </div>

            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Users className="h-4 w-4 mr-2" />
              <span>{event.targetAudience}</span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex space-x-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cultural-escenicas/10 text-cultural-escenicas">
                {event.eventType}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cultural-escenicas/10 text-cultural-escenicas">
                {event.discipline}
              </span>
            </div>
          </div>
        </div>
      </div>

      <ShareModal
        event={event}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </>
  );
};