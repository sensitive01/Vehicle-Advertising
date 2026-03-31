'use client';

import React from 'react';
import Link from 'next/link';
import { Card, Typography, Button, Container, Box, AppBar, Toolbar } from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import CampaignIcon from '@mui/icons-material/Campaign';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import SecurityIcon from '@mui/icons-material/Security';
import PublicIcon from '@mui/icons-material/Public';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import LooksOneIcon from '@mui/icons-material/LooksOne';
import LooksTwoIcon from '@mui/icons-material/LooksTwo';
import Looks3Icon from '@mui/icons-material/Looks3';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

export default function Home() {
  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', bgcolor: '#050505', color: 'white', width: '100%', overflowX: 'hidden' }}>
      {/* Navigation Bar */}
      <AppBar position="sticky" sx={{ bgcolor: 'rgba(5, 5, 5, 0.95)', backdropFilter: 'blur(16px)', borderBottom: '1px solid #1c1c1c', boxShadow: 'none' }}>
        <Toolbar sx={{ justifyContent: 'space-between', py: 1, px: { xs: 2, md: 6 } }}>
          <Box display="flex" alignItems="center" gap={1}>
            <DirectionsCarIcon sx={{ color: '#FACC15', fontSize: 32 }} />
            <Typography variant="h6" sx={{ fontWeight: 900, letterSpacing: '-0.03em', textTransform: 'uppercase' }}>
              Fleet<span style={{ color: '#FACC15' }}>Ad</span> Network
            </Typography>
          </Box>
          <Box display="flex" gap={2} alignItems="center">
            <a href="/register" style={{ textDecoration: 'none' }}>
              <Button 
                sx={{ 
                  color: 'white', 
                  fontSize: '0.9rem', 
                  fontWeight: 600,
                  transition: 'all 0.3s ease',
                  '&:hover': { color: '#FACC15', transform: 'translateY(-2px)' } 
                }}
              >
                Register
              </Button>
            </a>
            <Link href="/login" style={{ textDecoration: 'none' }}>
              <Button 
                variant="contained" 
                startIcon={<LoginIcon sx={{ fontSize: '1.2rem !important' }} />}
                sx={{ 
                  py: 0.75, 
                  px: 2.5, 
                  bgcolor: '#FACC15', 
                  color: 'black', 
                  fontSize: '0.9rem', 
                  fontWeight: 700,
                  borderRadius: '8px',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 14px 0 rgba(250, 204, 21, 0.2)',
                  '&:hover': { 
                    bgcolor: '#FDE047', 
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px 0 rgba(250, 204, 21, 0.4)'
                  } 
                }}
              >
                Sign In
              </Button>
            </Link>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Hero Section Split Layout */}
      <section className="relative w-full min-h-[85vh] flex flex-col items-center justify-center overflow-hidden">
        {/* Abstract Background Design */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[10%] left-[5%] w-[400px] h-[400px] bg-[#FACC15] opacity-[0.05] rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[0%] right-[0%] w-[600px] h-[600px] bg-[#FACC15] opacity-[0.05] rounded-full blur-[120px]"></div>
        </div>

        <Container maxWidth="xl" className="z-10 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center py-12">
            
            {/* Left Content */}
            <div className="space-y-6 flex flex-col items-start text-left">
              <Box sx={{ mb: 1, display: 'inline-flex', alignItems: 'center', gap: 1.5, padding: '6px 16px', borderRadius: '100px', border: '1px solid rgba(250, 204, 21, 0.4)', bgcolor: 'rgba(250, 204, 21, 0.08)' }}>
                <span className="w-2 h-2 rounded-full bg-[#FACC15] animate-pulse"></span>
                <Typography variant="caption" sx={{ color: '#FACC15', fontWeight: 800, letterSpacing: '0.1em' }}>VEHICLE ADVERTISING MARKETPLACE</Typography>
              </Box>
              
              <Typography 
                variant="h1" 
                className="font-black text-5xl sm:text-6xl md:text-7xl lg:text-[5rem] uppercase"
                sx={{
                  background: 'linear-gradient(135deg, #ffffff 30%, #FACC15 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 4px 40px rgba(250, 204, 21, 0.2)',
                  lineHeight: '1.05',
                  letterSpacing: '-0.03em'
                }}
              >
                Your Brand <br />
                <span style={{ color: '#FACC15', WebkitTextFillColor: '#FACC15' }}>Everywhere</span>
              </Typography>
              
              <Typography variant="h6" className="text-zinc-300 max-w-xl font-light tracking-wide leading-relaxed text-lg">
                The ultimate marketplace connecting advertisers with everyday vehicles. From Government Buses and Metro trains to local Auto-Rickshaws and Private Cars. Choose exactly where you want to be seen.
              </Typography>

              <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full sm:w-auto">
                <a href="/request-advertisement" style={{ textDecoration: 'none' }}>
                  <Button 
                    variant="contained" 
                    startIcon={<AppRegistrationIcon />}
                    endIcon={<KeyboardArrowRightIcon />}
                    sx={{ py: 1.5, px: 5, fontSize: '1.05rem', fontWeight: 700, bgcolor: '#FACC15', color: '#000', '&:hover': { bgcolor: '#FDE047', transform: 'scale(1.02)' }, transition: 'all 0.2s' }}
                  >
                    Make an Advertisement
                  </Button>
                </a>
                <Link href="/login" style={{ textDecoration: 'none' }}>
                  <Button 
                    variant="outlined" 
                    startIcon={<LoginIcon />}
                    sx={{ py: 1.5, px: 5, fontSize: '1.05rem', fontWeight: 600, borderColor: '#333', color: '#fff', '&:hover': { borderColor: '#FACC15', color: '#FACC15' } }}
                  >
                    Sign In to Portal
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Image Content */}
            <div className="relative w-full h-[450px] lg:h-[600px] rounded-3xl overflow-hidden border border-zinc-800 shadow-[0_0_60px_rgba(250,204,21,0.15)] group">
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-10"></div>
              {/* Image of City Transit/Traffic */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/images/hero-ad.png" 
                alt="City Transit and Taxis" 
                className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute bottom-8 left-8 z-20">
                <Typography variant="h4" className="uppercase font-black italic text-white drop-shadow-xl">
                  CITY <span className="text-[#FACC15]">TRANSIT</span>
                </Typography>
                <Typography variant="body2" className="text-zinc-200 font-medium tracking-widest uppercase mt-1 bg-black/50 inline-block px-3 py-1 rounded-full border border-zinc-700 backdrop-blur-md">
                  Autos, Cabs & Private Cars
                </Typography>
              </div>
            </div>

          </div>
        </Container>
      </section>

      {/* Analytics / Stats Section */}
      <section className="w-full py-12 border-y border-zinc-900 bg-[#0A0A0A]">
        <Container maxWidth="xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <Typography variant="h3" sx={{ color: '#FACC15', fontWeight: 900, mb: 1 }}>14M+</Typography>
              <Typography variant="body2" sx={{ color: 'zinc.400', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>Daily Impressions</Typography>
            </div>
            <div>
              <Typography variant="h3" sx={{ color: '#FACC15', fontWeight: 900, mb: 1 }}>5,000+</Typography>
              <Typography variant="body2" sx={{ color: 'zinc.400', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>Registered Vehicles</Typography>
            </div>
            <div>
              <Typography variant="h3" sx={{ color: '#FACC15', fontWeight: 900, mb: 1 }}>4</Typography>
              <Typography variant="body2" sx={{ color: 'zinc.400', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>Transport Types</Typography>
            </div>
            <div>
              <Typography variant="h3" sx={{ color: '#FACC15', fontWeight: 900, mb: 1 }}>₹2M+</Typography>
              <Typography variant="body2" sx={{ color: 'zinc.400', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>Paid to Owners</Typography>
            </div>
          </div>
        </Container>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-20 bg-[#050505]">
        <Container maxWidth="xl">
          <div className="text-center mb-16">
            <Typography variant="h3" className="uppercase font-black mb-4 text-white tracking-tight">
              A Complete <span className="text-[#FACC15]">Marketplace</span>
            </Typography>
            <div className="w-24 h-1 bg-[#FACC15] mx-auto rounded-full mb-6"></div>
            <Typography variant="subtitle1" className="text-zinc-400 font-light max-w-3xl mx-auto leading-relaxed">
              We connect companies looking for serious visibility with people and organizations who drive every day. Find your perfect match.
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Box p={4} sx={{ bgcolor: '#0A0A0A', borderRadius: 4, border: '1px solid #1c1c1c' }}>
              <LooksOneIcon sx={{ fontSize: 40, color: '#FACC15', mb: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>Register Vehicle</Typography>
              <Typography variant="body2" sx={{ color: 'zinc.400', fontSize: '1rem', lineHeight: 1.6 }}>
                Owners list their private cars, auto-rickshaws, or government buses, setting their availability and standard driving routes.
              </Typography>
            </Box>
            <Box p={4} sx={{ bgcolor: '#0A0A0A', borderRadius: 4, border: '1px solid #1c1c1c' }}>
              <LooksTwoIcon sx={{ fontSize: 40, color: '#FACC15', mb: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>Select & Connect</Typography>
              <Typography variant="body2" sx={{ color: 'zinc.400', fontSize: '1rem', lineHeight: 1.6 }}>
                Advertisers browse available vehicles by type and transit route. They send an offer to the owner to wrap their vehicle.
              </Typography>
            </Box>
            <Box p={4} sx={{ bgcolor: '#0A0A0A', borderRadius: 4, border: '1px solid #1c1c1c' }}>
              <Looks3Icon sx={{ fontSize: 40, color: '#FACC15', mb: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>Install & Earn</Typography>
              <Typography variant="body2" sx={{ color: 'zinc.400', fontSize: '1rem', lineHeight: 1.6 }}>
                Once accepted, we handle the professional, non-damaging wrap installation. The owner drives their usual route and earns passive income.
              </Typography>
            </Box>
            <Box p={4} sx={{ bgcolor: '#0A0A0A', borderRadius: 4, border: '1px solid #1c1c1c' }}>
              <TrendingUpIcon sx={{ fontSize: 40, color: '#FACC15', mb: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>Track Results</Typography>
              <Typography variant="body2" sx={{ color: 'zinc.400', fontSize: '1rem', lineHeight: 1.6 }}>
                Advertisers access a live GPS dashboard to see exactly where their ads are traveling and analyze their city-wide impressions.
              </Typography>
            </Box>
          </div>
        </Container>
      </section>

      {/* Showcase Portfolio Section */}
      <section className="w-full py-20 bg-[#0A0A0A] border-y border-zinc-900">
        <Container maxWidth="xl">
          <div className="text-center mb-16">
            <Typography variant="h3" className="uppercase font-black mb-4 text-white tracking-tight">
              Vehicle <span className="text-[#FACC15]">Categories</span>
            </Typography>
            <div className="w-24 h-1 bg-[#FACC15] mx-auto rounded-full mb-6"></div>
            <Typography variant="subtitle1" className="text-zinc-400 font-light max-w-3xl mx-auto leading-relaxed">
              Scale your budget perfectly. Launch local campaigns on auto-rickshaws or dominate major arteries via Government Buses and Metros.
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative h-[400px] rounded-3xl overflow-hidden border border-zinc-800 shadow-lg group">
              {/* Image of Bus/Mass transit */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/images/bus-ad.png" 
                alt="City Mass Transit Bus" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute bottom-8 left-8">
                <Typography variant="h4" className="text-white font-black uppercase tracking-tight mb-1">Public Transit & Buses</Typography>
                <Typography variant="subtitle2" className="text-[#FACC15] font-bold tracking-widest uppercase">High-Volume Arteries</Typography>
                <Typography className="text-zinc-300 mt-2 max-w-sm text-sm line-clamp-2">
                  Partner with government buses and metro systems. Large format canvases that guarantee massive daily visibility across main city routes.
                </Typography>
              </div>
            </div>

            <div className="relative h-[400px] rounded-3xl overflow-hidden border border-zinc-800 shadow-lg group">
              {/* Image of Private cars / Autos */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/images/car-ad.png" 
                alt="City Traffic Private Cars" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute bottom-8 left-8">
                <Typography variant="h4" className="text-white font-black uppercase tracking-tight mb-1">Private Cars & Autos</Typography>
                <Typography variant="subtitle2" className="text-[#FACC15] font-bold tracking-widest uppercase">Granular Block Targeting</Typography>
                <Typography className="text-zinc-300 mt-2 max-w-sm text-sm line-clamp-2">
                  Access narrow lanes and residential zones by wrapping everyday commuter cars and local auto-rickshaws for intimate customer reach.
                </Typography>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="w-full py-24 px-6 sm:px-12 bg-[#050505]">
        <Container maxWidth="xl">
          <div className="text-center mb-16">
            <Typography variant="h3" className="uppercase font-black mb-6 text-white tracking-tight">
              Why Use <span className="text-[#FACC15]">Our Platform</span>
            </Typography>
            <div className="w-24 h-1 bg-[#FACC15] mx-auto rounded-full mb-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <Box textAlign="center" p={6} sx={{ bgcolor: '#0A0A0A', borderRadius: 6, border: '1px solid #1c1c1c', height: '100%', transition: 'all 0.3s', '&:hover': { borderColor: '#FACC15', transform: 'translateY(-10px)', boxShadow: '0 10px 30px rgba(250,204,21,0.05)' } }}>
                <DirectionsBusIcon sx={{ fontSize: 48, color: '#FACC15', mb: 3 }} />
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 2, textTransform: 'uppercase' }}>Diverse Inventory</Typography>
                <Typography sx={{ color: 'zinc.400', lineHeight: 1.6, fontSize: '1rem' }}>No restrictions. Whether you own a single auto-rickshaw or manage a state government bus depot, you can instantly monetize your vehicles.</Typography>
              </Box>
            </div>
            <div>
              <Box textAlign="center" p={6} sx={{ bgcolor: '#0A0A0A', borderRadius: 6, border: '1px solid #1c1c1c', height: '100%', transition: 'all 0.3s', '&:hover': { borderColor: '#FACC15', transform: 'translateY(-10px)', boxShadow: '0 10px 30px rgba(250,204,21,0.05)' } }}>
                <PublicIcon sx={{ fontSize: 48, color: '#FACC15', mb: 3 }} />
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 2, textTransform: 'uppercase' }}>Complete Control</Typography>
                <Typography sx={{ color: 'zinc.400', lineHeight: 1.6, fontSize: '1rem' }}>Advertisers choose exact vehicle types and routes. Owners retain the right to accept or decline any specific brand advertising on their car.</Typography>
              </Box>
            </div>
            <div>
              <Box textAlign="center" p={6} sx={{ bgcolor: '#0A0A0A', borderRadius: 6, border: '1px solid #1c1c1c', height: '100%', transition: 'all 0.3s', '&:hover': { borderColor: '#FACC15', transform: 'translateY(-10px)', boxShadow: '0 10px 30px rgba(250,204,21,0.05)' } }}>
                <SecurityIcon sx={{ fontSize: 48, color: '#FACC15', mb: 3 }} />
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 2, textTransform: 'uppercase' }}>Safe & Verified</Typography>
                <Typography sx={{ color: 'zinc.400', lineHeight: 1.6, fontSize: '1rem' }}>All wraps are certified to be non-damaging to paint. Vehicle owners submit simple daily check-in photos to guarantee payout.</Typography>
              </Box>
            </div>
          </div>
        </Container>
      </section>

      {/* Registration & Services Section */}
      <section id="registration" className="w-full py-24 px-6 sm:px-12 bg-[#0A0A0A] border-t border-zinc-900 flex justify-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#FACC15] opacity-[0.03] rounded-full blur-[150px] z-0"></div>
        
        <div className="max-w-6xl w-full z-10">
          <div className="text-center mb-16">
            <Typography variant="h3" className="uppercase font-black mb-4 text-white tracking-tight">
              Join The <span className="text-[#FACC15]">Marketplace</span>
            </Typography>
            <div className="w-24 h-1 bg-[#FACC15] mx-auto rounded-full"></div>
            <Typography variant="subtitle1" className="text-zinc-400 font-light mt-6 max-w-2xl mx-auto">Select whether you want to earn money from your vehicle or launch an ad campaign.</Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {/* Fleet Card */}
            <Card className="flex flex-col items-center p-10 hover:-translate-y-4 transition-all duration-500 bg-[#121212] border-2 border-zinc-800 hover:border-[#FACC15] group shadow-xl">
              <div className="h-20 w-20 bg-[#050505] rounded-2xl flex items-center justify-center mb-6 border-2 border-zinc-800 group-hover:border-[#FACC15] transition-colors duration-500 group-hover:shadow-[0_0_20px_rgba(250,204,21,0.15)]">
                <DirectionsCarIcon sx={{ fontSize: 36, color: '#FACC15' }} />
              </div>
              <Typography variant="h4" className="mb-4 text-white uppercase font-black text-center">Vehicle Owners</Typography>
              <Typography className="text-zinc-400 text-center mb-8 text-base leading-relaxed flex-1">
                Monetize your daily commute. Whether it is a personal car, an auto-rickshaw, or a fleet of buses—get verified and start earning.
              </Typography>
              <Link href="/fleet-registration" style={{ textDecoration: 'none', width: '100%' }}>
                <Button variant="contained" fullWidth sx={{ py: 2, fontSize: '1rem', fontWeight: 700, bgcolor: '#FACC15', color: '#000' }}>
                  Register Vehicle
                </Button>
              </Link>
            </Card>

            {/* Advertiser Card */}
            <Card className="flex flex-col items-center p-10 hover:-translate-y-4 transition-all duration-500 bg-[#121212] border-2 border-zinc-800 hover:border-[#FACC15] group shadow-xl">
              <div className="h-20 w-20 bg-[#050505] rounded-2xl flex items-center justify-center mb-6 border-2 border-zinc-800 group-hover:border-[#FACC15] transition-colors duration-500 group-hover:shadow-[0_0_20px_rgba(250,204,21,0.15)]">
                <CampaignIcon sx={{ fontSize: 36, color: '#FACC15' }} />
              </div>
              <Typography variant="h4" className="mb-4 text-white uppercase font-black text-center">Advertisers</Typography>
              <Typography className="text-zinc-400 text-center mb-8 text-base leading-relaxed flex-1">
                Launch hyper-targeted campaigns. Browse active vehicles, select your preferred transit categories, and dispatch offers directly.
              </Typography>
              <Link href="/advertiser-registration" style={{ textDecoration: 'none', width: '100%' }}>
                <Button variant="outlined" fullWidth sx={{ 
                  py: 2, borderWidth: '2px', borderColor: '#FACC15', color: '#FACC15', fontSize: '1rem', fontWeight: 700,
                  '&:hover': { backgroundColor: 'rgba(250, 204, 21, 0.1)', borderColor: '#FACC15', borderWidth: '2px' }
                }}>
                  Create Campaign
                </Button>
              </Link>
            </Card>

            {/* Operations/Login Card */}
            <Card className="flex flex-col items-center p-10 hover:-translate-y-4 transition-all duration-500 bg-[#121212] border-2 border-zinc-800 hover:border-[#FACC15] group shadow-xl">
              <div className="h-20 w-20 bg-[#050505] rounded-2xl flex items-center justify-center mb-6 border-2 border-zinc-800 group-hover:border-[#FACC15] transition-colors duration-500 group-hover:shadow-[0_0_20px_rgba(250,204,21,0.15)]">
                <QueryStatsIcon sx={{ fontSize: 36, color: '#FACC15' }} />
              </div>
              <Typography variant="h4" className="mb-4 text-white uppercase font-black text-center">Portal Login</Typography>
              <Typography className="text-zinc-400 text-center mb-8 text-base leading-relaxed flex-1">
                Access your dashboard. Owners upload daily condition proofs; Advertisers monitor live GPS tracking and impression metrics.
              </Typography>
              <Link href="/login" style={{ textDecoration: 'none', width: '100%' }}>
                <Button variant="outlined" fullWidth sx={{ 
                  py: 2, color: '#FFFFFF', borderColor: '#555', borderWidth: '2px', fontSize: '1rem', fontWeight: 700,
                  '&:hover': { borderColor: '#FACC15', color: '#FACC15', backgroundColor: 'transparent', borderWidth: '2px' }
                }}>
                  Access Gateway
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-10 bg-[#050505] border-t border-zinc-900 text-center">
        <Typography variant="body2" sx={{ color: 'zinc.500' }}>
          &copy; {new Date().getFullYear()} FleetAd Network. Vehicle Advertising Marketplace.
        </Typography>
      </footer>
    </Box>
  );
}
