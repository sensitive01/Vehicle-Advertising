'use client';
import React, { useState } from 'react';
import { 
  Box, Container, Typography, Card, TextField, MenuItem, 
  Button, Divider, FormGroup, FormControlLabel, Checkbox, 
  CircularProgress, Grid
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';

const AD_OPTIONS = ['Left doors', 'Right doors', 'front bonnet', 'Rear door', 'Roof carrier handles'];

export default function AdvertiserCompleteProfile() {
  const [loading, setLoading] = useState(false);
  
  // Data State - Allowing string for empty input handling
  const [formData, setFormData] = useState({
    brandName: '',
    businessCategory: '',
    operatingLocation: '',
    targetVehicleType: 'Passenger',
    adOptions: [] as string[],
    numberOfVehicles: '' as string | number, 
    averageRunningLocation: { pin: '', radius: 5 },
    duration: '6 months',
    rentalChargesPerKm: '' as string | number, 
    averageKm: '' as string | number, 
    designCharges: '' as string | number, 
    printingCharges: '' as string | number, 
    serviceCharges: '' as string | number, 
    gst: 18 as string | number
  });

  const handleToggleAdOption = (opt: string) => {
    setFormData(prev => ({
      ...prev,
      adOptions: prev.adOptions.includes(opt) 
        ? prev.adOptions.filter(o => o !== opt) 
        : [...prev.adOptions, opt]
    }));
  };

  const handleNumChange = (field: string, val: string) => {
    // Allows empty string, otherwise converts to number
    setFormData(prev => ({ ...prev, [field]: val === '' ? '' : Number(val) }));
  };

  const handleSubmit = async () => {
    if (!formData.brandName || !formData.businessCategory) {
      alert('Please fill out Brand Name and Category');
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      // Convert empty strings to 0 for database
      const payload = {
         ...formData,
         numberOfVehicles: Number(formData.numberOfVehicles) || 1,
         rentalChargesPerKm: Number(formData.rentalChargesPerKm) || 0,
         averageKm: Number(formData.averageKm) || 0,
         designCharges: Number(formData.designCharges) || 0,
         printingCharges: Number(formData.printingCharges) || 0,
         serviceCharges: Number(formData.serviceCharges) || 0,
         gst: Number(formData.gst) || 18,
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/advertiser/complete-profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        window.location.href = '/advertiser/dashboard';
      } else {
        alert(data.message || 'Submission failed');
      }
    } catch (err) { 
      console.error(err);
      alert('Could not reach server. Please check your connection.');
    } finally { setLoading(false); }
  };

  const fieldStyle = {
    '& .MuiOutlinedInput-root': {
      bgcolor: '#1E1E1E', '& fieldset': { borderColor: '#333' },
      '&:hover fieldset': { borderColor: '#444' },
      '&.Mui-focused fieldset': { borderColor: '#FACC15' },
      color: 'white', borderRadius: 2
    },
    '& .MuiInputLabel-root': { color: '#A1A1AA' },
    '& .MuiInputBase-input': { p: '12px 14px' }
  };

  const GroupLabel = ({ children }: { children: React.ReactNode }) => (
    <Typography variant="body2" sx={{ color: '#FACC15', fontWeight: 900, mb: 1.5, mt: 1, textTransform: 'uppercase', letterSpacing: 1.5 }}>
      {children}
    </Typography>
  );

  return (
    <Box sx={{ minHeight: '100vh', pb: 10, bgcolor: 'transparent', color: 'white' }}>
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1 }}>Campaign <span style={{ color: '#FACC15' }}>Builder</span></Typography>
          <Typography variant="body1" sx={{ color: 'zinc.500', mt: 1 }}>Define your brand and ad requirements to find perfectly matched fleets.</Typography>
        </Box>

        <Card sx={{ bgcolor: '#121212', border: '1px solid #333', borderRadius: 6, p: { xs: 3, md: 5 } }}>
           
           <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
             
             {/* Brand Info */}
             <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                   <BusinessIcon sx={{ color: '#FACC15' }} />
                   <GroupLabel>Business & Brand Identity</GroupLabel>
                </Box>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField fullWidth label="Brand Name" placeholder="e.g. Nike" value={formData.brandName} onChange={(e) => setFormData({...formData, brandName: e.target.value})} sx={fieldStyle} InputLabelProps={{ shrink: true }} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField fullWidth label="Business Category" placeholder="e.g. Footwear" value={formData.businessCategory} onChange={(e) => setFormData({...formData, businessCategory: e.target.value})} sx={fieldStyle} InputLabelProps={{ shrink: true }} />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField fullWidth label="Operating Location" placeholder="Where do you want to advertise? (e.g. Kochi, Kerala)" value={formData.operatingLocation} onChange={(e) => setFormData({...formData, operatingLocation: e.target.value})} sx={fieldStyle} InputLabelProps={{ shrink: true }} />
                  </Grid>
                </Grid>
             </Box>

             <Divider sx={{ borderColor: '#222' }} />

             {/* Ad Targeting */}
             <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                   <GpsFixedIcon sx={{ color: '#FACC15' }} />
                   <GroupLabel>Fleet Targeting & Reach</GroupLabel>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                   <Grid container spacing={3}>
                      <Grid size={{ xs: 12, md: 6 }}>
                         <Typography variant="caption" sx={{ color: 'zinc.500', display: 'block', mb: 1, fontWeight: 700 }}>PREFERED VEHICLE CATEGORY</Typography>
                         <TextField select fullWidth value={formData.targetVehicleType} onChange={(e) => setFormData({...formData, targetVehicleType: e.target.value})} sx={fieldStyle}>
                            <MenuItem value="Passenger">Passenger Fleet (Cars/Jeeps)</MenuItem>
                            <MenuItem value="Goods">Goods Transport (Trucks)</MenuItem>
                            <MenuItem value="Auto Rickshaw">Auto Rickshaw Only</MenuItem>
                            <MenuItem value="Bus">Public Transport (Buses)</MenuItem>
                         </TextField>
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                         <Typography variant="caption" sx={{ color: 'zinc.500', display: 'block', mb: 1, fontWeight: 700 }}>NUMBER OF VEHICLES NEEDED</Typography>
                         <TextField fullWidth type="number" placeholder="Enter quantity" value={formData.numberOfVehicles} onChange={(e) => handleNumChange('numberOfVehicles', e.target.value)} sx={fieldStyle} />
                      </Grid>
                   </Grid>

                   <Box>
                      <Typography variant="caption" sx={{ color: 'zinc.500', display: 'block', mb: 1, fontWeight: 700 }}>AD PLACEMENT OPTIONS</Typography>
                      <FormGroup sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 1 }}>
                         {AD_OPTIONS.map(opt => (
                           <FormControlLabel key={opt} control={<Checkbox checked={formData.adOptions.includes(opt)} onChange={() => handleToggleAdOption(opt)} sx={{ color: '#333', '&.Mui-checked': { color: '#FACC15' } }} />} label={<Typography variant="body2" sx={{ color: 'zinc.300' }}>{opt}</Typography>} />
                         ))}
                      </FormGroup>
                   </Box>

                   <Grid container spacing={3}>
                      <Grid size={{ xs: 12, md: 6 }}>
                         <Typography variant="caption" sx={{ color: 'zinc.500', display: 'block', mb: 1, fontWeight: 700 }}>TARGET CENTER (PINCODE)</Typography>
                         <TextField fullWidth placeholder="e.g. 682001" value={formData.averageRunningLocation.pin} onChange={(e) => setFormData({...formData, averageRunningLocation: {...formData.averageRunningLocation, pin: e.target.value}})} sx={fieldStyle} />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                         <Typography variant="caption" sx={{ color: 'zinc.500', display: 'block', mb: 1, fontWeight: 700 }}>OPERATING RADIUS</Typography>
                         <TextField select fullWidth value={formData.averageRunningLocation.radius} onChange={(e) => setFormData({...formData, averageRunningLocation: {...formData.averageRunningLocation, radius: Number(e.target.value)}})} sx={fieldStyle}>
                            {[5, 10, 20, 50, 100].map(v => <MenuItem key={v} value={v}>{v} KM Radius</MenuItem>)}
                         </TextField>
                      </Grid>
                   </Grid>
                </Box>
             </Box>

             <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                <Button variant="outlined" sx={{ flex: 1, py: 2, color: 'zinc.500', borderColor: '#333', fontWeight: 700, borderRadius: 3 }}>Save Draft</Button>
                <Button variant="contained" onClick={handleSubmit} disabled={loading} sx={{ flex: 2, py: 2, bgcolor: '#FACC15', color: 'black', fontWeight: 900, '&:hover': { bgcolor: '#FDE047' }, borderRadius: 3 }}>
                   {loading ? <CircularProgress size={24} color="inherit" /> : 'LAUNCH CAMPAIGN'}
                </Button>
             </Box>

           </Box>

        </Card>
      </Container>
    </Box>
  );
}
