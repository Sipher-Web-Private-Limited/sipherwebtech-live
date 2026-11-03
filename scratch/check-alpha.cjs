const fs = require('fs');

const buf = fs.readFileSync('public/new-images/services/webdev/related-web-development.webp');
// Check if VP8 or VP8X (VP8X has alpha flag)
const isVP8X = buf.toString('ascii', 12, 16) === 'VP8X';
console.log('isVP8X:', isVP8X);
if (isVP8X) {
  const flags = buf[20];
  const hasAlpha = (flags & 0x10) !== 0;
  console.log('hasAlpha:', hasAlpha);
}

const seoBuf = fs.readFileSync('public/new-images/services/webdev/related-seo.webp');
const seoIsVP8X = seoBuf.toString('ascii', 12, 16) === 'VP8X';
console.log('seoIsVP8X:', seoIsVP8X);
if (seoIsVP8X) {
  const flags = seoBuf[20];
  const hasAlpha = (flags & 0x10) !== 0;
  console.log('SEO hasAlpha:', hasAlpha);
}
