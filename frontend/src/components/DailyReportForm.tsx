'use client';

import React, { useState } from 'react';
import { 
  TextField, Button, RadioGroup, Radio, FormControlLabel, FormLabel,
  Card, Typography, Divider, Alert, Box
} from '@mui/material';
import TimelineIcon from '@mui/icons-material/Timeline';
import BuildIcon from '@mui/icons-material/Build';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

export default function DailyReportForm() {
  const [isRunning, setIsRunning] = useState('yes');
  const [adDamage, setAdDamage] = useState('no');
  const [inService, setInService] = useState('no');

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-0">
      <div className="mb-10 text-center">
        <Typography variant="h2" className="text-white mb-3">Daily Operations Log</Typography>
        <Typography className="text-zinc-400">Record daily distance metrics and asset conditions to authorize billing.</Typography>
      </div>

      <Card className="p-8 sm:p-12 mb-8 bg-[#121212] border-zinc-800" elevation={0}>
        <form className="space-y-10 flex flex-col">
          
          <section className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
            <Typography variant="h4" className="text-white flex items-center text-lg" sx={{ mb: 4 }}>
              <TimelineIcon className="mr-3 text-[#FACC15]" /> Driver Identification
            </Typography>
            <TextField label="Assigned Operator (Driver Name)" fullWidth required className="mt-2" />
          </section>
          
          <Divider />

          <section>
            <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-sm mb-6">
              <FormLabel component="legend" className="font-bold text-white text-lg mb-4">Operational Status Today</FormLabel>
              <RadioGroup row value={isRunning} onChange={(e) => setIsRunning(e.target.value)} className="gap-8">
                <FormControlLabel value="yes" control={<Radio color="primary" />} label={<Typography className="font-medium text-zinc-300">Active Duty</Typography>} />
                <FormControlLabel value="no" control={<Radio color="error" />} label={<Typography className="font-medium text-zinc-300">Offline / Standby</Typography>} />
              </RadioGroup>
            </div>

            {isRunning === 'no' ? (
              <div className="bg-red-900/20 p-6 rounded-2xl border border-red-900/50">
                 <Typography className="text-red-400 font-medium mb-3">Please specify reason for operational halt</Typography>
                 <TextField 
                  label="Downtime Justification" 
                  multiline rows={3} 
                  fullWidth 
                  required 
                 />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-zinc-900/40 p-8 rounded-2xl border border-zinc-800">
                <div className="space-y-6">
                  <Box>
                    <Typography className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-2">System Sync</Typography>
                    <TextField label="Previous Close KM (Auto-fetched)" value="12540" fullWidth disabled sx={{backgroundColor: '#1E1E1E'}} />
                  </Box>

                  <Box>
                    <Typography className="text-sm font-bold text-zinc-300 mb-2">Opening Odometer Verification</Typography>
                    <div className="border border-zinc-800 bg-[#121212] rounded-xl p-3">
                      <input type="file" className="w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-zinc-800 file:text-zinc-300 hover:file:bg-zinc-700 transition-colors cursor-pointer" />
                    </div>
                  </Box>
                </div>
                
                <div className="space-y-6">
                  <Box>
                    <Typography className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-2">Current Log</Typography>
                    <TextField label="Closing Distance (KM)" type="number" fullWidth required />
                  </Box>

                  <Box>
                    <Typography className="text-sm font-bold text-zinc-300 mb-2">Closing Odometer Verification</Typography>
                    <div className="border border-zinc-800 bg-[#121212] rounded-xl p-3">
                      <input type="file" className="w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-zinc-800 file:text-zinc-300 hover:file:bg-zinc-700 transition-colors cursor-pointer" />
                    </div>
                  </Box>
                </div>
              </div>
            )}
          </section>

          <Divider />

          {/* Condition Reports */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 shadow-sm">
              <Typography variant="h4" className="text-white flex items-center text-lg" sx={{ mb: 4 }}>
                <CheckCircleOutlineIcon className="mr-3 text-[#FACC15]" /> Advertising Condition
              </Typography>
              <FormLabel component="legend" className="font-bold text-zinc-400 text-sm mb-2 mt-2">Did the vehicle sustain ad damage?</FormLabel>
              <RadioGroup row value={adDamage} onChange={(e) => setAdDamage(e.target.value)}>
                <FormControlLabel value="yes" control={<Radio color="error" />} label={<Typography className="text-zinc-200">Yes, damage incurred</Typography>} />
                <FormControlLabel value="no" control={<Radio color="primary" />} label={<Typography className="text-zinc-200">No, intact</Typography>} />
              </RadioGroup>
              
              {adDamage === 'yes' && (
                <div className="mt-4 space-y-4">
                  <Alert severity="warning" className="text-sm rounded-lg bg-orange-900/20 text-orange-200 border border-orange-900/50">
                    Failing to upload proof may suspend campaign payment.
                  </Alert>
                  <TextField label="Describe Damage Extent" size="small" fullWidth required />
                  <div className="border border-zinc-800 bg-[#121212] rounded-lg p-2">
                    <input type="file" className="w-full text-xs text-zinc-500 file:rounded file:border-0 file:bg-zinc-800 file:text-zinc-300" />
                  </div>
                </div>
              )}
            </div>

            <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 shadow-sm">
              <Typography variant="h4" className="text-white flex items-center text-lg" sx={{ mb: 4 }}>
                <BuildIcon className="mr-3 text-[#FACC15]" /> Maintenance Status
              </Typography>
              <FormLabel component="legend" className="font-bold text-zinc-400 text-sm mb-2 mt-2">Does the asset require grounding for service?</FormLabel>
              <RadioGroup row value={inService} onChange={(e) => setInService(e.target.value)}>
                <FormControlLabel value="yes" control={<Radio color="error" />} label={<Typography className="text-zinc-200">Yes, mark unoperatable</Typography>} />
                <FormControlLabel value="no" control={<Radio color="primary" />} label={<Typography className="text-zinc-200">No, functional</Typography>} />
              </RadioGroup>
              
              {inService === 'yes' && (
                <div className="mt-4">
                  <TextField label="Service Center Details & ETA" size="small" fullWidth required />
                </div>
              )}
            </div>
          </section>

          <div className="pt-6">
            <Button variant="contained" size="large" fullWidth className="py-4 text-lg">
              Authorized Submission
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
