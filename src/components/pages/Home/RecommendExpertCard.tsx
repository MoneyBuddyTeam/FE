import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import type { Expert } from '../../../types';

export default function RecommendExpertCard({ expert }: { expert: Expert }) {
  const [isLiked, setIsLiked] = useState(false);
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/experts/${expert.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="w-[148px] flex-shrink-0 bg-white rounded-lg p-3 relative cursor-pointer"
    >
      <div className="relative">
        <img
          src={expert.profile_image}
          alt={expert.nickname}
          className="w-full h-[148px] rounded-lg object-cover"
        />
        <button
          onClick={e => {
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          className="absolute top-2 right-2"
        >
          <Heart
            size={16}
            className={isLiked ? 'fill-red-500 text-red-500' : 'stroke-white'}
          />
        </button>
      </div>
      <div className="mt-2">
        <p className="text-sm font-semibold">{expert.nickname}</p>
        <p className="text-xs text-gray-500 flex items-center gap-1">
          <span className="text-pink-500">★ {expert.rating.toFixed(1)}</span>
          <span>({expert.review_count})</span>
        </p>
        <p className="text-xs text-gray-700 truncate">{expert.description}</p>
        <p className="text-sm font-bold mt-1">
          {expert.price.toLocaleString()}원{' '}
          <span className="text-xs text-gray-500">/1회</span>
        </p>
      </div>
    </div>
  );
}
