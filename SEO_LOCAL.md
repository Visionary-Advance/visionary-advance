# Visionary Advance - Eugene Oregon Local SEO Implementation Guide

## Project Overview
Transform visionaryadvance.com from a generic web design site to the #1 ranked web design service in Eugene, Oregon and Lane County through strategic local SEO implementation.

## Current Issues
- Zero geographic signals (no mention of Eugene, Oregon, or Lane County)
- Generic title tags and meta descriptions
- No LocalBusiness schema markup
- Missing NAP (Name, Address, Phone) in footer
- No location-specific content or pages
- No blog or content marketing infrastructure

---

## PHASE 1: IMMEDIATE FIXES (Do First)

### 1.1 Update Homepage Metadata
**File to modify:** `app/page.tsx` or `app/layout.tsx` (wherever your homepage metadata lives)

```typescript
export const metadata: Metadata = {
  title: 'Web Design Eugene Oregon | Visionary Advance | Lane County Web Development',
  description: 'Premium web design for Eugene & Lane County businesses. Specializing in construction companies and restaurants. Fast, SEO-optimized websites that convert. Serving Eugene, Springfield, and all of Lane County.',
  keywords: 'web design eugene, web development lane county, eugene web designer, springfield oregon web design, construction website design, restaurant website design',
  openGraph: {
    title: 'Web Design Eugene Oregon | Visionary Advance',
    description: 'Premium web design for Eugene & Lane County businesses. Specializing in construction companies and restaurants.',
    locale: 'en_US',
    type: 'website',
    url: 'https://visionaryadvance.com',
    siteName: 'Visionary Advance',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Web Design Eugene Oregon | Visionary Advance',
    description: 'Premium web design for Eugene & Lane County businesses.',
  },
  alternates: {
    canonical: 'https://visionaryadvance.com'
  }
}
```

### 1.2 Add LocalBusiness Schema Markup
**File to create:** `components/LocalBusinessSchema.tsx`

```typescript
export default function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Visionary Advance",
    "description": "Premium web design and development for Eugene Oregon businesses. Specializing in construction companies and restaurants.",
    "url": "https://visionaryadvance.com",
    "logo": "https://visionaryadvance.com/Img/VALogo.png",
    "image": "https://visionaryadvance.com/Img/VALogo.png",
    "telephone": "+1-XXX-XXX-XXXX", // ADD YOUR PHONE NUMBER
    "email": "contact@visionaryadvance.com", // ADD YOUR EMAIL
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "YOUR STREET ADDRESS", // ADD IF YOU HAVE ONE OR REMOVE THIS LINE
      "addressLocality": "Eugene",
      "addressRegion": "OR",
      "postalCode": "97401",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "44.0521",
      "longitude": "-123.0868"
    },
    "areaServed": [
      {
        "@type": "City",
        "name": "Eugene",
        "@id": "https://en.wikipedia.org/wiki/Eugene,_Oregon"
      },
      {
        "@type": "City",
        "name": "Springfield",
        "@id": "https://en.wikipedia.org/wiki/Springfield,_Oregon"
      },
      {
        "@type": "City",
        "name": "Cottage Grove"
      },
      {
        "@type": "City",
        "name": "Junction City"
      },
      {
        "@type": "City",
        "name": "Veneta"
      },
      {
        "@type": "City",
        "name": "Creswell"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Lane County"
      }
    ],
    "priceRange": "$$$",
    "serviceType": [
      "Web Design",
      "Web Development", 
      "SEO Services",
      "Website Hosting",
      "Custom Web Applications"
    ],
    "knowsAbout": [
      "Next.js Development",
      "React Development",
      "Supabase Integration",
      "API Development",
      "Restaurant Websites",
      "Construction Company Websites"
    ],
    "sameAs": [
      // ADD YOUR SOCIAL MEDIA PROFILES
      "https://www.linkedin.com/company/visionary-advance",
      "https://twitter.com/visionaryadvance",
      "https://www.facebook.com/visionaryadvance"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

**Then import and add to your root layout:**
```typescript
// In app/layout.tsx
import LocalBusinessSchema from '@/components/LocalBusinessSchema';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <LocalBusinessSchema />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### 1.3 Update Footer with NAP (Name, Address, Phone)
**File to modify:** Your footer component (likely `components/Footer.tsx` or similar)

