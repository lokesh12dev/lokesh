'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeftRight,
  Armchair,
  ArrowRight,
  BadgeCheck,
  Banknote,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  Clock,
  CreditCard,
  MapPin,
  Printer,
  ShieldCheck,
  Smartphone,
  Snowflake,
  Star,
  Ticket,
  Users,
  Wifi,
} from 'lucide-react';

// ============================================================================
// DATA
// ============================================================================

const CITIES = ['Chennai', 'Coimbatore', 'Madurai', 'Trichy', 'Salem', 'Bengaluru', 'Puducherry'];

const OPERATORS = [
  { name: 'Saira Premium', type: 'A/C Sleeper', ac: true },
  { name: 'City Express', type: 'A/C Seater', ac: true },
  { name: 'Royal Cruiser', type: 'A/C Sleeper', ac: true },
  { name: 'Morning Star', type: 'Non-A/C Seater', ac: false },
];

function hashStr(s: string): number {
  let h = 7;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

interface BusOption {
  id: string;
  operator: string;
  type: string;
  ac: boolean;
  depart: string;
  arrive: string;
  duration: string;
  price: number;
  rating: number;
  seatsLeft: number;
}

function buildBuses(from: string, to: string, dateIdx: number): BusOption[] {
  const h = hashStr(`${from}|${to}|${dateIdx}`);
  return OPERATORS.map((op, i) => {
    const r = hashStr(`${h}|${i}`);
    const depH = 6 + ((r >> 2) % 15);
    const depM = (r >> 6) % 2 === 0 ? '00' : '30';
    const durH = 5 + ((r >> 8) % 4);
    const arrH = (depH + durH) % 24;
    const fmt = (x: number) => String(x).padStart(2, '0');
    return {
      id: `${from.slice(0, 2)}${to.slice(0, 2)}${i}${dateIdx}`.toUpperCase(),
      operator: op.name,
      type: op.type,
      ac: op.ac,
      depart: `${fmt(depH)}:${depM}`,
      arrive: `${fmt(arrH)}:${depM}`,
      duration: `${durH}h ${depM === '00' ? '00' : '30'}m`,
      price: 450 + ((r >> 10) % 9) * 75,
      rating: 3.8 + ((r >> 14) % 12) / 10,
      seatsLeft: 4 + ((r >> 18) % 22),
    };
  });
}

type SeatStatus = 'available' | 'booked' | 'ladies';

function seatStatus(busId: string, n: number): SeatStatus {
  const h = hashStr(`${busId}#${n}`);
  if (h % 100 < 24) return 'booked';
  if (h % 100 < 34) return 'ladies';
  return 'available';
}

const SEAT_NOS = Array.from({ length: 40 }, (_, i) => i + 1);

// ============================================================================
// MAIN DEMO
// ============================================================================

type Step = 'search' | 'results' | 'seats' | 'details' | 'pay' | 'ticket';

export function SairaBookingDemo() {
  const [from, setFrom] = useState('Chennai');
  const [to, setTo] = useState('Coimbatore');
  const [dateIdx, setDateIdx] = useState(1);
  const [step, setStep] = useState<Step>('search');
  const [busId, setBusId] = useState('');
  const [selected, setSelected] = useState<number[]>([]);
  const [forms, setForms] = useState<Record<number, { name: string; age: string; gender: string }>>({});
  const [pay, setPay] = useState<'upi' | 'card'>('upi');
  const [acOnly, setAcOnly] = useState(false);
  const [sort, setSort] = useState<'price' | 'depart'>('depart');

  // Real "today" is set after mount: prerendered HTML must not freeze the
  // build date, and server/client timezones can disagree. The static fallback
  // renders identically on both sides, then swaps to the live date.
  const [today, setToday] = useState<Date | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync live date post-mount; static fallback keeps SSR safe
    setToday(new Date());
  }, []);

  const dates = useMemo(() => {
    const base = today ?? new Date(2026, 9, 12);
    const out: { label: string; sub: string }[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      out.push({
        label: i === 0 ? 'Today' : i === 1 ? 'Tmrw' : d.toLocaleDateString('en-IN', { weekday: 'short' }),
        sub: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      });
    }
    return out;
  }, [today]);

  const buses = useMemo(() => {
    let list = buildBuses(from, to, dateIdx);
    if (acOnly) list = list.filter((b) => b.ac);
    return [...list].sort((a, b) => (sort === 'price' ? a.price - b.price : a.depart.localeCompare(b.depart)));
  }, [from, to, dateIdx, acOnly, sort]);

  const bus = useMemo(() => buses.find((b) => b.id === busId) ?? null, [buses, busId]);

  const toggleSeat = (n: number) => {
    if (!bus || seatStatus(bus.id, n) === 'booked') return;
    setSelected((prev) => (prev.includes(n) ? prev.filter((s) => s !== n) : prev.length >= 6 ? prev : [...prev, n]));
  };

  const fare = bus ? selected.reduce((s) => s + bus.price, 0) : 0;
  const gst = Math.round(fare * 0.05);
  const total = fare + gst;

  const pnr = useMemo(() => {
    if (!bus || selected.length === 0) return '';
    const h = hashStr(`${bus.id}|${selected.join(',')}`);
    return h.toString(36).toUpperCase().replace(/[^A-Z0-9]/g, 'X').padEnd(6, 'X').slice(0, 6);
  }, [bus, selected]);

  const qrCells = useMemo(() => {
    const h = hashStr(`qr|${pnr}`);
    return Array.from({ length: 441 }, (_, i) => (hashStr(`${h}|${i}`) + i * 7) % 3 !== 0);
  }, [pnr]);

  const detailsValid =
    selected.length > 0 &&
    selected.every((s) => forms[s]?.name.trim() !== '' && forms[s]?.age.trim() !== '');

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  const startSearch = () => {
    if (from === to) return;
    setStep('results');
    setBusId('');
    setSelected([]);
  };

  return (
    <div className="min-h-screen bg-[#faf7f4] text-gray-900">
      {/* Demo banner */}
      <div className="bg-[#e11d48] text-white text-center text-xs sm:text-sm py-2 px-4">
        Concept demo — no real booking or payment.{' '}
        <Link href="/showcase/saira-tickets" className="underline underline-offset-2 font-medium">
          Back to portfolio
        </Link>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#faf7f4]/90 backdrop-blur border-b border-black/10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-2">
          <span className="w-9 h-9 rounded-xl bg-[#e11d48] text-white flex items-center justify-center">
            <Ticket className="w-5 h-5" />
          </span>
          <p className="font-bold text-lg">Saira Tickets</p>
          {step !== 'search' && (
            <button
              onClick={() => setStep(step === 'results' ? 'search' : step === 'seats' ? 'results' : step === 'details' ? 'seats' : step === 'pay' ? 'details' : 'search')}
              className="ml-auto text-xs font-medium px-3 py-2 min-h-11 rounded-xl border border-black/10 bg-white hover:bg-black/5 flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          )}
        </div>
        {/* Progress */}
        {step !== 'search' && step !== 'ticket' && (
          <div className="max-w-5xl mx-auto px-4 pb-3 flex gap-1.5">
            {['results', 'seats', 'details', 'pay'].map((s) => {
              const order = ['results', 'seats', 'details', 'pay'];
              const active = order.indexOf(step) >= order.indexOf(s);
              return <div key={s} className={`h-1 flex-1 rounded-full ${active ? 'bg-[#e11d48]' : 'bg-black/10'}`} />;
            })}
          </div>
        )}
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {/* ============ SEARCH ============ */}
          {step === 'search' && (
            <motion.section
              key="search"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="rounded-3xl overflow-hidden border border-black/10 bg-white shadow-xl"
            >
              <div
                className="px-6 py-12 sm:py-16 text-white text-center"
                style={{ backgroundImage: 'url(/images/saira-bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
              >
                <div className="bg-black/45 -m-6 px-6 py-12 sm:-m-6 sm:py-16 rounded-none">
                  <h1 className="text-3xl sm:text-5xl font-bold mb-2">Book bus tickets in minutes</h1>
                  <p className="text-white/80 text-sm sm:text-base">Live seats · Verified operators · Secure demo checkout</p>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <div className="grid sm:grid-cols-[1fr_auto_1fr] gap-2 items-center">
                  <label className="block p-3 rounded-2xl border border-black/10">
                    <span className="text-[11px] uppercase tracking-wider text-gray-500 flex items-center gap-1"><MapPin className="w-3 h-3" /> From</span>
                    <select value={from} onChange={(e) => setFrom(e.target.value)} className="w-full bg-transparent font-semibold outline-none py-1">
                      {CITIES.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </label>
                  <button onClick={swap} className="mx-auto w-11 h-11 min-h-11 rounded-full bg-gray-900 text-white flex items-center justify-center hover:bg-black" aria-label="Swap cities">
                    <ArrowLeftRight className="w-5 h-5" />
                  </button>
                  <label className="block p-3 rounded-2xl border border-black/10">
                    <span className="text-[11px] uppercase tracking-wider text-gray-500 flex items-center gap-1"><MapPin className="w-3 h-3" /> To</span>
                    <select value={to} onChange={(e) => setTo(e.target.value)} className="w-full bg-transparent font-semibold outline-none py-1">
                      {CITIES.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                  {dates.map((d, i) => (
                    <button
                      key={`${d.label}-${d.sub}`}
                      onClick={() => setDateIdx(i)}
                      className={`flex-1 min-w-[76px] py-2.5 min-h-11 rounded-xl border text-center transition-colors ${
                        dateIdx === i ? 'border-[#e11d48] bg-[#e11d48]/5 text-[#e11d48]' : 'border-black/10 hover:bg-black/5'
                      }`}
                    >
                      <span className="text-xs font-bold flex items-center justify-center gap-1">
                        <CalendarDays className="w-3.5 h-3.5" />{d.label}
                      </span>
                      <span className="text-[11px] text-gray-500">{d.sub}</span>
                    </button>
                  ))}
                </div>
                {from === to && <p className="text-xs text-red-600 mt-2">Pick two different cities.</p>}
                <button
                  onClick={startSearch}
                  disabled={from === to}
                  className="mt-4 w-full py-3.5 min-h-11 rounded-2xl bg-[#e11d48] text-white font-bold hover:bg-[#be123c] disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  Search buses <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.section>
          )}

          {/* ============ RESULTS ============ */}
          {step === 'results' && (
            <motion.section key="results" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <h2 className="font-bold text-xl">{from} → {to}</h2>
                <span className="text-xs text-gray-500">{dates[dateIdx]?.sub} · {buses.length} buses</span>
                <div className="ml-auto flex items-center gap-2">
                  <button
                    onClick={() => setAcOnly(!acOnly)}
                    aria-pressed={acOnly}
                    className={`px-3 py-2 min-h-11 rounded-xl text-xs font-semibold border flex items-center gap-1.5 ${acOnly ? 'border-[#e11d48] text-[#e11d48] bg-[#e11d48]/5' : 'border-black/10 bg-white'}`}
                  >
                    <Snowflake className="w-3.5 h-3.5" /> A/C only
                  </button>
                  <select value={sort} onChange={(e) => setSort(e.target.value as 'price' | 'depart')} className="px-3 py-2 min-h-11 rounded-xl text-xs font-semibold border border-black/10 bg-white outline-none" aria-label="Sort buses">
                    <option value="depart">Departure</option>
                    <option value="price">Price</option>
                  </select>
                </div>
              </div>
              <div className="space-y-3">
                {buses.map((b) => (
                  <article key={b.id} className="p-4 sm:p-5 rounded-2xl bg-white border border-black/10 shadow-sm">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                      <div>
                        <p className="font-bold">{b.operator}</p>
                        <p className="text-xs text-gray-500">{b.type}</p>
                      </div>
                      <div className="flex items-center gap-3 ml-auto text-center">
                        <div><p className="font-bold text-lg">{b.depart}</p><p className="text-[11px] text-gray-500">{from}</p></div>
                        <div className="text-center">
                          <p className="text-[11px] text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" />{b.duration}</p>
                          <div className="w-16 h-px bg-black/20 my-1" />
                        </div>
                        <div><p className="font-bold text-lg">{b.arrive}</p><p className="text-[11px] text-gray-500">{to}</p></div>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="text-xs px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-emerald-500" /> {b.rating.toFixed(1)}
                      </span>
                      {['Wifi', 'Charging', 'Blanket'].map((a) => (
                        <span key={a} className="text-[11px] px-2 py-1 rounded-md bg-black/5 text-gray-600 flex items-center gap-1">
                          {a === 'Wifi' ? <Wifi className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />} {a}
                        </span>
                      ))}
                      <span className="text-xs text-gray-500 ml-auto">{b.seatsLeft} seats left</span>
                      <span className="font-bold text-xl">₹{b.price}</span>
                      <button
                        onClick={() => { setBusId(b.id); setSelected([]); setStep('seats'); }}
                        className="px-6 py-2.5 min-h-11 rounded-xl bg-[#e11d48] text-white text-sm font-bold hover:bg-[#be123c]"
                      >
                        Select
                      </button>
                    </div>
                  </article>
                ))}
                {buses.length === 0 && <p className="text-center text-gray-500 py-12">No A/C buses on this route — clear the filter.</p>}
              </div>
            </motion.section>
          )}

          {/* ============ SEATS ============ */}
          {step === 'seats' && bus && (
            <motion.section key="seats" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="grid lg:grid-cols-[1fr_320px] gap-4">
              <div className="p-5 rounded-3xl bg-white border border-black/10 shadow-sm">
                <h2 className="font-bold text-lg mb-1">Choose seats <span className="text-xs font-normal text-gray-500">(max 6)</span></h2>
                <div className="flex flex-wrap gap-3 text-[11px] text-gray-600 mb-5">
                  <span className="flex items-center gap-1.5"><span className="w-4 h-4 rounded-md bg-white border border-black/20 inline-block" /> Available</span>
                  <span className="flex items-center gap-1.5"><span className="w-4 h-4 rounded-md bg-[#e11d48] inline-block" /> Selected</span>
                  <span className="flex items-center gap-1.5"><span className="w-4 h-4 rounded-md bg-pink-200 border border-pink-300 inline-block" /> Ladies</span>
                  <span className="flex items-center gap-1.5"><span className="w-4 h-4 rounded-md bg-gray-200 inline-block" /> Booked</span>
                </div>
                <div className="max-w-sm mx-auto rounded-2xl border border-black/10 p-4 bg-[#faf7f4]">
                  <div className="flex justify-end mb-3 text-gray-400"><Armchair className="w-5 h-5" /></div>
                  <div className="grid grid-cols-[1fr_1fr_24px_1fr_1fr] gap-2">
                    {SEAT_NOS.map((n) => {
                      if ((n - 1) % 4 === 2) return <span key={`a-${n}`} />;
                      const st = seatStatus(bus.id, n);
                      const sel = selected.includes(n);
                      return (
                        <button
                          key={n}
                          disabled={st === 'booked'}
                          onClick={() => toggleSeat(n)}
                          aria-label={`Seat ${n}${st === 'booked' ? ' (booked)' : ''}`}
                          className={`h-11 min-h-11 rounded-lg border text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                            sel
                              ? 'bg-[#e11d48] border-[#e11d48] text-white shadow-md'
                              : st === 'booked'
                                ? 'bg-gray-200 border-gray-200 text-gray-400 cursor-not-allowed'
                                : st === 'ladies'
                                  ? 'bg-pink-100 border-pink-300 text-pink-700 hover:bg-pink-200'
                                  : 'bg-white border-black/15 hover:border-[#e11d48] hover:text-[#e11d48]'
                          }`}
                        >
                          <Armchair className="w-3.5 h-3.5" />{n}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              <aside className="p-5 rounded-3xl bg-gray-900 text-white h-fit lg:sticky lg:top-20">
                <p className="text-xs text-white/50">{bus.operator} · {bus.type}</p>
                <p className="font-bold mb-3">{from} → {to}</p>
                <p className="text-sm mb-1">Seats: <strong>{selected.length === 0 ? '—' : selected.sort((a, b) => a - b).join(', ')}</strong></p>
                <div className="flex justify-between text-sm text-white/70"><span>Fare</span><span>₹{fare}</span></div>
                <div className="flex justify-between text-sm text-white/70"><span>GST (5%)</span><span>₹{gst}</span></div>
                <div className="flex justify-between font-bold text-lg border-t border-white/15 mt-2 pt-2"><span>Total</span><span>₹{total}</span></div>
                <button
                  disabled={selected.length === 0}
                  onClick={() => setStep('details')}
                  className="mt-4 w-full py-3 min-h-11 rounded-xl bg-[#e11d48] font-bold text-sm hover:bg-[#be123c] disabled:opacity-40"
                >
                  Continue
                </button>
              </aside>
            </motion.section>
          )}

          {/* ============ DETAILS + PAY ============ */}
          {(step === 'details' || step === 'pay') && bus && (
            <motion.section key="details-pay" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="max-w-2xl mx-auto rounded-3xl bg-white border border-black/10 shadow-sm p-5 sm:p-7">
              {step === 'details' ? (
                <>
                  <h2 className="font-bold text-lg mb-1 flex items-center gap-2"><Users className="w-5 h-5 text-[#e11d48]" /> Passenger details</h2>
                  <p className="text-xs text-gray-500 mb-4">One per selected seat.</p>
                  <div className="space-y-4">
                    {selected.sort((a, b) => a - b).map((s) => (
                      <div key={s} className="p-4 rounded-2xl border border-black/10">
                        <p className="text-xs font-bold text-[#e11d48] mb-2">SEAT {s}</p>
                        <div className="grid sm:grid-cols-3 gap-2">
                          <input
                            value={forms[s]?.name ?? ''}
                            onChange={(e) => setForms((p) => ({ ...p, [s]: { name: e.target.value, age: p[s]?.age ?? '', gender: p[s]?.gender ?? 'Male' } }))}
                            placeholder="Full name"
                            className="px-3 py-2.5 min-h-11 rounded-xl border border-black/10 text-sm outline-none focus:ring-2 focus:ring-[#e11d48]/40"
                          />
                          <input
                            value={forms[s]?.age ?? ''}
                            onChange={(e) => setForms((p) => ({ ...p, [s]: { name: p[s]?.name ?? '', age: e.target.value.replace(/\D/g, '').slice(0, 3), gender: p[s]?.gender ?? 'Male' } }))}
                            placeholder="Age"
                            inputMode="numeric"
                            className="px-3 py-2.5 min-h-11 rounded-xl border border-black/10 text-sm outline-none focus:ring-2 focus:ring-[#e11d48]/40"
                          />
                          <select
                            value={forms[s]?.gender ?? 'Male'}
                            onChange={(e) => setForms((p) => ({ ...p, [s]: { name: p[s]?.name ?? '', age: p[s]?.age ?? '', gender: e.target.value } }))}
                            className="px-3 py-2.5 min-h-11 rounded-xl border border-black/10 text-sm outline-none bg-white"
                            aria-label={`Gender for seat ${s}`}
                          >
                            <option>Male</option>
                            <option>Female</option>
                            <option>Other</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    disabled={!detailsValid}
                    onClick={() => setStep('pay')}
                    className="mt-5 w-full py-3 min-h-11 rounded-xl bg-[#e11d48] text-white font-bold text-sm hover:bg-[#be123c] disabled:opacity-40"
                  >
                    Proceed to pay · ₹{total}
                  </button>
                </>
              ) : (
                <>
                  <h2 className="font-bold text-lg mb-4">Payment <span className="text-xs font-normal text-gray-500">(demo — nothing is charged)</span></h2>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {[
                      { id: 'upi' as const, label: 'UPI', icon: Smartphone },
                      { id: 'card' as const, label: 'Card', icon: CreditCard },
                    ].map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setPay(m.id)}
                        className={`py-3 min-h-11 rounded-xl border font-semibold text-sm flex items-center justify-center gap-2 ${pay === m.id ? 'border-[#e11d48] bg-[#e11d48]/5 text-[#e11d48]' : 'border-black/10 hover:bg-black/5'}`}
                      >
                        <m.icon className="w-4 h-4" /> {m.label}
                      </button>
                    ))}
                  </div>
                  {pay === 'upi' ? (
                    <input placeholder="yourname@upi" className="w-full px-4 py-3 min-h-11 rounded-xl border border-black/10 text-sm outline-none focus:ring-2 focus:ring-[#e11d48]/40" aria-label="UPI ID" />
                  ) : (
                    <div className="space-y-2">
                      <input placeholder="Card number" inputMode="numeric" className="w-full px-4 py-3 min-h-11 rounded-xl border border-black/10 text-sm outline-none focus:ring-2 focus:ring-[#e11d48]/40" aria-label="Card number" />
                      <div className="grid grid-cols-2 gap-2">
                        <input placeholder="MM / YY" className="px-4 py-3 min-h-11 rounded-xl border border-black/10 text-sm outline-none" aria-label="Expiry" />
                        <input placeholder="CVV" inputMode="numeric" className="px-4 py-3 min-h-11 rounded-xl border border-black/10 text-sm outline-none" aria-label="CVV" />
                      </div>
                    </div>
                  )}
                  <button
                    onClick={() => setStep('ticket')}
                    className="mt-4 w-full py-3.5 min-h-11 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 flex items-center justify-center gap-2"
                  >
                    <Banknote className="w-4 h-4" /> Pay ₹{total}
                  </button>
                </>
              )}
            </motion.section>
          )}

          {/* ============ TICKET ============ */}
          {step === 'ticket' && bus && (
            <motion.section key="ticket" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto">
              <div className="text-center mb-4">
                <CheckCircle2 className="w-14 h-14 mx-auto text-emerald-500 mb-2" />
                <h2 className="font-bold text-2xl">Booking confirmed!</h2>
                <p className="text-sm text-gray-500">Show this ticket when boarding.</p>
              </div>
              <div className="rounded-3xl overflow-hidden border border-black/10 bg-white shadow-xl">
                <div className="bg-gray-900 text-white p-5 flex items-center gap-3">
                  <Ticket className="w-8 h-8 text-[#e11d48]" />
                  <div>
                    <p className="font-bold">{bus.operator} · {bus.type}</p>
                    <p className="text-xs text-white/60">{from} → {to} · {dates[dateIdx]?.sub} · {bus.depart} – {bus.arrive}</p>
                  </div>
                  <span className="ml-auto font-mono font-bold bg-white/10 px-3 py-1.5 rounded-lg">PNR {pnr}</span>
                </div>
                <div className="p-5 grid sm:grid-cols-[1fr_auto] gap-5">
                  <div>
                    {selected.sort((a, b) => a - b).map((s) => (
                      <div key={s} className="flex items-center gap-2 py-2 border-b border-black/5 text-sm">
                        <BadgeCheck className="w-4 h-4 text-emerald-600" />
                        <strong>Seat {s}</strong>
                        <span className="text-gray-600">{forms[s]?.name}, {forms[s]?.age}</span>
                      </div>
                    ))}
                    <div className="pt-3 text-sm space-y-1">
                      <div className="flex justify-between text-gray-600"><span>Fare ({selected.length} × ₹{bus.price})</span><span>₹{fare}</span></div>
                      <div className="flex justify-between text-gray-600"><span>GST</span><span>₹{gst}</span></div>
                      <div className="flex justify-between font-bold text-lg"><span>Paid</span><span>₹{total}</span></div>
                    </div>
                  </div>
                  <div className="mx-auto">
                    <div className="grid grid-cols-[repeat(21,6px)] gap-px p-2 bg-white border border-black/10 rounded-lg" aria-label={`Ticket code ${pnr}`}>
                      {qrCells.map((on, i) => (
                        <span key={i} className={`w-1.5 h-1.5 ${on ? 'bg-gray-900' : 'bg-white'}`} />
                      ))}
                    </div>
                    <p className="text-center text-[11px] text-gray-500 mt-1 font-mono">{pnr}</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={() => window.print()} className="flex-1 py-3 min-h-11 rounded-xl border border-black/10 bg-white font-semibold text-sm hover:bg-black/5 flex items-center justify-center gap-2">
                  <Printer className="w-4 h-4" /> Print
                </button>
                <button
                  onClick={() => { setStep('search'); setSelected([]); setBusId(''); setForms({}); }}
                  className="flex-1 py-3 min-h-11 rounded-xl bg-gray-900 text-white font-semibold text-sm hover:bg-black"
                >
                  Book another
                </button>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      <footer className="border-t border-black/10 py-6 text-center text-xs text-gray-500">
        Saira Tickets · Concept demo by Lokesh
      </footer>
    </div>
  );
}
