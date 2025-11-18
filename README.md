# Scalping Terminal

Scalping Terminal adalah antarmuka trading modern berbasis Next.js dan Tailwind yang dirancang khusus untuk kebutuhan scalping dan eksekusi cepat. Platform ini memungkinkan pemantauan dua TradingView terminal secara bersamaan, pengelolaan sinyal real-time melalui webhook, serta integrasi menuju sistem eksekusi trading yang terstruktur dan dapat dikembangkan.

---

## 🚀 Fitur Utama
- **Dual TradingView Monitoring**  
  Dua terminal TradingView dapat ditampilkan dan dipantau secara paralel untuk analisis multi-pasar atau multi-timeframe.

- **Alert Webhook Processing**  
  Sistem menerima, memverifikasi, dan memproses alert trading secara real-time melalui endpoint webhook yang aman.

- **UI Responsif & Ringan**  
  Dibangun dengan Next.js App Router + Tailwind sehingga antarmuka cepat, responsif, dan mudah dikustomisasi.

- **Struktur Siap Eksekusi**  
  Sudah disiapkan layer untuk order routing, audit log, dan integrasi broker yang dapat diperluas secara modular.

- **Developer-Friendly**  
  Kode bersih, terstruktur, dan mudah diperluas untuk pengembangan strategi trading, algoritma risiko, atau fitur otomatisasi.

---

## 📐 Arsitektur Singkat
- **Frontend** → Next.js + Tailwind sebagai UI terminal dan panel multi-monitor.  
- **Backend API** → Routing webhook dan pemrosesan alert untuk dipetakan ke terminal yang sesuai.  
- **Integrasi TradingView** → Dua embed/chart instance dijalankan bersamaan dan saling independen.  
- **Eksekusi (opsional)** → Dapat dihubungkan ke API broker atau engine eksekusi custom.

 
