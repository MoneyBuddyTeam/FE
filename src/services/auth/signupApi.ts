import { axiosInstance } from '../api';
import { API_ENDPOINTS } from '../../config/api';
import type { SignupRequest, SignupResponse } from '../../types/auth';

export const signupApi = async (
  data: SignupRequest,
): Promise<SignupResponse> => {
  console.log('📝 회원가입 API 호출');
  const response = await axiosInstance.post(API_ENDPOINTS.signup, data);
  console.log('✅ 회원가입 성공');
  return response.data;
};

// 이메일 중복 확인
export const checkEmailDuplicate = async (email: string): Promise<boolean> => {
  const response = await axiosInstance.get('/api/v1/auth/check-email', {
    params: { email },
  });
  return response.data.isDuplicate;
};

// 닉네임 중복 확인
export const checkNicknameDuplicate = async (
  nickname: string,
): Promise<boolean> => {
  const response = await axiosInstance.get('/api/v1/auth/check-nickname', {
    params: { nickname },
  });
  return response.data.isDuplicate;
};

interface VerificationResponse {
  message: string;
  expiresIn: number; // 인증번호 만료 시간 (초)
}

interface VerifyCodeResponse {
  isValid: boolean;
  message: string;
}

// 인증번호 발송
export const sendVerificationCode = async (
  email: string,
): Promise<VerificationResponse> => {
  console.log('📧 인증번호 발송 API 호출');
  try {
    const response = await axiosInstance.post(
      '/api/v1/auth/send-verification',
      {
        email,
        type: 'SIGNUP', // 회원가입용 인증번호
      },
    );
    console.log('✅ 인증번호 발송 성공');
    return response.data;
  } catch (error: any) {
    console.error('❌ 인증번호 발송 실패:', error);
    if (error.response?.status === 429) {
      throw new Error(
        '인증번호 발송 횟수가 초과되었습니다. 잠시 후 다시 시도해주세요.',
      );
    }
    throw new Error('인증번호 발송에 실패했습니다. 다시 시도해주세요.');
  }
};

// 인증번호 확인
export const verifyCode = async (
  email: string,
  code: string,
): Promise<VerifyCodeResponse> => {
  console.log('🔍 인증번호 확인 API 호출');
  try {
    const response = await axiosInstance.post('/api/v1/auth/verify-code', {
      email,
      code,
      type: 'SIGNUP',
    });
    console.log('✅ 인증번호 확인 성공');
    return response.data;
  } catch (error: any) {
    console.error('❌ 인증번호 확인 실패:', error);
    if (error.response?.status === 400) {
      throw new Error('유효하지 않은 인증번호입니다.');
    }
    if (error.response?.status === 408) {
      throw new Error(
        '인증번호가 만료되었습니다. 새로운 인증번호를 요청해주세요.',
      );
    }
    throw new Error('인증번호 확인에 실패했습니다. 다시 시도해주세요.');
  }
};
