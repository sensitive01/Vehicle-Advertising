'use client';

import React, { useState } from 'react';
import { 
  TextField, Button, Select, MenuItem, FormControl, InputLabel, 
  Checkbox, FormControlLabel, FormLabel, Typography, Divider, Card
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';

export default function AdvertiserRegistrationForm() {
  const [duration, setDuration] = useState('');
  
  return (
    <div className="max-w-5xl mx-auto py-12 px-4 sm:px-0">
      <div className="mb-10 text-center">
        <Typography variant="h2" className="text-white mb-3">Advertiser Registration</Typography>
        <Typography className="text-zinc-400">Launch location-based mobile OOH campaigns across premium fleets.</Typography>
      </div>

      <Card className="p-8 sm:p-12 mb-8 bg-[#121212] border-zinc-800" elevation={0}>
        <form className="space-y-12">
          
          {/* General Details */}
          <section>
            <Typography variant="h4" className="text-white flex items-center" sx={{ mb: 5 }}>
              <BusinessIcon className="mr-3 text-[#FACC15]" />
              Corporate Profile
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8 bg-zinc-900/50 p-6 sm:p-8 rounded-2xl border border-zinc-800 mt-4">
              <TextField label="Registered Brand Name" fullWidth required />
              <TextField label="Industry Category" fullWidth required />
              <TextField label="HQ Location (City)" fullWidth required />
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <TextField label="Target Pincode Sector" className="flex-1" required />
                <TextField label="Effective Radius (KM)" type="number" className="w-full sm:w-32" required />
              </div>
            </div>
          </section>

          <Divider />

          {/* Vehicle Preferences */}
          <section>
            <Typography variant="h4" className="text-white flex items-center mt-2" sx={{ mb: 5 }}>
              <DirectionsCarIcon className="mr-3 text-[#FACC15]" />
              Campaign Targeting
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
              <div className="space-y-8">
                <FormControl fullWidth>
                  <InputLabel>Preferred Asset Class</InputLabel>
                  <Select label="Preferred Asset Class" defaultValue="">
                    <MenuItem value="Any">Mixed Fleet Delivery</MenuItem>
                    <MenuItem value="Passenger">Passenger Transport</MenuItem>
                    <MenuItem value="Goods">Commercial Goods Carrier</MenuItem>
                  </Select>
                </FormControl>
                
                <TextField label="Volume (Total Vehicles Required)" type="number" fullWidth required />

                <FormControl fullWidth>
                  <InputLabel>Contract Duration</InputLabel>
                  <Select value={duration} label="Contract Duration" onChange={(e) => setDuration(e.target.value)}>
                    <MenuItem value="1 month">30 Days Pilot</MenuItem>
                    <MenuItem value="3 months">1 Quarter</MenuItem>
                    <MenuItem value="6 months">Half Year</MenuItem>
                    <MenuItem value="1 year">Annual Partnership</MenuItem>
                  </Select>
                </FormControl>
              </div>

              <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 h-full">
                <FormLabel component="legend" className="font-bold text-white mb-4">Required Inventory Slots</FormLabel>
                <div className="flex flex-col gap-3">
                  <FormControlLabel control={<Checkbox size="small" />} label={<Typography className="text-zinc-300">Left Side Paneling</Typography>} />
                  <FormControlLabel control={<Checkbox size="small" />} label={<Typography className="text-zinc-300">Right Side Paneling</Typography>} />
                  <FormControlLabel control={<Checkbox size="small" />} label={<Typography className="text-zinc-300">Front Bonnet</Typography>} />
                  <FormControlLabel control={<Checkbox size="small" />} label={<Typography className="text-zinc-300">Rear Tailgate</Typography>} />
                  <FormControlLabel control={<Checkbox size="small" />} label={<Typography className="text-zinc-300">Roof Top Carrier</Typography>} />
                </div>
              </div>
            </div>
          </section>

          <Divider />

          {/* Billing Preview */}
          <section>
            <Typography variant="h4" className="text-white flex items-center mt-2" sx={{ mb: 5 }}>
              <MonetizationOnIcon className="mr-3 text-[#FACC15]" />
              Preliminary Cost Estimate
            </Typography>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
              <div className="bg-black/40 border-l-4 border-l-[#FACC15] p-6 rounded-r-xl border-y border-r border-zinc-800 shadow-sm">
                <Typography variant="h4" className="text-white font-bold text-lg" sx={{ mb: 4 }}>Capital Expenditures (CapEx)</Typography>
                <div className="space-y-3 text-sm text-zinc-400 font-medium">
                  <div className="flex justify-between items-center py-2 border-b border-zinc-800/50">
                    <span className="text-zinc-500">Design Adaptation</span> <span className="text-zinc-300 text-right">Quote Pending</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-zinc-800/50">
                    <span className="text-zinc-500">Vinyl Print & Mount</span> <span className="text-zinc-300 text-right">Quote Pending</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-zinc-800/50">
                    <span className="text-zinc-500">Integration Service</span> <span className="text-zinc-300 text-right">Quote Pending</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 text-base font-bold text-[#FACC15]">
                    <span>One-Time Total (+GST)</span> <span>Calculated after review</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-900 border-l-4 border-l-blue-500 p-6 rounded-r-xl shadow-sm text-slate-300">
                <Typography variant="h4" className="text-white font-bold text-lg" sx={{ mb: 4 }}>Operating Expenses (OpEx)</Typography>
                <div className="space-y-3 text-sm font-medium">
                  <div className="flex justify-between items-center py-2 border-b border-slate-800">
                    <span className="text-slate-400">Ad Rental Rate</span> <span className="text-white text-right">Avg ₹4.50 / km</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-800">
                    <span className="text-slate-400">Estimated Drive Dist.</span> <span className="text-white text-right">Derived Live Data</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-800">
                    <span className="text-slate-400">Contract Duration</span> <span className="text-white text-right">{duration || 'Not Set'}</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 text-base font-bold text-white">
                    <span>Monthly Total (+GST)</span> <span>Metric Driven</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="flex justify-end pt-8">
            <Button 
              variant="contained" 
              size="large" 
              endIcon={<ArrowRightAltIcon />}
              className="w-full sm:w-auto px-10 py-4"
            >
              Initialize Campaign Contract
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
