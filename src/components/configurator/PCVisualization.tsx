'use client';

import { motion } from 'motion/react';
import { SelectedComponents } from './types';

interface PCVisualizationProps {
  components: SelectedComponents;
}

export function PCVisualization({ components }: PCVisualizationProps) {
  const selectedCount = Object.values(components).filter(Boolean).length;
  const completionPercentage = (selectedCount / 8) * 100;

  return (
    <div className="relative w-full h-full min-h-[500px] flex items-center justify-center">
      {/* Background grid */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Animated gradient orbs */}
      <motion.div
        className="absolute w-64 h-64 rounded-full blur-[100px] opacity-30"
        style={{
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.8), transparent)',
        }}
        animate={{
          x: [0, 50, -30, 0],
          y: [0, -30, 50, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute w-48 h-48 rounded-full blur-[80px] opacity-30"
        style={{
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.8), transparent)',
        }}
        animate={{
          x: [0, -40, 30, 0],
          y: [0, 40, -20, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* PC Case visualization */}
      <div className="relative">
        {/* Main case outline */}
        <motion.div
          className="relative w-[280px] h-[380px] rounded-lg border-2 border-purple-500/30"
          style={{
            background: 'linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(20,20,30,0.9) 100%)',
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Scan line animation */}
          <motion.div
            className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none"
          >
            <motion.div
              className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-400/60 to-transparent"
              initial={{ top: '-2px' }}
              animate={{ top: '100%' }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          </motion.div>

          {/* Glass panel effect */}
          <div className="absolute inset-2 rounded border border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent" />

          {/* Top section - Cooling */}
          <motion.div 
            className={`absolute top-4 left-4 right-4 h-12 rounded border ${
              components.cooling ? 'border-purple-500/50 bg-purple-500/10' : 'border-white/10 bg-white/5'
            }`}
            animate={components.cooling ? {
              boxShadow: [
                '0 0 10px rgba(139, 92, 246, 0.2)',
                '0 0 20px rgba(139, 92, 246, 0.4)',
                '0 0 10px rgba(139, 92, 246, 0.2)',
              ],
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {components.cooling && (
              <div className="absolute inset-0 flex items-center justify-center gap-4">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-8 h-8 rounded-full border border-purple-500/50"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear', delay: i * 0.1 }}
                  >
                    <div className="absolute inset-1 border-t-2 border-purple-400/60 rounded-full" />
                  </motion.div>
                ))}
              </div>
            )}
            <span className="absolute bottom-1 left-2 text-[10px] text-white/30 font-mono">COOLING</span>
          </motion.div>

          {/* CPU Section */}
          <motion.div 
            className={`absolute top-20 left-1/2 -translate-x-1/2 w-16 h-16 rounded border ${
              components.cpu ? 'border-purple-500/50 bg-purple-500/10' : 'border-white/10 bg-white/5'
            }`}
            animate={components.cpu ? {
              boxShadow: [
                '0 0 10px rgba(139, 92, 246, 0.3)',
                '0 0 25px rgba(139, 92, 246, 0.5)',
                '0 0 10px rgba(139, 92, 246, 0.3)',
              ],
            } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {components.cpu && (
              <div className="absolute inset-2 grid grid-cols-3 grid-rows-3 gap-0.5">
                {Array.from({ length: 9 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="bg-purple-400/40 rounded-sm"
                    animate={{ opacity: [0.3, 0.8, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                  />
                ))}
              </div>
            )}
            <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-white/30 font-mono">CPU</span>
          </motion.div>

          {/* Motherboard area */}
          <motion.div 
            className={`absolute top-16 left-8 right-8 h-24 rounded border-dashed ${
              components.motherboard ? 'border-green-500/30 border' : 'border-white/10 border'
            }`}
          >
            {components.motherboard && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent rounded"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            )}
          </motion.div>

          {/* RAM slots */}
          <div className="absolute top-20 right-10 flex gap-1">
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className={`w-2 h-14 rounded-sm border ${
                  components.ram && i < 2 ? 'border-amber-500/50 bg-amber-500/20' : 'border-white/10 bg-white/5'
                }`}
                animate={components.ram && i < 2 ? {
                  boxShadow: [
                    '0 0 5px rgba(245, 158, 11, 0.2)',
                    '0 0 10px rgba(245, 158, 11, 0.4)',
                    '0 0 5px rgba(245, 158, 11, 0.2)',
                  ],
                } : {}}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>

          {/* GPU Section */}
          <motion.div 
            className={`absolute top-44 left-6 right-6 h-20 rounded border ${
              components.gpu ? 'border-red-500/50 bg-gradient-to-r from-red-500/10 to-orange-500/10' : 'border-white/10 bg-white/5'
            }`}
            animate={components.gpu ? {
              boxShadow: [
                '0 0 15px rgba(239, 68, 68, 0.2)',
                '0 0 30px rgba(239, 68, 68, 0.4)',
                '0 0 15px rgba(239, 68, 68, 0.2)',
              ],
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {components.gpu && (
              <>
                <div className="absolute top-2 left-2 right-2 h-8 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded" />
                <div className="absolute bottom-2 left-2 flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-4 h-4 rounded-full border border-red-500/50"
                      animate={{ rotate: -360 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear', delay: i * 0.1 }}
                    >
                      <div className="absolute inset-0.5 border-t-2 border-red-400/60 rounded-full" />
                    </motion.div>
                  ))}
                </div>
              </>
            )}
            <span className="absolute bottom-1 right-2 text-[10px] text-white/30 font-mono">GPU</span>
          </motion.div>

          {/* Storage */}
          <motion.div 
            className={`absolute top-[275px] right-6 w-20 h-8 rounded border ${
              components.storage ? 'border-blue-500/50 bg-blue-500/10' : 'border-white/10 bg-white/5'
            }`}
            animate={components.storage ? {
              boxShadow: [
                '0 0 8px rgba(59, 130, 246, 0.2)',
                '0 0 15px rgba(59, 130, 246, 0.4)',
                '0 0 8px rgba(59, 130, 246, 0.2)',
              ],
            } : {}}
            transition={{ duration: 1, repeat: Infinity }}
          >
            {components.storage && (
              <motion.div
                className="absolute top-1 left-1 w-2 h-2 rounded-full bg-blue-400"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
            )}
            <span className="absolute bottom-0.5 right-1 text-[8px] text-white/30 font-mono">SSD</span>
          </motion.div>

          {/* PSU Section */}
          <motion.div 
            className={`absolute bottom-4 left-4 right-4 h-16 rounded border ${
              components.psu ? 'border-yellow-500/50 bg-yellow-500/10' : 'border-white/10 bg-white/5'
            }`}
            animate={components.psu ? {
              boxShadow: [
                '0 0 10px rgba(234, 179, 8, 0.2)',
                '0 0 20px rgba(234, 179, 8, 0.3)',
                '0 0 10px rgba(234, 179, 8, 0.2)',
              ],
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {components.psu && (
              <div className="absolute inset-2 flex items-center justify-between px-2">
                <div className="flex gap-1">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="w-1.5 h-6 bg-yellow-500/30 rounded-sm" />
                  ))}
                </div>
                <motion.div
                  className="w-10 h-10 rounded-full border border-yellow-500/50"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                >
                  <div className="absolute inset-1 border-t-2 border-yellow-400/60 rounded-full" />
                </motion.div>
              </div>
            )}
            <span className="absolute bottom-1 left-2 text-[10px] text-white/30 font-mono">PSU</span>
          </motion.div>

          {/* Case indicator */}
          {components.case && (
            <motion.div
              className="absolute inset-0 rounded-lg border-2 border-purple-500/30 pointer-events-none"
              animate={{
                borderColor: ['rgba(139, 92, 246, 0.3)', 'rgba(139, 92, 246, 0.3)', 'rgba(139, 92, 246, 0.3)'],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />
          )}
        </motion.div>

        {/* Progress ring */}
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <div className="relative w-20 h-20">
            <svg className="w-20 h-20 transform -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="35"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="4"
                fill="none"
              />
              <motion.circle
                cx="40"
                cy="40"
                r="35"
                stroke="url(#progressGradient)"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                initial={{ strokeDasharray: '0, 220' }}
                animate={{ strokeDasharray: `${completionPercentage * 2.2}, 220` }}
                transition={{ duration: 0.5 }}
              />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold font-inter text-gradient-purple">
                {selectedCount}/8
              </span>
            </div>
          </div>
          <span className="mt-2 text-xs text-white/50 font-inter tracking-wider">
            СБОРКА
          </span>
        </div>
      </div>

      {/* Holographic effect overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          background: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(139, 92, 246, 0.03) 2px,
              rgba(139, 92, 246, 0.03) 4px
            )
          `,
        }}
      />
    </div>
  );
}
