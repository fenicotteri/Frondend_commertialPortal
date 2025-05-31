import { useEffect, useState } from 'react';
import BusinessCard from '../components/BusinessCard';
import { BusinessProfile } from '../types/index';
import { getBusinessesApi } from '../context/PostApi'; // реальный API запрос

const BusinessesPage = () => {
  const [businesses, setBusinesses] = useState<BusinessProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const data = await getBusinessesApi();
        setBusinesses(data);
      } catch (error) {
        console.error('Ошибка загрузки бизнесов', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Businesses
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Discover businesses sharing their events, promotions, and discounts on our platform.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {businesses.map(business => (
          <BusinessCard key={business.id} business={business} />
        ))}
      </div>
    </div>
  );
};

export default BusinessesPage;
