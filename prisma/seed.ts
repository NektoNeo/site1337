/**
 * Prisma Seed Script for VA-PC E-commerce Platform
 * 
 * Run with: npx prisma db seed
 * 
 * This script populates the database with sample data for development.
 */

import { PrismaClient, UserRole, OrderStatus, ComponentType, ConfiguratorTier, ConfiguratorCaseModel, ConfiguratorOptionKey } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seed...')

  // ============================================================================
  // SETTINGS
  // ============================================================================
  console.log('Creating settings...')
  
  const settings = [
    {
      key: 'site_name',
      value: { ru: 'VA-PC', en: 'VA-PC' },
      description: 'Site name in different languages',
    },
    {
      key: 'site_description',
      value: { 
        ru: 'Магазин компьютерной техники и сборка ПК', 
        en: 'Computer hardware store and PC building' 
      },
      description: 'Site description for SEO',
    },
    {
      key: 'contact_email',
      value: 'info@va-pc.ru',
      description: 'Contact email address',
    },
    {
      key: 'contact_phone',
      value: '+7 (999) 123-45-67',
      description: 'Contact phone number',
    },
    {
      key: 'vk_group_id',
      value: null,
      description: 'VK Group ID for integration',
    },
    {
      key: 'vk_access_token',
      value: null,
      description: 'VK API access token',
    },
    {
      key: 'currency',
      value: { code: 'RUB', symbol: '\u20BD', name: 'Russian Ruble' },
      description: 'Default currency settings',
    },
    {
      key: 'order_email_notifications',
      value: { enabled: true, recipients: ['admin@va-pc.ru'] },
      description: 'Order notification settings',
    },
  ]

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value, description: setting.description },
      create: setting,
    })
  }

  // ============================================================================
  // ADMIN USER
  // ============================================================================
  console.log('Creating admin user...')
  
  const adminPassword = await hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@va-pc.ru' },
    update: {},
    create: {
      email: 'admin@va-pc.ru',
      password: adminPassword,
      name: 'Administrator',
      phone: '+7 (999) 123-45-67',
      role: UserRole.ADMIN,
    },
  })
  console.log(`Admin user created: ${admin.email}`)

  // ============================================================================
  // CATEGORIES
  // ============================================================================
  console.log('Creating categories...')
  
  const categories = [
    { 
      name: 'Processors', 
      slug: 'processors', 
      description: 'Central Processing Units (CPU) for desktop computers',
      sortOrder: 1,
    },
    { 
      name: 'Graphics Cards', 
      slug: 'graphics-cards', 
      description: 'Video cards and GPU accelerators',
      sortOrder: 2,
    },
    { 
      name: 'Motherboards', 
      slug: 'motherboards', 
      description: 'System boards for Intel and AMD platforms',
      sortOrder: 3,
    },
    { 
      name: 'Memory', 
      slug: 'memory', 
      description: 'DDR4 and DDR5 RAM modules',
      sortOrder: 4,
    },
    { 
      name: 'Storage', 
      slug: 'storage', 
      description: 'SSD and HDD drives',
      sortOrder: 5,
    },
    { 
      name: 'Power Supplies', 
      slug: 'power-supplies', 
      description: 'ATX power supply units',
      sortOrder: 6,
    },
    { 
      name: 'Cases', 
      slug: 'cases', 
      description: 'Computer cases and enclosures',
      sortOrder: 7,
    },
    { 
      name: 'Cooling', 
      slug: 'cooling', 
      description: 'CPU coolers and case fans',
      sortOrder: 8,
    },
  ]

  const categoryMap: Record<string, string> = {}
  for (const category of categories) {
    const created = await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    })
    categoryMap[category.slug] = created.id
  }

  // ============================================================================
  // BRANDS
  // ============================================================================
  console.log('Creating brands...')
  
  const brands = [
    { name: 'AMD', slug: 'amd' },
    { name: 'Intel', slug: 'intel' },
    { name: 'NVIDIA', slug: 'nvidia' },
    { name: 'ASUS', slug: 'asus' },
    { name: 'MSI', slug: 'msi' },
    { name: 'Gigabyte', slug: 'gigabyte' },
    { name: 'Corsair', slug: 'corsair' },
    { name: 'Kingston', slug: 'kingston' },
    { name: 'Samsung', slug: 'samsung' },
    { name: 'Seagate', slug: 'seagate' },
    { name: 'NZXT', slug: 'nzxt' },
    { name: 'be quiet!', slug: 'be-quiet' },
    { name: 'Seasonic', slug: 'seasonic' },
    { name: 'Noctua', slug: 'noctua' },
    { name: 'G.Skill', slug: 'gskill' },
  ]

  const brandMap: Record<string, string> = {}
  for (const brand of brands) {
    const created = await prisma.brand.upsert({
      where: { slug: brand.slug },
      update: brand,
      create: brand,
    })
    brandMap[brand.slug] = created.id
  }

  // ============================================================================
  // PRODUCTS
  // ============================================================================
  console.log('Creating products...')
  
  const products = [
    // CPUs
    {
      sku: 'CPU-AMD-7800X3D',
      name: 'AMD Ryzen 7 7800X3D',
      slug: 'amd-ryzen-7-7800x3d',
      description: 'AMD Ryzen 7 7800X3D with 3D V-Cache technology. 8 cores, 16 threads, up to 5.0 GHz boost. The ultimate gaming processor.',
      price: 42990,
      stock: 15,
      isFeatured: true,
      categorySlug: 'processors',
      brandSlug: 'amd',
      specs: {
        cores: 8,
        threads: 16,
        baseClock: '4.2 GHz',
        boostClock: '5.0 GHz',
        cache: '104 MB',
        tdp: '120W',
        socket: 'AM5',
      },
    },
    {
      sku: 'CPU-INTEL-14900K',
      name: 'Intel Core i9-14900K',
      slug: 'intel-core-i9-14900k',
      description: 'Intel Core i9-14900K 24-core processor. 8 P-cores + 16 E-cores, up to 6.0 GHz. Flagship desktop CPU.',
      price: 59990,
      stock: 8,
      isFeatured: true,
      categorySlug: 'processors',
      brandSlug: 'intel',
      specs: {
        cores: 24,
        threads: 32,
        baseClock: '3.2 GHz',
        boostClock: '6.0 GHz',
        cache: '36 MB',
        tdp: '125W',
        socket: 'LGA1700',
      },
    },
    {
      sku: 'CPU-AMD-5600X',
      name: 'AMD Ryzen 5 5600X',
      slug: 'amd-ryzen-5-5600x',
      description: 'AMD Ryzen 5 5600X. Great value 6-core processor for gaming and productivity.',
      price: 14990,
      salePrice: 12990,
      stock: 25,
      categorySlug: 'processors',
      brandSlug: 'amd',
      specs: {
        cores: 6,
        threads: 12,
        baseClock: '3.7 GHz',
        boostClock: '4.6 GHz',
        cache: '35 MB',
        tdp: '65W',
        socket: 'AM4',
      },
    },
    
    // GPUs
    {
      sku: 'GPU-RTX4090',
      name: 'ASUS ROG Strix GeForce RTX 4090 OC',
      slug: 'asus-rog-strix-rtx-4090-oc',
      description: 'ASUS ROG Strix RTX 4090 with OC mode. 24GB GDDR6X, ray tracing, DLSS 3.0. The ultimate graphics card.',
      price: 189990,
      stock: 3,
      isFeatured: true,
      categorySlug: 'graphics-cards',
      brandSlug: 'asus',
      specs: {
        memory: '24 GB GDDR6X',
        memoryBus: '384-bit',
        coreClock: '2640 MHz',
        cudaCores: 16384,
        tdp: '450W',
        outputs: '3x DisplayPort 1.4a, 2x HDMI 2.1a',
      },
    },
    {
      sku: 'GPU-RTX4070TI',
      name: 'MSI GeForce RTX 4070 Ti SUPER Gaming X Slim',
      slug: 'msi-rtx-4070-ti-super-gaming-x',
      description: 'MSI RTX 4070 Ti SUPER with efficient cooling. 16GB GDDR6X memory.',
      price: 89990,
      stock: 10,
      isFeatured: true,
      categorySlug: 'graphics-cards',
      brandSlug: 'msi',
      specs: {
        memory: '16 GB GDDR6X',
        memoryBus: '256-bit',
        coreClock: '2670 MHz',
        cudaCores: 8448,
        tdp: '285W',
      },
    },
    {
      sku: 'GPU-RX7900XTX',
      name: 'Gigabyte Radeon RX 7900 XTX Gaming OC',
      slug: 'gigabyte-rx-7900-xtx-gaming-oc',
      description: 'AMD Radeon RX 7900 XTX with 24GB memory. Excellent 4K gaming performance.',
      price: 99990,
      stock: 5,
      categorySlug: 'graphics-cards',
      brandSlug: 'gigabyte',
      specs: {
        memory: '24 GB GDDR6',
        memoryBus: '384-bit',
        coreClock: '2525 MHz',
        streamProcessors: 6144,
        tdp: '355W',
      },
    },
    
    // Motherboards
    {
      sku: 'MB-X670E-HERO',
      name: 'ASUS ROG Crosshair X670E Hero',
      slug: 'asus-rog-crosshair-x670e-hero',
      description: 'Premium X670E motherboard for AMD Ryzen 7000 series. DDR5, PCIe 5.0, WiFi 6E.',
      price: 54990,
      stock: 7,
      categorySlug: 'motherboards',
      brandSlug: 'asus',
      specs: {
        socket: 'AM5',
        chipset: 'X670E',
        formFactor: 'ATX',
        memorySlots: 4,
        maxMemory: '128 GB DDR5',
        pciSlots: '2x PCIe 5.0 x16, 1x PCIe 4.0 x16',
      },
    },
    {
      sku: 'MB-Z790-EDGE',
      name: 'MSI MAG Z790 TOMAHAWK WIFI',
      slug: 'msi-mag-z790-tomahawk-wifi',
      description: 'Z790 motherboard for Intel 13th/14th gen. DDR5, PCIe 5.0, 2.5G LAN.',
      price: 32990,
      stock: 12,
      categorySlug: 'motherboards',
      brandSlug: 'msi',
      specs: {
        socket: 'LGA1700',
        chipset: 'Z790',
        formFactor: 'ATX',
        memorySlots: 4,
        maxMemory: '128 GB DDR5',
      },
    },
    
    // RAM
    {
      sku: 'RAM-DDR5-6000-32',
      name: 'G.Skill Trident Z5 RGB DDR5-6000 32GB (2x16GB)',
      slug: 'gskill-trident-z5-rgb-ddr5-6000-32gb',
      description: 'High-performance DDR5 memory with RGB lighting. CL30, optimized for gaming.',
      price: 14990,
      stock: 20,
      categorySlug: 'memory',
      brandSlug: 'gskill',
      specs: {
        type: 'DDR5',
        speed: '6000 MHz',
        capacity: '32 GB (2x16GB)',
        latency: 'CL30-40-40-96',
        voltage: '1.35V',
      },
    },
    {
      sku: 'RAM-DDR5-5600-64',
      name: 'Corsair Dominator Platinum RGB DDR5-5600 64GB (2x32GB)',
      slug: 'corsair-dominator-platinum-ddr5-5600-64gb',
      description: 'Premium 64GB DDR5 kit for workstations and content creation.',
      price: 24990,
      stock: 8,
      categorySlug: 'memory',
      brandSlug: 'corsair',
      specs: {
        type: 'DDR5',
        speed: '5600 MHz',
        capacity: '64 GB (2x32GB)',
        latency: 'CL36-36-36-76',
        voltage: '1.25V',
      },
    },
    
    // Storage
    {
      sku: 'SSD-990PRO-2TB',
      name: 'Samsung 990 PRO 2TB NVMe SSD',
      slug: 'samsung-990-pro-2tb',
      description: 'Samsung 990 PRO PCIe 4.0 NVMe SSD. Up to 7450 MB/s read speed.',
      price: 18990,
      stock: 30,
      isFeatured: true,
      categorySlug: 'storage',
      brandSlug: 'samsung',
      specs: {
        capacity: '2 TB',
        interface: 'PCIe 4.0 x4 NVMe',
        readSpeed: '7450 MB/s',
        writeSpeed: '6900 MB/s',
        formFactor: 'M.2 2280',
      },
    },
    {
      sku: 'HDD-BARRACUDA-4TB',
      name: 'Seagate BarraCuda 4TB HDD',
      slug: 'seagate-barracuda-4tb',
      description: 'Reliable 4TB hard drive for storage. 5400 RPM, 256MB cache.',
      price: 8990,
      stock: 15,
      categorySlug: 'storage',
      brandSlug: 'seagate',
      specs: {
        capacity: '4 TB',
        interface: 'SATA III',
        rpm: '5400',
        cache: '256 MB',
        formFactor: '3.5"',
      },
    },
    
    // PSU
    {
      sku: 'PSU-RM1000X-SHIFT',
      name: 'Corsair RM1000x SHIFT 1000W',
      slug: 'corsair-rm1000x-shift',
      description: 'Fully modular 1000W PSU with side-mounted connectors. 80+ Gold certified.',
      price: 17990,
      stock: 12,
      categorySlug: 'power-supplies',
      brandSlug: 'corsair',
      specs: {
        wattage: '1000W',
        efficiency: '80+ Gold',
        modular: 'Fully Modular',
        fanSize: '135mm',
        connectors: '1x 12VHPWR, 4x PCIe, 12x SATA',
      },
    },
    {
      sku: 'PSU-FOCUS-GX850',
      name: 'Seasonic FOCUS GX-850 850W',
      slug: 'seasonic-focus-gx-850',
      description: 'High-quality 850W PSU. 80+ Gold, fully modular, 10-year warranty.',
      price: 13990,
      stock: 18,
      categorySlug: 'power-supplies',
      brandSlug: 'seasonic',
      specs: {
        wattage: '850W',
        efficiency: '80+ Gold',
        modular: 'Fully Modular',
        fanSize: '120mm',
      },
    },
    
    // Cases
    {
      sku: 'CASE-H7-FLOW',
      name: 'NZXT H7 Flow',
      slug: 'nzxt-h7-flow',
      description: 'High-airflow mid-tower case. Supports up to 360mm radiators.',
      price: 12990,
      stock: 10,
      categorySlug: 'cases',
      brandSlug: 'nzxt',
      specs: {
        formFactor: 'Mid-Tower',
        motherboardSupport: 'ATX, Micro-ATX, Mini-ITX',
        maxGpuLength: '400mm',
        maxCpuCoolerHeight: '185mm',
        drivesBays: '2x 2.5", 2x 3.5"/2.5"',
      },
    },
    
    // Cooling
    {
      sku: 'COOL-NH-D15',
      name: 'Noctua NH-D15',
      slug: 'noctua-nh-d15',
      description: 'Premium dual-tower CPU cooler. Exceptional cooling performance with near-silent operation.',
      price: 10990,
      stock: 15,
      categorySlug: 'cooling',
      brandSlug: 'noctua',
      specs: {
        type: 'Air Cooler',
        height: '165mm',
        fans: '2x 140mm NF-A15',
        tdpSupport: '250W+',
        sockets: 'AMD AM4/AM5, Intel LGA1700/1200',
      },
    },
    {
      sku: 'COOL-KRAKEN-Z73',
      name: 'NZXT Kraken Z73 RGB 360mm',
      slug: 'nzxt-kraken-z73-rgb',
      description: 'Premium 360mm AIO liquid cooler with LCD display. RGB fans included.',
      price: 26990,
      stock: 6,
      categorySlug: 'cooling',
      brandSlug: 'nzxt',
      specs: {
        type: 'AIO Liquid Cooler',
        radiatorSize: '360mm',
        fans: '3x 120mm RGB',
        display: '2.36" LCD',
        sockets: 'AMD AM4/AM5, Intel LGA1700/1200',
      },
    },
  ]

  const productMap: Record<string, string> = {}
  for (const product of products) {
    const { categorySlug, brandSlug, salePrice, ...productData } = product
    const created = await prisma.product.upsert({
      where: { sku: product.sku },
      update: {
        ...productData,
        salePrice: salePrice ?? null,
        categoryId: categoryMap[categorySlug],
        brandId: brandSlug ? brandMap[brandSlug] : null,
      },
      create: {
        ...productData,
        salePrice: salePrice ?? null,
        categoryId: categoryMap[categorySlug],
        brandId: brandSlug ? brandMap[brandSlug] : null,
      },
    })
    productMap[product.sku] = created.id

    // Create primary product image
    await prisma.productImage.upsert({
      where: {
        id: `img-${product.sku}`,
      },
      update: {},
      create: {
        id: `img-${product.sku}`,
        url: `/images/products/${product.slug}.jpg`,
        alt: product.name,
        isPrimary: true,
        sortOrder: 0,
        productId: created.id,
      },
    })
  }

  // ============================================================================
  // PREBUILT CONFIGURATIONS
  // ============================================================================
  console.log('Creating prebuilt configurations...')
  
  const prebuilts = [
    {
      name: 'VA-PC Gaming Pro',
      slug: 'va-pc-gaming-pro',
      description: 'High-performance gaming PC with AMD Ryzen 7 7800X3D and RTX 4070 Ti SUPER. Perfect for 1440p and 4K gaming.',
      price: 249990,
      tier: 'high-end',
      useCase: ['gaming', 'streaming'],
      components: [
        { sku: 'CPU-AMD-7800X3D', type: ComponentType.CPU },
        { sku: 'GPU-RTX4070TI', type: ComponentType.GPU },
        { sku: 'MB-X670E-HERO', type: ComponentType.MOTHERBOARD },
        { sku: 'RAM-DDR5-6000-32', type: ComponentType.RAM },
        { sku: 'SSD-990PRO-2TB', type: ComponentType.STORAGE },
        { sku: 'PSU-RM1000X-SHIFT', type: ComponentType.PSU },
        { sku: 'CASE-H7-FLOW', type: ComponentType.CASE },
        { sku: 'COOL-KRAKEN-Z73', type: ComponentType.COOLING },
      ],
    },
    {
      name: 'VA-PC Workstation Ultra',
      slug: 'va-pc-workstation-ultra',
      description: 'Professional workstation with Intel i9-14900K and RTX 4090. Built for content creation and heavy workloads.',
      price: 449990,
      tier: 'enthusiast',
      useCase: ['workstation', 'content-creation', 'streaming'],
      components: [
        { sku: 'CPU-INTEL-14900K', type: ComponentType.CPU },
        { sku: 'GPU-RTX4090', type: ComponentType.GPU },
        { sku: 'MB-Z790-EDGE', type: ComponentType.MOTHERBOARD },
        { sku: 'RAM-DDR5-5600-64', type: ComponentType.RAM },
        { sku: 'SSD-990PRO-2TB', type: ComponentType.STORAGE },
        { sku: 'PSU-RM1000X-SHIFT', type: ComponentType.PSU },
        { sku: 'CASE-H7-FLOW', type: ComponentType.CASE },
        { sku: 'COOL-KRAKEN-Z73', type: ComponentType.COOLING },
      ],
    },
    {
      name: 'VA-PC Budget Gamer',
      slug: 'va-pc-budget-gamer',
      description: 'Affordable gaming PC with AMD Ryzen 5 5600X. Great for 1080p gaming on a budget.',
      price: 89990,
      salePrice: 79990,
      tier: 'budget',
      useCase: ['gaming'],
      components: [
        { sku: 'CPU-AMD-5600X', type: ComponentType.CPU },
        { sku: 'SSD-990PRO-2TB', type: ComponentType.STORAGE },
        { sku: 'PSU-FOCUS-GX850', type: ComponentType.PSU },
        { sku: 'CASE-H7-FLOW', type: ComponentType.CASE },
        { sku: 'COOL-NH-D15', type: ComponentType.COOLING },
      ],
    },
  ]

  for (const prebuilt of prebuilts) {
    const { components, salePrice, ...prebuiltData } = prebuilt
    const created = await prisma.prebuiltConfig.upsert({
      where: { slug: prebuilt.slug },
      update: {
        ...prebuiltData,
        salePrice: salePrice ?? null,
      },
      create: {
        ...prebuiltData,
        salePrice: salePrice ?? null,
      },
    })

    // Add components
    for (const component of components) {
      if (productMap[component.sku]) {
        await prisma.prebuiltConfigItem.upsert({
          where: {
            prebuiltId_componentType: {
              prebuiltId: created.id,
              componentType: component.type,
            },
          },
          update: {
            productId: productMap[component.sku],
          },
          create: {
            prebuiltId: created.id,
            productId: productMap[component.sku],
            componentType: component.type,
            quantity: 1,
          },
        })
      }
    }
  }

  // ============================================================================
  // SAMPLE ORDER (for testing)
  // ============================================================================
  console.log('Creating sample order...')
  
  const sampleOrder = await prisma.order.upsert({
    where: { orderNumber: 'VAPC-20241215-0001' },
    update: {},
    create: {
      orderNumber: 'VAPC-20241215-0001',
      status: OrderStatus.COMPLETED,
      customerName: 'Ivan Petrov',
      customerEmail: 'ivan@example.com',
      customerPhone: '+7 (912) 345-67-89',
      subtotal: 42990,
      discount: 0,
      total: 42990,
      notes: 'Please call before delivery',
      userId: admin.id,
    },
  })

  // Add order item
  await prisma.orderItem.upsert({
    where: { id: 'sample-order-item-1' },
    update: {},
    create: {
      id: 'sample-order-item-1',
      orderId: sampleOrder.id,
      productId: productMap['CPU-AMD-7800X3D'],
      quantity: 1,
      unitPrice: 42990,
      totalPrice: 42990,
      productName: 'AMD Ryzen 7 7800X3D',
      productSku: 'CPU-AMD-7800X3D',
    },
  })

  // Add status history
  await prisma.orderStatusHistory.createMany({
    data: [
      {
        orderId: sampleOrder.id,
        status: OrderStatus.PENDING,
        note: 'Order placed',
        changedBy: 'system',
      },
      {
        orderId: sampleOrder.id,
        status: OrderStatus.CONTACTED,
        note: 'Customer contacted via phone',
        changedBy: admin.id,
      },
      {
        orderId: sampleOrder.id,
        status: OrderStatus.CONFIRMED,
        note: 'Payment confirmed',
        changedBy: admin.id,
      },
      {
        orderId: sampleOrder.id,
        status: OrderStatus.COMPLETED,
        note: 'Order delivered and confirmed by customer',
        changedBy: admin.id,
      },
    ],
    skipDuplicates: true,
  })

  // ============================================================================
  // CONFIGURATOR BUILDS (LIMITED-CHOICE, MAPPED-TO-BUILDS)
  // ============================================================================
  console.log('Creating configurator build families/variants...')

  const toTierEnum = (tier: 'rtx4070' | 'rtx4080' | 'rtx4090') => {
    switch (tier) {
      case 'rtx4070': return ConfiguratorTier.RTX4070
      case 'rtx4080': return ConfiguratorTier.RTX4080
      case 'rtx4090': return ConfiguratorTier.RTX4090
    }
  }

  const toCaseModelEnum = (caseModel: 'rog-x' | 'neo-white' | 'compact-pro' | 'darkline') => {
    switch (caseModel) {
      case 'rog-x': return ConfiguratorCaseModel.ROG_X
      case 'neo-white': return ConfiguratorCaseModel.NEO_WHITE
      case 'compact-pro': return ConfiguratorCaseModel.COMPACT_PRO
      case 'darkline': return ConfiguratorCaseModel.DARKLINE
    }
  }

  const configuratorFamilies = [
    {
      slug: 'rog-x',
      name: 'ROG-X',
      description: 'Флагманский корпус с акцентом на RGB и airflow',
      variants: [
        { slug: 'rog-x-rtx4070', name: 'ROG-X RTX 4070', tier: 'rtx4070', caseModel: 'rog-x' },
        { slug: 'rog-x-rtx4080', name: 'ROG-X RTX 4080', tier: 'rtx4080', caseModel: 'rog-x' },
        { slug: 'rog-x-rtx4090', name: 'ROG-X RTX 4090', tier: 'rtx4090', caseModel: 'rog-x' },
      ],
    },
    {
      slug: 'neo-white',
      name: 'NEO WHITE',
      description: 'Белая сборка в стиле clean build',
      variants: [
        { slug: 'neo-white-rtx4070', name: 'NEO WHITE RTX 4070', tier: 'rtx4070', caseModel: 'neo-white' },
        { slug: 'neo-white-rtx4080', name: 'NEO WHITE RTX 4080', tier: 'rtx4080', caseModel: 'neo-white' },
        { slug: 'neo-white-rtx4090', name: 'NEO WHITE RTX 4090', tier: 'rtx4090', caseModel: 'neo-white' },
      ],
    },
    {
      slug: 'compact-pro',
      name: 'COMPACT PRO',
      description: 'Компактная сборка без компромиссов',
      variants: [
        { slug: 'compact-pro-rtx4070', name: 'COMPACT PRO RTX 4070', tier: 'rtx4070', caseModel: 'compact-pro' },
        { slug: 'compact-pro-rtx4080', name: 'COMPACT PRO RTX 4080', tier: 'rtx4080', caseModel: 'compact-pro' },
        { slug: 'compact-pro-rtx4090', name: 'COMPACT PRO RTX 4090', tier: 'rtx4090', caseModel: 'compact-pro' },
      ],
    },
    {
      slug: 'darkline',
      name: 'DARKLINE',
      description: 'Строгий дизайн, минимум подсветки',
      variants: [
        { slug: 'darkline-rtx4070', name: 'DARKLINE RTX 4070', tier: 'rtx4070', caseModel: 'darkline' },
        { slug: 'darkline-rtx4080', name: 'DARKLINE RTX 4080', tier: 'rtx4080', caseModel: 'darkline' },
        { slug: 'darkline-rtx4090', name: 'DARKLINE RTX 4090', tier: 'rtx4090', caseModel: 'darkline' },
      ],
    },
  ] as const

  const variantIdBySlug: Record<string, string> = {}

  for (const family of configuratorFamilies) {
    const createdFamily = await prisma.configuratorBuildFamily.upsert({
      where: { slug: family.slug },
      update: { name: family.name, description: family.description, isActive: true },
      create: { slug: family.slug, name: family.name, description: family.description, isActive: true },
      select: { id: true },
    })

    for (const v of family.variants) {
      const defaultSelection = {
        tier: v.tier,
        caseModel: v.caseModel,
        caseColor: v.caseModel === 'neo-white' ? 'white' : v.caseModel === 'rog-x' ? 'gray' : 'black',
        sidePanel: v.caseModel === 'darkline' ? 'mesh' : 'glass',
        rgb: v.tier === 'rtx4090' ? 'rainbow' : 'purple',
      }

      const allowedOptions = {
        tier: ['rtx4070', 'rtx4080', 'rtx4090'],
        caseModel: [v.caseModel],
        caseColor: v.caseModel === 'neo-white' ? ['white'] : v.caseModel === 'darkline' ? ['black'] : ['black', 'white', 'gray'],
        sidePanel: v.caseModel === 'darkline' ? ['mesh'] : ['glass', 'mesh'],
        rgb: v.caseModel === 'darkline' ? ['off', 'purple'] : ['off', 'purple', 'fuchsia', 'rainbow'],
      }

      const maskSrc = `/images/cases/masks/${v.caseModel}.svg`
      const preview = {
        baseSrc: `/works/${v.caseModel}/cover.png`,
        layers: [
          { id: 'caseTint', type: 'tint', src: '', zIndex: 10, blendMode: 'color', opacity: 0.35, maskSrc, appliesTo: { caseColor: ['black', 'gray'] } },
          { id: 'glassHighlight', type: 'glass', src: '', zIndex: 20, blendMode: 'screen', opacity: 0.25, maskSrc, appliesTo: { sidePanel: ['glass'] } },
          { id: 'rgbGlow', type: 'rgb', src: '', zIndex: 30, blendMode: 'screen', opacity: 0.35, maskSrc, appliesTo: { rgb: ['purple', 'fuchsia', 'rainbow'] } },
        ],
      }

      const createdVariant = await prisma.configuratorBuildVariant.upsert({
        where: { slug: v.slug },
        update: {
          name: v.name,
          tier: toTierEnum(v.tier),
          caseModel: toCaseModelEnum(v.caseModel),
          vkProductId: null,
          isActive: true,
          defaultSelection,
          allowedOptions,
          preview,
          familyId: createdFamily.id,
        },
        create: {
          slug: v.slug,
          name: v.name,
          tier: toTierEnum(v.tier),
          caseModel: toCaseModelEnum(v.caseModel),
          vkProductId: null,
          isActive: true,
          defaultSelection,
          allowedOptions,
          preview,
          familyId: createdFamily.id,
        },
        select: { id: true },
      })

      variantIdBySlug[v.slug] = createdVariant.id
    }
  }

  // Seed options + join table (skeleton for future admin UI)
  const optionIds: Record<string, string> = {}

  const addOption = async (key: ConfiguratorOptionKey, value: string, label: string, sortOrder = 0) => {
    const k = `${key}:${value}`
    if (optionIds[k]) return optionIds[k]
    const created = await prisma.configuratorOption.upsert({
      where: { key_value: { key, value } },
      update: { label, sortOrder, isActive: true },
      create: { key, value, label, sortOrder, isActive: true },
      select: { id: true },
    })
    optionIds[k] = created.id
    return created.id
  }

  await addOption(ConfiguratorOptionKey.TIER, 'rtx4070', 'RTX 4070', 1)
  await addOption(ConfiguratorOptionKey.TIER, 'rtx4080', 'RTX 4080', 2)
  await addOption(ConfiguratorOptionKey.TIER, 'rtx4090', 'RTX 4090', 3)

  await addOption(ConfiguratorOptionKey.CASE_MODEL, 'rog-x', 'ROG-X', 1)
  await addOption(ConfiguratorOptionKey.CASE_MODEL, 'neo-white', 'NEO WHITE', 2)
  await addOption(ConfiguratorOptionKey.CASE_MODEL, 'compact-pro', 'COMPACT PRO', 3)
  await addOption(ConfiguratorOptionKey.CASE_MODEL, 'darkline', 'DARKLINE', 4)

  await addOption(ConfiguratorOptionKey.CASE_COLOR, 'black', 'Black', 1)
  await addOption(ConfiguratorOptionKey.CASE_COLOR, 'gray', 'Gray', 2)
  await addOption(ConfiguratorOptionKey.CASE_COLOR, 'white', 'White', 3)

  await addOption(ConfiguratorOptionKey.SIDE_PANEL, 'glass', 'Стекло', 1)
  await addOption(ConfiguratorOptionKey.SIDE_PANEL, 'mesh', 'Mesh', 2)

  await addOption(ConfiguratorOptionKey.RGB, 'off', 'Off', 1)
  await addOption(ConfiguratorOptionKey.RGB, 'purple', 'Purple', 2)
  await addOption(ConfiguratorOptionKey.RGB, 'fuchsia', 'Fuchsia', 3)
  await addOption(ConfiguratorOptionKey.RGB, 'rainbow', 'Rainbow', 4)

  for (const [variantSlug, variantId] of Object.entries(variantIdBySlug)) {
    const variant = await prisma.configuratorBuildVariant.findUnique({
      where: { id: variantId },
      select: { allowedOptions: true, defaultSelection: true },
    })
    if (!variant) continue

    const allowed = variant.allowedOptions as any
    const def = variant.defaultSelection as any

    const connect: Array<{ key: ConfiguratorOptionKey; values: string[] }> = [
      { key: ConfiguratorOptionKey.TIER, values: [def.tier] },
      { key: ConfiguratorOptionKey.CASE_MODEL, values: [def.caseModel] },
      { key: ConfiguratorOptionKey.CASE_COLOR, values: allowed.caseColor || [] },
      { key: ConfiguratorOptionKey.SIDE_PANEL, values: allowed.sidePanel || [] },
      { key: ConfiguratorOptionKey.RGB, values: allowed.rgb || [] },
    ]

    for (const group of connect) {
      for (const value of group.values) {
        const optionId = optionIds[`${group.key}:${value}`]
        if (!optionId) continue
        await prisma.configuratorVariantOption.upsert({
          where: { variantId_optionId: { variantId, optionId } },
          update: {},
          create: { variantId, optionId },
        })
      }
    }
  }

  console.log('Database seed completed successfully!')
  console.log(`
Summary:
- Settings: ${settings.length}
- Admin user: 1
- Categories: ${categories.length}
- Brands: ${brands.length}
- Products: ${products.length}
- Prebuilt configs: ${prebuilts.length}
- Configurator families: ${configuratorFamilies.length}
- Configurator variants: ${Object.keys(variantIdBySlug).length}
- Sample orders: 1
  `)
}

main()
  .catch((e) => {
    console.error('Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
