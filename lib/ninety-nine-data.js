// lib/ninety-nine-data.js
//
// Copy for the /99-dollar-websites landing page.
//
// This page sells the OUTCOME of having a site, not the contents of the box —
// so there is deliberately no "what's included" checklist here. Scope is stated
// once, plainly, inside the price card and the FAQ, and nowhere else.
//
// Scope claims below are bound to the `plans` table in the waas repo
// (supabase/migrations/011_billing.sql): starter = $99/mo, 3 pages,
// 1 edit credit per month, custom domain + basic SEO + contact form.
// Do not widen these without changing that row first.

export const ninetyNineData = {
  meta: {
    title: '$99 Websites for Small Businesses | No Setup Fee',
    description:
      'A real website for your business at $99 a month — no setup fee, no contract, live in about a week. Built to get you found and get you called.',
    canonical: 'https://visionaryadvance.com/99-dollar-websites',
  },

  hero: {
    badge: '$99 / month websites',
    headline: 'Get found. Get called. For $99 a month.',
    subheadline:
      "Most small businesses don't lose work because they're bad at the job. They lose it because the customer looked them up, found nothing, and called someone else. That stops this week.",
    primaryCtaLabel: 'Get My Site Started',
    primaryCtaHref: '/contact?from=99-dollar-websites',
    secondaryCtaLabel: 'See Our Work',
    secondaryCtaHref: '/works',
    showcaseImage: '/Img/All_Mocks.png',
    showcaseAlt: 'Small business websites built by Visionary Advance, shown on desktop and mobile',
  },

  painPoints: {
    heading: 'What not having a site actually costs you',
    items: [
      {
        title: 'The referral that never called',
        body:
          "Someone recommends you. The customer searches your name to check you out first — because that's what everyone does now — and finds a Facebook page from three years ago. That referral is gone, and you'll never know it happened.",
      },
      {
        title: 'Competing on price instead of work',
        body:
          "When a customer can't see your work, your reviews, or who you are, the only thing left to compare is the number on the quote. A site is how you stop being the cheapest option and start being the obvious one.",
      },
      {
        title: 'Another month of putting it off',
        body:
          "A $3,000 build is a decision you postpone. So you postpone it again, and another season goes by. The cost isn't the website you didn't buy — it's the jobs that went to the person who did.",
      },
    ],
  },

  whatChanges: {
    heading: 'What actually changes',
    intro:
      "Not a list of features. Here's what a week from now looks like compared to right now.",
    items: [
      {
        before: 'Someone hears about you, looks you up, and finds nothing convincing.',
        after: 'They find a site that looks like a real business — and they call.',
      },
      {
        before: 'You explain what you do, where you work, and what you charge on every single call.',
        after: "They've already read it. The call starts at \"when can you start?\"",
      },
      {
        before: 'Leads arrive as missed calls, texts, and voicemails you piece together later.',
        after: 'Every inquiry lands in your inbox with a name, a number, and what they need.',
      },
      {
        before: "You don't show up when someone searches your trade and your town.",
        after: 'You have a real page, on a real domain, that Google can actually index.',
      },
      {
        before: 'A website is a $3,000 decision sitting at the bottom of your list.',
        after: "It's $99 a month. Less than your phone bill, and it works while you're on a job.",
      },
    ],
  },

  howFast: {
    heading: 'Live in about a week — not two months',
    intro:
      "No discovery phase, no six rounds of mockups, no waiting on a designer's calendar.",
    steps: [
      {
        marker: 'Day 1',
        title: 'A twenty-minute conversation',
        description:
          "You tell us what you do, who you serve, and where you work. That's the whole intake. No homework, no brand questionnaire, no content deadlines.",
      },
      {
        marker: 'Day 3',
        title: 'You see the real thing',
        description:
          "Not a flat mockup — the actual working site, at a real URL, with your name, your colors, and your photos on it. Open it on your phone. Tell us what's wrong.",
      },
      {
        marker: 'Day 7',
        title: "It's live on your own domain",
        description:
          'Your site goes live at your own address, submitted to Google, with your contact form wired to your inbox. From then on, it just runs.',
      },
    ],
  },

  whyUs: {
    heading: "Why this isn't the risk you think it is",
    items: [
      {
        title: 'Nothing up front',
        body:
          'No setup fee, no deposit, no build cost. The $99 starts when your site goes live and you like it — not before.',
      },
      {
        title: 'You see it before you commit',
        body:
          "We build the site first and show it to you. If it isn't right, we fix it. If you don't want it, you walk, and you've paid nothing.",
      },
      {
        title: 'The domain is yours',
        body:
          "It's registered in your name, not ours. If you ever leave, your address and your traffic go with you. No hostage situation.",
      },
      {
        title: 'You never have to log into anything',
        body:
          "Need the hours changed or a new photo up? Send a message. We make the change. No dashboard to learn, no plugin to update, no password to lose.",
      },
      {
        title: 'Month to month',
        body:
          "No contract and no cancellation fee. If it isn't earning its $99, you stop paying. We'd rather keep you because it works.",
      },
      {
        title: 'Built properly, not dragged and dropped',
        body:
          'Real code, fast pages, and the local SEO markup search engines look for. Not a bloated page-builder template that loads in six seconds on a jobsite connection.',
      },
    ],
  },

  pricing: {
    heading: 'One price. No surprises.',
    price: '$99',
    period: '/ month',
    tagline: 'Everything you need to get found and get called.',
    outcomes: [
      'A site that makes you look like the established option',
      'Found on Google for your trade and your town',
      'Inquiries delivered straight to your inbox',
      'Loads fast on a phone, which is where your customers are',
      'Your own domain, registered in your name',
      'Changes handled for you — just send a message',
    ],
    scopeNote:
      'Up to 3 pages, with one content change per month included. No setup fee, no contract.',
    ctaLabel: 'Get My Site Started',
    ctaHref: '/contact?from=99-dollar-websites',
    upsellNote: 'Need more pages, a blog, or ongoing SEO work?',
    upsellLinkLabel: "Let's talk about that",
    upsellLinkHref: '/contact?from=99-dollar-websites',
  },

  faqs: [
    {
      question: 'Is there really no setup fee?',
      answer:
        "Correct — there's no build cost, no deposit, and no onboarding fee. You pay $99 the month your site goes live, and $99 each month after that. We'd rather earn it every month than charge you three thousand dollars once.",
    },
    {
      question: "What's the catch at $99 a month?",
      answer:
        "There isn't a hidden one, but there is a real trade-off, and it's this: you're not getting a fully bespoke, designed-from-scratch site. You're getting a professionally built site on a proven foundation, set up for your business. That's why it's fast and why it's $99. If you need something fully custom, we build those too — that's a different conversation and a different price.",
    },
    {
      question: 'How many pages do I get?',
      answer:
        'Up to three. For most local businesses that means a home page, a services page, and a contact page — which is genuinely all that\'s needed to get found and get called. If your business needs more than that, our next plan up covers eight pages and we can walk you through it.',
    },
    {
      question: 'What if I need to change something?',
      answer:
        "Just tell us. One content change per month is included — new hours, a price update, a fresh photo, a paragraph rewrite. You don't log into anything and you don't wait on a ticket queue. If you need changes more often than that, we can add them or move you to a plan that includes more.",
    },
    {
      question: 'Do I own the website and the domain?',
      answer:
        "The domain is registered in your name and it's yours permanently — if you ever leave, it goes with you, along with your search rankings. The site itself is part of the subscription: while you're subscribed it's live and maintained, and if you cancel, it comes down. Nothing is held hostage, and we'll always point your domain wherever you want it.",
    },
    {
      question: 'Can I cancel?',
      answer:
        "Any time, with no cancellation fee. It's month to month. If the site isn't earning its keep, you shouldn't be paying for it.",
    },
    {
      question: 'How is this different from Wix or Squarespace?',
      answer:
        "Those are tools — you're still the one who has to build it, write it, and keep it updated, and most people never finish. This is the finished result. We build it, we launch it, and we maintain it. You go back to running your business.",
    },
    {
      question: 'Will it actually show up on Google?',
      answer:
        'Every site ships with proper page titles, meta descriptions, and local business schema markup, and gets submitted for indexing at launch. That gets you findable for your own name and your core services. Competitive rankings for high-traffic search terms take sustained SEO work over months — that\'s a separate service, and we\'ll tell you honestly whether you need it.',
    },
  ],

  finalCta: {
    headline: "Your next customer is going to look you up.",
    body:
      "Give them something to find. Twenty minutes on the phone, live in about a week, $99 a month, nothing up front.",
    primaryCtaLabel: 'Get My Site Started',
    primaryCtaHref: '/contact?from=99-dollar-websites',
    secondaryCtaLabel: 'Check My Current Site First',
    secondaryCtaHref: '/audit',
  },
}
