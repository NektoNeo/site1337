// Mock data for VA-PC Configurator
import {
  PCComponent,
  ComponentCategory,
  ProductLine,
  WaterCoolingComponent,
  WaterCoolingComponentType,
  CustomizationOption,
  CustomizationType,
} from './types';

export const COMPONENTS_DATA: Record<ComponentCategory, PCComponent[]> = {
  cpu: [
    {
      id: 'cpu-1',
      category: 'cpu',
      name: 'Intel Core i9-14900K',
      brand: 'Intel',
      price: 62990,
      inStock: true,
      specs: {
        socket: 'LGA1700',
        cores: 24,
        threads: 32,
        baseClock: '3.2 GHz',
        boostClock: '6.0 GHz',
        tdp: 253,
      },
    },
    {
      id: 'cpu-2',
      category: 'cpu',
      name: 'Intel Core i7-14700K',
      brand: 'Intel',
      price: 44990,
      inStock: true,
      specs: {
        socket: 'LGA1700',
        cores: 20,
        threads: 28,
        baseClock: '3.4 GHz',
        boostClock: '5.6 GHz',
        tdp: 253,
      },
    },
    {
      id: 'cpu-3',
      category: 'cpu',
      name: 'Intel Core i5-14600K',
      brand: 'Intel',
      price: 32990,
      inStock: true,
      specs: {
        socket: 'LGA1700',
        cores: 14,
        threads: 20,
        baseClock: '3.5 GHz',
        boostClock: '5.3 GHz',
        tdp: 181,
      },
    },
    {
      id: 'cpu-4',
      category: 'cpu',
      name: 'AMD Ryzen 9 7950X3D',
      brand: 'AMD',
      price: 69990,
      inStock: true,
      specs: {
        socket: 'AM5',
        cores: 16,
        threads: 32,
        baseClock: '4.2 GHz',
        boostClock: '5.7 GHz',
        tdp: 120,
      },
    },
    {
      id: 'cpu-5',
      category: 'cpu',
      name: 'AMD Ryzen 7 7800X3D',
      brand: 'AMD',
      price: 44990,
      inStock: true,
      specs: {
        socket: 'AM5',
        cores: 8,
        threads: 16,
        baseClock: '4.2 GHz',
        boostClock: '5.0 GHz',
        tdp: 120,
      },
    },
  ],
  
  motherboard: [
    {
      id: 'mb-1',
      category: 'motherboard',
      name: 'ASUS ROG Maximus Z790 Hero',
      brand: 'ASUS',
      price: 59990,
      inStock: true,
      specs: {
        socket: 'LGA1700',
        chipset: 'Z790',
        formFactor: 'ATX',
        memorySlots: 4,
        maxMemory: 192,
        memoryType: 'DDR5',
      },
    },
    {
      id: 'mb-2',
      category: 'motherboard',
      name: 'MSI MEG Z790 ACE',
      brand: 'MSI',
      price: 54990,
      inStock: true,
      specs: {
        socket: 'LGA1700',
        chipset: 'Z790',
        formFactor: 'E-ATX',
        memorySlots: 4,
        maxMemory: 192,
        memoryType: 'DDR5',
      },
    },
    {
      id: 'mb-3',
      category: 'motherboard',
      name: 'Gigabyte Z790 AORUS Master',
      brand: 'Gigabyte',
      price: 49990,
      inStock: true,
      specs: {
        socket: 'LGA1700',
        chipset: 'Z790',
        formFactor: 'ATX',
        memorySlots: 4,
        maxMemory: 192,
        memoryType: 'DDR5',
      },
    },
    {
      id: 'mb-4',
      category: 'motherboard',
      name: 'ASUS ROG Crosshair X670E Hero',
      brand: 'ASUS',
      price: 54990,
      inStock: true,
      specs: {
        socket: 'AM5',
        chipset: 'X670E',
        formFactor: 'ATX',
        memorySlots: 4,
        maxMemory: 128,
        memoryType: 'DDR5',
      },
    },
    {
      id: 'mb-5',
      category: 'motherboard',
      name: 'MSI MEG X670E ACE',
      brand: 'MSI',
      price: 49990,
      inStock: true,
      specs: {
        socket: 'AM5',
        chipset: 'X670E',
        formFactor: 'E-ATX',
        memorySlots: 4,
        maxMemory: 128,
        memoryType: 'DDR5',
      },
    },
  ],
  
  gpu: [
    {
      id: 'gpu-1',
      category: 'gpu',
      name: 'NVIDIA GeForce RTX 4090',
      brand: 'NVIDIA',
      price: 189990,
      inStock: true,
      specs: {
        vram: '24 GB GDDR6X',
        powerDraw: 450,
        length: 336,
      },
    },
    {
      id: 'gpu-2',
      category: 'gpu',
      name: 'NVIDIA GeForce RTX 4080 SUPER',
      brand: 'NVIDIA',
      price: 129990,
      inStock: true,
      specs: {
        vram: '16 GB GDDR6X',
        powerDraw: 320,
        length: 304,
      },
    },
    {
      id: 'gpu-3',
      category: 'gpu',
      name: 'NVIDIA GeForce RTX 4070 Ti SUPER',
      brand: 'NVIDIA',
      price: 89990,
      inStock: true,
      specs: {
        vram: '16 GB GDDR6X',
        powerDraw: 285,
        length: 285,
      },
    },
    {
      id: 'gpu-4',
      category: 'gpu',
      name: 'NVIDIA GeForce RTX 4070 SUPER',
      brand: 'NVIDIA',
      price: 69990,
      inStock: true,
      specs: {
        vram: '12 GB GDDR6X',
        powerDraw: 220,
        length: 267,
      },
    },
    {
      id: 'gpu-5',
      category: 'gpu',
      name: 'AMD Radeon RX 7900 XTX',
      brand: 'AMD',
      price: 109990,
      inStock: true,
      specs: {
        vram: '24 GB GDDR6',
        powerDraw: 355,
        length: 287,
      },
    },
  ],
  
  ram: [
    {
      id: 'ram-1',
      category: 'ram',
      name: 'G.Skill Trident Z5 RGB 64GB',
      brand: 'G.Skill',
      price: 24990,
      inStock: true,
      specs: {
        capacity: '64 GB',
        speed: 'DDR5-6400',
        type: 'DDR5',
        modules: 2,
      },
    },
    {
      id: 'ram-2',
      category: 'ram',
      name: 'G.Skill Trident Z5 RGB 32GB',
      brand: 'G.Skill',
      price: 14990,
      inStock: true,
      specs: {
        capacity: '32 GB',
        speed: 'DDR5-6400',
        type: 'DDR5',
        modules: 2,
      },
    },
    {
      id: 'ram-3',
      category: 'ram',
      name: 'Kingston Fury Beast 32GB',
      brand: 'Kingston',
      price: 11990,
      inStock: true,
      specs: {
        capacity: '32 GB',
        speed: 'DDR5-5600',
        type: 'DDR5',
        modules: 2,
      },
    },
    {
      id: 'ram-4',
      category: 'ram',
      name: 'Corsair Dominator Platinum 64GB',
      brand: 'Corsair',
      price: 29990,
      inStock: true,
      specs: {
        capacity: '64 GB',
        speed: 'DDR5-6600',
        type: 'DDR5',
        modules: 2,
      },
    },
  ],
  
  storage: [
    {
      id: 'storage-1',
      category: 'storage',
      name: 'Samsung 990 PRO 2TB',
      brand: 'Samsung',
      price: 19990,
      inStock: true,
      specs: {
        storageCapacity: '2 TB',
        storageType: 'NVMe SSD',
        readSpeed: '7450 MB/s',
        writeSpeed: '6900 MB/s',
      },
    },
    {
      id: 'storage-2',
      category: 'storage',
      name: 'Samsung 990 PRO 1TB',
      brand: 'Samsung',
      price: 12990,
      inStock: true,
      specs: {
        storageCapacity: '1 TB',
        storageType: 'NVMe SSD',
        readSpeed: '7450 MB/s',
        writeSpeed: '6900 MB/s',
      },
    },
    {
      id: 'storage-3',
      category: 'storage',
      name: 'WD Black SN850X 2TB',
      brand: 'Western Digital',
      price: 17990,
      inStock: true,
      specs: {
        storageCapacity: '2 TB',
        storageType: 'NVMe SSD',
        readSpeed: '7300 MB/s',
        writeSpeed: '6600 MB/s',
      },
    },
    {
      id: 'storage-4',
      category: 'storage',
      name: 'Seagate FireCuda 530 2TB',
      brand: 'Seagate',
      price: 21990,
      inStock: true,
      specs: {
        storageCapacity: '2 TB',
        storageType: 'NVMe SSD',
        readSpeed: '7300 MB/s',
        writeSpeed: '6900 MB/s',
      },
    },
  ],
  
  psu: [
    {
      id: 'psu-1',
      category: 'psu',
      name: 'Corsair HX1500i',
      brand: 'Corsair',
      price: 34990,
      inStock: true,
      specs: {
        wattage: 1500,
        efficiency: '80+ Platinum',
        modular: 'Full',
      },
    },
    {
      id: 'psu-2',
      category: 'psu',
      name: 'Corsair RM1000x',
      brand: 'Corsair',
      price: 19990,
      inStock: true,
      specs: {
        wattage: 1000,
        efficiency: '80+ Gold',
        modular: 'Full',
      },
    },
    {
      id: 'psu-3',
      category: 'psu',
      name: 'Seasonic Prime TX-1000',
      brand: 'Seasonic',
      price: 32990,
      inStock: true,
      specs: {
        wattage: 1000,
        efficiency: '80+ Titanium',
        modular: 'Full',
      },
    },
    {
      id: 'psu-4',
      category: 'psu',
      name: 'be quiet! Dark Power 13 850W',
      brand: 'be quiet!',
      price: 24990,
      inStock: true,
      specs: {
        wattage: 850,
        efficiency: '80+ Titanium',
        modular: 'Full',
      },
    },
    {
      id: 'psu-5',
      category: 'psu',
      name: 'EVGA SuperNOVA 1000 G7',
      brand: 'EVGA',
      price: 21990,
      inStock: true,
      specs: {
        wattage: 1000,
        efficiency: '80+ Gold',
        modular: 'Full',
      },
    },
  ],
  
  case: [
    {
      id: 'case-1',
      category: 'case',
      name: 'Lian Li O11 Dynamic EVO',
      brand: 'Lian Li',
      price: 17990,
      inStock: true,
      specs: {
        caseFormFactor: ['ATX', 'Micro-ATX', 'Mini-ITX', 'E-ATX'],
        maxGpuLength: 422,
        maxCoolerHeight: 167,
      },
    },
    {
      id: 'case-2',
      category: 'case',
      name: 'NZXT H9 Elite',
      brand: 'NZXT',
      price: 24990,
      inStock: true,
      specs: {
        caseFormFactor: ['ATX', 'Micro-ATX', 'Mini-ITX', 'E-ATX'],
        maxGpuLength: 435,
        maxCoolerHeight: 165,
      },
    },
    {
      id: 'case-3',
      category: 'case',
      name: 'Corsair 5000D Airflow',
      brand: 'Corsair',
      price: 17990,
      inStock: true,
      specs: {
        caseFormFactor: ['ATX', 'Micro-ATX', 'Mini-ITX', 'E-ATX'],
        maxGpuLength: 420,
        maxCoolerHeight: 170,
      },
    },
    {
      id: 'case-4',
      category: 'case',
      name: 'Fractal Design Torrent',
      brand: 'Fractal Design',
      price: 21990,
      inStock: true,
      specs: {
        caseFormFactor: ['ATX', 'Micro-ATX', 'Mini-ITX', 'E-ATX'],
        maxGpuLength: 461,
        maxCoolerHeight: 188,
      },
    },
  ],
  
  cooling: [
    {
      id: 'cooling-1',
      category: 'cooling',
      name: 'NZXT Kraken Z73 RGB',
      brand: 'NZXT',
      price: 29990,
      inStock: true,
      specs: {
        coolerType: 'AIO 360mm',
        coolerTdp: 350,
      },
    },
    {
      id: 'cooling-2',
      category: 'cooling',
      name: 'Corsair iCUE H150i Elite',
      brand: 'Corsair',
      price: 24990,
      inStock: true,
      specs: {
        coolerType: 'AIO 360mm',
        coolerTdp: 300,
      },
    },
    {
      id: 'cooling-3',
      category: 'cooling',
      name: 'ASUS ROG Ryujin III 360',
      brand: 'ASUS',
      price: 34990,
      inStock: true,
      specs: {
        coolerType: 'AIO 360mm',
        coolerTdp: 350,
      },
    },
    {
      id: 'cooling-4',
      category: 'cooling',
      name: 'Noctua NH-D15 chromax.black',
      brand: 'Noctua',
      price: 12990,
      inStock: true,
      specs: {
        coolerType: 'Air',
        coolerHeight: 165,
        coolerTdp: 250,
      },
    },
    {
      id: 'cooling-5',
      category: 'cooling',
      name: 'be quiet! Dark Rock Pro 5',
      brand: 'be quiet!',
      price: 9990,
      inStock: true,
      specs: {
        coolerType: 'Air',
        coolerHeight: 168,
        coolerTdp: 270,
      },
    },
  ],
};