Add this section to your footer:

```typescript
<div className="footer-contact">
  <h3>Visionary Advance</h3>
  <address>
    <p>Eugene, Oregon 97401</p>
    <p>
      <a href="tel:+1XXXXXXXXXX">XXX-XXX-XXXX</a>
    </p>
    <p>
      <a href="mailto:contact@visionaryadvance.com">contact@visionaryadvance.com</a>
    </p>
  </address>
  <p className="service-area">
    Proudly serving Eugene, Springfield, and all of Lane County, Oregon
  </p>
</div>
```

### 1.4 Update Homepage Content - Add Location Context
**File to modify:** `app/page.tsx` (your homepage)

Update your hero section to include location:

```typescript
// CURRENT:
"Premium web design and strategic SEO for businesses that refuse to settle for 'good enough.'"

// CHANGE TO:
"Premium web design and strategic SEO for Eugene and Lane County businesses that refuse to settle for 'good enough.'"

// Add after hero section or in a prominent location:
<section className="location-section">
  <h2>Serving Eugene, Springfield & Lane County</h2>
  <p>
    For over [X years], we've helped Lane County construction companies and restaurants 
    dominate their local search results and attract premium clients. Based in Eugene, Oregon, 
    we understand the unique needs of businesses in our community.
  </p>
</section>
```

---

## PHASE 2: NEW PAGES (Week 1-2)

### 2.1 Create Eugene Landing Page
**File to create:** `app/web-design-eugene-oregon/page.tsx`

```typescript
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Web Design Eugene Oregon | Expert Web Development Services',
  description: 'Professional web design and development services in Eugene, Oregon. Custom websites for construction companies, restaurants, and local businesses. Fast, modern, SEO-optimized.',
  alternates: {
    canonical: 'https://visionaryadvance.com/web-design-eugene-oregon'
  }
};

export default function EugeneWebDesign() {
  return (
    <main>
      <section className="hero">
        <h1>Web Design & Development in Eugene, Oregon</h1>
        <p>
          Premium web design services for Eugene businesses that demand excellence. 
          We specialize in creating custom websites that reflect the quality and 
          professionalism of your business.
        </p>
      </section>

      <section className="about-eugene">
        <h2>Eugene's Premier Web Design Partner</h2>
        <p>
          Based right here in Eugene, we understand the unique characteristics of the 
          Lane County market. Whether you're a construction company in Springfield, 
          a restaurant in downtown Eugene, or a service business in Cottage Grove, 
          we build websites that help you dominate local search and attract the right clients.
        </p>
      </section>

      <section className="services">
        <h2>Our Eugene Web Design Services</h2>
        
        <div className="service-grid">
          <div className="service-item">
            <h3>Custom Website Design</h3>
            <p>
              No templates. No shortcuts. Every website is custom-built to represent 
              your brand and connect with Eugene-area customers.
            </p>
          </div>

          <div className="service-item">
            <h3>Local SEO Optimization</h3>
            <p>
              Dominate local search results in Eugene, Springfield, and throughout 
              Lane County. Be found when potential clients search for your services.
            </p>
          </div>

          <div className="service-item">
            <h3>Mobile-First Development</h3>
            <p>
              With most Eugene residents searching on mobile, your website needs to 
              look perfect and load fast on every device.
            </p>
          </div>

          <div className="service-item">
            <h3>Ongoing Support & Maintenance</h3>
            <p>
              Local support you can count on. We're here in Eugene when you need us, 
              not in some distant call center.
            </p>
          </div>
        </div>
      </section>

      <section className="industries">
        <h2>Industries We Serve in Lane County</h2>
        
        <h3>Construction Companies</h3>
        <p>
          We've helped numerous Lane County construction companies establish their 
          online presence with websites that showcase their work and generate qualified leads.
        </p>

        <h3>Restaurants & Food Service</h3>
        <p>
          From Eugene's bustling restaurant scene to Springfield's growing food industry, 
          we build websites with online ordering, reservations, and seamless payment integration.
        </p>

        <h3>Professional Services</h3>
        <p>
          Attorneys, accountants, consultants, and other professionals trust us to 
          create websites that establish credibility and attract high-value clients.
        </p>
      </section>

      <section className="why-local">
        <h2>Why Choose a Local Eugene Web Designer?</h2>
        <ul>
          <li>Face-to-face meetings when needed</li>
          <li>Deep understanding of the Eugene market</li>
          <li>Local references and portfolio you can verify</li>
          <li>Support in your timezone, not across the world</li>
          <li>Investment in the local business community</li>
        </ul>
      </section>

      <section className="service-areas">
        <h2>Areas We Serve</h2>
        <p>
          While based in Eugene, we proudly serve businesses throughout Lane County including:
        </p>
        <ul>
          <li>Eugene</li>
          <li>Springfield</li>
          <li>Cottage Grove</li>
          <li>Junction City</li>
          <li>Veneta</li>
          <li>Creswell</li>
          <li>Coburg</li>
          <li>Lowell</li>
        </ul>
      </section>

      <section className="cta">
        <h2>Ready to Elevate Your Online Presence?</h2>
        <p>
          Let's discuss how a premium website can help your Eugene business stand out 
          and attract the clients you deserve.
        </p>
        <a href="/contact" className="button">Schedule a Free Consultation</a>
      </section>
    </main>
  );
}
```

