require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { initDB } = require("./db");

const transaksiRouter = require("./routes/transaksi");
const tabunganRouter  = require("./routes/tabungan");
const tagihanRouter   = require("./routes/tagihan");

const app  = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// ── Routes ──
app.use("/api", transaksiRouter);          // POST /api/login
app.use("/api/transaksi", transaksiRouter); // GET/POST/PUT/DELETE /api/transaksi
app.use("/api/tabungan",  tabunganRouter);
app.use("/api/tagihan",   tagihanRouter);

app.get("/", (req, res) => res.json({ status: "DompetIbu API berjalan 🌸" }));

// ── Start ──
initDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`\n🌸 DompetIbu Backend jalan di http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Gagal koneksi database:", err.message);
    console.error("Pastikan MySQL sudah jalan dan setting .env sudah benar!");
    process.exit(1);
  });
