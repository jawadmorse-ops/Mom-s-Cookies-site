import { useStore } from '@nanostores/react';
import { motion } from 'framer-motion';
import { $lang } from '../store';
import { translations } from '../data/i18n';

export default function WhyUsSection() {
  const lang = useStore($lang);
  const T    = translations[lang].why;

  return (
    <section className="py-20 px-6 bg-cream-100">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="section-subtitle mb-2">{T.title}</p>
          <h2 className="section-title">{T.subtitle}</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {T.items.map((item, i) => (
            <motion.div
              key={i}
              className="bg-white rounded-2xl p-6 text-center shadow-sm border border-cream-200 hover:border-cookie-300 transition-colors"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="text-4xl mb-3">{item.icon}</div>
              <h3 className="font-display font-semibold text-chocolate-900 mb-2">{item.title}</h3>
              <p className="text-sm text-chocolate-500 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
