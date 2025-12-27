'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, RotateCcw, Share2, Zap, Cpu, HardDrive, Monitor } from 'lucide-react';
import Link from 'next/link';
import { 
  ComponentSlot, 
  PCVisualization, 
  OrderSummary, 
  ComponentModal,
  ComponentCategory,
  PCComponent,
  SelectedComponents,
  CompatibilityWarning,
  calculateTotalPower
} from '@/components/configurator';

const COMPONENT_ORDER: ComponentCategory[] = [
  'cpu',
  'motherboard',
  'gpu',
  'ram',
  'storage',
  'psu',
  'case',
  'cooling',
];

// Check compatibility between components
function checkCompatibility(components: SelectedComponents): CompatibilityWarning[] {
  const warnings: CompatibilityWarning[] = [];

  // CPU-Motherboard socket check
  if (components.cpu && components.motherboard) {
    if (components.cpu.specs.socket !== components.motherboard.specs.socket) {
      warnings.push({
        type: 'error',
        message: `Сокет процессора (${components.cpu.specs.socket}) не совместим с материнской платой (${components.motherboard.specs.socket})`,
        components: ['cpu', 'motherboard'],
      });
    }
  }

  // RAM-Motherboard type check
  if (components.ram && components.motherboard) {
    if (components.ram.specs.type !== components.motherboard.specs.memoryType) {
      warnings.push({
        type: 'error',
        message: `Тип памяти (${components.ram.specs.type}) не совместим с материнской платой (${components.motherboard.specs.memoryType})`,
        components: ['ram', 'motherboard'],
      });
    }
  }

  // PSU wattage check
  if (components.psu && (components.cpu || components.gpu)) {
    const totalPower = calculateTotalPower(components);
    if (totalPower > (components.psu.specs.wattage || 0)) {
      warnings.push({
        type: 'error',
        message: `Мощности блока питания (${components.psu.specs.wattage}W) недостаточно для системы (~${totalPower}W)`,
        components: ['psu'],
      });
    } else if (totalPower > (components.psu.specs.wattage || 0) * 0.8) {
      warnings.push({
        type: 'warning',
        message: `Блок питания работает на пределе мощности. Рекомендуется запас 20%`,
        components: ['psu'],
      });
    }
  }

  // GPU length check
  if (components.gpu && components.case) {
    if ((components.gpu.specs.length || 0) > (components.case.specs.maxGpuLength || 999)) {
      warnings.push({
        type: 'error',
        message: `Видеокарта (${components.gpu.specs.length}мм) не поместится в корпус (макс. ${components.case.specs.maxGpuLength}мм)`,
        components: ['gpu', 'case'],
      });
    }
  }

  // Cooler height check
  if (components.cooling && components.case) {
    if (
      components.cooling.specs.coolerType === 'Air' &&
      (components.cooling.specs.coolerHeight || 0) > (components.case.specs.maxCoolerHeight || 999)
    ) {
      warnings.push({
        type: 'error',
        message: `Кулер (${components.cooling.specs.coolerHeight}мм) не поместится в корпус (макс. ${components.case.specs.maxCoolerHeight}мм)`,
        components: ['cooling', 'case'],
      });
    }
  }

  // CPU TDP and Cooler check
  if (components.cpu && components.cooling) {
    if ((components.cpu.specs.tdp || 0) > (components.cooling.specs.coolerTdp || 0)) {
      warnings.push({
        type: 'warning',
        message: `TDP процессора (${components.cpu.specs.tdp}W) превышает возможности охлаждения (${components.cooling.specs.coolerTdp}W)`,
        components: ['cpu', 'cooling'],
      });
    }
  }

  return warnings;
}

