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

export type EventType = {
  'CINE Y MEDIOS AUDIOVISUALES': ['cine foro', 'proyección de cine', 'radio', 'realización audiovisual'];
  'ARTES VISUALES': ['dibujo y pintura', 'escultura', 'fotografía', 'constructivismo', 'arte conceptual', 'muralismo'];
  'ARTES ESCÉNICAS Y MUSICALES': ['teatro', 'danza', 'música', 'circo'];
  'PROMOCIÓN DEL LIBRO Y LA LECTURA': ['creación y expresividad literaria', 'promoción de lectura', 'club de libros'];
  'PATRIMONIO CULTURAL': ['historia local', 'historia general', 'costumbres y tradiciones', 'cultura popular', 'identidad cultural'];
  'ECONOMÍA CULTURAL': ['industrias culturales', 'proyectos culturales', 'portafolios culturales (emprendimientos)', 'finanzas culturales'];
  'OTROS': [];
}[Category];

export type ReactionType = 'like' | 'love' | 'celebrate' | 'interesting';
export const DEFAULT_REACTIONS: Record<ReactionType, number> = {
  like: 0,
  love: 0,
  celebrate: 0,
  interesting: 0
};

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'event' | 'birthday' | 'task' | 'post';
  read: boolean;
  date: Date;
  entityId: string;
}
interface InteractiveItem {
  id: string;
  reactions: Record<ReactionType, number>;
  comments: Comment[];
  isFavorite: boolean;
}

// Actualizar interfaces principales
export interface CulturalEvent extends InteractiveItem {
  title: string;
  description: string;
  // ... otros campos específicos de eventos
}

export interface ArtistBirthday extends InteractiveItem {
  name: string;
  // ... otros campos específicos de cumpleaños
}

export interface Post extends InteractiveItem {
  content: string;
  author: string;
  // ... otros campos específicos de posts
}

export interface CulturalEvent {
  id: string;
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
  isFavorite: boolean;
  recurrence: {
    type: 'none' | 'daily' | 'weekly' | 'monthly' | 'custom';
    interval?: number;
    endDate?: string;
    daysOfWeek?: number[];
  };
  reactions: Record<ReactionType, number>;
  comments: Comment[];
}

export interface ArtistBirthday {
  id: string;
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
  isFavorite: boolean;
}

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

export interface PressArticle {
  id: string;
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
  isFavorite: boolean;
}

export interface Post {
  id: string;
  content: string;
  author: string;
  date: Date;
  media?: {
    type: 'image' | 'video' | 'document';
    url: string;
    thumbnail?: string;
  }[];
  links?: string[];
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
  | { type: 'ADD_EVENT'; payload: CulturalEvent }
  | { type: 'UPDATE_EVENT'; payload: CulturalEvent }
  | { type: 'DELETE_EVENT'; payload: string }
  | { type: 'ADD_BIRTHDAY'; payload: ArtistBirthday }
  | { type: 'UPDATE_BIRTHDAY'; payload: ArtistBirthday }
  | { type: 'DELETE_BIRTHDAY'; payload: string }
  | { type: 'ADD_TASK'; payload: CulturalTask }
  | { type: 'UPDATE_TASK'; payload: CulturalTask }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'ADD_CONTACT'; payload: Contact }
  | { type: 'UPDATE_CONTACT'; payload: Contact }
  | { type: 'DELETE_CONTACT'; payload: string }
  | { type: 'ADD_MULTIPLE_CONTACTS'; payload: Contact[] }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'DELETE_NOTIFICATION'; payload: string }
  | { type: 'LOAD_STATE'; payload: CulturalContextType['state'] }
  | { type: 'ADD_REACTION'; payload: { eventId: string; reactionType: ReactionType } }
  | { type: 'ADD_COMMENT'; payload: { eventId: string; comment: Comment } }
  | { type: 'ADD_PRESS_ARTICLE'; payload: PressArticle }
  | { type: 'UPDATE_PRESS_ARTICLE'; payload: PressArticle }
  | { type: 'DELETE_PRESS_ARTICLE'; payload: string }
  | { type: 'ADD_POST'; payload: Post }
  | { type: 'UPDATE_POST'; payload: Post }
  | { type: 'DELETE_POST'; payload: string }
  | { type: 'ADD_POST_REACTION'; payload: { postId: string; reactionType: ReactionType } }
  | { type: 'ADD_POST_COMMENT'; payload: { postId: string; comment: Comment } };
export type Post = {
  id: string;
  content: string;
  author: string;
  date: Date;
  media?: Array<{
    type: 'image' | 'video' | 'document';
    url: string;
    thumbnail?: string;
  }>;
  links?: string[];
  reactions: {
    like: number;
    love: number;
    celebrate: number;
    interesting: number;
  };
  comments: Comment[];
  isFavorite: boolean;
};