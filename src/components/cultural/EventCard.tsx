import React, { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, MapPin, Users, Share2, Heart, Edit, Trash } from 'lucide-react';
import type { CulturalEvent } from '../../types/cultural';
import { useCultural } from '../../context/CulturalContext';
import { ShareModal } from './ShareModal';

interface EventCardProps {
  event: CulturalEvent;
  onEdit: (event: CulturalEvent) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onEdit }) => {
  const { dispatch } = useCultural();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

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

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {event.imageBase64 && (
          <div className="relative h-48 w-full">
            <img
              src={event.imageBase64}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
              <p className="mt-1 text-sm text-gray-500">{event.description}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsShareModalOpen(true)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <Share2 className="h-5 w-5" />
              </button>
              <button
                onClick={toggleFavorite}
                className={`p-2 ${event.isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Heart className="h-5 w-5" fill={event.isFavorite ? "currentColor" : "none"} />
              </button>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{format(event.date, "d 'de' MMMM 'a las' HH:mm", { locale: es })}</span>
            </div>
            
            <div className="flex items-center text-sm text-gray-500">
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

            <div className="flex items-center text-sm text-gray-500">
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
            
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(event)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <Edit className="h-5 w-5" />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <Trash className="h-5 w-5" />
              </button>
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
