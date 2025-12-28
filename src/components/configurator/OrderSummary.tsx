'use client';

import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingCart, 
  Zap, 
  AlertTriangle, 
  CheckCircle2,
  Info,
  Sparkles
} from 'lucide-react';
import { SelectedComponents, CompatibilityWarning } from './types';
import { formatPrice, calculateTotalPower } from './data';

interface OrderSummaryProps {
  components: SelectedComponents;
  compatibilityWarnings: CompatibilityWarning[];
  onOrder: () => void;
}

export function OrderSummary({ 
  components, 
  compatibilityWarnings,
  onOrder 
}: OrderSummaryProps) {
  // Calculate totals
  const totalPrice = Object.values(components).reduce(
    (sum, comp) => sum + (comp?.price || 0),
    0
  );

  const totalPower = calculateTotalPower(components);
  const psuWattage = components.psu?.specs.wattage || 0;
  const powerOk = psuWattage === 0 || psuWattage >= totalPower;
  
  const selectedCount = Object.values(components).filter(Boolean).length;
  const isComplete = selectedCount === 8;

  const errorWarnings = compatibilityWarnings.filter(w => w.type === 'error');
  const warningWarnings = compatibilityWarnings.filter(w => w.type === 'warning');
  const infoWarnings = compatibilityWarnings.filter(w => w.type === 'info');

  return (
    <div className="relative h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-inter font-bold text-gradient-purple mb-1">
          Итого
        </h2>
        <p className="text-sm text-white/50">
          Выбрано {selectedCount} из 8 компонентов
        </p>
      </div>

      {/* Price display */}
      <motion.div 
        className="relative p-6 rounded-xl glass-strong mb-6"
        layout
      >
        {/* Decorative corners */}
        <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-purple-500/50" />
        <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-purple-500/50" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-purple-500/50" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-purple-500/50" />

        <div className="text-center">
          <span className="text-sm text-white/50 font-inter tracking-wider">
            СТОИМОСТЬ СБОРКИ
          </span>
          <motion.div
            className="mt-2"
            key={totalPrice}
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <span className="text-3xl font-bold font-inter text-gradient-shimmer">
              {formatPrice(totalPrice)}
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* Power consumption */}
      <div className="p-4 rounded-lg bg-black/30 border border-white/10 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Zap className={`w-4 h-4 ${powerOk ? 'text-purple-400' : 'text-red-400'}`} />
            <span className="text-sm text-white/70">Потребление</span>
          </div>
          <span className={`text-sm font-mono ${powerOk ? 'text-purple-400' : 'text-red-400'}`}>
            ~{totalPower}W
          </span>
        </div>
        
        {/* Power bar */}
        <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className={`absolute inset-y-0 left-0 rounded-full ${
              powerOk 
                ? 'bg-gradient-to-r from-purple-500 to-purple-500' 
                : 'bg-gradient-to-r from-red-500 to-orange-500'
            }`}
            initial={{ width: 0 }}
            animate={{ 
              width: psuWattage > 0 
                ? `${Math.min((totalPower / psuWattage) * 100, 100)}%`
                : '0%'
            }}
            transition={{ duration: 0.5 }}
          />
          {psuWattage > 0 && (
            <div 
              className="absolute inset-y-0 w-0.5 bg-white/50"
              style={{ left: `${(totalPower / psuWattage) * 100}%` }}
            />
          )}
        </div>
        
        {psuWattage > 0 && (
          <div className="flex justify-between mt-2 text-xs text-white/40">
            <span>0W</span>
            <span>{psuWattage}W</span>
          </div>
        )}
        
        {!powerOk && psuWattage > 0 && (
          <motion.p
            className="mt-2 text-xs text-red-400 flex items-center gap-1"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AlertTriangle className="w-3 h-3" />
            Недостаточная мощность БП
          </motion.p>
        )}
      </div>

      {/* Compatibility warnings */}
      <div className="flex-1 overflow-auto space-y-2 mb-6">
        <AnimatePresence mode="popLayout">
          {errorWarnings.map((warning, i) => (
            <motion.div
              key={`error-${i}`}
              className="p-3 rounded-lg bg-red-500/10 border border-red-500/30"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <p className="text-sm text-red-200">{warning.message}</p>
              </div>
            </motion.div>
          ))}

          {warningWarnings.map((warning, i) => (
            <motion.div
              key={`warning-${i}`}
              className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-200">{warning.message}</p>
              </div>
            </motion.div>
          ))}

          {infoWarnings.map((warning, i) => (
            <motion.div
              key={`info-${i}`}
              className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <p className="text-sm text-blue-200">{warning.message}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {compatibilityWarnings.length === 0 && selectedCount > 1 && (
          <motion.div
            className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <p className="text-sm text-emerald-200">Все компоненты совместимы</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Order button */}
      <motion.button
        onClick={onOrder}
        disabled={!isComplete || errorWarnings.length > 0}
        className={`
          relative w-full py-4 px-6 rounded-xl
          font-inter font-bold text-lg
          transition-all duration-300
          overflow-hidden
          ${isComplete && errorWarnings.length === 0
            ? 'bg-gradient-to-r from-purple-600 to-purple-600 text-white cursor-pointer'
            : 'bg-white/10 text-white/40 cursor-not-allowed'
          }
        `}
        whileHover={isComplete && errorWarnings.length === 0 ? { scale: 1.02 } : {}}
        whileTap={isComplete && errorWarnings.length === 0 ? { scale: 0.98 } : {}}
      >
        {/* Glow effect */}
        {isComplete && errorWarnings.length === 0 && (
          <>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-500 opacity-0"
              animate={{
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
            <motion.div
              className="absolute inset-[-2px] rounded-xl"
              style={{
                background: 'linear-gradient(90deg, #8B5CF6, #8B5CF6, #8B5CF6)',
                backgroundSize: '200% 100%',
              }}
              animate={{
                backgroundPosition: ['0% 0%', '200% 0%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
            <div className="absolute inset-[2px] rounded-xl bg-gradient-to-r from-purple-600 to-purple-600" />
          </>
        )}
        
        <span className="relative flex items-center justify-center gap-3">
          {isComplete && errorWarnings.length === 0 ? (
            <>
              <Sparkles className="w-5 h-5" />
              Оформить заказ
              <ShoppingCart className="w-5 h-5" />
            </>
          ) : (
            <>
              <ShoppingCart className="w-5 h-5" />
              {errorWarnings.length > 0 
                ? 'Исправьте ошибки' 
                : `Выберите еще ${8 - selectedCount} компонент${selectedCount < 5 ? 'а' : 'ов'}`
              }
            </>
          )}
        </span>
      </motion.button>

      {/* Bottom decorative line */}
      <div className="mt-4 flex items-center gap-2">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
        <span className="text-[10px] text-white/30 font-mono">VA-PC.RU</span>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
      </div>
    </div>
  );
}
