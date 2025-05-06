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

export interface GalleryItem {
  id: string;
  image: { data: string; type: string };
  title: string;
  description: string;
  date: Date;
}

export interface CulturalPortfolio {
  category: Category;
  discipline: string;
  trajectory: string;
  achievements: Achievement[];
  works: WorkItem[];
  gallery: GalleryItem[];
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
  parentId?: string;
  replies?: Comment[];
  mentions?: string[];
  tags?: string[];
}

export interface CustomReaction {
  id: string;
  emoji: string;
  name: string;
  count: number;
  users: string[];
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
  customReactions: CustomReaction[];
  comments: Comment[];
  isFavorite: boolean;
  shares: number;
  collaborators?: string[];
  tags: string[];
  mentions: string[];
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

export interface CulturalEvent extends InteractiveEntity {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  locationUrl?: string;
  category: Category;
  eventType: string;
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
  id: string;
  name: string;
  birthDate: Date;
  role: string;
  discipline: string;
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

export interface CulturalTask extends InteractiveEntity {
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
}

export interface Contact {
  id: string;
  name: string;
  role?: string;
  discipline?: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  instagram?: string;
  facebook?: string;
  notes?: string;
  image?: {
    data: string;
    type: string;
  };
  isFavorite: boolean;
}

export interface PressArticle extends InteractiveEntity {
  id: string;
  title: string;
  author: string;
  date: Date;
  summary: string;
  content: string;
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
  type: 'event' | 'birthday' | 'task' | 'system';
  read: boolean;
  date: Date;
  entityId?: string;
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
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'DELETE_NOTIFICATION'; payload: string }
  | { type: 'ADD_PRESS_ARTICLE'; payload: PressArticle }
  | { type: 'UPDATE_PRESS_ARTICLE'; payload: PressArticle }
  | { type: 'DELETE_PRESS_ARTICLE'; payload: string }
  | { type: 'ADD_POST'; payload: Post }
  | { type: 'UPDATE_POST'; payload: Post }
  | { type: 'DELETE_POST'; payload: string }
  | { type: 'ADD_REACTION'; payload: { entityId: string; reactionType: ReactionType | CustomReaction } }
  | { type: 'ADD_COMMENT'; payload: { entityId: string; comment: Comment } }
  | { type: 'FOLLOW_USER'; payload: string }
  | { type: 'UNFOLLOW_USER'; payload: string }
  | { type: 'UPDATE_USER'; payload: User };

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