// Animated background component
function ConfiguratorBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-black to-[#0a0a0f]" />
      
      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(139, 92, 246, 0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Gradient orbs */}
      <motion.div 
        className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[150px]"
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div 
        className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[150px]"
        animate={{
          x: [0, -50, 0],
          y: [0, -30, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
      />
      
      {/* Circuit lines decoration */}
      <svg className="absolute top-0 left-0 w-full h-full opacity-[0.02]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M10 10 H 50 V 50 H 90 M 50 50 V 90" stroke="#8B5CF6" fill="none" strokeWidth="1"/>
            <circle cx="50" cy="50" r="3" fill="#06B6D4"/>
            <circle cx="10" cy="10" r="2" fill="#8B5CF6"/>
            <circle cx="90" cy="50" r="2" fill="#8B5CF6"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#circuit)"/>
      </svg>
    </div>
  );
}

// Progress indicator showing build completion
function BuildProgress({ components }: { components: SelectedComponents }) {
  const totalSlots = Object.keys(components).length;
  const filledSlots = Object.values(components).filter(Boolean).length;
  const progress = (filledSlots / totalSlots) * 100;
  
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between text-sm mb-2">
        <span className="text-white/60 font-mono">Прогресс сборки</span>
        <span className="text-purple-400 font-bold">{filledSlots}/{totalSlots}</span>
      </div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-purple-500 to-cyan-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

export default function ConfiguratorPage() {
  const [selectedComponents, setSelectedComponents] = useState<SelectedComponents>({
    cpu: null,
    motherboard: null,
    gpu: null,
    ram: null,
    storage: null,
    psu: null,
    case: null,
    cooling: null,
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<ComponentCategory | null>(null);

  const compatibilityWarnings = useMemo(
    () => checkCompatibility(selectedComponents),
    [selectedComponents]
  );

  const getSlotStatus = useCallback((category: ComponentCategory): 'compatible' | 'warning' | 'error' | 'none' => {
    const hasWarning = compatibilityWarnings.some(
      w => w.components.includes(category) && w.type === 'warning'
    );
    const hasError = compatibilityWarnings.some(
      w => w.components.includes(category) && w.type === 'error'
    );
    
    if (hasError) return 'error';
    if (hasWarning) return 'warning';
    if (selectedComponents[category]) return 'compatible';
    return 'none';
  }, [compatibilityWarnings, selectedComponents]);

  const handleSelectComponent = (component: PCComponent) => {
    setSelectedComponents(prev => ({
      ...prev,
      [component.category]: component,
    }));
  };

  const handleReset = () => {
    setSelectedComponents({
      cpu: null,
      motherboard: null,
      gpu: null,
      ram: null,
      storage: null,
      psu: null,
      case: null,
      cooling: null,
    });
  };

  const handleOrder = () => {
    console.log('Order placed:', selectedComponents);
    alert('Заказ оформлен! Мы свяжемся с вами для подтверждения.');
  };

  const openModal = (category: ComponentCategory) => {
    setActiveCategory(category);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen relative">
      {/* Background effects */}
      <ConfiguratorBackground />

      {/* Page Header */}
      <div className="relative z-10 px-6 py-6 border-b border-white/5">
        <div className="max-w-[1800px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <motion.button
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors border border-white/10"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <motion.div
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/10 border border-purple-500/30 flex items-center justify-center"
                  animate={{
                    boxShadow: ['0 0 20px rgba(139,92,246,0.3)', '0 0 30px rgba(6,182,212,0.3)', '0 0 20px rgba(139,92,246,0.3)'],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Cpu className="w-5 h-5 text-purple-400" />
                </motion.div>
                <div>
                  <h1 className="text-xl font-display font-bold">
                    <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                      Конфигуратор PC
                    </span>
                  </h1>
                  <p className="text-sm text-white/40">Соберите свой идеальный компьютер</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors text-sm border border-white/10"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Сбросить</span>
            </motion.button>
            <motion.button
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 transition-colors text-sm border border-purple-500/30"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Поделиться</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-[1800px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-[calc(100vh-250px)]">
          {/* Left Panel - Component Slots */}
          <motion.div 
            className="lg:col-span-4 xl:col-span-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="sticky top-28">
              <div className="p-6 rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/10">
                <h2 className="text-lg font-display font-semibold text-white mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500" />
                  Комплектующие
                </h2>
                
                <BuildProgress components={selectedComponents} />
                
                <div className="space-y-3">
                  {COMPONENT_ORDER.map((category, index) => (
                    <motion.div
                      key={category}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <ComponentSlot
                        category={category}
                        selected={selectedComponents[category]}
                        onSelect={() => openModal(category)}
                        compatibilityStatus={getSlotStatus(category)}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Center - PC Visualization */}
          <motion.div 
            className="lg:col-span-5 xl:col-span-6 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="w-full h-full min-h-[500px] p-6 rounded-2xl bg-white/[0.02] backdrop-blur-sm border border-white/10">
              <PCVisualization components={selectedComponents} />
            </div>
          </motion.div>

          {/* Right Panel - Order Summary */}
          <motion.div 
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="sticky top-28">
              <div className="p-6 rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/10">
                <OrderSummary
                  components={selectedComponents}
                  compatibilityWarnings={compatibilityWarnings}
                  onOrder={handleOrder}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Component Selection Modal */}
      <ComponentModal
        isOpen={modalOpen}
        category={activeCategory}
        selectedComponents={selectedComponents}
        onClose={() => setModalOpen(false)}
        onSelect={handleSelectComponent}
      />

      {/* Decorative corner elements */}
      <div className="fixed top-20 left-0 w-32 h-32 border-l border-t border-purple-500/10 pointer-events-none" />
      <div className="fixed top-20 right-0 w-32 h-32 border-r border-t border-purple-500/10 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-32 h-32 border-l border-b border-cyan-500/10 pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-32 h-32 border-r border-b border-cyan-500/10 pointer-events-none" />
    </div>
  );
}
