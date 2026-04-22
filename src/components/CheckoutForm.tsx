import { useState } from 'react';
import { useStore } from '@nanostores/react';
import { motion, AnimatePresence } from 'framer-motion';
import { $lang, $cart, $cartTotal, clearCart } from '../store';
import { translations } from '../data/i18n';
import { cookies } from '../data/cookies';

export default function CheckoutForm() {
  const lang  = useStore($lang);
  const cart  = useStore($cart);
  const total = useStore($cartTotal);
  const T     = translations[lang].order;

  const [name,    setName]    = useState('');
  const [phone,   setPhone]   = useState('');
  const [date,    setDate]    = useState('');
  const [time,    setTime]    = useState('');
  const [message, setMessage] = useState('');
  const [errors,  setErrors]  = useState<Record<string, string>>({});
  const [done,    setDone]    = useState(false);

  if (cart.length === 0 && !done) {
    return (
      <div className="text-center py-20">
        <p className="text-5xl mb-4">🛒</p>
        <p className="font-semibold text-chocolate-700 mb-4">{T.emptyCart}</p>
        <a href="/menu" className="btn-primary">{T.goToMenu}</a>
      </div>
    );
  }

  if (done) {
    return (
      <motion.div
        className="text-center py-20"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <motion.div
          className="text-7xl mb-5"
          animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          🎉
        </motion.div>
        <h2 className="font-display text-3xl font-bold text-chocolate-900 mb-3">{T.successTitle}</h2>
        <p className="text-chocolate-500 max-w-sm mx-auto mb-2">
          {T.successMsg.replace('{name}', name).replace('{phone}', phone)}
        </p>
        {date && (
          <p className="text-sm text-chocolate-400 mb-8">
            {T.successDate.replace('{date}',
              `${new Date(date + 'T12:00:00').toLocaleDateString(
                lang === 'he' ? 'he-IL' : lang === 'ar' ? 'ar-EG' : 'en-US',
                { weekday: 'long', month: 'long', day: 'numeric' }
              )}${time ? ` @ ${time}` : ''}`
            )}
          </p>
        )}
        <a href="/" className="btn-primary">{T.backHome}</a>
      </motion.div>
    );
  }

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim())  e.name  = 'Required';
    if (!phone.trim() || !/^[\d\s\+\-\(\)]{7,}$/.test(phone)) e.phone = 'Valid phone required';
    if (!date) e.date = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    clearCart();
    setDone(true);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
      {/* Form */}
      <div className="lg:col-span-3">
        <h2 className="font-display text-2xl font-bold text-chocolate-900 mb-6">{T.step2}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-chocolate-800 mb-1.5">{T.name} *</label>
              <input
                type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder={T.namePlaceholder}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-cookie-400 ${errors.name ? 'border-red-400' : 'border-cream-300'}`}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-chocolate-800 mb-1.5">{T.phone} *</label>
              <input
                type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                placeholder={siteConfig.phone}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-cookie-400 ${errors.phone ? 'border-red-400' : 'border-cream-300'}`}
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-chocolate-800 mb-1.5">{T.date} *</label>
              <input
                type="date" value={date} onChange={e => setDate(e.target.value)}
                min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-cookie-400 ${errors.date ? 'border-red-400' : 'border-cream-300'}`}
              />
              {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-chocolate-800 mb-1.5">{T.time}</label>
              <input
                type="time" value={time} onChange={e => setTime(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:ring-2 focus:ring-cookie-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-chocolate-800 mb-1.5">{T.message}</label>
            <textarea
              value={message} onChange={e => setMessage(e.target.value)}
              placeholder={T.messagePlaceholder} rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:ring-2 focus:ring-cookie-400 resize-none"
            />
          </div>

          <div className="flex justify-end">
            <button type="submit" className="btn-primary">{T.placeOrder} 🍪</button>
          </div>
        </form>
      </div>

      {/* Order summary sidebar */}
      <div className="lg:col-span-2">
        <div className="card p-5 sticky top-24">
          <h3 className="font-display font-bold text-lg text-chocolate-900 mb-4">{T.step1}</h3>
          <ul className="flex flex-col gap-2 mb-4">
            {cart.map(item => {
              const cookie = cookies.find(c => c.id === item.cookieId);
              if (!cookie) return null;
              const name = translations[lang].cookies[item.cookieId as keyof typeof translations.en.cookies] ?? item.cookieId;
              return (
                <li key={item.cookieId} className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg overflow-hidden bg-cream-200 shrink-0">
                    <img src={`/images/${cookie.imageFile}`} alt={name} className="w-full h-full object-cover"
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  </div>
                  <span className="flex-1 text-chocolate-700 truncate">
                    {name}{item.qty > 1 && <span className="text-chocolate-400"> ×{item.qty}</span>}
                  </span>
                  <span className="font-medium">₪{cookie.price * item.qty}</span>
                </li>
              );
            })}
          </ul>

          <div className="border-t border-cream-200 pt-3 flex flex-col gap-1.5 text-sm">
            <div className="flex justify-between text-chocolate-500">
              <span>Subtotal</span><span>₪{total.regular}</span>
            </div>
            {total.bundle !== null && (
              <div className="flex justify-between font-semibold text-cookie-700">
                <span>Bundle price</span><span>₪{total.bundle}</span>
              </div>
            )}
            {total.pistachioPremium > 0 && (
              <div className="flex justify-between text-amber-700 font-medium">
                <span>{translations[lang].cart.pistachioPremium} ×{total.pistachioExtra}</span>
                <span>+₪{total.pistachioPremium}</span>
              </div>
            )}
            {total.savings > 0 && (
              <div className="flex justify-between text-green-600 font-semibold">
                <span>You save</span><span>₪{total.savings}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-base text-chocolate-900 border-t border-cream-200 pt-2 mt-1">
              <span>Total</span>
              <span className="text-cookie-600">₪{total.final}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { siteConfig } from '../data/config';
