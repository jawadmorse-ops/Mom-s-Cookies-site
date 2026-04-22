import { useStore } from '@nanostores/react';
import { motion } from 'framer-motion';
import { $lang, $cartOpen } from '../store';
import { translations } from '../data/i18n';

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: d } }),
};

export default function HeroSection() {
  const lang = useStore($lang);
  const T    = translations[lang].hero;

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-warm-gradient pt-16">
      <div className="absolute -top-32 -end-32 w-[600px] h-[600px] bg-cookie-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -start-32 w-[500px] h-[500px] bg-cream-300/40 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-20">
        {/* Text */}
        <div>
          <motion.p className="section-subtitle mb-4" variants={fadeUp} initial="hidden" animate="visible" custom={0}>
            {T.badge}
          </motion.p>

          <motion.h1
            className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-chocolate-900 mb-6"
            variants={fadeUp} initial="hidden" animate="visible" custom={0.15}
          >
            {T.title}{' '}
            <span className="text-cookie-600 italic">{T.accent}</span>
          </motion.h1>

          <motion.p
            className="text-chocolate-600 text-lg leading-relaxed mb-8 max-w-lg"
            variants={fadeUp} initial="hidden" animate="visible" custom={0.3}
          >
            {T.desc}
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-4"
            variants={fadeUp} initial="hidden" animate="visible" custom={0.45}
          >
            <a href="/menu" className="btn-primary">{T.browse}</a>
            <button onClick={() => $cartOpen.set(true)} className="btn-secondary">{T.order}</button>
          </motion.div>

          <motion.div
            className="mt-12 flex items-center gap-5"
            variants={fadeUp} initial="hidden" animate="visible" custom={0.6}
          >
            <div className="flex -space-x-2">
              {['🧑','👩','👨','🧕'].map((f, i) => (
                <span key={i} className="w-9 h-9 rounded-full bg-cream-200 border-2 border-cream-50 flex items-center justify-center text-base">
                  {f}
                </span>
              ))}
            </div>
            <div>
              <p className="text-sm font-semibold text-chocolate-900">2,400+ {T.customers}</p>
              <p className="text-xs text-cookie-600">★★★★★ 4.9 {T.rating}</p>
            </div>
          </motion.div>
        </div>

        {/* Visual */}
        <motion.div
          className="flex justify-center"
          variants={fadeUp} initial="hidden" animate="visible" custom={0.2}
        >
          <motion.div
            animate={{ y: [-8, 8, -8] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="relative"
          >
            <div className="text-[180px] md:text-[220px] leading-none select-none drop-shadow-2xl">🍪</div>
            {[
              { emoji: '🍫', style: { top: '-10%', left: '10%' },  delay: 0   },
              { emoji: '✨', style: { top: '10%',  right: '-5%' }, delay: 0.8 },
              { emoji: '🥜', style: { bottom: '-5%', left: '5%' }, delay: 1.6 },
              { emoji: '❤️', style: { bottom: '10%', right: '0' }, delay: 2.4 },
            ].map(({ emoji, style, delay }, i) => (
              <motion.span
                key={i}
                className="absolute text-4xl select-none"
                style={style}
                animate={{ y: [0, -10, 0], rotate: [-5, 5, -5] }}
                transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay }}
              >
                {emoji}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
