"use client";

import { useState, useCallback } from "react";
import ImageUploader from "@/components/ImageUploader";
import LoadingState from "@/components/LoadingState";
import AnalysisResultComponent from "@/components/AnalysisResult";
import { AnalysisResult } from "@/types/analysis";

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback((selectedFile: File, previewUrl: string) => {
    setFile(selectedFile);
    setPreview(previewUrl);
    setResult(null);
    setError(null);
  }, []);

  const handleReset = useCallback(() => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
  }, []);

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        const msg = data.error ?? "Terjadi kesalahan saat menganalisis.";
        const detail = data.detail ? `\n\n${data.detail}` : "";
        throw new Error(msg + detail);
      }

      setResult(data as AnalysisResult);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Terjadi kesalahan tak terduga.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-app noise-overlay min-h-screen">
      <div className="relative z-10">

        {/* ── Hero Header ── */}
        <header className="relative overflow-hidden grid-pattern border-b border-white/5">
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/50 to-transparent pointer-events-none" />

          {/* Decorative orbs */}
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />
          <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-teal-500/5 blur-3xl pointer-events-none" />

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-6 animate-fade-in-up">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
              Powered by Gemini 1.5 Flash · PCD Praktikum
            </div>

            {/* Title */}
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4 animate-fade-in-up"
              style={{ animationDelay: "0.1s", fontFamily: "var(--font-outfit)" }}
            >
              <span className="text-white">PhytoScan</span>{" "}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                AI
              </span>
            </h1>

            <p
              className="text-white/50 text-base sm:text-lg max-w-xl mx-auto mb-6 animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              Upload foto daun atau buah tanaman apa saja dan dapatkan diagnosis instan dari AI.
            </p>

            {/* Feature chips */}
            <div
              className="flex flex-wrap justify-center gap-2 animate-fade-in-up"
              style={{ animationDelay: "0.3s" }}
            >
              {[
                { icon: "🎨", label: "Analisis Warna" },
                { icon: "🔬", label: "Analisis Tekstur" },
                { icon: "🧬", label: "Deteksi Penyakit" },
                { icon: "💊", label: "Rekomendasi Solusi" },
              ].map(({ icon, label }) => (
                <span
                  key={label}
                  className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/60 text-xs"
                >
                  {icon} {label}
                </span>
              ))}
            </div>
          </div>
        </header>

        {/* ── Main Content ── */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">

          {/* Upload Panel */}
          <section
            id="upload-panel"
            className="glass-card p-6 sm:p-8 animate-fade-in-up"
            style={{ animationDelay: "0.35s" }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-lg">
                📤
              </div>
              <div>
                <h2 className="text-white font-semibold text-base">Upload Gambar Daun atau Buah</h2>
                <p className="text-white/40 text-xs">Dukung drag & drop · JPG, PNG, WEBP · Maks. 10MB</p>
              </div>
            </div>

            <ImageUploader
              onFileSelect={handleFileSelect}
              onReset={handleReset}
              preview={preview}
              isLoading={loading}
            />

            {/* Action button */}
            {file && !loading && (
              <div className="mt-5 flex flex-col sm:flex-row gap-3">
                <button
                  id="analyze-btn"
                  onClick={handleAnalyze}
                  className="
                    flex-1 flex items-center justify-center gap-2
                    px-6 py-3.5 rounded-xl font-semibold text-sm
                    bg-gradient-to-r from-emerald-500 to-teal-500
                    hover:from-emerald-400 hover:to-teal-400
                    text-white shadow-lg shadow-emerald-500/20
                    transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
                    border border-emerald-400/30
                  "
                >
                  <span className="text-base">🔍</span>
                  Analisis Sekarang
                </button>

                <button
                  id="reset-btn"
                  onClick={handleReset}
                  className="
                    px-6 py-3.5 rounded-xl font-medium text-sm
                    bg-white/5 hover:bg-white/10 text-white/60 hover:text-white/80
                    border border-white/10 hover:border-white/20
                    transition-all duration-200
                  "
                >
                  Reset
                </button>
              </div>
            )}
          </section>

          {/* Error State */}
          {error && (
            <div
              id="error-state"
              className="glass-card p-5 border-red-500/20 bg-red-500/5 animate-fade-in-up"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <p className="text-red-400 font-semibold text-sm">Analisis Gagal</p>
                  <p className="text-white/50 text-sm mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <section className="glass-card animate-fade-in-up">
              <LoadingState />
            </section>
          )}

          {/* Analysis Result */}
          {result && preview && !loading && (
            <section className="animate-fade-in-up">
              <AnalysisResultComponent result={result} preview={preview} />
            </section>
          )}
        </div>

        {/* ── Footer ── */}
        <footer className="border-t border-white/5 mt-16 py-8 text-center">
          <p className="text-white/25 text-xs">
            PhytoScan AI · Sistem Identifikasi Daun dan Buah Tanaman
          </p>
          <p className="text-white/15 text-xs mt-1">
            Powered by Gemini Vision API
          </p>
        </footer>

      </div>
    </main>
  );
}