### 2.2 Create Springfield Landing Page
**File to create:** `app/web-design-springfield-oregon/page.tsx`

```typescript
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Web Design Springfield Oregon | Professional Web Development',
  description: 'Expert web design services in Springfield, Oregon. Custom websites for local businesses. Serving Springfield, Eugene, and Lane County. Call for a free consultation.',
  alternates: {
    canonical: 'https://visionaryadvance.com/web-design-springfield-oregon'
  }
};

export default function SpringfieldWebDesign() {
  return (
    <main>
      <section className="hero">
        <h1>Web Design & Development in Springfield, Oregon</h1>
        <p>
          Professional web design services for Springfield businesses. Based in nearby Eugene, 
          we serve the Springfield business community with custom websites that drive results.
        </p>
      </section>

      <section className="about">
        <h2>Springfield's Web Design Partner</h2>
        <p>
          Springfield businesses deserve websites that reflect the quality of their work. 
          Whether you're on Main Street, in the Gateway area, or anywhere in Springfield, 
          we create custom websites that help you compete and win in the local market.
        </p>
      </section>

      <section className="why-springfield">
        <h2>Why Springfield Businesses Choose Us</h2>
        <ul>
          <li>Local presence - just minutes away in Eugene</li>
          <li>Understanding of the Springfield market and community</li>
          <li>Experience with Springfield-area businesses</li>
          <li>Fast, responsive support when you need it</li>
          <li>Competitive pricing with premium quality</li>
        </ul>
      </section>

      <section className="services">
        <h2>Our Springfield Web Services</h2>
        <p>Custom website design • Local SEO • E-commerce • Mobile optimization • Ongoing support</p>
      </section>

      <section className="cta">
        <h2>Serve Springfield Customers Better Online</h2>
        <p>Let's build a website that represents your Springfield business the way it deserves.</p>
        <a href="/contact" className="button">Get Your Free Quote</a>
      </section>
    </main>
  );
}
```

### 2.3 Create Construction Company Page
**File to create:** `app/construction-company-websites/page.tsx`

