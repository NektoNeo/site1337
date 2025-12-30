/**
 * useConfigurator - Main hook for PC configurator state management
 *
 * Handles:
 * - Product line selection (base PC from VK catalog)
 * - Component upgrades with delta pricing
 * - Water cooling configuration
 * - Customization options (vinyl, photo print, RGB)
 * - Order form data
 * - Price calculations
 * - Compatibility validation
 *
 * @module src/hooks/use-configurator
 */

import { useState, useCallback, useMemo, useEffect } from 'react';
import {
  ConfiguratorState,
  ProductLine,
  PCComponent,
  ComponentCategory,
  SelectedComponents,
  WaterCoolingConfig,
  WaterCoolingComponent,
  CustomizationConfig,
  CustomizationOption,
  CompatibilityWarning,
  OrderFormData,
  CONFIGURATOR_STEPS,
} from '@/components/configurator/types';
import { COMPONENTS_DATA, calculateTotalPower } from '@/components/configurator/data';

// ============================================================================
// TYPES
// ============================================================================

export interface UseConfiguratorOptions {
  /** Initial product line to select */
  initialLineId?: string;
  /** Enable auto-save to localStorage */
  persistState?: boolean;
  /** localStorage key for persistence */
  storageKey?: string;
}

export interface UseConfiguratorReturn {
  // State
  state: ConfiguratorState;

  // Navigation
  currentStep: number;
  setCurrentStep: (step: number) => void;
  canGoNext: boolean;
  canGoPrev: boolean;
  goNext: () => void;
  goPrev: () => void;

  // Product Line
  selectLine: (line: ProductLine) => void;
  clearLine: () => void;

  // Components
  selectComponent: (category: ComponentCategory, component: PCComponent) => void;
  clearComponent: (category: ComponentCategory) => void;
  getComponentOptions: (category: ComponentCategory) => PCComponent[];
  getComponentDelta: (category: ComponentCategory, component: PCComponent) => number;

  // Water Cooling
  enableWaterCooling: () => void;
  disableWaterCooling: () => void;
  setWaterCoolingComponent: (type: keyof WaterCoolingConfig['components'], component: WaterCoolingComponent | null) => void;
  addRadiator: (radiator: WaterCoolingComponent) => void;
  removeRadiator: (index: number) => void;

  // Customization
  setCustomization: (type: keyof CustomizationConfig, option: CustomizationOption | null) => void;

  // Pricing
  basePrice: number;
  componentDeltaPrice: number;
  waterCoolingPrice: number;
  customizationPrice: number;
  totalPrice: number;
  formatPrice: (price: number) => string;

  // Validation
  isValid: boolean;
  warnings: CompatibilityWarning[];
  isStepComplete: (stepIndex: number) => boolean;

  // Order
  orderForm: OrderFormData;
  updateOrderForm: (data: Partial<OrderFormData>) => void;

  // Actions
  reset: () => void;
  exportConfig: () => string;
  importConfig: (json: string) => boolean;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const STORAGE_KEY = 'va-pc-configurator-state';

const INITIAL_SELECTED_COMPONENTS: SelectedComponents = {
  cpu: null,
  motherboard: null,
  gpu: null,
  ram: null,
  storage: null,
  psu: null,
  case: null,
  cooling: null,
};

const INITIAL_WATER_COOLING: WaterCoolingConfig = {
  enabled: false,
  components: {
    waterblock: null,
    gpuBlock: null,
    pump: null,
    radiators: [],
    tubing: null,
    fittings: null,
    coolant: null,
  },
  totalPrice: 0,
};

const INITIAL_CUSTOMIZATION: CustomizationConfig = {
  vinyl: null,
  photoPrint: null,
  rgbStrip: null,
  cableSleeving: null,
  totalPrice: 0,
};

const INITIAL_ORDER_FORM: OrderFormData = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  deliveryType: 'pickup',
  paymentMethod: 'card',
};

