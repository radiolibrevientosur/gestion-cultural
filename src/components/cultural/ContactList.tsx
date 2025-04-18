import React, { useState } from 'react';
import { Phone, Mail, Award, Heart, Edit, Trash, Search } from 'lucide-react';
import { useCultural } from '../../context/CulturalContext';
import type { Contact } from '../../types/cultural';
import { ContactForm } from './ContactForm';

export const ContactList: React.FC = () => {
  const { state, dispatch } = useCultural();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  const filteredContacts = state.contacts?.filter(contact => 
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.discipline.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.role.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const toggleFavorite = (contact: Contact) => {
    dispatch({
      type: 'UPDATE_CONTACT',
      payload: { ...contact, isFavorite: !contact.isFavorite }
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este contacto?')) {
      dispatch({
        type: 'DELETE_CONTACT',
        payload: id
      });
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
        <button
          onClick={() => setIsAddingContact(true)}
          className="px-4 py-2 bg-cultural-escenicas text-white rounded-lg hover:bg-cultural-escenicas/90 transition-colors"
        >
          Nuevo Contacto
        </button>
      </div>

      {/* Search Bar */}
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

      {/* Contacts Grid */}
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
              
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Phone className="h-4 w-4 mr-2" />
                <a href={`tel:${contact.phone}`} className="hover:text-cultural-escenicas">
                  {contact.phone}
                </a>
              </div>
            </div>

            {contact.notes && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">{contact.notes}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};