```typescript
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Construction Company Websites | Web Design for Contractors in Lane County',
  description: 'Custom website design for construction companies and contractors in Eugene and Lane County. Showcase your projects, generate leads, and establish credibility online.',
  alternates: {
    canonical: 'https://visionaryadvance.com/construction-company-websites'
  }
};

export default function ConstructionWebsites() {
  return (
    <main>
      <section className="hero">
        <h1>Website Design for Construction Companies in Lane County</h1>
        <p>
          Premium websites that showcase your craftsmanship and generate qualified leads. 
          Built for general contractors, specialty contractors, and construction companies 
          throughout Eugene and Lane County.
        </p>
      </section>

      <section className="problem">
        <h2>Your Work Speaks for Itself - Does Your Website?</h2>
        <p>
          You've built a reputation on quality workmanship and professional service. 
          But when potential clients search for contractors in Eugene or Lane County, 
          what do they find? A DIY website that doesn't reflect your standards? 
          An outdated site that looks like it's from 2010? Or worse - nothing at all?
        </p>
      </section>

      <section className="features">
        <h2>Essential Features for Construction Websites</h2>
        
        <div className="feature">
          <h3>Project Portfolio</h3>
          <p>
            Beautiful galleries that showcase your best work. High-quality images with 
            before/after comparisons that demonstrate your expertise to potential clients.
          </p>
        </div>

        <div className="feature">
          <h3>Lead Generation Forms</h3>
          <p>
            Strategic forms and calls-to-action that convert visitors into qualified leads. 
            Capture project details upfront to save time and focus on serious prospects.
          </p>
        </div>

        <div className="feature">
          <h3>Service Area Maps</h3>
          <p>
            Clear visualization of where you work in Lane County. Help potential clients 
            immediately know if you serve their area.
          </p>
        </div>

        <div className="feature">
          <h3>Testimonials & Reviews</h3>
          <p>
            Prominent display of client testimonials and Google reviews. Social proof 
            that builds trust before the first phone call.
          </p>
        </div>

        <div className="feature">
          <h3>Mobile-Optimized</h3>
          <p>
            Most people search for contractors on their phone. Your site looks perfect 
            and loads fast on every device.
          </p>
        </div>

        <div className="feature">
          <h3>Local SEO</h3>
          <p>
            Optimized to rank for "general contractor Eugene" and other high-value local searches. 
            Be found when people are actively looking for your services.
          </p>
        </div>
      </section>

      <section className="integrations">
        <h2>Seamless Integration with Your Business Tools</h2>
        <p>We can integrate your website with:</p>
        <ul>
          <li>Jobber or other contractor management software</li>
          <li>BuilderTrend, CoConstruct, or similar project management tools</li>
          <li>QuickBooks for seamless invoicing</li>
          <li>Google Calendar for scheduling</li>
          <li>CRM systems to track leads</li>
        </ul>
      </section>

      <section className="construction-types">
        <h2>Contractor Types We Serve</h2>
        <ul>
          <li>General Contractors</li>
          <li>Home Builders</li>
          <li>Remodeling & Renovation Contractors</li>
          <li>Roofing Contractors</li>
          <li>Concrete Contractors</li>
          <li>HVAC Companies</li>
          <li>Electrical Contractors</li>
          <li>Plumbing Companies</li>
          <li>Landscaping & Hardscaping</li>
          <li>Painting Contractors</li>
        </ul>
      </section>

      <section className="local">
        <h2>Built for the Lane County Construction Market</h2>
        <p>
          We understand the competitive landscape for contractors in Eugene, Springfield, 
          and throughout Lane County. Your website will be optimized to help you stand out 
          against both local and out-of-area competitors bidding on projects in your territory.
        </p>
      </section>

      <section className="cta">
        <h2>Ready for a Website That Matches Your Quality?</h2>
        <p>
          Let's build a digital presence that generates leads and reflects the professional 
          standard you bring to every project.
        </p>
        <a href="/contact" className="button">Get Your Free Consultation</a>
      </section>
    </main>
  );
}
```

### 2.4 Create Restaurant Website Page
**File to create:** `app/restaurant-websites-eugene/page.tsx`

