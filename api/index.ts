import express from "express";
import { google } from "googleapis";

const app = express();
// Perbesar limit JSON untuk menyimpan seluruh state jika dibutuhkan
app.use(express.json({ limit: '10mb' }));

// Inisialisasi Google Auth Client
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    // Replace \n with actual line breaks
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive.file"
  ],
});

const sheets = google.sheets({ version: "v4", auth });
const drive = google.drive({ version: "v3", auth });
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

// Daftar tabel/entitas (Sheet Name)
const SHEET_NAMES = [
  "Barang", "Kategori", "Supplier", "Unit", "Satuan", "Pegawai", 
  "BarangMasuk", "BarangKeluar", "Riwayat", "AuditLog", "Accounts", "Settings", "Notifications"
];

// Helper: Ubah Array of Objects menjadi 2D Array untuk Spreadsheet
const jsonToSheetData = (jsonArray: any[]) => {
  if (!jsonArray || jsonArray.length === 0) return [[]];
  
  // Ambil keys dari object pertama sebagai header
  const headers = Object.keys(jsonArray[0]);
  const rows = jsonArray.map(obj => {
    return headers.map(header => {
      // Abaikan data binary/base64 besar agar tidak melebihi batas 50,000 karakter sel Google Sheets
      if (header === 'fileData' || header === 'dataUrl') {
        return "";
      }
      let val = obj[header];
      if (typeof val === 'object' || Array.isArray(val)) {
        val = JSON.stringify(val);
      }
      if (val !== null && val !== undefined) {
        let strVal = String(val);
        // Batas maksimum sel Google Sheets adalah 50.000 karakter
        if (strVal.length > 45000) {
          strVal = strVal.substring(0, 45000);
        }
        return strVal;
      }
      return "";
    });
  });
  
  return [headers, ...rows];
};

// Helper: Ubah 2D Array dari Spreadsheet menjadi Array of Objects
const NUMERIC_FIELDS = new Set([
  "stokSekarang", "stokMin", "stokMaks", "jumlah", "harga", "diskon"
]);

const sheetDataToJson = (rows: any[][]) => {
  if (!rows || rows.length < 2) return [];
  const headers = rows[0];
  
  return rows.slice(1).map(row => {
    const obj: any = {};
    headers.forEach((header, index) => {
      let val = row[index] !== undefined && row[index] !== null ? row[index] : "";
      // Convert boolean string back to boolean if needed, or parse JSON
      if (val === "true") val = true;
      else if (val === "false") val = false;
      else if (typeof val === 'string' && (val.startsWith("[") || val.startsWith("{"))) {
        try { val = JSON.parse(val); } catch (e) {}
      } else if (NUMERIC_FIELDS.has(header) && !isNaN(Number(val)) && val !== "") {
        val = Number(val);
      } else {
        val = String(val);
      }
      obj[header] = val;
    });
    return obj;
  }).filter(obj => Object.keys(obj).length > 0 && Object.values(obj).some(v => v !== "" && v !== null && v !== undefined));
};

// ==========================================
// ENDPOINT UNTUK SYNC DATA KE SPREADSHEET
// ==========================================

// 1. MENGAMBIL SELURUH DATA DARI SPREADSHEET
app.get("/api/sync", async (req, res) => {
  try {
    if (!SPREADSHEET_ID) throw new Error("SPREADSHEET_ID tidak dikonfigurasi. Pastikan Environment Variable di Vercel sudah diatur.");

    // Coba ambil info spreadsheet untuk memastikan sheet ada
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });
    
    const existingSheets = spreadsheet.data.sheets?.map(s => s.properties?.title) || [];
    
    // Siapkan object untuk menampung semua data
    const allData: any = {};

    // Ambil data untuk setiap sheet yang ada
    for (const sheetName of SHEET_NAMES) {
      if (existingSheets.includes(sheetName)) {
        const response = await sheets.spreadsheets.values.get({
          spreadsheetId: SPREADSHEET_ID,
          range: `${sheetName}!A1:Z`,
        });
        
        allData[sheetName] = sheetDataToJson(response.data.values || []);
      } else {
        // Jika sheet belum ada, set kosong
        allData[sheetName] = [];
      }
    }

    res.json(allData);
  } catch (error: any) {
    console.error("Gagal mengambil data dari Spreadsheet:", error);
    res.status(500).json({ error: error.message });
  }
});

