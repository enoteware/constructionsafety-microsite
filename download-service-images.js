#!/usr/bin/env node

/**
 * Download specific service images from Pexels
 * Downloads US federal building and OSHA construction training images
 */

const path = require('path');
const fs = require('fs');
const https = require('https');
const { searchImages } = require('./pexels-config-node');

const imagesDir = path.join(__dirname, 'images');

// Ensure images directory exists
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

/**
 * Download image from URL
 */
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        resolve(filepath);
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

async function downloadServiceImages() {
  console.log('🔍 Searching for US federal building image...\n');
  
  try {
    // Search for US federal/government building
    const federalQueries = [
      'US federal building construction',
      'government building construction USA',
      'federal construction project building'
    ];
    
    let federalImage = null;
    for (const query of federalQueries) {
      console.log(`  Searching: "${query}"`);
      const results = await searchImages(query, 10, 1);
      
      if (results.photos && results.photos.length > 0) {
        // Look for images that show buildings/construction
        const suitable = results.photos.find(photo => 
          photo.alt && (
            photo.alt.toLowerCase().includes('building') ||
            photo.alt.toLowerCase().includes('construction') ||
            photo.alt.toLowerCase().includes('federal') ||
            photo.alt.toLowerCase().includes('government')
          )
        ) || results.photos[0];
        
        federalImage = suitable;
        console.log(`  ✓ Found: ${federalImage.alt || 'Federal building image'}`);
        break;
      }
    }
    
    if (!federalImage) {
      throw new Error('Could not find suitable federal building image');
    }
    
    console.log('\n🔍 Searching for OSHA construction training image...\n');
    
    // Search for OSHA construction training
    const trainingQueries = [
      'OSHA construction training',
      'construction safety training hard hat',
      'construction worker safety training',
      'construction safety meeting training'
    ];
    
    let trainingImage = null;
    for (const query of trainingQueries) {
      console.log(`  Searching: "${query}"`);
      const results = await searchImages(query, 10, 1);
      
      if (results.photos && results.photos.length > 0) {
        // Look for images that show training/construction
        const suitable = results.photos.find(photo => 
          photo.alt && (
            photo.alt.toLowerCase().includes('training') ||
            photo.alt.toLowerCase().includes('construction') ||
            photo.alt.toLowerCase().includes('safety') ||
            photo.alt.toLowerCase().includes('hard hat')
          )
        ) || results.photos[0];
        
        trainingImage = suitable;
        console.log(`  ✓ Found: ${trainingImage.alt || 'Construction training image'}`);
        break;
      }
    }
    
    if (!trainingImage) {
      throw new Error('Could not find suitable training image');
    }
    
    // Download images
    console.log('\n📥 Downloading images...\n');
    
    const federalPath = path.join(imagesDir, 'service-federal.jpg');
    const trainingPath = path.join(imagesDir, 'service-training.jpg');
    
    console.log('  Downloading federal building image...');
    await downloadImage(federalImage.src.large, federalPath);
    console.log(`  ✓ Saved: ${federalPath}`);
    
    console.log('  Downloading training image...');
    await downloadImage(trainingImage.src.large, trainingPath);
    console.log(`  ✓ Saved: ${trainingPath}`);
    
    console.log('\n✅ All images downloaded successfully!');
    console.log('\nImage details:');
    console.log(`  Federal: ${federalImage.alt || 'Federal building'} (Photo by ${federalImage.photographer})`);
    console.log(`  Training: ${trainingImage.alt || 'Construction training'} (Photo by ${trainingImage.photographer})`);
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

downloadServiceImages();