```typescript
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Restaurant Website Design Eugene | Online Ordering & Reservations',
  description: 'Custom restaurant websites for Eugene and Lane County. Online ordering integration, reservation systems, mobile menus, and SEO. Attract more diners and increase orders.',
  alternates: {
    canonical: 'https://visionaryadvance.com/restaurant-websites-eugene'
  }
};

export default function RestaurantWebsites() {
  return (
    <main>
      <section className="hero">
        <h1>Restaurant Website Design in Eugene, Oregon</h1>
        <p>
          Beautiful, functional websites for restaurants, cafes, and food service businesses 
          in Eugene and Lane County. Drive online orders, increase reservations, and attract 
          more diners with a website designed for results.
        </p>
      </section>

      <section className="problem">
        <h2>Your Food is Amazing - Is Your Website?</h2>
        <p>
          You've perfected your menu, created an inviting atmosphere, and built a loyal following. 
          But when someone searches "restaurants near me" in Eugene, what do they see? Can they 
          easily view your menu, place an order, or make a reservation? Or do they get frustrated 
          and choose a competitor with a better online experience?
        </p>
      </section>

      <section className="features">
        <h2>Essential Features for Restaurant Websites</h2>
        
        <div className="feature">
          <h3>Online Ordering Integration</h3>
          <p>
            Seamless integration with Square, Toast, or other POS systems. Accept orders 
            directly through your website without the high fees of third-party delivery apps.
          </p>
        </div>

        <div className="feature">
          <h3>Reservation System</h3>
          <p>
            Built-in reservation system or integration with OpenTable. Make it easy for 
            diners to book a table with just a few clicks.
          </p>
        </div>

        <div className="feature">
          <h3>Mobile-Optimized Menus</h3>
          <p>
            Beautiful, easy-to-read menus on every device. Update pricing and items 
            instantly without calling your web designer.
          </p>
        </div>

        <div className="feature">
          <h3>Photo Galleries</h3>
          <p>
            Showcase your dishes with mouthwatering photography. Help diners know what 
            to expect and get them excited before they arrive.
          </p>
        </div>

        <div className="feature">
          <h3>Google Maps Integration</h3>
          <p>
            Make it impossible to get lost. Clear directions and embedded maps help 
            customers find you easily.
          </p>
        </div>

        <div className="feature">
          <h3>Local SEO Optimization</h3>
          <p>
            Rank higher for "Eugene restaurants," "best brunch Springfield," and other 
            local searches that bring hungry customers to your door.
          </p>
        </div>
      </section>

      <section className="restaurant-types">
        <h2>Restaurant Types We Serve</h2>
        <ul>
          <li>Fine Dining Restaurants</li>
          <li>Casual Dining</li>
          <li>Cafes & Coffee Shops</li>
          <li>Bakeries</li>
          <li>Food Trucks</li>
          <li>Bars & Breweries</li>
          <li>Pizza Restaurants</li>
          <li>Ethnic Cuisine (Thai, Vietnamese, Mexican, etc.)</li>
          <li>Quick Service Restaurants</li>
          <li>Catering Companies</li>
        </ul>
      </section>

      <section className="integrations">
        <h2>Integrations We Support</h2>
        <ul>
          <li>Square (online ordering, payments, menu management)</li>
          <li>Toast POS</li>
          <li>Clover</li>
          <li>OpenTable reservations</li>
          <li>Google Business Profile</li>
          <li>Email marketing (Mailchimp, Constant Contact)</li>
          <li>Social media feeds</li>
        </ul>
      </section>

      <section className="eugene-market">
        <h2>Eugene's Competitive Restaurant Scene</h2>
        <p>
          Eugene's dining scene is thriving, from downtown Eugene to the Gateway district 
          in Springfield. Stand out from the competition with a website that makes it easy 
          for locals and visitors to choose your restaurant.
        </p>
      </section>

      <section className="cta">
        <h2>Ready to Fill More Tables?</h2>
        <p>
          Let's create a website that brings more customers through your door and increases 
          your online orders.
        </p>
        <a href="/contact" className="button">Start Your Restaurant Website</a>
      </section>
    </main>
  );
}
```

---

## PHASE 3: BLOG SETUP (Week 2-3)

### 3.1 Create Blog Infrastructure
**File to create:** `app/blog/page.tsx`

