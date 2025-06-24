import type { Megazine } from '../../../hooks/useSearch';

interface Props {
  megazine: Megazine;
}

export default function MegazineCard({ megazine }: Props) {
  return (
    <div className="flex items-start gap-3 py-2">
      <img
        src={megazine.thumbnail}
        alt={megazine.title}
        className="w-16 h-16 object-cover rounded-md"
      />
      <div className="flex-1 text-sm">
        <h3 className="font-medium text-gray-800 line-clamp-1">
          {megazine.title}
        </h3>
        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
          {megazine.description}
        </p>
        <p className="text-[11px] text-gray-400 mt-1">
          {megazine.author} · {megazine.date}
        </p>
      </div>
    </div>
  );
}