// Helper to format price in Russian rubles
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

// Calculate total power consumption
export function calculateTotalPower(components: {
  cpu: PCComponent | null;
  gpu: PCComponent | null;
  ram: PCComponent | null;
  storage: PCComponent | null;
  motherboard: PCComponent | null;
  cooling: PCComponent | null;
}): number {
  let totalPower = 0;
  
  // CPU TDP
  if (components.cpu?.specs.tdp) {
    totalPower += components.cpu.specs.tdp;
  }
  
  // GPU Power Draw
  if (components.gpu?.specs.powerDraw) {
    totalPower += components.gpu.specs.powerDraw;
  }
  
  // Base system power (motherboard, RAM, storage, fans)
  totalPower += 100; // Base overhead
  
  // Add 20% overhead for safety
  return Math.ceil(totalPower * 1.2);
}

// ============================================================================
// PRODUCT LINES (to be loaded from VK API)
// ============================================================================

export const PRODUCT_LINES: ProductLine[] = [
  {
    id: 'mesh',
    name: 'VA-PC MESH',
    description: 'Максимальный airflow для мощных систем. Сетчатая передняя панель и оптимизированная вентиляция.',
    baseCase: 'Lian Li Lancool III Mesh',
    baseCaseImage: '/images/cases/mesh.webp',
    vkAlbumId: 'mesh_album', // Replace with actual VK album ID
    availableUpgrades: ['cpu', 'gpu', 'ram', 'storage', 'cooling'],
    priceRange: {
      min: 189990,
      max: 489990,
    },
  },
  {
    id: 'aero',
    name: 'VA-PC AERO',
    description: 'Элегантный дизайн с панорамным стеклом. Идеален для showcase сборок.',
    baseCase: 'Lian Li O11 Dynamic EVO',
    baseCaseImage: '/images/cases/aero.webp',
    vkAlbumId: 'aero_album', // Replace with actual VK album ID
    availableUpgrades: ['cpu', 'gpu', 'ram', 'storage', 'cooling'],
    priceRange: {
      min: 219990,
      max: 549990,
    },
  },
  {
    id: 'compact',
    name: 'VA-PC COMPACT',
    description: 'Компактная мощность для ограниченного пространства. Mini-ITX форм-фактор.',
    baseCase: 'NZXT H1 V2',
    baseCaseImage: '/images/cases/compact.webp',
    vkAlbumId: 'compact_album', // Replace with actual VK album ID
    availableUpgrades: ['cpu', 'gpu', 'ram', 'storage'],
    priceRange: {
      min: 169990,
      max: 369990,
    },
  },
  {
    id: 'custom',
    name: 'VA-PC CUSTOM',
    description: 'Полностью кастомная сборка с водяным охлаждением. Для тех, кто хочет уникальность.',
    baseCase: 'Phanteks Enthoo Elite',
    baseCaseImage: '/images/cases/custom.webp',
    vkAlbumId: 'custom_album', // Replace with actual VK album ID
    availableUpgrades: ['cpu', 'gpu', 'ram', 'storage', 'cooling'],
    priceRange: {
      min: 299990,
      max: 999990,
    },
  },
];

