export const KATEGORI_PENGELUARAN = [
  { id: "makanan",      label: "Makanan",        icon: "🍚", color: "#FFF0F5", accent: "#E91E8C" },
  { id: "jajan_anak",   label: "Jajan Anak",     icon: "🍭", color: "#FFF8E1", accent: "#F59E0B" },
  { id: "kesehatan",    label: "Kesehatan",      icon: "💊", color: "#F0FFF4", accent: "#10B981" },
  { id: "transportasi", label: "Transportasi",   icon: "🚗", color: "#EFF6FF", accent: "#3B82F6" },
  { id: "jajan",        label: "Jajan",          icon: "☕", color: "#FDF4FF", accent: "#A855F7" },
  { id: "belanja",      label: "Belanja",        icon: "🛍️", color: "#FFF0F5", accent: "#EC4899" },
  { id: "hiburan",      label: "Hiburan",        icon: "🎬", color: "#FFF7ED", accent: "#F97316" },
  { id: "bahan_bulanan",label: "Bahan Bulanan",  icon: "🛒", color: "#F0FFF4", accent: "#059669" },
];

export const BULAN = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

export function formatRp(n) {
  return "Rp " + Math.round(n || 0).toLocaleString("id-ID");
}

export function today() {
  return new Date().toISOString().split("T")[0];
}

export function tglLabel(tgl) {
  if (!tgl) return "-";
  const d = new Date(tgl);
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}
