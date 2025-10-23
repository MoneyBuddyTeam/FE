import dayjs from 'dayjs';

export function formatPhoneNumber(phoneNumber: string): string {
  // 숫자만 남기고 모두 제거
  const cleaned = phoneNumber.replace(/\D/g, '');

  // 길이에 따라 포맷팅
  if (cleaned.length <= 3) {
    return cleaned;
  } else if (cleaned.length <= 7) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
  } else {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7, 11)}`;
  }
}

/**
 * 숫자에 콤마 추가 (예: 10000 -> 10,000)
 */
export const COMMA_NUMBER_FORMAT = (number: number | string): string => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * 통화 형식으로 포맷팅 (예: 10000 -> 10,000)
 */
export const formatCurrency = (number: number | string): string => {
  return Number(number).toLocaleString('ko-KR');
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('ko-KR');
};

export const truncateText = (text: string, maxLength: number): string => {
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

export function formatConsultationRange(
  selectedDate: string | null,
  selectedTime: string | null,
  totalMinutes: number,
): string {
  if (!selectedDate || !selectedTime) return '';
  const start = dayjs(`${selectedDate} ${selectedTime}`);
  if (!start.isValid()) return '';

  const end = start.add(totalMinutes, 'minute');
  const fmt = (d: dayjs.Dayjs) => d.format('A hh : mm');

  return `${fmt(start)} ~ ${fmt(end)}`;
}
