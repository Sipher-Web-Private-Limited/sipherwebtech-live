const fs = require('fs');
const css = fs.readFileSync('src/styles/services/mobile-app-development.css', 'utf8');

const rIdx = css.indexOf('.ma-rel-card');
console.log(css.substring(rIdx - 50, rIdx + 1200));
