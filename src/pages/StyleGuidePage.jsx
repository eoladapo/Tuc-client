import { Link } from 'react-router-dom';
import {
  HiArrowLeft,
  HiOutlineSparkles,
  HiCheckCircle,
  HiOutlineExclamationTriangle,
  HiOutlineXCircle,
} from 'react-icons/hi2';

import Logo from '../components/ui/Logo';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Card, CardHeader, CardBody, CardFooter } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { Spinner } from '../components/ui/Spinner';
import { cn } from '../utils/cn';

/* ── Swatch data, mirroring tailwind.config.js ─────────────────────── */

const brandRamp = [
  { step: 50, hex: '#f6f4ff', label: 'Surfaces, tints' },
  { step: 100, hex: '#ede9fe', label: 'Icon chips, badges' },
  { step: 200, hex: '#ded5fd', label: 'Borders on tint' },
  { step: 300, hex: '#c4b2fb', label: 'Decorative blur' },
  { step: 400, hex: '#a385f6', label: 'Hover on dark' },
  { step: 500, hex: '#8759ef', label: 'Focus rings' },
  { step: 600, hex: '#7539e0', label: 'PRIMARY ACTION' },
  { step: 700, hex: '#6528c2', label: 'Action hover' },
  { step: 800, hex: '#54219e', label: 'Gradient mid' },
  { step: 900, hex: '#451d80', label: 'Gradient end' },
  { step: 950, hex: '#2b0f57', label: 'Deepest brand' },
];

const neutralRamp = [
  { step: 50, hex: '#f8fafc' },
  { step: 100, hex: '#f1f5f9' },
  { step: 200, hex: '#e2e8f0' },
  { step: 300, hex: '#cbd5e1' },
  { step: 400, hex: '#94a3b8' },
  { step: 500, hex: '#64748b' },
  { step: 600, hex: '#475569' },
  { step: 700, hex: '#334155' },
  { step: 800, hex: '#1e293b' },
  { step: 900, hex: '#0f172a' },
  { step: 950, hex: '#020617' },
];

const accentRamp = [
  { step: 100, hex: '#fef3c7' },
  { step: 500, hex: '#f59e0b' },
  { step: 600, hex: '#d97706' },
];

/* ── Small layout helpers ──────────────────────────────────────────── */

const Panel = ({ title, note, children, className = '' }) => (
  <section className={cn('scroll-mt-24', className)}>
    <h2 className="text-2xl font-extrabold tracking-tight text-secondary-900">{title}</h2>
    {note && <p className="mt-2 max-w-2xl text-base leading-relaxed text-secondary-600">{note}</p>}
    <div className="mt-6">{children}</div>
  </section>
);

const Swatch = ({ hex, name, usage, dark }) => (
  <div className="overflow-hidden rounded-xl border border-secondary-200">
    <div className="h-20 w-full" style={{ backgroundColor: hex }} />
    <div className={cn('px-3 py-2.5', dark && 'bg-secondary-900 text-white')}>
      <p className={cn('text-sm font-bold', dark ? 'text-white' : 'text-secondary-900')}>{name}</p>
      <p className={cn('font-mono text-xs', dark ? 'text-secondary-400' : 'text-secondary-500')}>
        {hex}
      </p>
      {usage && <p className="mt-1 text-xs leading-snug text-secondary-500">{usage}</p>}
    </div>
  </div>
);

