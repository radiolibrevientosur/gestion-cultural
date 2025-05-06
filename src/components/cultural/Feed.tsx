import React, { useState, useEffect } from 'react';
import { useCultural } from '../../context/CulturalContext';
import { PostCard } from './PostCard';
import { EventCard } from './EventCard';
import { PressArticleCard } from './PressArticleCard';
import { QuickPost } from './QuickPost';
import { Filter, SlidersHorizontal } from 'lucide-react';
import type { Post, CulturalEvent, PressArticle } from '../../types/cultural';

interface FeedProps {
  userId?: string;
}

type FeedItem = (Post | CulturalEvent | PressArticle) & { type: 'post' | 'event' | 'article' };
type FilterType = 'all' | 'posts' | 'events' | 'articles';

export const Feed: React.FC<FeedProps> = ({ userId }) => {
  const { state } = useCultural();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      const items = getFeedItems();
      setFeedItems(items);
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [state, userId, activeFilter]);

  const getFeedItems = (): FeedItem[] => {
    let posts = state.posts.map(post => ({ ...post, type: 'post' as const }));
    let events = state.events.map(event => ({ ...event, type: 'event' as const }));
    let articles = state.pressArticles.map(article => ({ ...article, type: 'article' as const }));

    if (userId) {
      posts = posts.filter(post => post.userId === userId);
      events = events.filter(event => event.userId === userId);
      articles = articles.filter(article => article.userId === userId);
    }

    switch (activeFilter) {
      case 'posts':
        return posts;
      case 'events':
        return events;
      case 'articles':
        return articles;
      default:
        return [...posts, ...events, ...articles].sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        {[1, 2, 3].map((n) => (
          <div key={n} className="bg-gray-200 dark:bg-gray-700 h-48 rounded-lg"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {userId ? 'Publicaciones del Usuario' : 'Feed General'}
        </h2>
        <div className="relative">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <SlidersHorizontal className="h-5 w-5" />
          </button>
          
          {showFilters && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50">
              <button
                onClick={() => {
                  setActiveFilter('all');
                  setShowFilters(false);
                }}
                className={`w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  activeFilter === 'all' ? 'text-cultural-escenicas' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => {
                  setActiveFilter('posts');
                  setShowFilters(false);
                }}
                className={`w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  activeFilter === 'posts' ? 'text-cultural-escenicas' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                Publicaciones
              </button>
              <button
                onClick={() => {
                  setActiveFilter('events');
                  setShowFilters(false);
                }}
                className={`w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  activeFilter === 'events' ? 'text-cultural-escenicas' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                Eventos
              </button>
              <button
                onClick={() => {
                  setActiveFilter('articles');
                  setShowFilters(false);
                }}
                className={`w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  activeFilter === 'articles' ? 'text-cultural-escenicas' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                Artículos
              </button>
            </div>
          )}
        </div>
      </div>

      <QuickPost />

      <div className="space-y-6">
        {feedItems.length > 0 ? (
          feedItems.map(item => {
            switch (item.type) {
              case 'post':
                return <PostCard key={`post-${item.id}`} post={item} />;
              case 'event':
                return <EventCard key={`event-${item.id}`} event={item} />;
              case 'article':
                return <PressArticleCard key={`article-${item.id}`} article={item} />;
              default:
                return null;
            }
          })
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              {userId ? 'No hay publicaciones para mostrar' : 'No hay contenido disponible'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};