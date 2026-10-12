'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  Banknote,
  CheckCircle2,
  ChevronRight,
  Clock,
  CreditCard,
  Fish,
  MapPin,
  Minus,
  Plus,
  Search,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  Star,
  Trash2,
  Truck,
  X,
} from 'lucide-react';

// ============================================================================
// DATA
// ============================================================================

type Lang = 'en' | 'ta';
type Category = 'All' | 'Fish' | 'Prawns' | 'Crab';

interface Product {
  id: string;
  name: string;
  tamil: string;
  category: Exclude<Category, 'All'>;
  basePrice: number; // per kg
  desc: string;
  descTa: string;
  tag?: string;
  gradient: string;
}

const PRODUCTS: Product[] = [
  { id: 'vanjaram', name: 'Seer Fish', tamil: 'வஞ்சரம்', category: 'Fish', basePrice: 900, desc: 'Premium sliced steaks, cleaned & gutted', descTa: 'சுத்தம் செய்யப்பட்ட துண்டுகள்', tag: 'Bestseller', gradient: 'from-cyan-500/30 to-blue-600/30' },
  { id: 'vavval', name: 'Pomfret', tamil: 'வவ்வால்', category: 'Fish', basePrice: 1100, desc: 'Whole fish, descaled & cleaned', descTa: 'செதில் நீக்கி சுத்தம் செய்யப்பட்டது', tag: 'Premium', gradient: 'from-violet-500/30 to-purple-600/30' },
  { id: 'sankara', name: 'Red Snapper', tamil: 'சங்கரா', category: 'Fish', basePrice: 650, desc: 'Curry-cut pieces, fresh catch', descTa: 'குழம்பு துண்டுகள்', gradient: 'from-rose-500/30 to-red-600/30' },
  { id: 'mathi', name: 'Sardine', tamil: 'மத்தி', category: 'Fish', basePrice: 280, desc: 'Whole, cleaned — great for fry', descTa: 'வறுவலுக்கு ஏற்றது', gradient: 'from-emerald-500/30 to-teal-600/30' },
  { id: 'ayila', name: 'Mackerel', tamil: 'அயிலை', category: 'Fish', basePrice: 320, desc: 'Whole, cleaned & gutted', descTa: 'சுத்தம் செய்யப்பட்ட முழு மீன்', gradient: 'from-sky-500/30 to-indigo-600/30' },
  { id: 'nethili', name: 'Anchovy', tamil: 'நெத்திலி', category: 'Fish', basePrice: 380, desc: 'Cleaned, ideal for fry & curry', descTa: 'வறுவல் மற்றும் குழம்புக்கு', gradient: 'from-amber-500/30 to-orange-600/30' },
  { id: 'era', name: 'Tiger Prawns', tamil: 'இறா', category: 'Prawns', basePrice: 850, desc: 'Deveined, shell-on medium size', descTa: 'நரம்பு நீக்கப்பட்டது', tag: 'Fresh Today', gradient: 'from-orange-500/30 to-red-500/30' },
  { id: 'nandu', name: 'Mud Crab', tamil: 'நண்டு', category: 'Crab', basePrice: 1200, desc: 'Live-weight, cleaned on order', descTa: 'ஆர்டரில் சுத்தம் செய்யப்படும்', tag: 'Limited', gradient: 'from-red-500/30 to-rose-700/30' },
];

const WEIGHTS = [
  { value: '250g', mult: 0.25 },
  { value: '500g', mult: 0.5 },
  { value: '1kg', mult: 1 },
  { value: '2kg', mult: 2 },
] as const;

const FREE_DELIVERY_AT = 500;
const DELIVERY_FEE = 40;

interface CartLine {
  productId: string;
  weight: string;
  qty: number;
}

