import type { ConfiguratorSelection, ResolveResult } from '@/types/configurator';
import { BUILD_VARIANTS, DEFAULT_VARIANT_ID, getVariantById } from './builds';

// ============================================================================
// MAPPING ENGINE
// ============================================================================

const VALID: {
  tier: ConfiguratorSelection['tier'][];
  caseModel: ConfiguratorSelection['caseModel'][];
  caseColor: ConfiguratorSelection['caseColor'][];
  sidePanel: ConfiguratorSelection['sidePanel'][];
  rgb: ConfiguratorSelection['rgb'][];
} = {
  tier: ['rtx4070', 'rtx4080', 'rtx4090'],
  caseModel: ['rog-x', 'neo-white', 'compact-pro', 'darkline'],
  caseColor: ['black', 'white', 'gray'],
  sidePanel: ['glass', 'mesh'],
  rgb: ['off', 'purple', 'fuchsia', 'rainbow'],
};

function isOneOf<T extends string>(value: string, allowed: readonly T[]): value is T {
  return (allowed as readonly string[]).includes(value);
}

function normalizeSelection(selection: ConfiguratorSelection): ConfiguratorSelection {
  // Defensive normalization (in case selection came from URL / external source)
  const tier = isOneOf(selection.tier, VALID.tier) ? selection.tier : 'rtx4080';
  const caseModel = isOneOf(selection.caseModel, VALID.caseModel)
    ? selection.caseModel
    : 'rog-x';
  const caseColor = isOneOf(selection.caseColor, VALID.caseColor)
    ? selection.caseColor
    : caseModel === 'neo-white'
      ? 'white'
      : 'black';
  const sidePanel = isOneOf(selection.sidePanel, VALID.sidePanel)
    ? selection.sidePanel
    : 'glass';
  const rgb = isOneOf(selection.rgb, VALID.rgb) ? selection.rgb : 'purple';

  return { tier, caseModel, caseColor, sidePanel, rgb };
}

function scoreVariant(v: { tier: string; caseModel: string }, s: ConfiguratorSelection) {
  let score = 0;
  if (v.tier === s.tier) score += 100;
  if (v.caseModel === s.caseModel) score += 50;
  return score;
}

function pickBestVariant(selection: ConfiguratorSelection) {
  const exactId = `${selection.caseModel}-${selection.tier}`;
  const exact = getVariantById(exactId);
  if (exact) return exact;

  let best = BUILD_VARIANTS[0];
  let bestScore = -Infinity;
  for (const v of BUILD_VARIANTS) {
    const score = scoreVariant(v, selection);
    if (score > bestScore) {
      best = v;
      bestScore = score;
    }
  }
  return best ?? getVariantById(DEFAULT_VARIANT_ID) ?? BUILD_VARIANTS[0];
}

/**
 * Returns the default selection for a given variant id.
 * Used to initialize the configurator and to recover from invalid URLs.
 */
export function getDefaultSelectionForVariant(variantId: string): ConfiguratorSelection {
  const variant =
    getVariantById(variantId) ??
    getVariantById(DEFAULT_VARIANT_ID) ??
    BUILD_VARIANTS[0];

  return {
    tier: variant.tier,
    caseModel: variant.caseModel,
    ...variant.defaults,
  };
}

/**
 * Resolves a user selection to a predefined build variant and returns
 * a normalized selection (validated against allowed options).
 */
export function resolveSelection(selection: ConfiguratorSelection): ResolveResult {
  const normalized = normalizeSelection(selection);
  const variant = pickBestVariant(normalized);

  // Enforce variant constraints (if the catalog restricts options).
  const finalSelection: ConfiguratorSelection = {
    tier: variant.tier,
    caseModel: variant.caseModel,
    caseColor: variant.allowed.caseColor.includes(normalized.caseColor)
      ? normalized.caseColor
      : variant.defaults.caseColor,
    sidePanel: variant.allowed.sidePanel.includes(normalized.sidePanel)
      ? normalized.sidePanel
      : variant.defaults.sidePanel,
    rgb: variant.allowed.rgb.includes(normalized.rgb) ? normalized.rgb : variant.defaults.rgb,
  };

  return { variant, selection: finalSelection };
}

