import React from 'react';
import { Dialog } from '@headlessui/react';
import { 
  WhatsappShareButton, 
  FacebookShareButton, 
  TwitterShareButton,
  WhatsappIcon,
  FacebookIcon,
  TwitterIcon
} from 'react-share';
import { X } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  text: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, title, text }) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg">
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

            {/* Share Options */}
            <div className="space-y-6">
              {/* Social Media Buttons */}
              <div className="flex justify-center space-x-4">
                <WhatsappShareButton url="" title={text}>
                  <WhatsappIcon size={40} round />
                </WhatsappShareButton>
                
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