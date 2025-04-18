import React, { useRef, useState } from 'react';
import { Dialog } from '@headlessui/react';
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
import { toPng } from 'html-to-image';
import { Copy, Download, X } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  text: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, title, text }) => {
  const [copied, setCopied] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleDownloadImage = async () => {
    if (!contentRef.current) return;

    try {
      const dataUrl = await toPng(contentRef.current, {
        quality: 0.95,
        backgroundColor: 'white'
      });

      const link = document.createElement('a');
      link.download = `${title.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to generate image:', err);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <Dialog.Title className="text-xl font-semibold text-gray-900 dark:text-white">
                Compartir
              </Dialog.Title>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Preview Content */}
            <div 
              ref={contentRef}
              className="bg-white dark:bg-gray-700 p-4 rounded-lg mb-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
                {text}
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-6">
              {/* Copy and Download Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleCopyText}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <Copy className="h-4 w-4" />
                  {copied ? 'Copiado!' : 'Copiar texto'}
                </button>
                <button
                  onClick={handleDownloadImage}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Descargar imagen
                </button>
              </div>

              {/* Social Media Buttons */}
              <div className="flex justify-center gap-4">
                <WhatsappShareButton url="" title={text}>
                  <WhatsappIcon size={40} round />
                </WhatsappShareButton>
                
                <TelegramShareButton url="" title={text}>
                  <TelegramIcon size={40} round />
                </TelegramShareButton>
                
                <FacebookShareButton url="" quote={text}>
                  <FacebookIcon size={40} round />
                </FacebookShareButton>
                
                <TwitterShareButton url="" title={text}>
                  <TwitterIcon size={40} round />
                </TwitterShareButton>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};