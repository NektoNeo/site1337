'use client';

/**
 * ConfigurationSteps - Wizard stepper for PC configurator
 *
 * Features:
 * - Visual step progress indicator
 * - Step navigation with validation
 * - Animated transitions between steps
 * - Mobile-responsive horizontal scroll
 */

import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers,
  Cpu,
  Monitor,
  MemoryStick,
  HardDrive,
  Fan,
  Palette,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Lock,
  Droplets,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ConfigStep, CONFIGURATOR_STEPS, ConfiguratorState } from './types';
import { Button } from '@/components/ui/button';

// ============================================================================
// TYPES
// ============================================================================

interface ConfigurationStepsProps {
  /** Current configurator state */
  state: ConfiguratorState;
  /** Current active step (1-based) */
  currentStep: number;
  /** Callback when step changes */
  onStepChange: (step: number) => void;
  /** Whether can proceed to next step */
  canGoNext: boolean;
  /** Whether can go back */
  canGoPrev: boolean;
  /** Go to next step */
  onNext: () => void;
  /** Go to previous step */
  onPrev: () => void;
  /** Custom class name */
  className?: string;
}

interface StepIndicatorProps {
  step: ConfigStep;
  index: number;
  isActive: boolean;
  isCompleted: boolean;
  isAccessible: boolean;
  onClick: () => void;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const STEP_ICONS: Record<string, React.ReactNode> = {
  Layers: <Layers className="w-4 h-4" />,
  Cpu: <Cpu className="w-4 h-4" />,
  Monitor: <Monitor className="w-4 h-4" />,
  MemoryStick: <MemoryStick className="w-4 h-4" />,
  HardDrive: <HardDrive className="w-4 h-4" />,
  Fan: <Fan className="w-4 h-4" />,
  Palette: <Palette className="w-4 h-4" />,
  CheckCircle: <CheckCircle className="w-4 h-4" />,
  Droplets: <Droplets className="w-4 h-4" />,
};

// ============================================================================
// STEP INDICATOR
// ============================================================================

function StepIndicator({
  step,
  index,
  isActive,
  isCompleted,
  isAccessible,
  onClick,
}: StepIndicatorProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={!isAccessible}
      className={cn(
        'relative flex flex-col items-center gap-2 min-w-[80px] group',
        'transition-all duration-300',
        isAccessible ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
      )}
      whileHover={isAccessible ? { scale: 1.05 } : {}}
      whileTap={isAccessible ? { scale: 0.95 } : {}}
    >
      {/* Step circle */}
      <div className="relative">
        <motion.div
          className={cn(
            'w-10 h-10 rounded-full flex items-center justify-center',
            'border-2 transition-all duration-300',
            isActive
              ? 'bg-purple-500/20 border-purple-500 shadow-lg shadow-purple-500/30'
              : isCompleted
              ? 'bg-emerald-500/20 border-emerald-500'
              : 'bg-white/5 border-white/20 group-hover:border-white/40'
          )}
          animate={
            isActive
              ? {
                  boxShadow: [
                    '0 0 10px rgba(168, 85, 247, 0.3)',
                    '0 0 20px rgba(168, 85, 247, 0.5)',
                    '0 0 10px rgba(168, 85, 247, 0.3)',
                  ],
                }
              : {}
          }
          transition={{ duration: 2, repeat: Infinity }}
        >
          {isCompleted ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            </motion.div>
          ) : !isAccessible ? (
            <Lock className="w-4 h-4 text-white/30" />
          ) : (
            <span
              className={cn(
                'transition-colors duration-300',
                isActive ? 'text-purple-400' : 'text-white/50 group-hover:text-white/70'
              )}
            >
              {STEP_ICONS[step.icon] || <span className="text-sm font-mono">{index + 1}</span>}
            </span>
          )}
        </motion.div>

        {/* Required badge */}
        {step.isRequired && !isCompleted && (
          <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
        )}
      </div>

      {/* Step label */}
      <div className="text-center">
        <span
          className={cn(
            'text-xs font-medium transition-colors duration-300',
            isActive ? 'text-purple-400' : isCompleted ? 'text-emerald-400' : 'text-white/50'
          )}
        >
          {step.title}
        </span>
      </div>

