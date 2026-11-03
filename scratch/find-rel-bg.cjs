const fs = require('fs');
const css = fs.readFileSync('src/styles/services/mobile-app-development.css', 'utf8');

const matches = [];
const lines = css.split('\n');
lines.forEach((l, i) => {
  if (l.includes('rel') && (l.includes('background') || l.includes('fill') || l.includes('color'))) {
    matches.push(`L${i+1}: ${l}`);
  }
});
console.log(matches.join('\n'));
