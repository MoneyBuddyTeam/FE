interface PopularPostCardProps {
  title: string;
  likes: number;
  comments: number;
}

export default function PopularPostCard({
  title,
  likes,
  comments,
}: PopularPostCardProps) {
  return (
    <div className="p-3 bg-white rounded-xl shadow-sm">
      <p className="text-sm font-medium text-black mb-1 line-clamp-1">
        {title}
      </p>
      <span className="text-xs text-gray-500">
        좋아요 {likes} · 댓글 {comments}
      </span>
    </div>
  );
}
