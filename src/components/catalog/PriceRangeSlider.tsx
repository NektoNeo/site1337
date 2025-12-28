'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

interface PriceRangeSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

export function PriceRangeSlider({
  min,
  max,
  value,
  onChange,
}: PriceRangeSliderProps) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getPercent = useCallback(
    (value: number) => ((value - min) / (max - min)) * 100,
    [min, max]
  );

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Math.min(Number(e.target.value), localValue[1] - 10000);
    setLocalValue([newMin, localValue[1]]);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Math.max(Number(e.target.value), localValue[0] + 10000);
    setLocalValue([localValue[0], newMax]);
  };

  const handleMouseUp = () => {
    onChange(localValue);
  };

  const minPercent = getPercent(localValue[0]);
  const maxPercent = getPercent(localValue[1]);

  return (
    <div className="py-4">
      {/* Price labels */}
      <div className="flex justify-between mb-4">
        <div className="text-center">
          <span className="text-xs text-white/40 uppercase tracking-wider font-display">От</span>
          <motion.div
            key={localValue[0]}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            className="text-sm font-mono text-neon-magenta-400 font-semibold"
          >
            {formatPrice(localValue[0])}
          </motion.div>
        </div>
        <div className="text-center">
          <span className="text-xs text-white/40 uppercase tracking-wider font-display">До</span>
          <motion.div
            key={localValue[1]}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            className="text-sm font-mono text-neon-purple-400 font-semibold"
          >
            {formatPrice(localValue[1])}
          </motion.div>
        </div>
      </div>

      {/* Slider container */}
      <div className="relative h-8">
        {/* Track background */}
        <div className="absolute top-1/2 -translate-y-1/2 w-full h-2 bg-void-400 rounded-full overflow-hidden">
          {/* Active range */}
          <div
            className="absolute h-full bg-gradient-to-r from-neon-purple-500 via-neon-magenta-500 to-neon-purple-500 rounded-full"
            style={{
              left: `${minPercent}%`,
              width: `${maxPercent - minPercent}%`,
            }}
          />
          {/* Glow effect */}
          <div
            className="absolute h-full bg-gradient-to-r from-neon-purple-500 via-neon-magenta-500 to-neon-purple-500 rounded-full blur-sm opacity-60"
            style={{
              left: `${minPercent}%`,
              width: `${maxPercent - minPercent}%`,
            }}
          />
        </div>

        {/* Min thumb */}
        <input
          type="range"
          min={min}
          max={max}
          step={5000}
          value={localValue[0]}
          onChange={handleMinChange}
          onMouseUp={handleMouseUp}
          onTouchEnd={handleMouseUp}
          className="absolute w-full h-2 top-1/2 -translate-y-1/2 appearance-none bg-transparent pointer-events-none z-10
            [&::-webkit-slider-thumb]:pointer-events-auto
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-5
            [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-white
            [&::-webkit-slider-thumb]:border-2
            [&::-webkit-slider-thumb]:border-neon-magenta-400
            [&::-webkit-slider-thumb]:shadow-[0_0_15px_rgba(6,182,212,0.8)]
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:transition-all
            [&::-webkit-slider-thumb]:duration-200
            [&::-webkit-slider-thumb]:hover:scale-125
            [&::-webkit-slider-thumb]:hover:shadow-[0_0_25px_rgba(6,182,212,1)]
            [&::-moz-range-thumb]:pointer-events-auto
            [&::-moz-range-thumb]:appearance-none
            [&::-moz-range-thumb]:w-5
            [&::-moz-range-thumb]:h-5
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-white
            [&::-moz-range-thumb]:border-2
            [&::-moz-range-thumb]:border-neon-magenta-400
            [&::-moz-range-thumb]:cursor-pointer"
        />

        {/* Max thumb */}
        <input
          type="range"
          min={min}
          max={max}
          step={5000}
          value={localValue[1]}
          onChange={handleMaxChange}
          onMouseUp={handleMouseUp}
          onTouchEnd={handleMouseUp}
          className="absolute w-full h-2 top-1/2 -translate-y-1/2 appearance-none bg-transparent pointer-events-none z-20
            [&::-webkit-slider-thumb]:pointer-events-auto
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-5
            [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-white
            [&::-webkit-slider-thumb]:border-2
            [&::-webkit-slider-thumb]:border-neon-purple-400
            [&::-webkit-slider-thumb]:shadow-[0_0_15px_rgba(139,92,246,0.8)]
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:transition-all
            [&::-webkit-slider-thumb]:duration-200
            [&::-webkit-slider-thumb]:hover:scale-125
            [&::-webkit-slider-thumb]:hover:shadow-[0_0_25px_rgba(139,92,246,1)]
            [&::-moz-range-thumb]:pointer-events-auto
            [&::-moz-range-thumb]:appearance-none
            [&::-moz-range-thumb]:w-5
            [&::-moz-range-thumb]:h-5
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-white
            [&::-moz-range-thumb]:border-2
            [&::-moz-range-thumb]:border-neon-purple-400
            [&::-moz-range-thumb]:cursor-pointer"
        />
      </div>

      {/* Min/Max labels */}
      <div className="flex justify-between mt-2 text-xs text-white/30 font-mono">
        <span>{formatPrice(min)}</span>
        <span>{formatPrice(max)}</span>
      </div>
    </div>
  );
}
