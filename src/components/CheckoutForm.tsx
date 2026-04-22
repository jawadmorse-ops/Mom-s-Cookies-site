import { useState } from 'react';
import { useStore } from '@nanostores/react';
import { motion } from 'framer-motion';
import { $lang, $cart, $cartTotal, clearCart } from '../store';
import { translations } from '../data/i18n';
import { cookies } from '../data/cookies';
import type { Lang } from '../data/i18n';
import type { CartItem } from '../store';

const WHATSAPP_NUMBER = '972506537666';

function buildWhatsAppMessage(
  lang: Lang,
  name: string,
  address: string,
  date: string,
  time: string,
  note: string,
  cart: CartItem[],
  total: { regular: number; bundle: number | null; pistachioPremium: number; pistachioExtra: number; final: number; savings: number }
): string {
  const Tc = translations[lang].cookies;
  const lines: string[] = [];

  const dateLabel = date
    ? new Date(date + 'T12:00:00').toLocaleDateString(
        lang === 'he' ? 'he-IL' : lang === 'ar' ? 'ar-EG' : 'en-US',
        { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
      )
    : '';

  lines.push(`🍪 *New Order — Mom's Cookies*`);
  lines.push('');
  lines.push(`*Name:* ${name}`);
  lines.push(`*Address:* ${address}`);
  if (dateLabel) lines.push(`*Delivery:* ${dateLabel}${time ? ` @ ${time}` : ''}`);
  lines.push('');
  lines.push(`*Order:*`);

  cart.forEach(item => {
    const cookie = cookies.find(c => c.id === item.cookieId);
    if (!cookie) return;
    const cookieName = Tc[item.cookieId as keyof typeof Tc] ?? item.cookieId;
    lines.push(`• ${cookieName} ×${item.qty} — ₪${cookie.price * item.qty}`);
  });

  lines.push('');

  if (total.bundle !== null) {
    lines.push(`*Bundle price (${cart.reduce((s, i) => s + i.qty, 0)} cookies):* ₪${total.bundle}`);
  } else {
    lines.push(`*Subtotal:* ₪${total.regular}`);
  }

  if (total.pistachioPremium > 0) {
    lines.push(`*Pistachio premium ×${total.pistachioExtra}:* +₪${total.pistachioPremium}`);
  }

  if (total.savings > 0) {
    lines.push(`*You save:* ₪${total.savings}`);
  }

  lines.push(`*Total: ₪${total.final}*`);

  if (note.trim()) {
    lines.push('');
    lines.push(`📝 _${note.trim()}_`);
  }

  return lines.join('\n');
}

export default function CheckoutForm() {
  const lang  = useStore($lang);
  const cart  = useStore($cart);
  const total = useStore($cartTotal);
  const T     = translations[lang].order;

  const [name,    setName]    = useState('');
  const [address, setAddress] = useState('');
  const [date,    setDate]    = useState('');
  const [time,    setTime]    = useState('');
  const [note,    setNote]    = useState('');
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
    const dateLabel = date
      ? new Date(date + 'T12:00:00').toLocaleDateString(
          lang === 'he' ? 'he-IL' : lang === 'ar' ? 'ar-EG' : 'en-US',
          { weekday: 'long', month: 'long', day: 'numeric' }
        )
      : '';

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
          💬
        </motion.div>
        <h2 className="font-display text-3xl font-bold text-chocolate-900 mb-3">{T.successTitle}</h2>
        <p className="text-chocolate-500 max-w-sm mx-auto mb-3">{T.successMsg}</p>
        {dateLabel && (
          <p className="text-sm text-chocolate-400 mb-8">
            {T.successDate.replace('{date}', `${dateLabel}${time ? ` @ ${time}` : ''}`)}
          </p>
        )}
        <a href="/" className="btn-primary">{T.backHome}</a>
      </motion.div>
    );
  }

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim())    e.name    = 'Required';
    if (!address.trim()) e.address = 'Required';
    if (!date)           e.date    = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;

    const msg = buildWhatsAppMessage(lang, name, address, date, time, note, cart, total);
    const url  = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

    window.open(url, '_blank', 'noopener,noreferrer');
    clearCart();
    setDone(true);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
      {/* Form */}
      <div className="lg:col-span-3">
        <h2 className="font-display text-2xl font-bold text-chocolate-900 mb-6">{T.step2}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* Name + Address */}
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
              <label className="block text-sm font-semibold text-chocolate-800 mb-1.5">{T.address} *</label>
              <input
                type="text" value={address} onChange={e => setAddress(e.target.value)}
                placeholder={T.addressPlaceholder}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-cookie-400 ${errors.address ? 'border-red-400' : 'border-cream-300'}`}
              />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>
          </div>

          {/* Date + Time */}
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

          {/* Note */}
          <div>
            <label className="block text-sm font-semibold text-chocolate-800 mb-1.5">{T.message}</label>
            <textarea
              value={note} onChange={e => setNote(e.target.value)}
              placeholder={T.messagePlaceholder} rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:ring-2 focus:ring-cookie-400 resize-none"
            />
          </div>

          <div className="flex justify-end">
            <button type="submit" className="btn-primary gap-3">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              {T.placeOrder}
            </button>
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
              const cookieName = translations[lang].cookies[item.cookieId as keyof typeof translations.en.cookies] ?? item.cookieId;
              return (
                <li key={item.cookieId} className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg overflow-hidden bg-cream-200 shrink-0">
                    <img src={`/images/${cookie.imageFile}`} alt={cookieName} className="w-full h-full object-cover"
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  </div>
                  <span className="flex-1 text-chocolate-700 truncate">
                    {cookieName}{item.qty > 1 && <span className="text-chocolate-400"> ×{item.qty}</span>}
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
