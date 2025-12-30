// PC Component Types for VA-PC Configurator

export type ComponentCategory =
  | 'cpu'
  | 'motherboard'
  | 'gpu'
  | 'ram'
  | 'storage'
  | 'psu'
  | 'case'
  | 'cooling';

export interface PCComponent {
  id: string;
  category: ComponentCategory;
  name: string;
  brand: string;
  price: number;
  specs: ComponentSpecs;
  image?: string;
  inStock: boolean;
}

export interface ComponentSpecs {
  // CPU
  socket?: string;
  cores?: number;
  threads?: number;
  baseClock?: string;
  boostClock?: string;
  tdp?: number;

  // Motherboard
  chipset?: string;
  formFactor?: 'ATX' | 'Micro-ATX' | 'Mini-ITX' | 'E-ATX';
  memorySlots?: number;
  maxMemory?: number;
  memoryType?: 'DDR4' | 'DDR5';

  // GPU
  vram?: string;
  powerDraw?: number;
  length?: number;

  // RAM
  capacity?: string;
  speed?: string;
  type?: 'DDR4' | 'DDR5';
  modules?: number;

  // Storage
  storageCapacity?: string;
  storageType?: 'NVMe SSD' | 'SATA SSD' | 'HDD';
  readSpeed?: string;
  writeSpeed?: string;

  // PSU
  wattage?: number;
  efficiency?: '80+ Bronze' | '80+ Gold' | '80+ Platinum' | '80+ Titanium';
  modular?: 'Full' | 'Semi' | 'Non';

  // Case
  caseFormFactor?: string[];
  maxGpuLength?: number;
  maxCoolerHeight?: number;

  // Cooling
  coolerType?: 'Air' | 'AIO 240mm' | 'AIO 280mm' | 'AIO 360mm' | 'Custom Loop';
  coolerHeight?: number;
  coolerTdp?: number;
}

export interface SelectedComponents {
  cpu: PCComponent | null;
  motherboard: PCComponent | null;
  gpu: PCComponent | null;
  ram: PCComponent | null;
  storage: PCComponent | null;
  psu: PCComponent | null;
  case: PCComponent | null;
  cooling: PCComponent | null;
}

export interface CompatibilityWarning {
  type: 'error' | 'warning' | 'info';
  message: string;
  components: ComponentCategory[];
}

export interface ComponentSlotProps {
  category: ComponentCategory;
  selected: PCComponent | null;
  onSelect: () => void;
  icon: React.ReactNode;
  compatibilityStatus?: 'compatible' | 'warning' | 'error' | 'none';
}

export interface OrderSummaryData {
  totalPrice: number;
  totalPower: number;
  psuWattage: number;
  compatibilityWarnings: CompatibilityWarning[];
  isComplete: boolean;
}

export const CATEGORY_LABELS: Record<ComponentCategory, string> = {
  cpu: 'Процессор',
  motherboard: 'Материнская плата',
  gpu: 'Видеокарта',
  ram: 'Оперативная память',
  storage: 'Накопитель',
  psu: 'Блок питания',
  case: 'Корпус',
  cooling: 'Охлаждение',
};

export const CATEGORY_ICONS: Record<ComponentCategory, string> = {
  cpu: 'Cpu',
  motherboard: 'CircuitBoard',
  gpu: 'Monitor',
  ram: 'MemoryStick',
  storage: 'HardDrive',
  psu: 'Zap',
  case: 'Box',
  cooling: 'Fan',
};

// ============================================================================
// CONFIGURATOR SPECIFIC TYPES
// ============================================================================

/**
 * Product line (линейка) - maps to VK album
 * Each line has a base case and upgradeable components
 */
export interface ProductLine {
  id: string;
  name: string; // e.g., "MESH", "AERO", "COMPACT"
  description: string;
  baseCase: string; // Case model name
  baseCaseImage: string;
  vkAlbumId: string; // For fetching prices
  availableUpgrades: ComponentCategory[];
  priceRange: {
    min: number;
    max: number;
  };
}

/**
 * Water cooling components for custom loops
 */
export type WaterCoolingComponentType =
  | 'waterblock'    // CPU water block
  | 'gpuBlock'      // GPU water block
  | 'pump'          // Pump/reservoir combo
  | 'radiator'      // Radiator (240/280/360/420mm)
  | 'tubing'        // Hard or soft tubing
  | 'fittings'      // Fittings package
  | 'coolant';      // Coolant color

export interface WaterCoolingComponent {
  id: string;
  type: WaterCoolingComponentType;
  name: string;
  brand: string;
  price: number;
  specs: {
    size?: string;        // For radiators: "360mm"
    material?: string;    // For tubing: "PETG" | "Acrylic" | "Soft"
    color?: string;       // For coolant: "Clear" | "Blue" | "Purple" etc
    compatibility?: string[];
  };
  image?: string;
}

