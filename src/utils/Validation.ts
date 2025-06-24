export const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

export const isValidEmailId = (emailId: string): boolean => {
  const EMAIL_ID_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  return EMAIL_ID_REGEX.test(emailId);
};

export const isValidName = (name: string): boolean => {
  return name.trim().length >= 2;
};

export const isValidPassword = (password: string): boolean => {
  const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{10,}$/;
  return PASSWORD_REGEX.test(password);
};

export const isPasswordMatch = (
  password: string,
  passwordCheck: string,
): boolean => {
  return password === passwordCheck;
};

export const isValidPhone = (phone: string): boolean => {
  const PHONE_REGEX = /^01[016789]-\d{3,4}-\d{4}$/;
  return PHONE_REGEX.test(phone);
};

export const hasRequiredTerms = (
  agreementTerm: string[],
  required: string[] = ['age', 'service', 'privacy'],
): boolean => {
  return required.every(term => agreementTerm.includes(term));
};
