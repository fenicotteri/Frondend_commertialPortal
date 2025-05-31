import React from 'react';
import { MapPin, Building } from 'lucide-react';
import { BusinessBranch } from '../types';
import './BranchCard.css';

interface BranchCardProps {
  branch: BusinessBranch;
}

const BranchCard: React.FC<BranchCardProps> = ({ branch }) => {
  const hasContent = branch.description || branch.location;

  const defaultImageUrl = 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80';

  return (
    <div className="branch-card">
      <div className="branch-card-image">
        <img 
          src={branch.imageUrl || defaultImageUrl} 
          alt={branch.description || 'Branch'} 
        />
      </div>

      <div className="branch-card-content">
        <div className="branch-card-header">
          <Building size={16} />
          <span>Branch</span>
        </div>

        {hasContent ? (
          <>
            <h3 className="branch-card-title">{branch.description || 'No Description'}</h3>
            <div className="branch-card-info">
              <InfoRow icon={<MapPin size={16} />} text={branch.location || 'No Location'} />
            </div>
          </>
        ) : (
          <div className="branch-card-empty">
            <p>No content available</p>
          </div>
        )}
      </div>
    </div>
  );
};

const InfoRow: React.FC<{ icon: React.ReactNode; text: string }> = ({ icon, text }) => (
  <div className="info-row">
    {icon}
    <span>{text}</span>
  </div>
);

export default BranchCard;
