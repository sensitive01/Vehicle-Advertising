'use client';
import React from 'react';
import Link from 'next/link';

export default function OurFleet() {
    return (
        <div className="w-full min-h-screen bg-[#030303] text-white font-sans selection:bg-[#F39C12] selection:text-black">
            <nav className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-lg py-4 shadow-[0_4px_30px_rgba(0,0,0,0.5)] border-b border-white/5">
                <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex justify-between items-center">
                    <Link href="/" className="text-2xl font-black tracking-tighter cursor-pointer">FLEET<span className="text-[#F39C12]">AD</span></Link>
                    <div className="hidden lg:flex gap-8 text-[11px] uppercase tracking-widest font-bold text-zinc-300">
                        <Link href="/" className="hover:text-[#F39C12] transition-colors">Home</Link>
                        <Link href="/our-fleet" className="text-white">Our Fleet</Link>
                        <Link href="/campaigns" className="hover:text-[#F39C12] transition-colors">Campaigns</Link>
                        <Link href="/technology" className="hover:text-[#F39C12] transition-colors">Technology</Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/login"><button className="hidden md:block text-[10px] uppercase tracking-widest font-bold text-white hover:text-[#F39C12] transition-colors mr-2">Login</button></Link>
                        <Link href="/request-advertisement"><button className="bg-[#F39C12] text-black text-[10px] uppercase tracking-widest font-black px-6 py-3 rounded-full hover:bg-white transition-all shadow-[0_0_20px_rgba(243,156,18,0.3)]">Launch Campaign</button></Link>
                    </div>
                </div>
            </nav>

            <section className="relative w-full pt-40 pb-20 px-6 md:px-12 max-w-[1400px] mx-auto">
                <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] bg-[#F39C12]/10 rounded-full blur-[120px] pointer-events-none"></div>
                <h1 className="text-[50px] md:text-[80px] font-black tracking-tighter leading-none mb-6 relative z-10">DOMINATE THE ROAD.</h1>
                <p className="text-zinc-400 max-w-[600px] mb-20 text-[14px] relative z-10">Our diverse rolling fleet ensures your brand is physically injected into every layer of urban and suburban infrastructure.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                    {/* Card 1 */}
                    <div className="border border-white/5 rounded-3xl group overflow-hidden relative min-h-[400px] shadow-[0_20px_40px_rgba(0,0,0,0.6)] flex items-end">
                        <img src="/images/bus-ad.png" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700 saturate-50 group-hover:opacity-80 group-hover:saturate-100" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent"></div>
                        
                        <div className="relative z-10 p-10 w-full">
                            <h2 className="text-[30px] font-bold text-white mb-2">Mass Transit</h2>
                            <p className="text-[#F39C12] font-bold text-[10px] uppercase tracking-widest mb-6 drop-shadow-md">Downtown Saturation</p>
                            <p className="text-zinc-300 text-[12px] max-w-[320px] leading-relaxed drop-shadow-lg">Cover the entire city block. Transit buses deliver unmatched physical presence in the densest downtown corridors.</p>
                        </div>
                    </div>
                    
                    {/* Card 2 */}
                    <div className="border border-white/5 rounded-3xl group overflow-hidden relative min-h-[400px] shadow-[0_20px_40px_rgba(0,0,0,0.6)] flex items-end">
                        <img src="/images/mini-hero.png" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700 saturate-50 group-hover:opacity-80 group-hover:saturate-100 bg-[#111]" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent"></div>
                        
                        <div className="relative z-10 p-10 w-full">
                            <h2 className="text-[30px] font-bold text-white mb-2">Ride-Share Sedans</h2>
                            <p className="text-[#F39C12] font-bold text-[10px] uppercase tracking-widest mb-6 drop-shadow-md">Hyper-Local Reach</p>
                            <p className="text-zinc-300 text-[12px] max-w-[320px] leading-relaxed drop-shadow-lg">Going where buses rarely traverse. Inject your brand directly into quiet suburban neighborhoods, private complex pickups, and airport terminals.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
