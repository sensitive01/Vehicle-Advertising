'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, Container, Grid, Card, Button, CircularProgress, Divider, Avatar } from '@mui/material';
import axios from 'axios';
import { 
  PeopleAlt as PeopleIcon, 
  DirectionsCar as CarIcon, 
  Campaign as CampaignIcon, 
  PendingActions as PendingIcon,
  CheckCircle as CheckIcon,
  Business as BusinessIcon
} from '@mui/icons-material';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function AdminDashboard() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [pendingVehicles, setPendingVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async (token: string) => {
    try {
      const statsRes = await axios.get(`${API_URL}/api/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(statsRes.data.stats);

      const fleetRes = await axios.get(`${API_URL}/api/fleet/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const pending = (fleetRes.data.data || []).filter((v: any) => v.status === 'Pending Verification');
      setPendingVehicles(pending);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role')?.toLowerCase();
    
    if (token && (role === 'superadmin' || role === 'admin')) {
      setIsAdmin(true);
      fetchData(token);
    } else {
      window.location.href = '/login';
    }
  }, []);

  const handleApprove = async (id: string) => {
    const token = localStorage.getItem('token');
    try {
      await axios.patch(`${API_URL}/api/fleet/approve/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Refresh data
      if (token) fetchData(token);
    } catch (error) {
      console.error('Error approving vehicle:', error);
      alert('Failed to approve vehicle');
    }
  };

  if (!isAdmin) return <Box p={10}><Typography className="text-white">Verifying Authorization...</Typography></Box>;

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <CircularProgress sx={{ color: '#FACC15' }} />
    </Box>
  );

  const statItems = [
    { label: 'Fleet Owners', value: stats?.fleetOwners || 0, icon: <PeopleIcon />, color: '#3B82F6' },
    { label: 'Advertisers', value: stats?.advertisers || 0, icon: <BusinessIcon />, color: '#10B981' },
    { label: 'Total Vehicles', value: stats?.totalVehicles || 0, icon: <CarIcon />, color: '#F59E0B' },
    { label: 'Pending Approvals', value: stats?.pendingVehicles || 0, icon: <PendingIcon />, color: '#EF4444' },
    { label: 'Active Campaigns', value: stats?.activeCampaigns || 0, icon: <CampaignIcon />, color: '#8B5CF6' },
  ];

  return (
    <Container maxWidth="xl" sx={{ pt: 6, pb: 10 }}>
      <Typography variant="h3" sx={{ color: 'white', fontWeight: 900, mb: 1, textTransform: 'uppercase', letterSpacing: -1 }}>
        Admin <span style={{ color: '#FACC15' }}>Dashboard</span>
      </Typography>
      <Typography sx={{ color: 'rgba(255,255,255,0.6)', mb: 6, fontSize: '1.1rem' }}>
        Real-time system overview and management hub.
      </Typography>

      <Grid container spacing={3} sx={{ mb: 6 }}>
        {statItems.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
            <Card sx={{ 
              bgcolor: '#121212', 
              p: 3, 
              border: '1px solid #222', 
              borderRadius: 1.5,
              transition: 'transform 0.2s, border-color 0.2s',
              '&:hover': {
                transform: 'translateY(-5px)',
                borderColor: item.color
              }
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: `${item.color}20`, color: item.color, width: 40, height: 40 }}>
                  {item.icon}
                </Avatar>
                <Typography sx={{ color: 'rgba(255,255,255,0.5)', ml: 1.5, fontSize: '0.875rem', fontWeight: 600 }}>
                  {item.label}
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 800 }}>
                {item.value}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={4}>
        <Grid item xs={12} lg={8}>
          <Card sx={{ bgcolor: '#121212', border: '1px solid #222', borderRadius: 1.5, overflow: 'hidden' }}>
            <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #222' }}>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                Pending Vehicle Approvals
              </Typography>
              <Typography sx={{ color: '#FACC15', fontWeight: 600 }}>
                {pendingVehicles.length} Requests
              </Typography>
            </Box>
            <Box sx={{ p: 0, maxHeight: 400, overflowY: 'auto' }}>
              {pendingVehicles.length === 0 ? (
                <Box sx={{ p: 6, textAlign: 'center' }}>
                  <CheckIcon sx={{ color: '#10B981', fontSize: 48, mb: 2, opacity: 0.5 }} />
                  <Typography sx={{ color: 'rgba(255,255,255,0.4)' }}>
                    No pending vehicles to verify. All caught up!
                  </Typography>
                </Box>
              ) : (
                pendingVehicles.map((vehicle, idx) => (
                  <Box key={vehicle._id} sx={{ 
                    p: 3, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    borderBottom: idx === pendingVehicles.length - 1 ? 'none' : '1px solid #222',
                    transition: 'background-color 0.2s',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' }
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar 
                        src={vehicle.images?.[0]} 
                        variant="rounded" 
                        sx={{ width: 60, height: 60, mr: 2, border: '1px solid #333' }}
                      >
                        <CarIcon />
                      </Avatar>
                      <Box>
                        <Typography sx={{ color: 'white', fontWeight: 600 }}>
                          {vehicle.make} {vehicle.vehicleModel}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                          Reg: {vehicle.registrationNumber} | Owner: {vehicle.ownerName}
                        </Typography>
                      </Box>
                    </Box>
                    <Button 
                      variant="contained" 
                      onClick={() => handleApprove(vehicle._id)}
                      sx={{ 
                        bgcolor: '#FACC15', 
                        color: 'black', 
                        fontWeight: 'bold',
                        borderRadius: 2,
                        px: 3,
                        '&:hover': { bgcolor: '#EAB308' }
                      }}
                    >
                      Approve
                    </Button>
                  </Box>
                ))
              )}
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card sx={{ bgcolor: '#121212', p: 3, border: '1px solid #222', borderRadius: 1.5 }}>
            <Typography variant="h6" sx={{ color: 'white', mb: 3, fontWeight: 'bold' }}>
              System Health
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>Database Connection</Typography>
                <Typography variant="body2" sx={{ color: '#10B981', fontWeight: 600 }}>Optimal</Typography>
              </Box>
              <Divider sx={{ bgcolor: '#222' }} />
            </Box>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>API Latency</Typography>
                <Typography variant="body2" sx={{ color: '#10B981', fontWeight: 600 }}>24ms</Typography>
              </Box>
              <Divider sx={{ bgcolor: '#222' }} />
            </Box>
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>Cloud Storage</Typography>
                <Typography variant="body2" sx={{ color: '#FACC15', fontWeight: 600 }}>Active</Typography>
              </Box>
            </Box>
          </Card>
          
          <Card sx={{ 
            background: 'linear-gradient(135deg, rgba(250, 204, 21, 0.1) 0%, rgba(250, 204, 21, 0.05) 100%)', 
            p: 3, 
            border: '1px solid rgba(250, 204, 21, 0.2)', 
            borderRadius: 1.5, 
            mt: 3 
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="h6" sx={{ color: '#FACC15', fontWeight: 'bold' }}>
                Admin Insight
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
              There are currently {pendingVehicles.length} vehicles waiting for your review. Approving them will make them available for upcoming advertising campaigns.
            </Typography>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
