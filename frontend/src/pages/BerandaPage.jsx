import { useState, useMemo } from "react";
import { KATEGORI_PENGELUARAN, BULAN, formatRp, tglLabel } from "../constants.js";

export default function BerandaPage({ transaksi, filterBulan, filterTahun, setFilterBulan, setFilterTahun, onEdit, onDelete }) {
  const [expand, setExpand] = useState(null);

  const totalMasuk  = transaksi.filter(t => t.jenis === "masuk").reduce((s, t) => s + +t.nominal, 0);
  const totalKeluar = transaksi.filter(t => t.jenis === "keluar").reduce((s, t) => s + +t.nominal, 0);
  const saldo       = totalMasuk - totalKeluar;

  return (
    <div style={{ padding:"14px 14px 0" }}>
      {/* Filter */}
      <div style={{ display:"flex", gap:8, marginBottom:14 }}>
        <select value={filterBulan} onChange={e => setFilterBulan(+e.target.value)}
          style={{ flex:1, border:"1.5px solid #FFD6E7", borderRadius:12, padding:"9px 10px", fontSize:13, color:"#880E4F", background:"#fff" }}>
          {BULAN.map((b,i) => <option key={i} value={i+1}>{b}</option>)}
        </select>
        <select value={filterTahun} onChange={e => setFilterTahun(+e.target.value)}
          style={{ flex:1, border:"1.5px solid #FFD6E7", borderRadius:12, padding:"9px 10px", fontSize:13, color:"#880E4F", background:"#fff" }}>
          {[2024,2025,2026].map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      {/* Saldo card */}
      <div style={{ background:"#E91E8C", borderRadius:22, padding:"20px 20px 18px", marginBottom:14 }}>
        <div style={{ fontSize:12, color:"#FFD6E7", marginBottom:4 }}>Saldo bersih bulan ini</div>
        <div style={{ fontSize:30, fontWeight:800, color:"#fff", marginBottom:14 }}>{formatRp(saldo)}</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          <div style={{ background:"rgba(255,255,255,0.18)", borderRadius:14, padding:"10px 12px" }}>
            <div style={{ fontSize:11, color:"#FFD6E7" }}>⬆ Pemasukan</div>
            <div style={{ fontSize:15, fontWeight:700, color:"#fff" }}>{formatRp(totalMasuk)}</div>
          </div>
          <div style={{ background:"rgba(255,255,255,0.18)", borderRadius:14, padding:"10px 12px" }}>
            <div style={{ fontSize:11, color:"#FFD6E7" }}>⬇ Pengeluaran</div>
            <div style={{ fontSize:15, fontWeight:700, color:"#fff" }}>{formatRp(totalKeluar)}</div>
          </div>
        </div>
      </div>

      {/* List transaksi */}
      <div style={{ background:"#fff", borderRadius:18, padding:"14px 14px" }}>
        <div style={{ fontWeight:700, color:"#880E4F", marginBottom:12, fontSize:14 }}>Riwayat Transaksi</div>

        {transaksi.length === 0 && (
          <div style={{ textAlign:"center", color:"#F06292", fontSize:13, padding:"24px 0" }}>
            Belum ada transaksi bulan ini 🌸<br/>
            <span style={{ fontSize:12 }}>Tekan ✏️ di bawah untuk mulai mencatat</span>
          </div>
        )}

        {transaksi.map(t => {
          const kat = KATEGORI_PENGELUARAN.find(k => k.id === t.kategori);
          return (
            <div key={t.id} style={{ borderBottom:"1px solid #FFF0F5", paddingBottom:10, marginBottom:10 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer" }}
                onClick={() => setExpand(expand === t.id ? null : t.id)}>
                <div style={{ width:40, height:40, borderRadius:13, flexShrink:0,
                  background: kat?.color || "#FFF0F5", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>
                  {t.jenis === "masuk" ? "💰" : (kat?.icon || "💸")}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:700, fontSize:13, color:"#880E4F",
                    whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                    {t.keterangan || kat?.label || (t.jenis === "masuk" ? "Pemasukan" : "Pengeluaran")}
                  </div>
                  <div style={{ fontSize:11, color:"#F06292" }}>
                    {tglLabel(t.tgl)}{kat ? " · " + kat.label : ""}
                  </div>
                </div>
                <div style={{ fontWeight:700, fontSize:14, color: t.jenis==="masuk" ? "#10B981" : "#E91E8C", flexShrink:0 }}>
                  {t.jenis === "masuk" ? "+" : "-"}{formatRp(t.nominal)}
                </div>
              </div>

              {expand === t.id && (
                <div style={{ display:"flex", gap:8, marginTop:8, paddingLeft:50 }}>
                  <button onClick={() => onEdit(t)}
                    style={{ fontSize:12, padding:"5px 14px", borderRadius:9, border:"1px solid #FFD6E7",
                      background:"#FFF0F5", color:"#E91E8C" }}>✏️ Edit</button>
                  <button onClick={() => { if (window.confirm("Hapus transaksi ini?")) onDelete(t.id); }}
                    style={{ fontSize:12, padding:"5px 14px", borderRadius:9, border:"1px solid #FFD6E7",
                      background:"#FFF0F5", color:"#aaa" }}>🗑 Hapus</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
