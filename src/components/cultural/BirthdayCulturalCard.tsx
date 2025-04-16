import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Cake, Mail, Phone, Award } from 'lucide-react';
import type { ArtistBirthday } from '../../types/cultural';

interface BirthdayCardProps {
  birthday: ArtistBirthday;
}

export const BirthdayCulturalCard: React.FC<BirthdayCardProps> = ({ birthday }) => {
  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth();
  };

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${
      isToday(birthday.birthDate) ? 'ring-2 ring-cultural-visuales' : ''
    }`}>
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900">{birthday.name}</h3>
            <p className="mt-1 text-sm text-gray-500">{birthday.role}</p>
          </div>
          <Cake className={`h-6 w-6 ${
            isToday(birthday.birthDate) ? 'text-cultural-visuales' : 'text-gray-400'
          }`} />
        </div>

        <div className="mt-4">
          <div className="flex items-center text-sm text-gray-500">
            <Award className="h-4 w-4 mr-2" />
            <span>{birthday.discipline}</span>
          </div>
          
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <Mail className="h-4 w-4 mr-2" />
            <a href={`mailto:${birthday.contactInfo.email}`} className="hover:text-cultural-visuales">
              {birthday.contactInfo.email}
            </a>
          </div>
          
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <Phone className="h-4 w-4 mr-2" />
            <a href={`tel:${birthday.contactInfo.phone}`} className="hover:text-cultural-visuales">
              {birthday.contactInfo.phone}
            </a>
          </div>
        </div>

        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-900">Trayectoria</h4>
          <p className="mt-1 text-sm text-gray-500 line-clamp-3">{birthday.trajectory}</p>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Cumpleaños: {format(birthday.birthDate, "d 'de' MMMM", { locale: es })}
          </p>
        </div>
      </div>
    </div>
  );
};