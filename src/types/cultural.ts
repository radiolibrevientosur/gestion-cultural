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
  'PROMOCIÓN DEL LIBRO Y LA LECTURA': ['creación y expresividad iteraria', 'promoción de lectura', 'club de libros'];
  'PATRIMONIO CULTURAL': ['historia local', 'historia general', 'costumbres y tradiciones', 'cultura popular', 'identidad cultural'];
  'ECONOMÍA CULTURAL': ['industrias culturales', 'proyectos culturales', 'portafolios culturales (emprendimientos)', 'finanzas culturales'];
  'OTROS': [];
}[Category];

export type ArtisticDiscipline = 'Teatro' | 'Danza' | 'Artes Visuales' | 'Música' | 'Literatura';

export type EventCost = {
  type: 'free' | 'paid';
  amount?: number;
};

export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly' | 'custom';

export type RecurrenceConfig = {
  type: RecurrenceType;
  interval?: number;
  endDate?: Date;
  daysOfWeek?: number[];
};

export type ReminderConfig = {
  enabled: boolean;
  time: number; // minutes before event
  type: 'notification' | 'both';
};

export interface CulturalEvent {
  id: string;
  title: string;
  description: string;
  category: Category;
  eventType: EventType;
  discipline: ArtisticDiscipline;
  date: Date;
  location: string;
  targetAudience: 'Infantil' | 'Adultos' | 'Todos';
  cost: EventCost;
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
  recurrence?: RecurrenceConfig;
  reminder?: ReminderConfig;
}

export interface ArtistBirthday {
  id: string;
  name: string;
  birthDate: Date;
  role: string;
  trajectory: string;
  discipline: ArtisticDiscipline;
  contactInfo: {
    email: string;
    phone: string;
  };
  image?: {
    data: string;
    type: string;
  };
  isFavorite: boolean;
  reminder?: ReminderConfig;
}

export interface Contact {
  id: string;
  name: string;
  role: string;
  discipline: ArtisticDiscipline;
  email: string;
  phone: string;
  notes?: string;
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
  relatedEventId?: string;
  checklist: {
    id: string;
    task: string;
    completed: boolean;
  }[];
  isFavorite: boolean;
  reminder?: ReminderConfig;
}

export interface ThemeConfig {
  mode: 'light' | 'dark' | 'system';
  primaryColor: string;
  secondaryColor: string;
}

export interface UserProfile {
  name: string;
  email: string;
  bio?: string;
  theme: ThemeConfig;
}