import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, MessageCircle } from 'lucide-react';

interface TeacherProps {
  message: string;
  isThinking?: boolean;
}

export const Teacher: React.FC<TeacherProps> = ({ message, isThinking }) => {
  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border-4 border-indigo-200 max-w-2xl mx-auto">
      <div className="relative flex items-start gap-6 w-full">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex-shrink-0"
        >
          <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg relative overflow-hidden text-5xl">
            👩‍🏫
            <div className="absolute top-2 right-2 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse" />
          </div>
          <p className="text-center mt-2 font-bold text-indigo-800">코딩선생님</p>
        </motion.div>

        <div className="flex-grow relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={message}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="bg-white p-6 rounded-2xl rounded-tl-none shadow-md border-2 border-orange-100 min-h-[100px] flex items-center"
            >
              <div className="absolute -left-3 top-0 w-0 h-0 border-t-[15px] border-t-white border-l-[15px] border-l-transparent drop-shadow-[-2px_0_0_rgba(255,237,213,1)]" />
              <p className="text-xl font-medium text-gray-800 leading-relaxed">
                {message}
                {isThinking && <span className="inline-flex ml-2 gap-1"><span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" /><span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" /><span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" /></span>}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
