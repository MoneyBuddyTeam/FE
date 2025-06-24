import ScrollContainer from 'react-indiana-drag-scroll';
import { banners } from '../../../data/contentData';

export default function BannerSlideList() {
  return (
    <div className="my-6 px-4">
      <ScrollContainer
        className="flex gap-3 overflow-x-auto hide-scrollbar"
        horizontal
      >
        {banners.map(item => (
          <div
            key={item.id}
            className="min-w-[300px] h-[190px] mx-1 rounded-xl overflow-hidden relative shrink-0 flex items-center justify-center bg-gray-100"
          >
            <img
              src={item.imageUrl}
              alt={item.title}
              className="h-full w-full object-contain"
            />
          </div>
        ))}
      </ScrollContainer>
    </div>
  );
}
