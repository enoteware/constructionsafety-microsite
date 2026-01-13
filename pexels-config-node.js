/**
 * Pexels API Configuration for Node.js
 * 
 * This version loads the API key from .env file using dotenv
 * Use this for Node.js scripts and build processes
 */

// Load environment variables from .env file
// Try local .env first, then fall back to root .env
const path = require('path');
const fs = require('fs');

// Check for .env in current directory
const localEnv = path.join(__dirname, '.env');
const rootEnv = path.join(__dirname, '../../../../.env');

if (fs.existsSync(localEnv)) {
  require('dotenv').config({ path: localEnv });
} else if (fs.existsSync(rootEnv)) {
  require('dotenv').config({ path: rootEnv });
} else {
  require('dotenv').config(); // Try default location
}

const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
const PEXELS_API_URL = 'https://api.pexels.com/v1';

if (!PEXELS_API_KEY) {
  console.warn('Warning: PEXELS_API_KEY not found in .env file');
  console.warn('Please add PEXELS_API_KEY=your_key_here to your .env file');
}

/**
 * Search for images on Pexels
 * @param {string} query - Search query (e.g., "construction safety inspection")
 * @param {number} perPage - Number of results per page (default: 10, max: 80)
 * @param {number} page - Page number (default: 1)
 * @returns {Promise<Object>} Pexels API response with photos array
 */
async function searchImages(query, perPage = 10, page = 1) {
  if (!PEXELS_API_KEY) {
    throw new Error('PEXELS_API_KEY is not set. Please add it to your .env file.');
  }

  try {
    const response = await fetch(
      `${PEXELS_API_URL}/search?query=${encodeURIComponent(query)}&per_page=${perPage}&page=${page}`,
      {
        headers: {
          'Authorization': PEXELS_API_KEY
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Pexels API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching images from Pexels:', error);
    throw error;
  }
}

/**
 * Get curated images for specific page sections
 * @param {string} pageType - Type of page (homepage, ssho-services, safety-representatives)
 * @returns {Promise<Array>} Array of image objects with URLs and metadata
 */
async function getPageImages(pageType) {
  const imageQueries = {
    'homepage': [
      'construction safety inspection',
      'construction workers safety',
      'safety professional hard hat'
    ],
    'ssho-services': [
      'military construction site',
      'federal construction project',
      'construction safety officer inspection'
    ],
    'safety-representatives': [
      'construction safety inspection',
      'safety meeting construction',
      'construction worker safety training'
    ]
  };

  const queries = imageQueries[pageType] || imageQueries['homepage'];
  const allImages = [];

  for (const query of queries) {
    try {
      const results = await searchImages(query, 5, 1);
      if (results.photos && results.photos.length > 0) {
        allImages.push(...results.photos.map(photo => ({
          id: photo.id,
          url: photo.src.large,
          url2x: photo.src.large2x,
          urlOriginal: photo.src.original,
          photographer: photo.photographer,
          photographerUrl: photo.photographer_url,
          alt: photo.alt || `${query} - Photo by ${photo.photographer}`,
          width: photo.width,
          height: photo.height
        })));
      }
    } catch (error) {
      console.error(`Error fetching images for query "${query}":`, error);
    }
  }

  return allImages;
}

/**
 * Download image from Pexels URL using Node.js
 * @param {string} imageUrl - URL of the image to download
 * @param {string} filename - Filename to save as
 * @returns {Promise<string>} Path to downloaded image
 */
async function downloadImage(imageUrl, filename) {
  const https = require('https');
  const fs = require('fs');
  const path = require('path');

  return new Promise((resolve, reject) => {
    const filepath = path.join(__dirname, 'assets', 'images', filename);
    const file = fs.createWriteStream(filepath);

    https.get(imageUrl, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download image: ${response.statusCode}`));
        return;
      }

      response.pipe(file);

      file.on('finish', () => {
        file.close();
        resolve(filepath);
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {}); // Delete the file on error
      reject(err);
    });
  });
}

/**
 * Generate optimized image URLs for different use cases
 * @param {Object} photo - Pexels photo object
 * @param {string} size - Size needed: 'thumbnail', 'small', 'medium', 'large', 'original'
 * @returns {string} Optimized image URL
 */
function getOptimizedImageUrl(photo, size = 'large') {
  const sizeMap = {
    'thumbnail': photo.src.tiny,
    'small': photo.src.small,
    'medium': photo.src.medium,
    'large': photo.src.large,
    'large2x': photo.src.large2x,
    'original': photo.src.original
  };

  return sizeMap[size] || photo.src.large;
}

/**
 * Generate proper alt text for images
 * @param {Object} photo - Pexels photo object
 * @param {string} context - Context where image is used
 * @returns {string} SEO-friendly alt text
 */
function generateAltText(photo, context = '') {
  if (photo.alt) {
    return photo.alt;
  }

  const baseText = context 
    ? `${context} - Photo by ${photo.photographer}`
    : `Construction safety photo by ${photo.photographer}`;

  return baseText;
}

// Export functions
module.exports = {
  searchImages,
  getPageImages,
  downloadImage,
  getOptimizedImageUrl,
  generateAltText,
  PEXELS_API_KEY
};

// Example usage:
/*
const { getPageImages, downloadImage } = require('./pexels-config-node');

async function main() {
  const images = await getPageImages('homepage');
  console.log('Found images:', images.length);
  
  for (let i = 0; i < Math.min(images.length, 3); i++) {
    const img = images[i];
    const filename = `homepage-hero-${i + 1}.jpg`;
    await downloadImage(img.urlOriginal, filename);
    console.log(`Downloaded: ${filename}`);
  }
}

main().catch(console.error);
*/
