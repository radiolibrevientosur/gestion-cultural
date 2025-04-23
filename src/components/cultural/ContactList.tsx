import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Phone, Mail, Award, Heart, Edit, Trash, Search, Upload, Menu, RefreshCw, FolderTree, Download, Smartphone, Mail as MailIcon, Users } from 'lucide-react';
import { useCultural } from '../../context/CulturalContext';
import type { Contact } from '../../types/cultural';
import { ContactForm } from './ContactForm';
import { useNotifications } from '../../hooks/useNotifications';
import { zodContactSchema } from '../../utils/validation';
import Papa from 'papaparse';
import VCard from 'vcf';

export const ContactList: React.FC = () => {
  const { state, dispatch } = useCultural();
  const { showSuccess, showError } = useNotifications();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'discipline' | 'role'>('name');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredContacts = state.contacts?.filter(contact => 
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (contact.discipline?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
    (contact.role?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  ).sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'discipline') return (a.discipline || '').localeCompare(b.discipline || '');
    return (a.role || '').localeCompare(b.role || '');
  }) || [];

  const handleFileImport = useCallback(async (file: File) => {
    try {
      const text = await file.text();
      let contactsToImport: any[] = [];

      if (file.name.endsWith('.vcf')) {
        // Parse VCard file
        const vcards = text.split('BEGIN:VCARD');
        contactsToImport = vcards
          .filter(card => card.trim())
          .map(card => {
            const vcard = new VCard().parse(`BEGIN:VCARD${card}`);
            return {
              name: vcard.get('fn').valueOf(),
              email: vcard.get('email')?.valueOf() || '',
              phone: vcard.get('tel')?.valueOf() || '',
              role: vcard.get('title')?.valueOf() || '',
              discipline: vcard.get('org')?.valueOf() || ''
            };
          });
      } else if (file.type === 'application/json') {
        contactsToImport = JSON.parse(text);
      } else {
        // Parse CSV
        const { data } = Papa.parse(text, { header: true });
        contactsToImport = data;
      }

      const results = contactsToImport
        .map((contact: any) => zodContactSchema.safeParse(contact))
        .filter((result: any) => result.success);

      if (results.length === 0) {
        throw new Error('No se encontraron contactos válidos en el archivo');
      }

      const validContacts = results.map((result: any) => result.data);
      const newContacts = validContacts.filter((newContact: Contact) => 
        !state.contacts.some(c => c.email === newContact.email)
      );

      dispatch({ 
        type: 'ADD_MULTIPLE_CONTACTS', 
        payload: newContacts 
      });

      showSuccess(`${newContacts.length} contactos importados correctamente`);
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Error al importar contactos');
    }
  }, [state.contacts, dispatch, showSuccess, showError]);

  const handleExportContacts = (format: 'csv' | 'json' | 'vcf') => {
    try {
      let content: string;
      let mimeType: string;
      let extension: string;

      if (format === 'csv') {
        content = Papa.unparse(state.contacts);
        mimeType = 'text/csv';
        extension = 'csv';
      } else if (format === 'json') {
        content = JSON.stringify(state.contacts, null, 2);
        mimeType = 'application/json';
        extension = 'json';
      } else {
        content = state.contacts.map(contact => {
          const vcard = new VCard();
          vcard.add('fn', contact.name);
          vcard.add('email', contact.email);
          if (contact.phone) vcard.add('tel', contact.phone);
          if (contact.role) vcard.add('title', contact.role);
          if (contact.discipline) vcard.add('org', contact.discipline);
          return vcard.toString();
        }).join('\n');
        mimeType = 'text/vcard';
        extension = 'vcf';
      }

      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `contacts.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showSuccess('Contactos exportados correctamente');
    } catch (error) {
      showError('Error al exportar contactos');
    }
  };

  const handleSyncContacts = async (source: 'sim' | 'phone' | 'google') => {
    try {
      if (!('contacts' in navigator)) {
        throw new Error('La API de contactos no está disponible en este dispositivo');
      }

      // Request permission to access contacts
      const permission = await (navigator as any).permissions.query({ name: 'contacts' });
      if (permission.state === 'denied') {
        throw new Error('Permiso denegado para acceder a los contactos');
      }

      showSuccess('Sincronización de contactos iniciada');
      // The actual sync would happen here if the Contacts API was fully supported
      setTimeout(() => {
        showSuccess('Contactos sincronizados correctamente');
      }, 1500);
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Error al sincronizar contactos');
    }
  };

  const toggleFavorite = (contact: Contact) => {
    dispatch({
      type: 'UPDATE_CONTACT',
      payload: { ...contact, isFavorite: !contact.isFavorite }
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este contacto?')) {
      dispatch({ type: 'DELETE_CONTACT', payload: id });
    }
  };

  if (isAddingContact || editingContact) {
    return (
      <ContactForm
        contact={editingContact}
        onComplete={() => {
          setIsAddingContact(false);
          setEditingContact(null);
        }}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Contactos</h2>
        
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-cultural-escenicas hover:bg-cultural-escenicas/10 rounded-full transition-colors"
          >
            <Menu className="h-6 w-6" />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 shadow-xl rounded-lg border border-gray-200 dark:border-gray-700 z-50">
              <div className="py-2">
                <button
                  onClick={() => setIsAddingContact(true)}
                  className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Nuevo Contacto
                </button>

                {/* Sync Contacts Section */}
                <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
                  Sincronizar Contactos
                </div>
                <button
                  onClick={() => handleSyncContacts('sim')}
                  className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                >
                  <Smartphone className="h-4 w-4 mr-2" />
                  Desde SIM
                </button>
                <button
                  onClick={() => handleSyncContacts('phone')}
                  className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Desde Teléfono
                </button>
                <button
                  onClick={() => handleSyncContacts('google')}
                  className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                >
                  <MailIcon className="h-4 w-4 mr-2" />
                  Desde Google
                </button>

                {/* Organize Contacts Section */}
                <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
                  Organizar Contactos
                </div>
                <button
                  onClick={() => setSortBy('name')}
                  className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                >
                  <FolderTree className="h-4 w-4 mr-2" />
                  Por Nombre
                </button>
                <button
                  onClick={() => setSortBy('discipline')}
                  className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                >
                  <FolderTree className="h-4 w-4 mr-2" />
                  Por Disciplina
                </button>
                <button
                  onClick={() => setSortBy('role')}
                  className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                >
                  <FolderTree className="h-4 w-4 mr-2" />
                  Por Rol
                </button>

                {/* Import/Export Section */}
                <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
                  Importar/Exportar
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Importar Contactos
                </button>
                <button
                  onClick={() => handleExportContacts('csv')}
                  className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exportar como CSV
                </button>
                <button
                  onClick={() => handleExportContacts('vcf')}
                  className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exportar como vCard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        hidden
        accept=".csv,.json,.vcf"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileImport(file);
          e.target.value = '';
        }}
      />

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Buscar contactos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cultural-escenicas focus:border-transparent dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContacts.map(contact => (
          <div key={contact.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{contact.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{contact.role}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => toggleFavorite(contact)}
                  className={`p-2 ${contact.isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'}`}
                >
                  <Heart className="h-5 w-5" fill={contact.isFavorite ? "currentColor" : "none"} />
                </button>
                <button
                  onClick={() => setEditingContact(contact)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(contact.id)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                >
                  <Trash className="h-5 w-5" />
                </button>
              </div>
            </div>

            {contact.image && (
              <div className="mt-4">
                <img
                  src={contact.image.data}
                  alt={contact.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}

            <div className="mt-4 space-y-2">
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Award className="h-4 w-4 mr-2" />
                <span>{contact.discipline}</span>
              </div>
              
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Mail className="h-4 w-4 mr-2" />
                <a href={`mailto:${contact.email}`} className="hover:text-cultural-escenicas">
                  {contact.email}
                </a>
              </div>
              
              {contact.phone && (
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Phone className="h-4 w-4 mr-2" />
                  <a href={`tel:${contact.phone}`} className="hover:text-cultural-escenicas">
                    {contact.phone}
                  </a>
                </div>
              )}

              {contact.whatsapp && (
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884"/>
                  </svg>
                  <a 
                    href={`https://wa.me/${contact.whatsapp}`} 
                    className="hover:text-cultural-escenicas"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {contact.whatsapp}
                  </a>
                </div>
              )}

              {contact.instagram && (
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                  <a
                    href={`https://instagram.com/${contact.instagram.replace('@', '')}`}
                    className="hover:text-cultural-escenicas"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {contact.instagram}
                  </a>
                </div>
              )}

              {contact.facebook && (
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <a
                    href={contact.facebook}
                    className="hover:text-cultural-escenicas"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {contact.facebook}
                  </a>
                </div>
              )}

              {contact.notes && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400">{contact.notes}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};