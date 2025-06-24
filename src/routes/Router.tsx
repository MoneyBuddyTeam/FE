// src/routes/Router.tsx
import { Routes, Route } from 'react-router-dom';
import DefaultLayout from '../components/layout/DefaultLayout';
import PublicLayout from '../components/layout/PublicLayout';
import PrivateRoute from './PrivateRoute';

// Pages
import HomePage from '../pages/Homepage';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import FindAccountPage from '../components/pages/auth/FindAccountPage';
import ResetPasswordVerifyPage from '../pages/Find/ResetPasswordVerifyPage';
import ResetPasswordForm from '../components/pages/auth/ResetPasswordForm';
import ExpertPage from '../pages/Expert/ExpertPage';
import MyPage from '../pages/MyPage';
import SettingsPage from '../pages/SettingsPage';
import PasswordChangePage from '../pages/PasswordChangePage';
import ExpertListPage from '../pages/Expert/ExpertListPage';
import ExpertDetailPage from '../pages/Expert/ExpertDetailPage';
import SearchPage from '../pages/Search/SearchPage';
import PaymentPage from '../pages/Payment/PaymentPage';
import PaymentSuccessPage from '../pages/Payment/PaymentSuccessPage';
import PaymentFailPage from '../pages/Payment/PaymentFailPage';
import ReservationPage from '../pages/ReservationPage';
import ReservationListPage from '../pages/Reservation/ReservationListPage';
import ReservationDetailPage from '../pages/Reservation/ReservationDetailPage';
import ConsultationHistoryPage from '../pages/Consultation/ConsultationHistoryPage';
import ConsultationDetailPage from '../pages/Consultation/ConsultationDetailPage';
import ConsultationChatPage from '../pages/Consultation/ConsultationChatPage';
import BookmarkedExpertsPage from '../pages/Bookmarks/BookmarkedExpertsPage';
import ChallengeStatusPage from '../pages/Challenge/ChallengeStatusPage';
import ChallengeDetailPage from '../pages/Challenge/ChallengeDetailPage';
import WithdrawPage from '../pages/WithdrawPage';
import AccountRecoveryPage from '../pages/auth/AccountRecoveryPage';
import ChallengeCreatePage from '../pages/admin/ChallengeCreatePage';

// Reservation sub-pages
import ConcernSelectPage from '../pages/Reservation/ConcernSelectPage';
import EnterConcernPage from '../pages/Reservation/EnterConcernPage';
import SelectSchedulePage from '../pages/Reservation/SelectSchedulePage';
import SelectTimePage from '../pages/Reservation/SelectTimePage';
import ConsultationRoomPage from '../pages/Chat/ConsultationRoomPage';
import SearchResultPage from '../pages/Search/SearchResultPage';

export default function Router() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PrivateRoute>
            <DefaultLayout>
              <HomePage />
            </DefaultLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/login"
        element={
          <PublicLayout>
            <LoginPage />
          </PublicLayout>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicLayout>
            <SignupPage />
          </PublicLayout>
        }
      />
      <Route
        path="/find-account"
        element={
          <DefaultLayout>
            <FindAccountPage />
          </DefaultLayout>
        }
      />
      <Route
        path="/reset-password-verify"
        element={
          <DefaultLayout>
            <ResetPasswordVerifyPage />
          </DefaultLayout>
        }
      />
      <Route
        path="/reset-password"
        element={
          <DefaultLayout>
            <ResetPasswordForm />
          </DefaultLayout>
        }
      />
      <Route
        path="/expert"
        element={
          <PrivateRoute>
            <DefaultLayout>
              <ExpertPage />
            </DefaultLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/mypage"
        element={
          <PrivateRoute>
            <DefaultLayout>
              <MyPage />
            </DefaultLayout>
          </PrivateRoute>
        }
      />{' '}
      <Route
        path="/settings"
        element={
          <PrivateRoute>
            <DefaultLayout>
              <SettingsPage />
            </DefaultLayout>
          </PrivateRoute>
        }
      />{' '}
      <Route
        path="/password-change"
        element={
          <PrivateRoute>
            <PasswordChangePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/experts-list"
        element={
          <PrivateRoute>
            <DefaultLayout>
              <ExpertListPage />
            </DefaultLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/experts/:id"
        element={
          <PrivateRoute>
            <ExpertDetailPage />
          </PrivateRoute>
        }
      />
      {/* 예약 관련 라우트 */}
      <Route
        path="/reservation"
        element={
          <PrivateRoute>
            <ReservationPage />
          </PrivateRoute>
        }
      >
        <Route path="step1" element={<ConcernSelectPage />} />
        <Route path="step2" element={<EnterConcernPage />} />
        <Route path="step3" element={<SelectSchedulePage />} />
        <Route path="step4" element={<SelectTimePage />} />
      </Route>
      <Route
        path="/search"
        element={
          <PrivateRoute>
            <SearchPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/search/result"
        element={
          <PrivateRoute>
            <SearchResultPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/payment"
        element={
          <PrivateRoute>
            <PaymentPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/payment/:expertId"
        element={
          <PrivateRoute>
            <PaymentPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/payment/success"
        element={
          <PrivateRoute>
            <PaymentSuccessPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/payment/fail"
        element={
          <PrivateRoute>
            <PaymentFailPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/reserve"
        element={
          <PrivateRoute>
            <ReservationListPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/reserve/detail/:id"
        element={
          <PrivateRoute>
            <ReservationDetailPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/consultation/history"
        element={
          <PrivateRoute>
            <ConsultationHistoryPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/consultation/detail/:id"
        element={
          <PrivateRoute>
            <ConsultationDetailPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/bookmarked/experts"
        element={
          <PrivateRoute>
            <BookmarkedExpertsPage />
          </PrivateRoute>
        }
      />{' '}
      <Route
        path="/challenge/status"
        element={
          <PrivateRoute>
            <ChallengeStatusPage />
          </PrivateRoute>
        }
      />{' '}
      <Route
        path="/challenge/:id"
        element={
          <PrivateRoute>
            <ChallengeDetailPage />
          </PrivateRoute>
        }
      />{' '}
      <Route
        path="/consultation/chat/:id"
        element={
          <PrivateRoute>
            <ConsultationChatPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/withdraw"
        element={
          <PrivateRoute>
            <WithdrawPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/consultation/rooms/:roomId"
        element={
          <PrivateRoute>
            <ConsultationRoomPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/account-recovery"
        element={
          <PublicLayout>
            <AccountRecoveryPage />
          </PublicLayout>
        }
      />
      <Route
        path="/admin/challenges/create"
        element={
          <PrivateRoute>
            <ChallengeCreatePage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
