# Image Integration Guide

## Pexels API Setup Complete

The Pexels API configuration and utilities have been set up. To integrate professional construction safety photos:

## Quick Start

1. **Get Pexels API Key:**
   - Sign up at https://www.pexels.com/api/
   - Get your API key from the dashboard
   - Set it in `pexels-config.js` or as environment variable

2. **Search for Images:**
   Use the provided utilities to search for images:
   ```javascript
   const { getPageImages } = require('./pexels-config');
   const images = await getPageImages('homepage');
   ```

3. **Download Images:**
   - Manually download from Pexels website (recommended for static sites)
   - Or use a Node.js script to automate downloads
   - Save to `assets/images/` directory

4. **Optimize Images:**
   - Resize to appropriate dimensions (see requirements below)
   - Compress using TinyPNG or similar
   - Convert to WebP format (with JPEG fallback)

5. **Add to HTML:**
   ```html
   <img 
     src="assets/images/construction-safety-hero.jpg"
     srcset="assets/images/construction-safety-hero.jpg 1x, 
             assets/images/construction-safety-hero-2x.jpg 2x"
     alt="Construction safety professional conducting site inspection"
     loading="lazy"
     width="1920"
     height="600"
   />
   ```

## Image Requirements by Page

### Homepage
- **Hero Image:** 1920×600px (16:5 ratio)
  - Query: "construction safety inspection professional"
  - Description: Construction site with safety professionals

- **Services Section:** 1200×800px (3:2 ratio)
  - Query: "construction workers safety equipment"
  - Description: Workers in proper PPE

### SSHO Services Page
- **Hero Image:** 1920×600px
  - Query: "military construction site federal project"
  - Description: SSHO at military construction site

- **Services Section:** 1200×800px
  - Query: "construction safety officer inspection"
  - Description: Safety officer conducting inspection

### Safety Representatives Page
- **Hero Image:** 1920×600px
  - Query: "construction safety meeting toolbox talk"
  - Description: Safety meeting or jobsite inspection

- **Services Section:** 1200×800px
  - Query: "construction worker safety training"
  - Description: Safety training or inspection

## Recommended Search Queries

- `construction safety inspection`
- `military construction site`
- `safety professional hard hat`
- `construction worker safety`
- `safety meeting construction`
- `highway construction safety`
- `construction safety training`
- `federal construction project`
- `USACE construction`
- `NAVFAC construction`

## Image Optimization Checklist

- [ ] Downloaded from Pexels
- [ ] Resized to appropriate dimensions
- [ ] Compressed (under 200KB per image)
- [ ] Converted to WebP (with JPEG fallback)
- [ ] Added descriptive alt text
- [ ] Implemented lazy loading
- [ ] Added srcset for responsive images
- [ ] Tested on mobile devices

## Next Steps

1. Get Pexels API key
2. Search for appropriate images using recommended queries
3. Download and optimize images
4. Add images to HTML pages
5. Test image loading and performance

## Files Created

- `pexels-config.js` - Pexels API configuration and search functions
- `image-utils.js` - Image utilities and helpers
- `PEXELS_SETUP.md` - Detailed setup instructions

## Notes

- All Pexels images are free for commercial use
- Attribution not required but appreciated
- Images can be modified/cropped as needed
- For static sites, download images once and host locally (better performance)
