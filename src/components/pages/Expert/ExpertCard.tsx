import { Heart, Star } from 'lucide-react';
import { useEffect, useState, type JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToggleBookmark } from '../../../hooks/useBookmarks';

interface Expert {
  id: number;
  name?: string;
  nickname?: string;
  tags?: string[];
  description: string;
  profileImage: string;
  rank?: number;
  rating?: number;
  reviewCount?: number;
  imgUrl: string;
  isLiked?: boolean;
}

interface ExpertCardProps {
  expert: Expert;
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
    nickname,
    tags = [],
    description,
    rating = 0,
    reviewCount = 0,
    imgUrl,
    isLiked = false,
  } = expert;

  const navigate = useNavigate();
  const toggleBookmarkMutation = useToggleBookmark();

  const [liked, setLiked] = useState<boolean>(isLiked);
  useEffect(() => setLiked(isLiked), [isLiked]);

  const rankColors: Record<number, string> = {
    1: 'bg-yellow-400',
    2: 'bg-gray-400',
    3: 'bg-[#CD7F32]',
  };
  const rankColor = rankColors[rank ?? 0] ?? 'bg-gray-300';
  const displayName = name ?? nickname ?? '엑스퍼트';

  const handleHeartClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const prev = liked;
    setLiked(!prev);
    try {
      await toggleBookmarkMutation.mutateAsync(id);
    } catch (err) {
      setLiked(prev);
      console.error('북마크 토글 실패', err);
    }
  };

  return (
    <div
      onClick={() => navigate(`/experts/${id}`)}
      className={`relative flex items-start p-4 border rounded-xl bg-white cursor-pointer ${
        variant === 'search' ? 'h-auto' : 'h-[120px]'
      }`}
    >
      <div className="relative mr-3 mt-2 shrink-0">
        <img
          src={imgUrl}
          alt={`${displayName}의 프로필`}
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

      <div className="flex-1 pr-8 py-2 overflow-hidden">
        <div className="flex gap-2">
          <p className="text-b1 font-semibold truncate">{displayName}</p>
          <div className="relative top-[6px] flex gap-1 text-xs text-gray-500 shrink-0 leading-none">
            {(tags ?? []).slice(0, 2).map(tag => (
              <span key={tag} className="leading-none">
                #{tag}
              </span>
            ))}
          </div>
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
          type="button"
          onClick={handleHeartClick}
          disabled={toggleBookmarkMutation.isPending}
          aria-pressed={liked}
          aria-label={liked ? '북마크 해제' : '북마크'}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center"
        >
          <Heart
            size={18}
            className={
              liked
                ? 'text-red-500 fill-red-500'
                : 'text-gray-300 fill-transparent'
            }
          />
        </button>
      )}
    </div>
  );
}
