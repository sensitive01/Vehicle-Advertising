'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#030303] text-white font-sans overflow-x-hidden selection:bg-[#F39C12] selection:text-black">
        {/* Floating Glass Navbar */}
        <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-black/80 backdrop-blur-lg py-4 shadow-[0_4px_30px_rgba(0,0,0,0.5)] border-b border-white/5' : 'bg-transparent py-8'}`}>
            <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex justify-between items-center">
                <div className="text-2xl font-black tracking-tighter">FLEET<span className="text-[#F39C12]">AD</span></div>
                <div className="hidden lg:flex gap-8 text-[11px] uppercase tracking-widest font-bold text-zinc-300">
                    <Link href="/" className="text-white">Home</Link>
                    <Link href="/our-fleet" className="hover:text-[#F39C12] transition-colors">Our Fleet</Link>
                    <Link href="/campaigns" className="hover:text-[#F39C12] transition-colors">Campaigns</Link>
                    <Link href="/technology" className="hover:text-[#F39C12] transition-colors">Technology</Link>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/login">
                        <button className="hidden md:block text-[10px] uppercase tracking-widest font-bold text-white hover:text-[#F39C12] transition-colors mr-2">Login</button>
                    </Link>
                    <Link href="/request-advertisement">
                        <button className="bg-[#F39C12] text-black text-[10px] uppercase tracking-widest font-black px-6 py-3 rounded-full hover:bg-white transition-all shadow-[0_0_20px_rgba(243,156,18,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]">Launch Campaign</button>
                    </Link>
                </div>
            </div>
        </nav>

        {/* HERO IMMERSIVE SECTION */}
        <section className="relative w-full h-[100vh] min-h-[850px] flex items-center justify-center pt-20 overflow-hidden">
            {/* Massive Glowing Core */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#F39C12]/10 rounded-full blur-[150px] pointer-events-none"></div>
            
            {/* Background Grid Lines */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_30%,transparent_100%)] pointer-events-none"></div>

            <div className="relative z-20 w-full max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col items-center text-center">
                
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#F39C12]/30 bg-[#F39C12]/10 text-[#F39C12] text-[10px] font-bold uppercase tracking-[2px] mb-8 shadow-[0_0_15px_rgba(243,156,18,0.2)]">
                    <span className="w-2 h-2 rounded-full bg-[#F39C12] animate-[pulse_1.5s_ease-in-out_infinite]"></span> Network Active
                </div>

                <h1 className="text-[50px] md:text-[80px] lg:text-[110px] font-black tracking-tighter leading-[0.9] mb-6 drop-shadow-2xl">
                    DOMINATE <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-400 to-zinc-600">THE STREETS</span>
                </h1>
                
                <p className="text-[14px] md:text-[16px] text-zinc-400 leading-relaxed max-w-[600px] font-light mb-16 px-4">
                    Turn operational daily commuter fleets into inescapable, dynamic moving billboards. Harness live GPS traction to secure unignorable maximum reach for your brand.
                </p>

                {/* Central Car Illusion */}
                <div className="relative w-full max-w-[1000px] flex justify-center mt-4 h-[300px] md:h-[400px]">
                    <img src="/images/mini-hero.png" alt="Hero Ad" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] md:w-[100%] max-w-none transform scale-110 drop-shadow-[0_80px_100px_rgba(0,0,0,0.9)] z-20 animate-[float_6s_ease-in-out_infinite]" />
                    
                    {/* Floating Glass Card 1 (Left) */}
                    <div className="hidden md:flex absolute top-[10%] left-0 z-30 bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 items-center gap-4 shadow-[0_20px_40px_rgba(0,0,0,0.6)] animate-[float_5s_ease-in-out_infinite_0.5s]">
                        <div className="w-12 h-12 bg-[#F39C12]/20 rounded-full flex items-center justify-center text-[#F39C12] border border-[#F39C12]/30 text-xl font-sans">👁️</div>
                        <div className="text-left font-sans">
                            <p className="text-[24px] font-black leading-none text-white tracking-tighter">1.2B+</p>
                            <p className="text-[9px] uppercase tracking-widest text-zinc-400 font-bold mt-1">Monthly Impressions</p>
                        </div>
                    </div>

                    {/* Floating Glass Card 2 (Right) */}
                    <div className="hidden md:flex absolute bottom-[10%] right-[-5%] z-30 bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 items-center gap-4 shadow-[0_20px_40px_rgba(0,0,0,0.6)] animate-[float_7s_ease-in-out_infinite_1s]">
                        <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 border border-green-500/30 text-xl font-sans">📍</div>
                        <div className="text-left font-sans">
                            <p className="text-[24px] font-black leading-none text-white tracking-tighter">98.5%</p>
                            <p className="text-[9px] uppercase tracking-widest text-zinc-400 font-bold mt-1">Live Route Accuracy</p>
                        </div>
                    </div>
                </div>
            </div>
            {/* Ground Shadow */}
            <div className="absolute bottom-[-10vh] left-1/2 -translate-x-1/2 w-[120%] h-[30vh] bg-gradient-to-t from-[#030303] via-[#030303] to-transparent z-30 pointer-events-none"></div>
        </section>

        {/* INFINITE MARQUEE */}
        <div className="w-full bg-[#F39C12] py-4 overflow-hidden relative z-40 flex shadow-[0_0_50px_rgba(243,156,18,0.2)]">
            <div className="whitespace-nowrap animate-[marquee_20s_linear_infinite] flex items-center gap-8 text-black font-black text-[14px] uppercase tracking-[4px]">
                <span>VEHICLE ADVERTISING</span> <span>•</span>
                <span>MAXIMUM REACH</span> <span>•</span>
                <span>LIVE TRACKING</span> <span>•</span>
                <span>NATIONWIDE FLEET</span> <span>•</span>
                <span>UNIGNORABLE ROI</span> <span>•</span>
                <span>VEHICLE ADVERTISING</span> <span>•</span>
                <span>MAXIMUM REACH</span> <span>•</span>
                <span>LIVE TRACKING</span> <span>•</span>
                <span>NATIONWIDE FLEET</span> <span>•</span>
                <span>UNIGNORABLE ROI</span> <span>•</span>
                <span>VEHICLE ADVERTISING</span> <span>•</span>
                <span>MAXIMUM REACH</span>
            </div>
        </div>

        {/* BENTO-BOX FEATURES SECTION */}
        <section className="relative w-full py-32 bg-[#030303] z-30">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                <div className="text-center mb-20">
                    <h2 className="text-[32px] md:text-[50px] font-black tracking-tight mb-4">The FleetAd Advantage</h2>
                    <p className="text-zinc-400 text-[14px] max-w-[500px] mx-auto font-light">Why modern brands are leaving static billboards behind and moving to dynamic transit ad networks.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:auto-rows-[350px]">
                    
                    {/* Large Spotlight Box */}
                    <div className="md:col-span-2 relative bg-[#0A0B0E] border border-white/5 rounded-3xl overflow-hidden group hover:border-[#F39C12]/30 transition-colors">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <img src="/images/hero-ad.png" className="absolute top-0 right-0 w-[60%] h-full object-cover opacity-30 group-hover:opacity-50 group-hover:scale-105 transition-all duration-700 [mask-image:linear-gradient(to_left,black,transparent)]" />
                        <div className="relative h-full flex flex-col justify-end p-10 z-10 md:w-[70%]">
                            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6 backdrop-blur-md border border-white/10 text-2xl font-sans">🚀</div>
                            <h3 className="text-[28px] font-black tracking-tight mb-3">Hyper-Targeted Routing</h3>
                            <p className="text-[12px] text-zinc-400 font-light leading-relaxed">Unlike static billboards stuck on highways, our fleet dynamically navigates through high-density metropolitan choke-points exactly when your audience is there.</p>
                        </div>
                    </div>

                    {/* Small Stat Box */}
                    <div className="relative bg-gradient-to-b from-[#F39C12] to-[#D68910] rounded-3xl p-10 flex flex-col justify-center shadow-[0_0_40px_rgba(243,156,18,0.15)] group hover:-translate-y-2 transition-transform">
                        <h3 className="text-black text-[60px] font-black leading-none tracking-tighter mb-2 group-hover:scale-105 origin-left transition-transform">2.5x</h3>
                        <p className="text-black/80 text-[14px] font-black uppercase tracking-widest">Conversion Lift</p>
                        <p className="text-black/80 text-[12px] mt-4 font-medium leading-snug">Moving advertisements generate physically higher visual recall rates compared to stationary stationary signs.</p>
                    </div>

                    {/* Dashboard/Tech Box */}
                    <div className="relative bg-[#0A0B0E] border border-white/5 rounded-3xl p-10 overflow-hidden group hover:border-white/20 transition-colors">
                        <img src="/images/tech-speed.png" className="absolute bottom-0 right-0 w-[150%] opacity-20 group-hover:opacity-40 transition-opacity duration-700 blur-[2px] group-hover:blur-0" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B0E] via-[#0A0B0E]/80 to-transparent"></div>
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/10 text-2xl font-sans">📱</div>
                            <div>
                                <h3 className="text-[22px] font-black tracking-tight mb-2">Live Campaign Analytics</h3>
                                <p className="text-[12px] text-zinc-400 font-light">Track impressions and route density in real-time through your dashboard.</p>
                            </div>
                        </div>
                    </div>

                    {/* Material/Quality Box */}
                    <div className="md:col-span-2 relative bg-[#0A0B0E] border border-white/5 rounded-3xl overflow-hidden group hover:border-[#F39C12]/30 transition-colors">
                        <img src="/images/tech-audio.png" className="absolute left-0 top-0 w-[50%] h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity duration-700 [mask-image:linear-gradient(to_right,black,transparent)]" />
                        <div className="relative h-full flex flex-col items-end text-right justify-center p-10 z-10 ml-auto md:w-[60%]">
                            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6 backdrop-blur-md border border-white/10 text-2xl font-sans">✨</div>
                            <h3 className="text-[28px] font-black tracking-tight mb-3">Flawless Sticker Material</h3>
                            <p className="text-[12px] text-zinc-400 font-light leading-relaxed">We utilize ultra-premium, weather-resistant structural vinyl algorithms. Your brand colors will burst through urban environments without peeling or fading.</p>
                        </div>
                    </div>

                </div>
            </div>
        </section>

        {/* FLEET TIERS SECTION */}
        <section className="relative w-full py-32 bg-[#050505] z-30 border-t border-white/5">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                 <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                     <div>
                         <h2 className="text-[32px] md:text-[50px] font-black tracking-tight mb-4">Our Advertising Fleet</h2>
                         <p className="text-zinc-400 text-[14px] max-w-[500px] font-light">Scale your reach by selecting the perfect commercial vehicle format for your target demographic.</p>
                     </div>
                     <button className="px-8 py-3 rounded-full border border-white/20 text-white text-[10px] uppercase tracking-[2px] font-bold hover:bg-white hover:text-black transition-colors">
                         View Rate Card
                     </button>
                 </div>

                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Tier 1 */}
                      <div className="bg-gradient-to-b from-[#0F1115] to-[#0A0B0E] border border-white/5 rounded-3xl p-8 flex flex-col items-center text-center group hover:border-[#F39C12]/40 transition-colors cursor-pointer shadow-[0_20px_40px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_60px_rgba(243,156,18,0.1)] relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-full h-[100px] bg-[#F39C12]/5 blur-[50px] group-hover:bg-[#F39C12]/10 transition-colors pointer-events-none"></div>
                          <div className="h-[200px] flex items-center justify-center relative w-full mb-6">
                              <img src="/images/car-ad.png" className="w-[120%] max-w-none transform group-hover:scale-110 drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)] transition-transform duration-700 z-10 filter brightness-90 group-hover:brightness-100" />
                              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[80%] h-[15px] bg-black/80 blur-[10px] rounded-[100%]"></div>
                          </div>
                          <h3 className="text-[20px] font-black tracking-wide mb-2 text-white">Ride-Share Sedan</h3>
                          <div className="flex bg-black/50 border border-white/5 px-4 py-1.5 rounded-full mb-6 relative z-20">
                             <span className="text-[9px] uppercase tracking-widest text-[#F39C12] font-bold">Local Saturation</span>
                          </div>
                          <div className="w-full h-[1px] bg-white/5 mb-6"></div>
                          <p className="text-[32px] font-black tracking-tighter mb-1 relative z-20">1.2M <span className="text-[12px] text-zinc-500 font-normal tracking-normal uppercase">/ Month</span></p>
                      </div>

                      {/* Tier 2 */}
                      <div className="bg-gradient-to-b from-[#0F1115] to-[#0A0B0E] border border-white/5 rounded-3xl p-8 flex flex-col items-center text-center group hover:border-[#F39C12]/40 transition-colors cursor-pointer shadow-[0_20px_40px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_60px_rgba(243,156,18,0.1)] relative overflow-hidden ring-1 ring-[#F39C12]/20 transform lg:-translate-y-4">
                          <div className="absolute top-0 left-0 w-full h-[150px] bg-[#F39C12]/5 blur-[50px] group-hover:bg-[#F39C12]/15 transition-colors pointer-events-none"></div>
                          <div className="absolute top-4 right-4 bg-[#F39C12] text-black text-[8px] font-black uppercase tracking-[2px] px-3 py-1 rounded-full z-20">Most Popular</div>
                          
                          <div className="h-[200px] flex items-center justify-center relative w-full mb-6 mt-4">
                              <img src="/images/mini-hero.png" className="w-[130%] max-w-none transform group-hover:scale-110 drop-shadow-[0_20px_30px_rgba(0,0,0,0.9)] transition-transform duration-700 z-10" />
                              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] h-[15px] bg-black/80 blur-[10px] rounded-[100%]"></div>
                          </div>
                          <h3 className="text-[20px] font-black tracking-wide mb-2 text-white">Premium Commuter</h3>
                          <div className="flex bg-black/50 border border-white/5 px-4 py-1.5 rounded-full mb-6 relative z-20">
                             <span className="text-[9px] uppercase tracking-widest text-[#F39C12] font-bold">Expressway Focus</span>
                          </div>
                          <div className="w-full h-[1px] bg-white/5 mb-6"></div>
                          <p className="text-[32px] font-black tracking-tighter mb-1 relative z-20">2.8M <span className="text-[12px] text-zinc-500 font-normal tracking-normal uppercase">/ Month</span></p>
                      </div>

                      {/* Tier 3 */}
                      <div className="bg-gradient-to-b from-[#0F1115] to-[#0A0B0E] border border-white/5 rounded-3xl p-8 flex flex-col items-center text-center group hover:border-[#F39C12]/40 transition-colors cursor-pointer shadow-[0_20px_40px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_60px_rgba(243,156,18,0.1)] relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-full h-[100px] bg-[#F39C12]/5 blur-[50px] group-hover:bg-[#F39C12]/10 transition-colors pointer-events-none"></div>
                          <div className="h-[200px] flex items-center justify-center relative w-full mb-6">
                              <img src="/images/bus-ad.png" className="w-[125%] max-w-none transform scale-x-[-1] group-hover:scale-[-1.1] drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)] transition-transform duration-700 z-10 filter brightness-90 group-hover:brightness-100" />
                              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[80%] h-[15px] bg-black/80 blur-[10px] rounded-[100%]"></div>
                          </div>
                          <h3 className="text-[20px] font-black tracking-wide mb-2 text-white">Full Transit Bus</h3>
                          <div className="flex bg-black/50 border border-white/5 px-4 py-1.5 rounded-full mb-6 relative z-20">
                             <span className="text-[9px] uppercase tracking-widest text-[#F39C12] font-bold">Mass City Reach</span>
                          </div>
                          <div className="w-full h-[1px] bg-white/5 mb-6"></div>
                          <p className="text-[32px] font-black tracking-tighter mb-1 relative z-20">4.5M <span className="text-[12px] text-zinc-500 font-normal tracking-normal uppercase">/ Month</span></p>
                      </div>
                 </div>
            </div>
        </section>

        {/* CTA FOOTER */}
        <section className="w-full bg-[#F39C12] text-black py-24 text-center px-6 relative z-30 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
            <h2 className="text-[40px] md:text-[60px] font-black tracking-tighter leading-none mb-6 relative z-10">Start Your Campaign Today.</h2>
            <p className="text-[14px] font-bold text-black/70 uppercase tracking-[2px] mb-12 relative z-10">Deploy ads onto 1000+ active vehicles immediately.</p>
            <Link href="/request-advertisement">
                <button className="bg-black text-white text-[12px] font-bold tracking-[2px] uppercase px-12 py-5 shadow-2xl hover:scale-105 transition-transform relative z-10">Build Campaign</button>
            </Link>
        </section>

        {/* FOOTER */}
        <footer className="w-full bg-black text-zinc-600 py-12 text-center text-[10px] uppercase font-bold tracking-[3px] relative z-30">
             <div className="flex justify-center gap-8 mb-8 relative z-20">
                 <Link href="#" className="hover:text-white transition-colors">Instagram</Link>
                 <Link href="#" className="hover:text-white transition-colors">LinkedIn</Link>
                 <Link href="#" className="hover:text-white transition-colors">Contact</Link>
             </div>
             <p className="relative z-20">© {new Date().getFullYear()} FLEETAD. ALL RIGHTS RESERVED.</p>
        </footer>

        {/* Global Styles for Animations */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
          }
        `}} />
    </div>
  );
}
