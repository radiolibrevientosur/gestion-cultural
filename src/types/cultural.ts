import { ReactNode } from 'react';

export type ActiveView = 'inicio' | 'crear' | 'favoritos' | 'contactos' | 'nuevo-evento' | 'nuevo-cumpleanos' | 'nueva-tarea' | 'calendario' | 'nuevo-articulo' | 'nuevo-post';

export type Category =
  | "CINE Y MEDIOS AUDIOVISUALES"
  | "ARTES VISUALES"
  | "ARTES ESCÉNICAS Y MUSICALES"
  | "PROMOCIÓN DEL LIBRO Y LA LECTURA"
  | "PATRIMONIO CULTURAL"
  | "ECONOMÍA CULTURAL"
  | "OTROS";

export type ReactionType = 'like' | 'love' | 'celebrate' | 'interesting';

export type MediaType = 'image' | 'video' | 'document' | 'voice' | 'sticker';

export interface Media {
  type: MediaType;
  url: string;
  thumbnail?: string;
  duration?: number; // For voice notes
}

export interface Comment {
  id: string;
  entityId: string;
  author: string;
  text: string;
  date: Date;
}

export interface InteractiveEntity {
  id: string;
  reactions: Record<ReactionType, number>;
  comments: Comment[];
  isFavorite: boolean;
}

export interface Post extends InteractiveEntity {
  content: string;
  author: string;
  date: Date;
  media?: Media[];
  links?: Array<string | { url: string; preview?: LinkPreview }>;
}

export interface LinkPreview {
  url: string;
  title?: string;
  description?: string;
  image?: string;
}

export interface PressArticle extends InteractiveEntity {
  title: string;
  author: string;
  summary: string;
  content: string;
  date: Date;
  category: Category;
  tags: string[];
  image?: {
    data: string;
    type: string;
  };
}

// Keep other existing interfaces...