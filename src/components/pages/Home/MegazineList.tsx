import { useState } from 'react';
import MegazineTab from './MegazineTab';
import MegazineCard from './MegazineCard';
import megazine1 from '../../../assets/images/megazine_1.png';
import megazine2 from '../../../assets/images/megazine_2.png';
import megazine3 from '../../../assets/images/megazine_3.png';
import PopularPostCard from './PopularPostCard';

export default function MegazineList() {
  const [active, setActive] = useState<'magazine' | 'popular'>('magazine');

  const magazineData = [
    {
      thumbnail: megazine1,
      category: '투자',
      title: '미국장, 국내장 뭐가 다른가요?',
      author: '한채현',
      date: '2024.06.11',
    },
    {
      thumbnail: megazine2,
      category: '부동산',
      title: '뉴스에 나오는 종부세에 대해 알아보자',
      author: '박재현',
      date: '2024.06.14',
    },
    {
      thumbnail: megazine3,
      category: '세금',
      title: '세금 모두 알차게 둘러받아볼까요?',
      author: '이지영',
      date: '2024.06.11',
    },
  ];

  const popularData = [
    {
      title: 'ETF 고민이 있어서 글을 올렸어요. 말걸부탁!!',
      likes: 90,
      comments: 23,
    },
    {
      title: '적금 처음에 뭐부터 드는게 좋을까요?',
      likes: 45,
      comments: 11,
    },
    {
      title: '곧이 퇴직연금 들어야하나요? 요즘 하도 인기래서....',
      likes: 60,
      comments: 35,
    },
    {
      title: '투자 처음 시작하는 주린이 입니다. 조언 구합니다.',
      likes: 80,
      comments: 12,
    },
  ];

  return (
    <div className="px-4 py-5 bg-[#F5F5F5]">
      <MegazineTab active={active} onChange={setActive} />

      <div className="flex flex-col gap-3">
        {active === 'magazine' ? (
          <>
            {magazineData.map((item, idx) => (
              <MegazineCard key={idx} {...item} />
            ))}
            <div className="border rounded-xl p-4 bg-white">
              <button className="w-full text-center text-b2 font-semibold text-[#111111]">
                매거진 더 보러가기
              </button>
            </div>
          </>
        ) : (
          <>
            {popularData.map((item, idx) => (
              <PopularPostCard key={idx} {...item} />
            ))}
            <div className="border rounded-xl p-4 bg-white">
              <button className="w-full text-center text-b2 font-semibold text-[#111111]">
                인기글 더 보러가기
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
