"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Sprout, 
  Thermometer, 
  Droplets, 
  Wind, 
  ShieldCheck, 
  Moon, 
  Sun, 
  LogOut,
  TrendingUp,
  Eye // Ditambahkan untuk representasi visual sensor PIR
} from 'lucide-react';
import Link from 'next/link';

export default function MonitoringPage() {
  const [isDark, setIsDark] = useState(false);
  const [userName, setUserName] = useState("...");
  
  const [sensorData, setSensorData] = useState({
    temperature: "--",
    soilMoisture: "--",
    airHumidity: "--",
    pumpStatus: "OFF",
    motionStatus: "Aman", // State baru untuk PIR
    avgTemperature: "--"
  });

  const router = useRouter();

  useEffect(() => {
    fetch("/api/me")
      .then(res => res.json())
      .then(data => {
        if (data.success) setUserName(data.user.name);
      })
      .catch(err => console.error("Gagal mengambil data user:", err));

    const fetchSensorData = () => {
      fetch("/api/sensor") 
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data) {
            
            const rawTemp = parseFloat(data.data.temperature);
            const rawHumidity = parseFloat(data.data.air_humidity);
            const rawAvgTemp = parseFloat(data.data.avg_temperature);
            
            const isSoilExist = data.data.soil_moisture !== null && data.data.soil_moisture !== undefined;
            const rawSoil = isSoilExist ? parseFloat(data.data.soil_moisture) : NaN;

            // Evaluasi data sensor PIR
            const hasMotion = data.data.motion_detected === true;

            setSensorData({
              temperature: !isNaN(rawTemp) ? `${rawTemp.toFixed(1)}°C` : "--",
              airHumidity: !isNaN(rawHumidity) ? `${rawHumidity.toFixed(1)}%` : "--",
              soilMoisture: !isNaN(rawSoil) ? `${rawSoil.toFixed(0)}%` : "Belum Terpasang", 
              pumpStatus: data.data.pump_status || "OFF", 
              motionStatus: hasMotion ? "ADA GERAKAN!" : "Aman", // Mengatur teks info pergerakan
              avgTemperature: !isNaN(rawAvgTemp) ? `${rawAvgTemp.toFixed(1)}` : "--"
            });
          }
        })
        .catch(err => console.error("Gagal mengambil data sensor:", err));
    };

    fetchSensorData();

    const interval = setInterval(fetchSensorData, 5000);
    return () => clearInterval(interval);

  }, []);

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/auth/login");
    router.refresh();
  };

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
          <Link href="/dashboard" className={`px-6 py-2 rounded-full text-[11px] font-bold shadow-sm uppercase tracking-wider ${isDark ? 'bg-slate-700 text-white' : 'bg-white text-[#00B67A]'}`}>Monitoring</Link>
          <Link href="/dashboard/config" className={`px-6 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-600'}`}>Configuration</Link>
          <Link href="/dashboard/history" className={`px-6 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-600'}`}>History Log</Link>
        </div>

        <div className="flex items-center gap-3 pr-2">
          <button onClick={() => setIsDark(!isDark)} className={`p-3 rounded-full transition-all ${isDark ? 'bg-slate-700 text-yellow-400' : 'bg-slate-100 text-slate-600'}`}>
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button onClick={handleLogout} className="bg-[#FF4D12] text-white px-6 py-3 rounded-full font-bold text-sm flex items-center gap-2 shadow-lg shadow-orange-200/20 hover:scale-105 transition-all">
            Log out <LogOut size={16} />
          </button>
        </div>
      </nav>

      {/* MAIN MONITORING CONTENT */}
      <main className={`max-w-7xl mx-auto rounded-[3rem] p-12 shadow-2xl transition-all duration-500 min-h-[700px] border ${isDark ? 'bg-[#161C1E] border-slate-800' : 'bg-white border-slate-50'}`}>
        
        <div className="mb-10">
          <h2 className={`text-xl ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Hello, <span className={`${isDark ? 'text-white' : 'text-slate-900'} font-bold`}>{userName}</span> 👋</h2>
          <h1 className={`text-3xl font-black mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>Real-time Monitoring Greenhouse</h1>
        </div>

        {/* MONITORING STAT CARDS (Sekarang Menampung PIR Sensor di kolom ke-4) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <StatCard isDark={isDark} label="AIR TEMPERATURE" value={sensorData.temperature} icon={<Thermometer />} shadowColor="rgba(239, 68, 68, 0.15)" iconBg="bg-red-500/10" iconColor="text-red-500" />
          
          <StatCard 
            isDark={isDark} 
            label="SOIL MOISTURE" 
            value={sensorData.soilMoisture} 
            icon={<Droplets />} 
            shadowColor="rgba(249, 115, 22, 0.15)" 
            iconBg="bg-orange-500/10" 
            iconColor="text-orange-500"
            customClass={sensorData.soilMoisture === "Belum Terpasang" ? "text-base font-bold text-slate-400" : ""}
          />
          
          <StatCard isDark={isDark} label="AIR HUMIDITY" value={sensorData.airHumidity} icon={<Wind />} shadowColor="rgba(59, 130, 246, 0.15)" iconBg="bg-blue-500/10" iconColor="text-blue-500" />
          
          {/* SEKSI BARU: StatCard PIR Motion Detection */}
          <StatCard 
            isDark={isDark} 
            label="MOTION DETECTOR" 
            value={sensorData.motionStatus} 
            icon={<Eye />} 
            shadowColor="rgba(147, 51, 234, 0.15)" 
            iconBg={sensorData.motionStatus === "ADA GERAKAN!" ? "bg-red-500/20" : "bg-purple-500/10"} 
            iconColor={sensorData.motionStatus === "ADA GERAKAN!" ? "text-red-500 animate-ping" : "text-purple-500"} 
            customClass={sensorData.motionStatus === "ADA GERAKAN!" ? "text-xl font-black text-red-500 animate-pulse" : "text-2xl font-black text-emerald-500"}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          
          {/* GRAPH ANALYSIS */}
          <div className={`lg:col-span-2 p-10 rounded-[2.5rem] border transition-all ${isDark ? 'bg-[#1C2426] border-slate-800' : 'bg-[#F9FBFB] border-slate-100 shadow-sm'}`}>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-800'}`}>Moisture Level Analysis</h3>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">Data per 2 hours</p>
              </div>
              <div className={`p-2 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-white shadow-sm'}`}>
                <TrendingUp className="text-[#00B67A]" size={20} />
              </div>
            </div>
            
            <div className="h-52 w-full relative pt-4">
              <svg viewBox="0 0 800 200" className="w-full h-full overflow-visible">
                <path 
                  d="M0,150 Q100,160 200,120 T400,100 T600,140 T800,80" 
                  fill="none" 
                  stroke="#00B67A" 
                  strokeWidth="4" 
                  strokeLinecap="round"
                  className="drop-shadow-[0_10px_10px_rgba(0,182,122,0.2)]"
                />
                {[200, 400, 600].map((x, i) => (
                   <circle key={i} cx={x} cy={i === 1 ? 100 : (i === 0 ? 120 : 140)} r="5" fill="#00B67A" stroke={isDark ? "#1C2426" : "white"} strokeWidth="2" />
                ))}
              </svg>
              <div className={`flex justify-between mt-6 text-[11px] font-black tracking-widest ${isDark ? 'text-slate-600' : 'text-slate-300'}`}>
                <span>08:00</span>
                <span>12:00</span>
                <span>16:00</span>
                <span>20:00</span>
                <span>00:00</span>
              </div>
            </div>
          </div>

          {/* SYSTEM SUMMARY */}
          <div className={`rounded-[2.5rem] p-10 border transition-all ${isDark ? 'bg-[#1C2426] border-slate-800' : 'bg-[#F8FBFB] border-slate-50'}`}>
            <h3 className={`font-bold text-xl mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>Sistem Summary</h3>
            <p className="text-slate-500 text-xs leading-relaxed mb-10">
              Status Pompa saat ini: <span className="font-bold">{sensorData.pumpStatus}</span>. 
              {sensorData.motionStatus === "ADA GERAKAN!" && " [PERINGATAN]: Terdeteksi aktivitas pergerakan di dalam area kebun tanaman!"}
            </p>
            
            <div className="space-y-5 mb-12">
              <div className="flex justify-between items-center">
                <span className={`text-[10px] font-black uppercase tracking-wider ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>Rata-rata Suhu</span>
                <span className="font-black text-[#00B67A] text-sm">{sensorData.avgTemperature}°C</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`text-[10px] font-black uppercase tracking-wider ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>Total Air Terpakai</span>
                <span className="font-black text-[#00B67A] text-sm">12.5 Liter</span>
              </div>
            </div>

            <button className="w-full py-5 bg-[#00B67A] text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-emerald-900/10 hover:bg-[#009e6a] transition-all active:scale-95">
              Unduh Laporan
            </button>
          </div>

        </div>
      </main>

      <footer className="max-w-7xl mx-auto mt-8 text-center">
        <p className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-slate-700' : 'text-slate-300'}`}>GrowSmart Project • Politeknik Negeri Batam</p>
      </footer>
    </div>
  );
}

function StatCard({ label, value, icon, shadowColor, iconBg, iconColor, isDark, customClass }: any) {
  return (
    <div 
      className={`rounded-[2.5rem] p-8 flex flex-col items-center justify-center border transition-all ${isDark ? 'bg-[#1C2426] border-slate-800' : 'bg-white border-slate-50'}`}
      style={{ boxShadow: isDark ? 'none' : `0 20px 40px ${shadowColor}` }}
    >
      <div className={`w-14 h-14 ${iconBg} ${iconColor} rounded-2xl flex items-center justify-center mb-5`}>
        {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { size: 24 }) : icon}
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{label}</p>
      <p className={`text-3xl font-black text-center ${isDark ? 'text-white' : 'text-slate-800'} ${customClass}`}>
        {value}
      </p>
    </div>
  );
}