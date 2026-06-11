import { Jimp } from 'jimp';

async function processNewLogo() {
  try {
    console.log('Reading new logo...');
    const image = await Jimp.read('C:/Users/Hossam/.gemini/antigravity-ide/brain/e135bb4b-c9f4-47ee-8852-0ec3a5d714dc/new_logo_gold_dark_1781173089232.png');
    
    console.log('Processing pixels to make white background transparent...');
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
      const r = this.bitmap.data[idx + 0];
      const g = this.bitmap.data[idx + 1];
      const b = this.bitmap.data[idx + 2];
      
      // If the pixel is very bright (white background: r > 240, g > 240, b > 240)
      // make it transparent.
      if (r > 240 && g > 240 && b > 240) {
        this.bitmap.data[idx + 3] = 0; // Set alpha to 0 (transparent)
      } else if (r > 220 && g > 220 && b > 220) {
        // Soft edge transition for white background anti-aliasing
        const avg = (r + g + b) / 3;
        const alpha = Math.floor(((255 - avg) / (255 - 220)) * 255);
        this.bitmap.data[idx + 3] = Math.min(this.bitmap.data[idx + 3], alpha);
      }
    });

    console.log('Saving processed logo to public/logo.png...');
    await image.write('C:/Users/Hossam/Desktop/portfolio ibrahiam/public/logo.png');
    console.log('Logo processed and saved successfully!');
  } catch (error) {
    console.error('Error processing logo:', error);
  }
}

processNewLogo();
