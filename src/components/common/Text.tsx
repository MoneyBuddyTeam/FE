import { type ReactNode } from 'react';

export type TextType = 'H1' | 'H2' | 'H3' | 'H4' | 'B1' | 'B2' | 'B3' | 'B4';

interface TextProps {
  type: TextType;
  children: ReactNode;
  className?: string;
}

const textStyles: Record<TextType, string> = {
  H1: 'text-xl font-bold',
  H2: 'text-lg font-semibold',
  H3: 'text-base font-medium',
  H4: 'text-sm font-medium',
  B1: 'text-base font-normal',
  B2: 'text-sm font-normal',
  B3: 'text-xs font-normal',
  B4: 'text-xs font-light',
};

export default function Text({ type, children, className = '' }: TextProps) {
  const baseStyles = textStyles[type];
  const combinedStyles = `${baseStyles} ${className}`.trim();

  return <span className={combinedStyles}>{children}</span>;
}
