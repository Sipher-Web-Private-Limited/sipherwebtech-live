const fs = require('fs');

const globals = fs.readFileSync('src/styles/globals.css', 'utf8');
const btnIdx = globals.indexOf('.button');
if (btnIdx !== -1) {
  console.log(globals.substring(btnIdx, btnIdx + 1200));
} else {
  console.log('No .button in globals.css');
}