// ============================================================================
// WATER COOLING COMPONENTS
// ============================================================================

export const WATER_COOLING_DATA: Record<WaterCoolingComponentType, WaterCoolingComponent[]> = {
  waterblock: [
    {
      id: 'wb-1',
      type: 'waterblock',
      name: 'EK-Quantum Velocity² D-RGB',
      brand: 'EKWB',
      price: 14990,
      specs: {
        material: 'Nickel-plated copper',
        compatibility: ['LGA1700', 'AM5'],
      },
    },
    {
      id: 'wb-2',
      type: 'waterblock',
      name: 'Corsair XC7 RGB ELITE',
      brand: 'Corsair',
      price: 12990,
      specs: {
        material: 'Copper cold plate',
        compatibility: ['LGA1700', 'AM5', 'AM4'],
      },
    },
    {
      id: 'wb-3',
      type: 'waterblock',
      name: 'Alphacool Eisblock XPX Aurora',
      brand: 'Alphacool',
      price: 9990,
      specs: {
        material: 'Copper',
        compatibility: ['LGA1700', 'AM5', 'AM4'],
      },
    },
  ],
  gpuBlock: [
    {
      id: 'gpub-1',
      type: 'gpuBlock',
      name: 'EK-Quantum Vector² RTX 4090 D-RGB',
      brand: 'EKWB',
      price: 34990,
      specs: {
        compatibility: ['RTX 4090 FE'],
      },
    },
    {
      id: 'gpub-2',
      type: 'gpuBlock',
      name: 'Corsair Hydro X XG7 RGB 4080',
      brand: 'Corsair',
      price: 24990,
      specs: {
        compatibility: ['RTX 4080'],
      },
    },
    {
      id: 'gpub-3',
      type: 'gpuBlock',
      name: 'Alphacool Eisblock Aurora RTX 4070 Ti',
      brand: 'Alphacool',
      price: 19990,
      specs: {
        compatibility: ['RTX 4070 Ti'],
      },
    },
  ],
  pump: [
    {
      id: 'pump-1',
      type: 'pump',
      name: 'EK-Quantum Kinetic FLT 240 D5 PWM',
      brand: 'EKWB',
      price: 29990,
      specs: {
        size: '240mm reservoir combo',
      },
    },
    {
      id: 'pump-2',
      type: 'pump',
      name: 'Corsair Hydro X XD5 RGB ELITE',
      brand: 'Corsair',
      price: 22990,
      specs: {
        size: 'Pump/reservoir combo',
      },
    },
    {
      id: 'pump-3',
      type: 'pump',
      name: 'Alphacool Eisbecher D5 250',
      brand: 'Alphacool',
      price: 17990,
      specs: {
        size: '250mm reservoir',
      },
    },
  ],
  radiator: [
    {
      id: 'rad-360',
      type: 'radiator',
      name: 'EK-Quantum Surface P360M',
      brand: 'EKWB',
      price: 12990,
      specs: {
        size: '360mm',
      },
    },
    {
      id: 'rad-280',
      type: 'radiator',
      name: 'Corsair Hydro X XR5 280',
      brand: 'Corsair',
      price: 9990,
      specs: {
        size: '280mm',
      },
    },
    {
      id: 'rad-240',
      type: 'radiator',
      name: 'Alphacool NexXxoS ST30 240mm',
      brand: 'Alphacool',
      price: 7990,
      specs: {
        size: '240mm',
      },
    },
    {
      id: 'rad-420',
      type: 'radiator',
      name: 'EK-Quantum Surface P420M',
      brand: 'EKWB',
      price: 15990,
      specs: {
        size: '420mm',
      },
    },
  ],
  tubing: [
    {
      id: 'tube-petg',
      type: 'tubing',
      name: 'PETG Hardline 12/16mm (6 шт)',
      brand: 'EKWB',
      price: 3990,
      specs: {
        material: 'PETG',
        size: '12/16mm OD',
      },
    },
    {
      id: 'tube-acrylic',
      type: 'tubing',
      name: 'Акриловые трубки 12/14mm (6 шт)',
      brand: 'Corsair',
      price: 4490,
      specs: {
        material: 'Acrylic',
        size: '12/14mm OD',
      },
    },
    {
      id: 'tube-soft',
      type: 'tubing',
      name: 'ZMT Soft Tubing 16/10mm (3м)',
      brand: 'EKWB',
      price: 2490,
      specs: {
        material: 'Soft',
        size: '16/10mm',
      },
    },
  ],
  fittings: [
    {
      id: 'fit-chrome',
      type: 'fittings',
      name: 'Комплект фитингов Chrome (16 шт)',
      brand: 'EKWB',
      price: 11990,
      specs: {
        color: 'Chrome',
      },
    },
    {
      id: 'fit-black',
      type: 'fittings',
      name: 'Комплект фитингов Black (16 шт)',
      brand: 'Corsair',
      price: 10990,
      specs: {
        color: 'Black',
      },
    },
    {
      id: 'fit-white',
      type: 'fittings',
      name: 'Комплект фитингов White (16 шт)',
      brand: 'Alphacool',
      price: 9990,
      specs: {
        color: 'White',
      },
    },
  ],
  coolant: [
    {
      id: 'cool-clear',
      type: 'coolant',
      name: 'EK-CryoFuel Clear (1л)',
      brand: 'EKWB',
      price: 1990,
      specs: {
        color: 'Clear',
      },
    },
    {
      id: 'cool-purple',
      type: 'coolant',
      name: 'EK-CryoFuel Mystic Fog Purple (1л)',
      brand: 'EKWB',
      price: 2490,
      specs: {
        color: 'Purple',
      },
    },
    {
      id: 'cool-blue',
      type: 'coolant',
      name: 'Corsair Hydro X XL5 Blue (1л)',
      brand: 'Corsair',
      price: 1790,
      specs: {
        color: 'Blue',
      },
    },
    {
      id: 'cool-white',
      type: 'coolant',
      name: 'Mayhems Pastel White (1л)',
      brand: 'Mayhems',
      price: 2990,
      specs: {
        color: 'White',
      },
    },
  ],
};

