import React from 'react';
import { motion } from 'motion/react';
import { AbacusColumn } from '../types';

interface AbacusProps {
  columns: AbacusColumn[];
  onBeadClick?: (columnIndex: number, type: 'upper' | 'lower', value: number) => void;
  highlightedColumn?: number;
}

export const Abacus: React.FC<AbacusProps> = ({ columns, onBeadClick, highlightedColumn }) => {
  const COLUMN_WIDTH = 80;
  const DIVIDER_HEIGHT = 20;
  const TOTAL_HEIGHT = 420;
  const UPPER_SECTION_HEIGHT = 120;

  return (
    <div className="w-full overflow-hidden flex justify-center p-4">
      <div 
        className="relative bg-amber-900 p-6 rounded-3xl shadow-2xl border-8 border-amber-950 inline-block origin-top scale-90 sm:scale-100 transition-transform duration-300"
        style={{ maxWidth: '100%' }}
      >
        {/* Abacus Frame */}
        <div className="flex gap-1 md:gap-3 bg-amber-800 p-3 rounded-xl relative">
        {/* Horizontal Divider Bar */}
        <div 
          className="absolute left-0 right-0 bg-amber-950 shadow-inner z-10" 
          style={{ top: `${UPPER_SECTION_HEIGHT}px`, height: `${DIVIDER_HEIGHT}px` }}
        >
          {/* Unit points */}
          <div className="flex justify-around w-full h-full items-center px-4">
            {columns.map((_, i) => (
              <div key={i} className={`w-2.5 h-2.5 rounded-full ${i % 3 === 2 ? 'bg-white/80' : 'bg-transparent'}`} />
            ))}
          </div>
        </div>

        {columns.map((col, colIdx) => (
          <div 
            key={colIdx} 
            className={`relative flex flex-col items-center transition-all duration-300 ${highlightedColumn === colIdx ? 'bg-yellow-400/20 rounded-lg scale-105 ring-4 ring-yellow-400' : ''}`}
            style={{ width: `${COLUMN_WIDTH}px`, height: `${TOTAL_HEIGHT}px` }}
          >
            {/* Vertical Rod */}
            <div className="absolute top-0 bottom-0 w-2 bg-gray-400 rounded-full shadow-sm" />

            {/* Upper Section (Heavenly Beads) */}
            <div style={{ height: `${UPPER_SECTION_HEIGHT}px` }} className="w-full relative flex flex-col justify-start">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onBeadClick?.(colIdx, 'upper', col.upper === 0 ? 1 : 0)}
                // Upper bead starts at top: 0. To touch divider at 120, move down by (120 - bead_height).
                // Bead height is 40 (h-10). So move 80.
                animate={{ y: col.upper === 1 ? 80 : 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="w-16 h-10 bg-blue-500 rounded-full mx-auto z-20 shadow-md border-b-4 border-blue-700 cursor-pointer"
              />
            </div>

            {/* Lower Section (Earthly Beads) */}
            {/* Starts exactly after divider: UPPER_SECTION_HEIGHT + DIVIDER_HEIGHT */}
            <div className="flex-grow w-full relative" style={{ marginTop: `${DIVIDER_HEIGHT}px` }}>
              {[0, 1, 2, 3].map((beadIdx) => {
                const isUp = beadIdx < col.lower;
                
                const colors = [
                  'bg-green-500 border-green-700',
                  'bg-yellow-400 border-yellow-600',
                  'bg-orange-500 border-orange-700',
                  'bg-red-500 border-red-700'
                ];

                return (
                  <motion.button
                    key={beadIdx}
                    style={{ position: 'absolute', top: `${48 + beadIdx * 48}px`, left: '50%', x: '-50%' }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onBeadClick?.(colIdx, 'lower', isUp ? beadIdx : beadIdx + 1)}
                    // Move up by exactly its offset from the top (48px) to touch the divider
                    animate={{ y: isUp ? -48 : 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className={`w-16 h-10 ${colors[beadIdx]} rounded-full z-20 shadow-md border-b-4 cursor-pointer block`}
                  />
                );
              })}
            </div>

            {/* Column Value Display */}
            <div className="absolute -bottom-12 font-mono font-bold text-white text-2xl">
              {col.upper * 5 + col.lower}
            </div>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
};
