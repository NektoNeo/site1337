/**
 * AI Image Generator Service
 *
 * Uses Firebase AI (Gemini/Imagen) to generate preview images for custom PC configurations.
 * Especially useful for water cooling setups with custom colors and components.
 */

import { getFirebaseApp } from './firebase';
import {
  getAI,
  getImagenModel,
  getGenerativeModel,
  GoogleAIBackend,
  ImagenModel,
  GenerativeModel,
} from 'firebase/ai';
import type { ConfiguratorState, WaterCoolingConfig } from '@/components/configurator/types';

// ============================================================================
// TYPES
// ============================================================================

export interface GeneratedImage {
  /** Base64 encoded image data */
  data: string;
  /** MIME type (e.g., 'image/png') */
  mimeType: string;
  /** Generated image URL (data URL) */
  dataUrl: string;
}

export interface ImageGenerationResult {
  success: boolean;
  image?: GeneratedImage;
  error?: string;
  filteredReason?: string;
}

export interface PCImagePromptOptions {
  /** Product line (mesh, aero, compact, custom) */
  productLine?: string;
  /** Case color */
  caseColor?: string;
  /** Has water cooling */
  hasWaterCooling?: boolean;
  /** Water cooling configuration */
  waterCooling?: WaterCoolingConfig;
  /** Coolant color (extracted from config) */
  coolantColor?: string;
  /** Tubing type (hardline or soft) */
  tubingType?: string;
  /** Radiator size */
  radiatorSize?: string;
  /** Vinyl wrap design */
  vinylDesign?: string;
  /** Photo print URL or description */
  photoPrint?: string;
  /** RGB lighting color */
  rgbColor?: string;
  /** Additional customizations */
  customNotes?: string;
}

// ============================================================================
// PROMPT BUILDERS
// ============================================================================

/**
 * Builds a detailed prompt for generating PC images based on configuration
 */
function buildPCImagePrompt(options: PCImagePromptOptions): string {
  const parts: string[] = [
    'High-quality product photography of a custom gaming PC build,',
    'professional studio lighting, dark background with subtle purple/magenta neon accents,',
    '8K resolution, ultra-detailed, photorealistic,',
  ];

  // Case style
  if (options.productLine) {
    const caseStyles: Record<string, string> = {
      mesh: 'mesh front panel case with excellent airflow design',
      aero: 'sleek aerodynamic case with tempered glass side panel',
      compact: 'compact mini-ITX case with efficient layout',
      custom: 'fully custom case with unique modifications',
    };
    parts.push(caseStyles[options.productLine] || 'modern gaming PC case');
  }

  // Case color
  if (options.caseColor) {
    parts.push(`${options.caseColor} colored case`);
  }

  // Water cooling
  if (options.hasWaterCooling) {
    parts.push('custom water cooling loop visible through side panel');

    // Use extracted coolant color or get from waterCooling config
    const coolantColor = options.coolantColor ||
      options.waterCooling?.components?.coolant?.specs?.color;
    if (coolantColor) {
      parts.push(`${coolantColor} colored coolant flowing through transparent tubes`);
    }

    // Use extracted tubing type or get from waterCooling config
    const tubingType = options.tubingType ||
      options.waterCooling?.components?.tubing?.specs?.material;
    if (tubingType === 'hardline' || tubingType === 'PETG' || tubingType === 'Acrylic') {
      parts.push('precise hardline tubing with 90-degree bends');
    } else {
      parts.push('flexible soft tubing routing');
    }

    // Use extracted radiator size or get from waterCooling config
    const radiatorSize = options.radiatorSize ||
      options.waterCooling?.components?.radiators?.[0]?.specs?.size;
    if (radiatorSize) {
      parts.push(`${radiatorSize} radiator with RGB fans`);
    }

    parts.push('CPU waterblock with illuminated logo, reservoir with visible liquid level');
  }

  // Vinyl wrap
  if (options.vinylDesign) {
    parts.push(`custom vinyl wrap with ${options.vinylDesign} design on case panels`);
  }

  // Photo print
  if (options.photoPrint) {
    parts.push(`custom printed graphics featuring ${options.photoPrint} on side panel`);
  }

  // RGB
  if (options.rgbColor) {
    parts.push(`${options.rgbColor} RGB lighting throughout the build, illuminated fans and components`);
  } else {
    parts.push('purple and magenta RGB lighting accents');
  }

  // Additional notes
  if (options.customNotes) {
    parts.push(options.customNotes);
  }

  // Quality modifiers
  parts.push(
    'cinematic composition, depth of field, reflections on glass,',
    'premium product showcase style, VA-PC brand aesthetic'
  );

  return parts.join(' ');
}

/**
 * Builds a prompt for water cooling system visualization
 */
