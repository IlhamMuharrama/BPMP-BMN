const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `    const sameCatItems = barangList.filter(b => b.kategoriId === catCode || b.kategori === item.kategori);
    const sequence = String(sameCatItems.length + 1).padStart(6, '0');`;

const replacement = `    const sameCatItems = barangList.filter(b => b.kategoriId === catCode || b.kategori === item.kategori);
    
    let maxSequence = 0;
    sameCatItems.forEach(b => {
      const parts = b.id.split('-');
      const seqStr = parts.length > 1 ? parts[1] : b.id;
      const seq = parseInt(seqStr, 10);
      if (!isNaN(seq) && seq > maxSequence) {
        maxSequence = seq;
      }
    });
    const sequence = String(maxSequence + 1).padStart(6, '0');`;

code = code.replace(target, replacement);
fs.writeFileSync('src/App.tsx', code);
console.log('patched app.tsx');
