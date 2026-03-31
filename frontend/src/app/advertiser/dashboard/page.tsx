'use client';
import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Grid, Card, Button, Stack, Chip, Divider, 
  CircularProgress, IconButton, Tooltip, Paper 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CampaignIcon from '@mui/icons-material/Campaign';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Link from 'next/link';

export default function AdvertiserDashboard() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/advertiser/my-campaigns`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setCampaigns(data.data);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const stats = [
    { label: 'Active Campaigns', value: campaigns.length, icon: <CampaignIcon sx={{ color: '#FACC15' }} />, color: '#FACC15' },
    { label: 'Total Budget (Est)', value: `₹ ${campaigns.reduce((acc, c) => acc + (c.rentalChargesPerKm * c.averageKm || 0), 0).toLocaleString('en-IN')}`, icon: <TrendingUpIcon sx={{ color: '#4ADE80' }} />, color: '#4ADE80' },
    { label: 'Partner Vehicles', value: campaigns.reduce((acc, c) => acc + c.numberOfVehicles, 0), icon: <DirectionsCarIcon sx={{ color: '#3B82F6' }} />, color: '#3B82F6' },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6 }}>
        <Box>
          <Typography variant="h3" sx={{ color: 'white', fontWeight: 900, textTransform: 'uppercase' }}>
            Brand <span style={{ color: '#FACC15' }}>Overview</span>
          </Typography>
          <Typography variant="body1" sx={{ color: 'zinc.500', mt: 1 }}>Track your advertising performance and fleet engagement.</Typography>
        </Box>
        <Link href="/advertiser/complete-profile" style={{ textDecoration: 'none' }}>
           <Button variant="contained" startIcon={<AddIcon />} sx={{ bgcolor: '#FACC15', color: 'black', fontWeight: 900, px: 4, py: 1.5, borderRadius: 3, '&:hover': { bgcolor: '#FDE047' }, boxShadow: '0 8px 24px rgba(250, 204, 21, 0.2)' }}>
              NEW CAMPAIGN REQUEST
           </Button>
        </Link>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
         {stats.map((stat, i) => (
           <Grid item xs={12} md={4} key={i}>
              <Card sx={{ bgcolor: '#121212', p: 4, border: '1px solid #222', borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
                 <Box sx={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', bgcolor: stat.color }} />
                 <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                       <Typography variant="body2" sx={{ color: 'zinc.500', fontWeight: 800, mb: 1, textTransform: 'uppercase', letterSpacing: 1.5 }}>{stat.label}</Typography>
                       <Typography variant="h3" sx={{ color: 'white', fontWeight: 900 }}>{stat.value}</Typography>
                    </Box>
                    <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 3 }}>{stat.icon}</Box>
                 </Stack>
              </Card>
           </Grid>
         ))}
      </Grid>

      {/* Recent Advertisements Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 3 }}>
         <Typography variant="h5" sx={{ color: 'white', fontWeight: 900 }}>MY <span style={{ color: '#FACC15' }}>ADVERTISEMENTS</span></Typography>
         <Link href="/advertiser/my-advertisements" style={{ textDecoration: 'none', color: '#FACC15', fontWeight: 700, fontSize: '0.9rem' }}>VIEW ALL →</Link>
      </Box>

      <Card sx={{ bgcolor: '#121212', border: '1px solid #222', borderRadius: 4, overflow: 'hidden' }}>
         {loading ? (
           <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress color="warning" /></Box>
         ) : campaigns.length === 0 ? (
           <Box sx={{ py: 10, textAlign: 'center' }}>
              <CampaignIcon sx={{ fontSize: 60, color: 'zinc.800', mb: 2 }} />
              <Typography variant="h6" sx={{ color: 'zinc.600' }}>No advertising requests found.</Typography>
              <Link href="/advertiser/complete-profile" style={{ textDecoration: 'none' }}>
                <Button sx={{ mt: 2, color: '#FACC15', fontWeight: 800 }}>Create your first campaign request</Button>
              </Link>
           </Box>
         ) : (
           <Box>
              {campaigns.slice(0, 5).map((c, i) => (
                <Box key={c._id}>
                   <Box sx={{ p: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', '&:hover': { bgcolor: '#161616' }, transition: '0.3s' }}>
                      <Stack direction="row" spacing={3} alignItems="center">
                         <Box sx={{ p: 2, bgcolor: 'rgba(250, 204, 21, 0.1)', borderRadius: 3, border: '1px solid rgba(250, 204, 21, 0.1)' }}>
                            <CampaignIcon sx={{ color: '#FACC15' }} />
                         </Box>
                         <Box>
                            <Typography variant="h6" sx={{ color: 'white', fontWeight: 800 }}>{c.brandName}</Typography>
                            <Stack direction="row" spacing={2} sx={{ mt: 0.5 }}>
                               <Typography variant="caption" sx={{ color: 'zinc.500', display: 'flex', alignItems: 'center', gap: 0.5 }}><GpsFixedIcon sx={{ fontSize: 14 }} /> {c.operatingLocation}</Typography>
                               <Typography variant="caption" sx={{ color: 'zinc.500', display: 'flex', alignItems: 'center', gap: 0.5 }}><DirectionsCarIcon sx={{ fontSize: 14 }} /> {c.targetVehicleType} Fleet</Typography>
                            </Stack>
                         </Box>
                      </Stack>
                      
                      <Stack direction="row" spacing={6} alignItems="center">
                         <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="body2" sx={{ color: 'zinc.500', fontWeight: 700 }}>MONTHLY BUDGET</Typography>
                            <Typography variant="h6" sx={{ color: '#4ADE80', fontWeight: 900 }}>₹ {(c.rentalChargesPerKm * c.averageKm || 0).toLocaleString('en-IN')}</Typography>
                         </Box>
                         <Box>
                            <Chip label="UNDER REVIEW" size="small" sx={{ bgcolor: 'rgba(250, 204, 21, 0.1)', color: '#FACC15', fontWeight: 800, borderRadius: 1.5 }} />
                         </Box>
                         <Tooltip title="View Details">
                            <IconButton sx={{ color: 'zinc.600', '&:hover': { color: '#FACC15', bgcolor: 'rgba(250, 204, 21, 0.1)' } }}>
                               <VisibilityIcon />
                            </IconButton>
                         </Tooltip>
                      </Stack>
                   </Box>
                   {i < campaigns.length - 1 && <Divider sx={{ borderColor: '#222' }} />}
                </Box>
              ))}
           </Box>
         )}
      </Card>
    </Box>
  );
}
