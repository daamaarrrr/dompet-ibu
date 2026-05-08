const express = require("express");
const router = express.Router();
const { pool } = require("../db");

// ── LOGIN (username only, auto register) ──
router.post("/login", async (req, res) => {
  try {
    const { username } = req.body;
    if (!username?.trim()) return res.status(400).json({ error: "Username wajib diisi" });

    const name = username.trim();
    const [rows] = await pool.query("SELECT id, username FROM users WHERE username = ?", [name]);

    if (rows.length > 0) {
      return res.json({ id: rows[0].id, username: rows[0].username });
    }

    const [result] = await pool.query("INSERT INTO users (username) VALUES (?)", [name]);
    res.json({ id: result.insertId, username: name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET semua transaksi (filter bulan/tahun) ──
router.get("/transaksi", async (req, res) => {
  try {
    const { user_id, bulan, tahun } = req.query;
    if (!user_id) return res.status(400).json({ error: "user_id wajib" });

    let query = "SELECT * FROM transaksi WHERE user_id = ?";
    const params = [user_id];

    if (bulan && tahun) {
      query += " AND MONTH(tgl) = ? AND YEAR(tgl) = ?";
      params.push(bulan, tahun);
    }
    query += " ORDER BY tgl DESC, id DESC";

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── TAMBAH transaksi ──
router.post("/transaksi", async (req, res) => {
  try {
    const { user_id, jenis, nominal, kategori, keterangan, tgl } = req.body;
    if (!user_id || !jenis || !nominal || !tgl)
      return res.status(400).json({ error: "Field wajib: user_id, jenis, nominal, tgl" });

    const [result] = await pool.query(
      "INSERT INTO transaksi (user_id, jenis, nominal, kategori, keterangan, tgl) VALUES (?,?,?,?,?,?)",
      [user_id, jenis, nominal, kategori || null, keterangan || null, tgl]
    );
    const [rows] = await pool.query("SELECT * FROM transaksi WHERE id = ?", [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── EDIT transaksi ──
router.put("/transaksi/:id", async (req, res) => {
  try {
    const { jenis, nominal, kategori, keterangan, tgl } = req.body;
    await pool.query(
      "UPDATE transaksi SET jenis=?, nominal=?, kategori=?, keterangan=?, tgl=? WHERE id=?",
      [jenis, nominal, kategori || null, keterangan || null, tgl, req.params.id]
    );
    const [rows] = await pool.query("SELECT * FROM transaksi WHERE id = ?", [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── HAPUS transaksi ──
router.delete("/transaksi/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM transaksi WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
