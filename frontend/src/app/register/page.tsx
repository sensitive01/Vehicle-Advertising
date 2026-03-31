'use client';

import React, { useState } from 'react';
import { Card, Typography, TextField, Button, Box, Divider, Select, MenuItem, FormControl, InputLabel, Alert } from '@mui/material';
import Link from 'next/link';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    email: '',
    accountType: '',
    password: '',
    confirmPassword: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      
      if (data.success) {
        setSuccessMsg('Account created! Redirecting to login...');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        setErrorMsg(data.message || 'Registration failed.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Server connection failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex-1 flex flex-col items-center justify-center min-h-screen py-12 px-6 text-white relative w-full overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#FACC15] opacity-[0.03] rounded-full blur-[100px] -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#FACC15] opacity-[0.03] rounded-full blur-[100px] -z-10"></div>
      
      <div className="w-full max-w-md absolute top-8 left-8">
        <Link href="/" className="text-zinc-400 hover:text-[#FACC15] flex items-center transition-colors">
          <ChevronLeftIcon /> Back to Home
        </Link>
      </div>

      <Card className="w-full max-w-lg p-10 bg-[#121212] border-zinc-800 z-10 relative overflow-visible my-12">
        <div className="absolute -top-[1px] left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-[#FACC15] to-transparent opacity-50"></div>
        
        <Box className="flex flex-col items-center text-center space-y-2 mb-8">
          <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-xl mb-4 flex items-center justify-center text-[#FACC15]">
             <AppRegistrationIcon sx={{ fontSize: 32 }} />
          </div>
          <Typography variant="h3" className="uppercase font-black tracking-tight text-white mb-1">
            Create <span className="text-[#FACC15]">Account</span>
          </Typography>
          <Typography className="text-zinc-400 text-sm">
            Sign up to register your fleets or launch your advertising campaigns
          </Typography>
        </Box>

        {errorMsg && (
          <Alert severity="error" sx={{ mb: 4, borderRadius: '8px' }}>
            {errorMsg}
          </Alert>
        )}

        {successMsg && (
          <Alert severity="success" sx={{ mb: 4, borderRadius: '8px' }}>
            {successMsg}
          </Alert>
        )}

        <form className="flex flex-col gap-5 w-full" onSubmit={handleRegister}>
          <TextField
            fullWidth
            label="Full Name"
            variant="outlined"
            type="text"
            required
            value={formData.fullName}
            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
            placeholder="John Doe"
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            fullWidth
            label="Mobile Number"
            variant="outlined"
            type="tel"
            required
            value={formData.mobileNumber}
            onChange={(e) => setFormData({...formData, mobileNumber: e.target.value})}
            placeholder="+91 9876543210"
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            fullWidth
            label="Email Address"
            variant="outlined"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            placeholder="admin@example.com"
            InputLabelProps={{ shrink: true }}
          />

          <FormControl fullWidth required>
            <InputLabel>Account Type</InputLabel>
            <Select 
              label="Account Type" 
              value={formData.accountType}
              onChange={(e) => setFormData({...formData, accountType: e.target.value})}
            >
              <MenuItem value="fleet">Fleet / Vehicle Owner</MenuItem>
              <MenuItem value="advertiser">Brand / Advertiser</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Password"
            variant="outlined"
            type="password"
            required
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            placeholder="••••••••"
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            fullWidth
            label="Confirm Password"
            variant="outlined"
            type="password"
            required
            value={formData.confirmPassword}
            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            placeholder="••••••••"
            InputLabelProps={{ shrink: true }}
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
            {isLoading ? 'CREATING...' : 'Create Account'}
          </Button>
        </form>

        <Box className="mt-8 text-center space-y-4">
          <Divider sx={{ borderColor: '#333333', '&::before, &::after': { borderColor: '#333333' } }}>
            <Typography className="text-zinc-500 text-xs uppercase px-2">Already Registered?</Typography>
          </Divider>
          
          <Typography className="text-zinc-400 text-sm mt-6">
            Have an account?{' '}
            <Link href="/login" className="text-[#FACC15] hover:text-[#FDE047] hover:underline transition-colors uppercase font-bold text-xs tracking-wider">
              Sign In Here
            </Link>
          </Typography>
        </Box>
      </Card>
    </main>
  );
}
