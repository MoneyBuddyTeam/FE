import { type JSX } from 'react';
import Button from './Button';

interface BottomButtonsProps {
  leftLabel?: string;
  rightLabel?: string;
  leftVariant?: 'primary' | 'secondary' | 'disabled' | 'text' | 'text2';
  rightVariant?: 'primary' | 'secondary' | 'disabled' | 'text' | 'text2';
  onLeftClick?: () => void;
  onRightClick?: () => void;
  leftDisabled?: boolean;
  rightDisabled?: boolean;
}

export default function BottomButtons({
  leftLabel,
  rightLabel,
  leftVariant = 'primary',
  rightVariant = 'primary',
  onLeftClick,
  onRightClick,
  leftDisabled,
  rightDisabled,
}: BottomButtonsProps): JSX.Element {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-white px-4 py-3 my-2 ">
      <div className="w-full max-w-md mx-auto flex gap-2">
        <Button
          variant={leftDisabled ? 'disabled' : leftVariant}
          onClick={onLeftClick}
          className="flex-1 h-[46px] flex items-center justify-center border"
          disabled={leftDisabled}
        >
          {leftLabel}
        </Button>
        <Button
          variant={rightDisabled ? 'disabled' : rightVariant}
          onClick={onRightClick}
          className="flex-1 h-[46px] flex items-center justify-center border"
          disabled={rightDisabled}
        >
          {rightLabel}
        </Button>
      </div>
    </div>
  );
}
