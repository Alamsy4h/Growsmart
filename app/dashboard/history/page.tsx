"use client";
import React, { useState } from 'react';
import { 
  Sprout, 
  Moon, 
  Sun, 
  LogOut, 
  Trash2, 
  Bug, 
  Droplets, 
  Zap,
  Clock
} from 'lucide-react';
import Link from 'next/link';

export default function HistoryLogPage() {
  const [isDark, setIsDark] = useState(false);

  // Data dummy sesuai dengan gambar System Journal yang kamu kirim
  const logs = [
    {
      id: 1,
      title: "Hama Terdeteksi",
      description: "Sensor PIR menangkap pergerakan. Sistem keamanan standby.",
      time: "14:20 PM",
      icon: <Bug size={18} />,
      iconBg: "bg-red-500/10",
      iconColor: "text-red-500",
    },
    {
      id: 2,
      title: "Penyiraman Otomatis",
      description: "Kelembapan 22%. Pompa aktif selama 30 detik.",
      time: "12:05 PM",
      icon: <Droplets size={18} />,
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-500",
    },
    {
      id: 3,
      title: "System Connected",
      description: "Berhasil terhubung ke WiFi Polibatam.",
      time: "09:00 AM",
      icon: <Zap size={18} />,
      iconBg: "bg-yellow-500/10",
      iconColor: "text-yellow-500",
    }
  ];

  return (
    <div className={`min-h-screen transition-all duration-500 p-8 font-sans ${isDark ? 'bg-[#0B0F10]' : 'bg-[#F0F4F4]'}`}>
      
      {/* NAVBAR */}
      <nav className={`max-w-7xl mx-auto rounded-full p-2 pl-6 shadow-sm border transition-all duration-500 flex items-center justify-between mb-10 ${isDark ? 'bg-[#161C1E] border-slate-800' : 'bg-white border-slate-100'}`}>
        <div className="flex items-center gap-2">
          <div className="bg-[#00B67A] p-2 rounded-xl text-white">
            <Sprout size={20} />
          </div>
          <span className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-800'}`}>GrowSmart</span>
        </div>

        <div className={`flex items-center rounded-full px-1 py-1 ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
          <Link href="/dashboard" className={`px-6 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-600'}`}>Monitoring</Link>
          <Link href="/dashboard/config" className={`px-6 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-600'}`}>Configuration</Link>
          <Link href="/dashboard/history" className={`px-6 py-2 rounded-full text-[11px] font-bold shadow-sm uppercase tracking-wider ${isDark ? 'bg-slate-700 text-white' : 'bg-white text-[#00B67A]'}`}>History Log</Link>
        </div>

        <div className="flex items-center gap-3 pr-2">
          <button onClick={() => setIsDark(!isDark)} className={`p-3 rounded-full transition-all ${isDark ? 'bg-slate-700 text-yellow-400' : 'bg-slate-100 text-slate-600'}`}>
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button className="bg-[#FF4D12] text-white px-6 py-3 rounded-full font-bold text-sm flex items-center gap-2 shadow-lg shadow-orange-200/20 hover:scale-105 transition-all">
            Logout <LogOut size={16} />
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT AREA */}
      <main className={`max-w-5xl mx-auto rounded-[3rem] p-16 shadow-2xl transition-all duration-500 min-h-[600px] border relative ${isDark ? 'bg-[#161C1E] border-slate-800' : 'bg-white border-slate-50'}`}>
        
        {/* HEADER SECTION */}
        <div className="flex justify-between items-center mb-16 px-4">
          <h1 className={`text-3xl font-black ${isDark ? 'text-white' : 'text-[#1E293B]'}`}>System Journal</h1>
          <button className={`flex items-center gap-2 px-6 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 ${isDark ? 'border-slate-700 text-slate-400 hover:bg-slate-800' : 'border-slate-200 text-slate-400 hover:bg-slate-50'}`}>
            Clear Logs
          </button>
        </div>

        {/* TIMELINE CONTAINER */}
        <div className="relative">
          {/* Vertical Line */}
          <div className={`absolute left-12 top-0 bottom-0 w-[2px] ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}></div>

          {/* LOG ITEMS */}
          <div className="space-y-12">
            {logs.map((log) => (
              <div key={log.id} className="relative flex items-center gap-10 group">
                {/* Icon Circle */}
                <div className={`z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${isDark ? 'bg-[#1C2426] ring-4 ring-[#161C1E]' : 'bg-white ring-8 ring-white'} ${log.iconBg} ${log.iconColor}`}>
                  {log.icon}
                </div>

                {/* Content Card */}
                <div className={`flex-1 p-8 rounded-[2rem] border transition-all duration-300 flex items-center justify-between hover:translate-x-2 ${isDark ? 'bg-[#1C2426] border-slate-800 hover:bg-[#232d30]' : 'bg-white border-slate-50 shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-lg hover:shadow-slate-100'}`}>
                  <div>
                    <h3 className={`font-black text-sm mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>{log.title}</h3>
                    <p className={`text-xs font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{log.description}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black uppercase tracking-tighter ${isDark ? 'text-emerald-500' : 'text-emerald-500'}`}>
                      {log.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* EMPTY STATE DECORATION */}
        <div className="mt-20 flex flex-col items-center opacity-20">
          <Clock size={40} className={isDark ? 'text-slate-600' : 'text-slate-300'} />
          <p className={`text-[10px] font-black uppercase tracking-[0.3em] mt-4 ${isDark ? 'text-slate-600' : 'text-slate-300'}`}>End of Logs</p>
        </div>

      </main>

      <footer className="max-w-7xl mx-auto mt-8 text-center">
        <p className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-slate-700' : 'text-slate-300'}`}>GrowSmart Project • Politeknik Negeri Batam</p>
      </footer>
    </div>
  );
}