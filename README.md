# Seravelle Kithulgala – Beachfront Resort & Hotel Website

> *"Welcome to Seravelle Kithulgala, the paradise near the blue sea."*

Cozy is a production-ready, multi-page beachfront resort and luxury hotel website crafted with semantic HTML5, modern CSS3 (CSS custom properties, Flexbox, Grid), Bootstrap 5, and vanilla JavaScript. Designed for speed, accessibility, elegant aesthetics, and conversion.

---

## 📁 1. Project Folder Structure

```
cozy-resort/
├── index.html                   # Homepage with full-screen hero & booking card
├── about.html                   # Resort heritage, pillars, and leadership
├── room.html                    # Room catalogue with category filters & comparison
├── room-superior-twin.html      # Superior Room Twin showcase & gallery
├── room-premier-suite.html      # Premier Suite with plunge pool showcase
├── room-family.html             # Grand Family Beachfront Suite showcase
├── dining.html                  # Azure Restaurant, Driftwood Bar & table reservation
├── amenities.html               # Infinity pool, Serenity Spa, and marine sports
├── booking.html                 # Interactive multi-step booking engine & price calculator
├── blog.html                    # Seravelle Journal travel stories and guides
├── contact.html                 # Short contact inquiry form, direct lines & FAQs
├── plan-your-stay.html          # Pre-arrival packing list, transfers & 3-day itinerary
├── 404.html                     # Custom friendly 404 error page with search
├── privacy-policy.html          # GDPR/CCPA privacy standards & booking terms
├── sitemap.xml                  # Search engine XML sitemap
├── robots.txt                   # Search crawler indexing rules
├── css/
│   └── style.css                # Design system variables, components & responsive styles
├── js/
│   ├── main.js                  # Navigation, sticky header, lightbox, modals & toasts
│   ├── booking.js               # Dynamic price engine, dates, add-ons & voucher
│   └── search-data.js           # Live fuzzy search database across all pages/amenities
└── README.md                    # Setup documentation & UX compliance checklist
```

---

## 🚀 2. Quick Setup & Local Preview

This project requires **zero build tools** or package installation. You can run it immediately on any local HTTP server:

### Option A: Python 3 Built-in Server
Open terminal in the project directory:
```bash
python -m http.server 8000
```
Then visit `http://localhost:8000` in your web browser.

### Option B: Node.js `npx serve`
```bash
npx serve .
```

### Option C: VS Code Live Server
Right-click on `index.html` and select **"Open with Live Server"**.

---

## 🔒 3. Production Deployment with HTTPS

To deploy to production with free, automatic SSL certificates (HTTPS):

### Method 1: Netlify (Recommended)
1. Drag and drop the `cozy-resort/` folder into your [Netlify](https://app.netlify.com/drop) dashboard.
2. In **Domain management**, configure your custom domain (`seravelle.com`).
3. Netlify will provision a free Let's Encrypt SSL certificate automatically with HTTP-to-HTTPS redirect enabled.

### Method 2: Vercel
Run via Vercel CLI:
```bash
vercel deploy --prod
```
Automatic HTTPS is enabled by default.

### Method 3: GitHub Pages
1. Push repository to GitHub.
2. Go to **Settings > Pages** and select `main` branch root.
3. Check **"Enforce HTTPS"**.

---

## ✅ 4. Mandatory UX / Quality Rules Verification Checklist

| # | UX / Quality Rule | Implementation Detail | Status |
|---|---|---|:---:|
| **1** | **Clear & Simple Navigation** | Sticky transparent header turning solid navy on scroll; Rooms dropdown linking to all rooms; thin coral underline active page indicator; instant search bar; breadcrumbs on all inner pages. | **PASSED** |
| **2** | **Mobile Responsiveness** | Responsive breakpoints at 576px, 768px, 992px, 1200px; slide-out mobile drawer with hamburger button; booking card stacks under hero text; touch targets minimum 48px. | **PASSED** |
| **3** | **Fast Loading Speed** | Zero bloated frameworks; optimized Unsplash images with explicit `width`, `height`, and `loading="lazy"`; Google Fonts preloaded with `display=swap`; deferred scripts. | **PASSED** |
| **4** | **Clean Visual Hierarchy** | Strict `h1 > h2 > h3` structure with one unique `<h1>` per page; rhythm via alternating background sections (white / sand `#FAF5ED` / navy `#0A2342`). | **PASSED** |
| **5** | **Readable Typography** | Body copy minimum 16px with line-height 1.65; headings scaled up to 64px (`Playfair Display`); WCAG AA contrast ratio compliance (minimum 4.5:1). | **PASSED** |
| **6** | **Clear Calls-to-Action** | High-contrast coral/rust pill CTA buttons (`.btn-coral`); secondary white/navy outlines; sticky "Book Now" floating bar on mobile screens. | **PASSED** |
| **7** | **Consistent Design** | Centralized CSS tokens in `:root` (`--color-navy`, `--color-teal`, `--color-sand`, `--color-coral`); reusable components across all 11+ HTML pages. | **PASSED** |
| **8** | **Accessibility (A11y)** | Skip to main content link (`#main-content`); semantic HTML5 tags (`<main>`, `<section>`, `<article>`, `<nav>`); ARIA roles and labels; high-visibility focus rings; `prefers-reduced-motion` support. | **PASSED** |
| **9** | **Interactive Feedback** | Smooth 0.3s cubic transitions; loading spinners on form submits; accessible Lightbox gallery; live toast notification system for instant booking/contact alerts. | **PASSED** |
| **10** | **Simple & Short Forms** | Hero booking form contains only the 3 essential fields (check-in, check-out, guests); contact form contains only name, email, message; newsletter is email only. | **PASSED** |
| **11** | **Trust Signals & Security** | Displayed awards ("4.8/5 – 1,200 reviews"); payment badges (Visa, Mastercard, Amex, PayPal); 256-bit SSL lock badge; clear Privacy Policy & Terms links. | **PASSED** |
| **12** | **Helpful Error Handling** | Friendly custom `404.html` with search box and direct recovery links; date picker restricts past dates and ensures check-out is after check-in. | **PASSED** |
| **13** | **Scannable Content** | Short 2–3 line descriptive paragraphs; bulleted feature lists; clear room spec tables; pricing prominently badged. | **PASSED** |
| **14** | **Zero Intrusive Pop-ups** | No auto-playing videos; non-blocking bottom cookie banner with "Accept All" & "Essential Only" persisted in localStorage; all modals dismissible via Esc key. | **PASSED** |

---

## 🎨 5. Brand Color Tokens

- **Deep Navy:** `#0A2342`
- **Ocean Teal:** `#1FA2A6`
- **Sand Light:** `#FAF5ED` / Sand Base: `#F4E9D8`
- **Coral / Rust CTA:** `#C0442B` (Hover: `#A5361F`)
- **Dark Text:** `#1F2937`
- **Pure White:** `#FFFFFF`

