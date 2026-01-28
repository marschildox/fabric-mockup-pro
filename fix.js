import fs from 'fs';
const data = fs.readFileSync('src/app/page.tsx', 'utf8');
const lines = data.split('
');
fs.writeFileSync('src/app/page.tsx', lines.slice(0, 1762).join('
'));