const INITIAL_STATE: ConfiguratorState = {
  currentStep: 1,
  completedSteps: [],
  selectedLine: null,
  basePrice: 0,
  components: INITIAL_SELECTED_COMPONENTS,
  componentUpgrades: {},
  componentDeltaPrice: 0,
  waterCooling: INITIAL_WATER_COOLING,
  customizations: INITIAL_CUSTOMIZATION,
  totalPrice: 0,
  totalPower: 0,
  isValid: false,
  warnings: [],
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Format price in Russian rubles
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Format price delta with +/- sign
 */
export function formatPriceDelta(delta: number): string {
  const sign = delta >= 0 ? '+' : '';
  return `${sign}${formatPrice(delta)}`;
}

/**
 * Calculate component delta price from base configuration
 * delta = selectedComponent.price - baseComponent.price
 */
function calculateComponentDelta(
  selected: PCComponent | null,
  base: PCComponent | null
): number {
  if (!selected) return 0;
  if (!base) return selected.price;
  return selected.price - base.price;
}

/**
 * Calculate total water cooling price
 */
function calculateWaterCoolingPrice(config: WaterCoolingConfig): number {
  if (!config.enabled) return 0;

  let total = 0;
  const { components } = config;

  if (components.waterblock) total += components.waterblock.price;
  if (components.gpuBlock) total += components.gpuBlock.price;
  if (components.pump) total += components.pump.price;
  if (components.tubing) total += components.tubing.price;
  if (components.fittings) total += components.fittings.price;
  if (components.coolant) total += components.coolant.price;

  // Sum all radiators
  components.radiators.forEach(rad => {
    total += rad.price;
  });

  return total;
}

/**
 * Calculate total customization price
 */
function calculateCustomizationPrice(config: CustomizationConfig): number {
  let total = 0;

  if (config.vinyl) total += config.vinyl.price;
  if (config.photoPrint) total += config.photoPrint.price;
  if (config.rgbStrip) total += config.rgbStrip.price;
  if (config.cableSleeving) total += config.cableSleeving.price;

  return total;
}

/**
 * Validate configuration and generate warnings
 */
function validateConfiguration(state: ConfiguratorState): CompatibilityWarning[] {
  const warnings: CompatibilityWarning[] = [];
  const { components, waterCooling } = state;

  // Check CPU-Motherboard socket compatibility
  if (components.cpu && components.motherboard) {
    const cpuSocket = components.cpu.specs.socket;
    const mbSocket = components.motherboard.specs.socket;

    if (cpuSocket && mbSocket && cpuSocket !== mbSocket) {
      warnings.push({
        type: 'error',
        message: `Процессор (${cpuSocket}) несовместим с материнской платой (${mbSocket})`,
        components: ['cpu', 'motherboard'],
      });
    }
  }

  // Check RAM type compatibility
  if (components.ram && components.motherboard) {
    const ramType = components.ram.specs.type;
    const mbType = components.motherboard.specs.memoryType;

    if (ramType && mbType && ramType !== mbType) {
      warnings.push({
        type: 'error',
        message: `Память (${ramType}) несовместима с материнской платой (${mbType})`,
        components: ['ram', 'motherboard'],
      });
    }
  }

  // Check PSU wattage
  if (components.psu) {
    const psuWattage = components.psu.specs.wattage || 0;
    const requiredPower = calculateTotalPower(components);

    if (psuWattage < requiredPower) {
      warnings.push({
        type: 'warning',
        message: `Рекомендуемая мощность БП: ${requiredPower}W. Выбрано: ${psuWattage}W`,
        components: ['psu'],
      });
    }
  }

  // Check GPU length vs Case clearance
  if (components.gpu && components.case) {
    const gpuLength = components.gpu.specs.length;
    const maxGpuLength = components.case.specs.maxGpuLength;

    if (gpuLength && maxGpuLength && gpuLength > maxGpuLength) {
      warnings.push({
        type: 'error',
        message: `Видеокарта (${gpuLength}mm) не поместится в корпус (макс. ${maxGpuLength}mm)`,
        components: ['gpu', 'case'],
      });
    }
  }

  // Check cooler height vs Case clearance
  if (components.cooling && components.case) {
    const coolerHeight = components.cooling.specs.coolerHeight;
    const maxHeight = components.case.specs.maxCoolerHeight;

    if (coolerHeight && maxHeight && coolerHeight > maxHeight) {
      warnings.push({
        type: 'error',
        message: `Кулер (${coolerHeight}mm) не поместится в корпус (макс. ${maxHeight}mm)`,
        components: ['cooling', 'case'],
      });
    }
  }

  // Check cooler TDP vs CPU TDP
  if (components.cooling && components.cpu) {
    const coolerTdp = components.cooling.specs.coolerTdp;
    const cpuTdp = components.cpu.specs.tdp;

    if (coolerTdp && cpuTdp && coolerTdp < cpuTdp) {
      warnings.push({
        type: 'warning',
        message: `Кулер (${coolerTdp}W) может быть недостаточен для процессора (${cpuTdp}W)`,
        components: ['cooling', 'cpu'],
      });
    }
  }

  // Water cooling warnings
  if (waterCooling.enabled) {
    if (!waterCooling.components.waterblock) {
      warnings.push({
        type: 'info',
        message: 'Для водяного охлаждения необходим водоблок CPU',
        components: ['cooling'],
      });
    }

    if (!waterCooling.components.pump) {
      warnings.push({
        type: 'info',
        message: 'Для водяного охлаждения необходима помпа',
        components: ['cooling'],
      });
    }

    if (waterCooling.components.radiators.length === 0) {
      warnings.push({
        type: 'info',
        message: 'Для водяного охлаждения необходим хотя бы один радиатор',
        components: ['cooling'],
      });
    }
  }

  return warnings;
}

/**
 * Check if configuration is valid (no errors)
 */
function isConfigurationValid(warnings: CompatibilityWarning[]): boolean {
  return !warnings.some(w => w.type === 'error');
}

// ============================================================================
// MAIN HOOK
// ============================================================================

export function useConfigurator(options: UseConfiguratorOptions = {}): UseConfiguratorReturn {
  const {
    initialLineId,
    persistState = false,
    storageKey = STORAGE_KEY,
  } = options;

  // -------------------------------------------------------------------------
  // State
  // -------------------------------------------------------------------------

  const [state, setState] = useState<ConfiguratorState>(() => {
    // Try to restore from localStorage
    if (persistState && typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          return { ...INITIAL_STATE, ...parsed };
        }
      } catch (e) {
        console.warn('Failed to restore configurator state:', e);
      }
    }
    return INITIAL_STATE;
  });

  const [orderForm, setOrderForm] = useState<OrderFormData>(INITIAL_ORDER_FORM);

  // -------------------------------------------------------------------------
  // Persistence
  // -------------------------------------------------------------------------

  useEffect(() => {
    if (persistState && typeof window !== 'undefined') {
      try {
        localStorage.setItem(storageKey, JSON.stringify(state));
      } catch (e) {
        console.warn('Failed to persist configurator state:', e);
      }
    }
  }, [state, persistState, storageKey]);

  // -------------------------------------------------------------------------
  // Computed Values
  // -------------------------------------------------------------------------

  const basePrice = state.selectedLine?.priceRange.min || 0;

  const componentDeltaPrice = useMemo(() => {
    let delta = 0;
    const categories: ComponentCategory[] = ['cpu', 'gpu', 'ram', 'storage', 'cooling'];

    categories.forEach(cat => {
      const selected = state.components[cat];
      const base = state.componentUpgrades[cat] || null;
      delta += calculateComponentDelta(selected, base);
    });

    return delta;
  }, [state.components, state.componentUpgrades]);

  const waterCoolingPrice = useMemo(
    () => calculateWaterCoolingPrice(state.waterCooling),
    [state.waterCooling]
  );

  const customizationPrice = useMemo(
    () => calculateCustomizationPrice(state.customizations),
    [state.customizations]
  );

  const totalPrice = useMemo(
    () => basePrice + componentDeltaPrice + waterCoolingPrice + customizationPrice,
    [basePrice, componentDeltaPrice, waterCoolingPrice, customizationPrice]
  );

  const warnings = useMemo(() => validateConfiguration(state), [state]);

  const isValid = useMemo(() => isConfigurationValid(warnings), [warnings]);

  const totalPower = useMemo(
    () => calculateTotalPower(state.components),
    [state.components]
  );

  // -------------------------------------------------------------------------
  // Navigation
  // -------------------------------------------------------------------------

  const currentStep = state.currentStep;

  const setCurrentStep = useCallback((step: number) => {
    setState(prev => ({
      ...prev,
      currentStep: Math.max(1, Math.min(step, CONFIGURATOR_STEPS.length)),
    }));
  }, []);

  const isStepComplete = useCallback((stepIndex: number): boolean => {
    const step = CONFIGURATOR_STEPS[stepIndex];
    if (!step) return false;
    return step.isComplete(state);
  }, [state]);

  const canGoNext = useMemo(() => {
    const stepIndex = currentStep - 1;
    const step = CONFIGURATOR_STEPS[stepIndex];
    if (!step) return false;

    // Can always go next if step is optional or complete
    if (!step.isRequired || step.isComplete(state)) {
      return currentStep < CONFIGURATOR_STEPS.length;
    }
    return false;
  }, [currentStep, state]);

  const canGoPrev = currentStep > 1;

  const goNext = useCallback(() => {
    if (canGoNext) {
      setState(prev => ({
        ...prev,
        currentStep: prev.currentStep + 1,
        completedSteps: prev.completedSteps.includes(prev.currentStep)
          ? prev.completedSteps
          : [...prev.completedSteps, prev.currentStep],
      }));
    }
  }, [canGoNext]);

  const goPrev = useCallback(() => {
    if (canGoPrev) {
      setState(prev => ({
        ...prev,
        currentStep: prev.currentStep - 1,
      }));
    }
  }, [canGoPrev]);

  // -------------------------------------------------------------------------
  // Product Line Selection
  // -------------------------------------------------------------------------

  const selectLine = useCallback((line: ProductLine) => {
    setState(prev => ({
      ...prev,
      selectedLine: line,
      basePrice: line.priceRange.min,
      // Reset components when line changes
      components: INITIAL_SELECTED_COMPONENTS,
      componentUpgrades: {},
    }));
  }, []);

  const clearLine = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedLine: null,
      basePrice: 0,
      components: INITIAL_SELECTED_COMPONENTS,
      componentUpgrades: {},
    }));
  }, []);

  // -------------------------------------------------------------------------
  // Component Selection
  // -------------------------------------------------------------------------

  const selectComponent = useCallback((category: ComponentCategory, component: PCComponent) => {
    setState(prev => ({
      ...prev,
      components: {
        ...prev.components,
        [category]: component,
      },
    }));
  }, []);

  const clearComponent = useCallback((category: ComponentCategory) => {
    setState(prev => ({
      ...prev,
      components: {
        ...prev.components,
        [category]: null,
      },
    }));
  }, []);

  const getComponentOptions = useCallback((category: ComponentCategory): PCComponent[] => {
    return COMPONENTS_DATA[category] || [];
  }, []);

  const getComponentDelta = useCallback((
    category: ComponentCategory,
    component: PCComponent
  ): number => {
    const base = state.componentUpgrades[category] || null;
    return calculateComponentDelta(component, base);
  }, [state.componentUpgrades]);

  // -------------------------------------------------------------------------
  // Water Cooling
  // -------------------------------------------------------------------------

  const enableWaterCooling = useCallback(() => {
    setState(prev => ({
      ...prev,
      waterCooling: {
        ...prev.waterCooling,
        enabled: true,
      },
      // Clear standard cooling when enabling water cooling
      components: {
        ...prev.components,
        cooling: null,
      },
    }));
  }, []);

  const disableWaterCooling = useCallback(() => {
    setState(prev => ({
      ...prev,
      waterCooling: INITIAL_WATER_COOLING,
    }));
  }, []);

  const setWaterCoolingComponent = useCallback((
    type: keyof WaterCoolingConfig['components'],
    component: WaterCoolingComponent | null
  ) => {
    // Special handling for radiators array
    if (type === 'radiators') {
      console.warn('Use addRadiator/removeRadiator for radiators');
      return;
    }

    setState(prev => ({
      ...prev,
      waterCooling: {
        ...prev.waterCooling,
        components: {
          ...prev.waterCooling.components,
          [type]: component,
        },
      },
    }));
  }, []);

  const addRadiator = useCallback((radiator: WaterCoolingComponent) => {
    setState(prev => ({
      ...prev,
      waterCooling: {
        ...prev.waterCooling,
        components: {
          ...prev.waterCooling.components,
          radiators: [...prev.waterCooling.components.radiators, radiator],
        },
      },
    }));
  }, []);

  const removeRadiator = useCallback((index: number) => {
    setState(prev => ({
      ...prev,
      waterCooling: {
        ...prev.waterCooling,
        components: {
          ...prev.waterCooling.components,
          radiators: prev.waterCooling.components.radiators.filter((_, i) => i !== index),
        },
      },
    }));
  }, []);

  // -------------------------------------------------------------------------
  // Customization
  // -------------------------------------------------------------------------

  const setCustomization = useCallback((
    type: keyof CustomizationConfig,
    option: CustomizationOption | null
  ) => {
    if (type === 'totalPrice') return; // Skip totalPrice field

    setState(prev => ({
      ...prev,
      customizations: {
        ...prev.customizations,
        [type]: option,
      },
    }));
  }, []);

  // -------------------------------------------------------------------------
  // Order Form
  // -------------------------------------------------------------------------

  const updateOrderForm = useCallback((data: Partial<OrderFormData>) => {
    setOrderForm(prev => ({
      ...prev,
      ...data,
    }));
  }, []);

  // -------------------------------------------------------------------------
  // Actions
  // -------------------------------------------------------------------------

  const reset = useCallback(() => {
    setState(INITIAL_STATE);
    setOrderForm(INITIAL_ORDER_FORM);

    if (persistState && typeof window !== 'undefined') {
      localStorage.removeItem(storageKey);
    }
  }, [persistState, storageKey]);

  const exportConfig = useCallback((): string => {
    return JSON.stringify({
      state,
      orderForm,
      exportedAt: new Date().toISOString(),
    });
  }, [state, orderForm]);

  const importConfig = useCallback((json: string): boolean => {
    try {
      const data = JSON.parse(json);
      if (data.state) {
        setState({ ...INITIAL_STATE, ...data.state });
      }
      if (data.orderForm) {
        setOrderForm({ ...INITIAL_ORDER_FORM, ...data.orderForm });
      }
      return true;
    } catch (e) {
      console.error('Failed to import configuration:', e);
      return false;
    }
  }, []);

  // -------------------------------------------------------------------------
  // Return
  // -------------------------------------------------------------------------

  return {
    // State
    state: {
      ...state,
      basePrice,
      componentDeltaPrice,
      totalPrice,
      totalPower,
      isValid,
      warnings,
      waterCooling: {
        ...state.waterCooling,
        totalPrice: waterCoolingPrice,
      },
      customizations: {
        ...state.customizations,
        totalPrice: customizationPrice,
      },
    },

    // Navigation
    currentStep,
    setCurrentStep,
    canGoNext,
    canGoPrev,
    goNext,
    goPrev,

    // Product Line
    selectLine,
    clearLine,

    // Components
    selectComponent,
    clearComponent,
    getComponentOptions,
    getComponentDelta,

    // Water Cooling
    enableWaterCooling,
    disableWaterCooling,
    setWaterCoolingComponent,
    addRadiator,
    removeRadiator,

    // Customization
    setCustomization,

    // Pricing
    basePrice,
    componentDeltaPrice,
    waterCoolingPrice,
    customizationPrice,
    totalPrice,
    formatPrice,

    // Validation
    isValid,
    warnings,
    isStepComplete,

    // Order
    orderForm,
    updateOrderForm,

    // Actions
    reset,
    exportConfig,
    importConfig,
  };
}

// Re-export types
export type {
  ConfiguratorState,
  ProductLine,
  PCComponent,
  ComponentCategory,
  WaterCoolingConfig,
  WaterCoolingComponent,
  CustomizationConfig,
  CustomizationOption,
  CompatibilityWarning,
  OrderFormData,
};
