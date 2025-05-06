import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { Search, UserPlus, X } from 'lucide-react';
import { useCultural } from '../../context/CulturalContext';

interface CollaborationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCollaborator: (userId: string) => void;
  currentCollaborators: string[];
}

export const CollaborationModal: React.FC<CollaborationModalProps> = ({
  isOpen,
  onClose,
  onAddCollaborator,
  currentCollaborators
}) => {
  const { state } = useCultural();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = state.users.filter(user => 
    !currentCollaborators.includes(user.id) &&
    (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     user.username.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <Dialog.Title className="text-xl font-semibold text-gray-900 dark:text-white">
                Añadir Colaboradores
              </Dialog.Title>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Buscar usuarios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cultural-escenicas focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {filteredUsers.map(user => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {user.avatar ? (
                      <img
                        src={user.avatar.data}
                        alt={user.name}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {user.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        @{user.username}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onAddCollaborator(user.id);
                      onClose();
                    }}
                    className="p-2 text-cultural-escenicas hover:bg-cultural-escenicas/10 rounded-full"
                  >
                    <UserPlus className="h-5 w-5" />
                  </button>
                </div>
              ))}

              {filteredUsers.length === 0 && (
                <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                  No se encontraron usuarios
                </p>
              )}
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};