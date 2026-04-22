import { atom, computed } from 'nanostores';
import type { Lang } from '../data/i18n';
import { cookies, getBundlePrice, PISTACHIO_PREMIUM } from '../data/cookies';

export interface CartItem {
  cookieId: string;
  qty: number;
}

const isBrowser = typeof window !== 'undefined';

function readLS<T>(key: string, def: T): T {
  if (!isBrowser) return def;
  try { return (JSON.parse(localStorage.getItem(key) ?? 'null') as T) ?? def; }
  catch { return def; }
}

// ── State atoms ──────────────────────────────────────────────────────────────
export const $lang      = atom<Lang>(readLS<Lang>('lang', 'en'));
export const $cart      = atom<CartItem[]>(readLS<CartItem[]>('cart', []));
export const $cartOpen  = atom(false);

// ── Computed ─────────────────────────────────────────────────────────────────
export const $cartCount = computed($cart, items =>
  items.reduce((sum, i) => sum + i.qty, 0)
);

export const $cartTotal = computed($cart, items => {
  const totalQty       = items.reduce((s, i) => s + i.qty, 0);
  const bundlePrice    = getBundlePrice(totalQty);
  const pistachioQty   = items.find(i => i.cookieId === 'pistachio')?.qty ?? 0;
  const pistachioExtra   = bundlePrice !== null ? Math.max(0, pistachioQty - 1) : 0;
  const pistachioPremium = pistachioExtra * PISTACHIO_PREMIUM;
  const regularTotal   = items.reduce((sum, item) => {
    const cookie = cookies.find(c => c.id === item.cookieId);
    return sum + (cookie?.price ?? 0) * item.qty;
  }, 0);
  const final   = bundlePrice !== null ? bundlePrice + pistachioPremium : regularTotal;
  const savings = Math.max(0, regularTotal - final);
  return { regular: regularTotal, bundle: bundlePrice, pistachioPremium, pistachioExtra, final, savings };
});

// ── Persist to localStorage ───────────────────────────────────────────────────
if (isBrowser) {
  $lang.subscribe(v => localStorage.setItem('lang', JSON.stringify(v)));
  $cart.subscribe(v => localStorage.setItem('cart', JSON.stringify(v)));
}

// ── Cart actions ──────────────────────────────────────────────────────────────
export function addToCart(cookieId: string): { ok: boolean } {
  const current  = $cart.get();
  const existing = current.find(i => i.cookieId === cookieId);
  if (existing) {
    $cart.set(current.map(i => i.cookieId === cookieId ? { ...i, qty: i.qty + 1 } : i));
  } else {
    $cart.set([...current, { cookieId, qty: 1 }]);
  }
  return { ok: true };
}

export function removeFromCart(cookieId: string) {
  $cart.set($cart.get().filter(i => i.cookieId !== cookieId));
}

export function updateQty(cookieId: string, qty: number) {
  if (qty <= 0) { removeFromCart(cookieId); return; }
  $cart.set($cart.get().map(i => i.cookieId === cookieId ? { ...i, qty } : i));
}

export function clearCart() {
  $cart.set([]);
}

export function setLang(lang: Lang) {
  $lang.set(lang);
  if (isBrowser) {
    const isRTL = lang === 'he' || lang === 'ar';
    document.documentElement.dir  = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }
}
