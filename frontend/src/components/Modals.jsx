import { KATEGORI_PENGELUARAN, today } from "../constants.js";
import { useState } from "react";

// ── Modal wrapper ──
export function ModalWrap({ children, onClose, title }) {
  return (
    <div onClick={e => e.target === e.currentTarget && onClose()}
      style={{ position:"fixed", inset:0, background:"rgba(136,14,79,0.22)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:200 }}>
      <div style={{ background:"#fff", borderRadius:"24px 24px 0 0", padding:"20px 18px 40px", width:"100%", maxWidth:430, maxHeight:"92vh", overflowY:"auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
          <span style={{ fontWeight:800, fontSize:17, color:"#880E4F" }}>{title}</span>
          <button onClick={onClose}
            style={{ background:"#FFF0F5", border:"none", borderRadius:10, width:32, height:32, fontSize:16, color:"#E91E8C" }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── Field input ──
export function FieldInput({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div style={{ marginBottom:13 }}>
      <div style={{ fontSize:12, color:"#F06292", marginBottom:5, fontWeight:700 }}>{label}</div>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ width:"100%", border:"1.5px solid #FFD6E7", borderRadius:12, padding:"11px 13px",
          fontSize:14, outline:"none", boxSizing:"border-box", color:"#880E4F", background:"#fff" }} />
    </div>
  );
}

// ── Tombol utama pink ──
export function PinkButton({ children, onClick, style = {} }) {
  return (
    <button onClick={onClick}
      style={{ width:"100%", background:"#E91E8C", color:"#fff", border:"none", borderRadius:14,
        padding:"13px 0", fontSize:15, fontWeight:700, ...style }}>
      {children}
    </button>
  );
}

// ── Modal Tambah / Edit Transaksi ──
export function ModalTransaksi({ onClose, onSave, initial }) {
  const [jenis,      setJenis]      = useState(initial?.jenis || "keluar");
  const [nominal,    setNominal]    = useState(initial?.nominal?.toString() || "");
  const [kategori,   setKategori]   = useState(initial?.kategori || "makanan");
  const [keterangan, setKeterangan] = useState(initial?.keterangan || "");
  const [tgl,        setTgl]        = useState(initial?.tgl?.split("T")[0] || today());
  const [loading,    setLoading]    = useState(false);

  async function handleSave() {
    if (!nominal || isNaN(+nominal)) return alert("Nominal tidak valid");
    setLoading(true);
    await onSave({ jenis, nominal: +nominal, kategori: jenis === "keluar" ? kategori : "masuk", keterangan, tgl });
    setLoading(false);
  }

  return (
    <ModalWrap onClose={onClose} title={initial ? "Edit Transaksi" : "Catat Transaksi"}>
      <div style={{ display:"flex", gap:8, marginBottom:16 }}>
        {["keluar","masuk"].map(j => (
          <button key={j} onClick={() => setJenis(j)}
            style={{ flex:1, padding:"9px 0", borderRadius:12,
              border:`1.5px solid ${j==="keluar"?"#E91E8C":"#10B981"}`,
              background: jenis===j ? (j==="keluar"?"#E91E8C":"#10B981") : "#fff",
              color: jenis===j ? "#fff" : (j==="keluar"?"#E91E8C":"#10B981"),
              fontWeight:700, fontSize:13 }}>
            {j === "keluar" ? "⬇ Pengeluaran" : "⬆ Pemasukan"}
          </button>
        ))}
      </div>

      {jenis === "keluar" && (
        <div style={{ marginBottom:16 }}>
          <div style={{ fontSize:12, color:"#F06292", marginBottom:8, fontWeight:700 }}>Kategori</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:7 }}>
            {KATEGORI_PENGELUARAN.map(k => (
              <button key={k.id} onClick={() => setKategori(k.id)}
                style={{ padding:"8px 4px", borderRadius:12,
                  border:`1.5px solid ${kategori===k.id ? k.accent : "#FFD6E7"}`,
                  background: kategori===k.id ? k.color : "#fff",
                  display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
                <span style={{ fontSize:20 }}>{k.icon}</span>
                <span style={{ fontSize:9, color:k.accent, fontWeight:700, textAlign:"center", lineHeight:1.2 }}>{k.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <FieldInput label="Keterangan (opsional)" value={keterangan} onChange={setKeterangan} placeholder="Contoh: beli sayur di pasar" />
      <FieldInput label="Nominal (Rp)" value={nominal} onChange={setNominal} placeholder="Contoh: 50000" type="number" />
      <FieldInput label="Tanggal" value={tgl} onChange={setTgl} type="date" />
      <PinkButton onClick={handleSave}>{loading ? "Menyimpan..." : (initial ? "Simpan Perubahan ✨" : "Catat Sekarang ✨")}</PinkButton>
    </ModalWrap>
  );
}

// ── Modal Tabungan ──
export function ModalTabungan({ onClose, onSave, initial }) {
  const icons = ["🎯","🏠","✈️","📱","🎓","💒","🚗","🎁","💻","🌟","👗","🏥"];
  const [nama,       setNama]       = useState(initial?.nama || "");
  const [target,     setTarget]     = useState(initial?.target?.toString() || "");
  const [icon,       setIcon]       = useState(initial?.icon || "🎯");
  const [keterangan, setKeterangan] = useState(initial?.keterangan || "");
  const [loading,    setLoading]    = useState(false);

  async function handleSave() {
    if (!nama.trim()) return alert("Nama tabungan wajib diisi");
    if (!target || isNaN(+target)) return alert("Target tidak valid");
    setLoading(true);
    await onSave({ nama, target: +target, icon, keterangan });
    setLoading(false);
  }

  return (
    <ModalWrap onClose={onClose} title={initial ? "Edit Tabungan" : "Tambah Tabungan"}>
      <div style={{ marginBottom:14 }}>
        <div style={{ fontSize:12, color:"#F06292", marginBottom:8, fontWeight:700 }}>Pilih ikon</div>
        <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
          {icons.map(ic => (
            <button key={ic} onClick={() => setIcon(ic)}
              style={{ width:42, height:42, borderRadius:12,
                border:`1.5px solid ${icon===ic?"#E91E8C":"#FFD6E7"}`,
                background: icon===ic?"#FFF0F5":"#fff", fontSize:22 }}>
              {ic}
            </button>
          ))}
        </div>
      </div>
      <FieldInput label="Nama tabungan" value={nama} onChange={setNama} placeholder="Contoh: Beli HP baru" />
      <FieldInput label="Target (Rp)" value={target} onChange={setTarget} placeholder="Contoh: 2000000" type="number" />
      <FieldInput label="Keterangan (opsional)" value={keterangan} onChange={setKeterangan} placeholder="Catatan tambahan..." />
      <PinkButton onClick={handleSave}>{loading ? "Menyimpan..." : (initial ? "Simpan ✨" : "Buat Tabungan ✨")}</PinkButton>
    </ModalWrap>
  );
}

// ── Modal Setoran ──
export function ModalSetoran({ onClose, onSave }) {
  const [nominal, setNominal] = useState("");
  const [catatan, setCatatan] = useState("");
  const [tgl,     setTgl]     = useState(today());
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    if (!nominal || isNaN(+nominal)) return alert("Nominal tidak valid");
    setLoading(true);
    await onSave({ nominal: +nominal, catatan, tgl });
    setLoading(false);
  }

  return (
    <ModalWrap onClose={onClose} title="Tambah Setoran">
      <FieldInput label="Nominal setoran (Rp)" value={nominal} onChange={setNominal} placeholder="Contoh: 100000" type="number" />
      <FieldInput label="Catatan (opsional)" value={catatan} onChange={setCatatan} placeholder="Contoh: gaji minggu ini" />
      <FieldInput label="Tanggal" value={tgl} onChange={setTgl} type="date" />
      <PinkButton onClick={handleSave}>{loading ? "Menyimpan..." : "Tambah Setoran 🐷"}</PinkButton>
    </ModalWrap>
  );
}

// ── Modal Tagihan ──
export function ModalTagihan({ onClose, onSave, initial }) {
  const [nama,        setNama]        = useState(initial?.nama || "");
  const [total,       setTotal]       = useState(initial?.total?.toString() || "");
  const [keterangan,  setKeterangan]  = useState(initial?.keterangan || "");
  const [jatuhTempo,  setJatuhTempo]  = useState(initial?.jatuh_tempo?.split("T")[0] || "");
  const [loading,     setLoading]     = useState(false);

  async function handleSave() {
    if (!nama.trim()) return alert("Nama tagihan wajib diisi");
    if (!total || isNaN(+total)) return alert("Total tidak valid");
    setLoading(true);
    await onSave({ nama, total: +total, keterangan, jatuh_tempo: jatuhTempo || null });
    setLoading(false);
  }

  return (
    <ModalWrap onClose={onClose} title={initial ? "Edit Tagihan" : "Tambah Tagihan"}>
      <FieldInput label="Nama tagihan" value={nama} onChange={setNama} placeholder="Contoh: Cicilan kulkas" />
      <FieldInput label="Total tagihan (Rp)" value={total} onChange={setTotal} placeholder="Contoh: 1500000" type="number" />
      <FieldInput label="Jatuh tempo (opsional)" value={jatuhTempo} onChange={setJatuhTempo} type="date" />
      <FieldInput label="Keterangan (opsional)" value={keterangan} onChange={setKeterangan} placeholder="Catatan tambahan..." />
      <PinkButton onClick={handleSave}>{loading ? "Menyimpan..." : (initial ? "Simpan ✨" : "Tambah Tagihan ✨")}</PinkButton>
    </ModalWrap>
  );
}

// ── Modal Bayar Tagihan ──
export function ModalBayar({ onClose, onSave }) {
  const [nominal, setNominal] = useState("");
  const [catatan, setCatatan] = useState("");
  const [tgl,     setTgl]     = useState(today());
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    if (!nominal || isNaN(+nominal)) return alert("Nominal tidak valid");
    setLoading(true);
    await onSave({ nominal: +nominal, catatan, tgl });
    setLoading(false);
  }

  return (
    <ModalWrap onClose={onClose} title="Catat Pembayaran">
      <FieldInput label="Nominal bayar (Rp)" value={nominal} onChange={setNominal} placeholder="Contoh: 500000" type="number" />
      <FieldInput label="Catatan (opsional)" value={catatan} onChange={setCatatan} placeholder="Contoh: transfer BRI" />
      <FieldInput label="Tanggal" value={tgl} onChange={setTgl} type="date" />
      <PinkButton onClick={handleSave}>{loading ? "Menyimpan..." : "Catat Pembayaran 💳"}</PinkButton>
    </ModalWrap>
  );
}
