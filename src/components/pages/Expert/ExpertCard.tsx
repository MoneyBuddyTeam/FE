import { Star } from 'lucide-react';
import type { MonthlyExpert } from '../../../types/api/expert/expert';
import HeartIcon from '../../../assets/icons/common/heart.png';
import HeartEmptyIcon from '../../../assets/icons/common/heartEmpty.png';
import { useExpertStore } from '../../../stores/useExpertStore';
import type { JSX } from 'react';

interface ExpertCardProps {
  expert: MonthlyExpert;
}

export default function ExpertCard({ expert }: ExpertCardProps): JSX.Element {
  const {
    id,
    rank,
    name,
    tags,
    description,
    rating,
    reviewCount,
    imgUrl,
    isLiked = false,
  } = expert;

  const toggleLike = useExpertStore(state => state.toggleLike);

  const rankColors: Record<number, string> = {
    1: 'bg-yellow-400',
    2: 'bg-gray-400',
    3: 'bg-[#CD7F32]',
  };
  const rankColor = rankColors[rank] ?? 'bg-gray-300';

  return (
    <div className="relative flex items-start p-3 border rounded-xl bg-white h-[120px]">
      <div className="relative mr-3 mt-2 shrink-0">
        <img
          src={imgUrl}
          alt={`${name}의 프로필`}
          className="w-14 h-14 rounded-full object-cover"
        />
        <div
          className={`absolute -top-2 -left-2 w-6 h-6 flex items-center justify-center rounded-full text-white text-xs font-bold ${rankColor}`}
        >
          {rank}
        </div>
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
        <div className="text-xs mt-1 flex items-center gap-1 text-pink-500 font-semibold">
          <Star className="w-4 h-4 fill-pink-500 stroke-pink-500" />
          <span>{rating.toFixed(1)}</span>
          <span className="text-gray-500 font-normal">({reviewCount})</span>
        </div>
      </div>

      <button
        onClick={() => toggleLike(id)}
        className="absolute right-3 top-1/2 -translate-y-1/2"
      >
        <img
          src={isLiked ? HeartIcon : HeartEmptyIcon}
          alt="하트 아이콘"
          className="w-5 h-5"
        />
      </button>
    </div>
  );
}
