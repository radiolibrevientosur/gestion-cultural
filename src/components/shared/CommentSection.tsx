import React, { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Send } from 'lucide-react';
import type { Comment } from '../../types/cultural';

interface CommentSectionProps {
  comments: Comment[];
  onAddComment: (text: string, author: string) => void;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  comments,
  onAddComment
}) => {
  const [newComment, setNewComment] = useState('');
  const [author, setAuthor] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !author.trim()) return;

    onAddComment(newComment.trim(), author.trim());
    setNewComment('');
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {comments.map(comment => (
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

      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2">
        <input
          type="text"
          placeholder="Tu nombre"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
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
  );
};