# PC Configurator Documentation

## Overview

The PC Configurator is a limited-choice configuration system that allows users to customize their PC build while ensuring all selections map to predefined VA-PC build variants. The configurator focuses on aesthetic customization (color, case type, RGB profiles) while maintaining compatibility with existing product catalog.

## Architecture

### Core Concepts

1. **Hybrid Catalog**: Internal canonical list of PC builds with `vkProductId` for each variant, periodically synchronizing prices and availability from VK Market API.

2. **Mapping Engine**: Core logic that resolves user selections to a specific `BuildVariant` from the canonical list. Any user selection will always map to one of the predefined builds.

3. **Layered Rendering**: Visual preview of the PC build by composing base case images with color overlays and other optional layers.

4. **Deep Linking**: Ability to share and restore a specific configuration via URL query parameters.

### Data Flow

```
User Selection → Mapping Engine → Resolved Build Variant → VK API (price/availability) → UI Display
```

## Key Components

### 1. Types (`src/types/configurator.ts`)

Core type definitions:
- `ConfiguratorSelection`: User's selection (tier, caseModel, caseColor, sidePanel, rgb)
- `BuildVariant`: Predefined build variant with allowed options
- `ResolveResult`: Result of mapping selection to variant
- `MediaLayer`: Layer definition for preview rendering

### 2. Build Catalog (`src/lib/configurator/builds.ts`)

Canonical list of `BuildFamily` and `BuildVariant` objects:
- Each variant has a `vkProductId` for VK Market integration
- Defines allowed options and default selections
- Includes preview layer definitions

### 3. Mapping Engine (`src/lib/configurator/engine.ts`)

Core resolution logic:
- `resolveSelection(selection)`: Maps user selection to closest matching variant
- `getDefaultSelectionForVariant(variantId)`: Returns default selection for a variant
- Scoring algorithm prioritizes tier match, then case model, then cosmetic preferences

### 4. Preview Canvas (`src/components/configurator/PreviewCanvas.tsx`)

Visual preview component:
- Renders base case image
- Applies color overlays based on selection
- Filters and sorts layers by `appliesTo` rules and `zIndex`
- Supports CSS-only layers (tint, glass, RGB) and image-based layers

### 5. Configurator Page (`src/app/configurator/page.tsx`)

Main page component:
- Manages user selection state
- Handles deep linking via URL query parameters
- Fetches prices/availability from `/api/configurator/resolve`
- Provides copy link functionality for sharing

## API Endpoints

### POST `/api/configurator/resolve`

Resolves a user selection to a build variant and fetches VK Market data.

**Request Body:**
```typescript
{
  selection: ConfiguratorSelection
}
```

**Response:**
```typescript
{
  resolved: ResolveResult,
  vk: {
    priceRub: number | null,
    availability: 'in_stock' | 'out_of_stock' | 'removed' | 'unknown',
    vkUrl: string | null
  }
}
```

### GET `/api/configurator/sync-vk`

Manual trigger for VK Market synchronization (skeleton implementation).

## Deep Linking

### URL Format

```
/configurator?tier=rtx4080&caseModel=rog-x&caseColor=black&sidePanel=glass&rgb=purple
```

### URL Parameters

- `tier`: `rtx4070` | `rtx4080` | `rtx4090`
- `caseModel`: `rog-x` | `neo-white` | `compact-pro` | `darkline`
- `caseColor`: `black` | `white` | `gray`
- `sidePanel`: `glass` | `mesh`
- `rgb`: `off` | `purple` | `fuchsia` | `rainbow`

### Validation

URL parameters are validated against allowed option sets. Invalid parameters are ignored, and the configurator falls back to defaults.

### Sharing

Users can copy the current configuration URL using the "Copy Link" button. The URL is automatically kept in sync with the current selection.

## Cart Integration

Configured PCs can be added to the cart with metadata:
- `isConfigured: true`
- `configSnapshot`: Full selection snapshot
- `resolvedBuildId`: ID of the resolved variant

Cart items display configuration details (case model, color, RGB profile) in the cart and checkout pages.

## Testing

Unit tests are located in:
- `src/lib/configurator/__tests__/engine.test.ts`: Tests for mapping engine
- `src/components/configurator/__tests__/PreviewCanvas.test.tsx`: Tests for preview rendering

Run tests with:
```bash
npm test
```

## Database Schema

Prisma models for configurator data:
- `BuildFamily`: Product family grouping
- `BuildVariant`: Specific build variant
- `BuildOption`: Available options for variants
- `MediaLayer`: Preview layer definitions
- `VkMapping`: VK Market product mappings
- `SyncLog`: VK synchronization tracking

See `prisma/schema.prisma` for full schema definitions.

## Future Enhancements

1. **Full VK Sync**: Complete implementation of VK Market synchronization service
2. **AI Rendering**: Integration with AI image generation for custom previews
3. **More Options**: Expand customization options (storage, RAM, etc.)
4. **Comparison Mode**: Side-by-side comparison of multiple configurations
5. **Save Configurations**: User accounts with saved configurations

## Performance Considerations

- Preview images are optimized using Next.js `Image` component
- UI monitoring tracks image load performance and layout shifts
- API responses are cached to reduce VK API calls
- Deep linking uses `replaceState` to avoid history pollution

## Troubleshooting

### Images Not Loading

Check:
1. Image paths in `builds.ts` match actual files in `public/images/`
2. `OptimizedImage` fallback is working
3. Network requests in browser DevTools

### Configuration Not Resolving

Check:
1. Selection values match allowed options in variant definition
2. Mapping engine scoring logic
3. API endpoint logs for errors

### Deep Link Not Working

Check:
1. URL parameter validation
2. Browser console for parsing errors
3. `parseSelectionFromSearch` function logic
