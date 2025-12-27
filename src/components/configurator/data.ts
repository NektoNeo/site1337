// Mock data for VA-PC Configurator
import { PCComponent, ComponentCategory } from './types';

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
