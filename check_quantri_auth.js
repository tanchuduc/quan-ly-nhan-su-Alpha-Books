const fs = require('fs');
const content = fs.readFileSync('ban-day-du/src/phan-mem.html', 'utf8');

console.log('openCvModal exists:', content.includes('function openCvModal'));
const idx = content.indexOf('openCvModal');
if (idx !== -1) {
  console.log(content.substring(idx - 50, idx + 200));
}
