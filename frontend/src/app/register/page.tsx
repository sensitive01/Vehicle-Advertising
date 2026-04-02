'use client';
import React, { useState, useEffect } from 'react';
import { 
  Card, Typography, TextField, Button, Box, Divider, 
  Select, MenuItem, FormControl, InputLabel, Alert, Stack,
  CircularProgress, Grid, InputAdornment
} from '@mui/material';
import Link from 'next/link';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    email: '',
    accountType: 'fleet',
    password: '',
    confirmPassword: ''
  });

  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendTimer > 0) {
      timer = setInterval(() => setResendTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const handleSendOtp = async () => {
    if (!formData.email) return setErrorMsg('Please enter an email address first');
    
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch(`${API_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      });
      
      // Safety check for non-JSON responses
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
         throw new Error('Server returned an invalid response (HTML). Is backend running?');
      }

      const data = await res.json();
      if (data.success) {
        setIsOtpSent(true);
        setResendTimer(60);
        setSuccessMsg('OTP sent to your email!');
      } else {
        setErrorMsg(data.message);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Connection failed';
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) return setErrorMsg('Please enter 6-digit OTP');
    
    setIsLoading(true);
    setErrorMsg('');
    try {
      const verifyRes = await fetch(`${API_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, otp })
      });
      const data = await verifyRes.json();

      if (data.success) {
        setIsEmailVerified(true);
        setSuccessMsg('Email verified successfully!');
      } else {
        setErrorMsg(data.message);
      }
    } catch (err: unknown) {
      setErrorMsg('Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEmailVerified) return setErrorMsg('Please verify your email first');
    if (formData.password !== formData.confirmPassword) return setErrorMsg('Passwords do not match');

    setIsLoading(true);
    setErrorMsg('');
    try {
      const regRes = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const regData = await regRes.json();

      if (regData.success) {
        setSuccessMsg('Account created successfully! Redirecting...');
        setTimeout(() => window.location.href = '/login', 2000);
      } else {
        setErrorMsg(regData.message);
      }
    } catch (err: unknown) {
      setErrorMsg('Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const fieldStyle = {
    '& .MuiOutlinedInput-root': {
      bgcolor: '#1A1A1A', '& fieldset': { borderColor: '#333' },
      '&:hover fieldset': { borderColor: '#444' }, '&.Mui-focused fieldset': { borderColor: '#FACC15' },
      color: 'white', borderRadius: 3
    },
    '& .MuiInputLabel-root': { color: '#888' },
    '& .MuiInputBase-input': { p: '14px 16px' }
  };

  return (
    <main className="flex-0 flex flex-col items-center justify-center min-h-screen py-12 px-6 text-white relative w-full overflow-hidden bg-[#0A0A0A]">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FACC15] opacity-[0.05] rounded-full blur-[120px] -z-10"></div>
      
      <div className="w-full max-w-md absolute top-8 left-8">
        <Link href="/" className="text-zinc-400 hover:text-[#FACC15] flex items-center transition-colors font-bold text-sm">
          <ChevronLeftIcon /> BACK TO HOME
        </Link>
      </div>

      <Card sx={{ width: '100%', maxWidth: '500px', p: 5, bgcolor: '#121212', border: '1px solid #222', borderRadius: 6, zIndex: 10 }}>
        
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-2xl mx-auto mb-4 flex items-center justify-center text-[#FACC15]">
            <AppRegistrationIcon sx={{ fontSize: 32 }} />
          </div>
          <Typography variant="h4" sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1 }}>
            Create <span style={{ color: '#FACC15' }}>Account</span>
          </Typography>
          <Typography variant="body2" sx={{ color: 'zinc.500', mt: 1 }}>Complete your details and verify your email.</Typography>
        </Box>

        {errorMsg && <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>{errorMsg}</Alert>}
        {successMsg && <Alert severity="success" sx={{ mb: 4, borderRadius: 2 }}>{successMsg}</Alert>}

        <form onSubmit={handleRegister}>
          <Stack spacing={2.5}>
            <TextField fullWidth label="Full Name" required value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} sx={fieldStyle} InputLabelProps={{ shrink: true }} />
            
            <TextField 
              fullWidth 
              label="Email Address" 
              type="email" 
              required 
              disabled={isEmailVerified}
              value={formData.email} 
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
              sx={fieldStyle} 
              InputLabelProps={{ shrink: true }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                     {isEmailVerified ? (
                        <CheckCircleIcon sx={{ color: '#4ADE80' }} />
                     ) : (
                        <Button 
                          onClick={handleSendOtp} 
                          disabled={!formData.email || isLoading}
                          sx={{ color: '#FACC15', fontWeight: 900, fontSize: '0.75rem', px: 2, bgcolor: 'rgba(250, 204, 21, 0.05)', borderRadius: 2 }}
                        >
                          {resendTimer > 0 ? `${resendTimer}s` : 'SEND OTP'}
                        </Button>
                     )}
                  </InputAdornment>
                )
              }}
            />

            {isOtpSent && !isEmailVerified && (
               <Box sx={{ p: 2, bgcolor: '#1A1A1A', borderRadius: 3, border: '1px solid #333' }}>
                  <Typography variant="caption" sx={{ color: 'zinc.500', mb: 1, display: 'block', textAlign: 'center' }}>ENTER OTP SENT TO EMAIL</Typography>
                  <Stack direction="row" spacing={1}>
                     <TextField 
                        fullWidth 
                        placeholder="000000" 
                        value={otp} 
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} 
                        sx={fieldStyle}
                        inputProps={{ maxLength: 6, style: { textAlign: 'center', letterSpacing: '4px', fontWeight: 900 } }}
                     />
                     <Button 
                        variant="contained" 
                        onClick={handleVerifyOtp} 
                        disabled={isLoading || otp.length !== 6}
                        sx={{ bgcolor: '#FACC15', color: 'black', fontWeight: 800, px: 3, '&:hover': { bgcolor: '#FDE047' } }}
                     >
                        VERIFY
                     </Button>
                  </Stack>
               </Box>
            )}

            <Grid container spacing={2.5}>
               <Grid size={{ xs: 12, md: 6 }}>
                  <TextField fullWidth label="Mobile Number" required value={formData.mobileNumber} onChange={(e) => setFormData({...formData, mobileNumber: e.target.value})} sx={fieldStyle} InputLabelProps={{ shrink: true }} />
               </Grid>
               <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth sx={fieldStyle}>
                    <InputLabel shrink>Account Type</InputLabel>
                    <Select value={formData.accountType} onChange={(e) => setFormData({...formData, accountType: e.target.value as string})} displayEmpty>
                      <MenuItem value="fleet">Fleet Owner</MenuItem>
                      <MenuItem value="advertiser">Brand / Advertiser</MenuItem>
                    </Select>
                  </FormControl>
               </Grid>
            </Grid>

            <Grid container spacing={2}>
               <Grid size={{ xs: 6 }}>
                  <TextField fullWidth label="Password" type="password" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} sx={fieldStyle} InputLabelProps={{ shrink: true }} />
               </Grid>
               <Grid size={{ xs: 6 }}>
                  <TextField fullWidth label="Confirm" type="password" required value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} sx={fieldStyle} InputLabelProps={{ shrink: true }} />
               </Grid>
            </Grid>

            <Button 
               fullWidth 
               type="submit" 
               variant="contained" 
               disabled={isLoading || !isEmailVerified} 
               sx={{ bgcolor: '#FACC15', color: 'black', fontWeight: 900, py: 2, borderRadius: 3, '&:hover': { bgcolor: '#FDE047' }, mt: 2, opacity: !isEmailVerified ? 0.5 : 1 }}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'CREATE MY ACCOUNT'}
            </Button>
          </Stack>
        </form>

        <Box sx={{ mt: 5, textAlign: 'center' }}>
          <Divider sx={{ borderColor: '#222', mb: 3 }} />
          <Typography sx={{ color: 'zinc-500', fontSize: '0.8rem' }}>
            Already have an account? <Link href="/login" style={{ color: '#FACC15', fontWeight: 900, textDecoration: 'none' }}>SIGN IN</Link>
          </Typography>
        </Box>
      </Card>
    </main>
  );
}
