import { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { motion, AnimatePresence } from 'framer-motion';
import { $lang, $cartCount, $cartOpen } from '../store';
import { translations } from '../data/i18n';
import { siteConfig } from '../data/config';
import LanguageSwitcher from './LanguageSwitcher';

export default function NavbarClient({ currentPath }: { currentPath: string }) {
  const lang      = useStore($lang);
  const cartCount = useStore($cartCount);
  const T         = translations[lang];
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled]     = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { href: '/',      label: T.nav.home  },
    { href: '/menu',  label: T.nav.menu  },
    { href: '/order', label: T.nav.orderNow },
  ];

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-cream-50/95 backdrop-blur-md shadow-sm border-b border-cream-200' : 'bg-cream-50/80 backdrop-blur-sm'
    }`}>
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 group shrink-0">
          <span className="text-2xl">🍪</span>
          <span className="font-display font-bold text-lg text-chocolate-900 group-hover:text-cookie-600 transition-colors hidden sm:block">
            {T.siteName}
          </span>
        </a>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Desktop nav links */}
        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <a
                href={href}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  currentPath === href
                    ? 'bg-cookie-600 text-white'
                    : 'text-chocolate-700 hover:bg-cream-200 hover:text-cookie-700'
                }`}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* Language switcher — desktop */}
        <div className="hidden md:block">
          <LanguageSwitcher />
        </div>

        {/* Cart button */}
        <button
          onClick={() => $cartOpen.set(true)}
          className="relative p-2 rounded-full hover:bg-cream-200 transition-colors"
          aria-label={T.nav.cart}
        >
          <svg className="w-6 h-6 text-chocolate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <AnimatePresence>
            {cartCount > 0 && (
              <motion.span
                key={cartCount}
                className="absolute -top-1 -end-1 w-5 h-5 bg-cookie-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: 'spring', damping: 15 }}
              >
                {cartCount}
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileOpen(v => !v)}
          className="md:hidden p-2 rounded-full hover:bg-cream-200 transition-colors"
          aria-label="Toggle menu"
        >
          <svg className="w-5 h-5 text-chocolate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d={mobileOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
          </svg>
        </button>
      </nav>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="md:hidden border-t border-cream-200 bg-cream-50 px-4 pb-4"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            <ul className="flex flex-col gap-1 pt-3">
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                      currentPath === href
                        ? 'bg-cookie-600 text-white'
                        : 'text-chocolate-700 hover:bg-cream-200'
                    }`}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-3 pt-3 border-t border-cream-200">
              <LanguageSwitcher />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
