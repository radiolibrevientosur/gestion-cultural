import React, { useState } from 'react';
import { useCultural } from '../../context/CulturalContext';
import { 
  Heart, MessageCircle, Share2, Send, Link as LinkIcon,
  Image, Video, FileText, ThumbsUp, PartyPopper, Zap, Sparkles,
  Mic, Play, Pause
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Post, Comment, ReactionType } from '../../types/cultural';

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { dispatch } = useCultural();
  const [newComment, setNewComment] = useState('');
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);

  const handleAddReaction = (reactionType: ReactionType) => {
    dispatch({
      type: 'ADD_POST_REACTION',
      payload: { postId: post.id, reactionType }
    });
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: crypto.randomUUID(),
      postId: post.id,
      author: 'Usuario',
      text: newComment,
      date: new Date()
    };

    dispatch({
      type: 'ADD_POST_COMMENT',
      payload: { postId: post.id, comment }
    });

    setNewComment('');
  };

  const toggleAudioPlay = (audioUrl: string) => {
    if (playingAudio === audioUrl) {
      const audioElement = document.querySelector(`audio[src="${audioUrl}"]`) as HTMLAudioElement;
      if (audioElement) {
        audioElement.pause();
        setPlayingAudio(null);
      }
    } else {
      if (playingAudio) {
        const previousAudio = document.querySelector(`audio[src="${playingAudio}"]`) as HTMLAudioElement;
        if (previousAudio) {
          previousAudio.pause();
        }
      }
      const audioElement = document.querySelector(`audio[src="${audioUrl}"]`) as HTMLAudioElement;
      if (audioElement) {
        audioElement.play();
        setPlayingAudio(audioUrl);
      }
    }
  };

  const handleAudioEnded = (audioUrl: string) => {
    if (playingAudio === audioUrl) {
      setPlayingAudio(null);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-4 mb-4">
      {/* Cabecera del post */}
      <div className="flex items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold dark:text-white">{post.author}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              @{post.author.toLowerCase().replace(/\s/g, '')}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              · {format(post.date, "d MMM", { locale: es })}
            </span>
          </div>
          <p className="text-gray-800 dark:text-gray-200">{post.content}</p>
        </div>
      </div>

      {/* Media */}
      {post.media?.map((item, index) => (
        <div key={`media-${index}-${item.url}`} className="grid grid-cols-1 gap-2 my-4">
          <div className="relative rounded-xl overflow-hidden">
            {item.type === 'image' && (
              <img src={item.url} alt="" className="w-full h-48 object-cover" loading="lazy" />
            )}
            {item.type === 'video' && (
              <video src={item.url} className="w-full h-48 object-cover" controls preload="metadata" />
            )}
            {item.type === 'document' && (
              <div className="w-full h-48 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <FileText className="h-12 w-12 text-gray-400" />
              </div>
            )}
            {item.type === 'voice' && (
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg flex items-center gap-4">
                <button
                  onClick={() => toggleAudioPlay(item.url)}
                  className="p-3 bg-cultural-escenicas text-white rounded-full hover:bg-cultural-escenicas/90 transition-colors"
                >
                  {playingAudio === item.url ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5" />
                  )}
                </button>
                <div className="flex-1">
                  <audio
                    src={item.url}
                    onEnded={() => handleAudioEnded(item.url)}
                    className="hidden"
                  />
                  <div className="flex items-center gap-2">
                    <Mic className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Nota de voz
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Acciones */}
      <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 mt-4 pt-3 border-t dark:border-gray-700">
        <div className="flex space-x-6">
          {Object.entries(post.reactions).map(([reactionType, count]) => (
            <button
              key={reactionType}
              onClick={() => handleAddReaction(reactionType as ReactionType)}
              className={`flex items-center gap-1 hover:text-${
                reactionType === 'like' ? 'blue' :
                reactionType === 'love' ? 'red' :
                reactionType === 'celebrate' ? 'yellow' : 'green'
              }-500`}
            >
              {reactionType === 'like' && <ThumbsUp className="h-5 w-5" />}
              {reactionType === 'love' && <Heart className="h-5 w-5" />}
              {reactionType === 'celebrate' && <PartyPopper className="h-5 w-5" />}
              {reactionType === 'interesting' && <Sparkles className="h-5 w-5" />}
              <span>{count}</span>
            </button>
          ))}
        </div>
        
        <button className="flex items-center gap-1">
          <Share2 className="h-5 w-5" />
        </button>
      </div>

      {/* Comentarios */}
      {(post.comments?.length ?? 0) > 0 && (
        <div className="mt-4 space-y-4">
          {post.comments.map((comment) => (
            <div key={comment.id} className="flex items-start gap-3">
              <div className="flex-1 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium dark:text-white">{comment.author}</span>
                  <span className="text-gray-500">
                    {format(comment.date, "HH:mm", { locale: es })}
                  </span>
                </div>
                <p className="text-gray-800 dark:text-gray-300 text-sm">{comment.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Input para comentar */}
      <div className="mt-4 flex gap-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Añadir un comentario..."
          className="flex-1 p-2 text-sm border rounded-full bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
        />
        <button
          onClick={handleAddComment}
          className="p-2 bg-cultural-escenicas text-white rounded-full hover:bg-cultural-escenicas/90"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};