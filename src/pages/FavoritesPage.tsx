import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../Store/store';
import PostCard from '../components/PostCard';
import { Link } from 'react-router-dom';
import axiosClient from '../context/axiosClient';
import { Post } from '../types';

const FavoritesPage = () => {
  const allPosts = useSelector((state: RootState) => state.posts.allPosts);
  const [favouriteIds, setFavouriteIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const res = await axiosClient.get<number[]>('/api/Post/favourites');
        setFavouriteIds(res.data);
      } catch (error) {
        console.error('Ошибка при загрузке избранных:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavourites();
  }, []);

  const favouritePosts: Post[] = allPosts.filter(post => favouriteIds.includes(post.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Ваши избранные публикации
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Здесь отображаются посты, которые вы добавили в избранное.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">Загрузка избранных...</div>
      ) : favouritePosts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-medium text-gray-600">Пока пусто</h3>
          <p className="text-gray-500 mt-2 mb-4">Вы ещё не добавили посты в избранное.</p>
          <Link to="/" className="btn btn-primary">
            Перейти ко всем постам
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favouritePosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
