import { useState } from 'react';
import LightBulbIcon from '../../../assets/icons/common/lightbulbIcon.png';
import QuizModal from './QuizModal';

const QUIZ_QUESTION = 'GDP는 무엇의 약자일까요?';
const QUIZ_OPTIONS = [
  '국내 총생산',
  '글로벌 개발 프로그램',
  '일반 국내 정책',
  '총역학적 힘',
];
const CORRECT_ANSWER = '국내 총생산';

export default function QuizCard() {
  const [selected, setSelected] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleCheck = () => {
    if (!selected) return;

    const correct = selected === CORRECT_ANSWER;
    setIsCorrect(correct);
    setShowModal(true);
  };

  return (
    <div className="relative my-14">
      <div className="absolute -top-10 left-1/2 -translate-x-1/2">
        <img src={LightBulbIcon} alt="quiz icon" className="w-24 h-24" />
      </div>

      <div className="bg-gradient-to-t from-[#6488FF] to-[#9FB6FF] rounded-xl pt-12 pb-6 px-4 my-6 mx-4 text-center shadow-md">
        <div className="text-sm font-medium text-white mb-1">
          지금 퀴즈 풀고, 포인트 적립받자!
        </div>

        <div className="text-[18px] font-bold mb-5 text-white">
          {QUIZ_QUESTION}
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          {QUIZ_OPTIONS.map(option => {
            const isSelected = selected === option;
            return (
              <button
                key={option}
                className={`border rounded-md py-2 px-1 text-sm transition-all duration-150 ${
                  isSelected
                    ? 'bg-white text-[#5A67D8] font-semibold border-[#5A67D8]'
                    : 'bg-white/15 text-white border-transparent'
                }`}
                onClick={() => setSelected(option)}
              >
                {option}
              </button>
            );
          })}
        </div>

        <button
          onClick={handleCheck}
          className={`w-full py-2 rounded-md text-sm font-semibold shadow-md border transition-all duration-150
            ${
              selected
                ? 'bg-white text-[#5A67D8] border-[#5A67D8]'
                : 'bg-white/15 text-black border-gray-200 hover:bg-gray-50'
            }`}
        >
          정답 확인하기
        </button>
      </div>

      {showModal && (
        <QuizModal correct={isCorrect} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}
