import React, { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Edit, Trash, Share2, Star } from 'lucide-react';
import type { PressArticle } from '../../types/cultural';
import { useCultural } from '../../context/CulturalContext';
import { ShareModal } from './ShareModal';
import { PressArticleForm } from './PressArticleForm';

interface PressArticleCardProps {
  article: PressArticle;
}

export const PressArticleCard: React.FC<PressArticleCardProps> = ({ article }) => {
  const { dispatch } = useCultural();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const toggleFavorite = () => {
    dispatch({
      type: 'UPDATE_PRESS_ARTICLE',
      payload: { ...article, isFavorite: !article.isFavorite }
    });
  };

  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de eliminar este artículo?')) {
      dispatch({
        type: 'DELETE_PRESS_ARTICLE',
        payload: article.id
      });
    }
  };

  if (isEditing) {
    return (
      <PressArticleForm
        article={article}
        onComplete={() => setIsEditing(false)}
      />
    );
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        {article.image?.data && (
          <div className="relative h-48 w-full">
            <img
              src={article.image.data}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {article.title}
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Por {article.author} • {format(article.date, "d 'de' MMMM, yyyy", { locale: es })}
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
                className={`p-2 ${article.isFavorite ? 'text-yellow-500' : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'}`}
              >
                <Star className="h-5 w-5" fill={article.isFavorite ? "currentColor" : "none"} />
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

          <p className="text-gray-600 dark:text-gray-300 font-medium mb-4">
            {article.summary}
          </p>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p className="line-clamp-3">{article.content}</p>
          </div>

          <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
            <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
              {article.category}
            </span>
          </div>
        </div>
      </div>

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title={article.title}
        text={`📰 ${article.title}
✍️ Por ${article.author}
📅 ${format(article.date, "d 'de' MMMM, yyyy", { locale: es })}

${article.summary}

🔗 Leer más: ${window.location.origin}/prensa/${article.id}`}
      />
    </>
  );
};