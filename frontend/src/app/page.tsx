'use client';
import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="w-full min-h-screen font-sans selection:bg-[#F39C12] selection:text-black overflow-x-hidden">
      
      {/* -------------------- HERO SECTION (Dark) -------------------- */}
      <section className="relative w-full h-[100vh] min-h-[800px] bg-[#16181C] text-white flex flex-col overflow-hidden">
        {/* Faint Background Text */}
        <div className="absolute top-[20%] left-0 w-full text-center z-0 pointer-events-none">
             <h1 className="text-[25vw] font-black uppercase tracking-[0.05em] leading-none text-white/[0.03]">FLEET</h1>
        </div>
        
        {/* Navbar */}
        <nav className="relative z-50 w-full px-6 md:px-12 py-8 flex justify-between items-center text-[10px] font-medium uppercase tracking-[2px]">
            <div className="text-2xl tracking-tighter font-black normal-case">FLEET<span className="text-[#F39C12]">AD</span></div>
            <div className="hidden lg:flex gap-12">
                <Link href="#" className="text-[#F39C12]">Home</Link>
                <Link href="#" className="hover:text-[#F39C12] transition-colors">About Us</Link>
                <Link href="#" className="hover:text-[#F39C12] transition-colors">Vehicles <span className="text-[8px] opacity-50 ml-1">▼</span></Link>
                <Link href="#" className="hover:text-[#F39C12] transition-colors">Service <span className="text-[8px] opacity-50 ml-1">▼</span></Link>
                <Link href="#" className="hover:text-[#F39C12] transition-colors">Gallery</Link>
                <Link href="#" className="hover:text-[#F39C12] transition-colors">Contact</Link>
            </div>
            <div className="flex gap-6 items-center">
                <span className="w-5 h-5 border border-white/20 rounded-full flex items-center justify-center text-[9px] hover:bg-white/10 cursor-pointer">f</span>
                <span className="w-5 h-5 border border-white/20 rounded-full flex items-center justify-center text-[9px] hover:bg-white/10 cursor-pointer">tw</span>
                <span className="w-5 h-5 border border-white/20 rounded-full flex items-center justify-center text-[9px] hover:bg-white/10 cursor-pointer">in</span>
            </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 flex-grow flex flex-col md:flex-row items-center w-full max-w-[1400px] mx-auto px-6 md:px-12">
            {/* Left Content */}
            <div className="w-full md:w-[45%] flex flex-col items-start mt-[-10vh] md:mt-0">
                <h1 className="text-[3rem] lg:text-[4.5rem] font-bold tracking-tight leading-[1.1] mb-6 drop-shadow-xl">VEHICLE<br/>ADVERTISING</h1>
                <p className="text-[12px] text-zinc-400 font-light leading-[1.8] max-w-[320px] mb-10">
                    Expand the visual reach of your brand through the great explorer of the roads. Turn everyday operational fleets into unignorable moving advertising.
                </p>
                <button className="px-8 py-3 rounded-[30px] border border-[#F39C12] text-[#F39C12] text-[10px] uppercase tracking-[1.5px] font-bold hover:bg-[#F39C12] hover:text-black transition-colors shadow-[0_0_30px_rgba(243,156,18,0.15)]">
                    Know More
                </button>
            </div>
            {/* Right Vehicle Image */}
            <div className="w-full md:w-[55%] relative flex justify-center lg:justify-end mt-16 md:mt-0">
                <img src="/images/mini-hero.png" alt="Fleet Vehicle" className="w-[125%] md:w-[135%] lg:w-[150%] max-w-none transform lg:translate-x-12 filter drop-shadow-[0_60px_80px_rgba(0,0,0,0.9)] z-20" />
                
                {/* Side Arrows */}
                <div className="absolute right-[-20px] md:right-[-40px] top-1/2 -translate-y-1/2 flex flex-col gap-6 text-white/30 text-xl font-light scale-y-150 z-30 hidden lg:flex">
                   <span className="hover:text-white cursor-pointer transition-colors">&rarr;</span>
                   <span className="hover:text-white cursor-pointer transition-colors">&larr;</span>
                </div>
            </div>
        </div>

        {/* Hero Footer Indicators */}
        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-12 pb-12 flex justify-between items-end">
            <div className="flex flex-col gap-4 text-white/30 text-[10px] font-bold tracking-wider">
                <span className="hover:text-[#F39C12] cursor-pointer inline-block w-4 text-center transition-colors">f</span>
                <span className="hover:text-[#F39C12] cursor-pointer inline-block w-4 text-center transition-colors">ig</span>
                <span className="hover:text-[#F39C12] cursor-pointer inline-block w-4 text-center transition-colors">tw</span>
            </div>
            
            <div className="absolute left-1/2 -translate-x-1/2 bottom-12 flex flex-col items-center gap-2 cursor-pointer opacity-60 hover:opacity-100 transition-opacity">
               <div className="w-5 h-8 border border-white/40 rounded-full flex justify-center p-[3px]">
                   <div className="w-1 h-1.5 bg-white rounded-full animate-bounce"></div>
               </div>
            </div>

            <div className="flex gap-2.5 items-center">
               <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
               <div className="w-1.5 h-1.5 bg-white/20 rounded-full"></div>
               <div className="w-1.5 h-1.5 bg-white/20 rounded-full"></div>
               <div className="w-1.5 h-1.5 bg-white/20 rounded-full"></div>
            </div>
        </div>
      </section>

      {/* -------------------- ABOUT US SECTION (Light) -------------------- */}
      <section className="relative w-full bg-[#FFFFFF] text-black py-24 pb-32 overflow-hidden">
          <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col lg:flex-row gap-16 relative">
              {/* Left Column Text */}
              <div className="w-full lg:w-[45%] z-20 relative pt-4">
                  <h2 className="text-[32px] md:text-[36px] font-bold tracking-tight mb-2 text-zinc-900">About Us</h2>
                  <p className="text-[12px] font-bold text-[#F39C12] tracking-wide mb-8">FLEET ADVERTISING <span className="text-zinc-400 font-medium">IS THE FUTURE</span></p>
                  
                  <p className="text-[12px] text-zinc-500 leading-[2] max-w-[480px] mb-12 font-medium">
                      On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue. Harness outdoor tracking transit algorithms to achieve mass scale.
                  </p>
                  
                  <button className="px-8 py-3 rounded-[30px] border-[1.5px] border-zinc-300 text-zinc-600 text-[10px] uppercase tracking-[1px] font-bold hover:bg-black hover:text-white hover:border-black transition-colors mb-20">
                      Know More
                  </button>

                  {/* 4 Detail Icons Grid - Exactly matched to the Jeep layout icons */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                      <div className="flex flex-col text-left">
                          <div className="w-14 h-14 bg-zinc-50 rounded-full border border-zinc-100 shadow-sm flex items-center justify-center mb-5 hover:-translate-y-1 transition-transform">
                             <img src="/images/tech-bluetooth.png" className="w-6 h-6 object-cover opacity-60 rounded-full filter grayscale" alt="Reach" />
                          </div>
                          <h4 className="font-bold text-[11px] mb-2 text-zinc-800">Maximum Reach</h4>
                          <p className="text-[9px] text-zinc-500 leading-[1.6]">We denounce with righteous indignation and dislike men</p>
                      </div>
                      
                      <div className="flex flex-col text-left">
                          <div className="w-14 h-14 bg-zinc-50 rounded-full border border-zinc-100 shadow-sm flex items-center justify-center mb-5 hover:-translate-y-1 transition-transform">
                             <img src="/images/tech-speed.png" className="w-6 h-6 object-cover opacity-60 rounded-full filter grayscale" alt="Quality" />
                          </div>
                          <h4 className="font-bold text-[11px] mb-2 text-zinc-800">Premium Quality</h4>
                          <p className="text-[9px] text-zinc-500 leading-[1.6]">We denounce with righteous indignation and dislike men</p>
                      </div>
                      
                      <div className="flex flex-col text-left">
                          <div className="w-14 h-14 bg-zinc-50 rounded-full border border-zinc-100 shadow-sm flex items-center justify-center mb-5 hover:-translate-y-1 transition-transform">
                             <img src="/images/tech-audio.png" className="w-6 h-6 object-cover opacity-60 rounded-full filter grayscale" alt="Tracking" />
                          </div>
                          <h4 className="font-bold text-[11px] mb-2 text-zinc-800">Live Tracking</h4>
                          <p className="text-[9px] text-zinc-500 leading-[1.6]">We denounce with righteous indignation and dislike men</p>
                      </div>
                      
                      <div className="flex flex-col text-left">
                          <div className="w-14 h-14 bg-zinc-50 rounded-full border border-zinc-100 shadow-sm flex items-center justify-center mb-5 hover:-translate-y-1 transition-transform">
                             <div className="w-6 h-6 rounded-full border-2 border-zinc-300"></div>
                          </div>
                          <h4 className="font-bold text-[11px] mb-2 text-zinc-800">Full Support</h4>
                          <p className="text-[9px] text-zinc-500 leading-[1.6]">We denounce with righteous indignation and dislike men</p>
                      </div>
                  </div>
              </div>

              {/* Right Side Overlapping Background Vehicle */}
              <div className="w-full lg:w-[55%] flex justify-end items-center relative mt-16 lg:mt-0 lg:static">
                  <div className="static lg:absolute lg:right-[-15%] lg:top-[50%] lg:-translate-y-1/2 w-full lg:w-[130%] pointer-events-none z-10">
                      <img src="/images/mini-side.png" className="w-full max-w-none transform drop-shadow-[0_45px_60px_rgba(0,0,0,0.3)] filter brightness-95" alt="Side Ad Concept" />
                  </div>
              </div>
          </div>
      </section>

      {/* -------------------- VEHICLES SLIDER SECTION (Dark) -------------------- */}
      <section className="relative w-full bg-[#1A1B20] text-white pt-28 pb-36 overflow-hidden flex flex-col items-center">
          {/* Faint Background Text */}
          <div className="absolute bottom-[20%] right-[5%] z-0 pointer-events-none">
             <h2 className="text-[22vw] font-black tracking-tighter leading-none text-white/[0.02]">FLEET</h2>
          </div>

          <h2 className="text-[32px] font-bold tracking-wide mb-24 relative z-10 text-center">
              Fleet<span className="font-normal text-zinc-400"> Vehicles</span>
          </h2>

          <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 relative z-20">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-24 lg:gap-8 items-end text-center">
                  
                  {/* Vehicle 1 - Left */}
                  <div className="flex flex-col items-center relative lg:pb-8 group">
                     <div className="h-[180px] lg:h-[220px] flex items-center justify-center mb-10 relative">
                         <img src="/images/car-ad.png" className="w-full max-w-[300px] drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)] filter brightness-75 group-hover:brightness-100 transition-all duration-500" alt="Car Ad" />
                         {/* Ground Shadow */}
                         <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[220px] h-[15px] bg-black/60 blur-[12px] rounded-full"></div>
                     </div>
                     <h3 className="font-bold text-[14px] text-white tracking-wide">Transit Ad Standard*</h3>
                     <p className="text-[9px] text-zinc-500 font-medium mt-3 uppercase tracking-[2px] mb-2">Impressions Starting at</p>
                     <p className="text-[#F39C12] font-bold text-[14px] tracking-widest mb-8">1.5M VIEWS*</p>
                     <button className="px-8 py-2.5 rounded-[30px] border border-[#F39C12]/40 text-[#F39C12] text-[9px] uppercase tracking-[1px] hover:bg-[#F39C12] hover:text-black transition-colors font-bold">
                         Know More
                     </button>
                  </div>

                  {/* Vehicle 2 - Center (Active/Larger) */}
                  <div className="flex flex-col items-center relative lg:pb-8 group">
                     <div className="h-[220px] flex items-center justify-center mb-10 relative">
                         <img src="/images/mini-hero.png" className="w-[125%] max-w-[380px] drop-shadow-[0_30px_50px_rgba(0,0,0,0.95)] z-20 transform lg:-translate-y-4 group-hover:scale-105 transition-all duration-500" alt="Hero Ad" />
                         {/* Heavy ground shadow */}
                         <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[280px] h-[25px] bg-black/80 blur-[15px] rounded-full"></div>
                     </div>
                     <h3 className="font-bold text-[14px] text-white tracking-wide">Premium Daily Commuter</h3>
                     <p className="text-[9px] text-zinc-500 font-medium mt-3 uppercase tracking-[2px] mb-2">Impressions Starting at</p>
                     <p className="text-[#F39C12] font-bold text-[14px] tracking-widest mb-8">2.8M VIEWS*</p>
                     <button className="px-8 py-2.5 rounded-[30px] border border-[#F39C12] text-[#F39C12] text-[9px] uppercase tracking-[1px] hover:bg-[#F39C12] hover:text-black transition-colors font-bold shadow-[0_0_15px_rgba(243,156,18,0.2)]">
                         Know More
                     </button>
                  </div>

                  {/* Vehicle 3 - Right */}
                  <div className="flex flex-col items-center relative lg:pb-8 group">
                     <div className="h-[180px] lg:h-[220px] flex items-center justify-center mb-10 relative">
                         <img src="/images/bus-ad.png" className="w-[110%] max-w-[320px] drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)] filter brightness-75 scale-x-[-1] group-hover:brightness-100 transition-all duration-500" alt="Bus Ad" />
                         <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[240px] h-[15px] bg-black/60 blur-[12px] rounded-full"></div>
                     </div>
                     <h3 className="font-bold text-[14px] text-white tracking-wide">Full Transit Bus</h3>
                     <p className="text-[9px] text-zinc-500 font-medium mt-3 uppercase tracking-[2px] mb-2">Impressions Starting at</p>
                     <p className="text-[#F39C12] font-bold text-[14px] tracking-widest mb-8">4.5M VIEWS*</p>
                     <button className="px-8 py-2.5 rounded-[30px] border border-[#F39C12]/40 text-[#F39C12] text-[9px] uppercase tracking-[1px] hover:bg-[#F39C12] hover:text-black transition-colors font-bold">
                         Know More
                     </button>
                  </div>

              </div>

              {/* Slider Arrows & Dots (Right Aligned) */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-6 text-white/30 text-xl font-light scale-y-150 z-30 hidden lg:flex">
                 <span className="hover:text-white cursor-pointer transition-colors">&rarr;</span>
                 <span className="hover:text-white cursor-pointer transition-colors">&larr;</span>
              </div>
              
              <div className="flex justify-center gap-3 mt-20 items-center">
                 <div className="w-1.5 h-1.5 bg-white rounded-full opacity-100"></div>
                 <div className="w-1.5 h-1.5 bg-white rounded-full opacity-20"></div>
                 <div className="w-1.5 h-1.5 bg-white rounded-full opacity-20"></div>
                 <div className="w-1.5 h-1.5 bg-white rounded-full opacity-20"></div>
              </div>
          </div>
      </section>

      {/* -------------------- PORTFOLIO GALLERY (Light) -------------------- */}
      <section className="relative w-full bg-[#FFFFFF] text-black py-28 pb-40">
          <div className="text-center w-full max-w-[1400px] mx-auto px-6 md:px-12 object-contain">
              <h2 className="text-[32px] font-bold tracking-tight mb-12 text-zinc-900">Gallery</h2>
              
              {/* Category Nav Tabs */}
              <div className="flex flex-wrap justify-center gap-6 md:gap-16 text-[10px] font-bold text-zinc-400 uppercase tracking-wide mb-16 px-4">
                  <span className="text-black border-b-[3px] border-black pb-2 cursor-pointer transition-colors">Campaigns</span>
                  <span className="hover:text-black cursor-pointer transition-colors pb-2">Exterior Advertising</span>
                  <span className="hover:text-black cursor-pointer transition-colors pb-2">Analytics Dashboard</span>
                  <span className="hover:text-black cursor-pointer transition-colors pb-2">Commercial Fleet</span>
                  <span className="hover:text-black cursor-pointer transition-colors pb-2">Ride-Share Sedans</span>
              </div>

              {/* 3 Column Flush Photo Grid */}
              <div className="flex flex-col md:flex-row w-full h-[600px] md:h-[400px] bg-[#1A1B20] text-left">
                  
                  {/* Photo 1 (Exterior) */}
                  <div className="relative w-full md:w-1/3 h-1/3 md:h-full overflow-hidden group cursor-pointer border-b md:border-b-0 md:border-r border-zinc-800">
                      <img src="/images/hero-ad.png" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 opacity-80 group-hover:opacity-100 saturate-50 group-hover:saturate-100" alt="Fleet Exterior" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1A1B20]/90 via-[#1A1B20]/10 to-transparent pointer-events-none"></div>
                      <div className="absolute bottom-6 left-8 right-8 flex justify-between items-center text-white/90 group-hover:text-white transition-colors">
                          <span className="text-[13px] font-bold tracking-wide">Exterior</span>
                          <span className="text-[16px] font-light transform group-hover:translate-x-2 transition-transform">&rarr;</span>
                      </div>
                  </div>

                  {/* Photo 2 (Dashboard / Interior Analogy) */}
                  <div className="relative w-full md:w-1/3 h-1/3 md:h-full overflow-hidden group cursor-pointer border-b md:border-b-0 md:border-r border-zinc-800">
                      <img src="/images/tech-speed.png" className="w-full h-full object-cover transform scale-110 group-hover:scale-115 transition-transform duration-1000 opacity-60 group-hover:opacity-90 saturate-50 group-hover:saturate-100" alt="Fleet Interior Dashboard" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1A1B20]/90 via-[#1A1B20]/20 to-transparent pointer-events-none"></div>
                      <div className="absolute bottom-6 left-8 right-8 flex justify-between items-center text-white/90 group-hover:text-white transition-colors">
                          <span className="text-[13px] font-bold tracking-wide">Interior/Dashboard</span>
                          <span className="text-[16px] font-light transform group-hover:translate-x-2 transition-transform">&rarr;</span>
                      </div>
                  </div>

                  {/* Photo 3 (Capability / Transit) */}
                  <div className="relative w-full md:w-1/3 h-1/3 md:h-full overflow-hidden group cursor-pointer">
                      <img src="/images/car-ad.png" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 opacity-80 group-hover:opacity-100 saturate-50 group-hover:saturate-100" alt="Fleet Capability" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1A1B20]/90 via-[#1A1B20]/10 to-transparent pointer-events-none"></div>
                      <div className="absolute bottom-6 left-8 right-8 flex justify-between items-center text-white/90 group-hover:text-white transition-colors">
                          <span className="text-[13px] font-bold tracking-wide">Capability</span>
                          <span className="text-[16px] font-light transform group-hover:translate-x-2 transition-transform">&rarr;</span>
                      </div>
                  </div>

              </div>
          </div>
      </section>

      {/* -------------------- MINIMALISTIC FOOTER -------------------- */}
      <footer className="w-full bg-[#1A1B20] text-center pt-20 pb-16 relative z-30">
           <div className="flex justify-center gap-12 md:gap-20 text-[10px] md:text-[11px] tracking-[3px] uppercase font-bold text-zinc-500 mb-10">
               <Link href="#" className="hover:text-white transition-colors">Instagram</Link>
               <Link href="#" className="hover:text-white transition-colors">Twitter</Link>
               <Link href="#" className="hover:text-white transition-colors">Youtube</Link>
               <Link href="#" className="hover:text-white transition-colors">Facebook</Link>
           </div>
           <p className="text-[9px] text-zinc-600 tracking-[0.2em] font-medium uppercase mt-8">© {new Date().getFullYear()} FLEETAD NETWORK. ALL RIGHTS RESERVED.</p>
           <div className="w-full h-[3px] bg-gradient-to-r from-transparent via-[#F39C12]/20 to-transparent mt-12 mx-auto max-w-[300px]"></div>
      </footer>
    </div>
  );
}
