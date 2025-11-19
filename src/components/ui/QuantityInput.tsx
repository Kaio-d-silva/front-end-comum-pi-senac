import React from 'react';

interface QuantityInputProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
}

const QuantityInput: React.FC<QuantityInputProps> = ({
  value,
  min = 0,
  max,
  onChange,
}) => {
  const handleChange = (newValue: number) => {
    if (Number.isNaN(newValue)) return;
    if (max !== undefined && newValue > max) return;
    if (newValue < min) {
      onChange(min);
      return;
    }
    onChange(newValue);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => handleChange(value - 1)}
        className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-sm font-medium text-slate-700 transition hover:bg-slate-300 active:scale-[0.97]"
      >
        −
      </button>
      <input
        type="number"
        value={value}
        onChange={(e) => handleChange(parseInt(e.target.value, 10))}
        className="h-8 w-12 rounded-md border border-slate-300 text-center text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-100"
        min={min}
        max={max}
      />
      <button
        type="button"
        onClick={() => handleChange(value + 1)}
        className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-sm font-medium text-slate-700 transition hover:bg-slate-300 active:scale-[0.97]"
      >
        +
      </button>
    </div>
  );
};

export default QuantityInput;
