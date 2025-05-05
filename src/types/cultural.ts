import { ReactNode } from 'react';

export type ActiveView = 'inicio' | 'crear' | 'favoritos' | 'contactos' | 'nuevo-evento' | 'nuevo-cumpleanos' | 'nueva-tarea' | 'calendario' | 'nuevo-articulo' | 'nuevo-post' | 'perfil' | 'feed';

export type Category =
  | "CINE Y MEDIOS AUDIOVISUALES"
  | "ARTES VISUALES"
  | "ARTES ESCÉNICAS Y MUSICALES"
  | "PROMOCIÓN DEL LIBRO Y LA LECTURA"
  | "PATRIMONIO CULTURAL"
  | "ECONOMÍA CULTURAL"
  | "OTROS";

export interface WorkItem {
  id: string;
  title: string;
  description: string;
  date: Date;
  image?: { data: string; type: string };
  category: Category;
  url?: string;
  isCurrent: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: Date;
  institution: string;
  type: 'award' | 'recognition' | 'certification';
}

export interface CulturalPortfolio {
  category: Category;
  discipline: string;
  trajectory: string;
  achievements: Achievement[];
  works: WorkItem[];
}

export type ReactionType = 'like' | 'love' | 'celebrate' | 'interesting';

export type MediaType = 'image' | 'video' | 'document' | 'voice' | 'sticker';

export interface Media {
  type: MediaType;
  url: string;
  thumbnail?: string;
  duration?: number;
}

export interface Comment {
  id: string;
  entityId: string;
  author: string;
  text: string;
  date: Date;
}

export interface User {
  id: string;
  username: string;
  name: string;
  avatar?: { data: string; type: string };
  coverImage?: { data: string; type: string };
  bio?: string;
  extendedBio?: string;
  followers: string[];
  following: string[];
  posts: string[];
  portfolio?: CulturalPortfolio;
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
    website?: string;
    youtube?: string;
    linkedin?: string;
  };
}

export interface InteractiveEntity {
  id: string;
  reactions: Record<ReactionType, number>;
  comments: Comment[];
  isFavorite: boolean;
}

export interface Post extends InteractiveEntity {
  userId: string;
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

export interface CulturalContextType {
  state: {
    events: CulturalEvent[];
    birthdays: ArtistBirthday[];
    tasks: CulturalTask[];
    contacts: Contact[];
    notifications: Notification[];
    pressArticles: PressArticle[];
    posts: Post[];
    currentUser: User;
    users: User[];
  };
  dispatch: (action: CulturalAction) => void;
}