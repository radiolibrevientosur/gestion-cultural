import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { CulturalEvent, ArtistBirthday, CulturalTask, Contact, CulturalContextType, CulturalAction, Notification, ReactionType, Comment, PressArticle, Post, User } from '../types/cultural';

const initialState: CulturalContextType['state'] = {
  events: [],
  birthdays: [],
  tasks: [],
  contacts: [],
  notifications: [],
  pressArticles: [],
  posts: [],
  currentUser: {
    id: '1',
    username: 'usuario',
    name: 'Usuario',
    followers: [],
    following: [],
    posts: []
  },
  users: []
};

const CulturalContext = createContext<CulturalContextType | null>(null);

const loadInitialState = (): CulturalContextType['state'] => {
  try {
    const savedState = localStorage.getItem('cultural_management_state');
    if (!savedState) return initialState;

    const parsedState = JSON.parse(savedState);
    
    const parseEntity = <T extends { date: string },>(
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
      posts: (parsedState.posts || []).map(parseEntity<Post>),
      currentUser: parsedState.currentUser || initialState.currentUser,
      users: parsedState.users || []
    };
  } catch (error) {
    console.error('Error loading state:', error);
    return initialState;
  }
};

const updateEntityWithReaction = <T extends { id: string; reactions: Record<ReactionType, number> }>(
  entities: T[],
  entityId: string,
  reactionType: ReactionType
): T[] => {
  return entities.map(entity =>
    entity.id === entityId
      ? {
          ...entity,
          reactions: {
            ...entity.reactions,
            [reactionType]: (entity.reactions[reactionType] || 0) + 1
          }
        }
      : entity
  );
};

const updateEntityWithComment = <T extends { id: string; comments: Comment[] }>(
  entities: T[],
  entityId: string,
  comment: Comment
): T[] => {
  return entities.map(entity =>
    entity.id === entityId
      ? {
          ...entity,
          comments: [...entity.comments, comment]
        }
      : entity
  );
};

const culturalReducer = (state: CulturalContextType['state'], action: CulturalAction): CulturalContextType['state'] => {
  try {
    switch (action.type) {
      case 'ADD_BIRTHDAY':
        return {
          ...state,
          birthdays: [action.payload, ...state.birthdays]
        };

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
        return {
          ...state,
          tasks: [action.payload, ...state.tasks]
        };

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

      case 'FOLLOW_USER':
        return {
          ...state,
          currentUser: {
            ...state.currentUser,
            following: [...state.currentUser.following, action.payload]
          },
          users: state.users.map(user => 
            user.id === action.payload
              ? { ...user, followers: [...user.followers, state.currentUser.id] }
              : user
          )
        };

      case 'UNFOLLOW_USER':
        return {
          ...state,
          currentUser: {
            ...state.currentUser,
            following: state.currentUser.following.filter(id => id !== action.payload)
          },
          users: state.users.map(user => 
            user.id === action.payload
              ? { ...user, followers: user.followers.filter(id => id !== state.currentUser.id) }
              : user
          )
        };

      case 'ADD_REACTION':
        return {
          ...state,
          events: updateEntityWithReaction(state.events, action.payload.entityId, action.payload.reactionType),
          birthdays: updateEntityWithReaction(state.birthdays, action.payload.entityId, action.payload.reactionType),
          posts: updateEntityWithReaction(state.posts, action.payload.entityId, action.payload.reactionType),
          pressArticles: updateEntityWithReaction(state.pressArticles, action.payload.entityId, action.payload.reactionType)
        };

      case 'ADD_COMMENT':
        return {
          ...state,
          events: updateEntityWithComment(state.events, action.payload.entityId, action.payload.comment),
          birthdays: updateEntityWithComment(state.birthdays, action.payload.entityId, action.payload.comment),
          posts: updateEntityWithComment(state.posts, action.payload.entityId, action.payload.comment),
          pressArticles: updateEntityWithComment(state.pressArticles, action.payload.entityId, action.payload.comment)
        };

      case 'ADD_EVENT':
        return {
          ...state,
          events: [{
            ...action.payload,
            reactions: { like: 0, love: 0, celebrate: 0, interesting: 0 },
            comments: []
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

      case 'ADD_PRESS_ARTICLE':
        return {
          ...state,
          pressArticles: [{
            ...action.payload,
            reactions: { like: 0, love: 0, celebrate: 0, interesting: 0 },
            comments: []
          }, ...state.pressArticles]
        };

      case 'UPDATE_PRESS_ARTICLE':
        return {
          ...state,
          pressArticles: state.pressArticles.map(article =>
            article.id === action.payload.id ? action.payload : article
          )
        };

      case 'DELETE_PRESS_ARTICLE':
        return {
          ...state,
          pressArticles: state.pressArticles.filter(article => article.id !== action.payload)
        };

      default:
        return state;
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error en reducer: ${error.message}`, error.stack);
    } else {
      console.error('Error desconocido en reducer:', error);
    }
    return state;
  }
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