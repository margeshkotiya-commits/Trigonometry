import React, { useState, useEffect, useCallback } from 'react';
import { Trophy, Star, CheckCircle2, XCircle, Target } from 'lucide-react';
import { ActiveFunctions } from './TrigSimulation';
import { SPECIAL_ANGLES_DATA } from '../lib/trig';

const OPTIONS = [
  '0', '1', '-1', 
  '1/2', '-1/2', 
  '√2/2', '-√2/2', 
  '√3/2', '-√3/2', 
  '√3', '-√3', 
  '√3/3', '-√3/3', 
  'Undefined'
];

interface Props {
  setAngle: (angle: number) => void;
  setActiveFunctions: (funcs: ActiveFunctions) => void;
}

export default function GamePanel({ setAngle, setActiveFunctions }: Props) {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | 'win' | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const generateQuestion = useCallback(() => {
    const randomAngle = SPECIAL_ANGLES_DATA[Math.floor(Math.random() * SPECIAL_ANGLES_DATA.length)];
    let func = 'sin';
    if (level === 2) func = 'cos';
    if (level === 3) func = 'tan';

    setCurrentQuestion({
      angle: randomAngle.deg,
      func,
      answer: randomAngle[func as keyof typeof randomAngle]
    });
    
    setAngle((randomAngle.deg * Math.PI) / 180);
    setActiveFunctions({
      sin: func === 'sin',
      cos: func === 'cos',
      tan: func === 'tan'
    });
    
    setFeedback(null);
    setSelectedAnswer(null);
  }, [level, setAngle, setActiveFunctions]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    generateQuestion();
  }, [level, generateQuestion]);

  const handleGuess = (guess: string) => {
    if (feedback) return;
    setSelectedAnswer(guess);
    
    const isCorrect = guess === currentQuestion.answer;
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    
    if (isCorrect) setScore(s => s + 100);
    
    setTimeout(() => {
      if (progress + 1 >= 5) {
        if (level < 3) {
          setLevel(l => l + 1);
          setProgress(0);
        } else {
          setFeedback('win');
        }
      } else {
        setProgress(p => p + 1);
        generateQuestion();
      }
    }, 1500);
  };

  const resetGame = () => {
    setLevel(1);
    setScore(0);
    setProgress(0);
    generateQuestion();
  };

  if (feedback === 'win') {
    return (
      <div className="bg-white rounded-2xl shadow-md p-5 w-full max-w-sm flex flex-col items-center justify-center gap-4 text-center border border-slate-100 h-full">
        <Trophy className="w-16 h-16 text-yellow-500 mb-2" />
        <h2 className="text-2xl font-bold text-slate-800">You Win!</h2>
        <p className="text-slate-600">Final Score: {score}</p>
        <button 
          onClick={resetGame}
          className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
        >
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-3 sm:p-4 md:p-5 w-full max-w-sm flex flex-col gap-2 sm:gap-3 md:gap-4 font-sans border border-slate-100 h-full">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-100 pb-2 sm:pb-3 shrink-0">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Target className="text-indigo-500 w-4 h-4 sm:w-5 sm:h-5" />
          <h2 className="text-base sm:text-lg font-bold text-slate-800">Practice</h2>
        </div>
        <div className="flex items-center gap-1 bg-amber-100 text-amber-700 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg font-bold text-xs sm:text-sm">
          <Star className="w-3 h-3 sm:w-4 sm:h-4" /> {score}
        </div>
      </div>

      {/* Level & Progress */}
      <div className="shrink-0">
        <div className="flex justify-between text-xs sm:text-sm font-semibold text-slate-500 mb-1 sm:mb-2">
          <span>Level {level}: {level === 1 ? 'Sine' : level === 2 ? 'Cosine' : 'Tangent'}</span>
          <span>{progress}/5</span>
        </div>
        <div className="w-full bg-slate-100 h-1.5 sm:h-2 rounded-full overflow-hidden">
          <div 
            className="bg-indigo-500 h-full transition-all duration-300"
            style={{ width: `${(progress / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="bg-slate-50 rounded-xl p-2 sm:p-4 text-center border border-slate-100 shrink-0">
        <p className="text-xs sm:text-sm text-slate-500 font-medium mb-0.5 sm:mb-1">What is the value of</p>
        <p className="text-xl sm:text-3xl font-bold text-slate-800">
          {currentQuestion?.func}({currentQuestion?.angle}°)
        </p>
      </div>

      {/* Feedback */}
      {feedback && (feedback === 'correct' || feedback === 'incorrect') && (
        <div className={`p-2 sm:p-3 rounded-xl flex items-center justify-center gap-1.5 sm:gap-2 font-bold text-sm sm:text-base shrink-0 ${
          feedback === 'correct' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {feedback === 'correct' ? (
            <><CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" /> Correct! +100</>
          ) : (
            <><XCircle className="w-4 h-4 sm:w-5 sm:h-5" /> Incorrect. It was {currentQuestion?.answer}</>
          )}
        </div>
      )}

      {/* Options Grid */}
      <div className="grid grid-cols-2 gap-1.5 sm:gap-2 mt-auto overflow-y-auto pb-1">
        {OPTIONS.map(opt => {
          let btnClass = "py-1.5 sm:py-2 px-1 rounded-lg border font-medium text-xs sm:text-sm transition-all hover:bg-slate-50 hover:border-indigo-300 ";
          
          if (selectedAnswer === opt) {
            if (feedback === 'correct') {
              btnClass = "py-2 px-1 rounded-lg border-2 border-green-500 bg-green-50 text-green-700 font-bold ";
            } else if (feedback === 'incorrect') {
              btnClass = "py-2 px-1 rounded-lg border-2 border-red-500 bg-red-50 text-red-700 font-bold ";
            }
          } else if (feedback === 'incorrect' && opt === currentQuestion?.answer) {
            btnClass = "py-2 px-1 rounded-lg border-2 border-green-500 bg-green-50 text-green-700 font-bold animate-pulse ";
          } else {
            btnClass += "bg-white border-slate-200 text-slate-700 ";
          }

          return (
            <button
              key={opt}
              disabled={!!feedback}
              onClick={() => handleGuess(opt)}
              className={btnClass}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
