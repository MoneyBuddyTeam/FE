import type { ButtonHTMLAttributes, JSX } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'disabled' | 'text' | 'text2';
}

export default function Button({
  children,
  variant = 'primary',
  className = '',
  disabled,
  ...props
}: ButtonProps): JSX.Element {
  const styleSet = {
    primary: `
      w-[350px] h-[46px]
      rounded-[4px]
      px-[22px] py-[14px]
      text-white
      bg-primary
    `,
    secondary: `
      w-[350px] h-[46px]
      rounded-[4px]
      px-[22px] py-[14px]
      border border-[#6790FF]
      bg-white text-primary
    `,
    disabled: `
      w-[350px] h-[46px]
      rounded-[4px]
      px-[22px] py-[14px]
      text-white
      bg-[#DBDBDB]
      cursor-not-allowed
    `,
    text: `
			text-primary
			text-h4
			bg-transparent
		`,
    text2: `
			text-[#777777]
			text-h4
		`,
  };

  return (
    <button
      {...props}
      disabled={disabled || variant === 'disabled'}
      className={`${styleSet[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
