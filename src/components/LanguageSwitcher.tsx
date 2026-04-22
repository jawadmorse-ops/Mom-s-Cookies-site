import { useStore } from '@nanostores/react';
import { $lang, setLang } from '../store';
import type { Lang } from '../data/i18n';

const langs: { code: Lang; label: string; flag: string }[] = [
  { code: 'en', label: 'EN', flag: '🇺🇸' },
  { code: 'he', label: 'עב', flag: '🇮🇱' },
  { code: 'ar', label: 'عر', flag: '🇯🇴' },
];

export default function LanguageSwitcher() {
  const lang = useStore($lang);

  return (
    <div className="flex items-center gap-1 bg-cream-100 rounded-full p-0.5">
      {langs.map(l => (
        <button
          key={l.code}
          onClick={() => setLang(l.code)}
          title={l.code.toUpperCase()}
          className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all duration-200 ${
            lang === l.code
              ? 'bg-cookie-600 text-white shadow-sm'
              : 'text-chocolate-600 hover:text-cookie-700'
          }`}
        >
          {l.flag} {l.label}
        </button>
      ))}
    </div>
  );
}
