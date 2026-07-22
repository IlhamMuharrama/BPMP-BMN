import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { google } from "googleapis";

// Inisialisasi Google Auth Client menggunakan Environment Variables
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    // Replace \n with actual line breaks in the private key
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive.file"
  ],
});

const sheets = google.sheets({ version: "v4", auth });
// Pastikan kamu menaruh SPREADSHEET_ID kamu di Environment Variables!
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // ==========================================
  // CONTOH API ENDPOINT KE GOOGLE SPREADSHEET
  // ==========================================
  
  // Endpoint untuk mengambil data Barang dari Spreadsheet (Sheet bernama "Barang")
  app.get("/api/barang", async (req, res) => {
    try {
      if (!SPREADSHEET_ID) throw new Error("SPREADSHEET_ID tidak dikonfigurasi.");
      
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: "Barang!A2:N", // Ambil dari baris 2 (hindari header) sampai akhir
      });
      
      const rows = response.data.values || [];
      // Parsing array dari sheet menjadi JSON Object untuk Frontend
      const data = rows.map(row => ({
        id: row[0],
        nama: row[1],
        kategori: row[2],
        supplier: row[3],
        satuan: row[4],
        lokasiRak: row[5],
        qrCodeUrl: row[6],
        stokSekarang: parseInt(row[7]) || 0,
        stokMin: parseInt(row[8]) || 0,
        stokMaks: parseInt(row[9]) || 0,
        deskripsi: row[10],
        imageDriveUrl: row[11],
        createdAt: row[12],
        updatedAt: row[13]
      }));
      
      res.json(data);
    } catch (error: any) {
      console.error("Gagal mengambil data:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Backend berjalan sempurna!" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Di mode produksi (Render/VPS), Express akan menyajikan file HTML statis dari hasil build Vite
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
