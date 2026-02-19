import { type JSX, useMemo } from 'react';
import { signupApi } from '../../../services/auth/signupApi';
import SignupHeader from './SignupHeader';
import InputField from './InputField';
import EmailDropdown from './EmailDropdown';
import TermsAgreement from './TermAgreement';
import Button from '../../common/Button';
import {
  isPasswordMatch,
  isValidEmailId,
  isValidName,
  isValidPassword,
  isValidPhone,
  hasRequiredTerms,
} from '../../../utils/Validation';
import { useSignupStore } from '../../../stores/useSignupStore';
import { useNavigate } from 'react-router-dom';
import { formatPhoneNumber } from '../../../utils';

export default function SignupPage(): JSX.Element {
  const {
    name,
    phone,
    email,
    domain,
    password,
    passwordCheck,
    agreementTerm,
    errors,
    setErrorForField,
    clearErrors,
    setName,
    setPhone,
    setEmail,
    setDomain,
    setPassword,
    setPasswordCheck,
    setAgreementTerm,
    resetSignup,
  } = useSignupStore();

  const navigate = useNavigate();
  const allTermId = ['all', 'age', 'service', 'privacy', 'marketing'];

  const handleTermCheck = (id: string, checked: boolean) => {
    if (id === 'all') {
      setAgreementTerm(checked ? [...allTermId] : []);
    } else {
      const next = checked
        ? [...new Set([...agreementTerm, id])]
        : agreementTerm.filter(item => item !== id);

      const individualIds = allTermId.filter(term => term !== 'all');
      const isAllChecked = individualIds.every(term => next.includes(term));

      const updatedTerms = isAllChecked
        ? [...new Set([...next, 'all'])]
        : next.filter(term => term !== 'all');

      setAgreementTerm(updatedTerms);
    }
  };

  const isFormValid = useMemo(() => {
    return (
      isValidName(name) &&
      isValidPhone(phone) &&
      isValidEmailId(email, domain) &&
      domain.trim().length > 0 &&
      isValidPassword(password) &&
      isPasswordMatch(password, passwordCheck) &&
      hasRequiredTerms(agreementTerm)
    );
  }, [name, phone, email, domain, password, passwordCheck, agreementTerm]);

  const handleSubmit = async () => {
    clearErrors();

    if (!isFormValid) {
      alert('모든 필드를 올바르게 입력해주세요.');
      return;
    }

    try {
      const fullEmail = `${email}@${domain}`;
      await signupApi({
        name,
        phone,
        email: fullEmail,
        password,
        agreementTerm,
      });
      alert('회원가입 성공');
      navigate('/');
      resetSignup();
    } catch (error) {
      alert('회원가입 실패');
    }
  };

  return (
    <div>
      <SignupHeader title="이름을" description="정확한 이름을 입력해주세요" />

      {email && domain && (
        <>
          <InputField
            id="password"
            type="password"
            label="비밀번호"
            value={password}
            hasToggle
            onChange={e => {
              const value = e.target.value;
              setPassword(value);
              setErrorForField(
                'password',
                isValidPassword(value)
                  ? ''
                  : '특수문자, 영문, 숫자를 포함해 10자 이상이어야 합니다.',
              );
            }}
            errorMessage={errors.password}
            placeholder="특수문자, 영문, 숫자 포함 10자 이상"
          />
          <InputField
            id="passwordcheck"
            type="password"
            label="비밀번호 확인"
            value={passwordCheck}
            hasToggle
            onChange={e => {
              const value = e.target.value;
              setPasswordCheck(value);
              setErrorForField(
                'passwordCheck',
                isPasswordMatch(password, value)
                  ? ''
                  : '비밀번호가 일치하지 않습니다.',
              );
            }}
            errorMessage={errors.passwordCheck}
            placeholder="비밀번호 확인"
          />
        </>
      )}

      {phone && (
        <div className="flex items-start gap-2">
          <div className="flex-1">
            <InputField
              id="email"
              type="email"
              label="이메일"
              value={email}
              onChange={e => {
                const value = e.target.value;
                setEmail(value);
                if (domain) {
                  setErrorForField(
                    'email',
                    isValidEmailId(value, domain)
                      ? ''
                      : '이메일 형식이 올바르지 않습니다.',
                  );
                }
              }}
              errorMessage={errors.email}
              placeholder="이메일을 입력해주세요."
            />
          </div>
          <div className="mt-[25px]">
            <EmailDropdown
              selected={domain}
              onSelect={selected => {
                setDomain(selected);
                if (email) {
                  setErrorForField(
                    'email',
                    isValidEmailId(email, selected)
                      ? ''
                      : '이메일 형식이 올바르지 않습니다.',
                  );
                }
              }}
            />
          </div>
        </div>
      )}

      {name && (
        <InputField
          id="phone"
          label="휴대폰 번호"
          value={phone}
          onChange={e => {
            const rawValue = e.target.value;
            const formattedValue = formatPhoneNumber(rawValue);
            setPhone(formattedValue);
            setErrorForField(
              'phone',
              isValidPhone(formattedValue)
                ? ''
                : '유효한 휴대폰 번호를 입력해주세요.',
            );
          }}
          errorMessage={errors.phone}
          placeholder="휴대폰번호를 입력해주세요."
        />
      )}

      <InputField
        id="name"
        label="이름"
        value={name}
        onChange={e => {
          const value = e.target.value;
          setName(value);
          setErrorForField(
            'name',
            isValidName(value) ? '' : '이름은 2자 이상 입력해주세요.',
          );
        }}
        errorMessage={errors.name}
        placeholder="예) 홍길동"
      />

      {email && domain && (
        <TermsAgreement
          checkedItems={agreementTerm}
          onCheck={handleTermCheck}
        />
      )}

      <div className="p-5 mt-4">
        <Button
          onClick={handleSubmit}
          disabled={!isFormValid}
          variant={!isFormValid ? 'disabled' : 'primary'}
        >
          입력완료
        </Button>
      </div>
    </div>
  );
}
