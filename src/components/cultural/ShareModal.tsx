import React, { useRef } from 'react';
import { Dialog } from '@headlessui/react';
import { toPng } from 'html-to-image';
import { 
  WhatsappShareButton, 
  FacebookShareButton, 
  TelegramShareButton,
  TwitterShareButton,
  WhatsappIcon,
  FacebookIcon,
  TelegramIcon,
  TwitterIcon
} from 'react-share';
import { X, Download, Copy, Check } from 'lucide-react';
import type { CulturalEvent } from '../../types/cultural';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ShareModalProps {
  event?: CulturalEvent;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  text?: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({ event, isOpen, onClose, title, text }) => {
  const [copied, setCopied] = React.useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const eventUrl = event ? `${window.location.origin}/evento/${event.id}` : '';

  const shareMessage = event ? `
🎉 ¡Evento Cultural!

📢 ${event.title}
📅 ${format(event.date, "d 'de' MMMM", { locale: es })} | 🕒 ${format(event.date, 'HH:mm')}
📍 ${event.location}
👥 Público: ${event.targetAudience}
🎭 ${event.eventType} - ${event.discipline}

${event.description}

${event.cost.type === 'free' ? '🎟️ Entrada gratuita' : `💵 Precio: $${event.cost.amount}`}

🔗 Más información: ${eventUrl}
`.trim() : text;

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(shareMessage || '');
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
      link.download = `${event ? event.title : title || 'compartir'}.png`.toLowerCase().replace(/\s+/g, '-');
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
        <Dialog.Panel className="mx-auto max-w-2xl w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <Dialog.Title className="text-xl font-semibold text-gray-900 dark:text-white">
                Compartir {event ? 'Evento' : ''}
              </Dialog.Title>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400">
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Tarjeta de previsualización */}
            <div 
              ref={cardRef} 
              className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md mb-6"
            >
              {event ? (
                <>
                  {event.image?.data && (
                    <img
                      src={event.image.data}
                      alt={event.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{event.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">{event.description}</p>
                  
                  <div className="mt-4 space-y-2 text-sm text-gray-500 dark:text-gray-400">
                    <p>📅 {format(event.date, "d 'de' MMMM, yyyy", { locale: es })}</p>
                    <p>🕒 {format(event.date, 'HH:mm')}</p>
                    <p>📍 {event.location}</p>
                    <p>👥 {event.targetAudience}</p>
                    <p>🎭 {event.eventType} - {event.discipline}</p>
                    <p>{event.cost.type === 'free' ? '🎟️ Entrada gratuita' : `💵 Precio: $${event.cost.amount}`}</p>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
                    {text}
                  </p>
                </>
              )}
            </div>

            {/* Botones de compartir */}
            <div className="space-y-6">
              <div className="flex justify-center space-x-4">
                <WhatsappShareButton url={eventUrl} title={shareMessage}>
                  <WhatsappIcon size={40} round />
                </WhatsappShareButton>
                
                <TelegramShareButton url={eventUrl} title={shareMessage}>
                  <TelegramIcon size={40} round />
                </TelegramShareButton>
                
                <FacebookShareButton url={eventUrl} quote={shareMessage}>
                  <FacebookIcon size={40} round />
                </FacebookShareButton>
                
                <TwitterShareButton url={eventUrl} title={shareMessage}>
                  <TwitterIcon size={40} round />
                </TwitterShareButton>
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleCopyText}
                  className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                >
                  {copied ? (
                    <>
                      <Check className="h-5 w-5 mr-2 text-green-500" />
                      ¡Copiado!
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
                  className="flex items-center px-4 py-2 bg-cultural-escenicas text-white rounded-md hover:bg-cultural-escenicas/90"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Descargar imagen
                </button>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};