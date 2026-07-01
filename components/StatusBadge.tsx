import { clsx } from "clsx";

interface StatusBadgeProps {
  status: "Sehat" | "Sakit";
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const isSehat = status === "Sehat";

  return (
    <div
      className={clsx(
        "inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm",
        "border backdrop-blur-sm relative overflow-hidden",
        isSehat
          ? "bg-emerald-500/20 border-emerald-400/40 text-emerald-300"
          : "bg-red-500/20 border-red-400/40 text-red-300",
        className
      )}
    >
      {/* Pulse ring */}
      <div
        className={clsx(
          "relative flex items-center justify-center w-4 h-4",
        )}
      >
        <span
          className={clsx(
            "absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping",
            isSehat ? "bg-emerald-400" : "bg-red-400"
          )}
        />
        <span
          className={clsx(
            "relative inline-flex w-2.5 h-2.5 rounded-full",
            isSehat ? "bg-emerald-400" : "bg-red-400"
          )}
        />
      </div>

      <span className="tracking-wide">
        {isSehat ? "✓ Sehat" : "✗ Terdeteksi Penyakit"}
      </span>
    </div>
  );
}
