'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import {
  BatteryCharging,
  Bus,
  CheckCircle2,
  ChevronRight,
  Clock,
  Droplets,
  Languages,
  MapPin,
  Mic,
  Navigation,
  Radio,
  Thermometer,
  Users,
  Wifi,
  WifiOff,
  Zap,
} from 'lucide-react';

// ============================================================================
// DATA
// ============================================================================

interface Stop {
  name: string;
  x: number;
  y: number;
}

interface Route {
  id: string;
  no: string;
  from: string;
  to: string;
  color: string;
  frequency: string;
  stops: Stop[];
}

const ROUTES: Route[] = [
  {
    id: 'r47a',
    no: '47A',
    from: 'Tambaram',
    to: 'Guindy',
    color: '#E83E59',
    frequency: 'Every 12 min',
    stops: [
      { name: 'Tambaram', x: 60, y: 320 },
      { name: 'Chromepet', x: 180, y: 280 },
      { name: 'Pallavaram', x: 300, y: 300 },
      { name: 'Alandur', x: 430, y: 240 },
      { name: 'Guindy', x: 560, y: 200 },
      { name: 'Kathipara', x: 680, y: 160 },
    ],
  },
  {
    id: 'r23b',
    no: '23B',
    from: 'Velachery',
    to: 'Koyambedu',
    color: '#8b5cf6',
    frequency: 'Every 15 min',
    stops: [
      { name: 'Velachery', x: 80, y: 140 },
      { name: 'Guindy', x: 200, y: 180 },
      { name: 'Vadapalani', x: 330, y: 150 },
      { name: 'Ambattur OT', x: 470, y: 190 },
      { name: 'Koyambedu', x: 600, y: 140 },
      { name: 'CMBT', x: 700, y: 180 },
    ],
  },
  {
    id: 'r15c',
    no: '15C',
    from: 'Parrys',
    to: 'Sholinganallur',
    color: '#22c55e',
    frequency: 'Every 20 min',
    stops: [
      { name: 'Parrys Corner', x: 70, y: 220 },
      { name: 'Marina Beach', x: 190, y: 260 },
      { name: 'Adyar', x: 320, y: 230 },
      { name: 'Thiruvanmiyur', x: 450, y: 270 },
      { name: 'Sholinganallur', x: 580, y: 240 },
      { name: 'ECR Toll', x: 690, y: 280 },
    ],
  },
];

const LANGS = [
  { id: 'en', label: 'English' },
  { id: 'ta', label: 'தமிழ்' },
  { id: 'hi', label: 'हिन्दी' },
  { id: 'te', label: 'తెలుగు' },
] as const;

type LangId = (typeof LANGS)[number]['id'];

// ============================================================================
// HELPERS (deterministic — SSR safe)
// ============================================================================

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function pointOnRoute(stops: Stop[], t: number): { x: number; y: number } {
  const segs = stops.length - 1;
  const clamped = Math.min(0.999, Math.max(0, t));
  const idx = Math.floor(clamped * segs);
  const frac = clamped * segs - idx;
  const a = stops[idx];
  const b = stops[idx + 1];
  return { x: a.x + (b.x - a.x) * frac, y: a.y + (b.y - a.y) * frac };
}

function routePath(stops: Stop[]): string {
  return stops.map((s, i) => `${i === 0 ? 'M' : 'L'} ${s.x} ${s.y}`).join(' ');
}

