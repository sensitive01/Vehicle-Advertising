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
  const [walletBalance, setWalletBalance] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalVehicles: 0,
    activeCampaigns: 0
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
      
      // Fetch Fleet, User Profile (for wallet), and Transactions
      const [fleetRes, userRes] = await Promise.all([
        axios.get(`${API_URL}/api/fleet/myfleet`, { headers }),
        axios.get(`${API_URL}/api/auth/me`, { headers })
      ]);

      const fleetData = fleetRes.data.data || [];
      const userData = userRes.data.data || {};
      
      setFleet(fleetData);

      // Fetch Transactions
      const txRes = await axios.get(`${API_URL}/api/transactions/user/${userData._id}`, { headers });
      const txData = txRes.data.data || [];
      setTransactions(txData);

      // Fallback: If wallet balance is 0, calculate from transactions
      let balance = userData.walletBalance || 0;
      if (balance === 0 && txData.length > 0) {
        balance = txData.filter((t: any) => t.status === 'Completed' && t.type === 'Credit')
                        .reduce((sum: number, t: any) => sum + t.amount, 0);
      }
      setWalletBalance(balance);

      let activeCount = 0;
      fleetData.forEach((v: any) => {
        if (v.activeCampaignId) activeCount++;
      });

      setStats({
        totalVehicles: fleetData.length,
        activeCampaigns: activeCount
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

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <StatBox title="Registered Units" value={stats.totalVehicles} icon={<DirectionsCarIcon />} color="#FACC15" />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <StatBox title="Active Ads" value={stats.activeCampaigns} icon={<CampaignIcon />} color="#3B82F6" />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <StatBox title="Wallet Balance" value={`₹${walletBalance.toLocaleString()}`} icon={<AccountBalanceWalletIcon />} color="#10B981" />
          </Grid>
        </Grid>

        <Grid container spacing={4}>
           <Grid size={{ xs: 12, lg: 8 }}>
              <Card sx={{ bgcolor: '#121212', border: '1px solid #333', borderRadius: 1.5, overflow: 'hidden' }}>
                <Box sx={{ p: 2.5, bgcolor: '#121212', borderBottom: '1px solid #333' }}>
                  <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase' }}>Vehicle Matrix</Typography>
                </Box>
                
                <TableContainer>
                  <Table size="small">
                    <TableHead sx={{ bgcolor: '#1A1A1A' }}>
                      <TableRow>
                        <TableCell sx={{ color: '#A1A1AA', fontWeight: 'bold' }}>Vehicle</TableCell>
                        <TableCell sx={{ color: '#A1A1AA', fontWeight: 'bold' }}>Status</TableCell>
                        <TableCell sx={{ color: '#A1A1AA', fontWeight: 'bold' }}>Campaign</TableCell>
                        <TableCell sx={{ color: '#A1A1AA', fontWeight: 'bold' }} align="right">Monthly Earn</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {fleet.length > 0 ? (
                        fleet.map((v) => (
                          <TableRow key={v._id} sx={{ '&:hover': { bgcolor: '#1A1A1A' } }}>
                            <TableCell sx={{ borderBottom: '1px solid #222' }}>
                              <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '0.85rem' }}>{v.registrationNumber}</Typography>
                              <Typography sx={{ color: '#A1A1AA', fontSize: '0.7rem' }}>{v.make} {v.vehicleModel}</Typography>
                            </TableCell>
                            <TableCell sx={{ borderBottom: '1px solid #222' }}>
                              <Chip label={v.status || 'Pending'} size="small" sx={{ bgcolor: v.status === 'Verified' || v.status === 'Approved' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(250, 204, 21, 0.1)', color: v.status === 'Verified' || v.status === 'Approved' ? '#4ADE80' : '#FACC15', fontSize: '0.65rem', fontWeight: 800 }} />
                            </TableCell>
                            <TableCell sx={{ borderBottom: '1px solid #222' }}>
                              <Typography sx={{ color: '#3B82F6', fontWeight: 700, fontSize: '0.8rem' }}>{v.activeCampaignId?.brandName || 'NONE'}</Typography>
                            </TableCell>
                            <TableCell sx={{ borderBottom: '1px solid #222' }} align="right">
                              <Typography sx={{ color: 'white', fontWeight: 800, fontSize: '0.85rem' }}>₹{(v.activeCampaignId?.rentalChargesPerKm * 300 || 0).toLocaleString()}</Typography>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} align="center" sx={{ py: 8, color: 'zinc.600', fontWeight: 700 }}>
                            No vehicles registered yet.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
           </Grid>

           <Grid size={{ xs: 12, lg: 4 }}>
              <Card sx={{ bgcolor: '#121212', border: '1px solid #333', borderRadius: 1.5, overflow: 'hidden', height: '100%' }}>
                <Box sx={{ p: 2.5, bgcolor: '#121212', borderBottom: '1px solid #333', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                   <TrendingUpIcon sx={{ color: '#10B981' }} />
                   <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase' }}>Recent Payouts</Typography>
                </Box>
                <Box sx={{ p: 0 }}>
                   {transactions.length > 0 ? (
                      transactions.slice(0, 5).map((t, idx) => (
                        <Box key={t._id} sx={{ p: 2, borderBottom: idx !== 4 ? '1px solid #222' : 'none', '&:hover': { bgcolor: '#1A1A1A' } }}>
                           <Stack direction="row" justifyContent="space-between" alignItems="center">
                              <Box>
                                 <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '0.85rem' }}>₹{t.amount.toLocaleString()}</Typography>
                                 <Typography variant="caption" sx={{ color: 'zinc.500' }}>ID: {t.transactionId}</Typography>
                              </Box>
                              <Typography variant="caption" sx={{ color: 'zinc.600', fontWeight: 700 }}>{new Date(t.createdAt).toLocaleDateString('en-GB')}</Typography>
                           </Stack>
                        </Box>
                      ))
                   ) : (
                      <Box sx={{ p: 10, textAlign: 'center' }}>
                         <Typography variant="caption" sx={{ color: 'zinc.600' }}>No payouts received yet.</Typography>
                      </Box>
                   )}
                </Box>
              </Card>
           </Grid>
        </Grid>

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
