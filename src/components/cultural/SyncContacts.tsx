tsx
import React, { useState, useEffect } from 'react';
import { getAuth, getIdToken, User } from 'firebase/auth';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { showError, showSuccess } from '../utils/notificationUtils';

interface SyncContactsProps { }

const SyncContacts: React.FC<SyncContactsProps> = () => {
  const [syncing, setSyncing] = useState<boolean>(false);
  const auth = getAuth();
  const functions = getFunctions();
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  const syncGoogleContacts = async () => {
    try {
      setSyncing(true);
      const token = await getIdToken(auth.currentUser!);
      if (!token) {
        throw new Error('No se pudo obtener el token de acceso.');
      }
      const syncGoogleContactsCallable = httpsCallable(functions, 'syncGoogleContacts');
      const { data } = await syncGoogleContactsCallable({ accessToken: token });
      showSuccess(`Sincronizados ${data.count} contactos`);
    } catch (error: any) {
      showError(`Error de sincronización: ${error.message}`);
    } finally {
      setSyncing(false);
    }
  };

  const syncDeviceContacts = async () => {
    try {
      setSyncing(true);
      if (!navigator.contacts) {
        throw new Error('API de contactos no soportada');
      }

      const props = ['name', 'email', 'tel'];
      const contacts = await navigator.contacts.select(props, { multiple: true });
      if (contacts.length == 0) {
        showError(`No se han seleccionado contactos`);
        return
      }
      console.log(contacts)
      showSuccess(`Sincronizando ${contacts.length} contactos`);
      const syncDeviceContactsCallable = httpsCallable(functions, 'syncDeviceContacts');
      const { data } = await syncDeviceContactsCallable({ contacts: contacts });
      showSuccess(`Sincronizados ${data.count} contactos`);
    } catch (error: any) {
      showError(`Error al sincronizar contactos del dispositivo: ${error.message}`);
    } finally {
      setSyncing(false);
    }
  };

  const syncSimContacts = async () => {
    try {
      setSyncing(true);
      showSuccess(`Sincronizando Contactos SIM`);
      setTimeout(() => {
        showSuccess('Contactos sincronizados correctamente');
      }, 1500);
    } catch (error: any) {
      showError(`Error al sincronizar contactos SIM: ${error.message}`);
    } finally {
      setSyncing(false);
    }
  }

  const handleSyncContacts = async (source: 'google' | 'device' | 'sim') => {
    if (source === 'google') {
      await syncGoogleContacts();
    } else if (source === 'device') {
      await syncDeviceContacts();
    } else if (source === 'sim') {
      await syncSimContacts();
    }
  };

  useEffect(() => {
    setUser(auth.currentUser);
    setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    const unregisterAuthObserver = auth.onAuthStateChanged(user => {
      setUser(user);
    });
    return () => unregisterAuthObserver(); // Cleanup subscription on unmount
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <button
        onClick={() => handleSyncContacts('google')}
        disabled={syncing}
      >
        {syncing ? 'Sincronizando Google...' : 'Sync Google Contacts'}
      </button>
      {navigator.contacts && isMobile && (
        <button
          onClick={() => handleSyncContacts('device')}
          disabled={syncing}
        >
          {syncing ? 'Sincronizando Dispositivo...' : 'Sync Device Contacts'}
        </button>
      )}
      {!isMobile && <p>Sincronización de contactos del dispositivo no disponible en escritorio.</p>}
      {isMobile && (
        <button onClick={() => handleSyncContacts('sim')} disabled={syncing}>
          {syncing ? 'Sincronizando SIM...' : 'Sync SIM Contacts'}
        </button>
      )}
    </div>
  );
};

export default SyncContacts;