// ============================================================================
// CUSTOMIZATION OPTIONS
// ============================================================================

export const CUSTOMIZATION_DATA: Record<CustomizationType, CustomizationOption[]> = {
  vinyl: [
    {
      id: 'vinyl-carbon',
      type: 'vinyl',
      name: 'Карбоновая пленка',
      description: 'Текстурная пленка под карбон на боковые панели',
      price: 4990,
      previewImage: '/images/customization/vinyl-carbon.webp',
      options: {
        color: 'Black Carbon',
        placement: 'Side panels',
      },
    },
    {
      id: 'vinyl-matte',
      type: 'vinyl',
      name: 'Матовая пленка',
      description: 'Премиум матовая пленка любого цвета',
      price: 5990,
      previewImage: '/images/customization/vinyl-matte.webp',
      options: {
        color: 'Custom',
        placement: 'Full body',
      },
    },
    {
      id: 'vinyl-chrome',
      type: 'vinyl',
      name: 'Хром пленка',
      description: 'Зеркальная хромированная пленка',
      price: 7990,
      previewImage: '/images/customization/vinyl-chrome.webp',
      options: {
        color: 'Chrome',
        placement: 'Accents',
      },
    },
  ],
  photoPrint: [
    {
      id: 'photo-side',
      type: 'photoPrint',
      name: 'Фотопечать на стекло',
      description: 'Ваше изображение на боковой панели',
      price: 8990,
      previewImage: '/images/customization/photo-side.webp',
      options: {
        placement: 'Side glass',
      },
    },
    {
      id: 'photo-psu',
      type: 'photoPrint',
      name: 'Кастомная крышка БП',
      description: 'Персонализированная крышка блока питания',
      price: 3990,
      previewImage: '/images/customization/photo-psu.webp',
      options: {
        placement: 'PSU shroud',
      },
    },
    {
      id: 'photo-gpu',
      type: 'photoPrint',
      name: 'Бэкплейт видеокарты',
      description: 'Кастомный бэкплейт с вашим дизайном',
      price: 5990,
      previewImage: '/images/customization/photo-gpu.webp',
      options: {
        placement: 'GPU backplate',
      },
    },
  ],
  rgbStrip: [
    {
      id: 'rgb-basic',
      type: 'rgbStrip',
      name: 'RGB подсветка базовая',
      description: '2 RGB ленты с контроллером',
      price: 3990,
      previewImage: '/images/customization/rgb-basic.webp',
    },
    {
      id: 'rgb-pro',
      type: 'rgbStrip',
      name: 'RGB подсветка PRO',
      description: '4 ARGB ленты + интеграция с ПО',
      price: 7990,
      previewImage: '/images/customization/rgb-pro.webp',
    },
    {
      id: 'rgb-infinity',
      type: 'rgbStrip',
      name: 'Infinity Mirror Panel',
      description: 'Зеркальный эффект бесконечности',
      price: 12990,
      previewImage: '/images/customization/rgb-infinity.webp',
    },
  ],
  cableSleeving: [
    {
      id: 'cable-black',
      type: 'cableSleeving',
      name: 'Кабели в оплетке Black',
      description: 'Полный комплект кабелей в черной оплетке',
      price: 5990,
      options: {
        color: 'Black',
      },
    },
    {
      id: 'cable-white',
      type: 'cableSleeving',
      name: 'Кабели в оплетке White',
      description: 'Полный комплект кабелей в белой оплетке',
      price: 5990,
      options: {
        color: 'White',
      },
    },
    {
      id: 'cable-custom',
      type: 'cableSleeving',
      name: 'Кастомные кабели',
      description: 'Выбор цветов под вашу сборку',
      price: 8990,
      options: {
        color: 'Custom',
      },
    },
  ],
};
