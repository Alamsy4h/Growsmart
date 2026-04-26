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
          <span className="font-bold text-xl tracking-tight">GrowSmart <span className="text-emerald-500"></span></span>
        </div>
        <Link href="/login">
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
        <Link href="/dashboard">
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