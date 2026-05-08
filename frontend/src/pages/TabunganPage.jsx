import { useState } from "react";
import { formatRp, tglLabel } from "../constants.js";

export default function TabunganPage({ tabungan, onAdd, onEdit, onDelete, onSetoran }) {
  const [expand, setExpand] = useState(null);
  const total = tabungan.reduce((s, t) => s + +(t.terkumpul || 0), 0);

  return (
    <div style={{ padding:"14px 14px 0" }}>
      {/* Header card */}
      <div style={{ background:"#E91E8C", borderRadius:22, padding:"18px 20px",
        marginBottom:14, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <div style={{ fontSize:12, color:"#FFD6E7", marginBottom:4 }}>Total semua tabungan</div>
          <div style={{ fontSize:26, fontWeight:800, color:"#fff" }}>{formatRp(total)}</div>
          <div style={{ fontSize:12, color:"#FFD6E7", marginTop:4 }}>{tabungan.length} tujuan tabungan</div>
        </div>
        <span style={{ fontSize:48 }}>🐷</span>
      </div>

      {/* Tombol tambah */}
      <button onClick={onAdd}
        style={{ width:"100%", background:"#fff", border:"2px dashed #FFD6E7",
          borderRadius:16, padding:"13px 0", color:"#E91E8C", fontWeight:700,
          fontSize:14, marginBottom:12 }}>
        + Tambah Tujuan Tabungan
      </button>

      {tabungan.length === 0 && (
        <div style={{ textAlign:"center", color:"#F06292", fontSize:13, padding:"32px 0" }}>
          Belum ada tabungan 🐷<br/>
          <span style={{ fontSize:12 }}>Yuk mulai nabung sekarang!</span>
        </div>
      )}

      {tabungan.map(t => {
        const terkumpul = +(t.terkumpul || 0);
        const target    = +(t.target || 1);
        const pct       = Math.min(100, (terkumpul / target) * 100);
        const lunas     = terkumpul >= target;

        return (
          <div key={t.id} style={{ background:"#fff", borderRadius:18, padding:"16px 14px", marginBottom:12 }}>
            <div style={{ display:"flex", alignItems:"center", gap:12, cursor:"pointer" }}
              onClick={() => setExpand(expand === t.id ? null : t.id)}>
              <div style={{ width:44, height:44, background:"#FFF0F5", borderRadius:14,
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0 }}>
                {t.icon || "🎯"}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontWeight:700, fontSize:14, color:"#880E4F",
                  whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                  {t.nama}
                </div>
                <div style={{ fontSize:12, color: lunas ? "#10B981" : "#F06292" }}>
                  {formatRp(terkumpul)} / {formatRp(target)}
                  {lunas && " 🎉"}
                </div>
              </div>
              <div style={{ textAlign:"right", flexShrink:0 }}>
                <div style={{ fontSize:16, fontWeight:800, color: lunas ? "#10B981" : "#E91E8C" }}>
                  {pct.toFixed(0)}%
                </div>
                <div style={{ fontSize:10, color:"#F06292" }}>{expand===t.id?"▲":"▼"}</div>
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ height:10, background:"#FFF0F5", borderRadius:5, marginTop:12 }}>
              <div style={{ height:10, borderRadius:5, transition:"width 0.6s ease",
                background: lunas ? "#10B981" : "#E91E8C",
                width:`${pct}%` }} />
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:"#F06292", marginTop:4 }}>
              <span>Terkumpul {formatRp(terkumpul)}</span>
              <span>Sisa {formatRp(Math.max(0, target - terkumpul))}</span>
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
                  <button onClick={() => onSetoran(t.id)}
                    style={{ flex:1, padding:"9px 0", borderRadius:12, background:"#E91E8C",
                      color:"#fff", border:"none", fontWeight:700, fontSize:12 }}>
                    💰 Tambah Setoran
                  </button>
                  <button onClick={() => onEdit(t)}
                    style={{ padding:"9px 12px", borderRadius:12, background:"#FFF0F5",
                      color:"#E91E8C", border:"1px solid #FFD6E7", fontSize:13 }}>✏️</button>
                  <button onClick={() => { if (window.confirm("Hapus tabungan ini?")) onDelete(t.id); }}
                    style={{ padding:"9px 12px", borderRadius:12, background:"#FFF0F5",
                      color:"#aaa", border:"1px solid #FFD6E7", fontSize:13 }}>🗑</button>
                </div>

                {/* Riwayat setoran */}
                {(t.riwayat || []).length > 0 && (
                  <div style={{ marginTop:14 }}>
                    <div style={{ fontSize:12, fontWeight:700, color:"#880E4F", marginBottom:8 }}>
                      Riwayat Setoran
                    </div>
                    {[...t.riwayat].reverse().map(r => (
                      <div key={r.id} style={{ display:"flex", justifyContent:"space-between",
                        fontSize:12, padding:"6px 0", borderBottom:"1px solid #FFF0F5" }}>
                        <div>
                          <span style={{ color:"#880E4F", fontWeight:600 }}>{r.catatan || "Setoran"}</span>
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
