# Pexels API Setup Guide

## Getting Your Pexels API Key

1. **Sign up for Pexels:**
   - Go to https://www.pexels.com/api/
   - Click "Get Started" or "Sign Up"
   - Create a free account

2. **Get API Key:**
   - After signing up, go to your account dashboard
   - Navigate to "API" section
   - Copy your API key (starts with a long string of characters)

3. **Set API Key:**
   - Create a `.env` file in the project root (or use existing one)
   - Add your API key:
     ```
     PEXELS_API_KEY=your_api_key_here
     ```
   - The key will be automatically loaded from `.env` file
   - **Note:** Make sure `.env` is in `.gitignore` (don't commit API keys!)

## Using the Pexels API

### Search for Images

The `searchImages()` function allows you to search for images:

```javascript
const { searchImages } = require('./pexels-config');

// Search for construction safety images
const results = await searchImages('construction safety inspection', 10, 1);
console.log(results.photos);
```

### Get Images for Specific Pages

The `getPageImages()` function returns curated images for each page:

```javascript
const { getPageImages } = require('./pexels-config');

// Get images for homepage
const homepageImages = await getPageImages('homepage');

// Get images for SSHO services page
const sshoImages = await getPageImages('ssho-services');

// Get images for safety representatives page
const safetyRepImages = await getPageImages('safety-representatives');
```

## Image Requirements

### Homepage
- **Hero Image:** Construction site with safety professionals (1920×600px, 16:5 ratio)
- **Services Section:** Workers in proper PPE (1200×800px, 3:2 ratio)

### SSHO Services Page
- **Hero Image:** Military construction site or federal project (1920×600px)
- **Services Section:** SSHO conducting inspection (1200×800px)

### Safety Representatives Page
- **Hero Image:** Safety meeting or jobsite inspection (1920×600px)
- **Services Section:** Safety training or inspection (1200×800px)

## Recommended Search Queries

- `construction safety inspection`
- `military construction site`
- `safety professional hard hat`
- `construction worker safety`
- `safety meeting construction`
- `highway construction safety`
- `construction safety training`

## Image Usage Guidelines

1. **License:** All Pexels images are free for commercial use
2. **Attribution:** Not required but appreciated (can add photographer credit in alt text)
3. **Modifications:** Allowed - you can edit, crop, and modify images
4. **Download:** Download images and host them locally for better performance

## Downloading Images

For a static site, you'll want to download images rather than hotlinking:

### Automated Download (Recommended)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the download script:**
   ```bash
   # Download images for all pages
   npm run download-images:all
   
   # Or download for specific pages:
   npm run download-images:homepage
   npm run download-images:ssho
   npm run download-images:safety
   ```

   The script will:
   - Read `PEXELS_API_KEY` from your `.env` file
   - Search for appropriate images for each page
   - Download the best images to `assets/images/`
   - Save metadata (photographer, alt text, etc.) as JSON files

3. **Manual Download (Alternative):**
   - Use the Pexels website to search and download images
   - Save to `assets/images/` directory
   - Optimize images (compress, convert to WebP if possible)

## Image Optimization

Before using images on the site:

1. **Resize:** Resize to appropriate dimensions (see requirements above)
2. **Compress:** Use tools like TinyPNG or ImageOptim
3. **Format:** Convert to WebP for better compression (with JPEG fallback)
4. **Lazy Load:** Implement lazy loading for images below the fold

## Example Image Integration

```html
<!-- In your HTML -->
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

## API Rate Limits

- **Free Tier:** 200 requests per hour
- **Paid Tier:** Higher limits available

For static sites, you'll typically search once, download images, and host them locally, so rate limits shouldn't be an issue.

## Troubleshooting

**Error: "Invalid API Key"**
- Verify your API key is correct
- Make sure there are no extra spaces
- Check that the API key is set in the environment or config file

**Error: "Rate Limit Exceeded"**
- Wait an hour before making more requests
- Consider upgrading to paid tier if needed
- For static sites, download images once and host locally

**No Results Found**
- Try different search queries
- Use more general terms
- Check spelling

## Next Steps

1. Get your Pexels API key
2. Search for appropriate images using the recommended queries
3. Download and optimize images
4. Add images to HTML pages with proper alt text
5. Implement lazy loading for performance
