import type { JSX } from 'react';

interface PromotionCardProps {
  text: string;
  page?: string;
  bgColor?: string;
  images: string[];
}

export default function PromotionCard({
  text,
  page,
  bgColor = 'bg-[#D4DFFF]',
  images,
}: PromotionCardProps): JSX.Element {
  return (
    <div
      className={`relative h-24 w-[370px] flex-shrink-0 rounded-lg p-3 mt-6 mb-10 ${bgColor}`}
    >
      <div className="text-h3 leading-[1.3] text-[#6488FF] whitespace-pre-line z-10 relative">
        {text}
      </div>
      {images[0] && (
        <img
          src={images[0]}
          alt="icon-1"
          className="absolute bottom-11 right-[60px] w-[76px] h-auto"
        />
      )}
      {images[1] && (
        <img
          src={images[1]}
          alt="icon-2"
          className="absolute bottom-1 -right-1 w-32 h-auto"
        />
      )}
      {page && (
        <div className="absolute bottom-2 right-2 w-[32px] h-[20px] bg-black opacity-40 text-white text-[10px] flex items-center justify-center rounded-full z-10">
          {page}
        </div>
      )}
    </div>
  );
}
