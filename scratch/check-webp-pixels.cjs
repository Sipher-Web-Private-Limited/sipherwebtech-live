const fs = require('fs');

// Check if sharp or canvas or jimp or any image parser is available
try {
  const sharp = require('sharp');
  sharp('public/new-images/services/webdev/related-web-development.webp')
    .metadata()
    .then(meta => {
      console.log('Sharp metadata:', meta);
      // Sample top-left corner pixel
      return sharp('public/new-images/services/webdev/related-web-development.webp')
        .extract({ left: 10, top: 10, width: 1, height: 1 })
        .raw()
        .toBuffer({ resolveWithObject: true });
    })
    .then(({ data, info }) => {
      console.log('Top-left pixel (10,10):', [...data], 'channels:', info.channels);
    })
    .catch(err => console.log('Sharp error:', err.message));
} catch (e) {
  console.log('No sharp, checking other ways');
}
