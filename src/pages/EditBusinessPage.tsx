import { useParams, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import BusinessForm from '../components/BusinessForm';
import { getBusinessById } from '../context/PostApi'; // исправленный импорт
import { BusinessProfile } from '../types/index';

const EditBusinessPage = () => {
  const { id } = useParams<{ id: string }>();
  const { authState } = useAuth();

  const [business, setBusiness] = useState<BusinessProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusiness = async () => {
      if (!id) return;

      try {
        const fetchedBusiness = await getBusinessById(Number(id));
        setBusiness(fetchedBusiness);
      } catch (error) {
        console.error('Ошибка загрузки бизнеса', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusiness();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!business) {
    return <Navigate to="/businesses" />;
  }

  const isAuthorized = authState.isAuthenticated &&
                       authState.isBusinessOwner &&
                       authState.ownedBusinessId === business.id;

  if (!isAuthorized) {
    return <Navigate to={`/business/${business.id}`} />;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Business Profile</h1>
        <BusinessForm business={business} />
      </div>
    </div>
  );
};

export default EditBusinessPage;
