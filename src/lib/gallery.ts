/**
 * Works Gallery Aggregator
 * Fetches work items from various sources:
 * - Local public folder (user's real photos)
 * - VK Album (optional)
 */

export interface WorkItem {
  id: string;
  title: string;
  description?: string;
  image: string;
  thumbnail?: string;
  tags: string[];
  date?: string;
  segment?: string;
  cpu?: string;
  gpu?: string;
  price?: string;
  specs?: {
    cpu?: string;
    gpu?: string;
    ram?: string;
    ssd?: string;
  };
}

// Local works data - using working images from /public/ root
// Note: Images in /public/images/ are corrupted, only root /public/ images work
const LOCAL_WORKS: WorkItem[] = [
  {
    id: 'va-phoenix-rgb',
    title: 'VA PHOENIX RGB Build',
    description: 'Мощная сборка с кастомной RGB подсветкой',
    image: '/IMG_7794.JPG',
    tags: ['RTX 4080', 'Игровой', 'RGB'],
    date: '2025-01-15',
    segment: 'Игровой',
    cpu: 'i7-14700K',
    gpu: 'RTX 4080',
    price: 'от 285 000 ₽',
    specs: { cpu: 'i7-14700K', gpu: 'RTX 4080', ram: '32GB DDR5', ssd: '2TB NVMe' },
  },
  {
    id: 'va-white-edition',
    title: 'VA WHITE Edition',
    description: 'Элегантная белая сборка',
    image: '/IMG_7781.JPG',
    tags: ['RTX 4070 Ti', 'White', 'Premium'],
    date: '2025-01-10',
    segment: 'Премиум',
    cpu: 'i5-14600K',
    gpu: 'RTX 4070 Ti',
    price: 'от 215 000 ₽',
    specs: { cpu: 'i5-14600K', gpu: 'RTX 4070 Ti', ram: '32GB DDR5', ssd: '1TB NVMe' },
  },
  {
    id: 'va-titan-workstation',
    title: 'VA TITAN Workstation',
    description: 'Рабочая станция для 3D и рендеринга',
    image: '/IMG_4649.JPG',
    tags: ['RTX 4090', 'Workstation', 'Creator'],
    date: '2025-01-05',
    segment: 'Рабочая станция',
    cpu: 'i9-14900K',
    gpu: 'RTX 4090',
    price: 'от 450 000 ₽',
    specs: { cpu: 'i9-14900K', gpu: 'RTX 4090', ram: '64GB DDR5', ssd: '4TB NVMe' },
  },
  {
    id: 'va-gaming-pro',
    title: 'VA GAMING Pro',
    description: 'Профессиональная игровая станция',
    image: '/IMG_4605.JPG',
    tags: ['RTX 4080', 'Gaming', 'Pro'],
    date: '2025-01-01',
    segment: 'Игровой',
    cpu: 'i7-14700KF',
    gpu: 'RTX 4080',
    price: 'от 275 000 ₽',
    specs: { cpu: 'i7-14700KF', gpu: 'RTX 4080', ram: '32GB DDR5', ssd: '2TB NVMe' },
  },
  {
    id: 'va-stream-master',
    title: 'VA STREAM Master',
    description: 'Сборка для стриминга и контент-мейкинга',
    image: '/IMG_3026.JPG',
    tags: ['RTX 4070 Ti', 'Streaming', 'Content'],
    date: '2024-12-25',
    segment: 'Стриминг',
    cpu: 'i5-14600K',
    gpu: 'RTX 4070 Ti',
    price: 'от 195 000 ₽',
    specs: { cpu: 'i5-14600K', gpu: 'RTX 4070 Ti', ram: '32GB DDR5', ssd: '1TB NVMe' },
  },
  {
    id: 'va-ultra-rgb',
    title: 'VA ULTRA RGB',
    description: 'Максимальная RGB подсветка',
    image: '/IMG_7794.JPG',
    tags: ['RTX 4090', 'RGB', 'Ultra'],
    date: '2024-12-20',
    segment: 'Премиум',
    cpu: 'i9-14900K',
    gpu: 'RTX 4090',
    price: 'от 385 000 ₽',
    specs: { cpu: 'i9-14900K', gpu: 'RTX 4090', ram: '64GB DDR5', ssd: '2TB NVMe' },
  },
  {
    id: 'va-compact-beast',
    title: 'VA COMPACT Beast',
    description: 'Компактный зверь без компромиссов',
    image: '/IMG_7781.JPG',
    tags: ['RTX 4070', 'Compact', 'Performance'],
    date: '2024-12-15',
    segment: 'Компактный',
    cpu: 'i7-14700K',
    gpu: 'RTX 4070',
    price: 'от 175 000 ₽',
    specs: { cpu: 'i7-14700K', gpu: 'RTX 4070', ram: '32GB DDR5', ssd: '1TB NVMe' },
  },
  {
    id: 'va-silent-power',
    title: 'VA SILENT Power',
    description: 'Тихая и мощная сборка',
    image: '/IMG_4649.JPG',
    tags: ['RTX 4080', 'Silent', 'Power'],
    date: '2024-12-10',
    segment: 'Премиум',
    cpu: 'i9-14900K',
    gpu: 'RTX 4080',
    price: 'от 325 000 ₽',
    specs: { cpu: 'i9-14900K', gpu: 'RTX 4080', ram: '64GB DDR5', ssd: '2TB NVMe' },
  },
];

/**
 * Get works gallery items
 */
export async function getWorksGallery(): Promise<WorkItem[]> {
  // Return local data with real user photos
  // TODO: Add VK Album integration when VK_TOKEN is available
  return LOCAL_WORKS;
}

/**
 * Get a single work item by ID
 */
export async function getWorkById(id: string): Promise<WorkItem | null> {
  const works = await getWorksGallery();
  return works.find(w => w.id === id) || null;
}

/**
 * Get unique tags from all works
 */
export async function getWorkTags(): Promise<string[]> {
  const works = await getWorksGallery();
  const allTags = works.flatMap(w => w.tags);
  return [...new Set(allTags)];
}
