'use client';

import React, { useState } from 'react';
import { Card, Typography, TextField, Button, Box, Divider, Alert } from '@mui/material';
import Link from 'next/link';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import LoginIcon from '@mui/icons-material/Login';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      
      if (data.success) {
        const userRole = data.user.role || 'superadmin';
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', userRole);
        
        // Role-based Dynamic Routing
        if (userRole === 'superadmin' || userRole === 'SuperAdmin') {
          window.location.href = '/admin/dashboard';
        } else if (userRole === 'fleet') {
          // Check Profile Completion for Fleet
          if (!data.user.isProfileComplete) {
            window.location.href = '/fleet/complete-profile';
          } else {
            window.location.href = '/fleet/dashboard';
          }
        } else if (userRole === 'advertiser') {
          // Check Profile Completion for Advertiser
          if (!data.user.isProfileComplete) {
            window.location.href = '/advertiser/complete-profile';
          } else {
            window.location.href = '/advertiser/dashboard';
          }
        } else {
          window.location.href = '/';
        }
      } else {
        setErrorMsg(data.message || 'Invalid credentials.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Server connection failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex-1 flex flex-col items-center justify-center min-h-[90vh] p-6 text-white relative w-full overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#FACC15] opacity-[0.03] rounded-full blur-[100px] -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#FACC15] opacity-[0.03] rounded-full blur-[100px] -z-10"></div>
      
      <div className="w-full max-w-md absolute top-8 left-8">
        <Link href="/" className="text-zinc-400 hover:text-[#FACC15] flex items-center transition-colors">
          <ChevronLeftIcon /> Back to Home
        </Link>
      </div>

      <Card className="w-full max-w-lg p-10 bg-[#121212] border-zinc-800 z-10 relative overflow-visible">
        <div className="absolute -top-[1px] left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-[#FACC15] to-transparent opacity-50"></div>
        
        <Box className="flex flex-col items-center text-center space-y-2 mb-8">
          <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-xl mb-4 flex items-center justify-center text-[#FACC15]">
             <LoginIcon sx={{ fontSize: 32 }} />
          </div>
          <Typography variant="h3" className="uppercase font-black tracking-tight text-white mb-1">
            Access <span className="text-[#FACC15]">Portal</span>
          </Typography>
          <Typography className="text-zinc-400 text-sm">
            Sign in to manage your fleets, campaigns, and operations
          </Typography>
        </Box>

        {errorMsg && (
          <Alert severity="error" sx={{ mb: 4, borderRadius: '8px' }}>
            {errorMsg}
          </Alert>
        )}

        <form className="flex flex-col gap-5 w-full" onSubmit={handleLogin}>
          <TextField
            fullWidth
            label="Email Address"
            variant="outlined"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="admin@example.com"
          />

          <TextField
            fullWidth
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />

          <Button 
            variant="contained" 
            fullWidth 
            size="large" 
            type="submit"
            disabled={isLoading}
            sx={{
              mt: 2,
              py: 1.8,
              fontSize: '1rem',
              fontWeight: 800,
              backgroundImage: 'linear-gradient(to right, #FACC15, #FDE047)',
              color: 'black',
            }}
          >
            {isLoading ? 'VERIFYING...' : 'LOGIN'}
          </Button>
        </form>

        <Box className="mt-8 text-center space-y-4">
          <Divider sx={{ borderColor: '#333333', '&::before, &::after': { borderColor: '#333333' } }}>
            <Typography className="text-zinc-500 text-xs uppercase px-2">Secure Gateway</Typography>
          </Divider>
          
          <Typography className="text-zinc-400 text-sm mt-6">
            Need an account?{' '}
            <a href="/register" className="text-[#FACC15] hover:text-[#FDE047] hover:underline transition-colors uppercase font-bold text-xs tracking-wider">
              Register Here
            </a>
          </Typography>
        </Box>
      </Card>
    </main>
  );
}
