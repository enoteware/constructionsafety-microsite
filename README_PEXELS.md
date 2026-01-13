# Quick Start: Download Images from Pexels

Your Pexels API key is already configured in your `.env` file at the project root.

## Quick Download

1. **Install dependencies** (one-time setup):
   ```bash
   cd project-organization/02-micro-site-vercel/deployed-site/constructionsafety-microsite
   npm install
   ```

2. **Download images:**
   ```bash
   # Download images for all pages
   npm run download-images:all
   
   # Or download for specific pages:
   npm run download-images:homepage
   npm run download-images:ssho
   npm run download-images:safety
   ```

3. **Images will be saved to:**
   - `assets/images/homepage-hero.jpg`
   - `assets/images/homepage-service-1.jpg`
   - `assets/images/homepage-service-2.jpg`
   - etc.

4. **Metadata files** (photographer info, alt text) will be saved as `.json` files alongside images.

## What Gets Downloaded

- **Homepage:** 3 images (hero + 2 service images)
- **SSHO Services:** 3 images (hero + 2 service images)
- **Safety Representatives:** 3 images (hero + 2 service images)

## Next Steps

After downloading, you can:
1. Review the images in `assets/images/`
2. Optimize them (compress, convert to WebP)
3. Add them to your HTML pages
4. Use the metadata JSON files for proper alt text and attribution

## Troubleshooting

**Error: "PEXELS_API_KEY is not set"**
- Make sure your `.env` file is in the project root (`/Users/elliotnoteware/code/ehs/.env`)
- Verify it contains: `PEXELS_API_KEY=your_key_here`

**Error: "Cannot find module 'dotenv'"**
- Run `npm install` to install dependencies

**No images found**
- Check your API key is valid
- Verify you have internet connection
- Check Pexels API status
