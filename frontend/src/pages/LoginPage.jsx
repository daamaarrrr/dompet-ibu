import { useState } from "react";
import { login } from "../api.js";

export default function LoginPage({ onLogin }) {
  const [name,    setName]    = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  async function handleLogin() {
    if (!name.trim()) return setError("Nama tidak boleh kosong");
    setLoading(true);
    setError("");
    try {
      const res = await login(name.trim());
      onLogin(res.data);
    } catch {
      setError("Gagal terhubung ke server. Pastikan backend sudah jalan.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center", padding:"0 24px",
      background:"linear-gradient(160deg, #FFF0F5 50%, #FFD6E7 100%)" }}>

      <div style={{ fontSize:80, marginBottom:8, animation:"bounce 2s infinite" }}>👛</div>
      <div style={{ fontSize:30, fontWeight:800, color:"#880E4F", marginBottom:4 }}>DompetIbu</div>
      <div style={{ fontSize:14, color:"#F06292", marginBottom:36, textAlign:"center" }}>
        Catat keuangan harian, hidup lebih tenang 🌸
      </div>

      <div style={{ background:"#fff", borderRadius:24, padding:"28px 24px",
        width:"100%", maxWidth:340, boxShadow:"0 8px 40px #E91E8C18" }}>
        <div style={{ fontWeight:700, color:"#880E4F", marginBottom:14, fontSize:15 }}>
          Siapa nama Ibu?
        </div>

        <input
          value={name}
          onChange={e => { setName(e.target.value); setError(""); }}
          placeholder="Ketik nama Ibu di sini..."
          onKeyDown={e => e.key === "Enter" && handleLogin()}
          style={{ width:"100%", border:"1.5px solid #FFD6E7", borderRadius:14,
            padding:"12px 16px", fontSize:15, outline:"none",
            boxSizing:"border-box", marginBottom:6, color:"#880E4F" }}
        />

        {error && (
          <div style={{ fontSize:12, color:"#E91E8C", marginBottom:10 }}>⚠️ {error}</div>
        )}

        <button onClick={handleLogin} disabled={loading}
          style={{ width:"100%", background: loading ? "#F4C0D1" : "#E91E8C",
            color:"#fff", border:"none", borderRadius:14, padding:"13px 0",
            fontSize:16, fontWeight:800, marginTop:8,
            cursor: loading ? "not-allowed" : "pointer" }}>
          {loading ? "Masuk..." : "Masuk ✨"}
        </button>
      </div>

      <div style={{ marginTop:20, fontSize:11, color:"#F06292", textAlign:"center" }}>
        Tidak perlu password — langsung masuk pakai nama
      </div>

      <style>{`@keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }`}</style>
    </div>
  );
}
