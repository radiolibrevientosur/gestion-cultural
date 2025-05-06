import React, { useState } from 'react';
import { Smile } from 'lucide-react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import type { CustomReaction } from '../../types/cultural';

interface CustomReactionsProps {
  reactions: CustomReaction[];
  onAddReaction: (emoji: string, name: string) => void;
}

export const CustomReactions: React.FC<CustomReactionsProps> = ({
  reactions,
  onAddReaction
}) => {
  const [showPicker, setShowPicker] = useState(false);

  const handleEmojiSelect = (emoji: any) => {
    onAddReaction(emoji.native, emoji.name);
    setShowPicker(false);
  };

  return (
    <div className="flex items-center gap-2">
      {reactions.map(reaction => (
        <button
          key={reaction.id}
          onClick={() => onAddReaction(reaction.emoji, reaction.name)}
          className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <span>{reaction.emoji}</span>
          <span className="text-sm">{reaction.count}</span>
        </button>
      ))}
      
      <div className="relative">
        <button
          onClick={() => setShowPicker(!showPicker)}
          className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <Smile className="h-5 w-5" />
        </button>
        
        {showPicker && (
          <div className="absolute bottom-full right-0 mb-2 z-50">
            <Picker
              data={data}
              onEmojiSelect={handleEmojiSelect}
              theme={document.documentElement.classList.contains('dark') ? 'dark' : 'light'}
            />
          </div>
        )}
      </div>
    </div>
  );
};