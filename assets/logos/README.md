# Logo Assets

This directory contains logo files for the Construction Safety Consulting micro-site.

## Files

- **final-logo.svg** - Main EHS Analytical Solutions logo (422×166px)
  - Original logo from main site
  - Used in header/navigation
  - SVG format for scalability

- **logo-with-division.svg** - Logo with "A Division of EHS Analytical Solutions, Inc." text
  - Combined logo and division text
  - Can be used in footer or special sections
  - SVG format

## Usage

### In HTML
```html
<!-- Header logo -->
<a href="/" class="logo">
    <img src="assets/logos/final-logo.svg" alt="EHS Analytical Solutions" class="logo-img" />
    <span class="logo-division">A Division of <a href="https://ehsanalytical.com" target="_blank" rel="noopener">EHS Analytical Solutions</a></span>
</a>
```

### CSS Styling
```css
.logo-img {
    height: 60px;
    width: auto;
    max-width: 200px;
}

@media (min-width: 768px) {
    .logo-img {
        height: 70px;
        max-width: 250px;
    }
}
```

## Logo Guidelines

- **Minimum Size:** 200px width (for readability)
- **Aspect Ratio:** Maintain original 422:166 ratio
- **Format:** SVG preferred (scalable, crisp at all sizes)
- **Colors:** Logo uses brand colors (#1E405A navy, #F6A90F gold, #157637 green)
- **Link:** Logo should link to homepage when in header

## Favicon

For favicon, use a simplified version or extract the icon portion of the logo:
- Recommended size: 32×32px or 64×64px
- Format: SVG (preferred) or PNG
- Can be generated from the main logo

## Source

Logo originally from:
- WordPress media library: `/wp-content/uploads/2019/09/final-logo.svg`
- Main site: https://ehsanalytical.com
