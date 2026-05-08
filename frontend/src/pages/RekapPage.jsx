import { useState, useMemo } from "react";
import { KATEGORI_PENGELUARAN, BULAN, formatRp, tglLabel } from "../constants.js";

export default function RekapPage({ transaksi, allTransaksi, filterBulan, filterTahun, setFilterBulan, setFilterTahun }) {
  const [mode, setMode] = useState("bulanan");

  const totalMasuk  = transaksi.filter(t => t.jenis === "masuk").reduce((s, t) => s + +t.nominal, 0);
  const totalKeluar = transaksi.filter(t => t.jenis === "keluar").reduce((s, t) => s + +t.nominal, 0);

  // Per kategori
  const perKat = useMemo(() => {
    const map = {};
    transaksi.filter(t => t.jenis === "keluar").forEach(t => {
      map[t.kategori] = (map[t.kategori] || 0) + +t.nominal;
    });
    return map;
  }, [transaksi]);

  const sorted = KATEGORI_PENGELUARAN
    .map(k => ({ ...k, total: perKat[k.id] || 0 }))
    .filter(k => k.total > 0)
    .sort((a, b) => b.total - a.total);

  // Harian 7 hari terakhir
  const harian = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      const label = d.toLocaleDateString("id-ID", { weekday: "short" });
      const keluar = allTransaksi.filter(t => t.tgl?.split("T")[0] === key && t.jenis === "keluar").reduce((s, t) => s + +t.nominal, 0);
      const masuk  = allTransaksi.filter(t => t.tgl?.split("T")[0] === key && t.jenis === "masuk").reduce((s, t) => s + +t.nominal, 0);
      days.push({ label, keluar, masuk });
    }
    return days;
  }, [allTransaksi]);

  const maxHarian = Math.max(...harian.map(h => Math.max(h.keluar, h.masuk)), 1);

  return (
    <div style={{ padding:"14px 14px 0" }}>
      {/* Filter */}
      <div style={{ display:"flex", gap:8, marginBottom:12 }}>
        <select value={filterBulan} onChange={e => setFilterBulan(+e.target.value)}
          style={{ flex:1, border:"1.5px solid #FFD6E7", borderRadius:12, padding:"9px 10px", fontSize:13, color:"#880E4F", background:"#fff" }}>
          {BULAN.map((b,i) => <option key={i} value={i+1}>{b}</option>)}
        </select>
        <select value={filterTahun} onChange={e => setFilterTahun(+e.target.value)}
          style={{ flex:1, border:"1.5px solid #FFD6E7", borderRadius:12, padding:"9px 10px", fontSize:13, color:"#880E4F", background:"#fff" }}>
          {[2024,2025,2026].map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      {/* Toggle mode */}
      <div style={{ display:"flex", gap:8, marginBottom:14 }}>
        {[["harian","📅 Harian"],["bulanan","📆 Bulanan"]].map(([id, label]) => (
          <button key={id} onClick={() => setMode(id)}
            style={{ flex:1, padding:"9px 0", borderRadius:12,
              border:"1.5px solid #FFD6E7",
              background: mode===id ? "#E91E8C" : "#fff",
              color: mode===id ? "#fff" : "#E91E8C",
              fontWeight:700, fontSize:13 }}>
            {label}
          </button>
        ))}
      </div>

      {/* Summary cards */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:14 }}>
        <div style={{ background:"#fff", borderRadius:16, padding:"14px 14px" }}>
          <div style={{ fontSize:11, color:"#F06292", marginBottom:4 }}>⬆ Total Masuk</div>
          <div style={{ fontSize:16, fontWeight:800, color:"#10B981" }}>{formatRp(totalMasuk)}</div>
        </div>
        <div style={{ background:"#fff", borderRadius:16, padding:"14px 14px" }}>
          <div style={{ fontSize:11, color:"#F06292", marginBottom:4 }}>⬇ Total Keluar</div>
          <div style={{ fontSize:16, fontWeight:800, color:"#E91E8C" }}>{formatRp(totalKeluar)}</div>
        </div>
      </div>

      {/* HARIAN - bar chart */}
      {mode === "harian" && (
        <div style={{ background:"#fff", borderRadius:18, padding:"16px 14px", marginBottom:14 }}>
          <div style={{ fontWeight:700, color:"#880E4F", fontSize:14, marginBottom:14 }}>7 Hari Terakhir</div>
          <div style={{ display:"flex", alignItems:"flex-end", gap:6, height:130 }}>
            {harian.map((h, i) => (
              <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
                <div style={{ width:"100%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"flex-end", height:100, gap:3 }}>
                  {/* masuk bar */}
                  <div style={{ width:"45%", height: Math.max(3, (h.masuk / maxHarian) * 95),
                    background:"#10B981", borderRadius:"4px 4px 0 0", opacity:0.85 }} />
                </div>
                <div style={{ width:"100%", display:"flex", flexDirection:"column", alignItems:"center", position:"relative", marginTop:-103 }}>
                  {/* keluar bar */}
                  <div style={{ width:"45%", alignSelf:"flex-end", height: Math.max(3, (h.keluar / maxHarian) * 95),
                    background:"#E91E8C", borderRadius:"4px 4px 0 0", opacity:0.85, marginLeft:"55%" }} />
                </div>
                <div style={{ fontSize:10, color:"#F06292", marginTop:4 }}>{h.label}</div>
              </div>
            ))}
          </div>
          <div style={{ display:"flex", gap:14, marginTop:10, fontSize:11, color:"#888" }}>
            <span style={{ display:"flex", alignItems:"center", gap:5 }}>
              <span style={{ width:10, height:10, background:"#10B981", borderRadius:2, display:"inline-block" }}/> Masuk
            </span>
            <span style={{ display:"flex", alignItems:"center", gap:5 }}>
              <span style={{ width:10, height:10, background:"#E91E8C", borderRadius:2, display:"inline-block" }}/> Keluar
            </span>
          </div>
        </div>
      )}

      {/* BULANAN - donut + bar per kategori */}
      {mode === "bulanan" && (
        <>
          {/* Donut chart sederhana pakai SVG */}
          {sorted.length > 0 && (
            <div style={{ background:"#fff", borderRadius:18, padding:"16px 14px", marginBottom:14 }}>
              <div style={{ fontWeight:700, color:"#880E4F", fontSize:14, marginBottom:14 }}>Komposisi Pengeluaran</div>
              <DonutChart data={sorted} total={totalKeluar} />
            </div>
          )}

          <div style={{ background:"#fff", borderRadius:18, padding:"16px 14px", marginBottom:14 }}>
            <div style={{ fontWeight:700, color:"#880E4F", fontSize:14, marginBottom:14 }}>Pengeluaran per Kategori</div>
            {sorted.length === 0 && (
              <div style={{ textAlign:"center", color:"#F06292", fontSize:13, padding:"16px 0" }}>
                Belum ada pengeluaran bulan ini 🌸
              </div>
            )}
            {sorted.map((k, i) => (
              <div key={k.id} style={{ marginBottom:14 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                  <span style={{ fontSize:13, color:"#880E4F", display:"flex", alignItems:"center", gap:6 }}>
                    <span style={{ fontSize:18 }}>{k.icon}</span> {k.label}
                  </span>
                  <span style={{ fontSize:13, fontWeight:700, color:k.accent }}>{formatRp(k.total)}</span>
                </div>
                <div style={{ height:9, background:"#FFF0F5", borderRadius:5 }}>
                  <div style={{ height:9, background:k.accent, borderRadius:5,
                    width:`${Math.min(100,(k.total/totalKeluar)*100)}%`,
                    transition:"width 0.6s ease" }} />
                </div>
                <div style={{ fontSize:11, color:"#F06292", textAlign:"right", marginTop:2 }}>
                  {totalKeluar > 0 ? ((k.total/totalKeluar)*100).toFixed(1) : 0}%
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Detail list */}
      <div style={{ background:"#fff", borderRadius:18, padding:"16px 14px", marginBottom:14 }}>
        <div style={{ fontWeight:700, color:"#880E4F", fontSize:14, marginBottom:12 }}>Semua Transaksi</div>
        {transaksi.length === 0 && (
          <div style={{ textAlign:"center", color:"#F06292", fontSize:13, padding:"12px 0" }}>Kosong 🌸</div>
        )}
        {transaksi.map(t => {
          const kat = KATEGORI_PENGELUARAN.find(k => k.id === t.kategori);
          return (
            <div key={t.id} style={{ display:"flex", alignItems:"center", gap:10,
              borderBottom:"1px solid #FFF0F5", paddingBottom:8, marginBottom:8 }}>
              <span style={{ fontSize:20 }}>{t.jenis==="masuk" ? "💰" : (kat?.icon || "💸")}</span>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:12, fontWeight:700, color:"#880E4F",
                  whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                  {t.keterangan || kat?.label || "-"}
                </div>
                <div style={{ fontSize:11, color:"#F06292" }}>{tglLabel(t.tgl)}</div>
              </div>
              <div style={{ fontSize:13, fontWeight:700, color: t.jenis==="masuk"?"#10B981":"#E91E8C", flexShrink:0 }}>
                {t.jenis==="masuk"?"+":"-"}{formatRp(t.nominal)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Donut chart SVG ──
function DonutChart({ data, total }) {
  const size = 160;
  const cx = size / 2, cy = size / 2, r = 58, stroke = 22;
  let cumAngle = -Math.PI / 2;

  const slices = data.slice(0, 5).map(k => {
    const pct   = k.total / total;
    const angle = pct * 2 * Math.PI;
    const x1 = cx + r * Math.cos(cumAngle);
    const y1 = cy + r * Math.sin(cumAngle);
    cumAngle += angle;
    const x2 = cx + r * Math.cos(cumAngle);
    const y2 = cy + r * Math.sin(cumAngle);
    const large = angle > Math.PI ? 1 : 0;
    return { ...k, x1, y1, x2, y2, large, pct };
  });

  return (
    <div style={{ display:"flex", alignItems:"center", gap:16 }}>
      <svg width={size} height={size} style={{ flexShrink:0 }}>
        {slices.map((s, i) => (
          <path key={i}
            d={`M ${cx} ${cy} L ${s.x1} ${s.y1} A ${r} ${r} 0 ${s.large} 1 ${s.x2} ${s.y2} Z`}
            fill={s.accent} opacity={0.85} />
        ))}
        <circle cx={cx} cy={cy} r={r - stroke} fill="#fff" />
        <text x={cx} y={cy - 7} textAnchor="middle" fontSize={10} fill="#F06292">Total</text>
        <text x={cx} y={cy + 9} textAnchor="middle" fontSize={11} fontWeight="bold" fill="#880E4F">
          {formatRp(total).replace("Rp ","Rp\n")}
        </text>
      </svg>
      <div style={{ flex:1 }}>
        {slices.map(s => (
          <div key={s.id} style={{ display:"flex", alignItems:"center", gap:7, marginBottom:6 }}>
            <div style={{ width:10, height:10, borderRadius:3, background:s.accent, flexShrink:0 }} />
            <div style={{ flex:1 }}>
              <div style={{ fontSize:11, color:"#880E4F", fontWeight:700 }}>{s.icon} {s.label}</div>
              <div style={{ fontSize:10, color:"#F06292" }}>{(s.pct*100).toFixed(1)}%</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
