import { useStore } from '@nanostores/react';
import { $lang } from '../store';
import { translations } from '../data/i18n';
import { siteConfig } from '../data/config';

export default function FooterClient() {
  const lang = useStore($lang);
  const T    = translations[lang];

  return (
    <footer className="bg-chocolate-950 text-cream-200 py-14 mt-20">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🍪</span>
            <span className="font-display font-bold text-xl text-cream-100">{T.siteName}</span>
          </div>
          <p className="text-cream-300 text-sm leading-relaxed">{T.footer.tagline}</p>
        </div>

        <div>
          <h3 className="font-semibold text-cream-100 mb-4">{T.footer.quickLinks}</h3>
          <ul className="flex flex-col gap-2 text-sm text-cream-300">
            <li><a href="/"      className="hover:text-cookie-400 transition-colors">{T.nav.home}</a></li>
            <li><a href="/menu"  className="hover:text-cookie-400 transition-colors">{T.nav.menu}</a></li>
            <li><a href="/order" className="hover:text-cookie-400 transition-colors">{T.nav.orderNow}</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-cream-100 mb-4">{T.footer.contact}</h3>
          <ul className="flex flex-col gap-2 text-sm text-cream-300">
            <li>
              <a href={`tel:${siteConfig.phone}`} className="hover:text-cookie-400 transition-colors">
                {siteConfig.phone}
              </a>
            </li>
            <li>{T.footer.hours}: {siteConfig.hours}</li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-10 pt-6 border-t border-chocolate-800 text-center text-xs text-cream-400">
        &copy; {new Date().getFullYear()} {T.siteName}. {T.footer.rights}
      </div>
    </footer>
  );
}