const t = {
  en: {
    tagline: 'Premium Seafood E-Commerce',
    heroKicker: 'Fresh from Chennai coast',
    heroTitle: 'Seafood, delivered fresh.',
    heroSub: 'Order before 6 PM for same-day delivery across Chennai. Cleaned, cut & packed hygienically.',
    shopNow: 'Shop Now',
    viewCart: 'View Cart',
    searchPh: 'Search fish, prawns, crab…',
    categories: ['All', 'Fish', 'Prawns', 'Crab'] as Category[],
    add: 'Add',
    added: 'Added',
    yourCart: 'Your Cart',
    empty: 'Your cart is empty',
    emptySub: 'Add some fresh catch to get started.',
    freeMore: (n: number) => `₹${n} more for FREE delivery`,
    freeDone: 'You unlocked FREE delivery',
    subtotal: 'Subtotal',
    delivery: 'Delivery',
    free: 'FREE',
    total: 'Total',
    checkout: 'Checkout',
    address: 'Delivery Address',
    name: 'Full name',
    phone: 'Phone number',
    addr: 'Street address, area',
    back: 'Back',
    continue: 'Continue',
    slot: 'Delivery Slot',
    slots: ['Today, 4 – 6 PM', 'Today, 6 – 8 PM', 'Tomorrow, 8 – 10 AM'],
    payment: 'Payment',
    upi: 'UPI',
    card: 'Card',
    cod: 'Cash on Delivery',
    review: 'Review Order',
    place: 'Place Order',
    success: 'Order placed!',
    successSub: 'Your fresh catch is being packed.',
    track: 'Track Order',
    cont: 'Continue Shopping',
    perKg: (p: number) => `₹${p}/kg`,
    testimonials: 'What Chennai says',
    demoNote: 'Concept demo store — no real orders. Built by Lokesh.',
    backToPortfolio: 'Back to portfolio',
  },
  ta: {
    tagline: 'பிரீமியம் கடல் உணவு',
    heroKicker: 'சென்னை கடற்கரையிலிருந்து',
    heroTitle: 'புதிய கடல் உணவு, வீடு வரை.',
    heroSub: 'மாலை 6 மணிக்குள் ஆர்டர் செய்யுங்கள் — சென்னையில் அதே நாள் டெலிவரி.',
    shopNow: 'வாங்குங்கள்',
    viewCart: 'கூடையைப் பார்க்க',
    searchPh: 'மீன், இறா, நண்டு தேடுக…',
    categories: ['All', 'Fish', 'Prawns', 'Crab'] as Category[],
    add: 'சேர்',
    added: 'சேர்ந்தது',
    yourCart: 'உங்கள் கூடை',
    empty: 'கூடை காலியாக உள்ளது',
    emptySub: 'புதிய மீன்களைச் சேர்க்கவும்.',
    freeMore: (n: number) => `இலவச டெலிவரிக்கு ₹${n} மேலும்`,
    freeDone: 'இலவச டெலிவரி கிடைத்தது',
    subtotal: 'மொத்தம்',
    delivery: 'டெலிவரி',
    free: 'இலவசம்',
    total: 'செலுத்த வேண்டியது',
    checkout: 'பணம் செலுத்து',
    address: 'டெலிவரி முகவரி',
    name: 'பெயர்',
    phone: 'தொலைபேசி எண்',
    addr: 'தெரு, பகுதி',
    back: 'பின்',
    continue: 'தொடர்க',
    slot: 'டெலிவரி நேரம்',
    slots: ['இன்று, மாலை 4 – 6', 'இன்று, மாலை 6 – 8', 'நாளை, காலை 8 – 10'],
    payment: 'பணம் செலுத்தும் முறை',
    upi: 'யுபிஐ',
    card: 'கார்டு',
    cod: 'பணம் கொடுத்து வாங்க',
    review: 'ஆர்டரைச் சரிபார்',
    place: 'ஆர்டர் செய்',
    success: 'ஆர்டர் ஆகிவிட்டது!',
    successSub: 'உங்கள் மீன் பேக் செய்யப்படுகிறது.',
    track: 'ஆர்டரைப் பார்',
    cont: 'மேலும் வாங்குக',
    perKg: (p: number) => `₹${p}/கிலோ`,
    testimonials: 'சென்னை சொல்வது',
    demoNote: 'மாதிரி டெமோ கடை — உண்மை ஆர்டர் இல்லை. லோகேஷ் உருவாக்கியது.',
    backToPortfolio: 'போர்ட்ஃபோலியோ',
  },
};

