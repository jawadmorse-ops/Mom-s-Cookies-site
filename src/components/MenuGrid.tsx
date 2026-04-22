import { useState } from 'react';
import { useStore } from '@nanostores/react';
import { motion, AnimatePresence } from 'framer-motion';
import { cookies } from '../data/cookies';
import { $lang, $cart, $cartOpen, addToCart } from '../store';
import { translations } from '../data/i18n';

function CookieCard({ cookie }: { cookie: typeof cookies[0] }) {
  const lang    = useStore($lang);
  const cart    = useStore($cart);
  const T       = translations[lang].menu;
  const [flash, setFlash] = useState<'ok' | 'limit' | null>(null);
  const [imgError, setImgError] = useState(false);

  const name    = translations[lang].cookies[cookie.id as keyof typeof translations.en.cookies] ?? cookie.id;
  const inCart  = cart.some(i => i.cookieId === cookie.id);
  const cartQty = cart.find(i => i.cookieId === cookie.id)?.qty ?? 0;

  const handleAdd = () => {
    const result = addToCart(cookie.id);
    if (!result.ok) {
      setFlash('limit');
      setTimeout(() => setFlash(null), 2000);
    } else {
      setFlash('ok');
      setTimeout(() => setFlash(null), 1000);
      $cartOpen.set(true);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
      className="card group flex flex-col h-full"
    >
      {/* Image */}
      <div className="relative h-44 bg-cream-100 overflow-hidden rounded-t-2xl">
        {!imgError ? (
          <img
            src={`/images/${cookie.imageFile}`}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">🍪</div>
        )}
        <div className="absolute top-2 start-2 flex flex-col gap-1">
          {cookie.bestSeller && (
            <span className="text-xs font-bold bg-cookie-600 text-white px-2 py-0.5 rounded-full shadow">
              {T.bestSeller}
            </span>
          )}
          {cookie.premium && (
            <span className="text-xs font-bold bg-chocolate-800 text-cream-100 px-2 py-0.5 rounded-full shadow">
              {T.premium}
            </span>
          )}
        </div>
        {cartQty > 0 && (
          <div className="absolute top-2 end-2 w-6 h-6 bg-green-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow">
            {cartQty}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-display font-semibold text-chocolate-900 text-lg mb-1">{name}</h3>
        <p className="text-cookie-600 font-bold text-lg mb-3">₪{cookie.price}</p>

        {/* Add button */}
        <div className="mt-auto">
          <AnimatePresence mode="wait">
            {flash === 'limit' ? (
              <motion.p
                key="limit"
                className="text-xs text-red-500 font-medium text-center py-2"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              >
                {translations[lang].cart.pistachioWarning}
              </motion.p>
            ) : (
              <motion.button
                key="btn"
                onClick={handleAdd}
                className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  flash === 'ok'
                    ? 'bg-green-500 text-white'
                    : 'bg-cookie-600 hover:bg-cookie-700 text-white active:scale-95'
                }`}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              >
                {flash === 'ok' ? '✓ Added!' : T.addToCart}
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

export default function MenuGrid() {
  const lang   = useStore($lang);
  const T      = translations[lang].menu;
  const [search, setSearch] = useState('');

  const filtered = cookies.filter(c => {
    if (!search) return true;
    const name = translations[lang].cookies[c.id as keyof typeof translations.en.cookies] ?? c.id;
    return name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div>
      {/* Search bar */}
      <div className="relative max-w-xs mb-8">
        <svg className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-chocolate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder={T.search}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full ps-9 pe-4 py-2.5 rounded-full border border-cream-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-cookie-400 placeholder-chocolate-400"
        />
      </div>

      <p className="text-sm text-chocolate-400 mb-5">
        {filtered.length} {filtered.length === 1 ? T.found1 : T.foundN}
      </p>

      <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <AnimatePresence mode="popLayout">
          {filtered.map(c => <CookieCard key={c.id} cookie={c} />)}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🤔</p>
          <p className="text-chocolate-400">No cookies match your search.</p>
        </div>
      )}
    </div>
  );
}
