/**
 * Marketing copy for the TUC Academy landing page.
 *
 * Everything a marketer would want to change lives here — no layout code, no
 * copy in the components. Swap the strings below and the page updates.
 *
 * ── On numbers ────────────────────────────────────────────────────────
 * This file intentionally contains NO statistics, testimonials or prices we
 * cannot substantiate. Course cards read live from the API, so titles, prices
 * and ratings are always real. Add `<Stat>` bands or a testimonials section
 * only once you have figures and quotes you can stand behind.
 *
 * ── To edit ───────────────────────────────────────────────────────────
 *   • contact        → your real email, phone and addresses
 *   • services       → your actual service scope
 *   • process        → how you really run an engagement
 */

import {
  HiOutlineFunnel,
  HiOutlineChartBar,
  HiOutlineLockOpen,
  HiOutlineAcademicCap,
  HiOutlineUserGroup,
  HiOutlineKey,
  HiOutlineMagnifyingGlass,
  HiOutlineMap,
  HiOutlineBolt,
  HiOutlineDocumentChartBar,
  HiOutlineBriefcase,
  HiOutlineChatBubbleLeftRight,
  HiOutlineMegaphone,
  HiOutlineDevicePhoneMobile,
} from 'react-icons/hi2';

export const contact = {
  email: 'hello@tucacademy.com',
  phone: '+234 902 537 9100',
  location: 'Lagos, Nigeria',
  hours: 'Mon–Fri, 9am–5pm WAT',
};