export interface WaterCoolingConfig {
  enabled: boolean;
  components: {
    waterblock: WaterCoolingComponent | null;
    gpuBlock: WaterCoolingComponent | null;
    pump: WaterCoolingComponent | null;
    radiators: WaterCoolingComponent[]; // Can have multiple
    tubing: WaterCoolingComponent | null;
    fittings: WaterCoolingComponent | null;
    coolant: WaterCoolingComponent | null;
  };
  totalPrice: number;
}

/**
 * Customization options (vinyl, photo print, etc.)
 */
export type CustomizationType = 'vinyl' | 'photoPrint' | 'rgbStrip' | 'cableSleeving';

export interface CustomizationOption {
  id: string;
  type: CustomizationType;
  name: string;
  description: string;
  price: number;
  previewImage?: string;
  options?: {
    color?: string;
    design?: string;
    placement?: string;
  };
}

export interface CustomizationConfig {
  vinyl: CustomizationOption | null;
  photoPrint: CustomizationOption | null;
  rgbStrip: CustomizationOption | null;
  cableSleeving: CustomizationOption | null;
  totalPrice: number;
}

/**
 * Full configuration state
 */
export interface ConfiguratorState {
  // Step tracking
  currentStep: number;
  completedSteps: number[];

  // Base selection
  selectedLine: ProductLine | null;
  basePrice: number;

  // Component upgrades
  components: SelectedComponents;
  componentUpgrades: Partial<Record<ComponentCategory, PCComponent>>;
  componentDeltaPrice: number;

  // Water cooling
  waterCooling: WaterCoolingConfig;

  // Customizations
  customizations: CustomizationConfig;

  // Totals
  totalPrice: number;
  totalPower: number;

  // Validation
  isValid: boolean;
  warnings: CompatibilityWarning[];
}

/**
 * Order form data
 */
export interface OrderFormData {
  // Personal info
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;

  // Delivery
  deliveryType: 'cdek' | 'pickup';
  cdekAddress?: {
    city: string;
    pvzCode: string;
    pvzAddress: string;
  };

  // Payment
  paymentMethod: 'cash' | 'card' | 'card_online';

  // Additional
  comment?: string;
  promoCode?: string;
}

export interface OrderData {
  id: string;
  createdAt: Date;
  config: ConfiguratorState;
  customer: OrderFormData;
  status: 'pending' | 'confirmed' | 'processing' | 'completed' | 'cancelled';
  generatedImageUrl?: string;
}

/**
 * Configurator step definition
 */
export interface ConfigStep {
  id: number;
  key: string;
  title: string;
  description: string;
  icon: string;
  isRequired: boolean;
  isComplete: (state: ConfiguratorState) => boolean;
}

export const CONFIGURATOR_STEPS: ConfigStep[] = [
  {
    id: 1,
    key: 'line',
    title: 'Линейка',
    description: 'Выберите базовую линейку ПК',
    icon: 'Layers',
    isRequired: true,
    isComplete: (state) => state.selectedLine !== null,
  },
  {
    id: 2,
    key: 'cpu',
    title: 'Процессор',
    description: 'Выберите процессор',
    icon: 'Cpu',
    isRequired: true,
    isComplete: (state) => state.components.cpu !== null,
  },
  {
    id: 3,
    key: 'gpu',
    title: 'Видеокарта',
    description: 'Выберите видеокарту',
    icon: 'Monitor',
    isRequired: true,
    isComplete: (state) => state.components.gpu !== null,
  },
  {
    id: 4,
    key: 'ram',
    title: 'Память',
    description: 'Выберите объём оперативной памяти',
    icon: 'MemoryStick',
    isRequired: true,
    isComplete: (state) => state.components.ram !== null,
  },
  {
    id: 5,
    key: 'storage',
    title: 'Накопитель',
    description: 'Выберите SSD накопитель',
    icon: 'HardDrive',
    isRequired: true,
    isComplete: (state) => state.components.storage !== null,
  },
  {
    id: 6,
    key: 'cooling',
    title: 'Охлаждение',
    description: 'Базовое или кастомное водяное',
    icon: 'Fan',
    isRequired: false,
    isComplete: (state) => state.components.cooling !== null || state.waterCooling.enabled,
  },
  {
    id: 7,
    key: 'customization',
    title: 'Кастомизация',
    description: 'Винил, фотопечать, RGB',
    icon: 'Palette',
    isRequired: false,
    isComplete: () => true, // Always "complete" - optional step
  },
  {
    id: 8,
    key: 'summary',
    title: 'Итого',
    description: 'Проверьте конфигурацию',
    icon: 'CheckCircle',
    isRequired: true,
    isComplete: (state) => state.isValid,
  },
];

// Animation states for assembly visualization
export type AssemblyAnimationState =
  | 'idle'
  | 'installing'
  | 'installed'
  | 'removing'
  | 'highlight';

export interface ComponentVisualState {
  category: ComponentCategory;
  animationState: AssemblyAnimationState;
  zIndex: number;
  position: { x: number; y: number };
  rotation: number;
  scale: number;
  opacity: number;
}
