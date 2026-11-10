'use client';

import React, { useState, useMemo } from 'react';
import {
  Scale,
  ArrowRightLeft,
  Copy,
  Check,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

type UnitCategory = 'length' | 'weight' | 'temperature' | 'area' | 'volume' | 'speed' | 'time' | 'data';

interface UnitDef {
  id: string;
  name: string;
  ratio: number; // Ratio relative to base unit (or custom conversion for temp)
}

const UNIT_DATA: Record<UnitCategory, { name: string; base: string; units: UnitDef[] }> = {
  length: {
    name: 'Length',
    base: 'm',
    units: [
      { id: 'm', name: 'Meters (m)', ratio: 1 },
      { id: 'km', name: 'Kilometers (km)', ratio: 1000 },
      { id: 'cm', name: 'Centimeters (cm)', ratio: 0.01 },
      { id: 'mm', name: 'Millimeters (mm)', ratio: 0.001 },
      { id: 'mi', name: 'Miles (mi)', ratio: 1609.344 },
      { id: 'yd', name: 'Yards (yd)', ratio: 0.9144 },
      { id: 'ft', name: 'Feet (ft)', ratio: 0.3048 },
      { id: 'in', name: 'Inches (in)', ratio: 0.0254 },
    ],
  },
  weight: {
    name: 'Weight & Mass',
    base: 'kg',
    units: [
      { id: 'kg', name: 'Kilograms (kg)', ratio: 1 },
      { id: 'g', name: 'Grams (g)', ratio: 0.001 },
      { id: 'mg', name: 'Milligrams (mg)', ratio: 0.000001 },
      { id: 'lb', name: 'Pounds (lbs)', ratio: 0.45359237 },
      { id: 'oz', name: 'Ounces (oz)', ratio: 0.02834952 },
      { id: 'ton', name: 'Metric Tons (t)', ratio: 1000 },
    ],
  },
  temperature: {
    name: 'Temperature',
    base: 'c',
    units: [
      { id: 'c', name: 'Celsius (°C)', ratio: 1 },
      { id: 'f', name: 'Fahrenheit (°F)', ratio: 1 },
      { id: 'k', name: 'Kelvin (K)', ratio: 1 },
    ],
  },
  area: {
    name: 'Area',
    base: 'sqm',
    units: [
      { id: 'sqm', name: 'Square Meters (m²)', ratio: 1 },
      { id: 'sqkm', name: 'Square Kilometers (km²)', ratio: 1000000 },
      { id: 'sqft', name: 'Square Feet (ft²)', ratio: 0.092903 },
      { id: 'sqyd', name: 'Square Yards (yd²)', ratio: 0.836127 },
      { id: 'acre', name: 'Acres (ac)', ratio: 4046.86 },
      { id: 'ha', name: 'Hectares (ha)', ratio: 10000 },
    ],
  },
  volume: {
    name: 'Volume',
    base: 'l',
    units: [
      { id: 'l', name: 'Liters (L)', ratio: 1 },
      { id: 'ml', name: 'Milliliters (mL)', ratio: 0.001 },
      { id: 'm3', name: 'Cubic Meters (m³)', ratio: 1000 },
      { id: 'gal_us', name: 'US Gallons (gal)', ratio: 3.78541 },
      { id: 'gal_uk', name: 'Imperial Gallons (gal)', ratio: 4.54609 },
      { id: 'fl_oz', name: 'Fluid Ounces (fl oz)', ratio: 0.0295735 },
    ],
  },
  speed: {
    name: 'Speed',
    base: 'mps',
    units: [
      { id: 'mps', name: 'Meters per Second (m/s)', ratio: 1 },
      { id: 'kmh', name: 'Kilometers per Hour (km/h)', ratio: 0.277778 },
      { id: 'mph', name: 'Miles per Hour (mph)', ratio: 0.44704 },
      { id: 'knot', name: 'Knots (kn)', ratio: 0.514444 },
    ],
  },
  time: {
    name: 'Time',
    base: 's',
    units: [
      { id: 's', name: 'Seconds (s)', ratio: 1 },
      { id: 'min', name: 'Minutes (min)', ratio: 60 },
      { id: 'hr', name: 'Hours (hr)', ratio: 3600 },
      { id: 'day', name: 'Days (d)', ratio: 86400 },
      { id: 'week', name: 'Weeks (wk)', ratio: 604800 },
      { id: 'year', name: 'Years (yr)', ratio: 31536000 },
    ],
  },
  data: {
    name: 'Digital Storage',
    base: 'byte',
    units: [
      { id: 'byte', name: 'Bytes (B)', ratio: 1 },
      { id: 'kb', name: 'Kilobytes (KB)', ratio: 1000 },
      { id: 'mb', name: 'Megabytes (MB)', ratio: 1000000 },
      { id: 'gb', name: 'Gigabytes (GB)', ratio: 1000000000 },
      { id: 'tb', name: 'Terabytes (TB)', ratio: 1000000000000 },
      { id: 'kib', name: 'Kibibytes (KiB)', ratio: 1024 },
      { id: 'mib', name: 'Mebibytes (MiB)', ratio: 1048576 },
      { id: 'gib', name: 'Gibibytes (GiB)', ratio: 1073741824 },
    ],
  },
};

export const UnitConverterWorkspace: React.FC = () => {
  const [category, setCategory] = useState<UnitCategory>('length');
  const [fromUnit, setFromUnit] = useState<string>('m');
  const [toUnit, setToUnit] = useState<string>('ft');
  const [inputValue, setInputValue] = useState<number>(10);
  const [precision, setPrecision] = useState<number>(4);
  const [copied, setCopied] = useState<boolean>(false);

  // When category changes, reset from/to units to first two of category
  const handleCategoryChange = (newCat: UnitCategory) => {
    setCategory(newCat);
    const units = UNIT_DATA[newCat].units;
    setFromUnit(units[0].id);
    setToUnit(units[1] ? units[1].id : units[0].id);
  };

  const swapUnits = () => {
    const tmp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(tmp);
  };

  // Conversion logic
  const convertedValue = useMemo(() => {
    const val = inputValue;
    if (isNaN(val)) return 0;

    // Special temperature handling
    if (category === 'temperature') {
      let celsius = val;
      if (fromUnit === 'f') celsius = (val - 32) * (5 / 9);
      else if (fromUnit === 'k') celsius = val - 273.15;

      if (toUnit === 'c') return celsius;
      if (toUnit === 'f') return celsius * (9 / 5) + 32;
      if (toUnit === 'k') return celsius + 273.15;
      return celsius;
    }

    const currentCatUnits = UNIT_DATA[category].units;
    const fromDef = currentCatUnits.find((u) => u.id === fromUnit);
    const toDef = currentCatUnits.find((u) => u.id === toUnit);

    if (!fromDef || !toDef) return 0;

    // Convert from source to base, then base to target
    const baseVal = val * fromDef.ratio;
    return baseVal / toDef.ratio;
  }, [category, fromUnit, toUnit, inputValue]);

  const copyResult = () => {
    const text = `${inputValue} ${fromUnit} = ${convertedValue.toFixed(precision)} ${toUnit}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Category Pills */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-2 sm:p-3 shadow-xs">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1.5 sm:gap-2">
          {(Object.keys(UNIT_DATA) as UnitCategory[]).map((catKey) => {
            const active = category === catKey;
            return (
              <button
                key={catKey}
                type="button"
                onClick={() => handleCategoryChange(catKey)}
                className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all text-center ${
                  active
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {UNIT_DATA[catKey].name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
          {/* From Side (5 cols) */}
          <div className="md:col-span-5 space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              From
            </label>
            <input
              type="number"
              step="any"
              value={inputValue}
              onChange={(e) => setInputValue(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-lg font-bold font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {UNIT_DATA[category].units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button (1 col) */}
          <div className="md:col-span-1 flex justify-center py-2 md:py-0">
            <button
              type="button"
              onClick={swapUnits}
              className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 hover:border-indigo-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-indigo-600 flex items-center justify-center transition-colors cursor-pointer"
              title="Swap units"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
          </div>

          {/* To Side (5 cols) */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                To (Converted)
              </label>
              <button
                type="button"
                onClick={copyResult}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-indigo-50/50 dark:bg-indigo-950/40 text-lg font-bold font-mono text-indigo-900 dark:text-indigo-200 overflow-x-auto">
              {convertedValue.toFixed(precision)}
            </div>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {UNIT_DATA[category].units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Precision Setting */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>Decimals Precision:</span>
          <div className="flex gap-1.5">
            {[2, 4, 6, 8].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPrecision(p)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                  precision === p
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {p} Decimals
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
