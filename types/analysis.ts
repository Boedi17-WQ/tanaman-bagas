export interface RincianVisual {
  warna: string;
  tekstur: string;
  anomali: string;
}

export interface IdentifikasiPenyakit {
  nama_penyakit: string;
  tingkat_keparahan: "Ringan" | "Sedang" | "Parah" | "Tidak Ada";
  deskripsi: string;
}

export interface IdentifikasiKematangan {
  status_kematangan: "Mentah" | "Setengah Matang" | "Matang" | "Terlalu Matang" | "Busuk" | "Bukan Buah";
  deskripsi: string;
}

export interface AnalysisResult {
  objek_terdeteksi: "Daun" | "Buah" | "Lainnya" | "Tidak Dikenali";
  tanaman: string;
  status: "Sehat" | "Sakit" | "Normal";
  rincian_visual: RincianVisual;
  identifikasi_penyakit: IdentifikasiPenyakit;
  identifikasi_kematangan: IdentifikasiKematangan;
  tips_perawatan: string[];
  rekomendasi_solusi: string[];
}

export interface AnalysisError {
  error: string;
  detail?: string;
}
