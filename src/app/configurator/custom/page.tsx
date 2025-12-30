'use client';

/**
 * Advanced PC Configurator Page
 *
 * Features:
 * - Product line selection (MESH, AERO, COMPACT, CUSTOM)
 * - Component-by-component customization
 * - Water cooling configuration
 * - Custom options (vinyl, photo print, RGB)
 * - Assembly visualization with animation
 * - Delta pricing system
 * - Order form with delivery options
 */

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Layers,
  Cpu,
  Monitor,
  MemoryStick,
  HardDrive,
  Fan,
  Palette,
  CheckCircle,
  ShoppingCart,
  Droplets,
  Zap,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Components
import { PCVisualization } from '@/components/configurator/PCVisualization';
import { ConfigurationSteps, StepContent } from '@/components/configurator/ConfigurationSteps';
import { OrderModal } from '@/components/configurator/OrderModal';

// Hook & Data
import { useConfigurator, formatPrice, formatPriceDelta } from '@/hooks/use-configurator';
import {
  PRODUCT_LINES,
  COMPONENTS_DATA,
  WATER_COOLING_DATA,
  CUSTOMIZATION_DATA,
} from '@/components/configurator/data';
import {
  ComponentCategory,
  PCComponent,
  ProductLine,
  CustomizationType,
  WaterCoolingComponentType,
} from '@/components/configurator/types';

// ============================================================================
// COMPONENT ICONS
// ============================================================================

const STEP_ICONS: Record<string, React.ReactNode> = {
  Layers: <Layers className="w-5 h-5" />,
  Cpu: <Cpu className="w-5 h-5" />,
  Monitor: <Monitor className="w-5 h-5" />,
  MemoryStick: <MemoryStick className="w-5 h-5" />,
  HardDrive: <HardDrive className="w-5 h-5" />,
  Fan: <Fan className="w-5 h-5" />,
  Palette: <Palette className="w-5 h-5" />,
  CheckCircle: <CheckCircle className="w-5 h-5" />,
  Droplets: <Droplets className="w-5 h-5" />,
};

// ============================================================================
// PRODUCT LINE CARD
// ============================================================================

interface ProductLineCardProps {
  line: ProductLine;
  isSelected: boolean;
  onSelect: () => void;
}

