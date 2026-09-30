# Panel Kontrol Energi — Buona Cita (PWA)

Dashboard web yang bisa **diinstal seperti aplikasi** di Android, iPhone/iPad, Windows, Mac, dan Linux.

## Isi repo
| File | Fungsi |
|---|---|
| `index.html` | Dashboard (satu file) |
| `manifest.json` | Nama, ikon, warna aplikasi |
| `sw.js` | Service worker (syarat instal + buka cepat/offline untuk tampilan) |
| `icons/` | Ikon 192, 512, maskable, dan ikon iPhone |
| `vercel.json` | Header untuk Vercel (opsional di hosting lain) |

## Deploy (wajib HTTPS)
Pilih salah satu — semuanya gratis:
- **Vercel / Netlify**: upload repo ke GitHub → *Import Project* → Deploy (tanpa build command).
- **GitHub Pages**: Settings → Pages → branch `main` / root.
- **Firebase Hosting**: `firebase init hosting` (public directory = folder ini) → `firebase deploy`.

## PENTING: izinkan domain di Firebase Auth
Firebase Console → **Authentication → Settings → Authorized domains → Add domain**, isi domain hosting Anda
(mis. `panel-bc.vercel.app`). Tanpa ini login akan gagal di domain baru.

## Cara install
- **Android (Chrome)**: buka situs → menu akun → **⬇ Instal Aplikasi** (atau menu ⋮ → *Install app*).
- **iPhone/iPad (Safari)**: tombol Bagikan → **Tambah ke Layar Utama**.
- **Windows/Mac/Linux (Chrome/Edge)**: ikon instal di address bar, atau menu akun → **⬇ Instal Aplikasi**.

## Update
Ganti `index.html` lalu deploy ulang; pengguna otomatis mendapat versi baru saat membuka app dengan internet.
Kalau Anda mengubah ikon/manifest, naikkan `CACHE_VERSION` di `sw.js` (mis. `bc-panel-v2`).

## Catatan
- Service worker **tidak** menyimpan data panel; angka selalu langsung dari Firebase. Tanpa internet, hanya tampilan yang terbuka.
- Notifikasi alarm tetap lewat email (Apps Script) seperti sebelumnya.
