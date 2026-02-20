# Foxlite Consulting Logo Integration Guide

## 📁 File Structure
```
assets/
├── images/
│   └── logos/
│       └── foxlite/
│           ├── foxlite-logo-original.jpg    # Original high-res logo
│           ├── foxlite-logo-large.png       # 800px wide - Hero sections
│           ├── foxlite-logo-medium.png      # 400px wide - Headers
│           ├── foxlite-logo-small.png       # 200px wide - Navigation
│           ├── foxlite-logo-icon.png        # 64x64px - Icons
│           ├── foxlite-logo-thumbnail.png   # 150px wide - Cards
│           └── foxlite-favicon.ico          # 32x32px - Favicon
└── css/
    └── foxlite-logo.css                     # Logo styles

src/
├── assets/images/                           # Development assets
├── components/
│   └── FoxliteLogo.jsx                      # React component
└── assets/css/
    └── foxlite-logo.css                     # Development styles

public/
└── images/                                  # Production assets
```

## 🎨 Logo Variants

### Large Logo (800px)
- **Use for:** Hero sections, main headers, print materials
- **File:** `foxlite-logo-large.png`
- **CSS Class:** `.foxlite-logo-large`

### Medium Logo (400px)
- **Use for:** Page headers, content sections
- **File:** `foxlite-logo-medium.png`
- **CSS Class:** `.foxlite-logo-medium`

### Small Logo (200px)
- **Use for:** Navigation bars, sidebars
- **File:** `foxlite-logo-small.png`
- **CSS Class:** `.foxlite-logo-small`

### Icon Logo (64x64px)
- **Use for:** App icons, small UI elements
- **File:** `foxlite-logo-icon.png`
- **CSS Class:** `.foxlite-logo-icon`

### Thumbnail Logo (150px)
- **Use for:** Cards, listings, previews
- **File:** `foxlite-logo-thumbnail.png`
- **CSS Class:** `.foxlite-logo-thumbnail`

### Favicon (32x32px)
- **Use for:** Browser tab icon
- **File:** `foxlite-favicon.ico`

## 💻 HTML Usage

```html
<!-- Navigation -->
<img src="/images/foxlite-logo-small.png" alt="Foxlite Consulting" class="foxlite-logo">

<!-- Header -->
<img src="/images/foxlite-logo-medium.png" alt="Foxlite Consulting" class="foxlite-logo">

<!-- Hero Section -->
<img src="/images/foxlite-logo-large.png" alt="Foxlite Consulting" class="foxlite-logo">
```

## ⚛️ React Usage

```jsx
import FoxliteLogo from './components/FoxliteLogo';

// Different sizes
<FoxliteLogo size="large" />
<FoxliteLogo size="medium" />
<FoxliteLogo size="small" />
<FoxliteLogo size="icon" />

// With custom styling
<FoxliteLogo size="medium" className="custom-class" />

// With click handler
<FoxliteLogo size="small" onClick={handleLogoClick} />
```

## 📱 Responsive Guidelines

- **Desktop:** Use medium or large logos
- **Tablet:** Use medium or small logos  
- **Mobile:** Use small logos in navigation
- **Always** include `alt="Foxlite Consulting"` for accessibility

## 🎯 Brand Guidelines

- **Maintain aspect ratio** - never stretch or distort
- **Minimum size:** 100px wide for readability
- **Clear space:** Maintain space around logo equal to the height of the fox's hat
- **Background:** Works best on white or light backgrounds
- **Dark themes:** CSS includes brightness adjustment

## 🔧 Technical Notes

- All PNG files include transparency support
- Images are optimized for web performance
- Favicon is provided in ICO format for browser compatibility
- CSS includes hover effects and responsive breakpoints
