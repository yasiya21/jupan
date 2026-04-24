import React, { useState, useEffect } from 'react';
import { QuizQuestion } from '../types';
import { SW_QUIZ_POOL } from '../constants';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, ChevronRight, HelpCircle } from 'lucide-react';

interface SWQuizProps {
  onComplete: () => void;
}

export const SWQuiz: React.FC<SWQuizProps> = ({ onComplete }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    // Pick 5 random questions
    const shuffled = [...SW_QUIZ_POOL].sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, 5));
  }, []);

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedIdx(idx);
  };

  const handleCheck = () => {
    if (selectedIdx === null) return;
    setIsAnswered(true);
    if (selectedIdx === questions[currentIdx].correctIdx) {
      setScore(score + 1);
      playSound('correct');
    } else {
      playSound('wrong');
    }
  };

  const playSound = (type: 'correct' | 'wrong') => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      if (type === 'correct') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.exponentialRampToValueAtTime(1046.5, ctx.currentTime + 0.1); // C6
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(146.83, ctx.currentTime); // D3
        osc.frequency.linearRampToValueAtTime(110, ctx.currentTime + 0.2); // A2
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      }
    } catch (e) {
      console.error('Audio error:', e);
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelectedIdx(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  if (questions.length === 0) return null;

  const currentQuestion = questions[currentIdx];

  if (showResult) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-8 rounded-3xl shadow-xl border-4 border-indigo-100 text-center max-w-2xl mx-auto"
      >
        <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center text-white mx-auto mb-6 shadow-lg">
          <HelpCircle size={40} />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">학습 결과</h2>
        <p className="text-xl text-gray-600 mb-8">
          5문제 중 <span className="text-indigo-600 font-bold">{score}</span>문제를 맞혔어요!
        </p>
        <button
          onClick={onComplete}
          className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-colors shadow-md flex items-center gap-2 mx-auto"
        >
          다음 미션으로 가기 <ChevronRight size={20} />
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6 flex justify-between items-center text-gray-500 font-medium px-2">
        <span>퀴즈 {currentIdx + 1} / 5</span>
        <span>점수: {score}</span>
      </div>

      <motion.div
        key={currentIdx}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white p-8 rounded-3xl shadow-xl border-4 border-indigo-100"
      >
        <h3 className="text-2xl font-bold text-gray-800 mb-8 leading-tight">
          {currentQuestion.question}
        </h3>

        <div className="space-y-4 mb-8">
          {currentQuestion.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={isAnswered}
              className={`w-full text-left p-5 rounded-2xl border-2 transition-all flex items-center justify-between ${
                selectedIdx === idx
                  ? isAnswered
                    ? idx === currentQuestion.correctIdx
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-red-500 bg-red-50 text-red-700'
                    : 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : isAnswered && idx === currentQuestion.correctIdx
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-200 hover:border-indigo-200 text-gray-700'
              }`}
            >
              <span className="text-lg font-medium">{idx + 1}. {option}</span>
              {isAnswered && idx === currentQuestion.correctIdx && (
                <CheckCircle2 className="text-green-500" size={24} />
              )}
              {isAnswered && selectedIdx === idx && idx !== currentQuestion.correctIdx && (
                <XCircle className="text-red-500" size={24} />
              )}
            </button>
          ))}
        </div>

        <AnimatePresence>
          {isAnswered && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="bg-amber-50 p-6 rounded-2xl mb-8 overflow-hidden border-2 border-amber-100"
            >
              <div className="flex items-start gap-3">
                <HelpCircle className="text-amber-500 mt-1 flex-shrink-0" size={20} />
                <p className="text-amber-800 leading-relaxed">
                  <span className="font-bold">선생님의 설명:</span><br />
                  {currentQuestion.explanation}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!isAnswered ? (
          <button
            onClick={handleCheck}
            disabled={selectedIdx === null}
            className={`w-full py-4 rounded-2xl font-bold text-lg transition-all shadow-md ${
              selectedIdx !== null
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            정답 확인하기
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 flex items-center justify-center gap-2"
          >
            {currentIdx === 4 ? '결과 보기' : '다음 문제'} <ChevronRight size={20} />
          </button>
        )}
      </motion.div>
    </div>
  );
};
