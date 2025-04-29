import { ReactNode } from 'react';

export type ActiveView = 'inicio' | 'crear' | 'favoritos' | 'contactos' | 'nuevo-evento' | 'nuevo-cumpleanos' | 'nueva-tarea' | 'calendario';

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

// Nuevos tipos añadidos
export type ReactionType = 'like' | 'love' | 'celebrate' | 'interesting';

export interface Comment {
  id: string;
  eventId: string;
  author: string;
  text: string;
  date: Date;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'event' | 'birthday' | 'task';
  read: boolean;
  date: Date;
  entityId: string;
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
  // Nuevas propiedades añadidas
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

export interface CulturalContextType {
  state: {
    events: CulturalEvent[];
    birthdays: ArtistBirthday[];
    tasks: CulturalTask[];
    contacts: Contact[];
    notifications: Notification[];
  };
  dispatch: React.Dispatch<CulturalAction>;
}

// Acciones actualizadas
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
  // Nuevas acciones añadidas
  | { type: 'ADD_REACTION'; payload: { eventId: string; reactionType: ReactionType } }
  | { type: 'ADD_COMMENT'; payload: { eventId: string; comment: Comment } };