function buildWaterCoolingPrompt(config: WaterCoolingConfig): string {
  const parts: string[] = [
    'Detailed visualization of a custom water cooling loop for PC,',
    'transparent view showing all components,',
    'studio lighting, dark background with purple neon glow,',
  ];

  // Coolant color from component specs
  const coolantColor = config.components?.coolant?.specs?.color;
  if (coolantColor) {
    parts.push(`${coolantColor} colored coolant,`);
  }

  // Tubing type from component specs
  const tubingMaterial = config.components?.tubing?.specs?.material;
  if (tubingMaterial === 'PETG' || tubingMaterial === 'Acrylic') {
    parts.push('precise hardline PETG tubes with chrome fittings,');
  } else {
    parts.push('soft flexible tubing with compression fittings,');
  }

  // Components
  parts.push('CPU waterblock, GPU waterblock, pump/reservoir combo,');

  // Radiator size from component specs
  const radiatorSize = config.components?.radiators?.[0]?.specs?.size;
  if (radiatorSize) {
    parts.push(`${radiatorSize} radiator with high-static pressure fans,`);
  }

  parts.push(
    'professional product photography, ultra-detailed, 8K,',
    'photorealistic render, premium quality visualization'
  );

  return parts.join(' ');
}

// ============================================================================
// IMAGE GENERATION SERVICE
// ============================================================================

class AIImageGenerator {
  private ai: ReturnType<typeof getAI> | null = null;
  private imagenModel: ImagenModel | null = null;
  private geminiModel: GenerativeModel | null = null;
  private initialized = false;

  /**
   * Initialize the AI service
   */
  private async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      const app = getFirebaseApp();
      this.ai = getAI(app, { backend: new GoogleAIBackend() });

      // Initialize Imagen model for high-quality image generation
      this.imagenModel = getImagenModel(this.ai, {
        model: 'imagen-3.0-generate-001',
      });

      // Initialize Gemini model as fallback
      this.geminiModel = getGenerativeModel(this.ai, {
        model: 'gemini-2.0-flash-exp',
      });

      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize AI service:', error);
      throw new Error('AI service initialization failed');
    }
  }

  /**
   * Generate a PC configuration preview image using Imagen
   */
  async generatePCImage(options: PCImagePromptOptions): Promise<ImageGenerationResult> {
    try {
      await this.initialize();

      if (!this.imagenModel) {
        throw new Error('Imagen model not initialized');
      }

      const prompt = buildPCImagePrompt(options);
      console.log('Generating PC image with prompt:', prompt.substring(0, 100) + '...');

      const response = await this.imagenModel.generateImages(prompt);

      // Check for filtered content
      if (response.filteredReason) {
        console.warn('Image generation filtered:', response.filteredReason);
        return {
          success: false,
          filteredReason: response.filteredReason,
        };
      }

      // Check if images were generated
      if (!response.images || response.images.length === 0) {
        return {
          success: false,
          error: 'No images generated',
        };
      }

      const image = response.images[0];
      const imageData = image.bytesBase64Encoded;
      const mimeType = image.mimeType || 'image/png';

      return {
        success: true,
        image: {
          data: imageData,
          mimeType,
          dataUrl: `data:${mimeType};base64,${imageData}`,
        },
      };
    } catch (error) {
      console.error('PC image generation failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Generate a water cooling system visualization
   */
  async generateWaterCoolingImage(config: WaterCoolingConfig): Promise<ImageGenerationResult> {
    try {
      await this.initialize();

      if (!this.imagenModel) {
        throw new Error('Imagen model not initialized');
      }

      const prompt = buildWaterCoolingPrompt(config);
      console.log('Generating water cooling image...');

      const response = await this.imagenModel.generateImages(prompt);

      if (response.filteredReason) {
        return {
          success: false,
          filteredReason: response.filteredReason,
        };
      }

      if (!response.images || response.images.length === 0) {
        return {
          success: false,
          error: 'No images generated',
        };
      }

      const image = response.images[0];
      const imageData = image.bytesBase64Encoded;
      const mimeType = image.mimeType || 'image/png';

      return {
        success: true,
        image: {
          data: imageData,
          mimeType,
          dataUrl: `data:${mimeType};base64,${imageData}`,
        },
      };
    } catch (error) {
      console.error('Water cooling image generation failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Generate a complete configuration preview from state
   */
  async generateConfigurationPreview(state: ConfiguratorState): Promise<ImageGenerationResult> {
    const options: PCImagePromptOptions = {
      productLine: state.selectedLine?.id,
      caseColor: state.components.case?.name,
      hasWaterCooling: state.waterCooling?.enabled,
      waterCooling: state.waterCooling?.enabled ? state.waterCooling : undefined,
      // Extract vinyl design from customizations
      vinylDesign: state.customizations?.vinyl?.options?.design,
      // Extract photo print description
      photoPrint: state.customizations?.photoPrint?.name,
      // Extract RGB color
      rgbColor: state.customizations?.rgbStrip?.options?.color,
    };

    return this.generatePCImage(options);
  }
}

// Export singleton instance
export const aiImageGenerator = new AIImageGenerator();

// Export utility functions
export { buildPCImagePrompt, buildWaterCoolingPrompt };
