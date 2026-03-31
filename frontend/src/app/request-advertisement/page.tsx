'use client';

import React, { useState } from 'react';
import { Card, Typography, TextField, Button, Box, Divider, Select, MenuItem, FormControl, InputLabel, Alert, Snackbar } from '@mui/material';
import Link from 'next/link';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import CampaignIcon from '@mui/icons-material/Campaign';

export default function RequestAdvertisementPage() {
  const [formData, setFormData] = useState({
    contactName: '',
    mobileNumber: '',
    email: '',
    vehicleType: '',
    requirementDetails: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch('http://localhost:5000/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const result = await res.json();
      if (result.success) {
        setIsSuccess(true);
        setFormData({ contactName: '', mobileNumber: '', email: '', vehicleType: '', requirementDetails: '' });
      }
    } catch (error) {
      console.error('Submission error', error);
      alert('Failed to submit, please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex-1 flex flex-col items-center justify-center min-h-[90vh] p-6 text-white relative w-full overflow-hidden">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#FACC15] opacity-[0.03] rounded-full blur-[100px] -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#FACC15] opacity-[0.03] rounded-full blur-[100px] -z-10"></div>
      
      <div className="w-full max-w-md absolute top-8 left-8">
        <Link href="/" className="text-zinc-400 hover:text-[#FACC15] flex items-center transition-colors">
          <ChevronLeftIcon /> Back to Home
        </Link>
      </div>

      <Card className="w-full max-w-2xl p-10 bg-[#121212] border-zinc-800 z-10 relative overflow-visible my-12">
        <div className="absolute -top-[1px] left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-[#FACC15] to-transparent opacity-50"></div>
        
        <Box className="flex flex-col items-center text-center space-y-2 mb-10">
          <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-xl mb-4 flex items-center justify-center text-[#FACC15]">
             <CampaignIcon sx={{ fontSize: 32 }} />
          </div>
          <Typography variant="h3" className="uppercase font-black tracking-tight text-white mb-1">
            Request an <span className="text-[#FACC15]">Advertisement</span>
          </Typography>
          <Typography className="text-zinc-400 text-sm max-w-lg mx-auto mb-4">
            Submit your quick inquiry. Our team will contact you shortly to finalize your custom campaign.
          </Typography>
        </Box>

        <Snackbar 
          open={isSuccess} 
          autoHideDuration={6000} 
          onClose={() => setIsSuccess(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={() => setIsSuccess(false)} severity="success" variant="filled" sx={{ width: '100%', borderRadius: '12px' }}>
            Your inquiry has been successfully submitted! Our team will reach out soon.
          </Alert>
        </Snackbar>

        <form className="flex flex-col gap-6 w-full" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
            <TextField
              fullWidth
              label="Contact Name"
              variant="outlined"
              required
              value={formData.contactName}
              onChange={(e) => setFormData({...formData, contactName: e.target.value})}
              placeholder="e.g. John Doe / Brand Name"
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
            />
          </div>

          <TextField
            fullWidth
            label="Email Address"
            variant="outlined"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            placeholder="admin@brand.com"
          />

          <FormControl fullWidth required>
            <InputLabel>Preferred Vehicle Type</InputLabel>
            <Select 
              label="Preferred Vehicle Type" 
              value={formData.vehicleType}
              onChange={(e) => setFormData({...formData, vehicleType: e.target.value})}
            >
              <MenuItem value="Mixed Fleet (Auto, Car, Bus)">Mixed Fleet (Auto, Car, Bus)</MenuItem>
              <MenuItem value="Passenger Transport Only">Passenger Transport Only (Cabs, Buses)</MenuItem>
              <MenuItem value="Goods Carrier Only">Goods Carrier Only (Trucks, Tempos)</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Advertisement Requirement Details"
            variant="outlined"
            multiline
            rows={4}
            required
            value={formData.requirementDetails}
            onChange={(e) => setFormData({...formData, requirementDetails: e.target.value})}
            placeholder="Please detail your target location, target audience, duration of campaign..."
          />

          <Button 
            variant="contained" 
            fullWidth 
            size="large" 
            type="submit"
            disabled={isSubmitting}
            sx={{
              mt: 4,
              py: 2,
              fontSize: '1rem',
              fontWeight: 800,
              backgroundImage: 'linear-gradient(to right, #FACC15, #FDE047)',
              color: 'black',
            }}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Lead Inquiry'}
          </Button>
        </form>

        <Box className="mt-8 text-center space-y-4">
          <Divider sx={{ borderColor: '#333333', '&::before, &::after': { borderColor: '#333333' } }} />
          <Typography className="text-zinc-400 text-sm mt-6">
            Want to build a full campaign instantly?{' '}
            <Link href="/register" className="text-[#FACC15] hover:text-[#FDE047] hover:underline transition-colors uppercase font-bold text-xs tracking-wider">
              Register an Account
            </Link>
          </Typography>
        </Box>
      </Card>
    </main>
  );
}
