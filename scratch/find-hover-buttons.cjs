const fs = require('fs');

const files = [
  'src/styles/globals.css',
  'src/styles/home.css',
  'src/styles/pages.css',
  'src/components/CursorFollower.tsx',
];

for (const file of files) {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    const matches = content.match(/(\.[a-zA-Z0-9_-]+:hover[\s\S]*?\{[\s\S]*?\})/g);
    if (matches) {
      console.log(`=== In ${file}: ===`);
      matches.filter(m => m.includes('yellow') || m.includes('circle') || m.includes('scale')).slice(0, 5).forEach(m => console.log(m.substring(0, 200)));
    }
  }
}
