import { createContext, useContext, ReactNode } from 'react';
import { Post } from '../types/index';
import { useAuth } from './AuthContext';

interface UserActionsContextType {
  toggleFavoritePost: (postId: number) => void;
  getFavorites: () => Post[];
  isFavorite: (postId: number) => boolean;
}

const UserActionsContext = createContext<UserActionsContextType | undefined>(undefined);

export const UserActionsProvider = ({ children }: { children: ReactNode }) => {
  const { authState } = useAuth();

  const toggleFavoritePost = (postId: number) => {
    if (!authState.user || !authState.user.clientProfile) return;

    const { clientProfile } = authState.user;

    const isAlreadyFavorite = clientProfile.favouritePosts.some(post => post.id === postId);

    if (isAlreadyFavorite) {
      // Удалить пост из избранного
      clientProfile.favouritePosts = clientProfile.favouritePosts.filter(post => post.id !== postId);
    } else {
      // Добавить пост в избранное (на реальном проекте ты бы делал запрос к API чтобы получить объект Post по id)
      clientProfile.favouritePosts.push({ id: postId } as Post); // Временно создаем пост только с id
    }
  };

  const getFavorites = (): Post[] => {
    if (!authState.user || !authState.user.clientProfile) return [];
    return authState.user.clientProfile.favouritePosts;
  };

  const isFavorite = (postId: number): boolean => {
    if (!authState.user || !authState.user.clientProfile) return false;
    return authState.user.clientProfile.favouritePosts.some(post => post.id === postId);
  };

  return (
    <UserActionsContext.Provider value={{ 
      toggleFavoritePost, 
      getFavorites, 
      isFavorite
    }}>
      {children}
    </UserActionsContext.Provider>
  );
};

export const useUserActions = () => {
  const context = useContext(UserActionsContext);
  if (context === undefined) {
    throw new Error('useUserActions must be used within a UserActionsProvider');
  }
  return context;
};
