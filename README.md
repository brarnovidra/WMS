# WMS - Fullstack Warehouse Management System

Aplikasi ini terdiri dari:
- **Frontend**: Next.js (TypeScript + MUI)
- **Backend**: Express.js (Sequelize ORM, JWT Auth)
- **Database**: MySQL
- **Redis**: Cache management

Semua service dikelola dengan **Docker Compose**.

---

## Demo deploy in AWS EC2 ##
- Link : http://13.213.17.201:3001

# 🔐 Login Accounts

Gunakan akun berikut untuk login ke aplikasi:

### 👑 Admin
- **Username**: `admin`
- **Password**: `admin`

### 🙋 User
- **Username**: `user`
- **Password**: `user`

---

## 🚀 Prerequisites

Pastikan sudah ter-install:
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/)

---

## 📂 Struktur Folder

```
.
├── wms-frontend-next/      # Source code frontend
├── wms-backend-express/    # Source code backend
├── docker-compose.yml      # File docker-compose
```

---

## ⚙️ Konfigurasi Environment

### 1. Backend (`wms-backend-express/.env`)
```env
PORT=3000
DB_HOST=mysql
DB_PORT=3306
DB_USER=root
DB_PASS=admin
DB_NAME=wms_db
JWT_SECRET=supersecret
```

### 2. Frontend (`wms-frontend-next/.env`)
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
PORT=3001
NODE_ENV=production
```

---

## 🐳 Jalankan Aplikasi

1. **Build & Start**
   ```bash
   docker-compose up --build
   ```

2. **Start tanpa rebuild**
   ```bash
   docker-compose up -d
   ```

3. **Stop containers**
   ```bash
   docker-compose down
   ```

---

## 🌐 Akses Aplikasi

- Frontend: [http://localhost:3001](http://localhost:3001)  
- Backend API: [http://localhost:3000/api](http://localhost:3000/api)  
- phpMyAdmin [http://localhost:8080](http://localhost:8080)  
- Database: port `3306` (MySQL)

---

## 🗄️ Database Migrations & Seeders
Sudah otomatis ketika docker-compose di jalankan

**Untuk cara manual**

Masuk ke container backend:
```bash
docker exec -it wms-backend-express sh
```

Jalankan create, migrasi & seeder:
```bash
npm run db:create
npm run db:migrate
npm run db:seeds
```

---

## 📝 Catatan

- Default database: **MySQL**  
  Jika ingin PostgreSQL, sesuaikan bagian `db` di `docker-compose.yml` dan config Sequelize.
- Pastikan sudah mengisi **OAuth Credentials** di `.env`.


## Essay
- 1. Solusi untuk mengetahui produk yang low stock

Saya akan membuat fitur notifikasi stok rendah, yang akan menampilkan daftar barang yang stoknya sudah di bawah batas minimum. Sistem akan otomatis mengecek stok setiap hari dan menampilkan peringatan di dashboard, agar warehouse manager atau procurement manager bisa segera melakukan restock.

- 2. Cara membuat automasi penetapan minimum stok

Minimum stok bisa ditentukan otomatis berdasarkan riwayat pemakaian barang. Sistem akan menghitung rata-rata pemakaian harian atau mingguan, lalu menentukan batas minimum sesuai kebutuhan dan waktu pengiriman (lead time). Dengan begitu, nilai minimum stok selalu menyesuaikan kondisi nyata di gudang.

- 3. Prediksi kebutuhan pengeluaran bulanan

Sistem dapat menganalisis data pemakaian beberapa bulan terakhir untuk memperkirakan kebutuhan pembelian bulan berikutnya. Dari data tersebut, sistem bisa memprediksi jumlah barang yang akan dibutuhkan dan total biaya yang diperlukan, sehingga manajer bisa membuat rencana anggaran pembelian yang lebih akurat.