function parseCommand(raw: string, lang: LangId): string {
  const q = raw.toLowerCase();
  const busNo = (q.match(/\d{2,3}[a-z]?/) ?? ['47A'])[0].toUpperCase();
  if (/(where|enga|eppo|eppudu|kahan|where.*bus|track)/.test(q) || /bas|bus/.test(q)) {
    const answers: Record<LangId, string> = {
      en: `Bus ${busNo} is 2 stops away — arriving in ~6 min. Track it live on the map.`,
      ta: `பேருந்து ${busNo} 2 நிறுத்தங்கள் தொலைவில் உள்ளது — ~6 நிமிடங்களில் வரும்.`,
      hi: `बस ${busNo} 2 स्टॉप दूर है — लगभग 6 मिनट में आएगी।`,
      te: `బస్సు ${busNo} 2 స్టాప్‌ల దూరంలో ఉంది — ~6 నిమిషాల్లో వస్తుంది.`,
    };
    return answers[lang];
  }
  if (/(fare|ticket|price|kattanam|kiraya)/.test(q)) {
    return lang === 'en'
      ? `City fare is ₹13–₹25. Tap a route above for frequency and stops.`
      : `நகரக் கட்டணம் ₹13–₹25. விவரங்களுக்கு மேலே ஒரு வழியைத் தேர்வு செய்க.`;
  }
  const fallback: Record<LangId, string> = {
    en: `Try "where is bus 47A" or "bus eppo varum". I understand English, Tamil, Hindi & Telugu.`,
    ta: `"bus 47A enga" என்று கேளுங்கள். தமிழ், English, हिन्दी, తెలుగు புரியும்.`,
    hi: `"bus 47A kahan hai" पूछें — 4 भाषाएँ समझता हूँ।`,
    te: `"bus 47A ekkada" అడగండి — 4 భాషలు అర్థం చేసుకుంటాను.`,
  };
  return fallback[lang];
}

// ============================================================================
// MAIN DEMO
// ============================================================================