const StyleGuidePage = () => (
  <div className="min-h-screen bg-secondary-50">
    {/* Header */}
    <header className="sticky top-0 z-40 border-b border-secondary-200 bg-white/90 backdrop-blur-lg">
      <div className="container-page flex h-16 items-center justify-between">
        <Logo size="small" />
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-base font-semibold text-secondary-600 transition-colors hover:bg-primary-50 hover:text-primary-700"
        >
          <HiArrowLeft className="h-4 w-4" />
          Back to site
        </Link>
      </div>
    </header>

    <div className="container-page py-14">
      {/* Intro */}
      <div className="max-w-3xl">
        <span className="eyebrow">
          <HiOutlineSparkles className="h-4 w-4" />
          Design system
        </span>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-secondary-900 sm:text-5xl">
          TUC Academy style guide
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-secondary-600">
          The brand is <strong className="font-bold text-secondary-900">purple and white</strong>,
          supported by a disciplined ink neutral and a rationed amber accent. Purple carries
          identity and action; white carries the space that makes both feel premium.
        </p>
      </div>

      <div className="mt-16 space-y-20">
        {/* ── Colour ───────────────────────────────────────────── */}
        <Panel
          title="Colour"
          note="Two families do almost all the work: purple for brand and action, ink neutrals for text and structure. Amber is a garnish — ratings and the occasional flag — never a large fill beside purple."
        >
          <h3 className="text-lg font-bold text-secondary-900">
            Primary / Brand — purple
          </h3>
          <p className="mt-1 text-base text-secondary-600">
            <code className="rounded bg-secondary-100 px-1.5 py-0.5 font-mono text-sm">
              primary-*
            </code>{' '}
            and its alias{' '}
            <code className="rounded bg-secondary-100 px-1.5 py-0.5 font-mono text-sm">brand-*</code>
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {brandRamp.map((c) => (
              <Swatch
                key={c.step}
                hex={c.hex}
                name={`primary-${c.step}`}
                usage={c.label}
                dark={c.step >= 900}
              />
            ))}
          </div>

          <h3 className="mt-10 text-lg font-bold text-secondary-900">Secondary — ink neutral</h3>
          <p className="mt-1 text-base text-secondary-600">
            Body copy, borders, dark sections and the footer. Never competes with purple.
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {neutralRamp.map((c) => (
              <Swatch key={c.step} hex={c.hex} name={`secondary-${c.step}`} dark={c.step >= 900} />
            ))}
          </div>

          <h3 className="mt-10 text-lg font-bold text-secondary-900">Accent — amber</h3>
          <p className="mt-1 text-base text-secondary-600">
            Stars, "most popular" flags, one-off highlights. Use sparingly.
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {accentRamp.map((c) => (
              <Swatch key={c.step} hex={c.hex} name={`accent-${c.step}`} />
            ))}
          </div>

          <h3 className="mt-10 text-lg font-bold text-secondary-900">Gradients</h3>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div className="overflow-hidden rounded-xl border border-secondary-200">
              <div className="h-24 bg-brand-gradient" />
              <p className="px-3 py-2.5 font-mono text-xs text-secondary-600">bg-brand-gradient</p>
            </div>
            <div className="overflow-hidden rounded-xl border border-secondary-200">
              <div className="h-24 bg-brand-soft" />
              <p className="px-3 py-2.5 font-mono text-xs text-secondary-600">bg-brand-soft</p>
            </div>
            <div className="overflow-hidden rounded-xl border border-secondary-200">
              <div className="h-24 bg-grid bg-white" />
              <p className="px-3 py-2.5 font-mono text-xs text-secondary-600">bg-grid</p>
            </div>
          </div>
        </Panel>

        {/* ── Typography ───────────────────────────────────────── */}
        <Panel
          title="Typography"
          note="One family: Plus Jakarta Sans. Headings are extrabold with tight tracking; body stays regular at a comfortable line height. The app's type scale is intentionally compact for dense dashboards — marketing surfaces step up to Tailwind's default 4xl–7xl for headlines."
        >
          <div className="space-y-6 rounded-2xl border border-secondary-200 bg-white p-7">
            <div className="border-b border-secondary-100 pb-5">
              <p className="font-mono text-xs text-secondary-400">
                text-4xl/5xl · font-extrabold · tracking-tight
              </p>
              <p className="mt-2 text-4xl font-extrabold tracking-tight text-secondary-900 sm:text-5xl">
                Display headline
              </p>
            </div>
            <div className="border-b border-secondary-100 pb-5">
              <p className="font-mono text-xs text-secondary-400">text-3xl · font-extrabold</p>
              <p className="mt-2 text-3xl font-extrabold tracking-tight text-secondary-900">
                Section heading
              </p>
            </div>
            <div className="border-b border-secondary-100 pb-5">
              <p className="font-mono text-xs text-secondary-400">text-xl · font-bold</p>
              <p className="mt-2 text-xl font-bold text-secondary-900">Card title</p>
            </div>
            <div className="border-b border-secondary-100 pb-5">
              <p className="font-mono text-xs text-secondary-400">
                text-lg · leading-relaxed · text-secondary-600
              </p>
              <p className="mt-2 max-w-2xl text-lg leading-relaxed text-secondary-600">
                Lead paragraph — used for hero subheadlines and section introductions. Comfortable
                line height so long copy stays readable.
              </p>
            </div>
            <div>
              <p className="font-mono text-xs text-secondary-400">
                text-base · text-secondary-700
              </p>
              <p className="mt-2 max-w-2xl text-base text-secondary-700">
                Body copy. This is the workhorse size for paragraphs, list items and form labels.
              </p>
            </div>
            <div className="border-t border-secondary-100 pt-5">
              <p className="font-mono text-xs text-secondary-400">.eyebrow · uppercase label</p>
              <p className="eyebrow mt-3">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-primary-500" />
                Course tracks
              </p>
            </div>
          </div>
        </Panel>

        {/* ── Buttons ──────────────────────────────────────────── */}
        <Panel
          title="Buttons"
          note="Primary purple for the single most important action in view. Outline for the secondary path. Never place two primary buttons side by side."
        >
          <div className="space-y-7 rounded-2xl border border-secondary-200 bg-white p-7">
            <div>
              <p className="mb-3 font-mono text-xs text-secondary-400">Sizes</p>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
                <Button size="lg" isLoading>
                  Loading
                </Button>
              </div>
            </div>

            <div>
              <p className="mb-3 font-mono text-xs text-secondary-400">Variants</p>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="success">Success</Button>
              </div>
            </div>

            <div>
              <p className="mb-3 font-mono text-xs text-secondary-400">
                Marketing CTA (landing page)
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-7 py-3.5 text-lg font-semibold text-white shadow-brand">
                  Start free
                </span>
                <span className="inline-flex items-center gap-2 rounded-xl border-2 border-secondary-200 bg-white px-7 py-3.5 text-lg font-semibold text-secondary-800">
                  See pricing
                </span>
              </div>
            </div>
          </div>
        </Panel>

        {/* ── Components ───────────────────────────────────────── */}
        <Panel title="Core components" note="Form controls, badges, cards and feedback states.">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Badges & avatars */}
            <div className="rounded-2xl border border-secondary-200 bg-white p-7">
              <h3 className="text-lg font-bold text-secondary-900">Badges</h3>
              <div className="mt-4 flex flex-wrap gap-2.5">
                <Badge variant="primary">Primary</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="danger">Danger</Badge>
                <Badge variant="info">Info</Badge>
                <Badge variant="gray">Gray</Badge>
              </div>

              <h3 className="mt-8 text-lg font-bold text-secondary-900">Avatars</h3>
              <div className="mt-4 flex items-center gap-3">
                <Avatar name="Ada Obi" size="sm" />
                <Avatar name="Ada Obi" size="md" />
                <Avatar name="Ada Obi" size="lg" />
              </div>

              <h3 className="mt-8 text-lg font-bold text-secondary-900">Loading</h3>
              <div className="mt-4">
                <Spinner />
              </div>
            </div>

            {/* Inputs */}
            <div className="rounded-2xl border border-secondary-200 bg-white p-7">
              <h3 className="text-lg font-bold text-secondary-900">Inputs</h3>
              <div className="mt-5 space-y-6">
                <Input label="Business name" placeholder="e.g. Ada's Beauty Studio" />
                <Input
                  label="Email address"
                  type="email"
                  placeholder="you@example.com"
                  helperText="We will only use this for account updates."
                />
                <Input
                  label="Website"
                  placeholder="yourbrand.com"
                  error="Enter a valid website address"
                />
                <Input
                  variant="minimal"
                  label="Minimal variant"
                  placeholder="Used on the auth pages"
                />
              </div>
            </div>
          </div>

          {/* Card */}
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-bold text-secondary-900">Card</h3>
              </CardHeader>
              <CardBody>
                <p className="text-base leading-relaxed text-secondary-600">
                  The base surface: white, one-pixel neutral border, softly elevated. Marketing
                  cards add a hover lift and a purple-tinted shadow.
                </p>
              </CardBody>
              <CardFooter>
                <span className="text-sm text-secondary-500">Footer region</span>
              </CardFooter>
            </Card>

            <div className="rounded-2xl border border-secondary-200 bg-white p-7">
              <h3 className="text-lg font-bold text-secondary-900">Feedback</h3>
              <ul className="mt-4 space-y-3.5">
                <li className="flex items-start gap-3">
                  <HiCheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" />
                  <span className="text-base text-secondary-700">
                    Success — purple check, neutral copy.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <HiOutlineExclamationTriangle className="mt-0.5 h-5 w-5 shrink-0 text-accent-500" />
                  <span className="text-base text-secondary-700">
                    Warning — amber, used sparingly.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <HiOutlineXCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                  <span className="text-base text-secondary-700">
                    Error — red, reserved for genuine problems.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </Panel>

        {/* ── Elevation & radius ───────────────────────────────── */}
        <Panel title="Elevation & radius" note="Purple-tinted shadows tie elevation to the brand.">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { cls: 'shadow-soft', name: 'shadow-soft', use: 'Resting cards' },
              { cls: 'shadow-lift', name: 'shadow-lift', use: 'Floating chips, modals' },
              { cls: 'shadow-brand', name: 'shadow-brand', use: 'Primary CTAs, hover' },
              { cls: 'shadow-brand-lg', name: 'shadow-brand-lg', use: 'Featured plan, hero' },
            ].map((s) => (
              <div key={s.name} className={cn('rounded-2xl bg-white p-6', s.cls)}>
                <p className="font-mono text-xs text-secondary-500">{s.name}</p>
                <p className="mt-2 text-base font-semibold text-secondary-800">{s.use}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-end gap-5">
            {[
              { r: 'rounded-lg', px: '8px' },
              { r: 'rounded-xl', px: '12px' },
              { r: 'rounded-2xl', px: '16px' },
              { r: 'rounded-3xl', px: '24px' },
              { r: 'rounded-4xl', px: '32px' },
            ].map((item) => (
              <div key={item.r} className="text-center">
                <div className={cn('h-20 w-20 border-2 border-primary-300 bg-primary-50', item.r)} />
                <p className="mt-2.5 font-mono text-xs text-secondary-500">{item.r}</p>
                <p className="text-xs text-secondary-400">{item.px}</p>
              </div>
            ))}
          </div>
        </Panel>

        {/* ── Rules ────────────────────────────────────────────── */}
        <Panel title="Usage rules">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-primary-200 bg-primary-50/60 p-7">
              <h3 className="flex items-center gap-2 text-lg font-bold text-primary-800">
                <HiCheckCircle className="h-5 w-5" />
                Do
              </h3>
              <ul className="mt-4 space-y-3 text-base text-secondary-700">
                <li>• Keep white as the dominant surface — purple earns attention by being rare.</li>
                <li>• Use <code className="font-mono text-sm">primary-600</code> for the single primary action per view.</li>
                <li>• Pair purple with ink neutrals, not with other saturated hues.</li>
                <li>• Reach for the dark <code className="font-mono text-sm">bg-brand-gradient</code> band to break up long light pages.</li>
                <li>• Check contrast: white on <code className="font-mono text-sm">primary-600</code> is 6.1:1 — AA for body text.</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-secondary-200 bg-white p-7">
              <h3 className="flex items-center gap-2 text-lg font-bold text-secondary-800">
                <HiOutlineXCircle className="h-5 w-5 text-red-500" />
                Don't
              </h3>
              <ul className="mt-4 space-y-3 text-base text-secondary-700">
                <li>• Don't put white text on <code className="font-mono text-sm">primary-400</code> or lighter — it fails contrast.</li>
                <li>• Don't stack two primary buttons next to each other.</li>
                <li>• Don't use amber for large fills or as a second brand colour.</li>
                <li>• Don't introduce a new hue without adding it here first.</li>
                <li>• Don't use pure black — <code className="font-mono text-sm">secondary-900/950</code> is the darkest ink.</li>
              </ul>
            </div>
          </div>
        </Panel>
      </div>

      <div className="mt-20 border-t border-secondary-200 pt-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-semibold text-primary-600 hover:text-primary-700"
        >
          <HiArrowLeft className="h-4 w-4" />
          Back to the landing page
        </Link>
      </div>
    </div>
  </div>
);

export default StyleGuidePage;
