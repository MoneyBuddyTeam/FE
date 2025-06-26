import Footer from '../components/layout/Footer';
import EcomoicTermBanner from '../components/pages/Home/EcomoicTermBanner';
import HomeExpertList from '../components/pages/Home/HomeExpertList';
import PromotionCard from '../components/pages/Home/PromotionCard';
import QuizCard from '../components/pages/Home/QuizCard';
import GoldBar from '../assets/icons/common/goldbarIcon.png';
import Megaphone from '../assets/icons/common/megaphoneIcon.png';
import Bucket from '../assets/icons/common/bucket.png';
import PiggyBank from '../assets/icons/common/piggyBank.png';
import MegazineList from '../components/pages/Home/MegazineList';
import RecommendedCard from '../components/pages/Home/RecommendCard';
import ScrollContainer from 'react-indiana-drag-scroll';

export default function HomePage() {
  return (
    <div>
      <HomeExpertList />
      <RecommendedCard />
      <MegazineList />
      <QuizCard />
      <EcomoicTermBanner />
      <ScrollContainer
        className="scroll-container hide-scrollbar flex gap-3 px-3 overflow-x-auto"
        vertical={false}
        horizontal={true}
      >
        <PromotionCard
          text={'지금 바로 엑스퍼트와\n1:1 상담 받아보세요'}
          page="1 / 2"
          bgColor="bg-[#EAF0FF]"
          images={[GoldBar, Megaphone]}
        />
        <PromotionCard
          text={'지금 퀴즈 풀고\n포인트도 벌어보자!'}
          page="2 / 2"
          bgColor="bg-[#F3E8FF]"
          images={[Bucket, PiggyBank]}
        />
      </ScrollContainer>
      <Footer />
    </div>
  );
}
