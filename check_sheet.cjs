const { google } = require('googleapis');

async function main() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });
  const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: "Barang!A1:Z1000",
    });
    console.log("Sheet rows length:", res.data.values ? res.data.values.length : 0);
  } catch (err) {
    console.error("Error reading sheet:", err.message);
  }
}
main();
