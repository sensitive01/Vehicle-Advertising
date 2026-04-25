'use client';
import React from 'react';
import Link from 'next/link';

export default function Technology() {
    return (
        <div className="w-full min-h-screen bg-[#030303] text-white font-sans selection:bg-[#F39C12] selection:text-black overflow-hidden">
            <nav className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-lg py-4 shadow-[0_4px_30px_rgba(0,0,0,0.5)] border-b border-white/5">
                <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex justify-between items-center">
                    <Link href="/" className="text-2xl font-black tracking-tighter cursor-pointer">FLEET<span className="text-[#F39C12]">AD</span></Link>
                    <div className="hidden lg:flex gap-8 text-[11px] uppercase tracking-widest font-bold text-zinc-300">
                        <Link href="/" className="hover:text-[#F39C12] transition-colors">Home</Link>
                        <Link href="/our-fleet" className="hover:text-[#F39C12] transition-colors">Our Fleet</Link>
                        <Link href="/campaigns" className="hover:text-[#F39C12] transition-colors">Campaigns</Link>
                        <Link href="/technology" className="text-white">Technology</Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/login"><button className="hidden md:block text-[10px] uppercase tracking-widest font-bold text-white hover:text-[#F39C12] transition-colors mr-2">Login</button></Link>
                        <Link href="/request-advertisement"><button className="bg-[#F39C12] text-black text-[10px] uppercase tracking-widest font-black px-6 py-3 rounded-full hover:bg-white transition-all shadow-[0_0_20px_rgba(243,156,18,0.3)]">Launch Campaign</button></Link>
                    </div>
                </div>
            </nav>

            <section className="relative w-full pt-32 pb-20 px-6 md:px-12 max-w-[1400px] mx-auto">
                <div className="absolute top-[20%] left-[10%] w-[300px] h-[300px] bg-[#F39C12]/5 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[700px]">
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] uppercase font-bold tracking-widest mb-6">Proprietary Core</div>
                        <h1 className="text-[45px] md:text-[60px] font-black tracking-tighter leading-[1.1] mb-6">DATA-DRIVEN <br/><span className="text-[#F39C12]">ROUTING ENGINE.</span></h1>
                        <p className="text-zinc-400 mb-10 max-w-[480px] leading-relaxed text-[14px]">Stop guessing about outdoor advertising ROI. Our military-grade GPS hardware communicates in real-time with our ad-servers. If a vehicle isn't moving, you don't pay. See exactly where your brand is every second of the day.</p>
                        
                        <div className="space-y-4">
                            <div className="flex bg-[#0A0A0A] border border-white/5 p-5 rounded-2xl gap-5 group hover:border-[#F39C12]/30 transition-colors">
                                <div className="text-3xl filter grayscale group-hover:grayscale-0 transition-all opacity-80 mt-1">🛰️</div>
                                <div>
                                    <h4 className="font-black text-white text-[15px] mb-1 tracking-wide">Live GPS Sub-system</h4>
                                    <p className="text-[12px] text-zinc-500 line-clamp-2">Track the exact latitude and longitude of every active ad across the country.</p>
                                </div>
                            </div>
                            <div className="flex bg-[#0A0A0A] border border-white/5 p-5 rounded-2xl gap-5 group hover:border-[#F39C12]/30 transition-colors">
                                <div className="text-3xl filter grayscale group-hover:grayscale-0 transition-all opacity-80 mt-1">📈</div>
                                <div>
                                    <h4 className="font-black text-white text-[15px] mb-1 tracking-wide">Impression Algorithms</h4>
                                    <p className="text-[12px] text-zinc-500 line-clamp-2">Automated traffic density math calculation using local congestion APIs.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="relative w-full aspect-square max-h-[600px] bg-[#050505] rounded-[40px] border border-white/10 flex items-center justify-center shadow-[0_30px_80px_rgba(0,0,0,0.8)] overflow-hidden group">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(243,156,18,0.15)_0%,transparent_60%)] group-hover:scale-110 transition-transform duration-1000"></div>
                        <img src="/images/tech-speed.png" className="w-[100%] h-[100%] object-cover relative z-10 transform scale-110 group-hover:scale-125 duration-1000 saturate-50 group-hover:saturate-100 mix-blend-screen opacity-80" />
                    </div>
                </div>
            </section>
        </div>
    );
}
