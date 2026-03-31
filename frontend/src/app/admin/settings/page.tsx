'use client';
import React, { useState } from 'react';
import { 
  Box, Typography, Card, TextField, Button, Grid, 
  Switch, FormControlLabel, Divider, Stack, Alert 
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import SecurityIcon from '@mui/icons-material/Security';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

export default function AdminSettingsPage() {
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fieldStyle = {
    '& .MuiOutlinedInput-root': {
      bgcolor: '#1E1E1E', '& fieldset': { borderColor: '#333' },
      '&:hover fieldset': { borderColor: '#444' }, '&.Mui-focused fieldset': { borderColor: '#FACC15' },
      color: 'white', borderRadius: 2
    },
    '& .MuiInputLabel-root': { color: '#A1A1AA' }
  };

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <Box>
       <Typography variant="h4" sx={{ color: 'white', fontWeight: 900, mb: 4, textTransform: 'uppercase' }}>
        System <span style={{ color: '#FACC15' }}>Settings</span>
      </Typography>

      {saveSuccess && <Alert severity="success" sx={{ mb: 4, bgcolor: 'rgba(34, 197, 94, 0.1)', color: '#4ADE80', border: '1px solid #4ADE80' }}>Configuration updated successfully!</Alert>}

      <Grid container spacing={4}>
         <Grid item xs={12} md={6}>
            <Card sx={{ bgcolor: '#121212', p: 4, border: '1px solid #333', borderRadius: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                   <SecurityIcon sx={{ color: '#FACC15' }} />
                   <Typography variant="h6" sx={{ color: 'white', fontWeight: 800 }}>Platform Controls</Typography>
                </Box>
                <Stack spacing={3}>
                   <FormControlLabel control={<Switch defaultChecked sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#FACC15' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#FACC15' } }} />} label={<Typography sx={{ color: 'zinc.400' }}>New User Self-Registration</Typography>} />
                   <FormControlLabel control={<Switch defaultChecked sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#FACC15' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#FACC15' } }} />} label={<Typography sx={{ color: 'zinc.400' }}>Email Verification (OTP)</Typography>} />
                   <FormControlLabel control={<Switch sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#FACC15' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#FACC15' } }} />} label={<Typography sx={{ color: 'zinc.400' }}>Maintenance Mode</Typography>} />
                </Stack>
            </Card>
         </Grid>

         <Grid item xs={12} md={6}>
            <Card sx={{ bgcolor: '#121212', p: 4, border: '1px solid #333', borderRadius: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                   <NotificationsActiveIcon sx={{ color: '#FACC15' }} />
                   <Typography variant="h6" sx={{ color: 'white', fontWeight: 800 }}>Alert Recipient</Typography>
                </Box>
                <Stack spacing={3}>
                   <TextField fullWidth label="System Admin Email" defaultValue="admin@fleetad.com" sx={fieldStyle} InputLabelProps={{ shrink: true }} />
                   <TextField fullWidth label="Support Contact Number" defaultValue="+91 98765 43210" sx={fieldStyle} InputLabelProps={{ shrink: true }} />
                </Stack>
            </Card>
         </Grid>

         <Grid item xs={12}>
            <Card sx={{ bgcolor: '#121212', p: 4, border: '1px solid #333', borderRadius: 4 }}>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 800, mb: 3 }}>Service Charges Configuration</Typography>
                <Grid container spacing={3}>
                   <Grid item xs={12} md={4}><TextField fullWidth label="Default Service Fee (%)" defaultValue="10" sx={fieldStyle} InputLabelProps={{ shrink: true }} /></Grid>
                   <Grid item xs={12} md={4}><TextField fullWidth label="Printing GST (%)" defaultValue="18" sx={fieldStyle} InputLabelProps={{ shrink: true }} /></Grid>
                   <Grid item xs={12} md={4}><TextField fullWidth label="Agent Commission (%)" defaultValue="5" sx={fieldStyle} InputLabelProps={{ shrink: true }} /></Grid>
                </Grid>
                <Divider sx={{ my: 4, borderColor: '#222' }} />
                <Button variant="contained" onClick={handleSave} sx={{ bgcolor: '#FACC15', color: 'black', fontWeight: 900, px: 6, py: 1.5, borderRadius: 2, '&:hover': { bgcolor: '#FDE047' } }}>Save Changes</Button>
            </Card>
         </Grid>
      </Grid>
    </Box>
  );
}
