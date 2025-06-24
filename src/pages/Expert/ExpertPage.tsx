import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader';
import PageWrapper from '../../components/layout/PageWrapper';
import CategoryNav from '../../components/pages/Expert/CategoryNav';
import MonthlyExpertList from '../../components/pages/Expert/MonthlyExpertList';
import BannerSlideList from '../../components/pages/Expert/BannerSlideList';
import RecentReviewList from '../../components/pages/Expert/RecentReviewList';

export default function ExpertPage() {
  const navigate = useNavigate();
  return (
    <PageWrapper>
      <PageHeader
        title="머니버디 엑스퍼트"
        showBackButton={false}
        rightButtonLabel="상담내역"
        onRightLabelClick={() => navigate('/')}
      />
      <CategoryNav />
      <MonthlyExpertList />
      <BannerSlideList />
      <RecentReviewList />
    </PageWrapper>
  );
}
