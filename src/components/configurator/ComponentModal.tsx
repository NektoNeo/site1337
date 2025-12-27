'use client';

import { motion, AnimatePresence } from 'motion/react';
import { X, Check, AlertTriangle, Cpu, CircuitBoard, Monitor, MemoryStick, HardDrive, Zap, Box, Fan } from 'lucide-react';
import { ComponentCategory, PCComponent, CATEGORY_LABELS, SelectedComponents } from './types';
import { COMPONENTS_DATA, formatPrice } from './data';

interface ComponentModalProps {
  isOpen: boolean;
  category: ComponentCategory | null;
  selectedComponents: SelectedComponents;
  onClose: () => void;
  onSelect: (component: PCComponent) => void;
}

const CATEGORY_ICONS: Record<ComponentCategory, React.ReactNode> = {
  cpu: <Cpu className="w-6 h-6" />,
  motherboard: <CircuitBoard className="w-6 h-6" />,
  gpu: <Monitor className="w-6 h-6" />,
  ram: <MemoryStick className="w-6 h-6" />,
  storage: <HardDrive className="w-6 h-6" />,
  psu: <Zap className="w-6 h-6" />,
  case: <Box className="w-6 h-6" />,
  cooling: <Fan className="w-6 h-6" />,
};

function getCompatibilityStatus(
  component: PCComponent,
  category: ComponentCategory,
  selectedComponents: SelectedComponents
): 'compatible' | 'warning' | 'incompatible' | 'unknown' {
  // CPU-Motherboard socket check
  if (category === 'cpu' && selectedComponents.motherboard) {
    if (component.specs.socket !== selectedComponents.motherboard.specs.socket) {
      return 'incompatible';
    }
    return 'compatible';
  }

  if (category === 'motherboard' && selectedComponents.cpu) {
    if (component.specs.socket !== selectedComponents.cpu.specs.socket) {
      return 'incompatible';
    }
    return 'compatible';
  }

  // RAM-Motherboard type check
  if (category === 'ram' && selectedComponents.motherboard) {
    if (component.specs.type !== selectedComponents.motherboard.specs.memoryType) {
      return 'incompatible';
    }
    return 'compatible';
  }

  if (category === 'motherboard' && selectedComponents.ram) {
    if (component.specs.memoryType !== selectedComponents.ram.specs.type) {
      return 'incompatible';
    }
    return 'compatible';
  }

  // Check if any compatibility check was performed
  if (
    (category === 'cpu' || category === 'motherboard') &&
    (selectedComponents.cpu || selectedComponents.motherboard)
  ) {
    return 'compatible';
  }

  return 'unknown';
}