```typescript
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Web Design Blog | Eugene Oregon Digital Marketing Tips',
  description: 'Web design tips, local SEO strategies, and digital marketing advice for Eugene and Lane County businesses. Expert insights from Visionary Advance.',
  alternates: {
    canonical: 'https://visionaryadvance.com/blog'
  }
};

export default function BlogIndex() {
  return (
    <main>
      <h1>Web Design & Digital Marketing Blog</h1>
      <p>
        Tips, strategies, and insights for Eugene and Lane County businesses 
        looking to improve their online presence.
      </p>
      {/* Blog post list will go here */}
    </main>
  );
}
```

### 3.2 First Blog Post Ideas

**File to create:** `app/blog/google-business-profile-eugene/page.mdx`

Title: "The Complete Guide to Google Business Profile for Eugene Businesses"

**File to create:** `app/blog/web-design-trends-lane-county-2025/page.mdx`

Title: "Web Design Trends for Lane County Construction Companies in 2025"

**File to create:** `app/blog/seo-for-eugene-restaurants/page.mdx`

Title: "How Eugene Restaurants Can Dominate Local Search Without Paying for Ads"

**File to create:** `app/blog/choosing-web-designer-eugene/page.mdx`

Title: "How to Choose a Web Designer in Eugene: Red Flags and Green Flags"

---

## PHASE 4: TECHNICAL SEO IMPROVEMENTS

### 4.1 Create Sitemap
**File to create:** `app/sitemap.ts`

```typescript
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://visionaryadvance.com';
  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/web-design-eugene-oregon`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/web-design-springfield-oregon`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/construction-company-websites`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/restaurant-websites-eugene`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];
}
```

### 4.2 Create robots.txt
**File to create:** `public/robots.txt`

```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/

Sitemap: https://visionaryadvance.com/sitemap.xml
```

