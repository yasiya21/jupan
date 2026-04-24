/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Abacus } from './components/Abacus';
import { Teacher } from './components/Teacher';
import { SWQuiz } from './components/SWQuiz';
import { CipherMission } from './components/CipherMission';
import { AbacusColumn, Lesson } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, RotateCcw, Play, CheckCircle2, GraduationCap, Lock, HelpCircle, Home } from 'lucide-react';

const INITIAL_COLUMNS: AbacusColumn[] = Array(7).fill(0).map(() => ({ upper: 0, lower: 0 }));

const LESSONS: Lesson[] = [
  {
    id: 'intro',
    title: '주판과 친해지기',
    description: '주판의 구조와 숫자를 읽는 법을 배워요.',
    steps: [
      { text: '안녕! 오늘은 주판을 배워볼 거예요. 주판은 아주 오래된 계산기랍니다.' },
      { text: '가운데 가로지르는 막대를 기준으로 위쪽 알은 5를, 아래쪽 알은 1을 의미해요.' },
      { text: '아래쪽 알 하나를 위로 올려볼까요? (가장 오른쪽 칸의 아래 알을 클릭해보세요)', highlightColumn: 6, targetValue: 1 },
      { text: '잘했어요! 이제 숫자 1이 되었어요. 하나 더 올려볼까요?', highlightColumn: 6, targetValue: 2 },
      { text: '이제 위쪽 알을 내려볼까요? 위쪽 알 하나는 5를 의미해요.', highlightColumn: 6, targetValue: 7 },
      { text: '와! 5와 2가 만나서 숫자 7이 되었네요! 정말 똑똑해요!' }
    ]
  },
  {
    id: 'addition',
    title: '덧셈 배우기',
    description: '주판으로 다양한 덧셈을 충분히 연습해봐요.',
    steps: [
      { text: '이제 본격적으로 덧셈을 연습해볼까요? 여러 문제를 함께 풀어봐요!' },
      // 문제 1: 2 + 2
      { text: '1번 문제: 2 + 2를 해봐요. 먼저 2를 놓으세요.', highlightColumn: 6, targetValue: 2 },
      { text: '거기에 2를 더해볼까요?', highlightColumn: 6, targetValue: 4 },
      { text: '정답은 4! 아주 잘했어요.' },
      // 문제 2: 5 + 3
      { text: '2번 문제: 5 + 3을 해봐요. 먼저 5를 놓으세요.', highlightColumn: 6, targetValue: 5 },
      { text: '이제 3을 더해보세요.', highlightColumn: 6, targetValue: 8 },
      { text: '정답은 8! 정말 빠르네요.' },
      // 문제 3: 4 + 5
      { text: '3번 문제: 4 + 5를 해봐요. 먼저 4를 놓으세요.', highlightColumn: 6, targetValue: 4 },
      { text: '이제 5를 더해보세요.', highlightColumn: 6, targetValue: 9 },
      { text: '정답은 9! 주판알이 꽉 찼네요!' },
      // 문제 4: 10 + 5
      { text: '4번 문제: 10 + 5를 해봐요. 십의 자리에 1을 놓으세요.', highlightColumn: 5, targetValue: 1 },
      { text: '이제 일의 자리에 5를 더해보세요.', highlightColumn: 6, targetValue: 5 },
      { text: '정답은 15! 자릿수가 바뀌어도 문제없죠?' },
      // 문제 5: 12 + 2
      { text: '5번 문제: 12 + 2를 해봐요. 먼저 12를 놓으세요. (십의 자리에 1, 일의 자리에 2)', highlightColumn: 6, targetValue: 2 },
      { text: '이제 일의 자리에 2를 더해보세요.', highlightColumn: 6, targetValue: 4 },
      { text: '정답은 14! 차근차근 잘 따라오고 있어요.' },
      // 문제 6: 20 + 20
      { text: '6번 문제: 20 + 20을 해봐요. 먼저 십의 자리에 2를 놓으세요.', highlightColumn: 5, targetValue: 2 },
      { text: '거기에 20을 더하려면 십의 자리에 2를 더 올리면 되겠죠?', highlightColumn: 5, targetValue: 4 },
      { text: '정답은 40! 십의 자리 덧셈도 척척!' },
      // 문제 7: 30 + 5
      { text: '7번 문제: 30 + 5를 해봐요. 먼저 십의 자리에 3을 놓으세요.', highlightColumn: 5, targetValue: 3 },
      { text: '이제 일의 자리에 5를 더해보세요.', highlightColumn: 6, targetValue: 5 },
      { text: '정답은 35! 너무 잘하고 있어요.' },
      // 문제 8: 55 + 4
      { text: '마지막 8번 문제! 55 + 4를 해봐요. 십의 자리에 5, 일의 자리에 5를 놓으세요.', highlightColumn: 6, targetValue: 5 },
      { text: '이제 일의 자리에 4를 더해보세요.', highlightColumn: 6, targetValue: 9 },
      { text: '정답은 59! 덧셈 연습을 모두 마쳤습니다! 최고예요!' }
    ]
  },
  {
    id: 'subtraction',
    title: '뺄셈 배우기',
    description: '주판으로 다양한 뺄셈을 충분히 연습해봐요.',
    steps: [
      { text: '이번엔 뺄셈을 충분히 연습해볼까요? 준비됐나요?' },
      // 문제 1: 9 - 4
      { text: '1번 문제: 9 - 4를 해봐요. 먼저 9를 놓으세요.', highlightColumn: 6, targetValue: 9 },
      { text: '여기서 4를 빼보세요.', highlightColumn: 6, targetValue: 5 },
      { text: '정답은 5! 위쪽 알 하나만 남았네요.' },
      // 문제 2: 8 - 3
      { text: '2번 문제: 8 - 3을 해봐요. 먼저 8을 놓으세요.', highlightColumn: 6, targetValue: 8 },
      { text: '이제 3을 빼보세요.', highlightColumn: 6, targetValue: 5 },
      { text: '정답은 5! 역시 잘하네요.' },
      // 문제 3: 7 - 2
      { text: '3번 문제: 7 - 2를 해봐요. 먼저 7을 놓으세요.', highlightColumn: 6, targetValue: 7 },
      { text: '이제 2를 빼보세요.', highlightColumn: 6, targetValue: 5 },
      { text: '정답은 5! 뺄셈의 규칙이 보이나요?' },
      // 문제 4: 4 - 1
      { text: '4번 문제: 4 - 1을 해봐요. 먼저 4를 놓으세요.', highlightColumn: 6, targetValue: 4 },
      { text: '이제 1을 빼보세요.', highlightColumn: 6, targetValue: 3 },
      { text: '정답은 3! 아래쪽 알만 사용한 뺄셈이에요.' },
      // 문제 5: 50 - 10
      { text: '5번 문제: 50 - 10을 해봐요. 먼저 십의 자리에 5를 놓으세요.', highlightColumn: 5, targetValue: 5 },
      { text: '이제 십의 자리에서 10(알 1개)을 빼보세요.', highlightColumn: 5, targetValue: 4 },
      { text: '정답은 40! 큰 숫자도 어렵지 않아요.' },
      // 문제 6: 15 - 5
      { text: '6번 문제: 15 - 5를 해봐요. 십의 자리에 1, 일의 자리에 5를 놓으세요.', highlightColumn: 6, targetValue: 5 },
      { text: '이제 일의 자리에서 5를 빼보세요.', highlightColumn: 6, targetValue: 0 },
      { text: '정답은 10! 자릿수가 하나 남았네요.' },
      // 문제 7: 25 - 5
      { text: '7번 문제: 25 - 5를 해봐요. 십의 자리에 2, 일의 자리에 5를 놓으세요.', highlightColumn: 6, targetValue: 5 },
      { text: '이제 일의 자리에서 5를 빼보세요.', highlightColumn: 6, targetValue: 0 },
      { text: '정답은 20! 정말 잘하고 있어요.' },
      // 문제 8: 80 - 30
      { text: '마지막 8번 문제! 80 - 30을 해봐요. 십의 자리에 8을 놓으세요.', highlightColumn: 5, targetValue: 8 },
      { text: '이제 십의 자리에서 30(알 3개)을 빼보세요.', highlightColumn: 5, targetValue: 5 },
      { text: '정답은 50! 뺄셈 연습까지 모두 완벽하게 마쳤습니다! 대단해요!' }
    ]
  }
];

