import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';
import BranchCard from '../components/BranchCard';
import { useAuth } from '../context/AuthContext';
import { getBusinessById, getPostsApi, getBranchesByBusinessId } from '../context/PostApi';
import { BusinessProfile, Post } from '../types/index';

const BusinessDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { authState } = useAuth();
  const [business, setBusiness] = useState<BusinessProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
  
      try {
        const businessData = await getBusinessById(Number(id));
        const branchesData = await getBranchesByBusinessId(Number(id));
        const allPosts = await getPostsApi();
  
        setBusiness({
          ...businessData,
          branches: branchesData
        });
  
        setPosts(allPosts.filter(post => post.businessId === businessData.id));
      } catch (error) {
        console.error('Ошибка загрузки данных', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [id]);
  

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">Loading...</div>;
  }

  if (!business) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Business not found</h2>
        <p className="text-gray-600 mb-6">The business you're looking for doesn't exist or has been removed.</p>
        <Link to="/businesses" className="btn btn-primary">
          View All Businesses
        </Link>
      </div>
    );
  }

  const isOwner = authState.isAuthenticated &&
                  authState.isBusinessOwner &&
                  authState.ownedBusinessId === business.id;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center">
          {business.logo && (
            <img 
              src={business.logo} 
              alt={business.companyName} 
              className="w-24 h-24 rounded-full mb-4 md:mb-0 md:mr-6"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{business.companyName}</h1>
          </div>
          <div className="mt-6 md:mt-0 md:ml-auto">
            {isOwner ? (
              <div className="space-y-2">
                <Link 
                  to={`/business/${business.id}/edit`}
                  className="btn btn-secondary block text-center"
                >
                  Редактировать данные
                </Link>
                <Link 
                  to="/create-post"
                  className="btn btn-primary block text-center"
                >
                  Создать публикацию
                </Link>
              </div>
            ) : (
              authState.isAuthenticated && authState.isBusinessOwner ? null : (
                <div className="text-sm text-gray-500">
                  <p>Нравится этот бизнес? начни сделить за ним</p>
                  <Link to="/login" className="text-blue-600 hover:underline">Войти</Link>
                  {' или '}
                  <Link to="/register" className="text-blue-600 hover:underline">Регистрация</Link>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {business.branches && business.branches.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Филиалы</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {business.branches.map(branch => (
              <BranchCard key={branch.id} branch={branch} />
            ))}
          </div>
        </div>
      )}

      <h2 className="text-2xl font-bold text-gray-900 mb-6">Публикации от {business.companyName}</h2>

      {posts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-medium text-gray-600">Нет публикаций</h3>
          <p className="text-gray-500 mt-2 mb-4">Этот бизнес пока не добавил ни одной публикации.</p>
          {isOwner && (
            <Link 
              to="/create-post"
              className="btn btn-primary"
            >
              Создать первую публикацию
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BusinessDetailPage;
