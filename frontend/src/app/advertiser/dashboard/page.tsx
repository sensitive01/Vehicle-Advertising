'use client';
import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Grid, Card, Button, Stack, Chip, Divider, 
  CircularProgress, IconButton, Tooltip, Paper, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow 
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

  const totalBudget = campaigns.reduce((acc, c) => {
    if (c.quotedPrice > 0) return acc + c.quotedPrice;
    return acc + (c.rentalChargesPerKm * c.averageKm * (c.numberOfVehicles || 1));
  }, 0);

  const stats = [
    { label: 'Active Campaigns', value: campaigns.length, icon: <CampaignIcon sx={{ color: '#FACC15' }} />, color: '#FACC15' },
    { label: 'Total Budget (Est)', value: `₹ ${totalBudget.toLocaleString('en-IN')}`, icon: <TrendingUpIcon sx={{ color: '#4ADE80' }} />, color: '#4ADE80' },
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
        <Link href="/advertiser/create-campaign" style={{ textDecoration: 'none' }}>
           <Button variant="contained" startIcon={<AddIcon />} sx={{ bgcolor: '#FACC15', color: 'black', fontWeight: 900, px: 4, py: 1.5, borderRadius: 1, '&:hover': { bgcolor: '#FDE047' }, boxShadow: '0 8px 24px rgba(250, 204, 21, 0.2)' }}>
              NEW CAMPAIGN REQUEST
           </Button>
        </Link>

      </Box>

      {/* Stats Grid */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
         {stats.map((stat, i) => (
           <Grid size={{ xs: 12, md: 4 }} key={i}>
              <Card sx={{ bgcolor: '#121212', p: 4, border: '1px solid #222', borderRadius: 1.5, position: 'relative', overflow: 'hidden' }}>
                 <Box sx={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', bgcolor: stat.color }} />
                 <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                       <Typography variant="body2" sx={{ color: 'zinc.500', fontWeight: 800, mb: 1, textTransform: 'uppercase', letterSpacing: 1.5 }}>{stat.label}</Typography>
                       <Typography variant="h3" sx={{ color: 'white', fontWeight: 900 }}>{stat.value}</Typography>
                    </Box>
                    <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 1 }}>{stat.icon}</Box>
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

      <TableContainer component={Paper} sx={{ bgcolor: '#121212', border: '1px solid #222', borderRadius: 1.5, overflow: 'hidden', boxShadow: 'none' }}>
         <Table size="small">
            <TableHead sx={{ bgcolor: '#1A1A1A' }}>
               <TableRow>
                  <TableCell sx={{ color: 'zinc.500', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.75rem', py: 2 }}>Campaign</TableCell>
                  <TableCell sx={{ color: 'zinc.500', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.75rem' }}>Location</TableCell>
                  <TableCell sx={{ color: 'zinc.500', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.75rem' }}>Fleet</TableCell>
                  <TableCell sx={{ color: 'zinc.500', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.75rem' }} align="right">Budget</TableCell>
                  <TableCell sx={{ color: 'zinc.500', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.75rem' }} align="center">Status</TableCell>
                  <TableCell sx={{ color: 'zinc.500', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.75rem' }} align="right">Action</TableCell>
               </TableRow>
            </TableHead>
            <TableBody>
               {loading ? (
                 <TableRow><TableCell colSpan={6} align="center" sx={{ py: 8 }}><CircularProgress color="warning" /></TableCell></TableRow>
               ) : campaigns.length === 0 ? (
                 <TableRow><TableCell colSpan={6} align="center" sx={{ py: 8, color: 'zinc.600', fontWeight: 700 }}>No advertising requests found.</TableCell></TableRow>
               ) : (
                 campaigns.slice(0, 5).map((c) => (
                    <TableRow key={c._id} sx={{ '&:hover': { bgcolor: '#1A1A1A' } }}>
                       <TableCell sx={{ borderBottom: '1px solid #222' }}>
                          <Typography sx={{ color: 'white', fontWeight: 800, fontSize: '0.85rem' }}>{c.brandName}</Typography>
                          <Typography variant="caption" sx={{ color: 'zinc.500' }}>ID: {c._id.substring(18).toUpperCase()}</Typography>
                       </TableCell>
                       <TableCell sx={{ borderBottom: '1px solid #222' }}>
                          <Typography variant="caption" sx={{ color: 'zinc.400', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                             <GpsFixedIcon sx={{ fontSize: 14 }} /> {c.operatingLocation?.length > 25 ? c.operatingLocation.substring(0, 25) + '...' : c.operatingLocation}
                          </Typography>
                       </TableCell>
                       <TableCell sx={{ borderBottom: '1px solid #222' }}>
                          <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '0.8rem' }}>{c.numberOfVehicles} {c.targetVehicleType}</Typography>
                       </TableCell>
                       <TableCell sx={{ borderBottom: '1px solid #222' }} align="right">
                          <Typography sx={{ color: '#4ADE80', fontWeight: 900, fontSize: '0.9rem' }}>
                             ₹ {(c.quotedPrice > 0 ? c.quotedPrice : (c.rentalChargesPerKm * c.averageKm * (c.numberOfVehicles || 1))).toLocaleString('en-IN')}
                          </Typography>
                       </TableCell>
                       <TableCell sx={{ borderBottom: '1px solid #222' }} align="center">
                          <Chip 
                             label={c.status || 'UNDER REVIEW'} 
                             size="small" 
                             sx={{ 
                                bgcolor: 'rgba(250, 204, 21, 0.1)', 
                                color: '#FACC15', 
                                fontWeight: 800, 
                                fontSize: '0.6rem' 
                             }} 
                          />
                       </TableCell>
                       <TableCell sx={{ borderBottom: '1px solid #222' }} align="right">
                          <Tooltip title="View Details">
                             <IconButton size="small" sx={{ color: 'zinc.600', '&:hover': { color: '#FACC15' } }}>
                                <VisibilityIcon fontSize="small" />
                             </IconButton>
                          </Tooltip>
                       </TableCell>
                    </TableRow>
                 ))
               )}
            </TableBody>
         </Table>
      </TableContainer>
    </Box>
  );
}
