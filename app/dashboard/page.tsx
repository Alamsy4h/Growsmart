"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Sprout, 
  Thermometer, 
  Droplets, 
  Wind, 
  Moon, 
  Sun, 
  LogOut,
  TrendingUp,
  Eye,
  Download
} from 'lucide-react';
import Link from 'next/link';

export default function MonitoringPage() {
  const [isDark, setIsDark] = useState(false);
  const [userName, setUserName] = useState("...");
  const [isDownloading, setIsDownloading] = useState(false);
  
  const [sensorData, setSensorData] = useState({
    temperature: "--",
    soilMoisture: "--",
    airHumidity: "--",
    pumpStatus: "OFF",
    motionStatus: "Aman",
    avgTemperature: "--"
  });

  // State array data grafik (default 12 poin bernilai 0 untuk mencegah NaN)
  const [graphData, setGraphData] = useState<number[]>([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const timeLabels = ["00:00", "02:00", "04:00", "06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"];

  const router = useRouter();

  useEffect(() => {
    // 1. Ambil Profil User
    fetch("/api/me")
      .then(res => res.json())
      .then(data => {
        if (data.success && data.user) setUserName(data.user.name);
      })
      .catch(err => console.error("Gagal mengambil data user:", err));

    // 2. Fetch Data Real-Time Sensor
    const fetchSensorData = () => {
      fetch("/api/sensor") 
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data) {
            const rawTemp = parseFloat(data.data.temperature);
            const rawHumidity = parseFloat(data.data.air_humidity || data.data.humidity);
            const rawAvgTemp = parseFloat(data.data.avg_temperature);
            
            const isSoilExist = data.data.soil_moisture !== null && data.data.soil_moisture !== undefined;
            const rawSoil = isSoilExist ? parseFloat(data.data.soil_moisture) : NaN;

            const hasMotion = data.data.motion_detected === true || data.data.motionStatus === true;

            setSensorData({
              temperature: !isNaN(rawTemp) ? `${rawTemp.toFixed(1)}°C` : "0.0°C",
              airHumidity: !isNaN(rawHumidity) ? `${rawHumidity.toFixed(1)}%` : "--",
              soilMoisture: !isNaN(rawSoil) ? `${rawSoil.toFixed(0)}%` : "0%", 
              pumpStatus: data.data.pump_status || (data.data.pumpActive ? "ON" : "OFF"), 
              motionStatus: hasMotion ? "ADA GERAKAN!" : "Aman",
              avgTemperature: !isNaN(rawAvgTemp) ? `${rawAvgTemp.toFixed(1)}` : "0.0"
            });
          }
        })
        .catch(err => console.error("Gagal mengambil data sensor:", err));
    };

    // 3. Fetch Data Grafik dari Endpoint /api/sensor/chart
    const fetchGraphData = () => {
      fetch("/api/sensor/chart")
        .then(res => res.json())
        .then(resData => {
          if (resData.success && Array.isArray(resData.data) && resData.data.length > 0) {
            const values = resData.data.map((item: any) => {
              const val = typeof item === 'number' ? item : item.soilMoisture;
              return isNaN(val) ? 0 : val;
            });
            setGraphData(values);
          }
        })
        .catch(err => console.error("Gagal mengambil data grafik:", err));
    };

    fetchSensorData();
    fetchGraphData();

    const intervalSensor = setInterval(fetchSensorData, 5000);
    const intervalGraph = setInterval(fetchGraphData, 30000); // Update grafik tiap 30 detik

    return () => {
      clearInterval(intervalSensor);
      clearInterval(intervalGraph);
    };
  }, []);

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/auth/login");
    router.refresh();
  };

  // Unduh Laporan dalam Format CSV
  const handleDownloadReport = async () => {
    setIsDownloading(true);
    try {
      const res = await fetch("/api/logs");
      const result = await res.json();

      const logs = result.data || result;

      let csvContent = "data:text/csv;charset=utf-8,ID,Waktu,Suhu (C),Kelembapan Udara (%),Kelembapan Tanah (%),Deteksi Gerakan\n";

      if (Array.isArray(logs) && logs.length > 0) {
        logs.forEach((log: any) => {
          const row = [
            log.id,
            `"${new Date(log.createdAt || log.created_at).toLocaleString("id-ID")}"`,
            log.temperature ?? 0,
            log.humidity ?? log.air_humidity ?? 0,
            log.soilMoisture ?? log.soil_moisture ?? 0,
            log.motionDetected || log.motion_detected ? "ADA GERAKAN" : "Aman"
          ].join(",");
          csvContent += row + "\n";
        });
      } else {
        csvContent += `1,"${new Date().toLocaleString("id-ID")}",${sensorData.temperature},${sensorData.airHumidity},${sensorData.soilMoisture},${sensorData.motionStatus}\n`;
      }

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `Laporan_GrowSmart_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error("Gagal mengunduh laporan:", error);
      alert("Gagal mengunduh laporan.");
    } finally {
      setIsDownloading(false);
    }
  };

  // HELPER MENGHITUNG DRAFT KURVA SVG TANPA ERROR NaN
  const getSvgPath = (data: number[]) => {
    const width = 800;
    const height = 180;
    
    // Cegah error jika array kurang dari 2 elemen
    const safeData = data.length < 2 ? [data[0] || 0, data[0] || 0] : data;
    const step = width / (safeData.length - 1);

    const points = safeData.map((val, idx) => {
      const clampedVal = Math.min(Math.max(isNaN(val) ? 0 : val, 0), 100);
      const x = idx * step;
      const y = height - (clampedVal / 100) * 140;

      return { 
        x: isNaN(x) ? 0 : x, 
        y: isNaN(y) ? height : y 
      };
    });

    let path = `M ${points[0].x},${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const xMid = (points[i].x + points[i + 1].x) / 2;
      const yMid = (points[i].y + points[i + 1].y) / 2;
      const cpX1 = (xMid + points[i].x) / 2;
      const cpX2 = (xMid + points[i + 1].x) / 2;
      path += ` Q ${cpX1},${points[i].y} ${xMid},${yMid} T ${points[i + 1].x},${points[i + 1].y}`;
    }

    return { path, points };
  };

  const { path: svgPath, points: svgPoints } = getSvgPath(graphData);

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

      {/* MAIN CONTENT */}
      <main className={`max-w-7xl mx-auto rounded-[3rem] p-12 shadow-2xl transition-all duration-500 min-h-[700px] border ${isDark ? 'bg-[#161C1E] border-slate-800' : 'bg-white border-slate-50'}`}>
        
        <div className="mb-10">
          <h2 className={`text-xl ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Hello, <span className={`${isDark ? 'text-white' : 'text-slate-900'} font-bold`}>{userName}</span> 👋</h2>
          <h1 className={`text-3xl font-black mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>Real-time Monitoring Greenhouse</h1>
        </div>

        {/* STAT CARDS */}
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
          />
          
          <StatCard isDark={isDark} label="AIR HUMIDITY" value={sensorData.airHumidity} icon={<Wind />} shadowColor="rgba(59, 130, 246, 0.15)" iconBg="bg-blue-500/10" iconColor="text-blue-500" />
          
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
          
          {/* MOISTURE GRAPH */}
          <div className={`lg:col-span-2 p-10 rounded-[2.5rem] border transition-all ${isDark ? 'bg-[#1C2426] border-slate-800' : 'bg-[#F9FBFB] border-slate-100 shadow-sm'}`}>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-800'}`}>Moisture Level Analysis</h3>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">UPDATED EVERY 2 HOURS</p>
              </div>
              <div className={`p-2 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-white shadow-sm'}`}>
                <TrendingUp className="text-[#00B67A]" size={20} />
              </div>
            </div>
            
            <div className="h-60 w-full relative pt-4">
              <svg viewBox="0 0 800 200" className="w-full h-full overflow-visible">
                <path 
                  d={svgPath} 
                  fill="none" 
                  stroke="#00B67A" 
                  strokeWidth="4" 
                  strokeLinecap="round"
                  className="drop-shadow-[0_10px_10px_rgba(0,182,122,0.2)] transition-all duration-700"
                />
                {svgPoints.map((pt, i) => (
                  <circle 
                    key={i} 
                    cx={pt.x} 
                    cy={pt.y} 
                    r="5" 
                    fill="#00B67A" 
                    stroke={isDark ? "#1C2426" : "white"} 
                    strokeWidth="2" 
                  />
                ))}
              </svg>

              <div className={`flex justify-between mt-6 text-[9px] md:text-[10px] font-black tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                {timeLabels.map((time, idx) => (
                  <span key={idx} className={idx % 2 === 0 ? "opacity-100" : "opacity-60"}>{time}</span>
                ))}
              </div>
            </div>
          </div>

          {/* SYSTEM SUMMARY */}
          <div className={`rounded-[2.5rem] p-10 border transition-all ${isDark ? 'bg-[#1C2426] border-slate-800' : 'bg-[#F8FBFB] border-slate-50'}`}>
            <h3 className={`font-bold text-xl mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>System Summary</h3>
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

            <button 
              onClick={handleDownloadReport}
              disabled={isDownloading}
              className="w-full py-5 bg-[#00B67A] text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-emerald-900/10 hover:bg-[#009e6a] transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Download size={14} />
              {isDownloading ? "Mengunduh..." : "Unduh Laporan"}
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