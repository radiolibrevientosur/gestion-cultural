import React, { useRef, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { toPng } from 'html-to-image';
import { 
  WhatsappShareButton, 
  FacebookShareButton, 
  TwitterShareButton,
  WhatsappIcon,
  FacebookIcon,
  TwitterIcon
} from 'react-share';
import { X, Download, Copy, Check } from 'lucide-react';
import type { CulturalEvent } from '../../types/cultural';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ShareModalProps {
  event: CulturalEvent;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ event, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Texto completo para compartir
  const shareText = `
📢 ${event.title}
📅 ${format(event.date, "d 'de' MMMM", { locale: es })} | 🕒 ${format(event.date, 'HH:mm')}
📍 ${event.location}
${event.description}
  `.trim();

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  const handleDownloadImage = () => {
    if (!cardRef.current) return;

    toPng(cardRef.current, {
      quality: 1,
      pixelRatio: 2,
      cacheBust: true,
    })
    .then((dataUrl) => {
      const link = document.createElement('a');
      link.download = `${event.title.toLowerCase().replace(/\s/g, '-')}-flyer.png`;
      link.href = dataUrl;
      link.click();
    })
    .catch((error) => {
      console.error('Error al generar la imagen:', error);
    });
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-2xl w-full bg-white rounded-xl shadow-lg">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <Dialog.Title className="text-xl font-semibold">
                Compartir Evento
              </Dialog.Title>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Tarjeta para descarga */}
            <div ref={cardRef} className="bg-white p-6 rounded-lg shadow-md mb-6">
              {event.image && (
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
              
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-gray-900">{event.title}</h3>
                <p className="text-gray-600">{event.description}</p>
                
                <div className="mt-4 space-y-1 text-sm text-gray-700">
                  <p>📅 {format(event.date, "d 'de' MMMM yyyy", { locale: es })}</p>
                  <p>🕒 {format(event.date, 'HH:mm')} horas</p>
                  <p>📍 {event.location}</p>
                </div>
              </div>
            </div>

            {/* Controles de compartir */}
            <div className="space-y-4">
              <div className="flex justify-center gap-4">
                <WhatsappShareButton title={shareText}>
                  <WhatsappIcon size={40} round className="hover:opacity-80 transition-opacity" />
                </WhatsappShareButton>
                
                <FacebookShareButton quote={shareText}>
                  <FacebookIcon size={40} round className="hover:opacity-80 transition-opacity" />
                </FacebookShareButton>
                
                <TwitterShareButton title={shareText}>
                  <TwitterIcon size={40} round className="hover:opacity-80 transition-opacity" />
                </TwitterShareButton>
              </div>

              <div className="flex justify-center gap-4">
                <button
                  onClick={handleCopyText}
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="h-5 w-5 mr-2 text-green-600" />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="h-5 w-5 mr-2" />
                      Copiar texto
                    </>
                  )}
                </button>

                <button
                  onClick={handleDownloadImage}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Descargar flyer
                </button>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
