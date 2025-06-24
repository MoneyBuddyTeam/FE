export interface User {
  id: number;
  nickname: string;
  role: string;
  email?: string;
  profile_image?: string;
  name?: string;
  phone?: string;
  created_at?: string;
  updated_at?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
  // MSW 모드용 토큰 구조 지원
  tokens?: {
    access_token: string;
    refresh_token: string;
  };
}

export interface FindIdRequest {
  name: string;
  phone: string;
}

export interface FindIdResponse {
  email: string;
  joinDate: string;
}

export interface RequestResetPasswordRequest {
  email: string;
}

export interface VerifyResetCodeRequest {
  email: string;
  code: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface SignupRequest {
  name: string;
  phone: string;
  email: string;
  password: string;
  agreementTerm: string[];
}

export interface SignupResponse {
  message: string;
  user?: User;
}

export interface UpdateUserRequest {
  nickname?: string;
  profile_image?: string;
}

export interface UpdateUserResponse {
  id: number;
  nickname: string;
  profile_image: string;
}

// 공개 프로필 응답 타입 추가
export interface PublicProfileResponse {
  userId: number;
  nickname: string;
  profileImage: string;
}

// 계정 복구 요청/응답 타입 추가
export interface RecoverAccountRequest {
  email: string;
}

export interface RecoverAccountResponse {
  id: number;
  email: string;
  nickname: string;
  phone: string;
  profileImage: string;
  role: string;
  loginMethod: string;
}

// 토큰 재발급 응답 타입 추가
export interface RefreshTokenResponse {
  message: string;
}

// 상담 상태 변경 타입 추가
export interface UpdateConsultationStatusRequest {
  userId: number;
  newStatus: 'REQUESTED' | 'SCHEDULED' | 'COMPLETED';
}

// 챌린지 생성 타입 추가
export interface CreateChallengeRequest {
  title: string;
  description: string;
}

export interface CreateChallengeResponse {
  id: number;
  title: string;
  description: string;
  createdAt: string;
}

// 비밀번호 변경 타입 추가
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  message: string;
}

// 비밀번호 확인 타입 추가
export interface VerifyPasswordRequest {
  password: string;
}

export interface VerifyPasswordResponse {
  verified: boolean;
  message: string;
}

// 탈퇴용 비밀번호 확인 타입 추가
export interface VerifyPasswordWithdrawRequest {
  password: string;
}

export interface VerifyPasswordWithdrawResponse {
  message: string;
}

// 아이디 찾기 타입 추가
export interface FindIdByEmailRequest {
  email: string;
}

export interface FindIdByPhoneRequest {
  name: string;
  phone: string;
}

export interface FindIdSuccessResponse {
  found_id: string;
  message: string;
}

// 소셜 로그인 타입 추가
export interface SocialLoginRequest {
  authCode: string;
}

export interface SocialLoginResponse {
  user: User;
  tokens: {
    access_token: string;
    refresh_token: string;
  };
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}
