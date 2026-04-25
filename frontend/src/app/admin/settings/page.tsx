'use client';
import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Card, TextField, Button, Grid, 
  Alert, CircularProgress, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

interface PricingItem {
  type: string;
  charge: number;
}

interface Settings {
  defaultDesignCharge: number;
  defaultGstPercentage: number;
  serviceChargePercentage: number;
  minCampaignDuration: number;
  printingChargePerVehicleType: PricingItem[];
  installationChargePerVehicleType: PricingItem[];
  transportChargePerVehicleType: PricingItem[];
  rentalPerKmPerVehicleType: PricingItem[];
}

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [settings, setSettings] = useState<Settings>({
    defaultDesignCharge: 0,
    defaultGstPercentage: 18,
    serviceChargePercentage: 10,
    minCampaignDuration: 3,
    printingChargePerVehicleType: [],
    installationChargePerVehicleType: [],
    transportChargePerVehicleType: [],
    rentalPerKmPerVehicleType: []
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/settings/current`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setSettings(data.data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaveLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/settings/update`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to save settings');
    } finally {
      setSaveLoading(false);
    }
  };

  const addItem = (field: string) => {
    const list = [...(settings as any)[field]];
    list.push({ type: '', charge: 0 });
    setSettings({
      ...settings,
      [field]: list
    });
  };

  const updateItem = (field: string, index: number, key: string, value: any) => {
    const newList = [...(settings as any)[field]];
    newList[index][key] = key === 'charge' ? Number(value) : value;
    setSettings({ ...settings, [field]: newList });
  };

  const removeItem = (field: string, index: number) => {
    const newList = [...(settings as any)[field]];
    newList.splice(index, 1);
    setSettings({ ...settings, [field]: newList });
  };

  const fieldStyle = {
    '& .MuiOutlinedInput-root': {
      bgcolor: '#1E1E1E', '& fieldset': { borderColor: '#333' },
      '&:hover fieldset': { borderColor: '#444' }, '&.Mui-focused fieldset': { borderColor: '#FACC15' },
      color: 'white', borderRadius: 2
    },
    '& .MuiInputLabel-root': { color: '#A1A1AA' }
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 20 }}>
      <CircularProgress color="warning" />
    </Box>
  );

  return (
    <Box sx={{ pb: 10 }}>
       <Typography variant="h4" sx={{ color: 'white', fontWeight: 900, mb: 4, textTransform: 'uppercase' }}>
        Pricing <span style={{ color: '#FACC15' }}>Configuration</span>
      </Typography>

      {saveSuccess && <Alert severity="success" sx={{ mb: 4, bgcolor: 'rgba(34, 197, 94, 0.1)', color: '#4ADE80', border: '1px solid #4ADE80' }}>Configuration updated successfully!</Alert>}
      {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}

      <Grid container spacing={4}>
         {/* Global Charges */}
         <Grid size={{ xs: 12 }}>
            <Card sx={{ bgcolor: '#121212', p: 4, border: '1px solid #333', borderRadius: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                   <MonetizationOnIcon sx={{ color: '#FACC15' }} />
                   <Typography variant="h6" sx={{ color: 'white', fontWeight: 800 }}>Global Charge Rules</Typography>
                </Box>
                <Grid container spacing={3}>
                   <Grid size={{ xs: 12, md: 3 }}>
                      <TextField fullWidth label="Design Charge (One-time)" type="number" value={settings.defaultDesignCharge} onChange={(e) => setSettings({...settings, defaultDesignCharge: Number(e.target.value)})} sx={fieldStyle} InputLabelProps={{ shrink: true }} />
                   </Grid>
                   <Grid size={{ xs: 12, md: 3 }}>
                      <TextField fullWidth label="Service Charge (%)" type="number" value={settings.serviceChargePercentage} onChange={(e) => setSettings({...settings, serviceChargePercentage: Number(e.target.value)})} sx={fieldStyle} InputLabelProps={{ shrink: true }} />
                   </Grid>
                   <Grid size={{ xs: 12, md: 3 }}>
                      <TextField fullWidth label="Default GST (%)" type="number" value={settings.defaultGstPercentage} onChange={(e) => setSettings({...settings, defaultGstPercentage: Number(e.target.value)})} sx={fieldStyle} InputLabelProps={{ shrink: true }} />
                   </Grid>
                   <Grid size={{ xs: 12, md: 3 }}>
                      <TextField fullWidth label="Min Duration (Months)" type="number" value={settings.minCampaignDuration || 3} onChange={(e) => setSettings({...settings, minCampaignDuration: Number(e.target.value)})} sx={fieldStyle} InputLabelProps={{ shrink: true }} />
                   </Grid>
                </Grid>
            </Card>
         </Grid>

         {/* Detailed Pricing Tables */}
         {[
           { title: 'Printing Charges', field: 'printingChargePerVehicleType' },
           { title: 'Installation Charges', field: 'installationChargePerVehicleType' },
           { title: 'Rental Rates (Per KM)', field: 'rentalPerKmPerVehicleType' },
           { title: 'Transport Charges', field: 'transportChargePerVehicleType' }
         ].map((section) => (
           <Grid size={{ xs: 12, md: 6 }} key={section.field}>
              <Card sx={{ bgcolor: '#121212', p: 4, border: '1px solid #333', borderRadius: 1.5, height: '100%' }}>
                 <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 800 }}>{section.title}</Typography>
                    <Button variant="outlined" size="small" startIcon={<AddIcon />} onClick={() => addItem(section.field)} sx={{ color: '#FACC15', borderColor: '#FACC15' }}>Add</Button>
                 </Box>

                 <TableContainer component={Box} sx={{ border: '1px solid #222', borderRadius: 2 }}>
                   <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ color: 'zinc.500', fontWeight: 700, borderBottom: '1px solid #222' }}>VEHICLE TYPE</TableCell>
                          <TableCell sx={{ color: 'zinc.500', fontWeight: 700, borderBottom: '1px solid #222' }}>CHARGE (₹)</TableCell>
                          <TableCell sx={{ color: 'zinc.500', fontWeight: 700, borderBottom: '1px solid #222' }}></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {(settings as any)[section.field].map((item: any, idx: number) => (
                          <TableRow key={idx}>
                             <TableCell sx={{ borderBottom: '1px solid #111' }}>
                                <TextField placeholder="e.g. Auto" value={item.type} onChange={(e) => updateItem(section.field, idx, 'type', e.target.value)} variant="standard" sx={{ input: { color: 'white', fontSize: '0.9rem' } }} />
                             </TableCell>
                             <TableCell sx={{ borderBottom: '1px solid #111' }}>
                                <TextField type="number" value={item.charge} onChange={(e) => updateItem(section.field, idx, 'charge', e.target.value)} variant="standard" sx={{ input: { color: '#FACC15', fontSize: '0.9rem', fontWeight: 700 } }} />
                             </TableCell>
                             <TableCell sx={{ borderBottom: '1px solid #111', textAlign: 'right' }}>
                                <IconButton size="small" onClick={() => removeItem(section.field, idx)} sx={{ color: 'zinc.600' }}><DeleteIcon fontSize="small" /></IconButton>
                             </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                   </Table>
                 </TableContainer>
              </Card>
           </Grid>
         ))}

         <Grid size={{ xs: 12 }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
               <Button variant="contained" onClick={handleSave} disabled={saveLoading} sx={{ bgcolor: '#FACC15', color: 'black', fontWeight: 900, px: 8, py: 2, borderRadius: 1, '&:hover': { bgcolor: '#FDE047' }, boxShadow: '0 8px 24px rgba(250, 204, 21, 0.2)' }}>
                  {saveLoading ? <CircularProgress size={24} color="inherit" /> : 'SAVE CONFIGURATION'}
               </Button>
            </Box>
         </Grid>
      </Grid>
    </Box>
  );
}
