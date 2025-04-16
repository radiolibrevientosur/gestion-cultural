import React, { useRef } from 'react';
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
  const [copied, setCopied] = React.useState(false);
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

  const handleDownloadImage = async () => {
    if (!cardRef.current) return;

    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 1.0,
        pixelRatio: 2
      });
      
      const link = document.createElement('a');
      link.download = `${event.title.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error al generar imagen:', err);
    }
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
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Tarjeta de preview */}
            <div
              ref={cardRef}
              className="bg-white p-6 rounded-lg shadow-md mb-6"
            >
              {event.image && (
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
              
              <h3 className="text-xl font-bold">{event.title}</h3>
              <p className="text-gray-600 mt-2">{event.description}</p>
              
              <div className="mt-4 space-y-2 text-sm text-gray-500">
                <p>📅 {format(event.date, "d 'de' MMMM, yyyy", { locale: es })}</p>
                <p>🕒 {format(event.date, 'HH:mm')}</p>
                <p>📍 {event.location}</p>
              </div>
            </div>

            {/* Opciones de compartir */}
            <div className="space-y-6">
              {/* Botones redes sociales */}
              <div className="flex justify-center space-x-4">
                <WhatsappShareButton title={shareText}>
                  <WhatsappIcon size={40} round />
                </WhatsappShareButton>
                
                <FacebookShareButton quote={shareText}>
                  <FacebookIcon size={40} round />
                </FacebookShareButton>
                
                <TwitterShareButton title={shareText} hashtags={['Cultura']}>
                  <TwitterIcon size={40} round />
                </TwitterShareButton>
              </div>

              {/* Botones de acción */}
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleCopyText}
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  {copied ? (
                    <>
                      <Check className="h-5 w-5 mr-2 text-green-500" />
                      <span>¡Texto copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-5 w-5 mr-2" />
                      <span>Copiar texto</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleDownloadImage}
                  className="flex items-center px-4 py-2 bg-cultural-escenicas text-white rounded-md hover:bg-cultural-escenicas/90"
                >
                  <Download className="h-5 w-5 mr-2" />
                  <span>Descargar imagen</span>
                </button>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
