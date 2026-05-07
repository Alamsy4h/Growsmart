"use client";
import React, { useState } from 'react';
import { Sprout, Mail, Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Login gagal");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Koneksi gagal. Periksa jaringan Anda.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-[#F0F4F4] flex items-center justify-center p-6 font-sans overflow-hidden">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row shadow-emerald-900/5">
        
        {/* LEFT SIDE */}
        <div className="bg-[#00B67A] md:w-2/5 p-12 flex flex-col justify-between text-white relative">
          <div className="z-10">
            <div className="flex items-center gap-2 mb-12">
              <Sprout size={24} />
              <span className="font-bold text-xl tracking-tight">GrowSmart</span>
            </div>
            <h1 className="text-4xl font-black leading-tight mb-6">
              Welcome Back to Your Garden!
            </h1>
            <p className="text-emerald-50/80 text-sm leading-relaxed font-medium">
              Monitor and control your IoT Greenhouse systems from anywhere at any time.
            </p>
          </div>
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60 z-10">
            GrowSmart Project 2026
          </div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        {/* RIGHT SIDE */}
        <div className="md:w-3/5 p-12 md:p-16 flex flex-col justify-center bg-white">
          <div className="max-w-sm mx-auto w-full">
              {/* TOMBOL BACK — tambah di sini */}
  <button
    onClick={() => router.back()}
    className="flex items-center gap-2 text-slate-400 hover:text-slate-600 text-xs font-bold uppercase tracking-wider mb-8 transition-colors group"
  >
    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
    Back
  </button>
            <h2 className="text-2xl font-black text-slate-900 mb-2">Sign In</h2>
            <p className="text-xs font-bold text-slate-400 mb-10">
              Belum punya akun?{" "}
              <Link href="/auth/register" className="text-[#00B67A] hover:underline">
                Daftar Sekarang
              </Link>
            </p>

            {/* ERROR MESSAGE */}
            {error && (
              <div className="mb-6 px-4 py-3 rounded-2xl bg-red-50 border border-red-100 text-red-500 text-xs font-bold flex items-center gap-2">
                <span>⚠️</span> {error}
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Email */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-[#00B67A] transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="rafif@gmail.com"
                    required
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-semibold outline-none focus:border-[#00B67A]/30 focus:ring-4 focus:ring-[#00B67A]/5 transition-all text-slate-700"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-[#00B67A] transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-semibold outline-none focus:border-[#00B67A]/30 focus:ring-4 focus:ring-[#00B67A]/5 transition-all text-slate-700"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-1">
                <button type="button" className="text-[10px] font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-wider">
                  Forgot Password?
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#00B67A] hover:bg-[#009e6a] disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-2xl py-4 font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-emerald-100 flex items-center justify-center gap-2 transition-all active:scale-95 mt-4"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Memverifikasi...
                  </>
                ) : (
                  <>Login <ArrowRight size={16} /></>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}