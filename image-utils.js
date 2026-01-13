/**
 * Image Utilities for Construction Safety Consulting Micro-Site
 * 
 * Utilities for managing and optimizing images from Pexels API
 */

/**
 * Image requirements for each page
 */
const IMAGE_REQUIREMENTS = {
  homepage: {
    hero: {
      query: 'construction safety inspection professional',
      description: 'Hero image: Construction site with safety professionals conducting inspection',
      dimensions: { width: 1920, height: 600 },
      aspectRatio: '16:5'
    },
    services: {
      query: 'construction workers safety equipment',
      description: 'Services section: Workers in proper PPE',
      dimensions: { width: 1200, height: 800 },
      aspectRatio: '3:2'
    }
  },
  'ssho-services': {
    hero: {
      query: 'military construction site federal project',
      description: 'Hero image: SSHO conducting safety inspection at military construction site',
      dimensions: { width: 1920, height: 600 },
      aspectRatio: '16:5'
    },
    services: {
      query: 'construction safety officer inspection',
      description: 'Services section: Safety officer conducting inspection',
      dimensions: { width: 1200, height: 800 },
      aspectRatio: '3:2'
    }
  },
  'safety-representatives': {
    hero: {
      query: 'construction safety meeting toolbox talk',
      description: 'Hero image: Safety representative conducting jobsite inspection or safety meeting',
      dimensions: { width: 1920, height: 600 },
      aspectRatio: '16:5'
    },
    services: {
      query: 'construction worker safety training',
      description: 'Services section: Safety training or inspection',
      dimensions: { width: 1200, height: 800 },
      aspectRatio: '3:2'
    }
  }
};

/**
 * Recommended image search queries
 */
const RECOMMENDED_QUERIES = [
  // Construction Safety
  'construction safety inspection',
  'construction workers safety',
  'safety professional hard hat',
  'construction worker PPE',
  'construction site safety',
  
  // Military/Federal
  'military construction site',
  'federal construction project',
  'USACE construction',
  'NAVFAC construction',
  
  // Safety Professionals
  'construction safety officer',
  'safety inspector construction',
  'safety meeting construction',
  'toolbox talk construction',
  
  // Caltrans/Highway
  'highway construction safety',
  'road construction safety',
  'bridge construction safety',
  
  // Training
  'construction safety training',
  'worker safety training',
  'safety orientation construction'
];

/**
 * Generate image placeholder HTML with lazy loading
 * @param {Object} image - Image object from Pexels
 * @param {string} size - Size variant to use
 * @param {string} alt - Alt text
 * @param {string} className - CSS class names
 * @returns {string} HTML img tag
 */
function generateImageHTML(image, size = 'large', alt = '', className = '') {
  const src = image[`url${size === '2x' ? '2x' : ''}`] || image.url;
  const srcset = image.url2x ? `${image.url} 1x, ${image.url2x} 2x` : image.url;
  
  return `
    <img 
      src="${src}" 
      srcset="${srcset}"
      alt="${alt || image.alt || 'Construction safety photo'}"
      class="${className}"
      loading="lazy"
      width="${image.width || '1200'}"
      height="${image.height || '800'}"
    />
  `;
}

/**
 * Generate responsive image with multiple sizes
 * @param {Object} image - Image object from Pexels
 * @param {string} alt - Alt text
 * @param {string} className - CSS class names
 * @returns {string} HTML picture element with sources
 */
function generateResponsiveImage(image, alt = '', className = '') {
  return `
    <picture>
      <source 
        media="(min-width: 1200px)" 
        srcset="${image.urlOriginal || image.url2x || image.url}"
      />
      <source 
        media="(min-width: 768px)" 
        srcset="${image.url2x || image.url}"
      />
      <img 
        src="${image.url}" 
        alt="${alt || image.alt || 'Construction safety photo'}"
        class="${className}"
        loading="lazy"
        width="${image.width || '1200'}"
        height="${image.height || '800'}"
      />
    </picture>
  `;
}

/**
 * Validate image meets requirements
 * @param {Object} image - Image object from Pexels
 * @param {Object} requirements - Image requirements (dimensions, aspect ratio)
 * @returns {boolean} Whether image meets requirements
 */
function validateImage(image, requirements) {
  if (!requirements) return true;

  const { dimensions, aspectRatio } = requirements;
  
  if (dimensions) {
    const minWidth = dimensions.width * 0.8; // Allow 20% variance
    const minHeight = dimensions.height * 0.8;
    
    if (image.width < minWidth || image.height < minHeight) {
      return false;
    }
  }

  if (aspectRatio) {
    const [width, height] = aspectRatio.split(':').map(Number);
    const imageRatio = image.width / image.height;
    const targetRatio = width / height;
    const variance = Math.abs(imageRatio - targetRatio) / targetRatio;
    
    if (variance > 0.2) { // Allow 20% variance
      return false;
    }
  }

  return true;
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    IMAGE_REQUIREMENTS,
    RECOMMENDED_QUERIES,
    generateImageHTML,
    generateResponsiveImage,
    validateImage
  };
}
