import ScrollContainer from 'react-indiana-drag-scroll';
import { contents } from '../../../data/contentData';

export default function RecommendCard() {
  return (
    <div className="my-8 px-4">
      <h2 className="text-h2 my-2 px-4">오늘의 맞춤 콘텐츠</h2>
      <ScrollContainer
        className="flex gap-3 overflow-x-auto hide-scrollbar"
        horizontal
      >
        {contents.map(item => (
          <div
            key={item.id}
            className="min-w-[335px] h-[335px] mx-2 rounded-xl overflow-hidden relative shrink-0"
          >
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </ScrollContainer>
    </div>
  );
}
