'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Copy, RefreshCcw, ShoppingCart, ExternalLink } from 'lucide-react';

import { OptionGroups, PreviewCanvas } from '@/components/configurator';
import { resolveSelection, getDefaultSelectionForVariant } from '@/lib/configurator/engine';
import type { ConfiguratorSelection, ResolveResponseBody } from '@/types/configurator';
import { formatPrice, useCartStore } from '@/store/cart.store';

const DEFAULT_VARIANT_ID = 'rog-x-rtx4080';

// Valid option sets for URL validation
const VALID_TIERS: ConfiguratorSelection['tier'][] = ['rtx4070', 'rtx4080', 'rtx4090'];
const VALID_CASE_MODELS: ConfiguratorSelection['caseModel'][] = ['rog-x', 'neo-white', 'compact-pro', 'darkline'];
const VALID_CASE_COLORS: ConfiguratorSelection['caseColor'][] = ['black', 'white', 'gray'];
const VALID_SIDE_PANELS: ConfiguratorSelection['sidePanel'][] = ['glass', 'mesh'];
const VALID_RGB_PROFILES: ConfiguratorSelection['rgb'][] = ['off', 'purple', 'fuchsia', 'rainbow'];

function parseSelectionFromSearch(search: string): Partial<ConfiguratorSelection> {
  const params = new URLSearchParams(search);
  
  // Validate and parse each parameter
  const tierRaw = params.get('tier');
  const tier = tierRaw && VALID_TIERS.includes(tierRaw as ConfiguratorSelection['tier'])
    ? (tierRaw as ConfiguratorSelection['tier'])
    : null;

  const caseModelRaw = params.get('caseModel');
  const caseModel = caseModelRaw && VALID_CASE_MODELS.includes(caseModelRaw as ConfiguratorSelection['caseModel'])
    ? (caseModelRaw as ConfiguratorSelection['caseModel'])
    : null;

  const caseColorRaw = params.get('caseColor');
  const caseColor = caseColorRaw && VALID_CASE_COLORS.includes(caseColorRaw as ConfiguratorSelection['caseColor'])
    ? (caseColorRaw as ConfiguratorSelection['caseColor'])
    : null;

  const sidePanelRaw = params.get('sidePanel');
  const sidePanel = sidePanelRaw && VALID_SIDE_PANELS.includes(sidePanelRaw as ConfiguratorSelection['sidePanel'])
    ? (sidePanelRaw as ConfiguratorSelection['sidePanel'])
    : null;

  const rgbRaw = params.get('rgb');
  const rgb = rgbRaw && VALID_RGB_PROFILES.includes(rgbRaw as ConfiguratorSelection['rgb'])
    ? (rgbRaw as ConfiguratorSelection['rgb'])
    : null;

  return {
    ...(tier ? { tier } : {}),
    ...(caseModel ? { caseModel } : {}),
    ...(caseColor ? { caseColor } : {}),
    ...(sidePanel ? { sidePanel } : {}),
    ...(rgb ? { rgb } : {}),
  };
}

function selectionToSearchParams(selection: ConfiguratorSelection): string {
  const params = new URLSearchParams();
  params.set('tier', selection.tier);
  params.set('caseModel', selection.caseModel);
  params.set('caseColor', selection.caseColor);
  params.set('sidePanel', selection.sidePanel);
  params.set('rgb', selection.rgb);
  return params.toString();
}

function selectionsEqual(a: ConfiguratorSelection, b: ConfiguratorSelection): boolean {
  return (
    a.tier === b.tier &&
    a.caseModel === b.caseModel &&
    a.caseColor === b.caseColor &&
    a.sidePanel === b.sidePanel &&
    a.rgb === b.rgb
  );
}

