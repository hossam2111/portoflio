import { Jimp } from 'jimp';
import fs from 'fs';

async function processNewLogo() {
  try {
    console.log('Reading new logo...');
    const image = await Jimp.read('C:/Users/Hossam/.gemini/antigravity-ide/brain/e135bb4b-c9f4-47ee-8852-0ec3a5d714dc/new_logo_gold_dark_1781173089232.png');
    
    console.log('Processing pixels to make dark background transparent...');
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
      const r = this.bitmap.data[idx + 0];
      const g = this.bitmap.data[idx + 1];
      const b = this.bitmap.data[idx + 2];
      
      // Calculate brightness
      const brightness = (r + g + b) / 3;
      
      // If the pixel is very dark (threshold: brightness < 45)
      // make it transparent.
      if (brightness < 45) {
        this.bitmap.data[idx + 3] = 0; // Set alpha to 0 (transparent)
      } else if (brightness < 70) {
        // Soft edge transition: scale alpha linearly for anti-aliasing
        const alpha = Math.floor(((brightness - 45) / (70 - 45)) * 255);
        this.bitmap.data[idx + 3] = alpha;
      }
    });

    console.log('Autocrop empty padding...');
    image.autocrop();

    console.log('Saving processed logo to public/logo.png...');
    const buffer = await image.getBuffer('image/png');
    fs.writeFileSync('./public/logo.png', buffer);
    console.log('Logo processed and saved successfully!');
  } catch (error) {
    console.error('Error processing logo:', error);
  }
}

processNewLogo();
