import { useStore } from '@nanostores/react';
import { motion, AnimatePresence } from 'framer-motion';
import { $cart, $cartOpen, $cartTotal, $cartCount, removeFromCart, updateQty } from '../store';
import { $lang } from '../store';
import { cookies, bundleTiers, getNextBundleTier } from '../data/cookies';
import { translations } from '../data/i18n';

function BundleProgressBar() {
  const lang = useStore($lang);
  const T = translations[lang].bundle;
  const cart = useStore($cart);
  const total = useStore($cartTotal);
  const totalQty = useStore($cartCount);

  const next = getNextBundleTier(totalQty);
  const currentTier = bundleTiers.slice().reverse().find(t => totalQty >= t.qty) ?? null;

  let progressPct = 0;
  let progressLabel = '';

  if (!next) {
    progressPct = 100;
    progressLabel = T.bestDeal;
  } else {
    const prev = bundleTiers[bundleTiers.indexOf(next) - 1];
    const from = prev?.qty ?? 0;
    progressPct = Math.round(((totalQty - from) / (next.qty - from)) * 100);
    const need = next.qty - totalQty;
    const msgKey = `progress${next.qty}` as 'progress6' | 'progress9' | 'progress12';
    progressLabel = `${need} ${T[msgKey]}`;
  }

  return (
    <div className="bg-cream-50 rounded-xl p-3 mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-cookie-700 uppercase tracking-wide">{T.title}</span>
        {currentTier && (
          <span className="text-xs font-semibold text-green-600">{T.unlocked} 🎉</span>
        )}
      </div>

      <div className="flex gap-2 mb-2">
        {bundleTiers.map(tier => (
          <div key={tier.qty} className={`flex-1 text-center text-xs rounded-lg py-1.5 font-semibold transition-colors ${
            totalQty >= tier.qty ? 'bg-cookie-600 text-white' : 'bg-cream-200 text-chocolate-400'
          }`}>
            {tier.qty}🍪<br/>₪{tier.price}
          </div>
        ))}
      </div>

      <div className="relative h-2 bg-cream-200 rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 start-0 bg-cookie-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(progressPct, 100)}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      <p className="text-xs text-chocolate-500 mt-1.5 text-center">{progressLabel}</p>

      {total.savings > 0 && (
        <p className="text-xs font-semibold text-green-600 text-center mt-1">
          {translations[lang].cart.youSave} ₪{total.savings}!
        </p>
      )}
    </div>
  );
}

export default function CartDrawer() {
  const isOpen = useStore($cartOpen);
  const cart   = useStore($cart);
  const lang   = useStore($lang);
  const total  = useStore($cartTotal);
  const T      = translations[lang].cart;
  const isRTL  = lang === 'he' || lang === 'ar';

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="backdrop"
            className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => $cartOpen.set(false)}
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            key="drawer"
            className={`fixed top-0 ${isRTL ? 'left-0' : 'right-0'} h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col`}
            initial={{ x: isRTL ? '-100%' : '100%' }}
            animate={{ x: 0 }}
            exit={{ x: isRTL ? '-100%' : '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-cream-200">
              <h2 className="font-display font-bold text-xl text-chocolate-900">{T.title}</h2>
              <button
                onClick={() => $cartOpen.set(false)}
                className="p-2 rounded-full hover:bg-cream-100 transition-colors"
                aria-label="Close"
              >
                <svg className="w-5 h-5 text-chocolate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {cart.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-5xl mb-4">🍪</p>
                  <p className="font-semibold text-chocolate-700 mb-1">{T.empty}</p>
                  <p className="text-sm text-chocolate-400">{T.emptyHint}</p>
                  <button
                    onClick={() => $cartOpen.set(false)}
                    className="mt-6 btn-secondary text-sm py-2"
                  >
                    {T.continueShopping}
                  </button>
                </div>
              ) : (
                <>
                  <BundleProgressBar />

                  <ul className="flex flex-col gap-3">
                    <AnimatePresence initial={false}>
                      {cart.map(item => {
                        const cookie = cookies.find(c => c.id === item.cookieId);
                        if (!cookie) return null;
                        const name = translations[lang].cookies[item.cookieId as keyof typeof translations.en.cookies] ?? item.cookieId;
                        return (
                          <motion.li
                            key={item.cookieId}
                            className="flex items-center gap-3 bg-cream-50 rounded-xl p-3"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25 }}
                          >
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-cream-200 shrink-0">
                              <img
                                src={`/images/${cookie.imageFile}`}
                                alt={name}
                                className="w-full h-full object-cover"
                                onError={e => { (e.target as HTMLImageElement).style.display='none'; }}
                              />
                            </div>

                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm text-chocolate-900 truncate">{name}</p>
                              <p className="text-xs text-cookie-600">₪{cookie.price} each</p>
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => updateQty(item.cookieId, item.qty - 1)}
                                className="w-7 h-7 rounded-full bg-cream-200 hover:bg-cream-300 text-chocolate-700 font-bold text-sm flex items-center justify-center transition-colors"
                              >−</button>
                              <span className="w-5 text-center text-sm font-semibold">{item.qty}</span>
                              <button
                                onClick={() => updateQty(item.cookieId, item.qty + 1)}
                                className="w-7 h-7 rounded-full bg-cream-200 hover:bg-cream-300 text-chocolate-700 font-bold text-sm flex items-center justify-center transition-colors"
                              >+</button>
                            </div>

                            <p className="text-sm font-bold text-chocolate-900 w-12 text-end">
                              ₪{(cookie.price * item.qty).toFixed(0)}
                            </p>

                            <button
                              onClick={() => removeFromCart(item.cookieId)}
                              className="text-chocolate-300 hover:text-red-400 transition-colors"
                              aria-label={T.remove}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </motion.li>
                        );
                      })}
                    </AnimatePresence>
                  </ul>
                </>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="border-t border-cream-200 px-5 py-4 bg-white">
                <div className="flex flex-col gap-1 text-sm mb-4">
                  <div className="flex justify-between text-chocolate-500">
                    <span>{T.subtotal}</span>
                    <span>₪{total.regular.toFixed(0)}</span>
                  </div>
                  {total.bundle !== null && (
                    <div className="flex justify-between font-semibold text-cookie-700">
                      <span>{T.bundlePrice}</span>
                      <span>₪{total.bundle}</span>
                    </div>
                  )}
                  {total.pistachioPremium > 0 && (
                    <div className="flex justify-between text-amber-700 font-medium">
                      <span>{T.pistachioPremium} ×{total.pistachioExtra}</span>
                      <span>+₪{total.pistachioPremium}</span>
                    </div>
                  )}
                  {total.savings > 0 && (
                    <div className="flex justify-between text-green-600 font-semibold">
                      <span>{T.youSave}</span>
                      <span>₪{total.savings}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-base text-chocolate-900 border-t border-cream-200 pt-2 mt-1">
                    <span>{T.total}</span>
                    <span className="text-cookie-600">₪{total.final.toFixed(0)}</span>
                  </div>
                </div>

                <a
                  href="/order"
                  onClick={() => $cartOpen.set(false)}
                  className="btn-primary w-full justify-center"
                >
                  {T.checkout} →
                </a>
              </div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
