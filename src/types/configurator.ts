/**
 * Configurator types (limited-choice mapping to predefined build variants).
 *
 * See: docs/CONFIGURATOR.md
 */

// ============================================================================
// SELECTION (URL / UI)
// ============================================================================

export interface ConfiguratorSelection {
  tier: 'rtx4070' | 'rtx4080' | 'rtx4090';
  caseModel: 'rog-x' | 'neo-white' | 'compact-pro' | 'darkline';
  caseColor: 'black' | 'white' | 'gray';
  sidePanel: 'glass' | 'mesh';
  rgb: 'off' | 'purple' | 'fuchsia' | 'rainbow';
}

export type VkAvailability = 'in_stock' | 'out_of_stock' | 'removed' | 'unknown';

// ============================================================================
// BUILD CATALOG
// ============================================================================

export interface MediaLayer {
  id: string;
  /** Higher zIndex renders on top */
  zIndex: number;
  /** Either image path (public/) or a CSS-only layer. */
  type: 'image' | 'tint' | 'glow';
  /** For image layers */
  src?: string;
  /** For tint/glow layers */
  color?: string;
  /** Applies only when these rules match (optional). */
  appliesTo?: Partial<ConfiguratorSelection>;
}

export interface BuildVariant {
  id: string;
  name: string;
  /** VK Market product id (if known). */
  vkProductId: number;
  tier: ConfiguratorSelection['tier'];
  caseModel: ConfiguratorSelection['caseModel'];
  allowed: {
    caseColor: ConfiguratorSelection['caseColor'][];
    sidePanel: ConfiguratorSelection['sidePanel'][];
    rgb: ConfiguratorSelection['rgb'][];
  };
  defaults: Omit<ConfiguratorSelection, 'tier' | 'caseModel'>;
  preview: {
    baseSrc: string;
    layers?: MediaLayer[];
  };
}

export interface ResolveResult {
  variant: BuildVariant;
  /** Normalized (validated) selection */
  selection: ConfiguratorSelection;
}

// ============================================================================
// API SHAPES
// ============================================================================

export interface ResolveResponseBody {
  resolved: ResolveResult;
  vk: {
    priceRub: number | null;
    availability: VkAvailability;
    vkUrl?: string | null;
  };
}