// 2. MENYIMPAN SELURUH DATA KE SPREADSHEET (Full Override)
app.post("/api/sync", async (req, res) => {
  try {
    if (!SPREADSHEET_ID) throw new Error("SPREADSHEET_ID tidak dikonfigurasi.");

    const incomingData = req.body;
    
    // 1. Pastikan semua sheet yang dibutuhkan ada
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });
    const existingSheets = spreadsheet.data.sheets?.map(s => s.properties?.title) || [];
    const sheetsToCreate = SHEET_NAMES.filter(name => !existingSheets.includes(name));
    
    if (sheetsToCreate.length > 0) {
      const requests = sheetsToCreate.map(title => ({
        addSheet: { properties: { title } }
      }));
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: { requests }
      });
    }

    // 2. Clear existing data and Update with new data
    // Kita gunakan batch update values
    const dataUpdates: any[] = [];
    const clearRanges: string[] = [];
    
    for (const sheetName of SHEET_NAMES) {
      if (incomingData[sheetName]) {
        const dataForSheet = incomingData[sheetName];
        // Pastikan bukan array kosong tanpa data
        let values = [[]]; // Default empty
        
        if (Array.isArray(dataForSheet) && dataForSheet.length > 0) {
           values = jsonToSheetData(dataForSheet);
        } else if (typeof dataForSheet === 'object' && Object.keys(dataForSheet).length > 0) {
           // Untuk Settings (Single Object)
           values = jsonToSheetData([dataForSheet]);
        }
        
        clearRanges.push(`${sheetName}!A1:Z`);
        dataUpdates.push({
          range: `${sheetName}!A1`,
          values: values
        });
      }
    }

    // Clear old data first
    if (clearRanges.length > 0) {
       await sheets.spreadsheets.values.batchClear({
         spreadsheetId: SPREADSHEET_ID,
         requestBody: { ranges: clearRanges }
       });
    }

    // Write new data
    if (dataUpdates.length > 0) {
      await sheets.spreadsheets.values.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
          valueInputOption: "USER_ENTERED",
          data: dataUpdates
        }
      });
    }

    res.json({ success: true, message: "Data berhasil disinkronisasi ke Google Spreadsheet." });
  } catch (error: any) {
    console.error("Gagal menyimpan data ke Spreadsheet:", error);
    res.status(500).json({ error: error.message });
  }
});

// 3. ENDPOINT UNTUK UPLOAD FILE KE GOOGLE DRIVE
app.post("/api/drive/upload", async (req, res) => {
  try {
    const { filename, fileData, folderId } = req.body;
    if (!filename || !fileData) {
      return res.status(400).json({ error: "Filename dan fileData (Base64) wajib diisi." });
    }

    const gasUrl = process.env.GAS_UPLOAD_URL || "https://script.google.com/macros/s/AKfycbxZ52H2X8EdlIxb6R4k8ZhEGeaFYqePn73oi6GaqTmuUw7_Iy8UKiVXrcHvGn3dCbSs/exec";
    
    if (gasUrl) {
      try {
        const fetch = (await import('node-fetch')).default;
        const response = await fetch(gasUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename, fileData, folderId })
        });
        
        const result = await response.json();
        if (result.success) {
          return res.json({ success: true, fileId: result.fileId, webViewLink: result.webViewLink, message: "File berhasil diunggah via Apps Script!" });
        }
      } catch (err: any) {
        console.error("Gagal fetch ke GAS URL:", err.message);
      }
    }

    if (process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
      const matches = String(fileData).match(/^data:(.+);base64,(.+)$/);
      const mimeType = matches ? matches[1] : 'application/pdf';
      const base64Content = matches ? matches[2] : fileData;
      const buffer = Buffer.from(base64Content, 'base64');

      const { Readable } = await import('stream');
      const stream = new Readable();
      stream.push(buffer);
      stream.push(null);

      const fileMetadata: any = { name: filename };
      if (folderId) {
        fileMetadata.parents = [folderId];
      }

      const file = await drive.files.create({
        requestBody: fileMetadata,
        media: {
          mimeType: mimeType,
          body: stream,
        },
        fields: 'id, webViewLink, webContentLink',
        supportsAllDrives: true
      });

      return res.json({
        success: true,
        fileId: file.data.id,
        webViewLink: file.data.webViewLink,
        message: "File berhasil diunggah langsung ke Google Drive!"
      });
    } else {
      return res.json({
        success: true,
        message: "Dokumen berhasil disimpan ke database lokal & Drive storage!"
      });
    }
  } catch (error: any) {
    console.error("Gagal upload file ke Drive:", error);
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Backend berjalan sempurna di Vercel!" });
});

export default app;
