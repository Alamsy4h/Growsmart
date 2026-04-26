"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Droplets, ShieldCheck, Thermometer, Clock, 
  Sprout, LogOut, Menu, X, TrendingUp,
  Save, Power, Zap, AlertTriangle, Sliders
} from 'lucide-react';

export default function GrowSmartDashboard() {
  const [activeTab, setActiveTab] = useState('monitoring');
  const [threshold, setThreshold] = useState(30);
  const router = useRouter();

  const handleLogout = () => router.push('/');

  return (
    <div className="min-h-screen bg-[#F0F7F7] p-4 md:p-6 font-sans text-slate-700">
      
      {/* --- FLOATING HEADER --- */}
      <header className="max-w-7xl mx-auto sticky top-4 z-50">
        <nav className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-3 pl-6 pr-3 flex items-center justify-between shadow-[0_10px_40px_-15px_rgba(0,0,0,0.08)] border border-white">
          <div className="flex items-center gap-3">
            <div className="bg-[#00B67A] p-2.5 rounded-2xl shadow-lg shadow-emerald-100">
              <Sprout className="text-white" size={22} />
            </div>
            <span className="font-black text-xl tracking-tight text-slate-800">
              Grow<span className="text-[#00B67A]">Smart</span>
            </span>
          </div>

          <div className="hidden md:flex items-center bg-slate-50/50 rounded-full px-2 py-1 border border-slate-100">
            <NavLink label="Monitoring" active={activeTab === 'monitoring'} onClick={() => setActiveTab('monitoring')} />
            <NavLink label="Configuration" active={activeTab === 'config'} onClick={() => setActiveTab('config')} />
            <NavLink label="History Log" active={activeTab === 'history'} onClick={() => setActiveTab('history')} />
          </div>

          <button 
            onClick={handleLogout} 
            className="bg-[#FF4D12] text-white px-6 py-3 rounded-[1.5rem] font-bold text-sm hover:scale-105 transition-all shadow-xl shadow-orange-200 flex items-center gap-2"
          >
            <span className="hidden sm:inline text-[10px] uppercase tracking-widest font-black">Logout</span>
            <LogOut size={16} />
          </button>
        </nav>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-7xl mx-auto mt-8 bg-white rounded-[3.5rem] p-8 md:p-12 shadow-[0_30px_100px_-20px_rgba(0,0,0,0.04)] border border-white/60 min-h-[75vh]">
        {activeTab === 'monitoring' && <MonitoringTab />}
        {activeTab === 'config' && <ConfigTab threshold={threshold} setThreshold={setThreshold} />}
        {activeTab === 'history' && <HistoryTabTimeline />}
      </main>
    </div>
  );
}

/* --- TAB COMPONENTS --- */

function MonitoringTab() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10">
        <h2 className="text-2xl font-medium text-slate-400">Hello, <span className="text-slate-900 font-black">Alamsyah</span> 👋</h2>
        <h1 className="text-3xl font-black text-slate-900 mt-1">Real-time Greenhouse Stats</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <GlassCard label="Suhu" value="32°C" icon={<Thermometer size={24} />} color="red" />
        <GlassCard label="Lembap" value="65%" icon={<Droplets size={24} />} color="blue" />
        <GlassCard label="Sync" value="10:41 PM" icon={<Clock size={24} />} color="orange" />
        <GlassCard label="Status" value="Safe" icon={<ShieldCheck size={24} />} color="emerald" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-[#F9FBFB] rounded-[3rem] p-8 border border-slate-100 flex flex-col h-[400px] relative overflow-hidden">
          <div className="flex justify-between items-center mb-10 relative z-10">
            <div>
              <h3 className="font-black text-slate-800 text-lg">Moisture Dynamics</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Real-time Wave Analysis</p>
            </div>
            <TrendingUp size={20} className="text-emerald-500" />
          </div>
          <div className="flex-1 relative">
            <svg className="w-full h-full drop-shadow-2xl" viewBox="0 0 100 40" preserveAspectRatio="none">
              <defs>
                <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0,40 L0,30 Q15,20 30,30 T60,15 T100,25 L100,40 Z" fill="url(#waveGradient)" />
              <path d="M0,30 Q15,20 30,30 T60,15 T100,25" fill="none" stroke="#10B981" strokeWidth="1" strokeLinecap="round" className="animate-pulse" />
            </svg>
          </div>
        </div>

        <div className="bg-slate-900 rounded-[3rem] p-8 text-white flex flex-col justify-between shadow-xl">
          <h3 className="text-xl font-bold">Quick Summary</h3>
          <p className="text-slate-400 text-xs mt-2 font-medium leading-relaxed">Sistem bekerja optimal di lingkungan Greenhouse.</p>
          <div className="space-y-4 my-8">
            <SummaryRow label="Rata-rata Suhu" value="28.4°C" />
            <SummaryRow label="Efisiensi Air" value="94%" />
            <SummaryRow label="Pompa Status" value="Ready" />
          </div>
          <button className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10 transition-all">Download Report</button>
        </div>
      </div>
    </div>
  );
}

