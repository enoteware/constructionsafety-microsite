/**
 * Pexels API Configuration
 * 
 * This file contains configuration and utilities for fetching images from Pexels API
 * for the Construction Safety Consulting micro-site.
 * 
 * To use:
 * 1. Get your Pexels API key from https://www.pexels.com/api/
 * 2. Set it as an environment variable or in this config file
 * 3. Use the searchImages function to find and download images
 */

// Load environment variables from .env file
// For Node.js: require('dotenv').config();
// For browser/build scripts: Use environment variables directly
const PEXELS_API_KEY = process.env.PEXELS_API_KEY || process.env.REACT_APP_PEXELS_API_KEY || 'YOUR_PEXELS_API_KEY_HERE';
const PEXELS_API_URL = 'https://api.pexels.com/v1';

/**
 * Search for images on Pexels
 * @param {string} query - Search query (e.g., "construction safety inspection")
 * @param {number} perPage - Number of results per page (default: 10, max: 80)
 * @param {number} page - Page number (default: 1)
 * @returns {Promise<Object>} Pexels API response with photos array
 */
async function searchImages(query, perPage = 10, page = 1) {
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
 * Download image from Pexels URL
 * Note: In a static site, you'll need to download images manually or use a build script
 * @param {string} imageUrl - URL of the image to download
 * @param {string} filename - Filename to save as
 * @returns {Promise<string>} Path to downloaded image
 */
async function downloadImage(imageUrl, filename) {
  // This would typically be used in a Node.js build script
  // For static sites, images should be downloaded manually or via build process
  console.log(`Download image from: ${imageUrl}`);
  console.log(`Save as: ${filename}`);
  return filename;
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

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    searchImages,
    getPageImages,
    downloadImage,
    getOptimizedImageUrl,
    generateAltText,
    PEXELS_API_KEY
  };
}

// Example usage (for Node.js scripts):
/*
const { getPageImages } = require('./pexels-config');

async function main() {
  const images = await getPageImages('homepage');
  console.log('Found images:', images.length);
  images.forEach(img => {
    console.log(`- ${img.alt}: ${img.url}`);
  });
}

main();
*/
