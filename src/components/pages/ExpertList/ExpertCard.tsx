import { COMMA_NUMBER_FORMAT } from '../../../utils';
import type { Expert } from '../../../types/expert';
import Text from '../../common/Text';
import { Star, Heart } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToggleBookmark } from '../../../hooks/useBookmarks';

interface ExpertCardProps {
  expert: Expert;
  isMonthly?: boolean;
  isLoading?: boolean;
  isBookmarked?: boolean;
}

export default function ExpertCard({
  expert,
  isMonthly = false,
  isLoading,
  isBookmarked = false,
}: ExpertCardProps) {
  const navigate = useNavigate();
  const [localBookmarkState, setLocalBookmarkState] = useState(isBookmarked);
  const toggleBookmarkMutation = useToggleBookmark();

  const handleCardClick = () => {
    navigate(`/experts/${expert.id}`);
  };

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      setLocalBookmarkState(!localBookmarkState);

      await toggleBookmarkMutation.mutateAsync(expert.id);
    } catch (error) {
      setLocalBookmarkState(localBookmarkState);
      console.error('북마크 토글 실패:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-[200px] bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  if (isMonthly) {
    return (
      <div
        className="w-[148px] flex-shrink-0 cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="h-[267px] rounded-lg p-3">
          <div className="relative">
            <img
              src={expert.profile_image}
              alt={expert.nickname}
              className="w-full h-[148px] rounded-lg object-cover"
            />
            <button
              onClick={handleLikeClick}
              className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center"
              disabled={toggleBookmarkMutation.isPending}
            >
              <Heart
                size={16}
                className={
                  localBookmarkState
                    ? 'fill-red-500 text-red-500'
                    : 'stroke-white'
                }
              />
            </button>
          </div>

          <div className="mt-3">
            <div className="flex items-center gap-1">
              <Text
                type="B2"
                className="font-semibold text-[14px] leading-[130%] tracking-[0%] flex items-center"
              >
                {expert.nickname}
              </Text>
              <div className="flex items-center gap-1">
                <Star
                  size={10}
                  className="text-[#FF7497] fill-[#FF7497] flex-shrink-0"
                />
                <div className="flex items-center">
                  <span className="text-[12px] leading-[100%] tracking-[0%] flex items-center text-[#111111]">
                    {expert.rating}
                  </span>
                  <span className="text-[12px] leading-[100%] tracking-[0%] flex items-center text-[#9C9C9C]">
                    ({expert.review_count})
                  </span>
                </div>
              </div>
            </div>
            <Text
              type="B3"
              className="mt-1 font-normal text-[14px] leading-[130%] tracking-[-2%] flex items-center text-[#777777] line-clamp-1"
            >
              {expert.bio}
            </Text>
            <div className="mt-2 flex items-center">
              <span className="font-semibold text-[14px] leading-[130%] tracking-[0%] flex items-center text-[#000000]">
                {COMMA_NUMBER_FORMAT(expert.price || 0)}원
              </span>
              <span className="font-normal text-[12px] leading-[130%] tracking-[0%] text-[#777777] flex items-center">
                /회
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="p-4 border-b border-stroke cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="flex gap-4">
        <img
          src={expert.profile_image}
          alt={expert.nickname}
          className="w-[100px] h-[100px] rounded-lg object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-[5px]">
              <Text type="B2">{expert.nickname}</Text>
              <div className="flex flex-wrap gap-1">
                {expert.hashtags?.map((tag: string) => (
                  <Text
                    key={tag}
                    type="B3"
                    className="font-normal text-[9px] leading-[130%] tracking-[-2%] align-middle text-[#777777]"
                  >
                    #{tag}
                  </Text>
                ))}
              </div>
            </div>
            <button
              onClick={handleLikeClick}
              className="w-8 h-8 flex items-center justify-center"
              disabled={toggleBookmarkMutation.isPending}
            >
              <Heart
                size={20}
                className={
                  localBookmarkState ? 'fill-red-500 text-red-500' : ''
                }
              />
            </button>
          </div>

          <Text
            type="B3"
            className="mt-0 font-normal text-[14px] leading-[130%] tracking-[-2%] align-middle text-[#777777] line-clamp-1"
          >
            {expert.description}
          </Text>
          <div className="flex items-center gap-1 mt-2">
            <div className="flex items-center gap-1">
              <Star
                size={16}
                className="text-[#FF7497] fill-[#FF7497] flex-shrink-0"
              />
              <div className="flex items-center gap-1">
                <span className="text-[12px] leading-[100%] tracking-[0%] flex items-center text-[#111111]">
                  {expert.rating}
                </span>
                <span className="text-[12px] leading-[100%] tracking-[0%] flex items-center text-[#9C9C9C]">
                  ({expert.review_count})
                </span>
              </div>
            </div>
          </div>
          <div className="mt-2 flex items-center">
            <span className="font-semibold text-[14px] leading-[130%] tracking-[0%] align-middle text-[#000000]">
              {COMMA_NUMBER_FORMAT(expert.price || 0)}원
            </span>
            <span className="font-normal text-[12px] leading-[130%] tracking-[0%] align-middle text-[#777777]">
              /1회
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
