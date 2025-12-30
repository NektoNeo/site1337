/**
 * useAIImage Hook
 *
 * React hook for generating AI-powered preview images for PC configurations.
 * Handles loading states, caching, and error handling.
 */

import { useState, useCallback, useRef } from 'react';
import {
  aiImageGenerator,
  GeneratedImage,
  ImageGenerationResult,
  PCImagePromptOptions,
} from '@/lib/ai-image-generator';
import type { ConfiguratorState, WaterCoolingConfig } from '@/components/configurator/types';

// ============================================================================
// TYPES
// ============================================================================

export interface UseAIImageState {
  /** Generated image data */
  image: GeneratedImage | null;
  /** Loading state */
  isLoading: boolean;
  /** Error message if generation failed */
  error: string | null;
  /** Reason if content was filtered */
  filteredReason: string | null;
  /** Progress percentage (0-100) */
  progress: number;
}

export interface UseAIImageActions {
  /** Generate a PC configuration image */
  generatePCImage: (options: PCImagePromptOptions) => Promise<ImageGenerationResult>;
  /** Generate water cooling visualization */
  generateWaterCoolingImage: (config: WaterCoolingConfig) => Promise<ImageGenerationResult>;
  /** Generate image from full configurator state */
  generateFromState: (state: ConfiguratorState) => Promise<ImageGenerationResult>;
  /** Clear current image and errors */
  reset: () => void;
}

export type UseAIImageReturn = UseAIImageState & UseAIImageActions;

// ============================================================================
// SIMPLE CACHE
// ============================================================================

const imageCache = new Map<string, GeneratedImage>();
const MAX_CACHE_SIZE = 10;

function getCacheKey(options: PCImagePromptOptions | WaterCoolingConfig): string {
  return JSON.stringify(options);
}

function addToCache(key: string, image: GeneratedImage): void {
  // Evict oldest entries if cache is full
  if (imageCache.size >= MAX_CACHE_SIZE) {
    const firstKey = imageCache.keys().next().value;
    if (firstKey) {
      imageCache.delete(firstKey);
    }
  }
  imageCache.set(key, image);
}

function getFromCache(key: string): GeneratedImage | undefined {
  return imageCache.get(key);
}

// ============================================================================
// HOOK
// ============================================================================

export function useAIImage(): UseAIImageReturn {
  const [image, setImage] = useState<GeneratedImage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filteredReason, setFilteredReason] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  // Abort controller for cancellation
  const abortRef = useRef<boolean>(false);

  const reset = useCallback(() => {
    setImage(null);
    setError(null);
    setFilteredReason(null);
    setProgress(0);
    abortRef.current = true;
  }, []);

  const handleResult = useCallback((result: ImageGenerationResult): ImageGenerationResult => {
    if (abortRef.current) {
      return { success: false, error: 'Generation cancelled' };
    }

    if (result.success && result.image) {
      setImage(result.image);
      setError(null);
      setFilteredReason(null);
    } else {
      setImage(null);
      setError(result.error || null);
      setFilteredReason(result.filteredReason || null);
    }

    setProgress(100);
    return result;
  }, []);

  const generatePCImage = useCallback(
    async (options: PCImagePromptOptions): Promise<ImageGenerationResult> => {
      const cacheKey = getCacheKey(options);

      // Check cache first
      const cached = getFromCache(cacheKey);
      if (cached) {
        setImage(cached);
        setProgress(100);
        return { success: true, image: cached };
      }

      abortRef.current = false;
      setIsLoading(true);
      setError(null);
      setFilteredReason(null);
      setProgress(10);

      try {
        // Simulate progress during generation
        const progressInterval = setInterval(() => {
          setProgress((p) => Math.min(p + 10, 90));
        }, 500);

        const result = await aiImageGenerator.generatePCImage(options);

        clearInterval(progressInterval);

        // Cache successful results
        if (result.success && result.image) {
          addToCache(cacheKey, result.image);
        }

        return handleResult(result);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        setProgress(0);
        return { success: false, error: errorMessage };
      } finally {
        setIsLoading(false);
      }
    },
    [handleResult]
  );

  const generateWaterCoolingImage = useCallback(
    async (config: WaterCoolingConfig): Promise<ImageGenerationResult> => {
      const cacheKey = `wc_${getCacheKey(config)}`;

      // Check cache
      const cached = getFromCache(cacheKey);
      if (cached) {
        setImage(cached);
        setProgress(100);
        return { success: true, image: cached };
      }

      abortRef.current = false;
      setIsLoading(true);
      setError(null);
      setFilteredReason(null);
      setProgress(10);

      try {
        const progressInterval = setInterval(() => {
          setProgress((p) => Math.min(p + 10, 90));
        }, 500);

        const result = await aiImageGenerator.generateWaterCoolingImage(config);

        clearInterval(progressInterval);

        if (result.success && result.image) {
          addToCache(cacheKey, result.image);
        }

        return handleResult(result);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        setProgress(0);
        return { success: false, error: errorMessage };
      } finally {
        setIsLoading(false);
      }
    },
    [handleResult]
  );

  const generateFromState = useCallback(
    async (state: ConfiguratorState): Promise<ImageGenerationResult> => {
      abortRef.current = false;
      setIsLoading(true);
      setError(null);
      setFilteredReason(null);
      setProgress(10);

      try {
        const progressInterval = setInterval(() => {
          setProgress((p) => Math.min(p + 10, 90));
        }, 500);

        const result = await aiImageGenerator.generateConfigurationPreview(state);

        clearInterval(progressInterval);

        return handleResult(result);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        setProgress(0);
        return { success: false, error: errorMessage };
      } finally {
        setIsLoading(false);
      }
    },
    [handleResult]
  );

  return {
    image,
    isLoading,
    error,
    filteredReason,
    progress,
    generatePCImage,
    generateWaterCoolingImage,
    generateFromState,
    reset,
  };
}

export default useAIImage;
