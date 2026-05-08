const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

async function initDB() {
  const conn = await pool.getConnection();
  try {
    await conn.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS transaksi (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        jenis ENUM('masuk','keluar') NOT NULL,
        nominal DECIMAL(15,2) NOT NULL,
        kategori VARCHAR(50),
        keterangan TEXT,
        tgl DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS tabungan (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        nama VARCHAR(200) NOT NULL,
        target DECIMAL(15,2) NOT NULL,
        terkumpul DECIMAL(15,2) DEFAULT 0,
        icon VARCHAR(10) DEFAULT '🎯',
        keterangan TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS setoran_tabungan (
        id INT AUTO_INCREMENT PRIMARY KEY,
        tabungan_id INT NOT NULL,
        nominal DECIMAL(15,2) NOT NULL,
        catatan TEXT,
        tgl DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (tabungan_id) REFERENCES tabungan(id) ON DELETE CASCADE
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS tagihan (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        nama VARCHAR(200) NOT NULL,
        total DECIMAL(15,2) NOT NULL,
        sudah_bayar DECIMAL(15,2) DEFAULT 0,
        keterangan TEXT,
        jatuh_tempo DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS pembayaran_tagihan (
        id INT AUTO_INCREMENT PRIMARY KEY,
        tagihan_id INT NOT NULL,
        nominal DECIMAL(15,2) NOT NULL,
        catatan TEXT,
        tgl DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (tagihan_id) REFERENCES tagihan(id) ON DELETE CASCADE
      )
    `);

    console.log("✅ Database & tabel siap!");
  } finally {
    conn.release();
  }
}

module.exports = { pool, initDB };
