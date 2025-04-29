import React, { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Share2, 
  Heart, 
  Edit, 
  Trash, 
  MessageCircle, 
  ThumbsUp, 
  Zap, 
  PartyPopper, 
  Send, 
  Star
} from 'lucide-react';
import type { CulturalEvent, ReactionType, Comment } from '../../types/cultural';
import { useCultural } from '../../context/CulturalContext';
import { ShareModal } from './ShareModal';
import { EventoCulturalForm } from './EventoCulturalForm';

interface EventCardProps {
  event: CulturalEvent;
  onEdit?: (event: CulturalEvent) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onEdit }) => {
  const { dispatch } = useCultural();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');

  const toggleFavorite = () => {
    dispatch({
      type: 'UPDATE_EVENT',
      payload: { ...event, isFavorite: !event.isFavorite }
    });
  };

  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de eliminar este evento?')) {
      dispatch({
        type: 'DELETE_EVENT',
        payload: event.id
      });
    }
  };

  const handleReaction = (reactionType: ReactionType) => {
    dispatch({
      type: 'ADD_REACTION',
      payload: { eventId: event.id, reactionType }
    });
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !commentAuthor.trim()) return;

    const comment: Comment = {
      id: crypto.randomUUID(),
      eventId: event.id,
      author: commentAuthor,
      text: newComment,
      date: new Date()
    };

    dispatch({
      type: 'ADD_COMMENT',
      payload: { eventId: event.id, comment }
    });

    setNewComment('');
    setCommentAuthor('');
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
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
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
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {event.title}
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {event.description}
              </p>
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
                <Star className="h-5 w-5" fill={event.isFavorite ? "currentColor" : "none"} />
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

          <div className="space-y-2 mb-6">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Calendar className="h-4 w-4 mr-2" />
              <span>
                {format(event.date, "d 'de' MMMM 'a las' HH:mm", { locale: es })}
              </span>
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

          <div className="border-t dark:border-gray-700 pt-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex gap-4">
                <button 
                  onClick={() => handleReaction('like')}
                  className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-blue-500"
                >
                  <ThumbsUp className="h-5 w-5" />
                  <span className="text-sm">{event.reactions.like}</span>
                </button>
                <button
                  onClick={() => handleReaction('love')}
                  className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-red-500"
                >
                  <Heart className="h-5 w-5" />
                  <span className="text-sm">{event.reactions.love}</span>
                </button>
                <button
                  onClick={() => handleReaction('celebrate')}
                  className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-yellow-500"
                >
                  <PartyPopper className="h-5 w-5" />
                  <span className="text-sm">{event.reactions.celebrate}</span>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <MessageCircle className="h-5 w-5" />
                <span>Comentarios ({event.comments.length})</span>
              </div>

             <div className="space-y-3">
    {event.comments.map(comment => (
      <div key={comment.id} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
            {comment.author}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {format(comment.date, "d MMM HH:mm", { locale: es })}
          </span>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          {comment.text}
        </p>
      </div>
    ))}
  </div>

  {/* Formulario de Comentarios Modificado */}
  <form onSubmit={handleAddComment} className="flex flex-col md:flex-row gap-2">
    <input
      type="text"
      placeholder="Tu nombre"
      value={commentAuthor}
      onChange={(e) => setCommentAuthor(e.target.value)}
      className="w-full md:w-32 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-sm flex-none"
      required
    />
    
    <input
      type="text"
      placeholder="Escribe un comentario..."
      value={newComment}
      onChange={(e) => setNewComment(e.target.value)}
      className="w-full flex-1 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-sm"
      required
    />
    
    <button
      type="submit"
      className="p-2 bg-cultural-escenicas text-white rounded-lg hover:bg-cultural-escenicas/90 self-stretch md:self-auto"
    >
      <Send className="h-5 w-5 mx-auto" />
    </button>
  </form>
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