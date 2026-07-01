"use client";

import { useEffect, useState } from "react";

const STEPS = [
  { icon: "🔍", text: "Memindai citra daun..." },
  { icon: "🎨", text: "Menganalisis distribusi warna..." },
  { icon: "🔬", text: "Mengevaluasi tekstur permukaan..." },
  { icon: "🧬", text: "Mendeteksi pola penyakit..." },
  { icon: "📊", text: "Menyusun laporan diagnosis..." },
  { icon: "✨", text: "Finalisasi hasil analisis..." },
];

export default function LoadingState() {
  const [stepIndex, setStepIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setStepIndex((prev) => (prev + 1) % STEPS.length);
        setFade(true);
      }, 300);
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  const currentStep = STEPS[stepIndex];

  return (
    <div
      id="loading-state"
      className="flex flex-col items-center justify-center py-16 gap-8"
    >
      {/* Animated orb */}
      <div className="relative w-28 h-28">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-2 border-emerald-400/30 animate-spin-slow" />
        {/* Middle ring */}
        <div
          className="absolute inset-2 rounded-full border-2 border-emerald-300/40 animate-spin-slow"
          style={{ animationDirection: "reverse", animationDuration: "2s" }}
        />
        {/* Inner glow */}
        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-emerald-500/40 to-teal-500/40 animate-pulse-glow backdrop-blur-sm" />
        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center text-3xl">
          🌱
        </div>
      </div>

      {/* Step text */}
      <div className="flex flex-col items-center gap-2">
        <div
          className={`
          flex items-center gap-2 transition-all duration-300
          ${fade ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}
        `}
        >
          <span className="text-xl">{currentStep.icon}</span>
          <span className="text-white/80 font-medium text-base">
            {currentStep.text}
          </span>
        </div>

        {/* Step dots */}
        <div className="flex gap-1.5 mt-2">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`
                w-1.5 h-1.5 rounded-full transition-all duration-300
                ${
                  i === stepIndex
                    ? "bg-emerald-400 scale-125"
                    : "bg-white/20"
                }
              `}
            />
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-64 h-1 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-1800"
          style={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }}
        />
      </div>

      <p className="text-white/40 text-sm">
        Dr. Botanica sedang menganalisis citra daun Anda...
      </p>
    </div>
  );
}