function ProductLineCard({ line, isSelected, onSelect }: ProductLineCardProps) {
  return (
    <motion.button
      onClick={onSelect}
      className={cn(
        'relative p-6 rounded-2xl border text-left transition-all duration-300',
        'bg-white/[0.02] hover:bg-white/[0.05]',
        isSelected
          ? 'border-purple-500 ring-2 ring-purple-500/20'
          : 'border-white/10 hover:border-white/20'
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Selected indicator */}
      {isSelected && (
        <motion.div
          layoutId="selectedLine"
          className="absolute inset-0 rounded-2xl border-2 border-purple-500 pointer-events-none"
          initial={false}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      )}

      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-bold text-white">{line.name}</h3>
          {isSelected && (
            <CheckCircle className="w-5 h-5 text-purple-400" />
          )}
        </div>

        <p className="text-sm text-white/50 line-clamp-2">{line.description}</p>

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-white/40">от</span>
          <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
            {formatPrice(line.priceRange.min)}
          </span>
        </div>
      </div>
    </motion.button>
  );
}

// ============================================================================
// COMPONENT OPTION CARD
// ============================================================================

interface ComponentOptionCardProps {
  component: PCComponent;
  isSelected: boolean;
  delta: number;
  onSelect: () => void;
}

function ComponentOptionCard({ component, isSelected, delta, onSelect }: ComponentOptionCardProps) {
  return (
    <motion.button
      onClick={onSelect}
      className={cn(
        'relative p-4 rounded-xl border text-left transition-all duration-300',
        'bg-white/[0.02] hover:bg-white/[0.05]',
        isSelected
          ? 'border-purple-500 ring-1 ring-purple-500/20'
          : 'border-white/10 hover:border-white/20',
        !component.inStock && 'opacity-50 cursor-not-allowed'
      )}
      disabled={!component.inStock}
      whileHover={component.inStock ? { scale: 1.01 } : {}}
      whileTap={component.inStock ? { scale: 0.99 } : {}}
    >
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <p className="text-xs text-white/40">{component.brand}</p>
            <h4 className="text-sm font-semibold text-white">{component.name}</h4>
          </div>
          {isSelected && (
            <CheckCircle className="w-4 h-4 text-purple-400 flex-shrink-0" />
          )}
        </div>

        {/* Specs preview */}
        <div className="text-xs text-white/50 space-y-0.5">
          {component.specs.cores && (
            <p>{component.specs.cores} ядер / {component.specs.threads} потоков</p>
          )}
          {component.specs.vram && (
            <p>{component.specs.vram}</p>
          )}
          {component.specs.capacity && (
            <p>{component.specs.capacity} · {component.specs.speed}</p>
          )}
          {component.specs.storageCapacity && (
            <p>{component.specs.storageCapacity} · {component.specs.readSpeed}</p>
          )}
          {component.specs.wattage && (
            <p>{component.specs.wattage}W · {component.specs.efficiency}</p>
          )}
          {component.specs.coolerType && (
            <p>{component.specs.coolerType}</p>
          )}
        </div>

        {/* Price delta */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <span className={cn(
            'text-sm font-medium',
            delta > 0 ? 'text-amber-400' : delta < 0 ? 'text-emerald-400' : 'text-white/50'
          )}>
            {formatPriceDelta(delta)}
          </span>
          {!component.inStock && (
            <span className="text-xs text-red-400">Нет в наличии</span>
          )}
        </div>
      </div>
    </motion.button>
  );
}

// ============================================================================
// CUSTOMIZATION OPTION CARD
// ============================================================================

interface CustomOptionCardProps {
  option: {
    id: string;
    name: string;
    description: string;
    price: number;
    options?: Record<string, string>;
  };
  isSelected: boolean;
  onSelect: () => void;
}

function CustomOptionCard({ option, isSelected, onSelect }: CustomOptionCardProps) {
  return (
    <motion.button
      onClick={onSelect}
      className={cn(
        'p-4 rounded-xl border text-left transition-all duration-300',
        'bg-white/[0.02] hover:bg-white/[0.05]',
        isSelected
          ? 'border-fuchsia-500 ring-1 ring-fuchsia-500/20'
          : 'border-white/10 hover:border-white/20'
      )}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-semibold text-white">{option.name}</h4>
          {isSelected && (
            <CheckCircle className="w-4 h-4 text-fuchsia-400" />
          )}
        </div>
        <p className="text-xs text-white/50">{option.description}</p>
        <p className="text-sm font-medium text-fuchsia-400">+{formatPrice(option.price)}</p>
      </div>
    </motion.button>
  );
}

// ============================================================================
// WATER COOLING SECTION
// ============================================================================

interface WaterCoolingSectionProps {
  config: ReturnType<typeof useConfigurator>['state']['waterCooling'];
  onEnable: () => void;
  onDisable: () => void;
  onSetComponent: ReturnType<typeof useConfigurator>['setWaterCoolingComponent'];
  onAddRadiator: ReturnType<typeof useConfigurator>['addRadiator'];
  onRemoveRadiator: ReturnType<typeof useConfigurator>['removeRadiator'];
}

function WaterCoolingSection({
  config,
  onEnable,
  onDisable,
  onSetComponent,
  onAddRadiator,
  onRemoveRadiator,
}: WaterCoolingSectionProps) {
  const componentTypes: Array<{ type: WaterCoolingComponentType; label: string }> = [
    { type: 'waterblock', label: 'Водоблок CPU' },
    { type: 'gpuBlock', label: 'Водоблок GPU' },
    { type: 'pump', label: 'Помпа/Резервуар' },
    { type: 'tubing', label: 'Трубки' },
    { type: 'fittings', label: 'Фитинги' },
    { type: 'coolant', label: 'Охлаждающая жидкость' },
  ];

  return (
    <div className="space-y-6">
      {/* Enable/Disable toggle */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/10">
        <div className="flex items-center gap-3">
          <Droplets className="w-5 h-5 text-cyan-400" />
          <div>
            <p className="font-medium text-white">Кастомное водяное охлаждение</p>
            <p className="text-xs text-white/50">Полностью кастомный контур</p>
          </div>
        </div>
        <button
          onClick={config.enabled ? onDisable : onEnable}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-medium transition-all',
            config.enabled
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
              : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10'
          )}
        >
          {config.enabled ? 'Включено' : 'Включить'}
        </button>
      </div>

      {/* Component selection */}
      {config.enabled && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-4"
        >
          {componentTypes.map(({ type, label }) => (
            <div key={type} className="space-y-2">
              <label className="text-xs font-mono text-white/40 uppercase">{label}</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {WATER_COOLING_DATA[type].map(comp => {
                  const isSelected = config.components[type as keyof typeof config.components] === comp ||
                    (type === 'radiator' && config.components.radiators.some(r => r.id === comp.id));

                  return (
                    <button
                      key={comp.id}
                      onClick={() => {
                        if (type === 'radiator') {
                          if (isSelected) {
                            const idx = config.components.radiators.findIndex(r => r.id === comp.id);
                            if (idx >= 0) onRemoveRadiator(idx);
                          } else {
                            onAddRadiator(comp);
                          }
                        } else {
                          onSetComponent(type as keyof typeof config.components, isSelected ? null : comp);
                        }
                      }}
                      className={cn(
                        'p-3 rounded-lg border text-left text-xs transition-all',
                        isSelected
                          ? 'border-cyan-500 bg-cyan-500/10'
                          : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]'
                      )}
                    >
                      <p className="font-medium text-white">{comp.name}</p>
                      <p className="text-white/40">{comp.brand}</p>
                      <p className="text-cyan-400 mt-1">+{formatPrice(comp.price)}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Total water cooling price */}
          <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
            <div className="flex items-center justify-between">
              <span className="text-white/70">Стоимость водяного охлаждения:</span>
              <span className="text-lg font-bold text-cyan-400">
                +{formatPrice(config.totalPrice)}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// ============================================================================
// PRICE SUMMARY CARD
// ============================================================================

interface PriceSummaryProps {
  basePrice: number;
  componentDelta: number;
  waterCoolingPrice: number;
  customizationPrice: number;
  totalPrice: number;
  warnings: ReturnType<typeof useConfigurator>['warnings'];
}

function PriceSummary({
  basePrice,
  componentDelta,
  waterCoolingPrice,
  customizationPrice,
  totalPrice,
  warnings,
}: PriceSummaryProps) {
  const hasErrors = warnings.some(w => w.type === 'error');
  const hasWarnings = warnings.some(w => w.type === 'warning');

  return (
    <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-4 space-y-4">
      <h3 className="text-sm font-mono text-white/40 uppercase">Стоимость</h3>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-white/50">Базовая сборка</span>
          <span className="text-white">{formatPrice(basePrice)}</span>
        </div>
        {componentDelta !== 0 && (
          <div className="flex justify-between">
            <span className="text-white/50">Апгрейды</span>
            <span className={componentDelta > 0 ? 'text-amber-400' : 'text-emerald-400'}>
              {formatPriceDelta(componentDelta)}
            </span>
          </div>
        )}
        {waterCoolingPrice > 0 && (
          <div className="flex justify-between">
            <span className="text-white/50">Водяное охлаждение</span>
            <span className="text-cyan-400">+{formatPrice(waterCoolingPrice)}</span>
          </div>
        )}
        {customizationPrice > 0 && (
          <div className="flex justify-between">
            <span className="text-white/50">Кастомизация</span>
            <span className="text-fuchsia-400">+{formatPrice(customizationPrice)}</span>
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-white/10">
        <div className="flex justify-between items-center">
          <span className="font-medium text-white">Итого</span>
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
            {formatPrice(totalPrice)}
          </span>
        </div>
      </div>

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="space-y-2 pt-3 border-t border-white/10">
          {warnings.map((warning, idx) => (
            <div
              key={idx}
              className={cn(
                'flex items-start gap-2 p-2 rounded-lg text-xs',
                warning.type === 'error' ? 'bg-red-500/10 text-red-300' :
                warning.type === 'warning' ? 'bg-amber-500/10 text-amber-300' :
                'bg-blue-500/10 text-blue-300'
              )}
            >
              {warning.type === 'error' ? (
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              ) : warning.type === 'warning' ? (
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              ) : (
                <Info className="w-4 h-4 flex-shrink-0" />
              )}
              <span>{warning.message}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function CustomConfiguratorPage() {
  const [showOrderModal, setShowOrderModal] = useState(false);

  const configurator = useConfigurator({ persistState: true });
  const {
    state,
    currentStep,
    setCurrentStep,
    canGoNext,
    canGoPrev,
    goNext,
    goPrev,
    selectLine,
    selectComponent,
    getComponentOptions,
    getComponentDelta,
    enableWaterCooling,
    disableWaterCooling,
    setWaterCoolingComponent,
    addRadiator,
    removeRadiator,
    setCustomization,
    orderForm,
    updateOrderForm,
    reset,
  } = configurator;

  // Handle order submit
  const handleOrderSubmit = useCallback(async () => {
    console.log('Order submitted:', {
      config: state,
      customer: orderForm,
    });
    // TODO: Send order to backend API
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
    setShowOrderModal(false);
    alert('Заказ успешно оформлен! Мы свяжемся с вами в ближайшее время.');
    reset();
  }, [state, orderForm, reset]);

  // Get step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // Product Line
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PRODUCT_LINES.map(line => (
                <ProductLineCard
                  key={line.id}
                  line={line}
                  isSelected={state.selectedLine?.id === line.id}
                  onSelect={() => selectLine(line)}
                />
              ))}
            </div>
          </div>
        );

      case 2: // CPU
      case 3: // GPU
      case 4: // RAM
      case 5: // Storage
        const categoryMap: Record<number, ComponentCategory> = {
          2: 'cpu',
          3: 'gpu',
          4: 'ram',
          5: 'storage',
        };
        const category = categoryMap[currentStep];
        const options = getComponentOptions(category);

        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {options.map(comp => (
              <ComponentOptionCard
                key={comp.id}
                component={comp}
                isSelected={state.components[category]?.id === comp.id}
                delta={getComponentDelta(category, comp)}
                onSelect={() => selectComponent(category, comp)}
              />
            ))}
          </div>
        );

      case 6: // Cooling
        return (
          <div className="space-y-6">
            {/* Standard cooling options */}
            <div className="space-y-3">
              <h3 className="text-sm font-mono text-white/40 uppercase">Воздушное / AIO охлаждение</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {getComponentOptions('cooling').map(comp => (
                  <ComponentOptionCard
                    key={comp.id}
                    component={comp}
                    isSelected={state.components.cooling?.id === comp.id}
                    delta={getComponentDelta('cooling', comp)}
                    onSelect={() => selectComponent('cooling', comp)}
                  />
                ))}
              </div>
            </div>

            {/* Water cooling section */}
            <WaterCoolingSection
              config={state.waterCooling}
              onEnable={enableWaterCooling}
              onDisable={disableWaterCooling}
              onSetComponent={setWaterCoolingComponent}
              onAddRadiator={addRadiator}
              onRemoveRadiator={removeRadiator}
            />
          </div>
        );

      case 7: // Customization
        const customTypes: Array<{ type: CustomizationType; label: string }> = [
          { type: 'vinyl', label: 'Виниловая пленка' },
          { type: 'photoPrint', label: 'Фотопечать' },
          { type: 'rgbStrip', label: 'RGB подсветка' },
          { type: 'cableSleeving', label: 'Кабели в оплетке' },
        ];

        return (
          <div className="space-y-6">
            {customTypes.map(({ type, label }) => (
              <div key={type} className="space-y-3">
                <h3 className="text-sm font-mono text-white/40 uppercase">{label}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {CUSTOMIZATION_DATA[type].map(opt => (
                    <CustomOptionCard
                      key={opt.id}
                      option={opt}
                      isSelected={state.customizations[type]?.id === opt.id}
                      onSelect={() => setCustomization(
                        type,
                        state.customizations[type]?.id === opt.id ? null : opt
                      )}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        );

      case 8: // Summary
        return (
          <div className="space-y-6">
            <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-6 space-y-4">
              <h3 className="text-lg font-bold text-white">Ваша конфигурация</h3>

              {/* Selected components list */}
              <div className="space-y-3">
                {state.selectedLine && (
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-white/50">Линейка</span>
                    <span className="text-white font-medium">{state.selectedLine.name}</span>
                  </div>
                )}
                {state.components.cpu && (
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-white/50">Процессор</span>
                    <span className="text-white font-medium">{state.components.cpu.name}</span>
                  </div>
                )}
                {state.components.gpu && (
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-white/50">Видеокарта</span>
                    <span className="text-white font-medium">{state.components.gpu.name}</span>
                  </div>
                )}
                {state.components.ram && (
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-white/50">Память</span>
                    <span className="text-white font-medium">{state.components.ram.name}</span>
                  </div>
                )}
                {state.components.storage && (
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-white/50">Накопитель</span>
                    <span className="text-white font-medium">{state.components.storage.name}</span>
                  </div>
                )}
                {(state.components.cooling || state.waterCooling.enabled) && (
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-white/50">Охлаждение</span>
                    <span className="text-white font-medium">
                      {state.waterCooling.enabled ? 'Кастомная водянка' : state.components.cooling?.name}
                    </span>
                  </div>
                )}
              </div>

              {/* Power consumption */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <Zap className="w-5 h-5 text-amber-400" />
                <div>
                  <p className="text-sm font-medium text-white">Потребление: ~{state.totalPower}W</p>
                  <p className="text-xs text-white/50">Рекомендуемый БП: {Math.ceil(state.totalPower / 50) * 50}W+</p>
                </div>
              </div>
            </div>

            {/* Order button */}
            <button
              onClick={() => setShowOrderModal(true)}
              disabled={!state.isValid}
              className={cn(
                'w-full py-4 rounded-xl text-lg font-bold transition-all',
                'flex items-center justify-center gap-3',
                state.isValid
                  ? 'bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600 text-white'
                  : 'bg-white/5 text-white/30 cursor-not-allowed'
              )}
            >
              <ShoppingCart className="w-5 h-5" />
              Оформить заказ
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 mesh-background" />
        <div className="absolute inset-0 opacity-[0.03] cyber-grid" />
        <div className="absolute -top-40 -left-40 w-[520px] h-[520px] bg-purple-600/20 rounded-full blur-[140px]" />
        <div className="absolute -bottom-40 -right-40 w-[520px] h-[520px] bg-fuchsia-600/15 rounded-full blur-[140px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/5">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/configurator"
              className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              aria-label="Назад"
            >
              <ArrowLeft className="w-5 h-5 text-white/70" />
            </Link>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/40">Custom Builder</p>
              <h1 className="text-xl font-semibold text-white">Расширенный конфигуратор</h1>
            </div>
          </div>

          <button
            onClick={reset}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white/70 text-sm transition-colors"
          >
            Сбросить
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Preview + Price */}
          <div className="lg:col-span-4 space-y-6">
            {/* PC Visualization */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="sticky top-8"
            >
              <PCVisualization
                components={state.components}
                productLine={state.selectedLine}
                waterCooling={state.waterCooling.enabled ? state.waterCooling : undefined}
                activeComponent={
                  currentStep === 2 ? 'cpu' :
                  currentStep === 3 ? 'gpu' :
                  currentStep === 4 ? 'ram' :
                  currentStep === 5 ? 'storage' :
                  currentStep === 6 ? 'cooling' : undefined
                }
                compact
              />

              {/* Price Summary */}
              <div className="mt-6">
                <PriceSummary
                  basePrice={state.basePrice}
                  componentDelta={state.componentDeltaPrice}
                  waterCoolingPrice={state.waterCooling.totalPrice}
                  customizationPrice={state.customizations.totalPrice}
                  totalPrice={state.totalPrice}
                  warnings={state.warnings}
                />
              </div>
            </motion.div>
          </div>

          {/* Right: Steps + Content */}
          <div className="lg:col-span-8 space-y-6">
            {/* Configuration Steps */}
            <ConfigurationSteps
              state={state}
              currentStep={currentStep}
              onStepChange={setCurrentStep}
              canGoNext={canGoNext}
              canGoPrev={canGoPrev}
              onNext={goNext}
              onPrev={goPrev}
            />

            {/* Step Content */}
            <div className="rounded-2xl bg-white/[0.02] border border-white/10 p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderStepContent()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      {/* Order Modal */}
      <OrderModal
        isOpen={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        onSubmit={handleOrderSubmit}
        config={state}
        formData={orderForm}
        onUpdateForm={updateOrderForm}
      />
    </div>
  );
}
