// lib/eugene-hosting-content.js
//
// Copy for /eugene-website-hosting.
//
// Built from Search Console data: /eugene-web-design was drawing ~400
// impressions of Eugene hosting demand at positions 12-17 without being a
// hosting page — "website hosting eugene oregon" (132 impressions, pos 17.6),
// "eugene website hosting" (122, 16.6), "eugene web hosting" (25, 12.2).
// Those queries now have a page of their own, and the web-design page's
// metadata no longer competes for them.
//
// Shapes mirror lib/eugene-page-content.js so the Components/Eugene/*
// components can be reused unchanged.

export const eugeneHostingContent = {
  meta: {
    title: 'Website Hosting Eugene, Oregon | Managed Hosting & Maintenance',
    description:
      'Managed website hosting and maintenance for Eugene, Springfield, and Lane County businesses. Fast servers, SSL, backups, uptime monitoring — and a local phone number instead of a support queue.',
    canonical: 'https://visionaryadvance.com/eugene-website-hosting',
    keywords:
      'website hosting eugene oregon, eugene website hosting, web hosting eugene, eugene web hosting, website maintenance eugene, wordpress hosting eugene, managed hosting eugene, lane county website hosting',
  },

  hero: {
    badge: 'Hosting & maintenance · Eugene, OR',
    headline: 'Website Hosting in Eugene, Handled For You',
    subheadlineLead: 'Fast, monitored, and maintained',
    subheadlineRest:
      ' — hosting for Eugene, Springfield, and Lane County businesses, with a local person to call. Check what your current host is costing you in speed, free, in 60 seconds.',
    placeholder: 'yourbusiness.com',
    ctaLabel: 'Check My Site Speed',
    secondaryCtaLabel: 'See Our Work',
    secondaryCtaHref: '/works',
    microProof: 'No signup needed · Results in under a minute',
  },

  trustStats: [
    { value: 99.9, suffix: '%', label: 'Uptime we target', decimal: true },
    { value: 2, suffix: 's', label: 'Load time ceiling we hold' },
    { value: 100, suffix: '%', label: 'Based in Eugene' },
    { value: 24, suffix: 'hr', label: 'Support response window' },
  ],

  problemsSolutions: {
    eyebrow: 'Why Hosting Matters',
    heading: 'Cheap hosting is rarely cheap',
    problems: [
      {
        title: 'Your site takes six seconds on a phone',
        description:
          'Shared hosting oversells its servers. Your customer is standing in a parking lot on LTE, and they leave before your homepage paints.',
      },
      {
        title: 'Support is a ticket queue eight time zones away',
        description:
          "Something breaks on a Friday and you're describing it to someone reading from a script who has never seen your site.",
      },
      {
        title: 'Nobody is actually watching it',
        description:
          'Most small business sites go down and stay down until a customer mentions it. There is no monitoring, and no one is paid to notice.',
      },
      {
        title: 'The renewal quietly triples',
        description:
          'The introductory rate ends, the invoice jumps, and backups or SSL turn out to be line items you were never told about.',
      },
    ],
    solutions: [
      {
        title: 'Servers built for speed, not oversold',
        description:
          'Sites run on modern edge infrastructure and hold a sub-2-second mobile load. Speed is a hosting decision before it is a design one.',
      },
      {
        title: 'A local number, not a queue',
        description:
          'You call someone in Eugene who has seen your site before. Same time zone, same area code, same person each time.',
      },
      {
        title: 'Monitored, backed up, patched',
        description:
          'Uptime monitoring, automatic daily backups, SSL renewal, and security updates are handled without you asking.',
      },
      {
        title: 'One flat price that stays flat',
        description:
          'No introductory rate, no renewal jump, no surprise line items. SSL and backups are included, not upsells.',
      },
    ],
  },

  services: {
    eyebrow: "What's Included",
    heading: 'Hosting, maintenance, and someone watching it',
    sub: 'Bundled with a new build, or set up on the site you already have.',
    items: [
      {
        title: 'Managed Hosting',
        description:
          'Fast, monitored hosting on modern infrastructure. SSL, CDN, and daily backups included — not billed separately.',
        bullets: ['Sub-2s mobile load', 'Free SSL certificate', 'Daily automatic backups', 'Uptime monitoring'],
        accent: 'teal',
      },
      {
        title: 'Ongoing Maintenance',
        description:
          'Security patches, dependency updates, and content changes handled for you, so the site does not quietly rot.',
        bullets: ['Security updates', 'Content edits', 'Performance checks', 'Broken link monitoring'],
        accent: 'purple',
        linkHref: '/affordable-small-business-website-design',
        linkLabel: 'See the $99/mo plan',
      },
      {
        title: 'Migration From Your Host',
        description:
          'We move the site off GoDaddy, Bluehost, Wix, or wherever it lives now — without downtime, and without you touching DNS.',
        bullets: ['Zero-downtime move', 'DNS handled for you', 'Email left untouched', 'Keeps your domain'],
        accent: 'teal',
      },
    ],
  },

  process: {
    eyebrow: 'How It Works',
    heading: 'Moved over in about a week',
    sub: 'Most migrations are done inside seven days, with no visible downtime.',
    steps: [
      {
        number: '01',
        title: 'Speed Check',
        description:
          'Run the free check above. It shows what your current host is costing you in load time before you commit to anything.',
      },
      {
        number: '02',
        title: 'Migration Plan',
        description:
          'We map the domain, email, SSL, and DNS so nothing breaks. You get a plan and a date before any change happens.',
      },
      {
        number: '03',
        title: 'Move & Verify',
        description:
          'The site is copied, tested on the new infrastructure, and only then does DNS switch. Email is left alone.',
      },
      {
        number: '04',
        title: 'Monitored From Day One',
        description:
          'Backups, uptime monitoring, and SSL renewal start immediately. You get a number to call when you need something.',
      },
    ],
  },

  localProof: {
    eyebrow: "We're Right Here",
    heading: 'Hosted by someone in your time zone',
    body:
      'Your site runs on infrastructure we manage, supported by a person who lives in Eugene. When something needs attention you are not opening a ticket and waiting overnight — you are texting the person who built it. That difference matters most on the day something breaks.',
    bullets: [
      'Same time zone, same area code, same person each time',
      'Serving Eugene, Springfield, and Lane County businesses',
      'Local references available on request',
    ],
    image: '/Img/Eugene_2.jpg',
    imageAlt: 'Eugene, Oregon',
    imageCredit: '',
  },

  faqs: [
    {
      question: 'How much does website hosting cost in Eugene?',
      answer:
        'Managed hosting and maintenance is included in our $99/month website plan, which covers the build, hosting, and ongoing changes together. If you already have a site and only need it hosted and maintained, we scope that separately — there is no setup fee and no contract either way.',
    },
    {
      question: 'Can you host a website I already have?',
      answer:
        'Yes. We migrate existing sites off GoDaddy, Bluehost, Wix, Squarespace, or wherever they currently live. The move is planned around your DNS and email so nothing goes dark, and most migrations finish inside a week.',
    },
    {
      question: 'Do you offer WordPress hosting in Eugene?',
      answer:
        'Yes. We host and maintain WordPress sites, including plugin and core updates, security patching, and daily backups. We also build on Next.js when speed is the priority — we will tell you honestly which one fits your site.',
    },
    {
      question: 'Will moving hosts take my site offline?',
      answer:
        'No. We copy the site to the new infrastructure and test it fully before DNS changes, so the switch happens only once everything is verified. Your email is untouched throughout — that is the part most hosts get wrong.',
    },
    {
      question: 'Do I still own my domain and my site?',
      answer:
        'Completely. The domain stays in your name, you own the code and the content, and you can leave whenever you want with everything you came in with. No platform lock-in and no hostage situation.',
    },
    {
      question: 'What happens if my site goes down?',
      answer:
        'Uptime monitoring alerts us before most customers would notice, and we respond within one business day — usually much faster. You also get a direct phone number rather than a ticket queue.',
    },
    {
      question: 'Do you only host businesses in Eugene?',
      answer:
        'We are based in Eugene and work most often with Eugene, Springfield, and Lane County businesses, but we host clients across Oregon and remotely nationwide. Local clients get in-person support as a bonus.',
    },
  ],

  contact: {
    eyebrow: 'Get Started',
    heading: 'Tell us about your site',
    sub: 'Let us know where it is hosted now and what is bothering you. We respond within one business day.',
  },

  finalCta: {
    heading: 'Stop paying for hosting nobody is watching',
    sub: 'Run the free speed check on your current site, or send us a message. Either way you will know what your host is actually costing you.',
    primaryLabel: 'Check My Site Speed',
    primaryHref: '#audit',
    phone: '541-321-0468',
    phoneHref: 'tel:+15413210468',
    email: 'brandon@visionaryadvance.com',
    emailHref: 'mailto:brandon@visionaryadvance.com',
  },
}
