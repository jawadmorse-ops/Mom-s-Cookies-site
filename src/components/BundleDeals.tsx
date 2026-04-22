import { useStore } from '@nanostores/react';
import { motion } from 'framer-motion';
import { $lang } from '../store';
import { translations } from '../data/i18n';
import { bundleTiers } from '../data/cookies';

export default function BundleDeals() {
  const lang = useStore($lang);
  const T    = translations[lang].bundle;

  const deals = [
    { ...bundleTiers[0], key: T.deal6,  savings: '₪10+', label: T.deal6  },
    { ...bundleTiers[1], key: T.deal9,  savings: '₪20+', label: T.deal9, featured: true },
    { ...bundleTiers[2], key: T.deal12, savings: '₪30+', label: T.deal12 },
  ];

  return (
    <section className="py-20 px-6 bg-chocolate-950">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-cookie-400 text-sm font-semibold uppercase tracking-widest mb-2">{T.subtitle}</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-cream-100">{T.sectionTitle}</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {deals.map(({ qty, price, label, featured }, i) => (
            <motion.div
              key={qty}
              className={`relative rounded-2xl overflow-hidden border-2 transition-all ${
                featured
                  ? 'border-cookie-500 shadow-xl shadow-cookie-900/30'
                  : 'border-chocolate-700 hover:border-cookie-600'
              }`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
            >
              {featured && (
                <div className="absolute top-0 inset-x-0 bg-cookie-600 text-white text-xs font-bold text-center py-1 tracking-wide">
                  ⭐ MOST POPULAR
                </div>
              )}

              {/* Box image */}
              <div className={`h-40 bg-chocolate-900 overflow-hidden ${featured ? 'mt-6' : ''}`}>
                <img
                  src="/images/box-bundle.jpg"
                  alt={T.boxAlt}
                  className="w-full h-full object-cover opacity-80"
                  onError={e => {
                    const el = e.target as HTMLImageElement;
                    el.style.display = 'none';
                    el.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center text-6xl">📦</div>';
                  }}
                />
              </div>

              <div className="p-5 bg-chocolate-900/80">
                <p className="font-display font-bold text-2xl text-cream-100 mb-1">{qty} 🍪</p>
                <p className="text-3xl font-black text-cookie-400 mb-2">₪{price}</p>
                <p className="text-cream-400 text-sm mb-4">{label}</p>
                <a href="/menu" className={`block text-center font-bold py-2.5 rounded-full transition-colors text-sm ${
                  featured
                    ? 'bg-cookie-600 hover:bg-cookie-700 text-white'
                    : 'border border-chocolate-600 text-cream-300 hover:border-cookie-500 hover:text-cookie-400'
                }`}>
                  {translations[lang].menu.addToCart} →
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
