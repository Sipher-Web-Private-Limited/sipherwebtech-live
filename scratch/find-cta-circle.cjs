const fs = require('fs');

const css = fs.readFileSync('src/styles/globals.css', 'utf8');
const lines = css.split('\n');
lines.forEach((l, i) => {
  if (l.includes('cta') || l.includes('arrow') || l.includes('icon')) {
    if (l.includes('circle') || l.includes('radius') || l.includes('hover')) {
      console.log(`L${i+1}: ${l}`);
    }
  }
});