### 4.3 Update Next.js Config for Better SEO
**File to modify:** `next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... your existing config
  
  // Add trailing slashes for better SEO
  trailingSlash: true,
  
  // Enable image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
  
  // Optimize output
  compress: true,
  
  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

---

## PHASE 5: EXTERNAL SEO (Outside the Code)

### 5.1 Google Business Profile Setup
1. Go to google.com/business
2. Claim/create listing: "Visionary Advance"
3. Business Category: "Website Designer" (primary)
4. Additional categories: "Internet Marketing Service", "Web Hosting Company"
5. Service area: Eugene, Springfield, Cottage Grove, Junction City, Veneta, Creswell
6. Add business description (750 chars max):
   ```
   Visionary Advance provides premium web design and development services for businesses 
   in Eugene, Springfield, and throughout Lane County, Oregon. We specialize in creating 
   custom websites for construction companies and restaurants that need more than a template. 
   Our services include web design, web development, local SEO, e-commerce solutions, and 
   ongoing website maintenance. Based in Eugene, we offer face-to-face consultations and 
   understand the unique needs of Lane County businesses. Whether you need a new website, 
   want to improve your search rankings, or need help with online ordering integration, 
   we're here to help your business succeed online.
   ```
7. Upload photos:
   - Logo
   - Team photos
   - Office/workspace
   - Past project screenshots
   - Eugene-area imagery
8. Add services with descriptions
9. Enable messaging
10. Get first 5 reviews from past clients

### 5.2 Local Directory Submissions
Submit NAP (Name, Address, Phone) consistently to:

1. **Eugene Chamber of Commerce**
   - URL: eugenechamber.com
   - Create member profile

2. **Better Business Bureau Oregon**
   - URL: bbb.org
   - Register business

3. **Yelp for Business**
   - URL: biz.yelp.com
   - Claim listing, add photos

4. **Clutch.co**
   - URL: clutch.co
   - Create company profile (web design specific)

5. **Technology Association of Oregon**
   - URL: techoregon.org
   - Join and get listed

6. **Eugene Startup Weekend / Eugene Tech Community**
   - Get involved, get listed

7. **Yellow Pages**
   - yp.com

8. **Manta**
   - manta.com

### 5.3 Content Marketing & Link Building Plan

**Month 1:**
- Write 2 blog posts targeting Eugene + your services
- Reach out to 5 past clients for reviews
- Join 3 Eugene business Facebook groups
- Connect with 20 Eugene business owners on LinkedIn

**Month 2:**
- Write 2 more blog posts
- Guest post pitch to Eugene business blogs
- Sponsor a small local event ($100-500)
- Partner with Eugene coworking space

**Month 3:**
- Case study featuring local client (with permission)
- Contact Eugene Weekly about featuring your business
- Host free "Web Design 101" workshop at library
- Launch email newsletter for Eugene businesses

**Ongoing:**
- 2 blog posts per month minimum
- Weekly LinkedIn posts about local projects
- Monthly workshop or webinar
- Quarterly local sponsorship

---

## IMPLEMENTATION CHECKLIST

### Week 1 (Immediate)
- [ ] Update homepage metadata (title, description)
- [ ] Add LocalBusiness schema markup
- [ ] Update footer with NAP
- [ ] Add location mentions to homepage content
- [ ] Create sitemap.ts and robots.txt
- [ ] Update next.config.js

### Week 2 (High Priority Pages)
- [ ] Create `/web-design-eugene-oregon` page
- [ ] Create `/web-design-springfield-oregon` page
- [ ] Set up blog infrastructure
- [ ] Write first blog post

### Week 3 (Industry Pages)
- [ ] Create `/construction-company-websites` page
- [ ] Create `/restaurant-websites-eugene` page
- [ ] Write second blog post
- [ ] Update About page with local context

### Week 4 (External SEO)
- [ ] Claim/optimize Google Business Profile
- [ ] Submit to 5 local directories
- [ ] Request 5 reviews from past clients
- [ ] Join 2 Eugene business groups

### Month 2
- [ ] Write 2 more blog posts
- [ ] Guest post pitches sent out
- [ ] Local event sponsorship arranged
- [ ] More directory submissions

### Ongoing
- [ ] 2 blog posts per month
- [ ] Weekly social media with #EugeneOregon
- [ ] Monthly review requests
- [ ] Quarterly local sponsorships
- [ ] Build relationships with Eugene media

---

## MEASUREMENT & TRACKING

### Set Up Analytics
1. **Google Search Console**
   - Add and verify site
   - Submit sitemap
   - Monitor Eugene-specific keywords

2. **Google Analytics 4**
   - Track Eugene traffic
   - Set up goals for contact form
   - Monitor local landing pages

3. **Rank Tracking**
   - Use tool like BrightLocal or LocalFalcon
   - Track rankings for:
     - "web design eugene"
     - "web development lane county"
     - "eugene web designer"
     - "springfield oregon web design"
     - "construction website design eugene"
     - "restaurant website eugene"

### Key Metrics to Watch
- Organic search traffic from Eugene/Lane County
- Rankings for target keywords
- Google Business Profile views/clicks
- Contact form submissions from organic search
- Phone calls from organic search
- Reviews count on GBP

---

## NOTES FOR CLAUDE CODE

- All file paths assume Next.js App Router structure
- Adjust component imports based on your actual project structure
- Replace placeholder content (phone, email, address) with real info
- Add your actual social media URLs to schema markup
- Customize styling to match your existing design system
- Blog posts should be 1000-1500 words each minimum
- Images should be optimized before upload (use Next/Image component)
- Test all new pages on mobile devices
- Run Lighthouse audit after implementation
- Consider adding click-to-call functionality for mobile users

---

## PRIORITY ORDER

If you can only do a few things immediately:

1. **MUST DO FIRST:**
   - Update homepage title/meta
   - Add LocalBusiness schema
   - Add NAP to footer
   - Create Eugene landing page

2. **DO NEXT:**
   - Create Google Business Profile
   - Get 5 reviews
   - Create industry pages (construction, restaurant)
   - First blog post

3. **THEN:**
   - More location pages
   - More blog posts
   - Directory submissions
   - Link building

Good luck! This should get you ranking #1 in Eugene within 3-6 months if you execute consistently.