export function BusTrackerDemo() {
  const [routeId, setRouteId] = useState(ROUTES[0].id);
  const [progress, setProgress] = useState(0.25);
  const [paused, setPaused] = useState(false);
  const [offline, setOffline] = useState(false);
  const [lang, setLang] = useState<LangId>('en');
  const [voiceIn, setVoiceIn] = useState('');
  const [voiceOut, setVoiceOut] = useState<string | null>(null);
  const [listening, setListening] = useState(false);
  const [tick, setTick] = useState(0);
  const [selectedStop, setSelectedStop] = useState(2);

  const route = useMemo(() => ROUTES.find((r) => r.id === routeId) ?? ROUTES[0], [routeId]);
  const bus = useMemo(() => pointOnRoute(route.stops, progress), [route, progress]);

  // Live simulation loop (client-only deltas — initial render is static for SSR)
  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      setProgress((p) => (p + 0.008 > 0.999 ? 0 : p + 0.008));
      setTick((n) => n + 1);
    }, 900);
    return () => window.clearInterval(id);
  }, [paused]);

  // Deterministic live-ish sensor values derived from tick (no Math.random in render)
  const sensors = useMemo(() => {
    const h = hashStr(route.id + tick);
    return {
      speed: 22 + (h % 18),
      occupancy: 35 + (h % 55),
      temp: 29 + ((h >> 3) % 5),
      humidity: 55 + ((h >> 5) % 20),
      battery: 80 + ((h >> 7) % 18),
    };
  }, [route.id, tick]);

  const approachingIdx = useMemo(() => {
    const segs = route.stops.length - 1;
    return Math.min(route.stops.length - 1, Math.floor(progress * segs) + 1);
  }, [route, progress]);

  const etaFor = (stopIdx: number) => {
    const segs = route.stops.length - 1;
    const stopT = stopIdx / segs;
    const diff = stopT - progress;
    if (diff <= 0) return 'Departed';
    return `~${Math.max(1, Math.round(diff * 38))} min`;
  };

  const askVoice = () => {
    if (voiceIn.trim() === '') return;
    setListening(true);
    window.setTimeout(() => {
      setVoiceOut(parseCommand(voiceIn, lang));
      setListening(false);
    }, 700);
  };

  const listenRef = useRef<number | null>(null);
  useEffect(() => () => {
    if (listenRef.current) window.clearTimeout(listenRef.current);
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0d16] text-white">
      {/* Demo banner */}
      <div className="bg-[#E83E59] text-white text-center text-xs sm:text-sm py-2 px-4">
        Concept demo — simulated live data, no real buses.{' '}
        <Link href="/showcase/busbuddy" className="underline underline-offset-2 font-medium">
          Back to portfolio
        </Link>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0b0d16]/90 backdrop-blur border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <span className="w-9 h-9 rounded-xl bg-[#E83E59] flex items-center justify-center">
            <Bus className="w-5 h-5" />
          </span>
          <div>
            <p className="font-bold leading-tight">BusBuddy</p>
            <p className="text-[11px] text-white/50 flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${offline ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'}`} />
              {offline ? 'Offline mode — cached data' : 'Live · WebSocket connected'}
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setOffline(!offline)}
              className="px-3 py-2 min-h-11 rounded-xl border border-white/15 text-xs font-medium flex items-center gap-1.5 hover:bg-white/5"
              aria-pressed={offline}
            >
              {offline ? <WifiOff className="w-4 h-4" /> : <Wifi className="w-4 h-4" />}
              {offline ? 'Offline' : 'Online'}
            </button>
            <button
              onClick={() => setPaused(!paused)}
              className="px-4 py-2 min-h-11 rounded-xl bg-[#E83E59] text-xs font-semibold hover:brightness-110"
            >
              {paused ? 'Resume' : 'Pause'} live
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Route selector */}
        <section>
          <div className="grid sm:grid-cols-3 gap-3">
            {ROUTES.map((r) => (
              <button
                key={r.id}
                onClick={() => { setRouteId(r.id); setProgress(0.2); setSelectedStop(2); }}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  r.id === routeId
                    ? 'border-transparent bg-white/10 shadow-lg'
                    : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.07]'
                }`}
                style={r.id === routeId ? { boxShadow: `0 0 0 1.5px ${r.color}, 0 10px 40px -12px ${r.color}66` } : undefined}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-1 rounded-lg text-sm font-bold text-white" style={{ background: r.color }}>
                    {r.no}
                  </span>
                  <span className="text-xs text-white/50 flex items-center gap-1"><Clock className="w-3 h-3" />{r.frequency}</span>
                </div>
                <p className="text-sm font-medium">{r.from} → {r.to}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Live map */}
        <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold flex items-center gap-2">
              <Navigation className="w-5 h-5" style={{ color: route.color }} />
              Live tracking · Route {route.no}
            </h2>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
              <Radio className="w-3 h-3 animate-pulse" /> {sensors.speed} km/h
            </span>
          </div>
          <div className="rounded-2xl bg-[#070912] border border-white/10 overflow-hidden">
            <svg viewBox="0 0 760 400" className="w-full h-auto block" role="img" aria-label={`Live map of route ${route.no}`}>
              <defs>
                <pattern id="bb-grid" width="38" height="38" patternUnits="userSpaceOnUse">
                  <path d="M 38 0 L 0 0 0 38" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="760" height="400" fill="url(#bb-grid)" />
              <path d={routePath(route.stops)} fill="none" stroke={route.color} strokeWidth="4" strokeLinecap="round" opacity="0.35" />
              <path d={routePath(route.stops)} fill="none" stroke="white" strokeWidth="1.5" strokeDasharray="2 10" strokeLinecap="round" opacity="0.5" />
              {route.stops.map((s, i) => (
                <g key={s.name} onClick={() => setSelectedStop(i)} className="cursor-pointer">
                  <circle cx={s.x} cy={s.y} r={i === approachingIdx ? 11 : 7} fill={i === approachingIdx ? route.color : '#1a2030'} stroke="white" strokeWidth="2" />
                  <text x={s.x} y={s.y - 16} textAnchor="middle" fill={i === selectedStop ? '#fff' : 'rgba(255,255,255,0.55)'} fontSize="12" fontWeight={i === selectedStop ? 700 : 400}>
                    {s.name}
                  </text>
                </g>
              ))}
              {/* Bus marker */}
              <g transform={`translate(${bus.x}, ${bus.y})`}>
                <circle r="20" fill={route.color} opacity="0.25">
                  <animate attributeName="r" values="14;22;14" dur="2s" repeatCount="indefinite" />
                </circle>
                <rect x="-15" y="-11" width="30" height="22" rx="6" fill={route.color} stroke="white" strokeWidth="2" />
                <text textAnchor="middle" dy="4" fill="white" fontSize="10" fontWeight="800">{route.no}</text>
              </g>
            </svg>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
            <MapPin className="w-4 h-4" style={{ color: route.color }} />
            <span className="text-white/70">
              Next stop: <strong className="text-white">{route.stops[approachingIdx]?.name}</strong>
              {' · '}ETA <strong className="text-white">{etaFor(approachingIdx)}</strong>
            </span>
            <span className="ml-auto text-xs text-white/40">Tap any stop for its ETA</span>
          </div>
          {/* Stop ETAs */}
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {route.stops.map((s, i) => (
              <button
                key={s.name}
                onClick={() => setSelectedStop(i)}
                className={`p-2.5 rounded-xl border text-left transition-colors ${
                  i === selectedStop ? 'border-white/40 bg-white/10' : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.06]'
                }`}
              >
                <p className="text-xs font-medium truncate">{s.name}</p>
                <p className="text-sm font-bold" style={{ color: etaFor(i) === 'Departed' ? 'rgba(255,255,255,0.35)' : route.color }}>
                  {etaFor(i)}
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* IoT + Voice */}
        <section className="grid lg:grid-cols-2 gap-4">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            <h3 className="font-bold mb-4 flex items-center gap-2"><Zap className="w-5 h-5 text-amber-300" /> IoT · On-board sensors</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10">
                <p className="text-white/50 text-xs flex items-center gap-1.5 mb-1"><Users className="w-3.5 h-3.5" /> Occupancy</p>
                <p className="text-xl font-bold">{sensors.occupancy}%</p>
                <div className="h-1.5 rounded-full bg-white/10 mt-2 overflow-hidden">
                  <div className="h-full rounded-full bg-[#E83E59] transition-all" style={{ width: `${sensors.occupancy}%` }} />
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10">
                <p className="text-white/50 text-xs flex items-center gap-1.5 mb-1"><Thermometer className="w-3.5 h-3.5" /> Cabin</p>
                <p className="text-xl font-bold">{sensors.temp}°C</p>
                <p className="text-xs text-white/50 flex items-center gap-1 mt-1"><Droplets className="w-3 h-3" /> {sensors.humidity}% humidity</p>
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10">
                <p className="text-white/50 text-xs flex items-center gap-1.5 mb-1"><BatteryCharging className="w-3.5 h-3.5" /> Tracker battery</p>
                <p className="text-xl font-bold">{sensors.battery}%</p>
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10">
                <p className="text-white/50 text-xs flex items-center gap-1.5 mb-1"><Navigation className="w-3.5 h-3.5" /> GPS speed</p>
                <p className="text-xl font-bold">{sensors.speed} <span className="text-xs font-normal text-white/50">km/h</span></p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            <h3 className="font-bold mb-1 flex items-center gap-2"><Mic className="w-5 h-5 text-[#E83E59]" /> Voice commands</h3>
            <p className="text-xs text-white/50 mb-4 flex items-center gap-1.5"><Languages className="w-3.5 h-3.5" /> English · தமிழ் · हिन्दी · తెలుగు — incl. Tanglish</p>
            <div className="flex gap-1.5 mb-3">
              {LANGS.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setLang(l.id)}
                  className={`flex-1 py-2 min-h-11 rounded-xl text-xs font-semibold transition-colors ${
                    lang === l.id ? 'bg-[#E83E59] text-white' : 'bg-white/5 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={voiceIn}
                onChange={(e) => setVoiceIn(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && askVoice()}
                placeholder='Try "bus 47A eppo varum"'
                className="flex-1 px-4 py-3 min-h-11 rounded-xl bg-white/5 border border-white/10 text-sm outline-none focus:border-[#E83E59]/60"
              />
              <button
                onClick={askVoice}
                disabled={listening}
                className="px-5 min-h-11 rounded-xl bg-[#E83E59] font-semibold text-sm hover:brightness-110 disabled:opacity-60"
              >
                {listening ? '…' : 'Ask'}
              </button>
            </div>
            <AnimatePresence>
              {voiceOut && (
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-sm text-emerald-200 flex gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" /> {voiceOut}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-3xl p-6 text-center border border-white/10 bg-gradient-to-br from-[#E83E59]/15 to-transparent">
          <p className="text-white/70 text-sm mb-4">Smart India Hackathon concept — realtime tracking, voice & IoT in one PWA.</p>
          <Link
            href="/showcase/busbuddy"
            className="inline-flex items-center gap-2 px-6 py-3 min-h-11 rounded-xl bg-white text-gray-900 font-semibold text-sm hover:bg-white/90"
          >
            View case study <ChevronRight className="w-4 h-4" />
          </Link>
        </section>
      </main>

      <footer className="border-t border-white/10 py-6 text-center text-xs text-white/40">
        BusBuddy · Concept demo with simulated data · Built by Lokesh
      </footer>
    </div>
  );
}
