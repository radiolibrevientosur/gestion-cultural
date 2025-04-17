export type ArtisticDiscipline = 'Teatro' | 'Danza' | 'Artes Visuales' | 'Música' | 'Literatura';

export type EventType = 'Taller' | 'Espectáculo' | 'Exposición' | 'Concierto' | 'Conferencia';

export type EventCost = {
  type: 'free' | 'paid';
  amount?: number;
};

export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly' | 'custom';

export type RecurrenceConfig = {
  type: RecurrenceType;
  interval?: number; // For custom recurrence
  endDate?: Date;
  daysOfWeek?: number[]; // 0-6 for Sunday-Saturday
};

export interface CulturalEvent {
  id: string;
  title: string;
  description: string;
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
    data: string; // Base64 encoded image data
    type: string; // MIME type
  };
  tags: string[];
  isFavorite: boolean;
  recurrence?: RecurrenceConfig;
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
    data: string; // Base64 encoded image data
    type: string; // MIME type
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