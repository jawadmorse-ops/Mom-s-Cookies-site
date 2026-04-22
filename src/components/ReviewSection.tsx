import { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { motion, AnimatePresence } from 'framer-motion';
import { $lang } from '../store';
import { translations } from '../data/i18n';

interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  date: string;
}

function StarRating({
  value,
  onChange,
  readonly = false,
}: {
  value: number;
  onChange?: (v: number) => void;
  readonly?: boolean;
}) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          className={`text-xl transition-transform ${!readonly && 'hover:scale-110 cursor-pointer'} ${readonly && 'cursor-default'}`}
        >
          <span className={star <= (hover || value) ? 'text-cookie-500' : 'text-cream-300'}>
            ★
          </span>
        </button>
      ))}
    </div>
  );
}

export default function ReviewSection() {
  const lang   = useStore($lang);
  const T      = translations[lang].reviews;

  const [reviews, setReviews]     = useState<Review[]>([]);
  const [showForm, setShowForm]   = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [name, setName]           = useState('');
  const [rating, setRating]       = useState(5);
  const [text, setText]           = useState('');
  const [errors, setErrors]       = useState<Record<string, string>>({});

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('reviews') ?? '[]') as Review[];
      setReviews(saved);
    } catch { setReviews([]); }
  }, []);

  const persist = (updated: Review[]) => {
    setReviews(updated);
    localStorage.setItem('reviews', JSON.stringify(updated));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!text.trim() || text.trim().length < 10) e.text = 'Please write at least 10 characters.';
    if (rating === 0) e.rating = 'Please select a rating.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const review: Review = {
      id: Date.now().toString(),
      name: name.trim() || T.anonymous,
      rating,
      text: text.trim(),
      date: new Date().toLocaleDateString(
        lang === 'he' ? 'he-IL' : lang === 'ar' ? 'ar-EG' : 'en-US',
        { year: 'numeric', month: 'short', day: 'numeric' }
      ),
    };

    persist([review, ...reviews]);
    setName(''); setRating(5); setText('');
    setShowForm(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="section-subtitle mb-2">{T.subtitle}</p>
          <h2 className="section-title mb-2">{T.title}</h2>
          {avgRating && (
            <p className="text-cookie-600 font-semibold mt-1">
              ★ {avgRating} &middot; {reviews.length} review{reviews.length !== 1 ? 's' : ''}
            </p>
          )}
        </motion.div>

        {/* Success toast */}
        <AnimatePresence>
          {submitted && (
            <motion.div
              className="mb-6 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm font-medium text-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {T.thankYou} 🍪
            </motion.div>
          )}
        </AnimatePresence>

        {/* Write a review button */}
        {!showForm && (
          <div className="text-center mb-8">
            <button
              onClick={() => setShowForm(true)}
              className="btn-secondary"
            >
              ✍️ {T.addReview}
            </button>
          </div>
        )}

        {/* Review form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              className="card p-6 mb-8"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="font-display font-semibold text-xl text-chocolate-900 mb-5">{T.addReview}</h3>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-chocolate-800 mb-1.5">{T.nameLabel}</label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder={T.namePlaceholder}
                      className="w-full px-4 py-2.5 rounded-xl border border-cream-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-cookie-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-chocolate-800 mb-1.5">{T.ratingLabel}</label>
                    <StarRating value={rating} onChange={setRating} />
                    {errors.rating && <p className="text-red-500 text-xs mt-1">{errors.rating}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-chocolate-800 mb-1.5">{T.reviewLabel}</label>
                  <textarea
                    value={text}
                    onChange={e => setText(e.target.value)}
                    placeholder={T.reviewPlaceholder}
                    rows={3}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-cookie-400 resize-none ${
                      errors.text ? 'border-red-400' : 'border-cream-300'
                    }`}
                  />
                  {errors.text && <p className="text-red-500 text-xs mt-1">{errors.text}</p>}
                </div>

                <div className="flex gap-3 justify-end">
                  <button type="button" onClick={() => setShowForm(false)} className="btn-secondary text-sm py-2">
                    {T.cancel}
                  </button>
                  <button type="submit" className="btn-primary text-sm py-2">
                    {T.submit}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reviews list */}
        {reviews.length === 0 ? (
          <div className="text-center py-12 text-chocolate-400">
            <p className="text-4xl mb-3">💬</p>
            <p>{T.noReviews}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AnimatePresence initial={false}>
              {reviews.map((review, i) => (
                <motion.div
                  key={review.id}
                  className="card p-5"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-full bg-cookie-100 flex items-center justify-center text-cookie-700 font-bold text-sm">
                        {review.name[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-chocolate-900">{review.name}</p>
                        <p className="text-xs text-chocolate-400">{review.date}</p>
                      </div>
                    </div>
                    <StarRating value={review.rating} readonly />
                  </div>
                  <p className="text-sm text-chocolate-600 leading-relaxed">{review.text}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}
