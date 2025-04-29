import { useState, useEffect, useCallback } from 'react';
import { useCultural } from '../context/CulturalContext';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const useNotifications = () => {
  const { state, dispatch } = useCultural();
  const [isPermissionGranted, setIsPermissionGranted] = useState(
    'Notification' in window ? Notification.permission === 'granted' : false
  );

  const checkNotificationPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      console.warn('Este navegador no soporta notificaciones');
      return false;
    }

    try {
      const permission = Notification.permission;
      setIsPermissionGranted(permission === 'granted');
      return permission === 'granted';
    } catch (error) {
      console.error('Error al verificar permisos:', error);
      return false;
    }
  }, []);

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      console.warn('Este navegador no soporta notificaciones');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      const granted = permission === 'granted';
      setIsPermissionGranted(granted);
      return granted;
    } catch (error) {
      console.error('Error al solicitar permisos:', error);
      return false;
    }
  };

  const playNotificationSound = useCallback(() => {
    try {
      const audio = new Audio('/notification.mp3');
      audio.play().catch(error => {
        console.warn('Error reproduciendo sonido:', error);
        // Fallback to base64 audio if file fails to load
        const fallbackAudio = new Audio('data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA//OEAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAUAAAiSAAYGBgYJCQkJCQwMDAwMDw8PDw8SUlJSUlVVVVVVWFhYWFhbW1tbW15eXl5eYaGhoaGkpKSkpKenp6enqqqqqqqtra2trbDw8PDw8/Pz8/P29vb29vn5+fn5/Pz8/Pz//////8AAAAATGF2YzU4LjU0AAAAAAAAAAAAAAAAJAAAAAAAAAAAIkjG8J+CAAAAAAAAAAAAAAAAAAAA//MUZAAAAAGkAAAAAAAAA0gAAAAATEFN//MUZAMAAAGkAAAAAAAAA0gAAAAARTMu//MUZAYAAAGkAAAAAAAAA0gAAAAAOTku//MUZAkAAAGkAAAAAAAAA0gAAAAANVVV');
        fallbackAudio.play().catch(e => console.warn('Error con audio fallback:', e));
      });
    } catch (error) {
      console.warn('Error al cargar el audio:', error);
    }
  }, []);

  const createNotification = useCallback((title: string, message: string, icon: string, tag: string) => {
    try {
      return new Notification(title, {
        body: message,
        icon: '/icon.png' || icon,
        badge: '/icon.png' || icon,
        tag,
        renotify: true
      });
    } catch (error) {
      console.error('Error al crear notificación:', error);
      return null;
    }
  }, []);

  const checkForDueEvents = useCallback(() => {
    if (!isPermissionGranted) return;

    try {
      const now = new Date();
      const today = format(now, 'yyyy-MM-dd');
      const currentTime = format(now, 'HH:mm');

      // Check events
      state.events.forEach(event => {
        const eventDate = format(event.date, 'yyyy-MM-dd');
        const eventTime = format(event.date, 'HH:mm');

        if (eventDate === today && eventTime === currentTime) {
          const notification = {
            id: crypto.randomUUID(),
            title: '¡Evento Ahora!',
            message: `${event.title} está comenzando`,
            type: 'event' as const,
            read: false,
            date: new Date(),
            entityId: event.id
          };

          dispatch({
            type: 'ADD_NOTIFICATION',
            payload: notification
          });

          createNotification(
            notification.title,
            notification.message,
            '📢',
            `event-${event.id}`
          );
          playNotificationSound();
        }
      });

      // Check birthdays
      state.birthdays.forEach(birthday => {
        const birthDate = format(birthday.birthDate, 'MM-dd');
        const todayDate = format(now, 'MM-dd');
        
        if (birthDate === todayDate) {
          const notification = {
            id: crypto.randomUUID(),
            title: '¡Cumpleaños Hoy!',
            message: `¡${birthday.name} está cumpliendo años hoy!`,
            type: 'birthday' as const,
            read: false,
            date: new Date(),
            entityId: birthday.id
          };

          dispatch({
            type: 'ADD_NOTIFICATION',
            payload: notification
          });

          createNotification(
            notification.title,
            notification.message,
            '🎂',
            `birthday-${birthday.id}`
          );
          playNotificationSound();
        }
      });

      // Check tasks
      state.tasks.forEach(task => {
        const taskDate = format(task.dueDate, 'yyyy-MM-dd');
        const taskTime = format(task.dueDate, 'HH:mm');

        if (taskDate === today && taskTime === currentTime && task.status !== 'completed') {
          const notification = {
            id: crypto.randomUUID(),
            title: '¡Tarea Pendiente!',
            message: `La tarea "${task.title}" debe completarse hoy`,
            type: 'task' as const,
            read: false,
            date: new Date(),
            entityId: task.id
          };

          dispatch({
            type: 'ADD_NOTIFICATION',
            payload: notification
          });

          createNotification(
            notification.title,
            notification.message,
            '📋',
            `task-${task.id}`
          );
          playNotificationSound();
        }
      });
    } catch (error) {
      console.error('Error en checkForDueEvents:', error);
    }
  }, [state.events, state.birthdays, state.tasks, isPermissionGranted, dispatch, createNotification, playNotificationSound]);

  useEffect(() => {
    checkNotificationPermission();
    const checkInterval = setInterval(checkForDueEvents, 60000);
    return () => clearInterval(checkInterval);
  }, [checkNotificationPermission, checkForDueEvents]);

  return {
    notifications: state.notifications,
    unreadCount: state.notifications.filter(n => !n.read).length,
    isPermissionGranted,
    requestNotificationPermission,
    checkNotificationPermission
  };
};