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
  coolerType?: 'Air' | 'AIO 240mm' | 'AIO 280mm' | 'AIO 360mm';
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
