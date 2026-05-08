import { useState } from "react";
import { formatRp, tglLabel } from "../constants.js";

export default function TagihanPage({ tagihan, onAdd, onEdit, onDelete, onBayar }) {
  const [expand, setExpand] = useState(null);

  const totalTagihan  = tagihan.reduce((s, t) => s + +(t.total || 0), 0);
  const totalLunas    = tagihan.reduce((s, t) => s + +(t.sudah_bayar || 0), 0);
  const totalSisa     = totalTagihan - totalLunas;

  return (
    <div style={{ padding:"14px 14px 0" }}>
      {/* Header */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:14 }}>
        <div style={{ background:"#E91E8C", borderRadius:18, padding:"14px 14px" }}>
          <div style={{ fontSize:11, color:"#FFD6E7", marginBottom:3 }}>Total tagihan</div>
          <div style={{ fontSize:17, fontWeight:800, color:"#fff" }}>{formatRp(totalTagihan)}</div>
        </div>
        <div style={{ background:"#fff", borderRadius:18, padding:"14px 14px" }}>
          <div style={{ fontSize:11, color:"#F06292", marginBottom:3 }}>Sisa belum bayar</div>
          <div style={{ fontSize:17, fontWeight:800, color: totalSisa > 0 ? "#E91E8C" : "#10B981" }}>
            {formatRp(totalSisa)}
          </div>
        </div>
      </div>

      {/* Tombol tambah */}
      <button onClick={onAdd}
        style={{ width:"100%", background:"#fff", border:"2px dashed #FFD6E7",
          borderRadius:16, padding:"13px 0", color:"#E91E8C", fontWeight:700,
          fontSize:14, marginBottom:12 }}>
        + Tambah Tagihan
      </button>

      {tagihan.length === 0 && (
        <div style={{ textAlign:"center", color:"#F06292", fontSize:13, padding:"32px 0" }}>
          Belum ada tagihan 🧾<br/>
          <span style={{ fontSize:12 }}>Catat tagihan biar tidak lupa bayar!</span>
        </div>
      )}

      {tagihan.map(t => {
        const total     = +(t.total || 0);
        const sudahBayar= +(t.sudah_bayar || 0);
        const sisa      = total - sudahBayar;
        const pct       = total > 0 ? Math.min(100, (sudahBayar / total) * 100) : 0;
        const lunas     = sisa <= 0;

        return (
          <div key={t.id} style={{ background:"#fff", borderRadius:18, padding:"16px 14px",
            marginBottom:12, borderLeft:`4px solid ${lunas ? "#10B981" : "#E91E8C"}` }}>

            <div style={{ display:"flex", alignItems:"center", gap:12, cursor:"pointer" }}
              onClick={() => setExpand(expand === t.id ? null : t.id)}>
              <div style={{ width:44, height:44, borderRadius:14, flexShrink:0,
                background: lunas ? "#F0FFF4" : "#FFF0F5",
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:24 }}>
                {lunas ? "✅" : "🧾"}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontWeight:700, fontSize:14, color:"#880E4F",
                  whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                  {t.nama}
                </div>
                <div style={{ fontSize:12, color: lunas ? "#10B981" : "#F06292" }}>
                  {lunas ? "Lunas 🎉" : `Sisa ${formatRp(sisa)}`}
                  {t.jatuh_tempo && !lunas && (
                    <span style={{ marginLeft:8, color:"#F97316" }}>
                      · Jatuh tempo {tglLabel(t.jatuh_tempo)}
                    </span>
                  )}
                </div>
              </div>
              <div style={{ textAlign:"right", flexShrink:0 }}>
                <div style={{ fontSize:14, fontWeight:800, color:"#880E4F" }}>{formatRp(total)}</div>
                <div style={{ fontSize:10, color:"#F06292" }}>{expand===t.id?"▲":"▼"}</div>
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ height:8, background:"#FFF0F5", borderRadius:5, marginTop:12 }}>
              <div style={{ height:8, borderRadius:5,
                background: lunas ? "#10B981" : "#E91E8C",
                width:`${pct}%`, transition:"width 0.6s ease" }} />
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:"#F06292", marginTop:4 }}>
              <span>Sudah bayar {formatRp(sudahBayar)}</span>
              <span>{pct.toFixed(0)}%</span>
            </div>

            {expand === t.id && (
              <div>
                {t.keterangan && (
                  <div style={{ fontSize:12, color:"#F06292", marginTop:10, padding:"8px 10px",
                    background:"#FFF0F5", borderRadius:10 }}>
                    📝 {t.keterangan}
                  </div>
                )}

                <div style={{ display:"flex", gap:8, marginTop:12 }}>
                  {!lunas && (
                    <button onClick={() => onBayar(t.id)}
                      style={{ flex:1, padding:"9px 0", borderRadius:12, background:"#E91E8C",
                        color:"#fff", border:"none", fontWeight:700, fontSize:12 }}>
                      💳 Catat Bayar
                    </button>
                  )}
                  <button onClick={() => onEdit(t)}
                    style={{ padding:"9px 12px", borderRadius:12, background:"#FFF0F5",
                      color:"#E91E8C", border:"1px solid #FFD6E7", fontSize:13 }}>✏️</button>
                  <button onClick={() => { if (window.confirm("Hapus tagihan ini?")) onDelete(t.id); }}
                    style={{ padding:"9px 12px", borderRadius:12, background:"#FFF0F5",
                      color:"#aaa", border:"1px solid #FFD6E7", fontSize:13 }}>🗑</button>
                </div>

                {/* Riwayat pembayaran */}
                {(t.riwayat || []).length > 0 && (
                  <div style={{ marginTop:14 }}>
                    <div style={{ fontSize:12, fontWeight:700, color:"#880E4F", marginBottom:8 }}>
                      Riwayat Pembayaran
                    </div>
                    {[...t.riwayat].reverse().map(r => (
                      <div key={r.id} style={{ display:"flex", justifyContent:"space-between",
                        fontSize:12, padding:"6px 0", borderBottom:"1px solid #FFF0F5" }}>
                        <div>
                          <span style={{ color:"#880E4F", fontWeight:600 }}>{r.catatan || "Pembayaran"}</span>
                          <span style={{ color:"#F06292", marginLeft:6 }}>{tglLabel(r.tgl)}</span>
                        </div>
                        <span style={{ fontWeight:700, color:"#10B981" }}>+{formatRp(r.nominal)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
