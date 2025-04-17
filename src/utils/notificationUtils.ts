export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === 'granted';
}

export function playNotificationSound() {
  const audio = new Audio('/notification.mp3');
  audio.play().catch(error => {
    console.warn('Error playing notification sound:', error);
  });
}

export function scheduleNotification(title: string, options: NotificationOptions, delay: number) {
  setTimeout(async () => {
    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) return;

    playNotificationSound();
    new Notification(title, options);
  }, delay);
}