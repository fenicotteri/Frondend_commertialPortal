import { useParams, Navigate } from 'react-router-dom';
import PostForm from '../components/PostForm';
import { useAuth } from '../context/AuthContext';
import { getPostById, getBusinessById } from '../context/PostApi'; // ИМПОРТИРУЙ реальный API-запрос
import { useEffect, useState } from 'react';
import { Post } from '../types/index';

const EditPostPage = () => {
  const { id } = useParams<{ id: string }>();
  const { authState } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      try {
        const fetchedPost = await getPostById(Number(id)); // ПРИВОДИМ id к числу
        setPost(fetchedPost);
      } catch (error) {
        console.error('Ошибка загрузки поста', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!post) {
    return <Navigate to="/" />;
  }

  // Проверка прав редактирования
  const isAuthorized = authState.isAuthenticated &&
                        authState.isBusinessOwner &&
                        authState.ownedBusinessId === post.businessId; // ПРАВИЛЬНОЕ ПОЛЕ

  if (!isAuthorized) {
    return <Navigate to={`/post/${post.id}`} />;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Post</h1>
        <PostForm initialData={{
          title: post.title,
          content: post.content,
          type: post.type,
          imageUrl: post.imageUrl,
          startDate: post.startDate,
          endDate: post.endDate,
          location: post.location,
          discount: post.discount,
        }} />
      </div>
    </div>
  );
};

export default EditPostPage;
