import { ReactNode } from 'react';

export type ActiveView = 'inicio' | 'crear' | 'favoritos' | 'contactos' | 'nuevo-evento' | 'nuevo-cumpleanos' | 'nueva-tarea' | 'calendario' | 'nuevo-articulo' | 'nuevo-post';

export type Category =
  | 'CINE Y MEDIOS AUDIOVISUALES'
  | 'ARTES VISUALES'
  | 'ARTES ESCÉNICAS Y MUSICALES'
  | 'PROMOCIÓN DEL LIBRO Y LA LECTURA'
  | 'PATRIMONIO CULTURAL'
  | 'ECONOMÍA CULTURAL'
  | 'OTROS';

export type ReactionType = 'like' | 'love' | 'celebrate' | 'interesting';

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

export interface CulturalEvent extends InteractiveEntity {
  title: string;
  description: string;
  category: Category;
  eventType: string;
  date: Date;
  location: string;
  locationUrl?: string;
  targetAudience: 'Infantil' | 'Adultos' | 'Todos';
  cost: {
    type: 'free' | 'paid';
    amount?: number;
  };
  responsiblePerson: {
    name: string;
    phone: string;
    socialMedia?: string;
  };
  technicalRequirements: string[];
  image?: {
    data: string;
    type: string;
  };
  tags: string[];
  recurrence: {
    type: 'none' | 'daily' | 'weekly' | 'monthly' | 'custom';
    interval?: number;
    endDate?: string;
    daysOfWeek?: number[];
  };
}

export interface ArtistBirthday extends InteractiveEntity {
  name: string;
  birthDate: Date;
  role: string;
  discipline: 'Teatro' | 'Danza' | 'Artes Visuales' | 'Música' | 'Literatura';
  trajectory: string;
  contactInfo: {
    email: string;
    phone: string;
  };
  image?: {
    data: string;
    type: string;
  };
}

export interface Post extends InteractiveItem {
  id: string;
  content: string;
  author: string;
  date: Date;
  media?: Array<{
    type: 'image' | 'video' | 'document';
    url: string;
    thumbnail?: string;
  }>;
  links?: Array<string | { url: string }>;
  reactions: Record<ReactionType, number>;
  comments: Comment[];
  isFavorite: boolean;
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
  };
  dispatch: React.Dispatch<CulturalAction>;
}

export type CulturalAction =
  | { type: 'ADD_POST_REACTION'; payload: { postId: string; reactionType: ReactionType } }
  | { type: 'ADD_POST_COMMENT'; payload: { postId: string; comment: Comment } }
  | { type: 'ADD_POST'; payload: Post }
  | { type: 'UPDATE_POST'; payload: Post }
  | { type: 'DELETE_POST'; payload: string };

// Keep other existing types that are referenced but not modified
export interface CulturalTask {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assignedTo: string;
  dueDate: Date;
  checklist: Array<{
    id: string;
    task: string;
    completed: boolean;
  }>;
  isFavorite: boolean;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  discipline?: string;
  role?: string;
  isFavorite?: boolean;
  image?: {
    data: string;
    type: string;
  };
  notes?: string;
  whatsapp?: string;
  instagram?: string;
  facebook?: string;
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

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'event' | 'birthday' | 'task' | 'post';
  read: boolean;
  date: Date;
  entityId: string;
}