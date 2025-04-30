import React from 'react';
import { ThumbsUp, Heart, PartyPopper, Zap } from 'lucide-react';
import type { ReactionType } from '../../types/cultural';

interface ReactionButtonProps {
  type: ReactionType;
  count: number;
  onClick: () => void;
  className?: string;
}

export const ReactionButton: React.FC<ReactionButtonProps> = ({
  type,
  count,
  onClick,
  className = ''
}) => {
  const getIcon = () => {
    switch (type) {
      case 'like':
        return <ThumbsUp className="h-5 w-5" />;
      case 'love':
        return <Heart className="h-5 w-5" />;
      case 'celebrate':
        return <PartyPopper className="h-5 w-5" />;
      case 'interesting':
        return <Zap className="h-5 w-5" />;
    }
  };

  const getColor = () => {
    switch (type) {
      case 'like':
        return 'text-blue-500 hover:text-blue-600';
      case 'love':
        return 'text-red-500 hover:text-red-600';
      case 'celebrate':
        return 'text-yellow-500 hover:text-yellow-600';
      case 'interesting':
        return 'text-green-500 hover:text-green-600';
    }
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1 ${getColor()} ${className}`}
    >
      {getIcon()}
      <span className="text-sm">{count}</span>
    </button>
  );
};