// ============================================================================
// MAIN DEMO STORE
// ============================================================================

export function KadalStoreDemo() {
  const [lang, setLang] = useState<Lang>('en');
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [category, setCategory] = useState<Category>('All');
  const [query, setQuery] = useState('');
  const [weights, setWeights] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<string | null>(null);
  const [orderId, setOrderId] = useState('');
  const [trackStep, setTrackStep] = useState(1);

  // checkout form
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [addr, setAddr] = useState('');
  const [slot, setSlot] = useState(0);
  const [pay, setPay] = useState<'upi' | 'card' | 'cod'>('upi');

  const s = t[lang];
  const priceOf = (p: Product, w: string) =>
    Math.round(p.basePrice * (WEIGHTS.find((x) => x.value === w)?.mult ?? 0.5));

  const cartCount = cart.reduce((n, l) => n + l.qty, 0);
  const subtotal = cart.reduce((sum, l) => {
    const p = PRODUCTS.find((x) => x.id === l.productId);
    return p ? sum + priceOf(p, l.weight) * l.qty : sum;
  }, 0);
  const delivery = subtotal === 0 || subtotal >= FREE_DELIVERY_AT ? 0 : DELIVERY_FEE;
  const total = subtotal + delivery;

  const filtered = useMemo(
    () =>
      PRODUCTS.filter(
        (p) =>
          (category === 'All' || p.category === category) &&
          (query.trim() === '' ||
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.tamil.includes(query)),
      ),
    [category, query],
  );

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2200);
  };

  const addToCart = (p: Product) => {
    const w = weights[p.id] ?? '500g';
    setCart((prev) => {
      const i = prev.findIndex((l) => l.productId === p.id && l.weight === w);
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i], qty: next[i].qty + 1 };
        return next;
      }
      return [...prev, { productId: p.id, weight: w, qty: 1 }];
    });
    showToast(lang === 'en' ? `${p.name} (${w}) added` : `${p.tamil} (${w}) சேர்ந்தது`);
  };

  const changeQty = (key: string, d: number) =>
    setCart((prev) =>
      prev
        .map((l) =>
          `${l.productId}-${l.weight}` === key ? { ...l, qty: l.qty + d } : l,
        )
        .filter((l) => l.qty > 0),
    );

  const placeOrder = () => {
    setOrderId(`KT-${Date.now().toString().slice(-6)}`);
    setStep(4);
    setTrackStep(1);
    window.setTimeout(() => setTrackStep(2), 2500);
    window.setTimeout(() => setTrackStep(3), 5000);
  };

  const resetShop = () => {
    setCart([]);
    setCheckoutOpen(false);
    setCartOpen(false);
    setStep(0);
    setName('');
    setPhone('');
    setAddr('');
  };

  const addrValid = name.trim() !== '' && phone.replace(/\D/g, '').length >= 10 && addr.trim() !== '';

  return (
    <div className="min-h-screen bg-[#faf7f2] text-gray-900">
      {/* Demo banner */}
      <div className="bg-[#bd2d3c] text-white text-center text-xs sm:text-sm py-2 px-4">
        {s.demoNote}{' '}
        <Link href="/showcase/kadal-thunai" className="underline underline-offset-2 font-medium">
          {s.backToPortfolio}
        </Link>
      </div>

      {/* Nav */}
      <header className="sticky top-0 z-40 bg-[#faf7f2]/90 backdrop-blur border-b border-black/10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="flex items-center gap-2 font-bold text-lg">
            <span className="w-9 h-9 rounded-xl bg-[#bd2d3c] text-white flex items-center justify-center">
              <Fish className="w-5 h-5" />
            </span>
            Kadal Thunai
          </div>
          <div className="hidden sm:flex flex-1 max-w-md ml-4 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={s.searchPh}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-black/10 bg-white text-sm outline-none focus:ring-2 focus:ring-[#bd2d3c]/40"
            />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setLang(lang === 'en' ? 'ta' : 'en')}
              className="px-3 py-2 min-h-11 rounded-xl border border-black/10 bg-white text-sm font-medium hover:bg-black/5"
              aria-label="Toggle language"
            >
              {lang === 'en' ? 'தமிழ்' : 'English'}
            </button>
            <button
              onClick={() => setCartOpen(true)}
              className="relative px-4 py-2 min-h-11 rounded-xl bg-[#bd2d3c] text-white text-sm font-semibold flex items-center gap-2 hover:bg-[#a02532]"
              aria-label={s.viewCart}
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">{s.viewCart}</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gray-900 text-white text-xs flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
        <div className="sm:hidden px-4 pb-3 relative">
          <Search className="w-4 h-4 absolute left-7 top-1/2 -translate-y-[calc(50%+6px)] text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={s.searchPh}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-black/10 bg-white text-sm outline-none focus:ring-2 focus:ring-[#bd2d3c]/40"
          />
        </div>
      </header>

      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{ backgroundImage: 'url(/images/kadal-bg-v2.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        <div className="relative max-w-6xl mx-auto px-4 py-20 sm:py-28 text-center text-white">
          <p className="tracking-[0.3em] uppercase text-white/80 text-xs sm:text-sm mb-3">{s.heroKicker}</p>
          <h1 className="text-4xl sm:text-6xl font-bold mb-4">{s.heroTitle}</h1>
          <p className="text-white/80 max-w-xl mx-auto mb-8 text-sm sm:text-base">{s.heroSub}</p>
          <div className="flex items-center justify-center gap-3">
            <a
              href="#shop"
              className="px-8 py-3 min-h-11 rounded-full bg-[#bd2d3c] font-semibold text-sm uppercase tracking-wider inline-flex items-center gap-2 hover:bg-[#a02532]"
            >
              <ShoppingCart className="w-4 h-4" /> {s.shopNow}
            </a>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-xs">
            {[
              { icon: ShieldCheck, label: 'FSSAI Certified' },
              { icon: Truck, label: 'Same Day Delivery' },
              { icon: Star, label: '4.8 Rated' },
            ].map((b) => (
              <span key={b.label} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur">
                <b.icon className="w-3.5 h-3.5 text-emerald-300" /> {b.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Shop */}
      <main id="shop" className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {s.categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-4 py-2 min-h-11 rounded-full text-sm font-medium transition-colors ${
                category === c ? 'bg-gray-900 text-white' : 'bg-white border border-black/10 hover:bg-black/5'
              }`}
            >
              {c}
            </button>
          ))}
          <span className="ml-auto text-sm text-gray-500">{filtered.length} items</span>
        </div>

        {filtered.length === 0 ? (
          <p className="text-center text-gray-500 py-16">No matches. Try another search.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filtered.map((p) => {
              const w = weights[p.id] ?? '500g';
              return (
                <motion.article
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl overflow-hidden bg-white shadow-md border border-black/5 flex flex-col"
                >
                  <div className={`relative h-36 bg-gradient-to-br ${p.gradient} flex items-center justify-center`}>
                    <Fish className="w-14 h-14 text-[#bd2d3c]/70" />
                    {p.tag && (
                      <span className="absolute top-3 left-3 px-2 py-1 rounded-md bg-[#bd2d3c] text-white text-[11px] font-semibold">
                        {p.tag}
                      </span>
                    )}
                    <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded text-[11px] font-medium bg-white/80">
                      {s.perKg(p.basePrice)}
                    </span>
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-bold">
                      {p.name} <span className="text-gray-500 font-medium">· {p.tamil}</span>
                    </h3>
                    <p className="text-xs text-gray-500 mb-3">{lang === 'en' ? p.desc : p.descTa}</p>
                    <div className="flex gap-1.5 mb-3">
                      {WEIGHTS.map((x) => (
                        <button
                          key={x.value}
                          onClick={() => setWeights((prev) => ({ ...prev, [p.id]: x.value }))}
                          className={`flex-1 py-1.5 min-h-9 text-xs font-medium rounded-lg transition-colors ${
                            w === x.value ? 'bg-[#bd2d3c] text-white' : 'bg-gray-100 hover:bg-gray-200'
                          }`}
                        >
                          {x.value}
                        </button>
                      ))}
                    </div>
                    <div className="mt-auto flex items-center justify-between">
                      <div>
                        <span className="text-xl font-bold">₹{priceOf(p, w)}</span>
                        <span className="text-xs text-gray-400 line-through ml-1.5">₹{Math.round(priceOf(p, w) * 1.2)}</span>
                      </div>
                      <button
                        onClick={() => addToCart(p)}
                        className="px-4 py-2 min-h-11 rounded-xl bg-[#bd2d3c] text-white text-sm font-semibold hover:bg-[#a02532] flex items-center gap-1.5"
                      >
                        <Plus className="w-4 h-4" /> {s.add}
                      </button>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}

        {/* Testimonials */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-6">{s.testimonials}</h2>
          <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {[
              { n: 'Ramesh Kumar', a: 'Chennai', ta: 'மீன் மிகவும் புதியதாக இருந்தது. டெலிவரி வேகம்!', en: 'Fish was super fresh. Delivery was fast!' },
              { n: 'Priya S', a: 'Velachery', ta: 'விலை நியாயம், சுத்தம் அருமை.', en: 'Fair price, excellent cleaning.' },
            ].map((x) => (
              <div key={x.n} className="p-5 rounded-2xl bg-white border border-black/5 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-10 h-10 rounded-full bg-[#bd2d3c]/10 text-[#bd2d3c] font-bold flex items-center justify-center">
                    {x.n[0]}
                  </span>
                  <div>
                    <p className="font-semibold text-sm">{x.n}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1"><MapPin className="w-3 h-3" />{x.a}</p>
                  </div>
                  <span className="ml-auto flex text-amber-400">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{lang === 'ta' ? x.ta : x.en}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-black/10 py-8 text-center text-sm text-gray-500">
        Kadal Thunai · {s.tagline} · {s.demoNote}
      </footer>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[70] px-5 py-3 rounded-xl bg-gray-900 text-white text-sm font-medium shadow-xl flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart drawer */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
              className="fixed inset-0 z-50 bg-black/50"
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col"
              role="dialog"
              aria-label={s.yourCart}
            >
              <div className="flex items-center justify-between p-4 border-b border-black/10">
                <h2 className="font-bold text-lg flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" /> {s.yourCart}
                  <span className="text-sm font-normal text-gray-500">({cartCount})</span>
                </h2>
                <button onClick={() => setCartOpen(false)} className="p-2 min-h-11 min-w-11 rounded-lg hover:bg-black/5" aria-label="Close cart">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {cart.length === 0 ? (
                  <div className="text-center py-16 text-gray-500">
                    <Fish className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="font-medium">{s.empty}</p>
                    <p className="text-sm">{s.emptySub}</p>
                  </div>
                ) : (
                  cart.map((l) => {
                    const p = PRODUCTS.find((x) => x.id === l.productId);
                    if (!p) return null;
                    const key = `${l.productId}-${l.weight}`;
                    return (
                      <div key={key} className="flex gap-3 p-3 rounded-xl border border-black/10">
                        <span className={`w-14 h-14 rounded-lg bg-gradient-to-br ${p.gradient} flex items-center justify-center shrink-0`}>
                          <Fish className="w-6 h-6 text-[#bd2d3c]/70" />
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm">{p.name} · {p.tamil}</p>
                          <p className="text-xs text-gray-500">{l.weight} · ₹{priceOf(p, l.weight)}</p>
                          <div className="mt-2 flex items-center gap-2">
                            <button onClick={() => changeQty(key, -1)} className="w-8 h-8 min-h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200" aria-label="Decrease">
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-6 text-center font-semibold text-sm">{l.qty}</span>
                            <button onClick={() => changeQty(key, 1)} className="w-8 h-8 min-h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200" aria-label="Increase">
                              <Plus className="w-4 h-4" />
                            </button>
                            <button onClick={() => changeQty(key, -l.qty)} className="ml-auto p-2 text-gray-400 hover:text-red-600" aria-label="Remove item">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <p className="font-bold text-sm">₹{priceOf(p, l.weight) * l.qty}</p>
                      </div>
                    );
                  })
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-4 border-t border-black/10 space-y-3">
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                    <p className="text-xs font-medium text-emerald-700 mb-1.5">
                      {subtotal >= FREE_DELIVERY_AT ? s.freeDone : s.freeMore(FREE_DELIVERY_AT - subtotal)}
                    </p>
                    <div className="h-2 rounded-full bg-emerald-100 overflow-hidden">
                      <motion.div
                        className="h-full bg-emerald-500 rounded-full"
                        animate={{ width: `${Math.min(100, (subtotal / FREE_DELIVERY_AT) * 100)}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between text-gray-600"><span>{s.subtotal}</span><span>₹{subtotal}</span></div>
                    <div className="flex justify-between text-gray-600">
                      <span>{s.delivery}</span>
                      <span>{delivery === 0 ? <span className="text-emerald-600 font-semibold">{s.free}</span> : `₹${delivery}`}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-1"><span>{s.total}</span><span>₹{total}</span></div>
                  </div>
                  <button
                    onClick={() => { setCartOpen(false); setStep(0); setCheckoutOpen(true); }}
                    className="w-full py-3 min-h-11 rounded-xl bg-[#bd2d3c] text-white font-semibold hover:bg-[#a02532] flex items-center justify-center gap-2"
                  >
                    {s.checkout} · ₹{total} <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Checkout modal */}
      <AnimatePresence>
        {checkoutOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-4"
              onClick={() => step < 4 && setCheckoutOpen(false)}
            >
              <motion.div
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 60, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl p-6 max-h-[90vh] overflow-y-auto"
                role="dialog"
                aria-label={s.checkout}
              >
                {step < 4 ? (
                  <>
                    {/* Stepper */}
                    <div className="flex items-center gap-1.5 mb-6">
                      {[s.address, s.slot, s.payment, s.review].map((label, i) => (
                        <div key={label} className="flex-1">
                          <div className={`h-1.5 rounded-full mb-1.5 ${i <= step ? 'bg-[#bd2d3c]' : 'bg-gray-200'}`} />
                          <p className={`text-[10px] font-medium ${i === step ? 'text-[#bd2d3c]' : 'text-gray-400'}`}>{label}</p>
                        </div>
                      ))}
                    </div>

                    {step === 0 && (
                      <div className="space-y-4">
                        <h3 className="font-bold text-lg flex items-center gap-2"><MapPin className="w-5 h-5 text-[#bd2d3c]" />{s.address}</h3>
                        <input value={name} onChange={(e) => setName(e.target.value)} placeholder={s.name} className="w-full px-4 py-3 min-h-11 rounded-xl border border-black/10 text-sm outline-none focus:ring-2 focus:ring-[#bd2d3c]/40" />
                        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={s.phone} inputMode="tel" className="w-full px-4 py-3 min-h-11 rounded-xl border border-black/10 text-sm outline-none focus:ring-2 focus:ring-[#bd2d3c]/40" />
                        <textarea value={addr} onChange={(e) => setAddr(e.target.value)} placeholder={s.addr} rows={3} className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm outline-none focus:ring-2 focus:ring-[#bd2d3c]/40 resize-none" />
                      </div>
                    )}

                    {step === 1 && (
                      <div className="space-y-3">
                        <h3 className="font-bold text-lg flex items-center gap-2"><Clock className="w-5 h-5 text-[#bd2d3c]" />{s.slot}</h3>
                        {s.slots.map((x, i) => (
                          <button
                            key={x}
                            onClick={() => setSlot(i)}
                            className={`w-full px-4 py-3 min-h-11 rounded-xl border text-sm font-medium text-left transition-colors ${
                              slot === i ? 'border-[#bd2d3c] bg-[#bd2d3c]/5 text-[#bd2d3c]' : 'border-black/10 hover:bg-black/5'
                            }`}
                          >
                            {x}
                          </button>
                        ))}
                      </div>
                    )}

                    {step === 2 && (
                      <div className="space-y-3">
                        <h3 className="font-bold text-lg flex items-center gap-2"><CreditCard className="w-5 h-5 text-[#bd2d3c]" />{s.payment}</h3>
                        {[
                          { id: 'upi' as const, label: s.upi, icon: Smartphone },
                          { id: 'card' as const, label: s.card, icon: CreditCard },
                          { id: 'cod' as const, label: s.cod, icon: Banknote },
                        ].map((m) => (
                          <button
                            key={m.id}
                            onClick={() => setPay(m.id)}
                            className={`w-full px-4 py-3 min-h-11 rounded-xl border text-sm font-medium flex items-center gap-3 transition-colors ${
                              pay === m.id ? 'border-[#bd2d3c] bg-[#bd2d3c]/5 text-[#bd2d3c]' : 'border-black/10 hover:bg-black/5'
                            }`}
                          >
                            <m.icon className="w-5 h-5" /> {m.label}
                          </button>
                        ))}
                      </div>
                    )}

                    {step === 3 && (
                      <div className="space-y-3">
                        <h3 className="font-bold text-lg">{s.review}</h3>
                        <div className="p-4 rounded-xl bg-gray-50 text-sm space-y-1.5">
                          <p><span className="text-gray-500">{s.name}: </span><span className="font-medium">{name}</span></p>
                          <p><span className="text-gray-500">{s.phone}: </span><span className="font-medium">{phone}</span></p>
                          <p><span className="text-gray-500">{s.addr}: </span><span className="font-medium">{addr}</span></p>
                          <p><span className="text-gray-500">{s.slot}: </span><span className="font-medium">{s.slots[slot]}</span></p>
                        </div>
                        <div className="flex justify-between font-bold text-lg pt-1">
                          <span>{s.total}</span><span>₹{total}</span>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={() => (step === 0 ? setCheckoutOpen(false) : setStep(step - 1))}
                        className="px-5 py-3 min-h-11 rounded-xl border border-black/10 font-medium text-sm hover:bg-black/5 flex items-center gap-1.5"
                      >
                        <ArrowLeft className="w-4 h-4" /> {s.back}
                      </button>
                      {step < 3 ? (
                        <button
                          disabled={step === 0 && !addrValid}
                          onClick={() => setStep(step + 1)}
                          className="flex-1 py-3 min-h-11 rounded-xl bg-[#bd2d3c] text-white font-semibold text-sm hover:bg-[#a02532] disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          {s.continue}
                        </button>
                      ) : (
                        <button
                          onClick={placeOrder}
                          className="flex-1 py-3 min-h-11 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700"
                        >
                          {s.place} · ₹{total}
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 12 }}>
                      <CheckCircle2 className="w-20 h-20 mx-auto text-emerald-500 mb-4" />
                    </motion.div>
                    <h3 className="font-bold text-2xl mb-1">{s.success}</h3>
                    <p className="text-sm text-gray-500 mb-1">{s.successSub}</p>
                    <p className="font-mono text-sm bg-gray-100 inline-block px-3 py-1 rounded-lg mb-6">Order {orderId} · ₹{total}</p>
                    <div className="flex items-center max-w-sm mx-auto mb-6">
                      {[s.address, s.slot, s.payment, s.success].map((label, i) => (
                        <div key={label} className="flex-1 flex flex-col items-center">
                          <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                            i < trackStep ? 'bg-emerald-500 text-white' : i === trackStep ? 'bg-[#bd2d3c] text-white animate-pulse' : 'bg-gray-200 text-gray-400'
                          }`}>
                            {i < trackStep ? '✓' : i + 1}
                          </span>
                          {i < 3 && <span className={`h-0.5 w-full -mt-4 ${i < trackStep - 0 ? 'bg-emerald-400' : 'bg-gray-200'}`} />}
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 justify-center mb-6">
                      <Truck className="w-4 h-4 text-[#bd2d3c]" />
                      {s.slots[slot]}
                    </div>
                    <button
                      onClick={resetShop}
                      className="w-full py-3 min-h-11 rounded-xl bg-gray-900 text-white font-semibold text-sm hover:bg-black"
                    >
                      {s.cont}
                    </button>
                  </div>
                )}
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
