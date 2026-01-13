# Construction Safety Consulting - Micro-Site

**Domain:** constructionsafety.consulting  
**Deployment:** Vercel (or similar static hosting)  
**Status:** Ready for deployment

---

## Files

- `index.html` - Homepage
- `ssho-services.html` - SSHO Services page
- `safety-representatives.html` - Safety Representatives page
- `styles.css` - Shared stylesheet
- `script.js` - JavaScript for mobile menu
- `vercel.json` - Vercel deployment configuration

---

## Deployment to Vercel

### Option 1: Vercel CLI

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Navigate to project directory
cd constructionsafety-microsite

# Deploy
vercel

# Follow prompts:
# - Link to existing project or create new
# - Set project name: constructionsafety-consulting
# - Set domain: constructionsafety.consulting
```

### Option 2: Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Import Git repository or drag-and-drop folder
3. Configure:
   - **Framework Preset:** Other
   - **Build Command:** (leave empty)
   - **Output Directory:** (leave empty)
   - **Install Command:** (leave empty)
4. Add custom domain: `constructionsafety.consulting`
5. Deploy

---

## Domain Setup

1. **Purchase domain:** constructionsafety.consulting
2. **Add to Vercel:**
   - Go to Project Settings → Domains
   - Add `constructionsafety.consulting`
   - Follow DNS configuration instructions
3. **301 Redirect:** Set up redirect from `onsitesafety.consulting` → `constructionsafety.consulting`

---

## Customization

### Colors
Edit CSS variables in `styles.css`:
```css
:root {
    --navy-blue: #003366;
    --safety-orange: #FF6600;
    /* ... */
}
```

### Content
- Edit HTML files directly
- All content is in semantic HTML
- Easy to update text, links, contact info

### Images
- Add images to `/images/` folder
- Update image paths in HTML
- Optimize images (WebP format recommended)

---

## Testing

### Local Testing
```bash
# Using Python
python3 -m http.server 8000

# Using Node.js
npx serve

# Open browser: http://localhost:8000
```

### Checklist
- [ ] All pages load correctly
- [ ] Navigation works on all pages
- [ ] Mobile menu functions
- [ ] Links work (internal and external)
- [ ] Contact buttons work (phone, email)
- [ ] Responsive on mobile, tablet, desktop
- [ ] Images load (if added)
- [ ] Page speed acceptable

---

## SEO

### Meta Tags
Each page has:
- Unique `<title>` tag
- Unique meta description
- Proper heading hierarchy (H1, H2, H3)

### Next Steps
1. Submit sitemap to Google Search Console
2. Set up Google Analytics
3. Add structured data (JSON-LD) if needed
4. Monitor indexing (30-60 days)

---

## Maintenance

### Update Contact Info
Search and replace in all HTML files:
- Phone: `(619) 288-3094`
- Email: `adam@ehsanalytical.com`

### Add New Pages
1. Create new HTML file
2. Copy structure from existing page
3. Update navigation in all pages
4. Add route to `vercel.json` if needed

---

## Support

**Contact:** Adam Fillmore  
**Email:** adam@ehsanalytical.com  
**Phone:** (619) 288-3094

---

## Notes

- Site is static HTML/CSS/JS (no build process needed)
- Works with any static hosting (Vercel, Netlify, GitHub Pages, etc.)
- No database or server-side code required
- Fast loading, SEO-friendly, mobile-responsive
