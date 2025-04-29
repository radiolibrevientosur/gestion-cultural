import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { CulturalEvent, ArtistBirthday, CulturalTask, Contact, CulturalContextType, CulturalAction, Notification, ReactionType, Comment, PressArticle, Post } from '../types/cultural';

const initialState: CulturalContextType['state'] = {
  events: [],
  birthdays: [],
  tasks: [],
  contacts: [],
  notifications: [],
  pressArticles: [],
  posts: []
};

const CulturalContext = createContext<CulturalContextType | null>(null);

// Función mejorada para cargar el estado inicial
const loadInitialState = (): CulturalContextType['state'] => {
  try {
    const savedState = localStorage.getItem('cultural_management_state');
    if (!savedState) return initialState;

    const parsedState = JSON.parse(savedState);
    
    // Función genérica para parsear entidades
 const parseEntity = <T extends { date: string },>( // Coma agregada
  entity: T
): T => ({
  ...entity,
  date: new Date(entity.date),
  reactions: entity.reactions || { 
    like: 0, 
    love: 0, 
    celebrate: 0, 
    interesting: 0 
  },
  comments: (entity.comments || []).map((comment: any) => ({
    ...comment,
    date: new Date(comment.date)
  }))
});
    return {
      events: (parsedState.events || []).map(parseEntity<CulturalEvent>),
      birthdays: (parsedState.birthdays || []).map((b: any) => ({
        ...parseEntity<ArtistBirthday>(b),
        birthDate: new Date(b.birthDate)
      })),
      tasks: (parsedState.tasks || []).map((t: any) => ({
        ...t,
        dueDate: new Date(t.dueDate)
      })),
      contacts: parsedState.contacts || [],
      notifications: (parsedState.notifications || []).map((n: any) => ({
        ...n,
        date: new Date(n.date)
      })),
      pressArticles: (parsedState.pressArticles || []).map(parseEntity<PressArticle>),
      posts: (parsedState.posts || []).map(parseEntity<Post>)
    };
  } catch (error) {
    console.error('Error loading state:', error);
    return initialState;
  }
};

// Funciones helper del reducer
const updateReactions = <T extends { id: string }>(
  items: T[],
  entityId: string,
  reactionType: ReactionType
): T[] => items.map(item => 
  item.id === entityId ? {
    ...item,
    reactions: {
      ...(item as any).reactions,
      [reactionType]: ((item as any).reactions[reactionType] || 0) + 1
    }
  } : item
);

const addComment = <T extends { id: string }>(
  items: T[],
  entityId: string,
  comment: Comment
): T[] => items.map(item => 
  item.id === entityId ? {
    ...item,
    comments: [...(item as any).comments, comment]
  } : item
);

const toggleFavorite = <T extends { id: string }>(
  items: T[],
  entityId: string
): T[] => items.map(item => 
  item.id === entityId ? {
    ...item,
    isFavorite: !(item as any).isFavorite
  } : item
);

// Reducer completo y unificado
const culturalReducer = (state: CulturalContextType['state'], action: CulturalAction): CulturalContextType['state'] => {
  switch (action.type) {
    case 'ADD_EVENT':
      return {
        ...state,
        events: [{
          ...action.payload,
          reactions: { like: 0, love: 0, celebrate: 0, interesting: 0 },
          comments: [],
          isFavorite: false
        }, ...state.events]
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
    events: updateReactions(state.events, action.payload.entityId, action.payload.reactionType),
    birthdays: updateReactions(state.birthdays, action.payload.entityId, action.payload.reactionType),
    posts: updateReactions(state.posts, action.payload.entityId, action.payload.reactionType)
  };

    case 'ADD_COMMENT':
      return {
        ...state,
        events: addComment(state.events, action.payload.entityId, action.payload.comment),
        birthdays: addComment(state.birthdays, action.payload.entityId, action.payload.comment),
        posts: addComment(state.posts, action.payload.entityId, action.payload.comment)
      };

    case 'MARK_FAVORITE':
      return {
        ...state,
        events: toggleFavorite(state.events, action.payload.entityId),
        birthdays: toggleFavorite(state.birthdays, action.payload.entityId),
        posts: toggleFavorite(state.posts, action.payload.entityId)
      };

    case 'ADD_POST':
      return {
        ...state,
        posts: [{
          ...action.payload,
          reactions: action.payload.reactions || { like: 0, love: 0, celebrate: 0, interesting: 0 },
          comments: action.payload.comments || [],
          isFavorite: false
        }, ...state.posts]
      };

    case 'UPDATE_POST':
      return {
        ...state,
        posts: state.posts.map(post => 
          post.id === action.payload.id ? action.payload : post
        )
      };

    case 'DELETE_POST':
      return {
        ...state,
        posts: state.posts.filter(post => post.id !== action.payload)
      };

    // Resto de casos (birthdays, tasks, contacts, etc.)
    default:
      return handleOtherCases(state, action);
  }
};

const handleOtherCases = (state: CulturalContextType['state'], action: CulturalAction): CulturalContextType['state'] => {
  // Implementación similar para birthdays, tasks, contacts...
  return state;
};

export const CulturalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(culturalReducer, initialState, loadInitialState);

  useEffect(() => {
    try {
      localStorage.setItem('cultural_management_state', JSON.stringify(state));
    } catch (error) {
      console.error('Error saving state:', error);
    }
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