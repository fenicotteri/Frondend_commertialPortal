import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { CalendarIcon, MapPinIcon, TagIcon, HeartIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { useAuth } from '../context/AuthContext';
import { useUserActions } from '../context/UserActionsContext';
import { getBusinessById, getPostById, registerPromoCopy } from '../context/PostApi';
import { Post, BusinessProfile } from '../types/index';

const PostDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { authState } = useAuth();
  const { toggleFavoritePost, isFavorite } = useUserActions();

  const [post, setPost] = useState<Post | null>(null);
  const [business, setBusiness] = useState<BusinessProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        const fetchedPost = await getPostById(Number(id));
        setPost(fetchedPost);

        if (fetchedPost) {
          const fetchedBusiness = await getBusinessById(fetchedPost.businessId);
          setBusiness(fetchedBusiness);
        }
      } catch (error) {
        console.error('Ошибка загрузки данных', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">Загрузка...</div>;
  }

  if (!post) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Публикация не найдена</h2>
        <p className="text-gray-600 mb-6">Возможно, публикация была удалена или никогда не существовала.</p>
        <Link to="/" className="btn btn-primary">
          На главную
        </Link>
      </div>
    );
  }

  const favorite = isFavorite(post.id);

  const isOwner = authState.isAuthenticated &&
                  authState.isBusinessOwner &&
                  authState.ownedBusinessId === post.businessId;

  const getPostTypeColor = (type: typeof post.type) => {
    switch (type) {
      case 'event':
        return 'bg-purple-100 text-purple-800';
      case 'promotion':
        return 'bg-blue-100 text-blue-800';
      case 'discount':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleFavoriteClick = () => {
    toggleFavoritePost(post.id);
  };

  const handleDelete = async () => {
    if (window.confirm('Вы уверены, что хотите удалить эту публикацию?')) {
      navigate('/');
    }
  };

  const handlePromoCopy = async () => {
    try {
      navigator.clipboard.writeText(post.discount!.code!);
      await registerPromoCopy(post.id);
      alert('Промокод скопирован!');
    } catch (err) {
      console.error(err);
      alert('Ошибка при копировании промокода');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {post.imageUrl && (
          <div className="h-64 sm:h-80 overflow-hidden">
            <img 
              src={post.imageUrl} 
              alt={post.title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-6">
          <div className="flex items-center mb-4">
            {business?.logo && (
              <img 
                src={business.logo} 
                alt={business.companyName} 
                className="w-10 h-10 rounded-full mr-3"
              />
            )}
            <div>
              <Link to={`/business/${business?.id}`} className="text-lg font-medium text-blue-600 hover:underline">
                {business?.companyName}
              </Link>
            </div>
            <span className={`ml-auto px-3 py-1 rounded-full text-sm font-medium ${getPostTypeColor(post.type)}`}>
              {post.type === 'event' ? 'Событие' : post.type === 'promotion' ? 'Акция' : 'Скидка'}
            </span>
          </div>

          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{post.title}</h1>

            {isOwner && (
              <div className="flex space-x-2">
                <Link 
                  to={`/post/${post.id}/edit`}
                  className="p-2 text-gray-500 hover:text-blue-600"
                  title="Редактировать публикацию"
                >
                  <PencilIcon className="h-5 w-5" />
                </Link>
                <button 
                  onClick={handleDelete}
                  className="p-2 text-gray-500 hover:text-red-600"
                  title="Удалить публикацию"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4 mb-6 text-gray-600">
            <div className="flex items-center">
              <CalendarIcon className="h-5 w-5 mr-1" />
              <span>
                {post.startDate && format(parseISO(post.startDate), 'd MMM yyyy')}
                {post.endDate && ` - ${format(parseISO(post.endDate), 'd MMM yyyy')}`}
              </span>
            </div>

            {post.location && (
              <div className="flex items-center">
                <MapPinIcon className="h-5 w-5 mr-1" />
                <span>{post.location}</span>
              </div>
            )}

            {post.discount?.percentage ? (
              <div className="flex items-center">
                <TagIcon className="h-5 w-5 mr-1" />
                <span>{post.discount.percentage}% скидка</span>
              </div>
            ) : null}

            {post.discount?.code?.trim() && (
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <p className="text-green-800 font-medium">Промокод:</p>
                <div className="mt-2 flex items-center">
                  <code className="bg-white px-3 py-1 rounded border border-green-300 text-lg font-mono">
                    {post.discount.code}
                  </code>
                  <button
                    onClick={handlePromoCopy}
                    className="ml-2 text-sm text-blue-600 hover:text-blue-800"
                  >
                    Копировать
                  </button>
                </div>
              </div>
            )}
          </div>

          {authState.isAuthenticated && !authState.isBusinessOwner && (
            <div className="flex space-x-4 mb-6">
              <button 
                onClick={handleFavoriteClick}
                className={`flex items-center px-3 py-1 rounded-md ${
                  favorite 
                    ? 'bg-red-100 text-red-700' 
                    : 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600'
                }`}
              >
                {favorite ? (
                  <HeartIconSolid className="h-5 w-5 mr-1" />
                ) : (
                  <HeartIcon className="h-5 w-5 mr-1" />
                )}
                <span>{favorite ? 'В избранном' : 'Добавить в избранное'}</span>
              </button>
            </div>
          )}

          <div className="prose max-w-none mb-8">
            <p className="text-gray-700 whitespace-pre-line">{post.content}</p>
          </div>

          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            {post.createdAt && (
              <p className="text-sm text-gray-500">
                Создан: {format(parseISO(post.createdAt), 'd MMM yyyy')}
              </p>
            )}
            <div className="flex space-x-3">
              <Link to="/" className="btn btn-secondary">
                На главную
              </Link>
              {business && (
                <Link to={`/business/${business.id}`} className="btn btn-primary">
                  Больше от {business.companyName}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage;
