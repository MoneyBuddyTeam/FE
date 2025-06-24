import { MessageCircle, Eye } from 'lucide-react';
import type { CommunityPost } from '../../../hooks/useSearch';

interface Props {
  post: CommunityPost;
}

export default function CommunityCard({ post }: Props) {
  return (
    <div className="py-3 border-b last:border-b-0">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-800 font-medium line-clamp-1">
          {post.title}
        </p>
        {post.badge && (
          <span className="text-xs text-white bg-blue-500 px-2 py-0.5 rounded-full">
            {post.badge}
          </span>
        )}
      </div>
      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Eye size={14} />
          <span>{post.views}</span>
        </div>
        <div className="flex items-center gap-1">
          <MessageCircle size={14} />
          <span>{post.comments}</span>
        </div>
      </div>
    </div>
  );
}
