import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCultural } from '../../context/CulturalContext';
import { Image, FileText, Video, Send, X, Mic, Smile, Paperclip } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Post, Media } from '../../types/cultural';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

const postSchema = z.object({
  content: z.string().max(280, 'El contenido no puede exceder los 280 caracteres'),
  author: z.string().min(2, 'El autor es requerido').default('Usuario'),
});

interface QuickPostProps {
  post?: Post;
  onEdit?: () => void;
}

export const QuickPost: React.FC<QuickPostProps> = ({ post, onEdit }) => {
  const { dispatch, state } = useCultural();
  const [media, setMedia] = useState<Media[]>([]);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const attachMenuRef = useRef<HTMLDivElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  const { register, handleSubmit, reset, watch, setValue, getValues } = useForm<{
    content: string;
    author: string;
  }>({
    resolver: zodResolver(postSchema),
    defaultValues: post ? {
      content: post.content,
      author: post.author
    } : {
      author: state.currentUser.name
    }
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (attachMenuRef.current && !attachMenuRef.current.contains(event.target as Node)) {
        setShowAttachMenu(false);
      }
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const onEmojiSelect = (emoji: any) => {
    const currentContent = getValues('content');
    setValue('content', currentContent + emoji.native);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const type = file.type.startsWith('image/') ? 'image' : 
                  file.type.startsWith('video/') ? 'video' : 'document';
      
      setMedia([...media, {
        type,
        url: reader.result as string,
        thumbnail: type === 'image' ? reader.result as string : undefined
      }]);
    };
    reader.readAsDataURL(file);
    setShowAttachMenu(false);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setMedia([...media, {
          type: 'voice',
          url: audioUrl,
          duration: 0
        }]);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('No se pudo acceder al micrófono');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const onSubmit = (data: { content: string; author: string }) => {
    const newPost: Post = {
      id: post?.id || crypto.randomUUID(),
      content: data.content,
      author: state.currentUser.name,
      userId: state.currentUser.id,
      date: new Date(),
      media: media.length > 0 ? media : undefined,
      reactions: post?.reactions || { like: 0, love: 0, celebrate: 0, interesting: 0 },
      comments: post?.comments || [],
      isFavorite: post?.isFavorite || false
    };

    dispatch({
      type: post ? 'UPDATE_POST' : 'ADD_POST',
      payload: newPost
    });

    reset();
    setMedia([]);
    if (onEdit) onEdit();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex items-end gap-2">
          <div className="flex items-center gap-2">
            <div className="relative" ref={attachMenuRef}>
              <button
                type="button"
                onClick={() => setShowAttachMenu(!showAttachMenu)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Paperclip className="h-5 w-5" />
              </button>
              
              {showAttachMenu && (
                <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-700 rounded-lg shadow-lg py-2 min-w-[160px]">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    <Image className="h-4 w-4" />
                    <span>Imagen</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    <Video className="h-4 w-4" />
                    <span>Video</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Documento</span>
                  </button>
                </div>
              )}
            </div>

            <div className="relative" ref={emojiPickerRef}>
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Smile className="h-5 w-5" />
              </button>
              
              {showEmojiPicker && (
                <div className="absolute bottom-full left-0 mb-2 z-50">
                  <Picker data={data} onEmojiSelect={onEmojiSelect} />
                </div>
              )}
            </div>

            <button
              type="button"
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onMouseLeave={stopRecording}
              className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                isRecording ? 'text-red-500' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              <Mic className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1">
            <textarea
              {...register('content')}
              placeholder="¿Qué está pasando en la escena cultural?"
              className="w-full p-3 border rounded-lg resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white min-h-[60px]"
              rows={1}
            />
          </div>
          <button
            type="submit"
            className="p-2 bg-cultural-escenicas text-white rounded-full hover:bg-cultural-escenicas/90 transition-colors disabled:opacity-50"
            disabled={!watch('content')}
          >
            <Send className="h-5 w-5" />
          </button>
        </div>

        {media.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {media.map((item, index) => (
              <div key={index} className="relative">
                {item.type === 'image' && (
                  <img src={item.url} alt="" className="w-full h-32 object-cover rounded" />
                )}
                {item.type === 'video' && (
                  <video src={item.url} className="w-full h-32 object-cover rounded" />
                )}
                {item.type === 'document' && (
                  <div className="w-full h-32 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                    <FileText className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                {item.type === 'voice' && (
                  <div className="w-full h-32 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                    <audio src={item.url} controls className="w-full" />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setMedia(media.filter((_, i) => i !== index))}
                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*,application/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </form>
    </div>
  );
};