export default function App() {
  const [columns, setColumns] = useState<AbacusColumn[]>(INITIAL_COLUMNS);
  const [currentLessonIdx, setCurrentLessonIdx] = useState(0);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isLessonComplete, setIsLessonComplete] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [flowMode, setFlowMode] = useState<'lessons' | 'quiz' | 'cipher' | 'end'>('lessons');

  const playVictorySound = () => {
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
      // C5, E5, G5, C6 Fanfare
      playNote(523.25, now, 0.2); // C5
      playNote(659.25, now + 0.15, 0.2); // E5
      playNote(783.99, now + 0.3, 0.2); // G5
      playNote(1046.50, now + 0.5, 0.8); // C6
    } catch (e) {
      console.error('Audio error:', e);
    }
  };

  useEffect(() => {
    if (flowMode === 'end') {
      playVictorySound();
    }
  }, [flowMode]);

  const resetAll = () => {
    setFlowMode('lessons');
    setCurrentLessonIdx(0);
    setCurrentStepIdx(0);
    setIsLessonComplete(false);
    setShowConfetti(false);
    setColumns(INITIAL_COLUMNS);
  };

  const currentLesson = LESSONS[currentLessonIdx];
  const currentStep = currentLesson.steps[currentStepIdx];

  const speakValue = (value: number) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(value === 0 ? "영" : value.toString());
      utterance.lang = 'ko-KR';
      utterance.rate = 1.1;
      utterance.pitch = 1.4; // Higher pitch for a cuter voice
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleBeadClick = (colIdx: number, type: 'upper' | 'lower', value: number) => {
    const newColumns = [...columns];
    if (type === 'upper') {
      newColumns[colIdx] = { ...newColumns[colIdx], upper: value };
    } else {
      newColumns[colIdx] = { ...newColumns[colIdx], lower: value };
    }
    setColumns(newColumns);

    // Calculate total value of the abacus
    const totalValue = newColumns.reduce((acc, col, idx) => {
      const power = 6 - idx;
      const val = col.upper * 5 + col.lower;
      return acc + val * Math.pow(10, power);
    }, 0);
    
    // Speak the total value
    speakValue(totalValue);

    // Check if step is completed
    const colValue = newColumns[colIdx].upper * 5 + newColumns[colIdx].lower;
    if (currentStep.targetValue !== undefined && colIdx === currentStep.highlightColumn && colValue === currentStep.targetValue) {
      // Auto advance after a short delay
      setTimeout(() => {
        if (currentStepIdx < currentLesson.steps.length - 1) {
          setCurrentStepIdx(prev => prev + 1);
        } else {
          handleLessonComplete();
        }
      }, 1000);
    }
  };

  const handleLessonComplete = () => {
    setIsLessonComplete(true);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const resetAbacus = () => {
    setColumns(INITIAL_COLUMNS);
  };

  const nextStep = () => {
    if (currentStepIdx < currentLesson.steps.length - 1) {
      setCurrentStepIdx(currentStepIdx + 1);
    }
  };

  const prevStep = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx(currentStepIdx - 1);
    }
  };

  const nextLesson = () => {
    if (currentLessonIdx < LESSONS.length - 1) {
      setCurrentLessonIdx(currentLessonIdx + 1);
      setCurrentStepIdx(0);
      setIsLessonComplete(false);
      resetAbacus();
    } else {
      setFlowMode('quiz');
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-sky-50 p-4 md:p-8 font-sans">
      <header className="max-w-6xl mx-auto mb-8 flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border-b-4 border-sky-200">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-3 rounded-2xl text-white shadow-lg">
            <GraduationCap size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-indigo-900 tracking-tight">코딩선생님</h1>
            <p className="text-indigo-600 font-medium">재미있는 주판 알고리즘</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          {flowMode !== 'lessons' || currentLessonIdx > 0 || currentStepIdx > 0 ? (
            <button
              onClick={resetAll}
              className="px-4 py-2 bg-white border-2 border-slate-200 text-slate-500 rounded-xl font-bold hover:bg-slate-50 transition-colors flex items-center gap-2"
            >
              <Home size={18} />
              <span className="hidden md:inline">처음으로</span>
            </button>
          ) : null}

          {flowMode !== 'lessons' && (
            <div className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-bold border-2 border-indigo-100 flex items-center gap-2">
              {flowMode === 'quiz' && <><HelpCircle size={18} /> SW 개념 확인퀴즈</>}
              {flowMode === 'cipher' && <><Lock size={18} /> 암호 해독 미션</>}
              {flowMode === 'end' && <>🎉 수업 완료!</>}
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-2 md:px-0">
        <AnimatePresence mode="wait">
          {flowMode === 'lessons' && (
            <motion.div 
              key="lessons"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8"
            >
              {/* Left Side: Lesson List & Progress (4/12 on tablet/desktop) */}
              <div className="md:col-span-4 lg:col-span-3 space-y-4 md:space-y-6">
                <section className="bg-white p-5 rounded-3xl shadow-md border-2 border-sky-100">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Play size={20} className="text-orange-500" />
                    학습 과정
                  </h2>
                  <div className="space-y-3">
                    {LESSONS.map((lesson, idx) => (
                      <button
                        key={lesson.id}
                        onClick={() => {
                          setCurrentLessonIdx(idx);
                          setCurrentStepIdx(0);
                          setIsLessonComplete(false);
                          setShowConfetti(false);
                          resetAbacus();
                        }}
                        className={`w-full text-left p-4 rounded-2xl transition-all ${
                          currentLessonIdx === idx 
                            ? 'bg-orange-500 text-white shadow-lg scale-[1.02]' 
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-bold">{idx + 1}. {lesson.title}</span>
                          {idx < currentLessonIdx && <CheckCircle2 size={18} />}
                        </div>
                        <p className={`text-sm mt-1 ${currentLessonIdx === idx ? 'text-orange-100' : 'text-gray-400'}`}>
                          {lesson.description}
                        </p>
                      </button>
                    ))}
                    <button
                      onClick={() => setFlowMode('quiz')}
                      className={`w-full text-left p-4 rounded-2xl transition-all bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-2 border-dashed border-indigo-200 flex justify-between items-center group`}
                    >
                      <span className="font-bold">4. SW 개념 확인퀴즈</span>
                      <HelpCircle size={18} className="text-indigo-400 group-hover:text-indigo-600 transition-colors" />
                    </button>
                    <button
                      onClick={() => setFlowMode('cipher')}
                      className={`w-full text-left p-4 rounded-2xl transition-all bg-amber-50 text-amber-700 hover:bg-amber-100 border-2 border-dashed border-amber-200 flex justify-between items-center group`}
                    >
                      <span className="font-bold">5. 초성 암호 해독 미션</span>
                      <Lock size={18} className="text-amber-400 group-hover:text-amber-600 transition-colors" />
                    </button>
                  </div>
                </section>

                <section className="bg-orange-50 p-6 rounded-3xl border-2 border-orange-100">
                  <h3 className="font-bold text-orange-800 mb-2">오늘의 목표</h3>
                  <p className="text-orange-700 text-sm leading-relaxed">
                    주판의 기본 원리를 이해하고 컴퓨터 사고력(Computing Thinking)으로 연결해보세요!
                  </p>
                </section>
              </div>

              {/* Right Side: Simulation Area (8/12 on tablet/desktop) */}
              <div className="md:col-span-8 lg:col-span-9 space-y-6">
                {/* Teacher Section */}
                <div className="space-y-4">
                  <Teacher message={currentStep.text} />
                  
                  <div className="flex justify-center gap-3">
                    <button 
                      onClick={resetAbacus}
                      className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-orange-200 text-orange-600 rounded-2xl font-bold hover:bg-orange-50 transition-all shadow-sm active:scale-95"
                    >
                      <RotateCcw size={20} />
                      주판털기 (초기화)
                    </button>

                    {isLessonComplete ? (
                      <button
                        onClick={nextLesson}
                        className="flex items-center gap-2 px-10 py-3 bg-green-500 text-white rounded-2xl font-black shadow-lg hover:bg-green-600 transition-all animate-pulse"
                      >
                        {currentLessonIdx === LESSONS.length - 1 ? 'SW 개념 퀴즈!' : '다음 수업으로!'}
                        <ChevronRight size={24} />
                      </button>
                    ) : (
                      <button
                        onClick={nextStep}
                        disabled={currentStepIdx === currentLesson.steps.length - 1 || currentStep.targetValue !== undefined}
                        className={`flex items-center gap-2 px-10 py-3 rounded-2xl font-black shadow-lg transition-all ${
                          currentStep.targetValue !== undefined 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-gray-200' 
                            : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105 active:scale-95'
                        }`}
                      >
                        {currentStep.targetValue !== undefined ? '주판을 움직여보세요!' : '다음 내용보기'}
                        <ChevronRight size={24} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Abacus Section */}
                <div className="flex flex-col items-center gap-8">
                  <div className="relative">
                    <Abacus 
                      columns={columns} 
                      onBeadClick={handleBeadClick}
                      highlightedColumn={currentStep.highlightColumn}
                    />
                    
                    <AnimatePresence>
                      {showConfetti && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        >
                          <div className="text-6xl">🎉✨🌟</div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Navigation Controls */}
                  <div className="flex items-center gap-6">
                    <button
                      onClick={prevStep}
                      disabled={currentStepIdx === 0}
                      className="p-4 bg-white rounded-2xl shadow-md border-2 border-sky-100 text-sky-600 disabled:opacity-30 hover:bg-sky-50 transition-all"
                    >
                      <ChevronLeft size={32} />
                    </button>

                    <div className="bg-white px-8 py-3 rounded-full shadow-inner border-2 border-sky-50 font-bold text-sky-800">
                      {currentStepIdx + 1} / {currentLesson.steps.length}
                    </div>

                    {isLessonComplete ? (
                      <button
                        onClick={nextLesson}
                        className="flex items-center gap-2 px-8 py-4 bg-green-500 text-white rounded-2xl font-black shadow-lg hover:bg-green-600 transition-all animate-bounce"
                      >
                        {currentLessonIdx === LESSONS.length - 1 ? 'SW 개념 퀴즈 풀기!' : '다음 수업으로!'}
                        <ChevronRight size={24} />
                      </button>
                    ) : (
                      <button
                        onClick={nextStep}
                        disabled={currentStepIdx === currentLesson.steps.length - 1 || currentStep.targetValue !== undefined}
                        className="p-4 bg-white rounded-2xl shadow-md border-2 border-sky-100 text-sky-600 disabled:opacity-30 hover:bg-sky-50 transition-all"
                      >
                        <ChevronRight size={32} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {flowMode === 'quiz' && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <SWQuiz onComplete={() => setFlowMode('cipher')} />
            </motion.div>
          )}

          {flowMode === 'cipher' && (
            <motion.div
              key="cipher"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <CipherMission onComplete={() => {
                setFlowMode('end');
                setShowConfetti(true);
              }} />
            </motion.div>
          )}

          {flowMode === 'end' && (
            <motion.div
              key="end"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-3xl mx-auto text-center bg-white p-12 rounded-[3rem] shadow-2xl border-b-8 border-indigo-200"
            >
              <div className="w-24 h-24 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-3xl flex items-center justify-center text-white mx-auto mb-8 shadow-xl rotate-3">
                <GraduationCap size={48} />
              </div>
              <h2 className="text-4xl font-black text-gray-800 mb-6 tracking-tight">수료를 축하합니다! 🎓</h2>
              <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                오늘 여러분은 단순히 주판만 배운 것이 아닙니다.<br />
                <span className="text-indigo-600 font-bold">컴퓨터처럼 생각하는 법(Computing Thinking)</span>을 완벽하게 익혔어요!
              </p>
              <div className="bg-sky-50 p-8 rounded-3xl mb-10 border-2 border-sky-100 text-left">
                <h4 className="font-bold text-sky-800 mb-4 flex items-center gap-2">
                  <CheckCircle2 size={20} /> 오늘 배운 핵심 개념
                </h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sky-700">
                  <li>• 알고리즘: 단계별 해결 규칙</li>
                  <li>• 데이터 압축: 효율적인 저장</li>
                  <li>• 시스템 리셋: 초기화의 중요성</li>
                  <li>• 이진법: 스위치 제어 방식</li>
                </ul>
              </div>
              <button
                onClick={resetAll}
                className="bg-indigo-600 text-white px-12 py-5 rounded-2xl font-black text-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
              >
                처음부터 다시 하기
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="max-w-6xl mx-auto mt-12 text-center text-indigo-400 text-sm font-medium">
        &copy; 2026 코딩선생님 재미있는 주판 알고리즘. 아이들의 수학적 사고력을 키워줍니다.
      </footer>
    </div>
  );
}
