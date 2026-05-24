"use client";

import { useState, type InputHTMLAttributes } from "react";

interface FloatingInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function FloatingInput({ label, error, className = "", id, ...props }: FloatingInputProps) {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!props.value);

  const isActive = focused || hasValue;

  return (
    <div className="relative">
      <input
        id={id}
        {...props}
        className={`peer w-full px-4 pt-6 pb-2.5 rounded-xl border bg-obsidian/50 text-warm-white placeholder-transparent focus:outline-none transition-all duration-300 ease-expo ${
          error
            ? "border-red-500/30 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20"
            : "border-obsidian-muted/40 focus:border-ember/40 focus:ring-1 focus:ring-ember/10"
        } ${className}`}
        onFocus={(e) => {
          setFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          setHasValue(!!e.target.value);
          props.onBlur?.(e);
        }}
        onChange={(e) => {
          setHasValue(!!e.target.value);
          props.onChange?.(e);
        }}
      />
      <label
        htmlFor={id}
        className={`absolute left-4 transition-all duration-300 ease-expo pointer-events-none ${
          isActive
            ? "top-1.5 text-[10px] text-ember/70 tracking-wider uppercase"
            : "top-1/2 -translate-y-1/2 text-sm text-warm-white/40"
        }`}
      >
        {label}
      </label>
      {error && (
        <p className="mt-1.5 text-xs text-red-400/80">{error}</p>
      )}
    </div>
  );
}
