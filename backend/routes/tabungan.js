const express = require("express");
const router = express.Router();
const { pool } = require("../db");

// ── GET semua tabungan user ──
router.get("/", async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) return res.status(400).json({ error: "user_id wajib" });

    const [tabungan] = await pool.query(
      "SELECT * FROM tabungan WHERE user_id = ? ORDER BY created_at DESC",
      [user_id]
    );

    for (const t of tabungan) {
      const [setoran] = await pool.query(
        "SELECT * FROM setoran_tabungan WHERE tabungan_id = ? ORDER BY tgl DESC",
        [t.id]
      );
      t.riwayat = setoran;
    }

    res.json(tabungan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── TAMBAH tabungan ──
router.post("/", async (req, res) => {
  try {
    const { user_id, nama, target, icon, keterangan } = req.body;
    if (!user_id || !nama || !target)
      return res.status(400).json({ error: "Field wajib: user_id, nama, target" });

    const [result] = await pool.query(
      "INSERT INTO tabungan (user_id, nama, target, icon, keterangan) VALUES (?,?,?,?,?)",
      [user_id, nama, target, icon || "🎯", keterangan || null]
    );
    const [rows] = await pool.query("SELECT * FROM tabungan WHERE id = ?", [result.insertId]);
    res.status(201).json({ ...rows[0], riwayat: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── EDIT tabungan ──
router.put("/:id", async (req, res) => {
  try {
    const { nama, target, icon, keterangan } = req.body;
    await pool.query(
      "UPDATE tabungan SET nama=?, target=?, icon=?, keterangan=? WHERE id=?",
      [nama, target, icon || "🎯", keterangan || null, req.params.id]
    );
    const [rows] = await pool.query("SELECT * FROM tabungan WHERE id = ?", [req.params.id]);
    const [setoran] = await pool.query(
      "SELECT * FROM setoran_tabungan WHERE tabungan_id = ? ORDER BY tgl DESC",
      [req.params.id]
    );
    res.json({ ...rows[0], riwayat: setoran });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── HAPUS tabungan ──
router.delete("/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM tabungan WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── TAMBAH setoran ──
router.post("/:id/setoran", async (req, res) => {
  try {
    const { nominal, catatan, tgl } = req.body;
    const tabunganId = req.params.id;

    if (!nominal || !tgl)
      return res.status(400).json({ error: "nominal dan tgl wajib" });

    await pool.query(
      "INSERT INTO setoran_tabungan (tabungan_id, nominal, catatan, tgl) VALUES (?,?,?,?)",
      [tabunganId, nominal, catatan || null, tgl]
    );
    await pool.query(
      "UPDATE tabungan SET terkumpul = terkumpul + ? WHERE id = ?",
      [nominal, tabunganId]
    );

    const [rows] = await pool.query("SELECT * FROM tabungan WHERE id = ?", [tabunganId]);
    const [setoran] = await pool.query(
      "SELECT * FROM setoran_tabungan WHERE tabungan_id = ? ORDER BY tgl DESC",
      [tabunganId]
    );
    res.status(201).json({ ...rows[0], riwayat: setoran });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
