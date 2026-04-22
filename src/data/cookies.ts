export interface Cookie {
  id: string;
  price: number;
  imageFile: string;
  bestSeller?: boolean;
  premium?: boolean;
}

export const cookies: Cookie[] = [
  { id: 'kinder',        price: 10, imageFile: 'kinder.jpg',        bestSeller: true },
  { id: 'pistachio',     price: 12, imageFile: 'pistachio.jpg',     premium: true },
  { id: 'classic',       price: 7,  imageFile: 'classic.jpg' },
  { id: 'raffaello',     price: 10, imageFile: 'raffaello.jpg' },
  { id: 'oreo',          price: 10, imageFile: 'oreo.jpg' },
  { id: 'hazelnut',      price: 10, imageFile: 'hazelnut.jpg' },
  { id: 'red-velvet',    price: 10, imageFile: 'red-velvet.jpg' },
  { id: 'amsterdam',     price: 10, imageFile: 'amsterdam.jpg' },
  { id: 'salted-pretzel',price: 10, imageFile: 'salted-pretzel.jpg' },
  { id: 'nutella',       price: 10, imageFile: 'nutella.jpg' },
  { id: 'marshmallow',   price: 10, imageFile: 'marshmallow.jpg' },
  { id: 'twix',          price: 10, imageFile: 'twix.jpg' },
  { id: 'snickers',      price: 10, imageFile: 'snickers.jpg' },
];

export const bundleTiers = [
  { qty: 6,  price: 50,  savingsNote: '' },
  { qty: 9,  price: 80,  savingsNote: '' },
  { qty: 12, price: 100, savingsNote: '' },
] as const;

export const PISTACHIO_PREMIUM = 5; // extra ₪ per pistachio after the first one in a bundle

export function getBundlePrice(totalQty: number): number | null {
  if (totalQty === 12) return 100;
  if (totalQty === 9)  return 80;
  if (totalQty === 6)  return 50;
  return null;
}

export function getNextBundleTier(totalQty: number) {
  if (totalQty < 6)  return bundleTiers[0];
  if (totalQty < 9)  return bundleTiers[1];
  if (totalQty < 12) return bundleTiers[2];
  return null;
}