export const nav = {
  links: [
    { label: 'Services', href: '#services' },
    { label: 'Courses', href: '#courses' },
    { label: 'How we work', href: '#process' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
  ],
};

export const hero = {
  badge: 'Brand services studio + learning academy',
  headline: 'We grow brands.',
  headlineHighlight: 'Then we teach you how.',
  subheadline:
    'TUC Academy runs the digital marketing and social media that grows your brand — and trains your team to keep it growing. Work with us, learn from us, or both.',
  primaryCta: { label: 'See our services', href: '#services' },
  secondaryCta: { label: 'Browse courses', href: '#courses' },
  // Qualitative and defensible — no invented figures.
  highlights: [
    { icon: HiOutlineUserGroup, label: 'Senior strategists, not juniors' },
    { icon: HiOutlineLockOpen, label: 'No long lock-in contracts' },
    { icon: HiOutlineChatBubbleLeftRight, label: 'Reporting in plain English' },
  ],
};

export const industries = {
  label: 'Brands we work with',
  items: [
    'Retail & E-commerce',
    'Beauty & Wellness',
    'Food & Beverage',
    'Fashion',
    'Professional Services',
    'Real Estate',
    'Fintech',
    'Creative Agencies',
    'Health & Fitness',
    'Hospitality',
  ],
};

export const services = {
  eyebrow: 'What we do',
  heading: 'Two things, done properly',
  subheading:
    'We keep the offer narrow on purpose. We run your marketing, or we grow your social presence — and we report on both in language you can act on.',
  items: [
    {
      id: 'digital-marketing',
      art: 'marketing',
      icon: HiOutlineMegaphone,
      tag: 'Service 01',
      title: 'Digital Marketing & Ads',
      body: 'Paid campaigns that bring in customers you can measure — not vanity impressions. We plan, build, run and report.',
      bullets: [
        'Meta and Google ad campaigns',
        'Landing pages built to convert',
        'Email flows that bring people back',
        'Monthly reporting in plain English',
      ],
      outcome: 'You stop guessing which spend is working.',
    },
    {
      id: 'social-media',
      art: 'social',
      icon: HiOutlineDevicePhoneMobile,
      tag: 'Service 02',
      title: 'Social Media & Content',
      body: 'A content system your brand can actually sustain — planned, produced and published consistently, in a voice that sounds like you.',
      bullets: [
        'Content strategy and monthly calendars',
        'Short-form video production',
        'Community management and replies',
        'Brand voice and tone guidelines',
      ],
      outcome: 'You show up consistently, without it eating your week.',
    },
  ],
  cta: { label: 'Talk to us about your brand', href: '#contact' },
};

/**
 * Micro-labels inside the animated product panels
 * ([`components/landing/Illustrations.jsx`](src/components/landing/Illustrations.jsx)).
 *
 * These are interface chrome, not marketing copy — they name what a bar or a
 * ring stands for so the panel reads as a product rather than an abstract
 * shape. They live here anyway because no string belongs in a component.
 *
 * Deliberately **no figures**. The panels convey scale with bar heights and
 * ring arcs only, so the page keeps the promise in the header comment: nothing
 * on it is a number we cannot substantiate.
 */
export const panels = {
  dashboard: {
    caption: 'Campaign overview',
    metrics: ['Reach', 'Engagement', 'Conversions'],
    live: 'Live',
  },
  marketing: {
    caption: 'Where the budget goes',
    stages: ['Awareness', 'Consideration', 'Conversion'],
    trend: 'Results',
  },
  social: {
    caption: 'Content calendar',
    kinds: ['Video', 'Carousel', 'Story'],
    followers: 'Followers',
  },
};

export const courses = {
  eyebrow: 'The academy',
  heading: 'Learn the same playbooks we use',
  subheading:
    'Everything we do for clients, we teach. Short, practical courses on marketing, branding and social media — built for owners who are short on time.',
  categoriesEyebrow: 'Browse by category',
  categoriesHeading: 'Find your starting point',
  emptyTitle: 'New courses are being published',
  emptyBody:
    'Our catalogue is being prepared. Create a free account and you will be first to know when new courses go live.',
  cta: { label: 'Create a free account', href: '/register' },
  browseCta: { label: 'Browse the full catalogue', href: '/login' },
};

export const process = {
  eyebrow: 'How we work',
  heading: 'A straight line from audit to results',
  steps: [
    {
      step: '01',
      icon: HiOutlineMagnifyingGlass,
      title: 'Audit',
      body: 'We look at your brand, your channels, your numbers and your competitors — and tell you plainly what is working and what is not.',
    },
    {
      step: '02',
      icon: HiOutlineMap,
      title: 'Strategy',
      body: 'You get a written plan: what we will run, what it should cost, what we expect it to do, and how we will know it worked.',
    },
    {
      step: '03',
      icon: HiOutlineBolt,
      title: 'Execution',
      body: 'We build and run it — campaigns, content, landing pages. You approve the direction, we handle the doing.',
    },
    {
      step: '04',
      icon: HiOutlineDocumentChartBar,
      title: 'Report',
      body: 'A monthly read-out in plain language: what we spent, what came back, and what we are changing next month.',
    },
  ],
};

export const whyUs = {
  eyebrow: 'Why TUC',
  heading: 'An agency that leaves you smarter',
  subheading:
    'Most agencies keep the knowledge. We hand it over — because a client who understands their own marketing makes better decisions.',
  items: [
    {
      icon: HiOutlineFunnel,
      title: 'One narrow, honest offer',
      body: 'We do digital marketing and social media. We turn down work outside that, and refer you to someone who does it better.',
      featured: true,
    },
    {
      icon: HiOutlineChartBar,
      title: 'Reporting you can act on',
      body: 'No dashboards you never open. A short monthly note: what we spent, what came back, what changes next.',
    },
    {
      icon: HiOutlineLockOpen,
      title: 'No lock-in',
      body: 'Monthly terms, cancel with notice. We would rather earn the next month than trap you in a twelve-month contract.',
    },
    {
      icon: HiOutlineAcademicCap,
      title: 'The academy behind it',
      body: 'Every playbook we run for clients becomes course material. Your team can learn exactly how we work.',
    },
    {
      icon: HiOutlineUserGroup,
      title: 'Senior people on your account',
      body: 'The strategist in your kick-off call is the one running your campaigns. No handoff to a junior after signing.',
    },
    {
      icon: HiOutlineKey,
      title: 'You own everything',
      body: 'Ad accounts, creative files, content, documentation. All in your name, handed over whenever you ask.',
    },
  ],
};

export const pricing = {
  eyebrow: 'Pricing',
  heading: 'Two ways to work with us',
  subheading:
    'Buy a course and learn it yourself, or hire us to run it for you. No hidden tiers, no invented packages.',
  options: [
    {
      id: 'courses',
      icon: HiOutlineAcademicCap,
      tag: 'Self-paced',
      title: 'Courses',
      lede: 'Pay per course. Learn it yourself, at your own pace.',
      points: [
        'Individual courses priced in the catalogue — some are free',
        'One-off payment, lifetime access to what you buy',
        'Verifiable certificate on completion',
        'Buy only what is relevant to your business',
      ],
      cta: { label: 'Browse the catalogue', href: '#courses' },
      featured: false,
    },
    {
      id: 'services',
      icon: HiOutlineBriefcase,
      tag: 'Done for you',
      title: 'Services',
      lede: 'We run your marketing. Scoped to your goals, quoted per engagement.',
      points: [
        'Starts with a free brand and channel audit',
        'A written proposal with scope, cost and expected outcomes',
        'Monthly retainer or fixed-scope project',
        'Monthly reporting and a named strategist',
      ],
      cta: { label: 'Request a proposal', href: '#contact' },
      featured: true,
    },
  ],
  note: 'Course prices are shown live from the catalogue. Service engagements are quoted after the audit — we do not publish a rate card because scope varies too much to price honestly in advance.',
};

export const faq = {
  eyebrow: 'Questions',
  heading: 'Before you get in touch',
  items: [
    {
      q: 'Do I have to be a client to take a course?',
      a: 'No. Courses are open to anyone — you can learn from us without ever hiring us. Plenty of owners do exactly that.',
    },
    {
      q: 'What does the free brand audit involve?',
      a: 'A review of your brand, channels and current marketing, followed by a short written summary of what we would change and why. No obligation to continue afterwards.',
    },
    {
      q: 'How long is a typical engagement?',
      a: 'We work in monthly terms. Most clients see enough to judge the work within the first two to three months, and can stop with notice at any point.',
    },
    {
      q: 'Do you work with brands outside Nigeria?',
      a: 'Yes. We work remotely with brands in other markets. Campaigns are set up for the regions and currencies that matter to your customers.',
    },
    {
      q: 'What do you need from us to start?',
      a: 'Access to your ad and social accounts, a sense of who your best customers are, and someone on your side who can approve creative quickly. That is genuinely it.',
    },
    {
      q: 'What if we already have an in-house marketer?',
      a: 'That is often the best setup. We handle the specialist work — paid media, production, reporting — and your in-house person keeps the brand knowledge. We document everything so they can take it over.',
    },
  ],
};

export const finalCta = {
  heading: 'Let us look at your brand',
  subheading:
    'Tell us where you are and what you are trying to grow. We will tell you honestly whether we can help — and what we would do first.',
  primaryCta: { label: 'Request a free brand audit', href: '#contact' },
  secondaryCta: { label: 'Browse courses instead', href: '#courses' },
};

export const footer = {
  blurb:
    'A brand services studio and learning academy. We run digital marketing and social media for growing brands — and teach their teams to do it too.',
  columns: [
    {
      title: 'Services',
      links: [
        { label: 'Digital Marketing & Ads', href: '#services' },
        { label: 'Social Media & Content', href: '#services' },
        { label: 'How we work', href: '#process' },
        { label: 'Pricing', href: '#pricing' },
      ],
    },
    {
      title: 'Academy',
      links: [
        { label: 'Browse courses', href: '#courses' },
        { label: 'Course categories', href: '#courses' },
        { label: 'Create an account', href: '/register' },
        { label: 'Sign in', href: '/login' },
      ],
    },
    {
      title: 'More',
      links: [
        { label: 'FAQ', href: '#faq' },
        { label: 'Contact', href: '#contact' },
        { label: 'Style guide', href: '/style-guide' },
      ],
    },
  ],
};
