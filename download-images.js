#!/usr/bin/env node

/**
 * Download Images from Pexels
 * 
 * This script downloads images from Pexels API for the Construction Safety Consulting micro-site.
 * It reads the PEXELS_API_KEY from .env file and downloads images for each page.
 * 
 * Usage:
 *   node download-images.js [page-type]
 * 
 * Examples:
 *   node download-images.js homepage
 *   node download-images.js ssho-services
 *   node download-images.js safety-representatives
 *   node download-images.js all
 */

// Load environment variables first
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Try local .env first, then root .env
const localEnv = path.join(__dirname, '.env');
const rootEnv = path.join(__dirname, '../../../../.env');

if (fs.existsSync(localEnv)) {
  dotenv.config({ path: localEnv });
} else if (fs.existsSync(rootEnv)) {
  dotenv.config({ path: rootEnv });
} else {
  dotenv.config();
}

const { getPageImages, downloadImage } = require('./pexels-config-node');
const fs = require('fs');
const path = require('path');

// Ensure images directory exists
const imagesDir = path.join(__dirname, 'assets', 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

async function downloadPageImages(pageType) {
  console.log(`\n📸 Fetching images for: ${pageType}`);
  console.log('─'.repeat(50));

  try {
    const images = await getPageImages(pageType);
    console.log(`Found ${images.length} images`);

    if (images.length === 0) {
      console.log('No images found. Check your API key and try again.');
      return;
    }

    // Download first 3 images (hero + 2 service images)
    const imagesToDownload = images.slice(0, 3);
    
    for (let i = 0; i < imagesToDownload.length; i++) {
      const img = imagesToDownload[i];
      const filename = `${pageType}-${i === 0 ? 'hero' : `service-${i}`}.jpg`;
      const filepath = path.join(imagesDir, filename);

      console.log(`\n📥 Downloading: ${filename}`);
      console.log(`   URL: ${img.urlOriginal}`);
      console.log(`   Photographer: ${img.photographer}`);
      console.log(`   Dimensions: ${img.width}×${img.height}px`);

      try {
        await downloadImage(img.urlOriginal, filename);
        console.log(`   ✅ Saved to: ${filepath}`);

        // Save metadata
        const metadata = {
          filename,
          url: img.urlOriginal,
          photographer: img.photographer,
          photographerUrl: img.photographerUrl,
          alt: img.alt,
          width: img.width,
          height: img.height,
          pageType
        };

        const metadataFile = path.join(imagesDir, `${filename}.json`);
        fs.writeFileSync(metadataFile, JSON.stringify(metadata, null, 2));
        console.log(`   📝 Metadata saved: ${metadataFile}`);

      } catch (error) {
        console.error(`   ❌ Error downloading ${filename}:`, error.message);
      }
    }

    console.log(`\n✅ Completed downloads for ${pageType}`);

  } catch (error) {
    console.error(`\n❌ Error fetching images for ${pageType}:`, error.message);
    if (error.message.includes('PEXELS_API_KEY')) {
      console.error('\n💡 Make sure you have PEXELS_API_KEY in your .env file');
    }
  }
}

async function main() {
  const pageType = process.argv[2] || 'all';
  const validPageTypes = ['homepage', 'ssho-services', 'safety-representatives', 'all'];

  if (!validPageTypes.includes(pageType)) {
    console.error(`Invalid page type: ${pageType}`);
    console.error(`Valid options: ${validPageTypes.join(', ')}`);
    process.exit(1);
  }

  console.log('🚀 Pexels Image Downloader');
  console.log('═'.repeat(50));

  if (pageType === 'all') {
    await downloadPageImages('homepage');
    await downloadPageImages('ssho-services');
    await downloadPageImages('safety-representatives');
  } else {
    await downloadPageImages(pageType);
  }

  console.log('\n' + '═'.repeat(50));
  console.log('✨ All done! Check assets/images/ for downloaded files');
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
