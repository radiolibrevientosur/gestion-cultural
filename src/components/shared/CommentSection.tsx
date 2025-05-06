import React, { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Send, Reply, AtSign, Hash } from 'lucide-react';
import type { Comment } from '../../types/cultural';
import { useCultural } from '../../context/CulturalContext';

interface CommentSectionProps {
  comments: Comment[];
  onAddComment: (text: string, author: string, parentId?: string) => void;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  comments,
  onAddComment
}) => {
  const [newComment, setNewComment] = useState('');
  const [author, setAuthor] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [mentionSuggestions, setMentionSuggestions] = useState<string[]>([]);
  const { state } = useCultural();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !author.trim()) return;

    onAddComment(newComment.trim(), author.trim(), replyingTo || undefined);
    setNewComment('');
    setReplyingTo(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewComment(value);

    // Handle @mentions
    const mentionMatch = value.match(/@(\w*)$/);
    if (mentionMatch) {
      const searchTerm = mentionMatch[1].toLowerCase();
      const suggestions = state.users
        .filter(user => user.username.toLowerCase().includes(searchTerm))
        .map(user => user.username);
      setMentionSuggestions(suggestions);
    } else {
      setMentionSuggestions([]);
    }
  };

  const insertMention = (username: string) => {
    const beforeMention = newComment.split('@').slice(0, -1).join('@');
    setNewComment(`${beforeMention}@${username} `);
    setMentionSuggestions([]);
  };

  const renderComment = (comment: Comment, level = 0) => (
    <div 
      key={comment.id} 
      className={`bg-gray-50 dark:bg-gray-700 p-3 rounded-lg ${
        level > 0 ? 'ml-8 mt-2' : 'mt-3'
      }`}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
          {comment.author}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {format(comment.date, "d MMM HH:mm", { locale: es })}
        </span>
      </div>
      <p className="text-gray-600 dark:text-gray-300 text-sm">
        {comment.text.split(' ').map((word, i) => {
          if (word.startsWith('@')) {
            return (
              <span key={i} className="text-cultural-escenicas">
                {word}{' '}
              </span>
            );
          }
          if (word.startsWith('#')) {
            return (
              <span key={i} className="text-cultural-visuales">
                {word}{' '}
              </span>
            );
          }
          return word + ' ';
        })}
      </p>
      <div className="mt-2 flex items-center gap-2">
        <button
          onClick={() => setReplyingTo(comment.id)}
          className="text-sm text-gray-500 hover:text-cultural-escenicas flex items-center gap-1"
        >
          <Reply className="h-4 w-4" />
          Responder
        </button>
      </div>
      {comment.replies?.map(reply => renderComment(reply, level + 1))}
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {comments.filter(c => !c.parentId).map(comment => renderComment(comment))}
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
        
        <div className="relative flex-1">
          <input
            type="text"
            placeholder={replyingTo ? "Escribe una respuesta..." : "Escribe un comentario..."}
            value={newComment}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-sm"
            required
          />
          
          {mentionSuggestions.length > 0 && (
            <div className="absolute bottom-full left-0 mb-1 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700">
              {mentionSuggestions.map(username => (
                <button
                  key={username}
                  onClick={() => insertMention(username)}
                  className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                >
                  @{username}
                </button>
              ))}
            </div>
          )}

          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2 text-gray-400">
            <AtSign className="h-4 w-4" />
            <Hash className="h-4 w-4" />
          </div>
        </div>
        
        <button
          type="submit"
          className="p-2 bg-cultural-escenicas text-white rounded-lg hover:bg-cultural-escenicas/90 self-stretch md:self-auto"
        >
          <Send className="h-5 w-5 mx-auto" />
        </button>
      </form>

      {replyingTo && (
        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
          <Reply className="h-4 w-4" />
          Respondiendo a un comentario
          <button
            onClick={() => setReplyingTo(null)}
            className="text-cultural-escenicas hover:text-cultural-escenicas/80"
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
};