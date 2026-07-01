"use client";

import Image from "next/image";
import { AnalysisResult } from "@/types/analysis";
import StatusBadge from "@/components/StatusBadge";

interface AnalysisResultProps {
  result: AnalysisResult;
  preview: string;
}

const severityColor = {
  "Tidak Ada": "text-emerald-400",
  Ringan: "text-yellow-400",
  Sedang: "text-orange-400",
  Parah: "text-red-400",
};

const severityBg = {
  "Tidak Ada": "bg-emerald-500/10 border-emerald-500/20",
  Ringan: "bg-yellow-500/10 border-yellow-500/20",
  Sedang: "bg-orange-500/10 border-orange-500/20",
  Parah: "bg-red-500/10 border-red-500/20",
};


function GlassCard({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <div
      id={id}
      className={`
        relative rounded-2xl border border-white/10
        bg-white/5 backdrop-blur-xl
        shadow-[0_8px_32px_rgba(0,0,0,0.3)]
        transition-transform duration-300 hover:scale-[1.01]
        overflow-hidden
        ${className}
      `}
    >
      {/* Subtle inner glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

function SectionTitle({
  icon,
  title,
}: {
  icon: string;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-lg">{icon}</span>
      <h3 className="text-white/80 font-semibold text-sm uppercase tracking-widest">
        {title}
      </h3>
    </div>
  );
}

export default function AnalysisResultComponent({
  result,
  preview,
}: AnalysisResultProps) {
  const emoji = result.tanaman === "Tidak Dikenali" ? "❓" : "🌿";
  const severity = result.identifikasi_penyakit.tingkat_keparahan;

  return (
    <div id="analysis-result" className="w-full animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-2xl">
            {emoji}
          </div>
          <div>
            <h2 className="text-white font-bold text-xl">{result.tanaman}</h2>
            <p className="text-white/50 text-xs">Hasil Diagnosis AI</p>
          </div>
        </div>
        <StatusBadge status={result.status} />
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Preview Gambar */}
        <GlassCard id="card-preview" className="md:row-span-2">
          <div className="relative w-full h-56 md:h-full min-h-[220px]">
            <Image
              src={preview}
              alt="Daun yang dianalisis"
              fill
              className="object-contain rounded-2xl p-2"
            />
          </div>
          <div className="p-4 pt-0">
            <SectionTitle icon="📸" title="Citra Analisis" />
            <p className="text-white/50 text-xs">
              Gambar yang diproses oleh Dr. Botanica AI
            </p>
          </div>
        </GlassCard>

        {/* Card 2: Identifikasi Penyakit */}
        <GlassCard id="card-disease">
          <div className="p-5">
            <SectionTitle icon="🔬" title="Identifikasi Penyakit" />
            <div
              className={`
              rounded-xl border p-4 mb-3
              ${severityBg[severity] ?? severityBg["Ringan"]}
            `}
            >
              <p className="text-white font-bold text-base mb-1">
                {result.identifikasi_penyakit.nama_penyakit}
              </p>
              <span
                className={`text-xs font-semibold ${severityColor[severity] ?? "text-yellow-400"}`}
              >
                Tingkat Keparahan: {severity}
              </span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              {result.identifikasi_penyakit.deskripsi}
            </p>
          </div>
        </GlassCard>

        {/* Card: Kematangan Buah (Hanya jika terdeteksi buah) */}
        {result.identifikasi_kematangan && result.identifikasi_kematangan.status_kematangan !== "Bukan Buah" && (
          <GlassCard id="card-ripeness">
            <div className="p-5">
              <SectionTitle icon="🍎" title="Identifikasi Kematangan" />
              <div
                className={`
                rounded-xl border p-4 mb-3
                bg-purple-500/10 border-purple-500/20
              `}
              >
                <p className="text-white font-bold text-base mb-1">
                  {result.identifikasi_kematangan.status_kematangan}
                </p>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">
                {result.identifikasi_kematangan.deskripsi}
              </p>
            </div>
          </GlassCard>
        )}

        {/* Card 3: Rincian Visual */}
        <GlassCard id="card-visual">
          <div className="p-5">
            <SectionTitle icon="🎨" title="Rincian Visual" />
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-sm">
                  🎨
                </div>
                <div>
                  <p className="text-white/50 text-xs uppercase tracking-wide mb-0.5">
                    Warna
                  </p>
                  <p className="text-white/80 text-sm">
                    {result.rincian_visual.warna}
                  </p>
                </div>
              </div>
              <div className="h-px bg-white/5" />
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-sm">
                  🔲
                </div>
                <div>
                  <p className="text-white/50 text-xs uppercase tracking-wide mb-0.5">
                    Tekstur
                  </p>
                  <p className="text-white/80 text-sm">
                    {result.rincian_visual.tekstur}
                  </p>
                </div>
              </div>
              <div className="h-px bg-white/5" />
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center justify-center text-sm">
                  ⚠️
                </div>
                <div>
                  <p className="text-white/50 text-xs uppercase tracking-wide mb-0.5">
                    Anomali
                  </p>
                  <p className="text-white/80 text-sm">
                    {result.rincian_visual.anomali}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Card 4: Tips Perawatan */}
        <GlassCard id="card-tips">
          <div className="p-5">
            <SectionTitle icon="💡" title="Tips Perawatan" />
            <ul className="space-y-2">
              {result.tips_perawatan.map((tip, i) => (
                <li key={i} className="flex gap-2.5 items-start">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/30 border border-emerald-500/40 flex items-center justify-center text-[10px] text-emerald-300 font-bold mt-0.5">
                    {i + 1}
                  </div>
                  <span className="text-white/70 text-sm leading-relaxed">
                    {tip}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </GlassCard>

        {/* Card 5: Rekomendasi Solusi (full width) */}
        <GlassCard id="card-solutions" className="md:col-span-2">
          <div className="p-5">
            <SectionTitle icon="🚀" title="Rekomendasi Solusi" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {result.rekomendasi_solusi.map((sol, i) => (
                <div
                  key={i}
                  className="flex gap-3 p-3 rounded-xl bg-white/5 border border-white/8 hover:border-emerald-400/30 transition-colors"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/30 to-teal-500/30 border border-emerald-500/30 flex items-center justify-center text-sm font-bold text-emerald-300">
                    {i + 1}
                  </div>
                  <span className="text-white/70 text-sm leading-relaxed">
                    {sol}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
