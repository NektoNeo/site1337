import type { BuildVariant, ConfiguratorSelection } from '@/types/configurator';

// ============================================================================
// BUILD CATALOG (canonical list of variants)
// ============================================================================

export const DEFAULT_VARIANT_ID = 'rog-x-rtx4080';

const CASE_MODEL_LABELS: Record<ConfiguratorSelection['caseModel'], string> = {
  'rog-x': 'ROG‑X',
  'neo-white': 'NEO White',
  'compact-pro': 'Compact Pro',
  darkline: 'Darkline',
};

const TIER_LABELS: Record<ConfiguratorSelection['tier'], string> = {
  rtx4070: 'RTX 4070',
  rtx4080: 'RTX 4080',
  rtx4090: 'RTX 4090',
};

const CASE_MODEL_BASE_IMAGE: Record<ConfiguratorSelection['caseModel'], string> = {
  'rog-x': '/images/products/vanguard.png',
  'neo-white': '/images/products/neo.png',
  'compact-pro': '/images/products/alpha.png',
  darkline: '/images/products/eclipse.png',
};

function defaultsForCaseModel(
  caseModel: ConfiguratorSelection['caseModel']
): Omit<ConfiguratorSelection, 'tier' | 'caseModel'> {
  return {
    caseColor: caseModel === 'neo-white' ? 'white' : 'black',
    sidePanel: 'glass',
    rgb: 'purple',
  };
}

function makeVariant(
  caseModel: ConfiguratorSelection['caseModel'],
  tier: ConfiguratorSelection['tier'],
  idx: number
): BuildVariant {
  const id = `${caseModel}-${tier}`;
  return {
    id,
    name: `VA‑PC ${CASE_MODEL_LABELS[caseModel]} · ${TIER_LABELS[tier]}`,
    // Placeholder VK ids (unique + stable). Replace with real VK Market ids when available.
    vkProductId: 150000 + idx,
    tier,
    caseModel,
    allowed: {
      caseColor: ['black', 'white', 'gray'],
      sidePanel: ['glass', 'mesh'],
      rgb: ['off', 'purple', 'fuchsia', 'rainbow'],
    },
    defaults: defaultsForCaseModel(caseModel),
    preview: {
      baseSrc: CASE_MODEL_BASE_IMAGE[caseModel],
      layers: [
        {
          id: 'rgb-glow',
          type: 'glow',
          zIndex: 30,
          appliesTo: { rgb: 'purple' },
          color: 'rgba(168, 85, 247, 0.35)',
        },
        {
          id: 'rgb-glow-fuchsia',
          type: 'glow',
          zIndex: 30,
          appliesTo: { rgb: 'fuchsia' },
          color: 'rgba(217, 70, 239, 0.35)',
        },
        {
          id: 'rgb-glow-rainbow',
          type: 'glow',
          zIndex: 30,
          appliesTo: { rgb: 'rainbow' },
          color: 'rgba(255, 255, 255, 0.20)',
        },
      ],
    },
  };
}

const CASE_MODELS: ConfiguratorSelection['caseModel'][] = [
  'rog-x',
  'neo-white',
  'compact-pro',
  'darkline',
];

const TIERS: ConfiguratorSelection['tier'][] = ['rtx4070', 'rtx4080', 'rtx4090'];

export const BUILD_VARIANTS: BuildVariant[] = CASE_MODELS.flatMap((cm, cmIdx) =>
  TIERS.map((tier, tierIdx) => makeVariant(cm, tier, cmIdx * TIERS.length + tierIdx))
);

export function getVariantById(id: string): BuildVariant | undefined {
  return BUILD_VARIANTS.find((v) => v.id === id);
}

