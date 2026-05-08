import { useState, useEffect, useCallback } from "react";
import LoginPage   from "./pages/LoginPage.jsx";
import BerandaPage from "./pages/BerandaPage.jsx";
import RekapPage   from "./pages/RekapPage.jsx";
import TabunganPage from "./pages/TabunganPage.jsx";
import TagihanPage  from "./pages/TagihanPage.jsx";
import {
  ModalTransaksi, ModalTabungan, ModalSetoran,
  ModalTagihan, ModalBayar
} from "./components/Modals.jsx";
import * as api from "./api.js";

export default function App() {
  const [user,         setUser]         = useState(null);
  const [tab,          setTab]          = useState("beranda");
  const [modal,        setModal]        = useState(null);
  const [transaksi,    setTransaksi]    = useState([]);
  const [allTransaksi, setAllTransaksi] = useState([]);
  const [tabungan,     setTabungan]     = useState([]);
  const [tagihan,      setTagihan]      = useState([]);
  const [filterBulan,  setFilterBulan]  = useState(new Date().getMonth() + 1);
  const [filterTahun,  setFilterTahun]  = useState(new Date().getFullYear());
  const [loading,      setLoading]      = useState(false);

  // ── Ambil data dari BE ──
  const fetchTransaksi = useCallback(async (uid, bln, thn) => {
    try {
      const res = await api.getTransaksi(uid, bln, thn);
      setTransaksi(res.data);
    } catch (e) { console.error(e); }
  }, []);

  const fetchAllTransaksi = useCallback(async (uid) => {
    try {
      const res = await api.getTransaksi(uid);
      setAllTransaksi(res.data);
    } catch (e) { console.error(e); }
  }, []);

  const fetchTabungan = useCallback(async (uid) => {
    try {
      const res = await api.getTabungan(uid);
      setTabungan(res.data);
    } catch (e) { console.error(e); }
  }, []);

  const fetchTagihan = useCallback(async (uid) => {
    try {
      const res = await api.getTagihan(uid);
      setTagihan(res.data);
    } catch (e) { console.error(e); }
  }, []);

  // ── Saat login ──
  function handleLogin(userData) {
    setUser(userData);
    localStorage.setItem("dompet_ibu_user", JSON.stringify(userData));
    fetchTransaksi(userData.id, filterBulan, filterTahun);
    fetchAllTransaksi(userData.id);
    fetchTabungan(userData.id);
    fetchTagihan(userData.id);
  }

  // ── Auto-login dari localStorage ──
  useEffect(() => {
    const saved = localStorage.getItem("dompet_ibu_user");
    if (saved) {
      const u = JSON.parse(saved);
      setUser(u);
      fetchTransaksi(u.id, filterBulan, filterTahun);
      fetchAllTransaksi(u.id);
      fetchTabungan(u.id);
      fetchTagihan(u.id);
    }
  }, []);

  // ── Re-fetch saat filter berubah ──
  useEffect(() => {
    if (user) fetchTransaksi(user.id, filterBulan, filterTahun);
  }, [filterBulan, filterTahun, user]);

  function handleLogout() {
    localStorage.removeItem("dompet_ibu_user");
    setUser(null);
    setTransaksi([]);
    setAllTransaksi([]);
    setTabungan([]);
    setTagihan([]);
  }

  if (!user) return <LoginPage onLogin={handleLogin} />;

  // ── CRUD Transaksi ──
  async function handleAddTransaksi(data) {
    await api.addTransaksi({ ...data, user_id: user.id });
    fetchTransaksi(user.id, filterBulan, filterTahun);
    fetchAllTransaksi(user.id);
    setModal(null);
  }
  async function handleEditTransaksi(id, data) {
    await api.editTransaksi(id, data);
    fetchTransaksi(user.id, filterBulan, filterTahun);
    fetchAllTransaksi(user.id);
    setModal(null);
  }
  async function handleDeleteTransaksi(id) {
    await api.deleteTransaksi(id);
    fetchTransaksi(user.id, filterBulan, filterTahun);
    fetchAllTransaksi(user.id);
  }

  // ── CRUD Tabungan ──
  async function handleAddTabungan(data) {
    await api.addTabungan({ ...data, user_id: user.id });
    fetchTabungan(user.id);
    setModal(null);
  }
  async function handleEditTabungan(id, data) {
    await api.editTabungan(id, data);
    fetchTabungan(user.id);
    setModal(null);
  }
  async function handleDeleteTabungan(id) {
    await api.deleteTabungan(id);
    fetchTabungan(user.id);
  }
  async function handleSetoran(id, data) {
    await api.addSetoran(id, data);
    fetchTabungan(user.id);
    setModal(null);
  }

  // ── CRUD Tagihan ──
  async function handleAddTagihan(data) {
    await api.addTagihan({ ...data, user_id: user.id });
    fetchTagihan(user.id);
    setModal(null);
  }
  async function handleEditTagihan(id, data) {
    await api.editTagihan(id, data);
    fetchTagihan(user.id);
    setModal(null);
  }
  async function handleDeleteTagihan(id) {
    await api.deleteTagihan(id);
    fetchTagihan(user.id);
  }
  async function handleBayar(id, data) {
    await api.bayarTagihan(id, data);
    fetchTagihan(user.id);
    setModal(null);
  }

  const NAV = [
    { id:"beranda",  icon:"🏠",  label:"Beranda" },
    { id:"rekap",    icon:"📊",  label:"Rekap"   },
    { id:"catat",    icon:null,  label:""        },
    { id:"tabungan", icon:"🐷",  label:"Tabungan"},
    { id:"tagihan",  icon:"🧾",  label:"Tagihan" },
  ];

  return (
    <div style={{ maxWidth:430, margin:"0 auto", minHeight:"100vh", background:"#FFF0F5", position:"relative" }}>

      {/* ── Header ── */}
      <div style={{ background:"#fff", borderBottom:"1px solid #FFD6E7",
        padding:"13px 18px 10px", display:"flex", alignItems:"center", justifyContent:"space-between",
        position:"sticky", top:0, zIndex:50 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:36, height:36, background:"#E91E8C", borderRadius:12,
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>👛</div>
          <div>
            <div style={{ fontWeight:800, fontSize:16, color:"#880E4F" }}>DompetIbu</div>
            <div style={{ fontSize:11, color:"#F06292" }}>Halo, {user.username}! 🌸</div>
          </div>
        </div>
        <button onClick={handleLogout}
          style={{ fontSize:11, color:"#F06292", background:"#FFF0F5",
            border:"1px solid #FFD6E7", borderRadius:9, padding:"5px 12px" }}>
          Keluar
        </button>
      </div>

      {/* ── Halaman ── */}
      <div style={{ paddingBottom:88 }}>
        {tab === "beranda" && (
          <BerandaPage
            transaksi={transaksi}
            filterBulan={filterBulan} filterTahun={filterTahun}
            setFilterBulan={setFilterBulan} setFilterTahun={setFilterTahun}
            onEdit={t => setModal({ type:"edit_transaksi", data:t })}
            onDelete={handleDeleteTransaksi}
          />
        )}
        {tab === "rekap" && (
          <RekapPage
            transaksi={transaksi} allTransaksi={allTransaksi}
            filterBulan={filterBulan} filterTahun={filterTahun}
            setFilterBulan={setFilterBulan} setFilterTahun={setFilterTahun}
          />
        )}
        {tab === "tabungan" && (
          <TabunganPage
            tabungan={tabungan}
            onAdd={() => setModal("tambah_tabungan")}
            onEdit={t => setModal({ type:"edit_tabungan", data:t })}
            onDelete={handleDeleteTabungan}
            onSetoran={id => setModal({ type:"setoran", id })}
          />
        )}
        {tab === "tagihan" && (
          <TagihanPage
            tagihan={tagihan}
            onAdd={() => setModal("tambah_tagihan")}
            onEdit={t => setModal({ type:"edit_tagihan", data:t })}
            onDelete={handleDeleteTagihan}
            onBayar={id => setModal({ type:"bayar", id })}
          />
        )}
      </div>

      {/* ── Bottom Nav ── */}
      <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)",
        width:"100%", maxWidth:430, background:"#fff", borderTop:"1px solid #FFD6E7",
        display:"flex", alignItems:"center", justifyContent:"space-around",
        padding:"8px 0 16px", zIndex:100 }}>
        {NAV.map(n =>
          n.id === "catat" ? (
            <button key="catat" onClick={() => setModal("tambah_transaksi")}
              style={{ width:54, height:54, borderRadius:27, background:"#E91E8C",
                border:"none", fontSize:22, marginTop:-22,
                boxShadow:"0 4px 16px #E91E8C55",
                display:"flex", alignItems:"center", justifyContent:"center" }}>
              ✏️
            </button>
          ) : (
            <button key={n.id} onClick={() => setTab(n.id)}
              style={{ display:"flex", flexDirection:"column", alignItems:"center",
                gap:2, border:"none", background:"none", padding:"4px 8px" }}>
              <span style={{ fontSize:22 }}>{n.icon}</span>
              <span style={{ fontSize:10, fontWeight: tab===n.id ? 800 : 400,
                color: tab===n.id ? "#E91E8C" : "#ccc" }}>
                {n.label}
              </span>
              {tab === n.id && (
                <div style={{ width:4, height:4, borderRadius:2, background:"#E91E8C" }} />
              )}
            </button>
          )
        )}
      </div>

      {/* ── Modals ── */}
      {modal === "tambah_transaksi" && (
        <ModalTransaksi onClose={() => setModal(null)} onSave={handleAddTransaksi} />
      )}
      {modal?.type === "edit_transaksi" && (
        <ModalTransaksi initial={modal.data} onClose={() => setModal(null)}
          onSave={data => handleEditTransaksi(modal.data.id, data)} />
      )}
      {modal === "tambah_tabungan" && (
        <ModalTabungan onClose={() => setModal(null)} onSave={handleAddTabungan} />
      )}
      {modal?.type === "edit_tabungan" && (
        <ModalTabungan initial={modal.data} onClose={() => setModal(null)}
          onSave={data => handleEditTabungan(modal.data.id, data)} />
      )}
      {modal?.type === "setoran" && (
        <ModalSetoran onClose={() => setModal(null)}
          onSave={data => handleSetoran(modal.id, data)} />
      )}
      {modal === "tambah_tagihan" && (
        <ModalTagihan onClose={() => setModal(null)} onSave={handleAddTagihan} />
      )}
      {modal?.type === "edit_tagihan" && (
        <ModalTagihan initial={modal.data} onClose={() => setModal(null)}
          onSave={data => handleEditTagihan(modal.data.id, data)} />
      )}
      {modal?.type === "bayar" && (
        <ModalBayar onClose={() => setModal(null)}
          onSave={data => handleBayar(modal.id, data)} />
      )}
    </div>
  );
}
