# DESIGN.md — Spartan AI Website Design Specification

> **Source**: [https://spartanai.framer.website/](https://spartanai.framer.website/)
> **Scanned**: 2026-06-04
> **Purpose**: Complete reconstruction-grade specification

---

## 1. SITE OVERVIEW

### Purpose & Positioning
Spartan AI is a **premium AI agency / template site** targeting enterprise AI deployment, neural engineering, and autonomous agent architecture. It is a Framer template designed for AI research labs, neural engineering firms, and high-end tech agencies. The site positions the brand as a luxury, authoritative provider of enterprise AI solutions — custom LLMs, agentic workflows, data pipelines, and RAG systems.

### Target Audience
- CTOs, VPs of Engineering, Founders, Enterprise Directors
- Fortune 500 firms looking for AI integration partners
- Healthcare, retail, logistics, and cybersecurity verticals

### Brand Voice & Tone
- **Authoritative** — technically precise language ("SOC2-compliant," "sub-50ms inference speeds")
- **Luxury-modern** — minimalist design with premium feel
- **Enterprise-serious** — no casual language; formal but not stuffy
- **Forward-looking** — emphasizes next-century, frontier, future-proof themes

### Overall Layout Paradigm
- **Deep-scroll single-page homepage** with linked subpages
- Sections alternate between light (off-white) and dark (near-black) backgrounds
- Horizontal marquee animations create visual rhythm between sections
- Subpages (`/project`, `/digital-brain`, `/articles`, `/about`, `/contact`) follow consistent layout conventions
- All pages share the same navbar, footer, FAQ section, and ticker bar

---

## 2. STRUCTURE & LAYOUT

### 2.1 Full Page/Section Hierarchy (Homepage, Top-to-Bottom)

| #  | Section Name                        | Background   | Theme |
|----|-------------------------------------|-------------|-------|
| 1  | Navbar (floating, sticky)           | White       | Light |
| 2  | Hero Section                        | Off-white + photo bg | Light |
| 3  | Client Logos Marquee                | Dark overlay on hero | Dark  |
| 4  | Metrics Dashboard Grid              | Off-white (`#f4f4f4`) | Light |
| 5  | Announcement Ticker                 | Dark (`#111`)  | Dark  |
| 6  | Our Works (Project Cards Marquee)   | Off-white   | Light |
| 7  | Capabilities Accordion              | Dark (`#111`–`#161616`) | Dark  |
| 8  | Our Vision (Scroll Reveal)          | Dark (`#111`) | Dark  |
| 9  | Tech Integration / Digital Brain    | Off-white   | Light |
| 10 | Experiences (Testimonials Slider)   | Off-white   | Light |
| 11 | Announcement Ticker (repeat)        | Dark (`#111`) | Dark  |
| 12 | Intelligence by Design (Video CTA)  | Off-white   | Light |
| 13 | Our Process Accordion               | Off-white   | Light |
| 14 | Build Now CTA Banner                | Dark        | Dark  |
| 15 | Team Members Carousel               | Off-white   | Light |
| 16 | Pricing Section                     | Off-white   | Light |
| 17 | Announcement Ticker (repeat)        | Dark        | Dark  |
| 18 | Common Queries (FAQ)                | Off-white   | Light |
| 19 | Insights (Articles Preview)         | Off-white   | Light |
| 20 | Footer                              | Dark green/nature bg | Dark  |

### 2.2 Layout System

```css
/* Container widths */
max-width: 1200px;       /* Primary content container */
max-width: 100%;         /* Full-bleed sections (hero, footer, marquees) */
padding-inline: 24px;    /* Mobile edge padding */
padding-inline: 40px;    /* Tablet edge padding */
padding-inline: 80px;    /* Desktop edge padding */

/* Layout approach */
display: flex;           /* Primary layout mode */
display: grid;           /* Used for cards, pricing, metrics */
gap: 16px–24px;          /* Standard card gaps */
```

- **Flexbox**: Primary layout for rows, split-column sections, navbar
- **CSS Grid**: Metrics dashboard (5-card asymmetric grid), pricing (4-column), project cards, articles masonry
- **Full-bleed**: Hero, marquee tickers, footer
- **Contained**: All content sections within ~1200px max-width

### 2.3 Breakpoints & Responsive Behavior

| Breakpoint | Width     | Behavior |
|-----------|-----------|----------|
| Desktop   | ≥1200px   | Full multi-column layouts, side-by-side hero, 4-col pricing |
| Tablet    | 768–1199px | 2-column grids, stacked hero elements, Digital Brain card moves below hero text |
| Mobile    | <768px    | Single column, hamburger nav (drawer), stacked pricing cards, full-width forms |

### 2.4 Z-Index Layering

```css
z-index: 1000;  /* Navbar — always on top, fixed position */
z-index: 100;   /* "Buy Spartan AI Template" floating badge (bottom-right) */
z-index: 50;    /* "Made in Framer" badge */
z-index: 10;    /* Testimonial cards over marquee backdrop */
z-index: 1;     /* Standard content */
z-index: -1;    /* Background marquee text (Experiences, Pricing, Our Works, Insights) */
```

### 2.5 Spacing System

```css
/* Section padding (vertical) */
padding-block: 80px–120px;    /* Major sections */
padding-block: 40px–60px;     /* Sub-sections */
padding-block: 24px;          /* Card internal padding */

/* Gaps */
gap: 8px;     /* Tight (label + icon) */
gap: 16px;    /* Cards in grid */
gap: 24px;    /* Standard between elements */
gap: 40px;    /* Between major section blocks */

/* Margins */
margin-bottom: 16px;   /* Heading to subheading */
margin-bottom: 24px;   /* Subheading to body */
margin-bottom: 40px;   /* Body to CTA */
```

---

## 3. TYPOGRAPHY

### 3.1 Font Families

| Role     | Font Family                               | Source        |
|----------|------------------------------------------|---------------|
| Display  | `Inter`, `Plus Jakarta Sans`             | Google Fonts / Framer built-in |
| Body     | `Inter`, `Plus Jakarta Sans`             | Google Fonts / Framer built-in |
| Mono     | `monospace` (system)                      | System        |
| Accent   | Same as display                           | —             |

> Framer uses its own font-loading system. The site appears to use **Inter** as the primary typeface with potential **Plus Jakarta Sans** as an alternative for display headings.

### 3.2 Type Scale

| Style              | Size      | Weight | Line Height | Letter Spacing | Transform    | Color Context |
|--------------------|-----------:|-------:|:-----------:|:--------------:|:-------------|:-------------|
| **H1 (Hero)**      | 72–90px   | 400 (line 1) / 700 (line 2) | 1.05–1.1 | -0.02em | None | `#111` on light, `#fff` on dark |
| **H2 (Section)**   | 36–48px   | 600–700 | 1.15 | -0.01em | None | `#111` or `#fff` |
| **H3 (Card Title)**| 24–28px   | 600 | 1.3 | 0 | None | `#111` or `#fff` |
| **H4 (Article)**   | 20–22px   | 600 | 1.35 | 0 | None | `#111` |
| **H5 (Name)**      | 14–16px   | 700 | 1.4 | 0.05em | Uppercase | `#111` or `#fff` |
| **H6 (Tier Label)**| 12–14px   | 500 | 1.4 | 0.08em | Uppercase | `#777` |
| **Body Large**     | 18px      | 400 | 1.6 | 0.02em | None | `#333` or `#ccc` |
| **Body**           | 16px      | 400 | 1.5 | 0.02em | None | `#555` or `#aaa` |
| **Body Small**     | 14px      | 400 | 1.5 | 0.02em | None | `#777` |
| **Caption**        | 12px      | 500 | 1.4 | 0.05em | Uppercase | `#999` or `#777` |
| **Mono Label**     | 12–14px   | 400 | 1.4 | 0.1em | Uppercase | `#999` or `#777` |
| **Button Text**    | 14–16px   | 500 | 1.0 | 0.02em | None | `#fff` (dark bg) or `#111` (light bg) |
| **Nav Links**      | 14px      | 400 | 1.0 | 0 | None | `#333` |
| **Price**          | 48–56px   | 700 | 1.0 | -0.02em | None | `#111` or `#fff` |
| **Stat Number**    | 36–42px   | 700 | 1.1 | -0.01em | None | `#111` or `#fff` |

### 3.3 Special Typography Patterns

- **Hero H1 line 1** ("Scale your ideas."): Lighter weight (~400), appears gray/faded (`#999` or `#aaa`)
- **Hero H1 line 2** ("Build with AI."): Bold weight (700), solid black (`#111`)
- **Monospace labels**: Used for section indicators like `// 01 COMPREHENSIVE STRATEGIC AUDIT`, `//SPARTAN`, `CAPABILITIES`
- **Marquee backdrop text**: Very large (~120–200px), ultra-light weight, acts as background decoration

---

## 4. COLOR SYSTEM

### 4.1 Full Palette

| Token                | Hex       | RGB              | Usage |
|---------------------|-----------|------------------|-------|
| `--bg-primary`      | `#F4F4F4` | `244, 244, 244`  | Page background, light sections |
| `--bg-secondary`    | `#F0F0F0` | `240, 240, 240`  | Alternate light sections |
| `--bg-dark`         | `#111111` | `17, 17, 17`     | Dark sections, capabilities, footer overlay |
| `--bg-dark-alt`     | `#161616` | `22, 22, 22`     | Dark section variations |
| `--bg-card-light`   | `#EAEAEA` | `234, 234, 234`  | Light mode card backgrounds |
| `--bg-card-hover`   | `#F9F9F9` | `249, 249, 249`  | Card hover state on light |
| `--bg-card-dark`    | `#1A1A1A` | `26, 26, 26`     | Highlighted cards (Pro tier, metric card 1) |
| `--bg-navbar`       | `#FFFFFF` | `255, 255, 255`  | Navbar background |
| `--text-primary`    | `#111111` | `17, 17, 17`     | Headings on light background |
| `--text-secondary`  | `#555555` | `85, 85, 85`     | Body text on light background |
| `--text-tertiary`   | `#777777` | `119, 119, 119`  | Captions, labels, secondary info |
| `--text-muted`      | `#999999` | `153, 153, 153`  | Muted text, monospace labels |
| `--text-white`      | `#FFFFFF` | `255, 255, 255`  | Text on dark backgrounds |
| `--text-white-muted`| `#AAAAAA` | `170, 170, 170`  | Body text on dark backgrounds |
| `--text-white-faded`| `#CCCCCC` | `204, 204, 204`  | Secondary text on dark |
| `--accent-gold`     | `#E0B73C` | `224, 183, 60`   | Accent border on Digital Brain card, profile frame |
| `--border-light`    | `#CCCCCC` | `204, 204, 204`  | Card borders, dividers on light bg |
| `--border-dashed`   | `#DDDDDD` | `221, 221, 221`  | Dashed borders on metric cards |
| `--border-dark`     | `#333333` | `51, 51, 51`     | Borders on dark sections |
| `--white`           | `#FFFFFF` | `255, 255, 255`  | Pure white |
| `--black`           | `#000000` | `0, 0, 0`        | Pure black accents |

### 4.2 Color Roles

| Role          | Light Theme   | Dark Theme    |
|---------------|--------------|---------------|
| Background    | `#F4F4F4`    | `#111111`     |
| Surface       | `#EAEAEA`    | `#1A1A1A`     |
| Text Primary  | `#111111`    | `#FFFFFF`     |
| Text Secondary| `#555555`    | `#AAAAAA`     |
| Text Muted    | `#777777`    | `#777777`     |
| Accent        | `#E0B73C`    | `#E0B73C`     |
| Border        | `#CCCCCC`    | `#333333`     |

### 4.3 Gradients

```css
/* Hero section bottom fade */
background: linear-gradient(180deg, transparent 0%, rgba(17,17,17,0.8) 100%);

/* Vision section scroll-reveal text */
color: rgba(255, 255, 255, 0.2);  /* Faded state */
color: rgba(255, 255, 255, 1.0);  /* Revealed state */

/* Footer nature photo overlay */
background: linear-gradient(180deg, rgba(0,50,30,0.6) 0%, rgba(0,20,10,0.9) 100%);
```

### 4.4 Dark/Light Mode
- **No toggle** — the site uses fixed alternating dark/light sections
- Dark sections: Capabilities, Vision, Ticker bars, Footer
- Light sections: Hero, Metrics, Works, Pricing, FAQ, Articles

### 4.5 Opacity Patterns
- Marquee backdrop text: `opacity: 0.05–0.1`
- Scroll-reveal text (Vision): `opacity: 0.2` → `1.0` on scroll
- Hero line 1 ("Scale your ideas."): appears lighter via color (`#999`) rather than opacity
- Client logos: grayscale, `opacity: 0.6`

---

## 5. COMPONENTS & UI PATTERNS

### 5.1 Navbar

```
┌─────────────────────────────────────────────────────────────────────┐
│ [◯◯ logo]  Works  Services  Insights  Pricing  Company        [⊞ Hire Team] │
└─────────────────────────────────────────────────────────────────────┘
```

- **Position**: Fixed top, floating
- **Background**: White (`#FFFFFF`)
- **Shape**: Pill/rounded rectangle (`border-radius: 100px` for left nav cluster)
- **Left cluster**: Spartan oval logo + 5 nav links in a pill-shaped container
- **Right CTA**: "Hire Team" button — separate pill on the right
- **Shadow**: Subtle `box-shadow: 0 2px 8px rgba(0,0,0,0.06)`
- **Logo**: Rounded oval/capsule outline icon in dark stroke, no text in navbar
- **Nav link style**: 14px, weight 400, color `#333`, no underline
- **Hover**: Text darkens to `#111`, subtle background highlight
- **Mobile**: Hamburger menu icon → drawer/overlay navigation
- **Z-index**: 1000

### 5.2 Hero Section

- **Layout**: Full-viewport height, split between text (left) and background image (full)
- **Background**: Photorealistic 3D render — grassy hilltop under overcast sky with a vintage glowing CRT television in the center
- **Text area (left, upper)**: 
  - H1 Line 1: "Scale your ideas." — light weight, grayish
  - H1 Line 2: "Build with AI." — bold, black
  - Subheadline: "Deploy custom neural agents, LLMs, and automation in one seamless flow."
  - CTA button: "Start Build" with icon box
- **Right floating card**: "Digital Brain // Model v4.0.2" product card with 3D metallic engine render and arrow → link to `/digital-brain`
- **Card border**: Gold/olive accent border (`#E0B73C`)

### 5.3 Buttons

#### Primary CTA (Dark)
```css
background-color: #1A1A1A;
color: #FFFFFF;
border-radius: 100px; /* Pill shape */
padding: 12px 24px;
font-size: 14px;
font-weight: 500;
border: none;
display: flex;
align-items: center;
gap: 12px;
```
- Contains icon square (outlined, with `⊞` or arrow icon) + text
- Hover: Background lightens to `#333`
- Used for: "Start Build", "Hire Team", "Get started", "Build Now", "Buy This Engine"

#### Secondary CTA (Light outline)
```css
background-color: transparent;
color: #111111;
border: 1px solid #CCCCCC;
border-radius: 100px;
padding: 10px 20px;
font-size: 14px;
```
- Used for: "Contact Support", "Our Story", "All articles"

#### Icon Button (Square)
```css
width: 44px;
height: 44px;
border-radius: 8px;
background-color: #FFFFFF;
border: 1px solid #CCCCCC;
display: flex;
align-items: center;
justify-content: center;
```
- Contains small SVG icon (cross-arrows, plus, chevron)
- Used as prefix in CTA buttons

### 5.4 Metrics Dashboard Grid

```
┌─────────────────────┬──────────────────┬──────────────┐
│    $42M – $45M      │  15,400 active   │     5x       │
│  (animated ticker)  │    agents        │  Faster      │
│  Revenue generated  │  (avatar stack)  │  speed to    │
│                     │                  │  market      │
├─────────────────────┼──────────────────┴──────────────┤
│   Inference speed   │      Testimonial quote card     │
│   (dial indicator)  │   "Reduced support tickets      │
│                     │    by 80%..." - CTO, Cigna      │
└─────────────────────┴─────────────────────────────────┘
```

- Card 1 (top-left, spans 1 col): Dark background (`#1A1A1A`), white text, animated counter `$42M – $45M`
- Card 2 (top-center): Light bg, dashed border, overlapping avatar circles (5 users), "15,400 active agents"
- Card 3 (top-right): Light bg, large "5x" stat, "Faster speed to market"
- Card 4 (bottom-left): Speedometer/dial SVG, "Inference speed. Real-time processing for enterprise-grade deployments."
- Card 5 (bottom-right): Testimonial card, quote text, "— CTO, Cigna"
- **Card styling**: `border-radius: 16px`, `padding: 24px`, `border: 1px solid #eaeaea` (light cards)

### 5.5 Capabilities Accordion (Dark Section)

- **Background**: Dark (`#111`)
- **Header**: Monospace label "CAPABILITIES", H2 "Tailored Intelligence for Modern Enterprises.", body sub-text, "Start Build" CTA
- **Accordion mechanism**: 3 horizontal cards labeled 001, 002, 003
- **Active card**: Expands wider (`flex-grow`), reveals image + description
- **Inactive cards**: Narrow, text rotated 90° vertically
- **Transition**: Width animation with content fade-in, ~300ms ease

| Slide | Title | Description | Visual |
|-------|-------|-------------|--------|
| 001 | Autonomous Agent Architecture Labs | "Architecting robust server environments and local LLM integrations to ensure data remains secure and local." | 3D vector core diagram |
| 002 | Autonomous Agentic Workflows | "Building self-optimizing task bots..." | Clipboard/checklist UI |
| 003 | Data Pipelines & RAG Systems | "Streamlining data ingestion and processing..." | User profile dataset graphic |

### 5.6 Our Vision (Scroll Reveal)

- **Layout**: Two columns on dark background
- **Left**: Double-bordered photo card of Alexander Vacca (Founder & Lead Engineer), gold/olive accent frame
- **Right**: Monospace label "OUR VISION", followed by scroll-reveal paragraph text
- **Scroll behavior**: Words animate from `rgba(255,255,255,0.2)` → `rgba(255,255,255,1.0)` as user scrolls through the section
- **Text**: "We believe that AI should not just automate tasks, but amplify the creative and strategic potential of every human. By merging technical rigor with intuitive design, we build systems that don't just solve problems—they create entirely new opportunities for growth."

### 5.7 Pricing Cards

```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│    Core      │   Growth     │   Pro ████   │    Scale     │
│   $495/mo    │  $1,250/mo   │  $2,900/mo   │  $7,500/mo   │
│              │              │  (dark card)  │              │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

- **Toggle switch**: Monthly ↔ Annually (Save 20%)
- **Card style**: `border-radius: 16px`, `padding: 32px`, `border: 1px solid #eaeaea`
- **Pro card (highlighted)**: Dark background (`#1A1A1A`), white text, slightly elevated
- **Each card contains**: Tier label (H6), Price (H2), "/mo" suffix, billing note, one-line description, "Get started" button, 4 feature list items with checkmarks

| Tier | Annual | Monthly | Description | Features |
|------|--------|---------|-------------|----------|
| Core | $495/mo | $618/mo | Automate your repetitive tasks. | 3 Automation Flows, Standard RAG Support, 1 Admin Seat, Discord Support |
| Growth | $1,250/mo | $1,570/mo | Advanced agentic workflows. | 10 Automation Flows, Vector DB Hosting, 5 Admin Seats, Priority Email |
| Pro | $2,900/mo | $3,650/mo | Custom neural architecture. | Unlimited Flows, Custom Fine-Tuning, 15 Admin Seats, 24/7 Slack Connect |
| Scale | $7,500/mo | $9,380/mo | Enterprise infrastructure. | Full Neural Stack, On-Premise LLMs, Unlimited Seats, Dedicated Engineer |

### 5.8 FAQ Accordion

- **Section label**: "COMMON QUERIES"
- **H2**: "Everything you need to know about our AI."
- **CTA**: "Contact Support" link
- **Layout**: Left column = heading + CTA, Right column = accordion
- **Accordion style**: No outer borders, divider lines between items
- **Expand/collapse**: Click to toggle, smooth height transition ~300ms
- **Icon**: Plus/minus or chevron icon rotating on expand

| # | Question | Answer |
|---|----------|--------|
| 1 | How do you ensure our data remains secure? | We utilize SOC2-compliant local vector databases and on-premise LLM hosting to ensure your proprietary data never leaves your infrastructure. |
| 2 | What is the typical deployment timeline? | 1 week audit, 4 weeks prototyping before full production. |
| 3 | Can we integrate with our existing CRM? | Native API connectors for Salesforce, HubSpot, custom ERP. |
| 4 | Do you provide model fine-tuning? | Fine-tuning open-source models (like Llama 3). |
| 5 | How do you calculate ROI for automation? | Inference-to-Impact metrics measuring hours saved and accuracy. |
| 6 | Do we own the custom code you build? | Yes, 100% client ownership upon completion. |
| 7 | What models do you specialize in? | Model-agnostic specializing in OpenAI, Anthropic, Mistral, and local open-source LLMs. |

### 5.9 Testimonial Slider (Experiences)

- **Backdrop**: Giant scrolling text "Experiences" in ultra-large, near-transparent font
- **Navigation**: Left/right arrow buttons
- **Card style**: White card with quote text, reviewer name (uppercase, bold), title
- **Transition**: Horizontal slide with Framer Motion

| Reviewer | Title | Quote |
|----------|-------|-------|
| MARCUS CHENG | Head of AI, Aetna | "The custom agentic workflows they built reduced our manual data entry by 90%, saving us hundreds of hours weekly." |
| DAVID ROSSI | Lead Dev, Cigna | "Their team didn't just provide tools; they provided a roadmap for AI integration that actually makes sense for ROI." |
| SARAH JENKINS | CTO, Anthem Group | "A game-changer for our R&D. The neural infrastructure is robust, secure, and perfectly tailored to our niche stack." |
| ELENA VANCE | VP Eng, UnitedHealth | "Incredible technical depth. They handled our complex RAG implementation with ease and delivered ahead of schedule." |

### 5.10 Our Process Accordion (Vertical)

- **Heading**: "From raw data to refined intelligence. Our iterative deployment cycle."
- **Layout**: Vertical accordion, numbered steps
- **Active step**: Expands to show badge, title, and description paragraph
- **Inactive steps**: Collapsed to single line with number + title

| Step | Label | Badge | Title | Description |
|------|-------|-------|-------|-------------|
| // 01 | AUDIT | `AUDIT` | Comprehensive Strategic Audit | We perform a deep-layer analysis of your current technical stack and fragmented data silos to identify high-impact AI opportunities that align with your core business objectives and ROI targets. |
| // 02 | DESIGN | `DESIGN` | Custom Architecture Design | Architect bespoke neural model topologies. |
| // 03 | BUILD | `BUILD` | Rapid Prototype Development | Transition blueprints to MVPs within weeks. |
| // 04 | SCALE | `SCALE` | Enterprise Scale Deployment | SOC2 compliance, dedicated compute clusters. |

- **Badge style**: Small pill chip, dark bg, uppercase text, `border-radius: 100px`, `padding: 4px 12px`

### 5.11 Project / Works Cards

- **Layout**: Horizontal scrolling marquee of large project cards
- **Card size**: ~400px wide, ~250px tall
- **Card content**: Background image (company brand), tag category, metric stats grid
- **Stats grid (4 items)**: Funds raised, Social growth, ATH ROI, Partnerships

| Client | Category | Funds Raised | Social Growth | ATH ROI | Partnerships |
|--------|----------|-------------|--------------|---------|-------------|
| Cigna | Healthcare AI | $45M+ | 700% | 41x | 84 |
| Aetna | Healthcare | $62M+ | 450% | 32x | 91 |
| Anthem | Healthcare | $82M+ | 340% | 19x | 56 |
| CVS | Retail & Logistics | $59M+ | 215% | 73x | 28 |
| United Healthcare | Cybersecurity | $94M+ | 120% | 66x | 12 |

### 5.12 Team Members Section

Horizontal scrolling cards with quotes:

| Name | Role | Quote |
|------|------|-------|
| SARAH JENKINS | Head of Machine Learning | "Our focus remains on the ethical deployment of large-scale models. We don't just optimize for performance; we ensure every neural architecture we build is interpretable, secure, and ready for enterprise-grade scrutiny." |
| MARCUS CHENG | Principal Design Director | "AI shouldn't feel like a black box. My goal is to design intuitive interfaces that make complex data actionable, ensuring that the human-machine collaboration is seamless, visually stunning, and highly efficient for users." |
| ELENA VANCE | Lead Cognitive Scientist | "We study the cognitive friction between AI output and human decision-making. By applying behavioral science to our agentic workflows, we create tools that naturally align with how your best employees actually think and work." |
| DAVID ROSSI | Infrastructure Architect | "Latency is the enemy of adoption. I architect the backbone of our solutions to ensure that even the most complex RAG systems deliver sub-second responses, maintaining 99.9% uptime across distributed global compute clusters." |

### 5.13 Newsletter Form (Footer)

```css
/* Input container */
display: flex;
background-color: rgba(255,255,255,0.1);
border-radius: 100px;
padding: 4px;
border: 1px solid rgba(255,255,255,0.15);

/* Input field */
background: transparent;
border: none;
color: #FFFFFF;
padding: 12px 20px;
font-size: 14px;
placeholder-text: "jane@framer.com";

/* Submit button */
background-color: #FFFFFF;
color: #111111;
border-radius: 100px;
padding: 10px 20px;
font-weight: 500;
```

### 5.14 Announcement Ticker Bar

- **Background**: Dark (`#111`)
- **Content**: `//SPARTAN` label + scrolling announcement text
- **Text**: "We are officially expanding our neural compute clusters to three new global regions, providing sub-50ms inference speeds for our enterprise partners across EMEA, APAC, and North America."
- **Animation**: Infinite horizontal scroll (marquee), CSS transform
- **Height**: ~48px
- **Text color**: White, small font size (~12–13px)

---

## 6. IMAGERY & VISUAL ASSETS

### 6.1 Hero Background
- **Subject**: Photorealistic 3D render of a grassy hilltop at golden hour with wildflowers, overcast sky. A vintage CRT television sits on the hill, glowing warm white/orange from its screen
- **Style**: Hyper-realistic, cinematic depth of field, nature meets technology
- **Placement**: Full-width background behind hero section
- **Treatment**: Slight gradient overlay at bottom fading to dark for client logos contrast

### 6.2 Digital Brain Product Image
- **Subject**: 3D metallic/transparent mechanical engine/core render — glass/chrome housing with internal mechanical parts and teal/orange accent lighting
- **Style**: Technical, product-render quality, dark background with subtle glow
- **Border**: Gold/olive accent border (`#E0B73C`)
- **Placement**: Hero card (right side), Digital Brain page hero

### 6.3 Client Logos
- **Brands**: UnitedHealthcare, Aetna, Cigna, Anthem, CVS Pharmacy
- **Style**: Grayscale, monochrome versions of real brand logos
- **Treatment**: `filter: grayscale(1); opacity: 0.6`
- **Placement**: Horizontal infinite-scroll marquee at bottom of hero

### 6.4 Alexander Vacca Portrait
- **Subject**: Professional portrait photo, square crop
- **Frame**: Double-bordered with gold/olive accent (`#E0B73C`)
- **Placement**: Our Vision section (left column)

### 6.5 Tech Integration Logos Grid
- **Logos**: OpenAI, Anthropic, Meta/Llama, and other AI/ML framework logos
- **Style**: Grayscale, arranged in a grid
- **Placement**: Tech Integration section

### 6.6 Capabilities Section Visuals
- **Slide 001**: 3D abstract vector/geometric core diagram (dark bg, teal/purple accents)
- **Slide 002**: Clipboard/checklist UI mockup with star-highlighted item
- **Slide 003**: User profile/dataset card UI graphic

### 6.7 Article Images (6 articles)
- Various 3D abstract renders: torus shapes, fluid forms, blue ribbons, orange striped geometries
- Style: Abstract, futuristic, dark/moody, consistent with the tech aesthetic

### 6.8 Footer Background
- **Subject**: Nature scene — lush green moss/hedge wall with 3D white cube/box and warm lighting
- **Treatment**: Dark gradient overlay for text readability
- **Large text overlay**: "spartan" in massive white outlined letters across the bottom

### 6.9 About Page Team Image
- **Subject**: Horizontal landscape photo of 4 key team members in a modern office/lab setting
- **Treatment**: Full-width, slight desaturation

### 6.10 Contact Page Image
- **Subject**: Vertical monochrome image of team members
- **Placement**: Left column of split layout

### 6.11 Intelligence by Design Section
- **Visual**: Video thumbnail or animated element
- **Label**: "2mins watch"
- **Description**: "Exploring the intersection of human creativity and machine logic to redefine what's possible in the digital age."

### 6.12 SVGs / Icons
- **Navbar logo**: Rounded capsule/oval outline (`stroke-width: 2px`)
- **Button icons**: Small geometric icons — cross-arrows (`⊞`), right arrow (`→`), plus sign
- **Social icons**: X (Twitter), LinkedIn, YouTube, Instagram — circular icon buttons in footer
- **Feature checklist**: Checkmark icons in pricing feature lists
- **Accordion**: Plus/minus toggle icons, chevrons

---

## 7. ANIMATIONS & INTERACTIONS

### 7.1 Page Load Animations
```css
/* Standard Framer entrance */
animation: fadeInUp 0.6s ease-out;
transform: translateY(20px);
opacity: 0;
/* → */
transform: translateY(0);
opacity: 1;
```
- Elements fade-up into viewport as they enter the visible area
- Stagger: ~100ms between sequential elements

### 7.2 Infinite Marquee Scrolls
```css
/* Horizontal infinite scroll */
animation: marquee 30s linear infinite;

@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
```
Used on:
- Client logos bar
- Announcement ticker ("//SPARTAN We are officially expanding...")
- Section backdrop text (Experiences, Pricing, Our Works, Insights)
- Project works cards horizontal scroll

### 7.3 Scroll-Triggered Text Reveal (Vision Section)
```css
/* Each word transitions from faded to solid on scroll */
.word {
  color: rgba(255, 255, 255, 0.2);
  transition: color 0.3s ease;
}
.word.revealed {
  color: rgba(255, 255, 255, 1.0);
}
```
- JavaScript/Framer scroll listener calculates which words have been "scrolled past"
- Words reveal sequentially left-to-right, top-to-bottom

### 7.4 Accordion Animations

**Horizontal (Capabilities)**:
```css
/* Active card */
flex: 1 1 60%;
transition: flex 0.4s cubic-bezier(0.4, 0, 0.2, 1);

/* Inactive card */
flex: 0 0 80px;
transition: flex 0.4s cubic-bezier(0.4, 0, 0.2, 1);

/* Text rotation for inactive */
transform: rotate(90deg);
transform-origin: center;
```

**Vertical (Process, FAQ)**:
```css
max-height: 0;
overflow: hidden;
transition: max-height 0.3s ease-out;
/* Expanded: max-height: 300px */
```

### 7.5 Animated Counter (Metrics)
```css
/* Revenue counter: animates between $42M and $45M */
/* Uses requestAnimationFrame or Framer Motion animate */
transition: all 2s ease-in-out;
/* Counter ticks up smoothly */
```

### 7.6 Hover Micro-Interactions
- **Buttons**: Scale up slightly (`transform: scale(1.02)`), background color shifts
- **Cards**: Subtle `box-shadow` increase, slight lift (`translateY(-2px)`)
- **Nav links**: Color darkens from `#555` to `#111`
- **Project cards**: Slight zoom on image (`transform: scale(1.05)`)
- **Social icons**: Background opacity increase

### 7.7 Testimonial Slider
```css
/* Horizontal sliding transition */
transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
```
- Left/right arrows navigate between testimonial cards
- Cards slide horizontally with smooth easing

### 7.8 Pricing Toggle Animation
- Switch component slides indicator between "Monthly" and "Annually"
- Price values cross-fade between annual and monthly amounts

### 7.9 Parallax Effects
- No explicit parallax — but hero background image is fixed-position creating a subtle parallax effect on scroll

### 7.10 Cursor
- Default system cursor throughout — no custom cursor

---

## 8. LIBRARIES & TECHNOLOGY

| Category | Value |
|----------|-------|
| **Platform** | Framer (no-code website builder) |
| **Frontend** | React (Framer's internal React runtime) |
| **Animation** | Framer Motion (built-in to Framer) |
| **CSS** | Framer's scoped CSS-in-JS system (styled-components pattern) |
| **Fonts** | Framer's built-in font system — likely serving Inter / Plus Jakarta Sans from Framer CDN or Google Fonts |
| **Icons** | Custom SVG icons (no detectable external icon library) |
| **3rd Party Embeds** | `cal.com` (Book A Call CTA), `contra.com` (external CTA links) |
| **Analytics** | Framer Analytics (built-in) |
| **Form Handling** | Framer's built-in form component (contact page) |
| **Template marketplace** | Badge: "Buy Spartan AI Template from $129" |
| **Responsive** | Framer's responsive breakpoint system |

---

## 9. CONTENT — FULL TEXT COPY

### 9.1 Homepage

#### Navbar
- Logo: Spartan oval icon
- Links: `Works` · `Services` · `Insights` · `Pricing` · `Company`
- CTA: `Hire Team`

#### Hero Section
- **H1 Line 1**: "Scale your ideas."
- **H1 Line 2**: "Build with AI."
- **Subheadline**: "Deploy custom neural agents, LLMs, and automation in one seamless flow."
- **CTA**: "Start Build"
- **Product Card**: "Digital Brain" / "// Model v4.0.2"

#### Client Logos Bar
- **Copy**: "+2,400 active deployments and 8,200 brands trust our high-performance architecture."
- **Logos**: CVS Pharmacy, UnitedHealthcare, Aetna, Cigna, Anthem

#### Metrics Section
- **H2**: "Automate the manual, accelerate the future. Our custom AI solutions deliver measurable growth and operational excellence."
- **Body**: "Empowering teams with intelligent tools that turn complex data into actionable business outcomes daily."
- **Card 1**: "$42M – $45M" / "Revenue generated for our clients through AI-led optimizations."
- **Card 2**: "15,400 active agents" (with avatar stack)
- **Card 3**: "5x" / "Faster speed to market."
- **Card 4**: "Inference speed" / "Real-time processing for enterprise-grade deployments."
- **Card 5**: "The custom LLM they built for us reduced our support tickets by 80% while increasing user satisfaction." / "— CTO, Cigna"

#### Announcement Ticker
- "//SPARTAN"
- "We are officially expanding our neural compute clusters to three new global regions, providing sub-50ms inference speeds for our enterprise partners across EMEA, APAC, and North America."

#### Capabilities Section
- **Label**: "CAPABILITIES"
- **H2**: "Tailored Intelligence for Modern Enterprises."
- **Body**: "We bridge the gap between abstract machine learning and practical business utility through bespoke engineering."
- **CTA**: "Start Build"
- **Slide 001 Title**: "Autonomous Agent Architecture Labs"
- **Slide 001 Body**: "Architecting robust server environments and local LLM integrations to ensure data remains secure and local."
- **Slide 002 Title**: "Autonomous Agentic Workflows"
- **Slide 002 Body**: "Building self-optimizing task bots..."
- **Slide 003 Title**: "Data Pipelines & RAG Systems"
- **Slide 003 Body**: "Streamlining data ingestion and processing..."

#### Our Vision
- **Name**: "ALEXANDER VACCA"
- **Title**: "Founder & Lead Engineer"
- **Label**: "OUR VISION"
- **Paragraph 1**: "We believe that AI should not just automate tasks, but amplify the creative and strategic potential of every human."
- **Paragraph 2**: "By merging technical rigor with intuitive design, we build systems that don't just solve problems—they create entirely new opportunities for growth."

#### Tech Integration
- **Marquee text**: "ENGINEERING SYSTEMS THAT SCALE WITH YOUR AMBITION. WE LEVERAGE INDUSTRY-LEADING MODELS TO DEPLOY CUSTOM NEURAL SOLUTIONS TAILORED TO YOUR STACK."
- **CTA**: "Digital Brain v4.0.2"
- **Feature 1**: "Semantic vector search for hyper-accurate retrieval"
- **Feature 2**: "Unified data lakes for expansive model context."
- **Feature 3**: "Token-optimized flows for high speed processing"
- **Feature 4**: "Global LLM deployment. Support for 95+ languages."
- **Language codes**: ZH, HI, ES, FR, AR, BN, PT, RU, EN, DE

#### Experiences (Testimonials)
- **Intro**: "Empowering global enterprises through bespoke neural architectures and autonomous agentic workflows."
- *(See testimonial cards table in Section 5.9)*

#### Intelligence by Design
- **H2**: "Intelligence by Design."
- **Body**: "Exploring the intersection of human creativity and machine logic to redefine what's possible in the digital age."
- **Label**: "2mins watch"

#### Our Process
- **Label**: "OUR PROCESS"
- **H2**: "From raw data to refined intelligence. Our iterative deployment cycle."
- *(See process steps table in Section 5.10)*
- **Footer text**: "WE DON'T JUST SHIP CODE; WE SHIP COMPETITIVE ADVANTAGES. EVERY STEP IS DESIGNED TO ENSURE YOUR AI INFRASTRUCTURE IS FUTURE-PROOF AND SCALABLE."
- **CTA**: "Build Now"

#### Team CTA
- **H6**: "We are a collective of engineers, designers, and researchers dedicated to the frontier of AI."
- **Body**: "Bridging the gap between academic research and commercial deployment with precision engineering."
- **CTA**: "Our Story"
- *(See team cards table in Section 5.12)*

#### Pricing
- **Marquee**: "Pricing" (backdrop text)
- **H2**: "Flexible intelligence tiers designed to scale alongside your business. No hidden costs, just high-performance results."
- **Toggle**: "Monthly" / "Annually (Save 20%)"
- *(See pricing table in Section 5.7)*

#### FAQ
- *(See FAQ table in Section 5.8)*

#### Insights Preview
- **Intro**: "A curated repository of technical frameworks, model benchmarks, and strategic guides for leaders navigating the integration of custom neural architectures."
- **CTA**: "All articles"
- *(See articles listed in Section 9.5)*

### 9.2 About Page (`/about`)

- **H1**: "We architect the neural engines that power the world's most ambitious firms."
- **Body**: "Spartan AI is a premier AI research and deployment agency. We specialize in transforming legacy enterprise frameworks into autonomous, data-sovereign ecosystems. From predictive supply chains to secure health data networks, we build the intelligence that defines the next century of industry."
- **CTA**: "Get started"
- **Section Label**: "OUR STORY"
- **H2**: "The Evolution of Intelligence at Spartan AI"
- **CTA**: "Contact Support"
- **Story Paragraph 1**: "Spartan AI was founded on a singular, disruptive premise: that the future of global enterprise belongs to those who can master their own data sovereignty. We began as a lean collective of researchers in Lagos, driven by the challenge of bridging the gap between legacy infrastructure and the frontier of neural computation. Over the years, we have evolved into a premier agency that treats AI not as a tool, but as the foundational DNA of the modern firm."
- **Story Paragraph 2**: "Our journey has been defined by a relentless pursuit of technical excellence, moving beyond simple automation to build cognitive engines that truly think. Today, Spartan AI stands as a beacon for firms ready to lead the next century of industry. We have successfully deployed complex architectures for the world's largest healthcare and retail giants, proving that agility and scale can coexist. Our story is one of constant iteration—always prioritizing transparency, ethics, and raw power."
- **Stats**:
  - "X% Increase in operational throughput following the initial deployment phase."
  - "$XM Total strategic capital raised to scale proprietary neural architectures."
  - "Xx The efficiency multiplier achieved across legacy data processing streams."
  - "X% Average reduction in manual error rates during high-scale data migration."
- **Service Label**: "Service Offering"
- **Service Heading**: "We empower global leaders with private, scalable neural layers."
- **Service Body**: "Our agency specializes in bridging the gap between massive legacy infrastructures and the next generation of autonomous intelligence. We provide the technical foresight and secure execution necessary for Fortune 500 firms to lead in an AI-first economy."
- **Service Cards**:
  - "Neural Strategy" — "We define the roadmap for your enterprise AI integration, ensuring data sovereignty and long-term scalability."
  - "Edge Deployment" — "Processing intelligence at the source to eliminate latency and maintain total security in any environment."
  - "Custom LLMs" — "Building proprietary language models trained exclusively on your secure data for pinpoint industry accuracy."
  - "Predictive Ops" — "Transforming reactive supply chains into proactive engines that forecast demand before it impacts the shelf."

### 9.3 Contact Page (`/contact`)

- **H1**: "Let's build your neural future together."
- **Phone**: "+234 805 169 8842"
- **Email**: "info@spartanai.org"
- **H2**: "Deploy your first agent today."
- **Body**: "Ready to transform your legacy data into a strategic asset? Reach out to our research team to discuss a custom neural integration or a pilot of Digital Brain v4.0.2."
- **Form fields**: Name, Email, Budget ($), Message
- **Submit CTA**: "Submit"
- **Address**: "16192 Coastal Highway, Lewes, DE 19958, USA"
- **Section Label**: "THE SPARTAN LEGACY"
- **Heading**: "Forging the secure neural foundations that will define the next industrial era."
- **Body**: "We empower global leaders with private, autonomous ecosystems that transform fragmented data into a strategic force for sustainable enterprise growth."
- **CTA**: "Book A Call"

### 9.4 Digital Brain Page (`/digital-brain`)

- **Banner text**: "Over 3000 Happy Founders Around The World"
- **H1**: "Own Your Private Neural Engine"
- **Body**: "Deploy a secure, pre-trained AI brain that masters your enterprise data in milliseconds."
- **CTA**: "Buy This Engine"
- **Stats**:
  - "$7M" — "Our model reduces monthly operational cloud costs by automating data flows."
  - "99%" — "Achieve near-perfect accuracy in automated document triaging and labeling."
  - "45x" — "Experience a massive leap in processing speed compared to legacy AI tools."
  - "0ms" — "Eliminate latency with local edge processing for instant model responses."
- **H2**: "Neural Operations Command"
- **Body**: "Real-time monitoring for autonomous agents as they execute complex, high-stakes enterprise tasks."
- **Dashboard UI elements**: "App.com", "Shannon Amanda / Admin", "AI Interview Simulator", "How can I help you?", "SPARTAN AI", "Type here to search..", "Download", "Scheduled Mock Interviews", "Mock Interview: UX Designer / Date: Oct 27, 2022", "Analysing your orders"
- **H3**: "Instant Strategic Scoping"
- **Body**: "Transform raw client data into structured project roadmaps. Our model generates accurate task lists and resource allocations in seconds."
- **Chat input**: "Ask Spartan AI anything…" / "Tools"
- **H3**: "Autonomous Growth Engine"
- **Body**: "Digital Brain v4.0.2 acts as your tireless sales researcher. It identifies high-value prospects, summarizes CRM notes, and drafts optimized outreach."
- **Closing**: "Digital Brain v4.0.2 isn't just a static model; it's a dynamic neural layer that learns from every interaction, document, and decision within your secure perimeter."
- **CTA**: "Buy This Engine"
- **Label**: "SYSTEM STATUS: OPTIMIZED"
- **Body**: "Experience total control over your automation. Our v4.0.2 architecture allows for instant deployment across private cloud environments, ensuring that your data sovereignty is never compromised while you scale your digital workforce."
- **Feature list**:
  - "Train models on sensitive data without ever exposing the raw source to the public web."
  - "Enable multiple Digital Brain instances to collaborate on complex, multi-step workflows."
  - "Optimized for the edge, ensuring your agents respond to queries with zero measurable latency."
  - "Seamlessly connect your neural engine to existing SQL, ERP, and CRM systems via custom hooks."

### 9.5 Articles Page (`/articles`)

Six articles in masonry layout:

| # | Category | Title | Description | Author |
|---|----------|-------|-------------|--------|
| 1 | Transformation | The Sovereign Cloud: Why On-Premise AI is the Future of Data Privacy | Explore how federated learning and private hosting are allowing firms to innovate without risking security. | Frank Joel |
| 2 | Architecture | The Architecture of Autonomy: Scaling AI Within Legacy Frameworks | A comprehensive guide on integrating custom machine learning models into complex enterprise environments. | Damilola Manuel |
| 3 | Privacy | Human-Centric Automation: Designing AI That Empowers Your Workforce | Why the most successful AI implementations focus on augmenting human talent rather than simply replacing it. | Deborah Reachie |
| 4 | Augmentation | Ethical AI: Building Transparent Systems for the Global Enterprise | Why algorithmic accountability is becoming the most critical metric for modern corporate governance models. | Michael Corleone |
| 5 | Integrity | The Quantum Leap: Preparing the Enterprise for Post-Classical Computing | Why forward-thinking firms are already developing quantum-ready algorithms to secure their long-term future. | Amarachi Yusuf |
| 6 | Velocity | The Edge Computing Revolution: Processing AI at the Source of Data | How shifting neural processing to the network edge is eliminating latency for the modern enterprise. | Angela Jolie |

### 9.6 Works Page (`/project`)

- **Marquee**: "Our Works ★" (giant scrolling backdrop)
- **Banner image**: Black-and-white skylight atrium photography
- Same 5 project cards as homepage (see Section 5.11)

---

## 10. NAVIGATION

### 10.1 Nav Structure

| Position | Label    | URL/Target                          | Type           |
|----------|----------|-------------------------------------|----------------|
| 1        | Works    | `/project`                          | Page link      |
| 2        | Services | `/#capabilities`                   | Anchor link    |
| 3        | Insights | `/articles`                        | Page link      |
| 4        | Pricing  | `/#pricing`                        | Anchor link    |
| 5        | Company  | `/about`                           | Page link      |
| CTA      | Hire Team| `/contact`                         | CTA button     |

### 10.2 Logo
- **Type**: SVG icon — rounded capsule/oval outline shape
- **Placement**: Far left of nav bar
- **Size**: ~44px × 24px
- **Style**: Black outline stroke, no fill
- **Links to**: Home (`/`)

### 10.3 Mobile Navigation
- **Trigger**: Hamburger icon (3 horizontal lines)
- **Behavior**: Opens full-screen or slide-in drawer overlay
- **Contents**: Same links as desktop + Hire Team CTA
- **Close**: X button or overlay click

### 10.4 Sticky/Scroll Behavior
- Navbar is **fixed** to the top of the viewport at all times
- Stays visible on scroll
- No background change or shrink on scroll (maintains white pill appearance)

### 10.5 CTA Placement
- "Hire Team" is always visible in the navbar (top-right)
- Dark pill button with icon prefix

---

## 11. FOOTER

### 11.1 Visual Layout

```
┌──────────────────────────────────────────────────────────────┐
│  [Nature background image: moss/hedge wall, 3D white cube]  │
│                                                              │
│  [◯◯ logo]                                                   │
│  spartan                    Quick Links     Company          │
│                             ─────────────   ─────────        │
│  Lorem ipsum dolor sit      Home            About Us         │
│  amet, consectetur          Digital Brain   Contact Us       │
│  adipiscing elit...         Projects        Book A Call      │
│                             Articles        More Templates   │
│  [jane@framer.com] [Subscribe]                               │
│                                             Policies         │
│  FOLLOW US:                                 ─────────        │
│  [X] [in] [▶] [📷]                         Terms & Conditions│
│                                             Privacy Policy   │
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │          s p a r t a n  (giant outlined text)           │ │
│  └─────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

### 11.2 Footer Links

| Column | Links |
|--------|-------|
| **Quick Links** | Home, Digital Brain, Projects, Articles |
| **Company** | About Us, Contact Us, Book A Call, More Templates |
| **Policies** | Terms & Conditions, Privacy Policy |

### 11.3 Social Icons
- **X (Twitter)**: `x.com` or Twitter icon
- **LinkedIn**: `linkedin.com` icon
- **YouTube**: `youtube.com` icon
- **Instagram**: `instagram.com` icon
- **Style**: Circular dark background icon buttons, ~36px diameter

### 11.4 Legal / Copyright
- **Placeholder text**: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam ac ultrices massa. Vivamus faucibus egestas nulla"
- **Policies**: Terms & Conditions, Privacy Policy

### 11.5 Newsletter
- **Placeholder**: "jane@framer.com"
- **Button**: "Subscribe" (with icon prefix)

### 11.6 Background
- Nature photo: Lush green moss/hedge wall with a 3D white cube object, warm amber lighting from behind
- Dark overlay gradient for text legibility
- Giant outlined "spartan" text across the bottom portion, semi-transparent white

### 11.7 Template Badge
- **Text**: "Buy Spartan AI Template from $129"
- **Position**: Fixed bottom-right corner
- **Also**: "Made in Framer" Framer badge below it

---

## 12. SEO & META

| Field            | Value |
|-----------------|-------|
| **Page Title**   | `Spartan-AI` |
| **Meta Description (OG)** | "Build a world-class digital presence with the Spartan AI template—a premium Framer ecosystem designed specifically for AI research labs, neural engineering firms, and high-end tech agencies." |
| **OG Image**     | Site preview image (auto-generated by Framer) |
| **Favicon**      | Spartan logo (rounded oval/capsule SVG) |
| **Framework Badge** | "Made in Framer" |

> All subpages share the same `<title>` ("Spartan-AI") and OG description.

---

## Appendix A: CSS Token Reference

```css
:root {
  /* Backgrounds */
  --bg-primary: #F4F4F4;
  --bg-secondary: #F0F0F0;
  --bg-dark: #111111;
  --bg-dark-alt: #161616;
  --bg-card-light: #EAEAEA;
  --bg-card-dark: #1A1A1A;
  --bg-white: #FFFFFF;

  /* Text */
  --text-primary: #111111;
  --text-secondary: #555555;
  --text-tertiary: #777777;
  --text-muted: #999999;
  --text-white: #FFFFFF;
  --text-white-muted: #AAAAAA;
  --text-white-faded: #CCCCCC;

  /* Accent */
  --accent-gold: #E0B73C;

  /* Borders */
  --border-light: #CCCCCC;
  --border-dashed: #DDDDDD;
  --border-dark: #333333;

  /* Radius */
  --radius-pill: 100px;
  --radius-card: 16px;
  --radius-button-icon: 8px;

  /* Shadows */
  --shadow-nav: 0 2px 8px rgba(0, 0, 0, 0.06);
  --shadow-card-hover: 0 4px 16px rgba(0, 0, 0, 0.08);

  /* Typography */
  --font-primary: 'Inter', 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'SF Mono', 'Fira Code', monospace;

  /* Transitions */
  --transition-default: 0.3s ease;
  --transition-accordion: 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slider: 0.5s cubic-bezier(0.4, 0, 0.2, 1);

  /* Spacing */
  --space-xs: 8px;
  --space-sm: 16px;
  --space-md: 24px;
  --space-lg: 40px;
  --space-xl: 80px;
  --space-2xl: 120px;
}
```

## Appendix B: Full Sitemap

```
/                           → Homepage (deep scroll)
/project                    → Works / Projects listing
/project/cigna-smart-health-systems
/project/aetna-health-data-ecosystem
/project/anthem-neural-care-network
/project/cvs-smart-supply-chain-hub
/project/united-ai-security-protocol
/digital-brain              → Digital Brain product page
/articles                   → Insights / blog listing
/articles/the-sovereign-cloud-why-on-premise-ai-is-the-future-of-data-privacy
/articles/the-architecture-of-autonomy-scaling-ai-within-legacy-frameworks
/articles/human-centric-automation-designing-ai-that-empowers-your-workforce
/articles/ethical-ai-building-transparent-systems-for-the-global-enterprise
/articles/the-quantum-leap-preparing-the-enterprise-for-post-classical-computing
/articles/the-edge-computing-revolution-processing-ai-at-the-source-of-data
/about                      → About Us page
/contact                    → Contact / Hire form
/policies/terms-conditions  → Terms & Conditions
/policies/privacy-policy    → Privacy Policy
```

---

> **End of Design Specification**
> This document contains all information needed to reconstruct the Spartan AI website from scratch.
