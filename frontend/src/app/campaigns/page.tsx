'use client';
import React from 'react';
import Link from 'next/link';

export default function Campaigns() {
    return (
        <div className="w-full min-h-screen bg-[#030303] text-white font-sans selection:bg-[#F39C12] selection:text-black">
            <nav className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-lg py-4 shadow-[0_4px_30px_rgba(0,0,0,0.5)] border-b border-white/5">
                <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex justify-between items-center">
                    <Link href="/" className="text-2xl font-black tracking-tighter cursor-pointer">FLEET<span className="text-[#F39C12]">AD</span></Link>
                    <div className="hidden lg:flex gap-8 text-[11px] uppercase tracking-widest font-bold text-zinc-300">
                        <Link href="/" className="hover:text-[#F39C12] transition-colors">Home</Link>
                        <Link href="/our-fleet" className="hover:text-[#F39C12] transition-colors">Our Fleet</Link>
                        <Link href="/campaigns" className="text-white">Campaigns</Link>
                        <Link href="/technology" className="hover:text-[#F39C12] transition-colors">Technology</Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/login"><button className="hidden md:block text-[10px] uppercase tracking-widest font-bold text-white hover:text-[#F39C12] transition-colors mr-2">Login</button></Link>
                        <Link href="/request-advertisement"><button className="bg-[#F39C12] text-black text-[10px] uppercase tracking-widest font-black px-6 py-3 rounded-full hover:bg-white transition-all shadow-[0_0_20px_rgba(243,156,18,0.3)]">Launch Campaign</button></Link>
                    </div>
                </div>
            </nav>

            <section className="relative w-full pt-40 pb-20 px-6 md:px-12 max-w-[1400px] mx-auto text-center">
                <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#F39C12]/10 rounded-full blur-[100px] pointer-events-none"></div>
                <h1 className="text-[50px] md:text-[80px] font-black tracking-tighter leading-none mb-6 relative z-10">DEPLOY. TRACK. <span className="text-[#F39C12]">SCALE.</span></h1>
                <p className="text-zinc-400 max-w-[600px] mx-auto mb-20 text-[14px] relative z-10">A frictionless campaign setup built for modern brands. Go from digital design assets to 1,000+ moving advertisements in under two weeks.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left relative z-10">
                    <div className="bg-gradient-to-b from-[#111] to-[#050505] border border-white/10 rounded-3xl p-10 hover:border-[#F39C12] hover:shadow-[0_0_30px_rgba(243,156,18,0.1)] transition-all">
                         <div className="text-[#F39C12] text-[50px] font-black mb-4">01</div>
                         <h3 className="text-xl font-bold mb-2">Upload Assets</h3>
                         <p className="text-zinc-400 text-sm">Provide your creative designs. Our elite team formats them for precision die-cut vinyl routing.</p>
                    </div>
                    <div className="bg-gradient-to-b from-[#111] to-[#050505] border border-white/10 rounded-3xl p-10 hover:border-[#F39C12] hover:shadow-[0_0_30px_rgba(243,156,18,0.1)] transition-all transform md:-translate-y-6">
                         <div className="text-[#F39C12] text-[50px] font-black mb-4">02</div>
                         <h3 className="text-xl font-bold mb-2">Fleet Application</h3>
                         <p className="text-zinc-400 text-sm">We rapidly apply premium wrap material to your selected fleet volume across exact geographic zones.</p>
                    </div>
                    <div className="bg-gradient-to-b from-[#111] to-[#050505] border border-white/10 rounded-3xl p-10 hover:border-[#F39C12] hover:shadow-[0_0_30px_rgba(243,156,18,0.1)] transition-all">
                         <div className="text-[#F39C12] text-[50px] font-black mb-4">03</div>
                         <h3 className="text-xl font-bold mb-2">Live Telemetry</h3>
                         <p className="text-zinc-400 text-sm">Monitor live street traversals and impression algorithms directly from your web dashboard in real-time.</p>
                    </div>
                </div>
                
                <div className="mt-20">
                    <Link href="/request-advertisement">
                         <button className="bg-white text-black text-[12px] font-bold tracking-[2px] uppercase px-12 py-5 rounded-full hover:bg-[#F39C12] transition-colors relative z-10 shadow-[0_10px_40px_rgba(255,255,255,0.2)]">Start Integration</button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
