import React, { useState, useEffect } from 'react';
import { CIPHER_MISSION_POOL, DECODING_TABLE } from '../constants';
import { CipherMissionData } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Unlock, Key, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';

interface CipherMissionProps {
  onComplete: () => void;
}

export const CipherMission: React.FC<CipherMissionProps> = ({ onComplete }) => {
  const [mission, setMission] = useState<CipherMissionData | null>(null);
  const [consonants, setConsonants] = useState<string[]>([]);
  const [finalGuess, setFinalGuess] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const randomMission = CIPHER_MISSION_POOL[Math.floor(Math.random() * CIPHER_MISSION_POOL.length)];
    setMission(randomMission);
    setConsonants(Array(randomMission.problems.length).fill(''));
  }, []);

  const handleConsonantChange = (idx: number, val: string) => {
    const newConsonants = [...consonants];
    newConsonants[idx] = val;
    setConsonants(newConsonants);
  };

  const playFanfare = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const playNote = (freq: number, startTime: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.1, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
        osc.start(startTime);
        osc.stop(startTime + duration);
      };

      const now = ctx.currentTime;
      playNote(523.25, now, 0.2); // C5
      playNote(659.25, now + 0.15, 0.2); // E5
      playNote(783.99, now + 0.3, 0.2); // G5
      playNote(1046.50, now + 0.5, 0.8); // C6
    } catch (e) {
      console.error('Audio error:', e);
    }
  };

  const handleCheck = () => {
    if (!mission) return;
    const consonantsCorrect = mission.problems.every((p, i) => consonants[i] === p.consonant);
    const wordCorrect = finalGuess.trim() === mission.finalWord;

    if (!consonantsCorrect) {
      setErrorMessage('계산 결과 초성이 틀렸어요. 다시 확인해보세요!');
      setIsSuccess(false);
    } else if (!wordCorrect) {
      setErrorMessage('초성은 맞았지만, SW 용어가 틀렸어요. 힌트를 확인해보세요!');
      setIsSuccess(false);
    } else {
      setIsSuccess(true);
      playFanfare();
    }
    setShowResult(true);
  };

  if (!mission) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Title & Description */}
      <div className="text-center bg-white p-8 rounded-3xl shadow-sm border-b-4 border-indigo-100">
        <div className="inline-flex items-center justify-center p-3 bg-amber-100 text-amber-600 rounded-2xl mb-4">
          <Key size={32} />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">초성 암호 해독 미션</h2>
        <p className="text-gray-600">주판으로 계산한 초성을 조합해 비밀 SW 용어를 밝혀내세요!</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Decoding Table */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-3xl shadow-md border-4 border-indigo-50 sticky top-8">
            <h3 className="text-xl font-bold text-indigo-600 mb-6 flex items-center gap-2 border-b-2 border-indigo-50 pb-3">
              <Lock size={20} /> 암호 해독표
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(DECODING_TABLE).map(([num, char]) => (
                <div 
                  key={num} 
                  className="flex items-center justify-between p-3 bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-gray-100 shadow-sm"
                >
                  <span className="w-8 h-8 flex items-center justify-center bg-indigo-500 text-white rounded-lg font-mono font-bold text-sm">
                    {num}
                  </span>
                  <span className="text-2xl font-black text-gray-800">
                    {char}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-2">
              <HelpCircle size={18} className="text-amber-500 mt-1 shrink-0" />
              <p className="text-xs text-amber-800 leading-tight">
                주판으로 계산한 결과 숫자를 왼쪽 파란 박스에서 찾아보세요!
              </p>
            </div>
          </div>
        </div>

        {/* Problems */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mission.problems.map((problem, idx) => (
              <div key={idx} className="bg-white p-6 rounded-3xl shadow-md border-b-4 border-indigo-200">
                <div className="text-sm font-bold text-indigo-400 mb-2">CODE {idx + 1}</div>
                <div className="text-2xl font-bold text-gray-700 mb-4">{problem.expression} = ?</div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-500">초성:</span>
                  <input
                    type="text"
                    maxLength={1}
                    value={consonants[idx]}
                    onChange={(e) => handleConsonantChange(idx, e.target.value)}
                    className="w-12 h-12 text-center text-xl font-bold border-b-4 border-indigo-400 focus:outline-none focus:border-indigo-600 rounded-t-xl bg-indigo-50"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Final Guess Input */}
          <div className="bg-indigo-600 p-8 rounded-[2.5rem] shadow-xl text-white">
            <div className="flex items-center gap-2 mb-4 text-indigo-100">
              <HelpCircle size={20} />
              <span className="font-bold">힌트: {mission.hint}</span>
            </div>
            <h3 className="text-xl font-bold mb-4 italic">어떤 SW 용어일까요? (정답: {consonants.join(' ')})</h3>
            <input
              type="text"
              placeholder="SW 용어를 입력하세요"
              value={finalGuess}
              onChange={(e) => setFinalGuess(e.target.value)}
              className="w-full p-4 rounded-2xl bg-white/10 border-2 border-white/20 text-white placeholder:text-white/40 text-xl font-bold focus:outline-none focus:bg-white/20 transition-all text-center"
            />
          </div>

          <button
            onClick={handleCheck}
            className="w-full bg-indigo-600 text-white py-5 rounded-3xl font-bold text-xl hover:bg-indigo-700 transition-all shadow-lg flex items-center justify-center gap-3 border-b-4 border-indigo-800"
          >
            시스템 잠금 해제 시도 <Unlock size={24} />
          </button>
        </div>
      </div>

      {/* Result Modal Overlay */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white p-10 rounded-[3rem] shadow-2xl max-w-md w-full text-center"
            >
              {isSuccess ? (
                <>
                  <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white mx-auto mb-6 shadow-lg">
                    <CheckCircle2 size={48} />
                  </div>
                  <h3 className="text-3xl font-black text-gray-800 mb-3">ACCESS GRANTED!</h3>
                  <p className="text-gray-600 mb-8 font-medium">
                    암호를 완벽하게 해독했어요.<br />
                    당신은 최고의 주판 해커입니다! 💻✨
                  </p>
                  <button
                    onClick={onComplete}
                    className="w-full bg-green-500 text-white py-4 rounded-2xl font-bold text-xl hover:bg-green-600 transition-colors shadow-lg"
                  >
                    마지막 수료증 받기 🎓
                  </button>
                </>
              ) : (
                <>
                  <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center text-white mx-auto mb-6 shadow-lg">
                    <AlertCircle size={48} />
                  </div>
                  <h3 className="text-3xl font-black text-gray-800 mb-3">ACCESS DENIED</h3>
                  <p className="text-red-500 mb-8 font-bold">{errorMessage}</p>
                  <button
                    onClick={() => setShowResult(false)}
                    className="w-full bg-gray-800 text-white py-4 rounded-2xl font-bold text-lg hover:bg-gray-900 transition-colors"
                  >
                    다시 시도하기
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
