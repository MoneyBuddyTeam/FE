import { Star } from 'lucide-react';
import HeartIcon from '../../../assets/icons/common/heart.png';
import HeartEmptyIcon from '../../../assets/icons/common/heartEmpty.png';
import { useExpertStore } from '../../../stores/useExpertStore';
import type { MonthlyExpert } from '../../../types/api/expert/expert';
import type { JSX } from 'react';
import { useNavigate } from 'react-router-dom';

interface Expert {
  id: number;
  name: string;
  tags: string[];
  description: string;
  profileImage: string;
  rank?: number;
  rating?: number;
  reviewCount?: number;
  imgUrl: string;
  isLiked?: boolean;
}

interface ExpertCardProps {
  expert: MonthlyExpert | Expert;
  variant?: 'monthly' | 'search';
}

export default function ExpertCard({
  expert,
  variant = 'monthly',
}: ExpertCardProps): JSX.Element {
  const {
    id,
    rank,
    name,
    tags,
    description,
    rating = 0,
    reviewCount = 0,
    imgUrl,
    isLiked = false,
  } = expert;

  const toggleLike = useExpertStore(state => state.toggleLike);
  const navigate = useNavigate();

  const rankColors: Record<number, string> = {
    1: 'bg-yellow-400',
    2: 'bg-gray-400',
    3: 'bg-[#CD7F32]',
  };
  const rankColor = rankColors[rank ?? 0] ?? 'bg-gray-300';

  return (
    <div
      onClick={() => navigate(`/experts/${id}`)}
      className={`relative flex items-start p-3 border rounded-xl bg-white cursor-pointer ${
        variant === 'search' ? 'h-auto' : 'h-[120px]'
      }`}
    >
      <div className="relative mr-3 mt-2 shrink-0">
        <img
          src={imgUrl}
          alt={`${name}의 프로필`}
          className="w-14 h-14 rounded-full object-cover"
        />
        {variant === 'monthly' && rank !== undefined && (
          <div
            className={`absolute -top-2 -left-2 w-6 h-6 flex items-center justify-center rounded-full text-white text-xs font-bold ${rankColor}`}
          >
            {rank}
          </div>
        )}
      </div>

      <div className="flex-1 pr-8 overflow-hidden">
        <p className="text-b1 font-semibold truncate">{name}</p>
        <div className="flex flex-wrap gap-[4px] text-xs text-gray-500 mb-1">
          {tags.map(tag => (
            <span key={tag}>#{tag}</span>
          ))}
        </div>
        <p className="text-sm text-gray-800 break-words line-clamp-2">
          {description}
        </p>

        {variant === 'monthly' && (
          <div className="text-xs mt-1 flex items-center gap-1 text-pink-500 font-semibold">
            <Star className="w-4 h-4 fill-pink-500 stroke-pink-500" />
            <span>{rating.toFixed(1)}</span>
            <span className="text-gray-500 font-normal">({reviewCount})</span>
          </div>
        )}
      </div>

      {variant === 'monthly' && (
        <button
          onClick={e => {
            e.stopPropagation();
            toggleLike(id);
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2"
        >
          <img
            src={isLiked ? HeartIcon : HeartEmptyIcon}
            alt="하트 아이콘"
            className="w-5 h-5"
          />
        </button>
      )}
    </div>
  );
}
