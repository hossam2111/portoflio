import { Jimp } from 'jimp';

async function processNewLogo() {
  try {
    console.log('Reading new logo...');
    const image = await Jimp.read('C:/Users/VIP/.gemini/antigravity-ide/brain/f0da3fb5-5b82-45b6-bb25-e8c8ebdd7e9b/new_logo_1780941860245.png');
    
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

    console.log('Saving processed logo...');
    await image.write('C:/Users/VIP/Desktop/portfolio ibrahiam/public/logo.png');
    console.log('Logo processed and saved to public/logo.png successfully!');
  } catch (error) {
    console.error('Error processing logo:', error);
  }
}

processNewLogo();
