'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import type { WorkItem } from '@/lib/gallery';
import { GlassCard } from '@/components/ui/GlassCard';

export function WorksGallery() {
  const [selected, setSelected] = useState<WorkItem | null>(null);
  const [works, setWorks] = useState<WorkItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const response = await fetch('/api/works');
        if (!response.ok) throw new Error('Failed to load works');
        const data = await response.json();
        if (!cancelled && Array.isArray(data?.works)) {
          setWorks(data.works);
        }
      } catch (error) {
        console.warn('[WorksGallery] failed to load works', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="works" className="py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between mb-12">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/40 mb-3">портфолио</p>
            <h2 className="text-3xl font-semibold text-white">Свежие сборки VA-PC</h2>
            <p className="text-white/60 max-w-2xl mt-3">
              Каждая система проходит стресс-тест AIDA64 и OCCT, получает фотоотчёт и гарантию 12+ месяцев.
              Кликните на сборку, чтобы увидеть детали и спецификацию.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {works.map((work) => (
            <GlassCard
              key={work.id}
              className="group cursor-pointer"
              onClick={() => setSelected(work)}
            >
              <div className="aspect-[4/3] relative overflow-hidden rounded-[18px] bg-[#09090b]">
                <Image
                  src={work.image}
                  alt={work.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 400px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70" />
                <div className="absolute left-4 bottom-4 space-y-1">
                  <span className="text-xs uppercase tracking-[0.3em] text-white/60">
                    {work.segment}
                  </span>
                  <p className="text-xl font-semibold text-white">{work.title}</p>
                </div>
              </div>
              <div className="p-6 space-y-2">
                <p className="text-sm text-white/60">{work.description}</p>
                <p className="text-sm text-white/50">
                  {work.gpu} · {work.cpu}
                </p>
                <div className="flex flex-wrap gap-2 pt-3 border-t border-white/5 text-xs text-white/50">
                  {work.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-full border border-white/10">
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-white/80">{work.price}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {loading && (
        <div className="mt-6 text-center text-sm text-white/50">Загружаем новые проекты…</div>
      )}

      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="w-full max-w-3xl rounded-3xl border border-white/10 bg-black/80 p-6"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col gap-6 lg:flex-row">
                <div className="relative flex-1 rounded-2xl overflow-hidden bg-[#0c0c10] aspect-[4/3]">
                  <Image
                    src={selected.image}
                    alt={selected.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 500px"
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-white/40">{selected.segment}</p>
                    <h3 className="text-2xl font-semibold text-white mt-1">{selected.title}</h3>
                  </div>
                  <p className="text-white/70">{selected.description}</p>
                  <div className="space-y-2 text-sm text-white/70">
                    <SpecRow label="Графика" value={selected.gpu || 'Не указано'} />
                    <SpecRow label="Процессор" value={selected.cpu || 'Не указано'} />
                    <SpecRow label="Стоимость" value={selected.price || 'По запросу'} />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selected.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1 text-xs text-white/60 rounded-full border border-white/10">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <button
                className="mt-6 text-sm text-white/60 hover:text-white transition-colors"
                onClick={() => setSelected(null)}
              >
                Закрыть
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-white/50">{label}</span>
      <span className="text-white">{value}</span>
    </div>
  );
}
