# 👛 DompetIbu — Tutorial Lengkap

Aplikasi catatan keuangan untuk ibu rumah tangga.
Berbasis web tapi bisa diinstall seperti aplikasi HP (PWA).

---

## 📁 Struktur Folder

```
dompet-ibu/
├── backend/          ← Server Node.js + Express + MySQL
│   ├── index.js
│   ├── db.js
│   ├── .env          ← Setting koneksi MySQL (WAJIB diedit)
│   ├── package.json
│   └── routes/
│       ├── transaksi.js
│       ├── tabungan.js
│       └── tagihan.js
└── frontend/         ← Aplikasi React + Vite + PWA
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── src/
        ├── App.jsx
        ├── api.js
        ├── constants.js
        ├── pages/
        └── components/
```

---

## 🔧 PERSIAPAN AWAL (lakukan sekali saja)

### 1. Install Node.js
Kalau belum punya, download di: https://nodejs.org
Pilih versi **LTS** (yang ada tulisan "Recommended").
Setelah install, buka Terminal / Command Prompt, cek:
```
node --version
npm --version
```
Kalau muncul angka versi, berarti sudah berhasil.

### 2. Install MySQL
Download MySQL Community Server di: https://dev.mysql.com/downloads/mysql/
Atau pakai **XAMPP** (lebih mudah untuk pemula): https://www.apachefriends.org

**Pakai XAMPP (direkomendasikan untuk pemula):**
- Download dan install XAMPP
- Buka XAMPP Control Panel
- Klik **Start** di baris MySQL
- Kalau sudah hijau, MySQL sudah jalan

### 3. Buat database MySQL
Buka browser, ketik: http://localhost/phpmyadmin
- Klik **New** di sidebar kiri
- Isi nama database: `dompet_ibu`
- Pilih collation: `utf8mb4_unicode_ci`
- Klik **Create**

---

## ⚙️ SETTING BACKEND

### 1. Buka file `.env` di folder `backend`
Edit sesuai setting MySQL kamu:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=         ← kalau pakai XAMPP, password biasanya kosong
DB_NAME=dompet_ibu
PORT=3001
```

> **Catatan XAMPP:** Password MySQL di XAMPP defaultnya **kosong** (tidak perlu diisi).
> Kalau kamu set password sendiri waktu install, isi di sini.

### 2. Install dependencies backend
Buka Terminal, masuk ke folder backend:
```bash
cd dompet-ibu/backend
npm install
```
Tunggu sampai selesai (mungkin 1-2 menit).

### 3. Jalankan backend
```bash
npm run dev
```
Kalau berhasil, akan muncul:
```
✅ Database & tabel siap!
🌸 DompetIbu Backend jalan di http://localhost:3001
```

> Tabel di MySQL akan dibuat otomatis, tidak perlu buat manual!

---

## 🎨 SETTING FRONTEND

Buka **Terminal baru** (jangan tutup terminal backend), masuk ke folder frontend:

```bash
cd dompet-ibu/frontend
npm install
```
Tunggu sampai selesai.

### Jalankan frontend:
```bash
npm run dev
```
Akan muncul:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

---

## 🌐 BUKA APLIKASI

Buka browser (Chrome direkomendasikan), ketik:
```
http://localhost:5173
```

Aplikasi DompetIbu akan terbuka! 🌸

---

## 📱 INSTALL KE HP / LAPTOP (PWA)

Ini yang bikin web terasa seperti aplikasi HP!

### Di HP Android (Chrome):
1. Buka `http://localhost:5173` di Chrome HP
   (HP dan laptop harus satu WiFi, ganti `localhost` dengan IP laptop)
2. Ketuk ikon **⋮** (tiga titik) di kanan atas
3. Pilih **"Add to Home screen"** atau **"Install app"**
4. Ketuk **Add / Install**
5. Sekarang ada ikon DompetIbu di home screen HP! 📱

### Di Laptop (Chrome):
1. Buka `http://localhost:5173` di Chrome
2. Di address bar kanan, ada ikon **⊕** (install)
3. Klik ikon tersebut → klik **Install**
4. DompetIbu akan buka sebagai window tersendiri seperti aplikasi!
5. Shortcut juga muncul di Desktop / taskbar

### Di HP iPhone (Safari):
1. Buka `http://[IP-laptop]:5173` di Safari
2. Ketuk ikon **Share** (kotak dengan panah ke atas)
3. Scroll ke bawah → pilih **"Add to Home Screen"**
4. Ketuk **Add**

---

## 🔍 Cara Cari IP Laptop (untuk akses dari HP)

**Windows:**
```
Buka Command Prompt → ketik: ipconfig
Lihat "IPv4 Address" → contoh: 192.168.1.5
```

**Mac/Linux:**
```
Buka Terminal → ketik: ifconfig
Lihat bagian "inet" → contoh: 192.168.1.5
```

Lalu di HP, buka: `http://192.168.1.5:5173`

Tapi sebelumnya, edit `frontend/vite.config.js`, tambahkan `host: true`:
```js
server: {
  port: 5173,
  host: true  ← tambahkan ini
}
```

---

## 🚀 CARA PAKAI SETIAP HARI

Setiap kali mau pakai DompetIbu, cukup lakukan ini:

**Terminal 1 — jalankan backend:**
```bash
cd dompet-ibu/backend
npm run dev
```

**Terminal 2 — jalankan frontend:**
```bash
cd dompet-ibu/frontend
npm run dev
```

Lalu buka http://localhost:5173 di browser.

> 💡 **Tips:** Buat 2 file `.bat` (Windows) atau `.sh` (Mac/Linux) biar tinggal dobel klik!

**Windows — buat file `jalankan.bat`:**
```bat
start cmd /k "cd /d %~dp0backend && npm run dev"
start cmd /k "cd /d %~dp0frontend && npm run dev"
start chrome http://localhost:5173
```

**Mac/Linux — buat file `jalankan.sh`:**
```bash
#!/bin/bash
cd backend && npm run dev &
cd ../frontend && npm run dev &
sleep 3
open http://localhost:5173  # Mac
# xdg-open http://localhost:5173  # Linux
```

---

## ❌ Troubleshooting (kalau ada error)

### "Cannot connect to database"
- Pastikan MySQL sudah jalan (di XAMPP: klik Start pada MySQL)
- Cek `.env` — password dan nama database sudah benar?
- Coba buka http://localhost/phpmyadmin — kalau bisa buka, MySQL sudah jalan

### "Port 3001 already in use"
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID [nomor PID] /F

# Mac/Linux
lsof -i :3001
kill -9 [nomor PID]
```

### "npm: command not found"
Node.js belum terinstall. Download di https://nodejs.org

### Halaman putih / tidak muncul
- Pastikan backend sudah jalan dulu sebelum buka browser
- Cek di terminal backend apakah ada error merah

---

## 🎯 Fitur Lengkap DompetIbu

| Fitur | Deskripsi |
|-------|-----------|
| 🏠 Beranda | Saldo bulan ini, riwayat transaksi |
| 📊 Rekap | Grafik harian & bulanan, donut chart per kategori |
| ✏️ Catat | Tambah pemasukan/pengeluaran dengan 8 kategori |
| 🐷 Tabungan | Buat tujuan tabungan, tambah setoran, lihat progress |
| 🧾 Tagihan | Catat tagihan, track pembayaran, status lunas |
| 👤 Multi-user | Login pakai nama saja, tanpa password |
| 📱 PWA | Bisa diinstall ke HP/laptop tanpa Play Store |

---

Selamat mencoba! 🌸 Semoga DompetIbu membantu mengatur keuangan dengan lebih mudah.