export default function ConfiguratorPage() {
  const router = useRouter();
  const { addConfiguredItem } = useCartStore();

  const [selection, setSelection] = useState<ConfiguratorSelection>(() => getDefaultSelectionForVariant(DEFAULT_VARIANT_ID));
  const [data, setData] = useState<ResolveResponseBody>(() => {
    const initialResolved = resolveSelection(getDefaultSelectionForVariant(DEFAULT_VARIANT_ID));
    return {
      resolved: initialResolved,
      vk: { priceRub: null, availability: 'unknown' },
    };
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const initializedRef = useRef(false);
  const lastFetchKeyRef = useRef<string>('');

  // Init from URL once
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    try {
      const patch = parseSelectionFromSearch(window.location.search);
      if (Object.keys(patch).length === 0) return;

      const base = getDefaultSelectionForVariant(DEFAULT_VARIANT_ID);
      const merged: ConfiguratorSelection = { ...base, ...patch };
      setSelection(merged);
    } catch (err) {
      // Silently fall back to default if URL parsing fails
      console.warn('Failed to parse configurator URL parameters:', err);
    }
  }, []);

  // Keep URL in sync (deeplink)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const qs = selectionToSearchParams(selection);
    const url = new URL(window.location.href);
    url.search = qs;
    window.history.replaceState(null, '', url.toString());
  }, [selection]);

  // Resolve via API (prices/availability) when selection changes
  useEffect(() => {
    const key = selectionToSearchParams(selection);
    if (lastFetchKeyRef.current === key) return;
    lastFetchKeyRef.current = key;

    const controller = new AbortController();

    async function run() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/configurator/resolve', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ selection }),
          signal: controller.signal,
        });

        if (!res.ok) {
          const text = await res.text().catch(() => '');
          throw new Error(text || `HTTP ${res.status}`);
        }

        const json = (await res.json()) as ResolveResponseBody;
        setData(json);

        // If server normalized selection, adopt it (avoid loops)
        if (!selectionsEqual(selection, json.resolved.selection)) {
          setSelection(json.resolved.selection);
        }
      } catch (e) {
        if ((e as any)?.name === 'AbortError') return;
        setError(e instanceof Error ? e.message : 'Resolve failed');
      } finally {
        setLoading(false);
      }
    }

    run();
    return () => controller.abort();
  }, [selection]);

  const resolved = data.resolved;
  const variant = resolved.variant;

  const handlePatch = useCallback((patch: Partial<ConfiguratorSelection>) => {
    setSelection((prev) => ({ ...prev, ...patch }));
  }, []);

  const handleReset = useCallback(() => {
    const next = getDefaultSelectionForVariant(DEFAULT_VARIANT_ID);
    setSelection(next);
    // also clear resolve key to force refetch
    lastFetchKeyRef.current = '';
  }, []);

  const handleCopyLink = useCallback(async () => {
    try {
      const url = new URL(window.location.href);
      url.search = selectionToSearchParams(selection);
      await navigator.clipboard.writeText(url.toString());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('Failed to copy link:', err);
      setCopied(false);
    }
  }, [selection]);

  const handleAddToCart = useCallback(() => {
    addConfiguredItem({
      variantId: variant.id,
      variantName: variant.name,
      vkProductId: String(variant.vkProductId),
      selection: resolved.selection,
      price: data.vk.priceRub ?? 0,
      image: variant.preview.baseSrc,
      vkUrl: data.vk.vkUrl ?? undefined,
      specs: data.vk.priceRub
        ? undefined
        : `Цена уточняется. Корпус: ${resolved.selection.caseModel}, цвет: ${resolved.selection.caseColor}, панель: ${resolved.selection.sidePanel}, RGB: ${resolved.selection.rgb}`,
    });
    router.push('/cart');
  }, [
    addConfiguredItem,
    data.vk.priceRub,
    data.vk.vkUrl,
    resolved.selection,
    router,
    variant.id,
    variant.name,
    variant.preview.baseSrc,
    variant.vkProductId,
  ]);

  const vkPriceLabel = useMemo(() => {
    if (!data.vk.priceRub) return 'Цена уточняется';
    return formatPrice(data.vk.priceRub);
  }, [data.vk.priceRub]);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 mesh-background" />
        <div className="absolute inset-0 opacity-[0.03] cyber-grid" />
        <div className="absolute -top-40 -left-40 w-[520px] h-[520px] bg-purple-600/20 rounded-full blur-[140px]" />
        <div className="absolute -bottom-40 -right-40 w-[520px] h-[520px] bg-fuchsia-600/15 rounded-full blur-[140px]" />
      </div>

      {/* Header */}
      <div className="relative z-10 border-b border-white/5">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5 text-white/70" />
            </Link>

            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/40">configurator</p>
              <h1 className="text-xl md:text-2xl font-semibold text-white">Соберите свой VA‑PC</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white/70 transition-colors"
            >
              <RefreshCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Сброс</span>
            </button>

            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/15 border border-purple-500/30 hover:bg-purple-500/25 text-purple-200 transition-colors"
            >
              <Copy className="w-4 h-4" />
              <span className="hidden sm:inline">{copied ? 'Скопировано' : 'Ссылка'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Preview */}
          <motion.div
            className="lg:col-span-7"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <PreviewCanvas variant={variant} selection={resolved.selection} />

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 rounded-2xl bg-white/[0.03] border border-white/10 p-4">
                <p className="text-xs font-mono text-white/40">RESOLVED BUILD</p>
                <p className="text-lg font-semibold text-white leading-tight">{variant.name}</p>
                <p className="text-sm text-white/50 mt-1">
                  {data.vk.availability === 'in_stock'
                    ? 'В наличии'
                    : data.vk.availability === 'out_of_stock'
                      ? 'Нет в наличии'
                      : data.vk.availability === 'removed'
                        ? 'Снято с продажи'
                        : 'Статус уточняется'}
                  {loading ? ' · обновляем…' : ''}
                </p>
              </div>

              <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-4">
                <p className="text-xs font-mono text-white/40">PRICE</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-fuchsia-300 bg-clip-text text-transparent">
                  {vkPriceLabel}
                </p>
                {data.vk.vkUrl && (
                  <a
                    href={data.vk.vkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-2 text-xs text-white/50 hover:text-white transition-colors"
                  >
                    Открыть в VK <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>

            {error && (
              <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-200">
                Ошибка: {error}
              </div>
            )}
          </motion.div>

          {/* Options */}
          <motion.div
            className="lg:col-span-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
          >
            <div className="rounded-3xl bg-white/[0.03] border border-white/10 p-6">
              <OptionGroups selection={selection} variant={variant} onChange={handlePatch} />

              <div className="mt-8 rounded-2xl bg-black/30 border border-white/10 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-mono text-white/40">SUMMARY</p>
                    <p className="text-sm text-white/70 mt-1">
                      Корпус: <span className="text-white">{resolved.selection.caseModel}</span> · Цвет:{' '}
                      <span className="text-white">{resolved.selection.caseColor}</span> · RGB:{' '}
                      <span className="text-white">{resolved.selection.rgb}</span>
                    </p>
                  </div>
                  {loading && (
                    <span className="text-xs text-white/40">sync…</span>
                  )}
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold transition-colors"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    В корзину
                  </button>

                  <a
                    href={data.vk.vkUrl || 'https://vk.com/vapcbuild'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 bg-purple-500/20 border border-purple-500/30 hover:bg-purple-500/30 text-purple-100 font-semibold transition-colors"
                  >
                    Открыть VK <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                <p className="mt-4 text-xs text-white/40">
                  Конфигуратор ограничивает выбор: итог всегда соответствует одной из заранее подготовленных сборок.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