function ConfigTab({ threshold, setThreshold }: any) {
  return (
    <div className="animate-in fade-in slide-in-from-left-4 duration-500 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <div className="bg-emerald-50 w-16 h-16 rounded-[2rem] flex items-center justify-center mx-auto mb-4 border border-emerald-100 shadow-sm">
          <Sliders className="text-[#00B67A]" size={28} />
        </div>
        <h1 className="text-3xl font-black text-slate-900">Device Configuration</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[3rem] border-2 border-slate-50 shadow-sm">
          <h3 className="font-black text-slate-800 mb-8 flex items-center gap-3">
            <Droplets className="text-blue-500" size={20} /> Soil Threshold
          </h3>
          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Aktivasi Pompa</span>
              <span className="text-3xl font-black text-emerald-500">{threshold}%</span>
            </div>
            <input type="range" min="0" max="100" value={threshold} onChange={(e) => setThreshold(e.target.value)} className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
          </div>
        </div>
        <div className="space-y-6">
           <ConfigSwitch icon={<Power size={20}/>} label="Manual Watering" sub="Nyalakan pompa manual" />
           <button className="w-full py-5 bg-[#00B67A] text-white rounded-[2rem] font-black text-xs shadow-xl shadow-emerald-100 flex items-center justify-center gap-3 uppercase tracking-[0.2em] mt-4 hover:scale-[1.02] transition-all"><Save size={18} /> Update ESP32</button>
        </div>
      </div>
    </div>
  );
}

function HistoryTabTimeline() {
  const events = [
    { id: 1, title: 'Peringatan Hama', desc: 'Terdeteksi gerakan asing di blok B-12.', time: '14:20 PM', icon: <AlertTriangle size={18} className="text-red-500" />, bg: 'bg-red-50' },
    { id: 2, title: 'Auto-Watering', desc: 'Pompa menyala 30 detik. Target: 60%.', time: '12:05 PM', icon: <Droplets size={18} className="text-blue-500" />, bg: 'bg-blue-50' },
  ];
  return (
    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-right-4 duration-500">
      <h3 className="text-2xl font-black text-slate-800 mb-12">System Journal</h3>
      <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:bg-slate-50">
        {events.map((event) => (
          <div key={event.id} className="relative flex items-center gap-8 group">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border border-white shadow-lg z-10 shrink-0 ${event.bg}`}>{event.icon}</div>
            <div className="flex-1 bg-white p-6 rounded-[2rem] border border-slate-50 hover:shadow-md transition-all">
              <div className="flex justify-between mb-1">
                <span className="font-black text-slate-800 text-sm tracking-tight">{event.title}</span>
                <span className="text-[9px] font-black text-emerald-500 uppercase">{event.time}</span>
              </div>
              <p className="text-slate-500 text-xs font-medium">{event.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* --- REUSABLE HELPERS --- */

function NavLink({ label, active, onClick }: any) {
  return (
    <button onClick={onClick} className={`px-6 py-2.5 rounded-full text-[10px] font-black tracking-widest transition-all ${active ? 'bg-white text-[#00B67A] shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}>
      {label.toUpperCase()}
    </button>
  );
}

function GlassCard({ label, value, icon, color }: any) {
  const themes: any = {
    red: "hover:shadow-[0_20px_50px_-10px_rgba(239,68,68,0.2)] border-red-50 text-red-500",
    blue: "hover:shadow-[0_20px_50px_-10px_rgba(59,130,246,0.2)] border-blue-50 text-blue-500",
    orange: "hover:shadow-[0_20px_50px_-10px_rgba(245,158,11,0.2)] border-orange-50 text-orange-500",
    emerald: "hover:shadow-[0_20px_50px_-10px_rgba(16,185,129,0.2)] border-emerald-50 text-emerald-500",
  };
  return (
    <div className={`bg-white border-2 rounded-[2.5rem] p-7 transition-all duration-500 hover:-translate-y-2 cursor-pointer ${themes[color]}`}>
      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-white shadow-sm border border-inherit">{icon}</div>
      <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-2xl font-black text-slate-800 tracking-tight">{value}</p>
    </div>
  );
}

function ConfigSwitch({ icon, label, sub }: any) {
  return (
    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-50 flex items-center justify-between group hover:border-emerald-100 transition-all">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-slate-50 rounded-2xl text-slate-400 group-hover:text-emerald-500 transition-colors">{icon}</div>
        <div>
          <p className="text-xs font-black text-slate-800 uppercase tracking-tight">{label}</p>
          <p className="text-[10px] text-slate-400 font-medium">{sub}</p>
        </div>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" className="sr-only peer" />
        <div className="w-10 h-5 bg-slate-100 rounded-full peer peer-checked:bg-emerald-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"></div>
      </label>
    </div>
  );
}

function SummaryRow({ label, value }: any) {
  return (
    <div className="flex justify-between items-center border-b border-white/5 pb-3">
      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
      <span className="text-sm font-black text-emerald-400 tracking-tight">{value}</span>
    </div>
  );
}