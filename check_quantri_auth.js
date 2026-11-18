const fs = require('fs');
const content = fs.readFileSync('ban-day-du/src/phan-mem.html', 'utf8');

const idx = content.indexOf('function modal(');
console.log(content.substring(idx + 500, idx + 1200));
