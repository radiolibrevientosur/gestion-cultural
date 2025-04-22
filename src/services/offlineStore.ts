import Dexie, { Table } from 'dexie';
import { CulturalEvent, ArtistBirthday, CulturalTask, Contact } from '../types/cultural';

interface SyncQueueItem {
  id: string;
  operation: 'create' | 'update' | 'delete';
  entityType: 'event' | 'birthday' | 'task' | 'contact';
  data: any;
  timestamp: number;
  retries: number;
}

export class OfflineStore extends Dexie {
  events!: Table<CulturalEvent>;
  birthdays!: Table<ArtistBirthday>;
  tasks!: Table<CulturalTask>;
  contacts!: Table<Contact>;
  syncQueue!: Table<SyncQueueItem>;

  constructor() {
    super('culturalDB');
    this.version(1).stores({
      events: '&id, date, eventType, category',
      birthdays: '&id, birthDate, name',
      tasks: '&id, dueDate, status',
      contacts: '&id, name, discipline',
      syncQueue: '&id, operation, entityType, timestamp'
    });
  }

  async addToSyncQueue(item: Omit<SyncQueueItem, 'id' | 'timestamp' | 'retries'>) {
    return this.syncQueue.add({
      ...item,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      retries: 0
    });
  }

  async processSyncQueue() {
    const items = await this.syncQueue.orderBy('timestamp').toArray();
    for (const item of items) {
      try {
        if (item.retries >= 5) {
          await this.syncQueue.delete(item.id);
          continue;
        }

        // Here you would implement the actual sync logic with your backend
        // For now, we'll just simulate a successful sync
        console.log(`Syncing item: ${item.id}`);
        await this.syncQueue.delete(item.id);
      } catch (error) {
        await this.syncQueue.update(item.id, {
          retries: item.retries + 1,
          timestamp: Date.now() + Math.pow(2, item.retries) * 1000 // Exponential backoff
        });
      }
    }
  }
}

export const db = new OfflineStore();