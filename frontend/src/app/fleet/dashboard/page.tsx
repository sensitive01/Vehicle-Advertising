'use client';
import React, { useState, useEffect } from 'react';
import { 
  Typography, Card, Grid, Box, Stack, 
  CircularProgress, IconButton, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, 
  Button, Avatar, Container, Divider
} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CampaignIcon from '@mui/icons-material/Campaign';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import StarsIcon from '@mui/icons-material/Stars';
import RefreshIcon from '@mui/icons-material/Refresh';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function FleetDashboard() {
  const [fleet, setFleet] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalVehicles: 0,
    activeCampaigns: 0,
    totalEarnings: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const headers = { Authorization: `Bearer ${token}` };
      const fleetRes = await axios.get(`${API_URL}/api/fleet/myfleet`, { headers });
      const fleetData = fleetRes.data.data || [];
      setFleet(fleetData);

      let activeCount = 0;
      let earnings = 0;
      fleetData.forEach((v: any) => {
        if (v.activeCampaignId) {
          activeCount++;
          const campaign = v.activeCampaignId;
          if (typeof campaign === 'object') {
             earnings += (Number(campaign.rentalChargesPerKm || 0) * Number(campaign.averageKm || 0));
          }
        }
      });

      setStats({
        totalVehicles: fleetData.length,
        activeCampaigns: activeCount,
        totalEarnings: earnings
      });
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const StatBox = ({ title, value, icon, color }: any) => (
    <Card sx={{ 
      bgcolor: '#121212', 
      border: '1px solid #333', 
      borderRadius: 1.5, 
      p: 3, 
      display: 'flex', 
      alignItems: 'center', 
      gap: 2.5,
      height: '100%'
    }}>
      <Avatar sx={{ bgcolor: `${color}10`, color: color, width: 50, height: 50, borderRadius: 1.5 }}>
        {React.cloneElement(icon, { sx: { fontSize: 24 } })}
      </Avatar>
      <Box>
        <Typography variant="h5" sx={{ color: 'white', fontWeight: 900 }}>{value}</Typography>
        <Typography sx={{ color: '#A1A1AA', fontWeight: 'bold', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 1 }}>{title}</Typography>
      </Box>
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress sx={{ color: '#FACC15' }} size={40} />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      
      <Stack spacing={4}>
        
        {/* Consistent Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="h4" sx={{ color: 'white', fontWeight: 900, textTransform: 'uppercase' }}>
              Fleet <span style={{ color: '#FACC15' }}>Dashboard</span>
            </Typography>
          </Stack>
          <IconButton onClick={fetchDashboardData} sx={{ border: '1px solid #333', borderRadius: 1.5, p: 1, color: '#FACC15' }}>
            <RefreshIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Consistent Stats Row */}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <StatBox title="Registered Units" value={stats.totalVehicles} icon={<DirectionsCarIcon />} color="#FACC15" />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <StatBox title="Active Ads" value={stats.activeCampaigns} icon={<CampaignIcon />} color="#3B82F6" />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <StatBox title="Est. Income" value={`₹${stats.totalEarnings.toLocaleString()}`} icon={<AccountBalanceWalletIcon />} color="#10B981" />
          </Grid>
        </Grid>

        {/* Consistent Table Styling */}
        <Card sx={{ bgcolor: '#121212', border: '1px solid #333', borderRadius: 1.5, overflow: 'hidden' }}>
          <Box sx={{ p: 2.5, bgcolor: '#121212', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase' }}>Vehicle Status Matrix</Typography>
            <Typography sx={{ color: '#10B981', fontSize: '0.7rem', fontWeight: 800 }}>LIVE SYNC ENABLED</Typography>
          </Box>
          
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: '#1A1A1A' }}>
                <TableRow>
                  <TableCell sx={{ color: '#A1A1AA', fontWeight: 'bold', fontSize: '0.85rem' }}>Photos</TableCell>
                  <TableCell sx={{ color: '#A1A1AA', fontWeight: 'bold', fontSize: '0.85rem' }}>Vehicle Details</TableCell>
                  <TableCell sx={{ color: '#A1A1AA', fontWeight: 'bold', fontSize: '0.85rem' }}>Verification</TableCell>
                  <TableCell sx={{ color: '#A1A1AA', fontWeight: 'bold', fontSize: '0.85rem' }}>Active Campaign</TableCell>
                  <TableCell sx={{ color: '#A1A1AA', fontWeight: 'bold', fontSize: '0.85rem' }} align="right">Revenue</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fleet.length > 0 ? (
                  fleet.map((v) => (
                    <TableRow key={v._id} sx={{ '&:hover': { bgcolor: '#1A1A1A' } }}>
                      <TableCell sx={{ borderBottom: '1px solid #222' }}>
                        <Avatar variant="rounded" src={v.images?.[0]} sx={{ width: 60, height: 40, bgcolor: '#1A1A1A', borderRadius: 1.5, border: '1px solid #333' }} />
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid #222' }}>
                        <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '0.95rem' }}>{v.registrationNumber}</Typography>
                        <Typography sx={{ color: '#A1A1AA', fontSize: '0.75rem' }}>{v.make} {v.vehicleModel}</Typography>
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid #222' }}>
                        <Box sx={{ 
                          px: 1.5, py: 0.5, borderRadius: 1, display: 'inline-block',
                          bgcolor: v.status === 'Verified' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(250, 204, 21, 0.1)',
                          color: v.status === 'Verified' ? '#4ADE80' : '#FACC15',
                          fontSize: '0.7rem', fontWeight: 'bold'
                        }}>
                          {v.status || 'Pending'}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid #222' }}>
                        {v.activeCampaignId ? (
                           <Typography sx={{ color: '#3B82F6', fontWeight: 700, fontSize: '0.85rem' }}>
                              {typeof v.activeCampaignId === 'object' ? v.activeCampaignId.brandName : 'Active'}
                           </Typography>
                        ) : (
                           <Typography sx={{ color: 'zinc.700', fontSize: '0.8rem', fontWeight: 700 }}>NONE</Typography>
                        )}
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid #222' }} align="right">
                        <Typography sx={{ color: 'white', fontWeight: 800, fontSize: '0.95rem' }}>
                          ₹{v.activeCampaignId ? (typeof v.activeCampaignId === 'object' ? (v.activeCampaignId.rentalChargesPerKm * v.activeCampaignId.averageKm).toLocaleString() : '0') : '0'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )
                )) : (
                  <TableRow>
                    <TableCell colSpan={5} sx={{ textAlign: 'center', py: 10, color: 'zinc.600' }}>
                       <Typography sx={{ fontWeight: 700 }}>No vehicles registered yet.</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        {/* Consistent Promo Footer */}
        <Card sx={{ p: 4, bgcolor: '#FACC15', borderRadius: 1.5 }}>
           <Stack direction="row" flexWrap="wrap" justifyContent="space-between" alignItems="center" gap={3}>
              <Box>
                <Typography variant="h5" sx={{ color: 'black', fontWeight: 900, mb: 1, textTransform: 'uppercase' }}>Maximize Earnings</Typography>
                <Typography sx={{ color: 'black', fontSize: '0.9rem', fontWeight: 600, opacity: 0.85 }}>
                  Premium brands are looking for high-quality vehicles. Maintain your fleet to stay eligible for top-tier campaigns.
                </Typography>
              </Box>
              <Button variant="contained" sx={{ bgcolor: 'black', color: 'white', fontWeight: 900, px: 4, py: 1.5, borderRadius: 1.5, '&:hover': { bgcolor: '#222' } }}>
                Explore Tiers
              </Button>
           </Stack>
        </Card>

      </Stack>
    </Container>
  );
}