      {/* Active indicator line */}
      {isActive && (
        <motion.div
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-purple-500 rounded-full"
          layoutId="activeStep"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      )}
    </motion.button>
  );
}

// ============================================================================
// STEP CONNECTOR
// ============================================================================

function StepConnector({ isCompleted }: { isCompleted: boolean }) {
  return (
    <div className="flex-1 min-w-[20px] max-w-[60px] h-[2px] mx-1 relative">
      <div className="absolute inset-0 bg-white/10 rounded-full" />
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-purple-500 to-emerald-500 rounded-full origin-left"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isCompleted ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function ConfigurationSteps({
  state,
  currentStep,
  onStepChange,
  canGoNext,
  canGoPrev,
  onNext,
  onPrev,
  className,
}: ConfigurationStepsProps) {
  // Determine which steps are accessible
  const getStepAccessibility = (stepIndex: number): boolean => {
    // First step is always accessible
    if (stepIndex === 0) return true;

    // Check if all previous required steps are complete
    for (let i = 0; i < stepIndex; i++) {
      const prevStep = CONFIGURATOR_STEPS[i];
      if (prevStep.isRequired && !prevStep.isComplete(state)) {
        return false;
      }
    }
    return true;
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Steps indicator - horizontal scroll on mobile */}
      <div className="relative">
        <div className="overflow-x-auto scrollbar-hide pb-4">
          <div className="flex items-center justify-between min-w-max px-4 lg:px-0">
            {CONFIGURATOR_STEPS.map((step, index) => {
              const isActive = currentStep === step.id;
              const isCompleted = step.isComplete(state);
              const isAccessible = getStepAccessibility(index);

              return (
                <div key={step.id} className="flex items-center">
                  <StepIndicator
                    step={step}
                    index={index}
                    isActive={isActive}
                    isCompleted={isCompleted}
                    isAccessible={isAccessible}
                    onClick={() => isAccessible && onStepChange(step.id)}
                  />

                  {/* Connector line (not after last step) */}
                  {index < CONFIGURATOR_STEPS.length - 1 && (
                    <StepConnector isCompleted={isCompleted} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Fade edges on mobile */}
        <div className="absolute left-0 top-0 bottom-4 w-8 bg-gradient-to-r from-black to-transparent pointer-events-none lg:hidden" />
        <div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-black to-transparent pointer-events-none lg:hidden" />
      </div>

      {/* Current step info */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="text-center space-y-2"
        >
          <h2 className="text-2xl font-inter font-bold text-white">
            {CONFIGURATOR_STEPS[currentStep - 1]?.title}
          </h2>
          <p className="text-white/50 text-sm max-w-md mx-auto">
            {CONFIGURATOR_STEPS[currentStep - 1]?.description}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between pt-4">
        <Button
          variant="ghost"
          onClick={onPrev}
          disabled={!canGoPrev}
          className={cn(
            'gap-2 transition-all duration-300',
            !canGoPrev && 'opacity-50 cursor-not-allowed'
          )}
        >
          <ChevronLeft className="w-4 h-4" />
          Назад
        </Button>

        <div className="flex items-center gap-1">
          {CONFIGURATOR_STEPS.map((step) => (
            <motion.div
              key={step.id}
              className={cn(
                'w-2 h-2 rounded-full transition-all duration-300',
                currentStep === step.id
                  ? 'bg-purple-500 w-6'
                  : step.isComplete(state)
                  ? 'bg-emerald-500'
                  : 'bg-white/20'
              )}
              layout
            />
          ))}
        </div>

        <Button
          onClick={onNext}
          disabled={!canGoNext}
          className={cn(
            'gap-2 bg-gradient-to-r from-purple-500 to-fuchsia-500',
            'hover:from-purple-600 hover:to-fuchsia-600',
            'transition-all duration-300',
            !canGoNext && 'opacity-50 cursor-not-allowed'
          )}
        >
          {currentStep === CONFIGURATOR_STEPS.length ? 'Оформить' : 'Далее'}
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

// ============================================================================
// STEP CONTENT WRAPPER
// ============================================================================

interface StepContentProps {
  stepId: number;
  currentStep: number;
  children: React.ReactNode;
}

export function StepContent({ stepId, currentStep, children }: StepContentProps) {
  if (stepId !== currentStep) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

// ============================================================================
// EXPORT
// ============================================================================

export default ConfigurationSteps;
