"use client";
import React from 'react';
import Link from 'next/link';
import { Sprout, Droplets, ShieldCheck, Smartphone, ArrowRight, CheckCircle2, BarChart3, Zap, Globe } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-emerald-100">
      
      {/* NAVIGATION */}
      <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-500 p-2 rounded-xl shadow-lg shadow-emerald-100">
            <Sprout className="text-white" size={20} />
          </div>
          <span className="font-bold text-xl tracking-tight">GrowSmart</span>
        </div>
        <Link href="/auth/login">
          <button className="bg-slate-900 text-white px-8 py-3 rounded-2xl text-xs font-black hover:bg-emerald-600 transition-all shadow-xl shadow-slate-200 uppercase tracking-widest">
            Login
          </button>
        </Link>
      </nav>

      {/* HERO SECTION */}
      <section className="px-8 pt-24 pb-32 max-w-7xl mx-auto text-center relative overflow-hidden">
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-5 py-2.5 rounded-full text-xs font-black mb-10 border border-emerald-100 uppercase tracking-widest">
          <Zap size={14} className="fill-emerald-500" />
          Next-Gen IoT Solution
        </div>
        <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-[1.1] mb-8 tracking-tighter">
          Rawat Tanaman <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600">Secara Presisi.</span>
        </h1>
        <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-medium">
          Monitoring kelembapan tanah dan keamanan lahan secara real-time dengan integrasi ESP32 dan dashboard cerdas.
        </p>
        <Link href="/auth/login">
          <button className="bg-emerald-500 text-white px-10 py-5 rounded-[2rem] font-black text-sm flex items-center justify-center gap-3 hover:bg-emerald-600 transition-all hover:scale-105 shadow-2xl shadow-emerald-200/50 uppercase tracking-widest mx-auto">
            Mulai Monitoring <ArrowRight size={20} />
          </button>
        </Link>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-emerald-100/30 blur-[120px] rounded-full -z-10"></div>
      </section>

      {/* FEATURES */}
      <section className="bg-slate-50 py-32 px-8 rounded-[4rem] mx-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard icon={<Droplets size={32} className="text-blue-500" />} title="Auto Irrigation" desc="Penyiraman otomatis berdasarkan data kelembapan tanah." />
          <FeatureCard icon={<ShieldCheck size={32} className="text-emerald-500" />} title="Pest Shield" desc="Deteksi gangguan keamanan lahan secara real-time." />
          <FeatureCard icon={<BarChart3 size={32} className="text-orange-500" />} title="Live Analytics" desc="Analisis pertumbuhan tanaman melalui grafik data." />
        </div>
      </section>

      {/* HARDWARE & CLOUD SECTION */}
      <section className="py-32 px-8 max-w-7xl mx-auto">
        <div className="bg-[#0D1117] rounded-[3rem] p-16 flex flex-col md:flex-row items-center gap-16">

          {/* LEFT: TEXT */}
          <div className="md:w-1/2">
            <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center mb-8">
              <Globe size={20} className="text-emerald-400" />
            </div>
            <h2 className="text-4xl font-black text-white leading-tight mb-10 tracking-tight">
              Integrasi Hardware <br /> & Cloud Yang Mulus
            </h2>
            <div className="space-y-6">
              <HardwareFeature title="ESP32 Microcontroller" desc="Pemrosesan data cepat dengan konektivitas WiFi stabil." />
              <HardwareFeature title="Low-Latency Sync" desc="Sinkronisasi data sensor setiap 5 detik ke Next.js Dashboard." />
              <HardwareFeature title="Scalable Architecture" desc="Siap digunakan untuk banyak titik node lahan sekaligus." />
            </div>
          </div>

          {/* RIGHT: BROWSER MOCKUP */}
          <div className="md:w-1/2">
            <div className="bg-[#161B22] rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl">
              {/* Browser Bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-700/50">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              {/* Mockup Content */}
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <Droplets size={16} className="text-emerald-400" />
                  </div>
                  <div className="flex-1 h-3 bg-slate-700 rounded-full">
                    <div className="h-3 bg-emerald-500/60 rounded-full w-3/4"></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-slate-700/50 rounded-xl p-4">
                    <div className="h-2 bg-emerald-500/40 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-slate-600 rounded w-3/4"></div>
                  </div>
                  <div className="bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/20">
                    <div className="h-2 bg-emerald-400/60 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-emerald-500/40 rounded w-2/3"></div>
                  </div>
                </div>
                <div className="bg-slate-700/30 rounded-xl p-4 space-y-2">
                  <div className="h-2 bg-slate-600 rounded w-full"></div>
                  <div className="h-2 bg-slate-600 rounded w-4/5"></div>
                  <div className="h-2 bg-emerald-500/40 rounded w-3/5"></div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-100 px-8 py-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-emerald-500 p-2 rounded-xl">
                <Sprout className="text-white" size={18} />
              </div>
              <span className="font-bold text-lg">GrowSmart</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed font-medium max-w-xs">
              Solusi pertanian cerdas yang dikembangkan untuk membantu petani lokal mengoptimalkan lahan melalui teknologi IoT.
            </p>
          </div>

          {/* Sistem Links */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-5">Sistem</h4>
            <div className="space-y-3">
              <Link href="/dashboard" className="block text-sm font-semibold text-slate-600 hover:text-emerald-500 transition-colors">Dashboard</Link>
              <Link href="/api" className="block text-sm font-semibold text-slate-600 hover:text-emerald-500 transition-colors">API Docs</Link>
              <Link href="/dashboard/config" className="block text-sm font-semibold text-slate-600 hover:text-emerald-500 transition-colors">Config</Link>
            </div>
          </div>

          {/* PBL Team */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-5">PBL Team</h4>
            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-600">Rafif Ihsaan Syawaly – Alameyah</p>
              <p className="text-sm font-semibold text-slate-600">Polibatam</p>
              <p className="text-sm font-semibold text-slate-600">IF-Morning</p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-slate-100 gap-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300">
            © 2026 GrowSmart System. All Rights Reserved
          </p>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:border-emerald-500 transition-colors cursor-pointer">
              <Smartphone size={14} className="text-slate-400" />
            </div>
            <div className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:border-emerald-500 transition-colors cursor-pointer">
              <Globe size={14} className="text-slate-400" />
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}

function FeatureCard({ icon, title, desc }: any) {
  return (
    <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 group">
      <div className="mb-8 bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:bg-emerald-50 transition-all">{icon}</div>
      <h3 className="text-xl font-black mb-4 text-slate-800">{title}</h3>
      <p className="text-slate-500 leading-relaxed text-sm font-medium">{desc}</p>
    </div>
  );
}

function HardwareFeature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="mt-1 w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
        <CheckCircle2 size={14} className="text-emerald-400" />
      </div>
      <div>
        <h4 className="text-white font-black text-sm mb-1">{title}</h4>
        <p className="text-slate-400 text-xs leading-relaxed font-medium">{desc}</p>
      </div>
    </div>
  );
}