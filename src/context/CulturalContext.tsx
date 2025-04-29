import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { CulturalEvent, ArtistBirthday, CulturalTask, Contact, CulturalContextType, CulturalAction, Notification, ReactionType, Comment } from '../types/cultural';

const initialState: CulturalContextType['state'] = {
  events: [],
  birthdays: [],
  tasks: [],
  contacts: [],
  notifications: []
};

const CulturalContext = createContext<CulturalContextType | null>(null);

const loadInitialState = (): CulturalContextType['state'] => {
  try {
    const savedState = localStorage.getItem('cultural_management_state');
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      return {
        events: (parsedState.events || []).map((event: any) => ({
          ...event,
          date: new Date(event.date),
          reactions: event.reactions || { like: 0, love: 0, celebrate: 0, interesting: 0 },
          comments: (event.comments || []).map((comment: any) => ({
            ...comment,
            date: new Date(comment.date)
          }))
        })),
        birthdays: (parsedState.birthdays || []).map((birthday: any) => ({
          ...birthday,
          birthDate: new Date(birthday.birthDate)
        })),
        tasks: (parsedState.tasks || []).map((task: any) => ({
          ...task,
          dueDate: new Date(task.dueDate)
        })),
        contacts: (parsedState.contacts || []).map((contact: any) => ({
          ...contact,
          whatsapp: contact.whatsapp || undefined,
          instagram: contact.instagram || undefined,
          facebook: contact.facebook || undefined
        })),
        notifications: (parsedState.notifications || []).map((notification: any) => ({
          ...notification,
          date: new Date(notification.date)
        }))
      };
    }
  } catch (error) {
    console.error('Error loading state from localStorage:', error);
  }
  return initialState;
};

const culturalReducer = (state: CulturalContextType['state'], action: CulturalAction): CulturalContextType['state'] => {
  try {
    switch (action.type) {
      case 'ADD_EVENT':
        return { 
          ...state, 
          events: [...state.events, {
            ...action.payload,
            reactions: { like: 0, love: 0, celebrate: 0, interesting: 0 },
            comments: []
          }] 
        };
      
      case 'UPDATE_EVENT':
        return {
          ...state,
          events: state.events.map(event =>
            event.id === action.payload.id ? action.payload : event
          )
        };

      case 'DELETE_EVENT':
        return {
          ...state,
          events: state.events.filter(event => event.id !== action.payload)
        };

      case 'ADD_REACTION':
        return {
          ...state,
          events: state.events.map(event => 
            event.id === action.payload.eventId ? {
              ...event,
              reactions: {
                ...event.reactions,
                [action.payload.reactionType]: event.reactions[action.payload.reactionType] + 1
              }
            } : event
          )
        };

      case 'ADD_COMMENT':
        return {
          ...state,
          events: state.events.map(event => 
            event.id === action.payload.eventId ? {
              ...event,
              comments: [...event.comments, action.payload.comment]
            } : event
          )
        };

      case 'ADD_BIRTHDAY':
        return { ...state, birthdays: [...state.birthdays, action.payload] };

      case 'UPDATE_BIRTHDAY':
        return {
          ...state,
          birthdays: state.birthdays.map(birthday =>
            birthday.id === action.payload.id ? action.payload : birthday
          )
        };

      case 'DELETE_BIRTHDAY':
        return {
          ...state,
          birthdays: state.birthdays.filter(birthday => birthday.id !== action.payload)
        };

      case 'ADD_TASK':
        return { ...state, tasks: [...state.tasks, action.payload] };

      case 'UPDATE_TASK':
        return {
          ...state,
          tasks: state.tasks.map(task =>
            task.id === action.payload.id ? action.payload : task
          )
        };

      case 'DELETE_TASK':
        return {
          ...state,
          tasks: state.tasks.filter(task => task.id !== action.payload)
        };

      case 'ADD_CONTACT':
        return { ...state, contacts: [...state.contacts, action.payload] };

      case 'UPDATE_CONTACT':
        return {
          ...state,
          contacts: state.contacts.map(contact =>
            contact.id === action.payload.id ? action.payload : contact
          )
        };

      case 'DELETE_CONTACT':
        return {
          ...state,
          contacts: state.contacts.filter(contact => contact.id !== action.payload)
        };

      case 'ADD_MULTIPLE_CONTACTS':
        return {
          ...state,
          contacts: [
            ...state.contacts,
            ...action.payload.map(contact => ({
              ...contact,
              id: contact.id || crypto.randomUUID()
            }))
          ]
        };

      case 'ADD_NOTIFICATION':
        return {
          ...state,
          notifications: [action.payload, ...state.notifications]
        };

      case 'MARK_NOTIFICATION_READ':
        return {
          ...state,
          notifications: state.notifications.map(notification =>
            notification.id === action.payload
              ? { ...notification, read: true }
              : notification
          )
        };

      case 'DELETE_NOTIFICATION':
        return {
          ...state,
          notifications: state.notifications.filter(
            notification => notification.id !== action.payload
          )
        };

      default:
        return state;
    }
  } catch (error) {
    console.error('Error in reducer:', error);
    return state;
  }
};

export const CulturalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(culturalReducer, initialState, loadInitialState);

  useEffect(() => {
    localStorage.setItem('cultural_management_state', JSON.stringify(state));
  }, [state]);

  return (
    <CulturalContext.Provider value={{ state, dispatch }}>
      {children}
    </CulturalContext.Provider>
  );
};

export const useCultural = () => {
  const context = useContext(CulturalContext);
  if (!context) {
    throw new Error('useCultural must be used within a CulturalProvider');
  }
  return context;
};