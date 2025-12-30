'use client';

import React, { useMemo } from 'react';
import { Cpu, Monitor, MemoryStick, HardDrive, CircuitBoard, Zap, Fan } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { ProductSpecCategory } from '@/types/product';

type SpecItem = {
  key: string;
  label: string;
  value: string;
  Icon: React.ComponentType<{ className?: string }>;
};

function pickFirstValue(specs: ProductSpecCategory[], categoryIncludes: string[]) {
  const cat = specs.find((c) =>
    categoryIncludes.some((k) => c.category.toLowerCase().includes(k))
  );
  const first = cat?.specs?.[0]?.value;
  return first ?? '';
}

export default function SpecsSummaryCard({
  specs,
  className,
}: {
  specs: ProductSpecCategory[];
  className?: string;
}) {
  const items = useMemo<SpecItem[]>(() => {
    const cpu = pickFirstValue(specs, ['процессор', 'cpu']);
    const gpu = pickFirstValue(specs, ['видеокарта', 'gpu', 'график']);
    const ram = pickFirstValue(specs, ['оператив', 'ram', 'памят']);
    const ssd = pickFirstValue(specs, ['накоп', 'ssd', 'диск']);
    const mb = pickFirstValue(specs, ['материн', 'motherboard']);
    const psu = pickFirstValue(specs, ['блок пит', 'psu']);
    const cooling = pickFirstValue(specs, ['охлаж', 'cooling', 'кулер']);

    const list: SpecItem[] = [
      { key: 'cpu', label: 'CPU', value: cpu, Icon: Cpu },
      { key: 'gpu', label: 'GPU', value: gpu, Icon: Monitor },
      { key: 'ram', label: 'RAM', value: ram, Icon: MemoryStick },
      { key: 'ssd', label: 'SSD', value: ssd, Icon: HardDrive },
      { key: 'mb', label: 'MB', value: mb, Icon: CircuitBoard },
      { key: 'psu', label: 'PSU', value: psu, Icon: Zap },
      { key: 'cooling', label: 'Cooling', value: cooling, Icon: Fan },
    ];

    // Only keep non-empty values, keep order, limit to 6 for layout
    return list.filter((i) => i.value).slice(0, 6);
  }, [specs]);

  if (items.length === 0) return null;

  return (
    <div
      className={cn(
        'rounded-2xl bg-white/[0.03] border border-white/10 p-4',
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-mono text-white/40 tracking-[0.22em] uppercase">
          Specs
        </p>
        <span className="text-xs text-white/40">Кратко</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map(({ key, label, value, Icon }) => (
          <div
            key={key}
            className="rounded-xl bg-black/30 border border-white/10 p-3"
          >
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-purple-300" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-mono text-white/40">{label}</p>
                <p className="text-sm text-white/80 leading-tight truncate">
                  {value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

