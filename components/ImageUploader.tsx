"use client";

import { useRef, useState, useCallback, DragEvent, ChangeEvent } from "react";
import Image from "next/image";

interface ImageUploaderProps {
  onFileSelect: (file: File, preview: string) => void;
  onReset: () => void;
  preview: string | null;
  isLoading: boolean;
}

export default function ImageUploader({
  onFileSelect,
  onReset,
  preview,
  isLoading,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) {
        alert("Hanya file gambar yang diperbolehkan.");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert("Ukuran file maksimum adalah 10MB.");
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      onFileSelect(file, previewUrl);
    },
    [onFileSelect]
  );

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleReset = () => {
    if (inputRef.current) inputRef.current.value = "";
    onReset();
  };

  return (
    <div className="w-full">
      {!preview ? (
        <div
          id="image-dropzone"
          onClick={() => inputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative flex flex-col items-center justify-center gap-4
            min-h-[280px] rounded-2xl border-2 border-dashed cursor-pointer
            transition-all duration-300 ease-in-out
            ${
              isDragging
                ? "border-emerald-400 bg-emerald-500/10 scale-[1.01]"
                : "border-white/20 bg-white/5 hover:border-emerald-400/50 hover:bg-white/8"
            }
          `}
        >
          {/* Glow effect when dragging */}
          {isDragging && (
            <div className="absolute inset-0 rounded-2xl bg-emerald-400/5 animate-pulse" />
          )}

          <div className="relative flex flex-col items-center gap-3 pointer-events-none select-none">
            {/* Leaf icon */}
            <div
              className={`
              w-16 h-16 rounded-2xl flex items-center justify-center text-3xl
              transition-all duration-300
              ${isDragging ? "bg-emerald-500/20 scale-110" : "bg-white/10"}
            `}
            >
              🌿
            </div>

            <div className="text-center">
              <p className="text-white/90 font-semibold text-base">
                {isDragging ? "Lepaskan gambar di sini" : "Upload Gambar Daun"}
              </p>
              <p className="text-white/50 text-sm mt-1">
                Drag & drop atau klik untuk memilih file
              </p>
              <p className="text-white/30 text-xs mt-2">
                Format: JPG, PNG, WEBP · Maks. 10MB
              </p>
            </div>

            <div className="flex gap-2 mt-1">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs border border-emerald-500/30">
                Semua Jenis Daun
              </span>
            </div>
          </div>

          <input
            ref={inputRef}
            id="file-input"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleInputChange}
          />
        </div>
      ) : (
        <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black/20 group">
          <div className="relative w-full h-72">
            <Image
              src={preview}
              alt="Preview daun yang diupload"
              fill
              className="object-contain"
            />
          </div>

          {/* Overlay on hover */}
          {!isLoading && (
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3">
              <button
                id="change-image-btn"
                onClick={() => inputRef.current?.click()}
                className="px-4 py-2 rounded-xl bg-white/20 backdrop-blur-sm text-white text-sm font-medium hover:bg-white/30 transition-colors border border-white/20"
              >
                Ganti Gambar
              </button>
              <button
                id="remove-image-btn"
                onClick={handleReset}
                className="px-4 py-2 rounded-xl bg-red-500/30 backdrop-blur-sm text-red-200 text-sm font-medium hover:bg-red-500/50 transition-colors border border-red-500/30"
              >
                Hapus
              </button>
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
            <p className="text-white/70 text-xs text-center">
              Gambar siap dianalisis
            </p>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleInputChange}
          />
        </div>
      )}
    </div>
  );
}
