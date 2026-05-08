const express = require("express");
const router = express.Router();
const { pool } = require("../db");

// ── GET semua tagihan user ──
router.get("/", async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) return res.status(400).json({ error: "user_id wajib" });

    const [tagihan] = await pool.query(
      "SELECT * FROM tagihan WHERE user_id = ? ORDER BY created_at DESC",
      [user_id]
    );

    for (const t of tagihan) {
      const [pembayaran] = await pool.query(
        "SELECT * FROM pembayaran_tagihan WHERE tagihan_id = ? ORDER BY tgl DESC",
        [t.id]
      );
      t.riwayat = pembayaran;
    }

    res.json(tagihan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── TAMBAH tagihan ──
router.post("/", async (req, res) => {
  try {
    const { user_id, nama, total, keterangan, jatuh_tempo } = req.body;
    if (!user_id || !nama || !total)
      return res.status(400).json({ error: "Field wajib: user_id, nama, total" });

    const [result] = await pool.query(
      "INSERT INTO tagihan (user_id, nama, total, keterangan, jatuh_tempo) VALUES (?,?,?,?,?)",
      [user_id, nama, total, keterangan || null, jatuh_tempo || null]
    );
    const [rows] = await pool.query("SELECT * FROM tagihan WHERE id = ?", [result.insertId]);
    res.status(201).json({ ...rows[0], riwayat: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── EDIT tagihan ──
router.put("/:id", async (req, res) => {
  try {
    const { nama, total, keterangan, jatuh_tempo } = req.body;
    await pool.query(
      "UPDATE tagihan SET nama=?, total=?, keterangan=?, jatuh_tempo=? WHERE id=?",
      [nama, total, keterangan || null, jatuh_tempo || null, req.params.id]
    );
    const [rows] = await pool.query("SELECT * FROM tagihan WHERE id = ?", [req.params.id]);
    const [pembayaran] = await pool.query(
      "SELECT * FROM pembayaran_tagihan WHERE tagihan_id = ? ORDER BY tgl DESC",
      [req.params.id]
    );
    res.json({ ...rows[0], riwayat: pembayaran });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── HAPUS tagihan ──
router.delete("/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM tagihan WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── CATAT pembayaran ──
router.post("/:id/bayar", async (req, res) => {
  try {
    const { nominal, catatan, tgl } = req.body;
    const tagihanId = req.params.id;

    if (!nominal || !tgl)
      return res.status(400).json({ error: "nominal dan tgl wajib" });

    await pool.query(
      "INSERT INTO pembayaran_tagihan (tagihan_id, nominal, catatan, tgl) VALUES (?,?,?,?)",
      [tagihanId, nominal, catatan || null, tgl]
    );
    await pool.query(
      "UPDATE tagihan SET sudah_bayar = sudah_bayar + ? WHERE id = ?",
      [nominal, tagihanId]
    );

    const [rows] = await pool.query("SELECT * FROM tagihan WHERE id = ?", [tagihanId]);
    const [pembayaran] = await pool.query(
      "SELECT * FROM pembayaran_tagihan WHERE tagihan_id = ? ORDER BY tgl DESC",
      [tagihanId]
    );
    res.status(201).json({ ...rows[0], riwayat: pembayaran });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
