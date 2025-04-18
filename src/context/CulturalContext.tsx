import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { CulturalEvent, ArtistBirthday, CulturalTask } from '../types/cultural';

interface CulturalState {
  events: CulturalEvent[];
  birthdays: ArtistBirthday[];
  tasks: CulturalTask[];
}

type CulturalAction =
  | { type: 'ADD_EVENT'; payload: CulturalEvent }
  | { type: 'UPDATE_EVENT'; payload: CulturalEvent }
  | { type: 'DELETE_EVENT'; payload: string }
  | { type: 'ADD_BIRTHDAY'; payload: ArtistBirthday }
  | { type: 'UPDATE_BIRTHDAY'; payload: ArtistBirthday }
  | { type: 'DELETE_BIRTHDAY'; payload: string }
  | { type: 'ADD_TASK'; payload: CulturalTask }
  | { type: 'UPDATE_TASK'; payload: CulturalTask }
  | { type: 'UPDATE_TASK_STATUS'; payload: { id: string; status: CulturalTask['status'] } }
  | { type: 'LOAD_STATE'; payload: CulturalState };

const STORAGE_KEY = 'cultural_management_state';

const initialState: CulturalState = {
  events: [],
  birthdays: [],
  tasks: [],
};

const loadInitialState = (): CulturalState => {
  try {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      return {
        ...parsedState,
        events: parsedState.events.map((event: any) => ({
          ...event,
          date: new Date(event.date)
        })),
        birthdays: parsedState.birthdays.map((birthday: any) => ({
          ...birthday,
          birthDate: new Date(birthday.birthDate)
        })),
        tasks: parsedState.tasks.map((task: any) => ({
          ...task,
          dueDate: new Date(task.dueDate)
        }))
      };
    }
  } catch (error) {
    console.error('Error loading state from localStorage:', error);
  }
  return initialState;
};

const culturalReducer = (state: CulturalState, action: CulturalAction): CulturalState => {
  let newState: CulturalState;

  switch (action.type) {
    case 'ADD_EVENT':
      newState = { ...state, events: [...state.events, action.payload] };
      break;
    case 'UPDATE_EVENT':
      newState = {
        ...state,
        events: state.events.map(event =>
          event.id === action.payload.id ? action.payload : event
        )
      };
      break;
    case 'DELETE_EVENT':
      newState = {
        ...state,
        events: state.events.filter(event => event.id !== action.payload)
      };
      break;
    case 'ADD_BIRTHDAY':
      newState = { ...state, birthdays: [...state.birthdays, action.payload] };
      break;
    case 'UPDATE_BIRTHDAY':
      newState = {
        ...state,
        birthdays: state.birthdays.map(birthday =>
          birthday.id === action.payload.id ? action.payload : birthday
        )
      };
      break;
    case 'DELETE_BIRTHDAY':
      newState = {
        ...state,
        birthdays: state.birthdays.filter(birthday => birthday.id !== action.payload)
      };
      break;
    case 'ADD_TASK':
      newState = { ...state, tasks: [...state.tasks, action.payload] };
      break;
    case 'UPDATE_TASK':
      newState = {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? action.payload : task
        )
      };
      break;
    case 'UPDATE_TASK_STATUS':
      newState = {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id
            ? { ...task, status: action.payload.status }
            : task
        ),
      };
      break;
    case 'LOAD_STATE':
      newState = action.payload;
      break;
    default:
      return state;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  return newState;
};

const CulturalContext = createContext<{
  state: CulturalState;
  dispatch: React.Dispatch<CulturalAction>;
} | null>(null);

export const CulturalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(culturalReducer, initialState, loadInitialState);

  useEffect(() => {
    const savedState = loadInitialState();
    if (savedState !== initialState) {
      dispatch({ type: 'LOAD_STATE', payload: savedState });
    }
  }, []);

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