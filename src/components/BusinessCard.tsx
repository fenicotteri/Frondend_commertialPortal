import { Link } from 'react-router-dom';
import { BusinessProfile } from '../types';

interface BusinessCardProps {
  business: BusinessProfile;
}


const BusinessCard = ({ business }: BusinessCardProps) => {
  const contactInfo = business.contactInfo || {};

  return (
    <div className="card hover:shadow-lg transition-shadow duration-300">
      <div className="p-5">
        <div className="flex items-center mb-4">
          {business.logo && (
            <img 
              src={business.logo} 
              alt={business.companyName} 
              className="w-16 h-16 rounded-full mr-3"
            />
          )}
          <div>
            <h3 className="text-xl font-bold">{business.companyName}</h3>
          </div>
        </div>
        
        <p className="text-gray-600 mb-4">{business.description}</p>
        
        <div className="space-y-1 text-sm text-gray-500 mb-4">
  {contactInfo.email && <p>Email: {contactInfo.email}</p>}
  {contactInfo.phone && <p>Phone: {contactInfo.phone}</p>}
  {contactInfo.website && (
    <p>
      Website: <a href={`https://${contactInfo.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{contactInfo.website}</a>
    </p>
  )}
</div>

        
        <Link 
          to={`/business/${business.id}`}
          className="btn btn-primary inline-block"
        >
          View Posts
        </Link>
      </div>
    </div>
  );
};

export default BusinessCard;