function ComponentCard({
  component,
  category,
  selectedComponents,
  isSelected,
  onSelect,
}: {
  component: PCComponent;
  category: ComponentCategory;
  selectedComponents: SelectedComponents;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const compatStatus = getCompatibilityStatus(component, category, selectedComponents);
  const isIncompatible = compatStatus === 'incompatible';

  return (
    <motion.button
      onClick={() => !isIncompatible && onSelect()}
      disabled={isIncompatible}
      className={`
        relative p-4 rounded-xl text-left w-full
        transition-all duration-300
        ${isSelected 
          ? 'bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border-2 border-purple-500/50' 
          : isIncompatible
            ? 'bg-red-500/5 border border-red-500/20 opacity-60 cursor-not-allowed'
            : 'bg-black/40 border border-white/10 hover:border-purple-500/30'
        }
      `}
      whileHover={!isIncompatible ? { scale: 1.02, y: -2 } : {}}
      whileTap={!isIncompatible ? { scale: 0.98 } : {}}
      layout
    >
      {/* Selected indicator */}
      {isSelected && (
        <motion.div
          className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
        >
          <Check className="w-4 h-4 text-white" />
        </motion.div>
      )}

      {/* Incompatibility indicator */}
      {isIncompatible && (
        <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center">
          <AlertTriangle className="w-4 h-4 text-red-400" />
        </div>
      )}

      {/* Compatibility indicator */}
      {compatStatus === 'compatible' && !isSelected && (
        <div className="absolute top-3 right-3">
          <span className="text-xs text-emerald-400 font-mono">OK</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className={`
          p-2 rounded-lg 
          ${isSelected 
            ? 'bg-purple-500/20 text-cyan-400' 
            : 'bg-white/5 text-white/40'
          }
        `}>
          {CATEGORY_ICONS[category]}
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-xs text-white/40 font-mono">{component.brand}</span>
          <h4 className="text-sm font-medium text-white truncate">{component.name}</h4>
        </div>
      </div>

      {/* Specs */}
      <div className="space-y-1 mb-4">
        {category === 'cpu' && (
          <>
            <SpecRow label="Сокет" value={component.specs.socket} highlight={isIncompatible} />
            <SpecRow label="Ядра/Потоки" value={`${component.specs.cores}/${component.specs.threads}`} />
            <SpecRow label="Boost" value={component.specs.boostClock} />
            <SpecRow label="TDP" value={`${component.specs.tdp}W`} />
          </>
        )}
        {category === 'motherboard' && (
          <>
            <SpecRow label="Сокет" value={component.specs.socket} highlight={isIncompatible} />
            <SpecRow label="Чипсет" value={component.specs.chipset} />
            <SpecRow label="Форм-фактор" value={component.specs.formFactor} />
            <SpecRow label="Память" value={component.specs.memoryType} />
          </>
        )}
        {category === 'gpu' && (
          <>
            <SpecRow label="VRAM" value={component.specs.vram} />
            <SpecRow label="TDP" value={`${component.specs.powerDraw}W`} />
            <SpecRow label="Длина" value={`${component.specs.length}мм`} />
          </>
        )}
        {category === 'ram' && (
          <>
            <SpecRow label="Объем" value={component.specs.capacity} />
            <SpecRow label="Скорость" value={component.specs.speed} />
            <SpecRow label="Тип" value={component.specs.type} highlight={isIncompatible} />
          </>
        )}
        {category === 'storage' && (
          <>
            <SpecRow label="Объем" value={component.specs.storageCapacity} />
            <SpecRow label="Тип" value={component.specs.storageType} />
            <SpecRow label="Чтение" value={component.specs.readSpeed} />
          </>
        )}
        {category === 'psu' && (
          <>
            <SpecRow label="Мощность" value={`${component.specs.wattage}W`} />
            <SpecRow label="Сертификат" value={component.specs.efficiency} />
            <SpecRow label="Модульный" value={component.specs.modular} />
          </>
        )}
        {category === 'case' && (
          <>
            <SpecRow label="Форм-фактор" value={component.specs.caseFormFactor?.join(', ')} />
            <SpecRow label="Макс. GPU" value={`${component.specs.maxGpuLength}мм`} />
            <SpecRow label="Макс. кулер" value={`${component.specs.maxCoolerHeight}мм`} />
          </>
        )}
        {category === 'cooling' && (
          <>
            <SpecRow label="Тип" value={component.specs.coolerType} />
            <SpecRow label="TDP" value={`до ${component.specs.coolerTdp}W`} />
            {component.specs.coolerHeight && (
              <SpecRow label="Высота" value={`${component.specs.coolerHeight}мм`} />
            )}
          </>
        )}
      </div>

      {/* Price */}
      <div className="flex items-center justify-between pt-3 border-t border-white/10">
        <span className="text-xs text-white/40">Цена</span>
        <span className={`
          text-lg font-bold font-display
          ${isSelected ? 'text-gradient-purple' : 'text-white'}
        `}>
          {formatPrice(component.price)}
        </span>
      </div>

      {/* Incompatibility message */}
      {isIncompatible && (
        <motion.div
          className="absolute inset-x-4 bottom-4 p-2 rounded bg-red-500/10 border border-red-500/30"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-xs text-red-400 text-center">
            Несовместимо с выбранными компонентами
          </p>
        </motion.div>
      )}
    </motion.button>
  );
}

function SpecRow({ 
  label, 
  value, 
  highlight = false 
}: { 
  label: string; 
  value?: string | number; 
  highlight?: boolean;
}) {
  if (!value) return null;
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-white/40">{label}</span>
      <span className={highlight ? 'text-red-400' : 'text-white/70'}>{value}</span>
    </div>
  );
}

export function ComponentModal({
  isOpen,
  category,
  selectedComponents,
  onClose,
  onSelect,
}: ComponentModalProps) {
  if (!category) return null;

  const components = COMPONENTS_DATA[category];
  const currentSelected = selectedComponents[category];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-4 md:inset-10 lg:inset-20 z-50 overflow-hidden"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="relative w-full h-full rounded-2xl overflow-hidden glass-strong">
              {/* Background effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5" />
              
              {/* Scan line */}
              <motion.div
                className="absolute inset-0 pointer-events-none overflow-hidden"
              >
                <motion.div
                  className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"
                  initial={{ top: 0 }}
                  animate={{ top: '100%' }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                />
              </motion.div>

              {/* Header */}
              <div className="relative flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 text-cyan-400">
                    {CATEGORY_ICONS[category]}
                  </div>
                  <div>
                    <h2 className="text-xl font-display font-bold text-gradient-purple">
                      {CATEGORY_LABELS[category]}
                    </h2>
                    <p className="text-sm text-white/50">
                      Выберите компонент для вашей сборки
                    </p>
                  </div>
                </div>

                <motion.button
                  onClick={onClose}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>

              {/* Components grid */}
              <div className="relative p-6 h-[calc(100%-88px)] overflow-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {components.map((component, index) => (
                    <motion.div
                      key={component.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <ComponentCard
                        component={component}
                        category={category}
                        selectedComponents={selectedComponents}
                        isSelected={currentSelected?.id === component.id}
                        onSelect={() => {
                          onSelect(component);
                          onClose();
                        }}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Corner decorations */}
              <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-purple-500/50" />
              <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-purple-500/50" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-cyan-500/50" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-cyan-500/50" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
