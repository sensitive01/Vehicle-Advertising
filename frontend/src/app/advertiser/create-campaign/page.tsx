'use client';
import React, { useState, useEffect } from 'react';
import { 
  Box, Container, Typography, Card, TextField, MenuItem, 
  Button, Divider, FormGroup, FormControlLabel, Checkbox, 
  CircularProgress, Grid, Stack, Paper, Tooltip, IconButton
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AddIcon from '@mui/icons-material/Add';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const AD_OPTIONS = ['Left doors', 'Right doors', 'front bonnet', 'Rear door', 'Roof carrier handles'];
const VEHICLE_TYPES = ['Auto', 'Car', 'TT', 'Bus', 'Mini truck', 'Truck', 'Container'];

export default function CreateCampaignPage() {
  const [loading, setLoading] = useState(false);
  const [calcLoading, setCalcLoading] = useState(false);
  const [estimate, setEstimate] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    campaignTitle: '',
    vehicleCategory: 'Passenger' as 'Passenger' | 'Goods',
    vehicleTypes: [] as string[],
    adPlacements: [] as string[],
    minVehicles: 1,
    duration: '3 months' as '3 months' | '6 months' | '1 year',
    operatingLocations: [] as string[],
    locationInput: '',
    targetCenter: { pin: '', radius: 5, address: '' },
  });

  useEffect(() => {
    if (formData.vehicleTypes.length > 0 && formData.minVehicles > 0) {
      calculateEstimate();
    }
  }, [formData.vehicleTypes, formData.minVehicles, formData.duration]);

  const calculateEstimate = async () => {
    setCalcLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/campaigns/calculate-estimate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          vehicleTypes: formData.vehicleTypes,
          numVehicles: formData.minVehicles,
          durationMonths: parseInt(formData.duration)
        })
      });
      const data = await res.json();
      if (data.success) {
        setEstimate(data.breakdown);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCalcLoading(false);
    }
  };

  const handleToggle = (list: string[], item: string, field: string) => {
    const newList = list.includes(item) ? list.filter(i => i !== item) : [...list, item];
    setFormData({ ...formData, [field]: newList });
  };

  const addLocation = () => {
    if (formData.locationInput.trim()) {
      setFormData({
        ...formData,
        operatingLocations: [...formData.operatingLocations, formData.locationInput.trim()],
        locationInput: ''
      });
    }
  };

  const removeLocation = (index: number) => {
    const newList = [...formData.operatingLocations];
    newList.splice(index, 1);
    setFormData({ ...formData, operatingLocations: newList });
  };

  const handleSubmit = async (status: string = 'Pending Approval') => {
    if (!formData.campaignTitle || formData.vehicleTypes.length === 0) {
      alert('Please enter a title and select at least one vehicle type');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const payload = {
        ...formData,
        status,
        pricing: estimate ? { ...estimate } : {}
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/campaigns/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        window.location.href = '/advertiser/dashboard';
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert('Error creating campaign');
    } finally {
      setLoading(false);
    }
  };

  const fieldStyle = {
    '& .MuiOutlinedInput-root': {
      bgcolor: '#1E1E1E', '& fieldset': { borderColor: '#333' },
      '&:hover fieldset': { borderColor: '#444' }, '&.Mui-focused fieldset': { borderColor: '#FACC15' },
      color: 'white', borderRadius: 2
    },
    '& .MuiInputLabel-root': { color: '#A1A1AA' },
    '& .MuiInputBase-input': { p: '12px 14px' }
  };

  return (
    <Box sx={{ minHeight: '100vh', pb: 10, bgcolor: 'transparent', color: 'white' }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 5 }}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1 }}>
              Lauch <span style={{ color: '#FACC15' }}>Campaign</span>
            </Typography>
            <Typography variant="body1" sx={{ color: 'zinc.500', mt: 1 }}>Configure your ad requirements and get instant price estimates.</Typography>
          </Box>
          <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
            <Button onClick={() => handleSubmit('Draft')} disabled={loading} sx={{ color: 'zinc.500', fontWeight: 800, px: 3 }}>SAVE AS DRAFT</Button>
            <Button variant="contained" onClick={() => handleSubmit()} disabled={loading} sx={{ bgcolor: '#FACC15', color: 'black', fontWeight: 900, px: 6, py: 1.5, borderRadius: 1, '&:hover': { bgcolor: '#FDE047' } }}>
               {loading ? <CircularProgress size={24} color="inherit" /> : 'SUBMIT REQUEST'}
            </Button>
          </Stack>
        </Box>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <Card sx={{ bgcolor: '#121212', border: '1px solid #333', borderRadius: 2, p: 4 }}>
              <Stack spacing={5}>
                {/* Basic Details */}
                <Box>
                  <Typography variant="body2" sx={{ color: '#FACC15', fontWeight: 900, mb: 3, textTransform: 'uppercase', letterSpacing: 1.5 }}>Step 1: Campaign Identity</Typography>
                  <TextField fullWidth label="Campaign Title" placeholder="e.g. Summer Sale 2026 - Kochi" value={formData.campaignTitle} onChange={(e) => setFormData({...formData, campaignTitle: e.target.value})} sx={fieldStyle} InputLabelProps={{ shrink: true }} />
                </Box>

                <Divider sx={{ borderColor: '#222' }} />

                {/* Fleet Selection */}
                <Box>
                   <Typography variant="body2" sx={{ color: '#FACC15', fontWeight: 900, mb: 3, textTransform: 'uppercase', letterSpacing: 1.5 }}>Step 2: Fleet Targeting</Typography>
                   <Grid container spacing={3}>
                      <Grid size={{ xs: 12, md: 6 }}>
                         <Typography variant="caption" sx={{ color: 'zinc.500', display: 'block', mb: 1.5, fontWeight: 700 }}>VEHICLE CATEGORY</Typography>
                         <Stack direction="row" spacing={2}>
                            {['Passenger', 'Goods'].map((cat: any) => (
                               <Button key={cat} fullWidth onClick={() => setFormData({...formData, vehicleCategory: cat})} sx={{ py: 1.5, bgcolor: formData.vehicleCategory === cat ? 'rgba(250, 204, 21, 0.1)' : '#1E1E1E', color: formData.vehicleCategory === cat ? '#FACC15' : 'zinc.500', border: '1px solid', borderColor: formData.vehicleCategory === cat ? '#FACC15' : '#333', fontWeight: 800, borderRadius: 1 }}>{cat.toUpperCase()}</Button>
                            ))}
                         </Stack>
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                         <Typography variant="caption" sx={{ color: 'zinc.500', display: 'block', mb: 1.5, fontWeight: 700 }}>NUMBER OF VEHICLES</Typography>
                         <TextField fullWidth type="number" value={formData.minVehicles} onChange={(e) => setFormData({...formData, minVehicles: Number(e.target.value)})} sx={fieldStyle} />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                         <Typography variant="caption" sx={{ color: 'zinc.500', display: 'block', mb: 1.5, fontWeight: 700 }}>SELECT VEHICLE TYPES</Typography>
                         <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                            {VEHICLE_TYPES.map(type => (
                               <Paper key={type} onClick={() => handleToggle(formData.vehicleTypes, type, 'vehicleTypes')} sx={{ px: 3, py: 1.2, bgcolor: formData.vehicleTypes.includes(type) ? 'rgba(250, 204, 21, 0.1)' : '#1E1E1E', color: formData.vehicleTypes.includes(type) ? '#FACC15' : 'zinc.400', border: '1px solid', borderColor: formData.vehicleTypes.includes(type) ? '#FACC15' : '#333', borderRadius: 1, cursor: 'pointer', transition: '0.2s', fontWeight: 700, '&:hover': { borderColor: '#FACC15' } }}>{type}</Paper>
                            ))}
                         </Box>
                      </Grid>
                   </Grid>
                </Box>

                <Divider sx={{ borderColor: '#222' }} />

                {/* Geo-Targeting */}
                <Box>
                   <Typography variant="body2" sx={{ color: '#FACC15', fontWeight: 900, mb: 3, textTransform: 'uppercase', letterSpacing: 1.5 }}>Step 3: Geo-Targeting</Typography>
                   <Grid container spacing={3}>
                      <Grid size={{ xs: 12, md: 8 }}>
                         <TextField fullWidth placeholder="Enter city name and press Add" value={formData.locationInput} onChange={(e) => setFormData({...formData, locationInput: e.target.value})} onKeyPress={(e) => e.key === 'Enter' && addLocation()} sx={fieldStyle} InputProps={{ endAdornment: <Button onClick={addLocation} sx={{ color: '#FACC15', fontWeight: 800 }}>ADD</Button> }} />
                         <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                            {formData.operatingLocations.map((loc, i) => (
                               <Paper key={i} sx={{ px: 2, py: 0.8, bgcolor: '#1E1E1E', border: '1px solid #333', borderRadius: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>{loc}</Typography>
                                  <IconButton size="small" onClick={() => removeLocation(i)} sx={{ color: '#EF4444', p: 0.2 }}><AddIcon sx={{ transform: 'rotate(45deg)', fontSize: 18 }} /></IconButton>
                               </Paper>
                            ))}
                         </Box>
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                         <TextField select fullWidth label="Campaign Duration" value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value as any})} sx={fieldStyle}>
                            <MenuItem value="3 months">3 MONTHS</MenuItem>
                            <MenuItem value="6 months">6 MONTHS</MenuItem>
                            <MenuItem value="1 year">1 YEAR</MenuItem>
                         </TextField>
                      </Grid>
                   </Grid>
                </Box>

                <Divider sx={{ borderColor: '#222' }} />

                {/* Placements */}
                <Box>
                   <Typography variant="body2" sx={{ color: '#FACC15', fontWeight: 900, mb: 3, textTransform: 'uppercase', letterSpacing: 1.5 }}>Step 4: Ad Placement</Typography>
                   <FormGroup sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
                      {AD_OPTIONS.map(opt => (
                        <FormControlLabel key={opt} control={<Checkbox checked={formData.adPlacements.includes(opt)} onChange={() => handleToggle(formData.adPlacements, opt, 'adPlacements')} sx={{ color: '#333', '&.Mui-checked': { color: '#FACC15' } }} />} label={<Typography variant="body2" sx={{ color: 'zinc.300', fontWeight: 600 }}>{opt}</Typography>} />
                      ))}
                   </FormGroup>
                </Box>
              </Stack>
            </Card>
          </Grid>

          {/* Pricing Sidebar */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Box sx={{ position: 'sticky', top: 100 }}>
              <Card sx={{ bgcolor: '#121212', border: '2px solid #FACC15', borderRadius: 2, p: 4, boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 900, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  COST <span style={{ color: '#FACC15' }}>ESTIMATION</span>
                  {calcLoading && <CircularProgress size={16} sx={{ color: '#FACC15', ml: 2 }} />}
                </Typography>

                <Stack spacing={2.5}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ color: 'zinc.500', fontWeight: 600 }}>Design Charges</Typography>
                    <Typography sx={{ color: 'white', fontWeight: 800 }}>₹ {estimate?.designCharges?.toLocaleString() || 0}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ color: 'zinc.500', fontWeight: 600 }}>Printing Charges</Typography>
                    <Typography sx={{ color: 'white', fontWeight: 800 }}>₹ {estimate?.printingCharges?.toLocaleString() || 0}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ color: 'zinc.500', fontWeight: 600 }}>Installation & Ops</Typography>
                    <Typography sx={{ color: 'white', fontWeight: 800 }}>₹ {((estimate?.installationCharges || 0) + (estimate?.transportCharges || 0)).toLocaleString()}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ color: 'zinc.500', fontWeight: 600 }}>Service Fee ({estimate?.serviceChargePercentage || 0}%)</Typography>
                    <Typography sx={{ color: 'white', fontWeight: 800 }}>₹ {estimate?.serviceCharges?.toLocaleString() || 0}</Typography>
                  </Box>
                  <Divider sx={{ borderColor: '#222' }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ color: 'zinc.500', fontWeight: 600 }}>GST ({estimate?.gstPercentage || 18}%)</Typography>
                    <Typography sx={{ color: 'white', fontWeight: 800 }}>₹ {estimate?.gst?.toLocaleString() || 0}</Typography>
                  </Box>

                  <Box sx={{ mt: 3, pt: 3, borderTop: '2px dashed #222' }}>
                    <Typography variant="body2" sx={{ color: '#FACC15', fontWeight: 900, mb: 1 }}>ESTIMATED TOTAL BUDGET</Typography>
                    <Typography variant="h3" sx={{ color: 'white', fontWeight: 900 }}>₹ {estimate?.estimatedTotal?.toLocaleString() || 0}</Typography>
                    <Typography variant="caption" sx={{ color: 'zinc.500', mt: 1, display: 'block' }}>*One-time costs for setup and distribution.</Typography>
                  </Box>

                  <Box sx={{ mt: 4, p: 2.5, bgcolor: '#1A1A1A', borderRadius: 1.5, border: '1px solid #333' }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                       <AccountBalanceWalletIcon sx={{ color: '#4ADE80' }} />
                       <Box>
                          <Typography variant="body2" sx={{ color: 'zinc.500', fontWeight: 800 }}>RENTAL RATE (PER KM)</Typography>
                          <Typography variant="h6" sx={{ color: '#4ADE80', fontWeight: 900 }}>₹ {estimate?.rentalPerKm || 0}</Typography>
                       </Box>
                    </Stack>
                  </Box>

                  <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                     <InfoOutlinedIcon sx={{ color: 'zinc.600', fontSize: 16 }} />
                     <Typography sx={{ color: 'zinc.600', fontSize: '0.75rem', lineHeight: 1.4 }}>
                        Final costs may vary based on exact vehicle selection and printing material quality.
                     </Typography>
                  </Stack>
                </Stack>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
