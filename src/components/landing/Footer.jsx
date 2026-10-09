import Logo from '../ui/Logo';
import { SmartLink } from './Primitives';
import { footer, contact } from '../../data/landingContent';

const Footer = () => (
  <footer className="bg-secondary-950 text-secondary-400">
    <div className="container-page py-16">
      <div className="grid gap-12 lg:grid-cols-[1.5fr_repeat(3,1fr)]">
        {/* Brand */}
        <div>
          <Logo size="default" variant="inverse" />
          <p className="mt-5 max-w-sm text-base leading-relaxed">{footer.blurb}</p>

          <div className="mt-7 space-y-2.5">
            <a
              href={`mailto:${contact.email}`}
              className="block text-base font-semibold text-secondary-300 transition-colors hover:text-white"
            >
              {contact.email}
            </a>
            <p className="text-base text-secondary-500">{contact.location}</p>
          </div>
        </div>

        {/* Link columns */}
        {footer.columns.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-white">
              {column.title}
            </h3>
            <ul className="mt-5 space-y-3.5">
              {column.links.map((link) => (
                <li key={link.label}>
                  <SmartLink
                    href={link.href}
                    className="text-base text-secondary-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </SmartLink>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
    </div>

    <div className="border-t border-white/10">
      <div className="container-page py-7">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} TUC Academy. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
