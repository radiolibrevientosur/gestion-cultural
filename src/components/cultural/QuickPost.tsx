import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCultural } from '../../context/CulturalContext';
import { ImageUpload } from '../ui/ImageUpload';
import { Image, FileText, Video, Send, X, Mic, Smile, Sticker, Square } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Post, Comment, Media } from '../../types/cultural';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

const postSchema = z.object({
  content: z.string().max(280, 'El contenido no puede exceder los 280 caracteres'),
  author: z.string().min(2, 'El autor es requerido'),
});

interface LinkPreview {
  url: string;
  title?: string;
  description?: string;
  image?: string;
}

interface QuickPostProps {
  post?: Post;
  onEdit?: () => void;
}

export const QuickPost: React.FC<QuickPostProps> = ({ post, onEdit }) => {
  const { dispatch } = useCultural();
  const [media, setMedia] = useState<Media[]>([]);
  const [linkPreviews, setLinkPreviews] = useState<LinkPreview[]>([]);
  const [isFetchingPreviews, setIsFetchingPreviews] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const { register, handleSubmit, reset, watch, setValue, getValues } = useForm<{
    content: string;
    author: string;
  }>({
    resolver: zodResolver(postSchema),
    defaultValues: post ? {
      content: post.content,
      author: post.author
    } : undefined
  });

  const content = watch('content', '');

  // Handle emoji selection
  const onEmojiSelect = (emoji: any) => {
    const currentContent = getValues('content');
    setValue('content', currentContent + emoji.native);
    setShowEmojiPicker(false);
  };

  // Handle sticker selection
  const onStickerSelect = (sticker: string) => {
    setMedia([...media, {
      type: 'sticker',
      url: sticker
    }]);
    setShowStickerPicker(false);
  };

  // Handle voice recording
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
          duration: 0 // You would calculate this from the actual recording
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

  // Detect URLs and fetch previews
  useEffect(() => {
    const extractUrls = (text: string): string[] => {
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      return text.match(urlRegex) || [];
    };

    const fetchPreview = async (url: string): Promise<LinkPreview> => {
      try {
        const response = await fetch(`/api/link-preview?url=${encodeURIComponent(url)}`);
        const data = await response.json();
        return { url, ...data };
      } catch (error) {
        return { url };
      }
    };

    const getLinkPreviews = async () => {
      const urls = extractUrls(content);
      if (urls.length === 0) return setLinkPreviews([]);

      setIsFetchingPreviews(true);
      const previews = await Promise.all(urls.map(fetchPreview));
      setLinkPreviews(previews.filter(p => p));
      setIsFetchingPreviews(false);
    };

    const debounceTimer = setTimeout(getLinkPreviews, 500);
    return () => clearTimeout(debounceTimer);
  }, [content]);

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
  };

  const handleRemoveMedia = (index: number) => {
    setMedia(media.filter((_, i) => i !== index));
  };

  const onSubmit = (data: { content: string; author: string }) => {
    const urls = content.match(/(https?:\/\/[^\s]+)/g) || [];
    
    const newPost: Post = {
      id: post?.id || crypto.randomUUID(),
      content: data.content,
      author: data.author,
      date: new Date(),
      media: media.length > 0 ? media : undefined,
      links: urls.map(url => ({ url })),
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
    setLinkPreviews([]);
    if (onEdit) onEdit();
  };

  // Cleanup function for voice recording
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isRecording]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-4 mb-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="relative">
          <textarea
            {...register('content')}
            placeholder="¿Qué está pasando en la escena cultural?"
            className="w-full p-3 border rounded-lg resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            rows={3}
          />
          {showEmojiPicker && (
            <div className="absolute bottom-full right-0 mb-2">
              <Picker data={data} onEmojiSelect={onEmojiSelect} />
            </div>
          )}
          {showStickerPicker && (
            <div className="absolute bottom-full right-0 mb-2 bg-white dark:bg-gray-700 p-4 rounded-lg shadow-lg">
              <div className="grid grid-cols-4 gap-2">
                {/* Add your sticker URLs here */}
                <img
                  src="https://example.com/sticker1.png"
                  alt="Sticker"
                  className="w-16 h-16 cursor-pointer hover:opacity-80"
                  onClick={() => onStickerSelect("https://example.com/sticker1.png")}
                />
                {/* Add more stickers as needed */}
              </div>
            </div>
          )}
        </div>

        <div>
          <input
            {...register('author')}
            placeholder="Tu nombre"
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        {/* Media preview */}
        {media.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {media.map((item, index) => (
              <div key={`media-${index}-${btoa(item.url)}`} className="relative">
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
                {item.type === 'sticker' && (
                  <img src={item.url} alt="Sticker" className="w-full h-32 object-contain rounded" />
                )}
                <button
                  type="button"
                  onClick={() => handleRemoveMedia(index)}
                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Link previews */}
        {isFetchingPreviews && (
          <div className="text-gray-500 dark:text-gray-400 text-sm">
            Cargando vistas previas...
          </div>
        )}
        
        {linkPreviews.map((preview, index) => (
          <div key={index} className="border rounded-lg p-3 dark:border-gray-700">
            <a
              href={preview.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg p-2"
            >
              {preview.image && (
                <img
                  src={preview.image}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-t-lg mb-2"
                />
              )}
              <div className="space-y-1">
                {preview.title && (
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {preview.title}
                  </h3>
                )}
                {preview.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {preview.description}
                  </p>
                )}
                <p className="text-xs text-blue-500 truncate">{preview.url}</p>
              </div>
            </a>
          </div>
        ))}

        <div className="flex items-center justify-between border-t dark:border-gray-700 pt-3">
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <Image className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <Video className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <FileText className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <Smile className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => setShowStickerPicker(!showStickerPicker)}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <Sticker className="h-5 w-5" />
            </button>
            <button
              type="button"
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onMouseLeave={stopRecording}
              className={`p-2 ${isRecording ? 'text-red-500' : 'text-gray-500 hover:text-gray-700'} dark:text-gray-400 dark:hover:text-gray-300`}
            >
              <Mic className="h-5 w-5" />
            </button>
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-cultural-escenicas text-white rounded-full hover:bg-cultural-escenicas/90"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </form>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*,application/*"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
};