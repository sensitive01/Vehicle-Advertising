'use client';
import React, { useEffect, useState } from 'react';
import { 
  Container, Typography, Card, Grid, Box, Chip, Divider, 
  Avatar, CircularProgress, Alert, Button
} from '@mui/material';
import CampaignIcon from '@mui/icons-material/Campaign';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PaidIcon from '@mui/icons-material/Paid';

export default function MyAdvertisementsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [campaigns, setCampaigns] = useState<any[]>([]);

  useEffect(() => {
    fetchMyCampaigns();
  }, []);

  const fetchMyCampaigns = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/fleet/myfleet`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.success) {
        // Group vehicles by activeCampaignId
        const groups: { [key: string]: any } = {};
        
        data.data.forEach((v: any) => {
          if (v.activeCampaignId) {
            const cid = v.activeCampaignId._id || v.activeCampaignId;
            if (!groups[cid]) {
              groups[cid] = {
                ...(v.activeCampaignId?._id ? v.activeCampaignId : { brandName: 'Unknown', _id: cid }),
                vehicles: [],
                status: v.campaignStatus
              };
            }
            groups[cid].vehicles.push(v);
          }
        });
        
        setCampaigns(Object.values(groups));
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load advertisements');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
      <CircularProgress color="warning" />
    </Box>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ color: 'white', fontWeight: 900, mb: 4, textTransform: 'uppercase' }}>
        My <span style={{ color: '#FACC15' }}>Advertisements</span>
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}

      {campaigns.length === 0 ? (
        <Card sx={{ bgcolor: '#121212', p: 8, textAlign: 'center', border: '1px solid #333', borderRadius: 4 }}>
           <CampaignIcon sx={{ fontSize: 64, color: 'zinc.700', mb: 2 }} />
           <Typography variant="h6" sx={{ color: 'zinc.500', fontWeight: 700 }}>
             No active or pending advertisements found for your fleet.
           </Typography>
           <Typography variant="body2" sx={{ color: 'zinc.600', mt: 1 }}>
             New campaign requests from admins will appear here as soon as they are assigned.
           </Typography>
        </Card>
      ) : (
        <Grid container spacing={4}>
          {campaigns.map((camp) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={camp._id}>
              <Card sx={{ 
                bgcolor: '#121212', 
                border: '1px solid #222', 
                borderRadius: 5, 
                overflow: 'hidden',
                transition: 'transform 0.3s ease',
                '&:hover': { transform: 'translateY(-8px)', borderColor: '#FACC15' }
              }}>
                <Box sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                       <Avatar sx={{ bgcolor: 'rgba(250, 204, 21, 0.1)', color: '#FACC15', width: 48, height: 48 }}>
                          <CampaignIcon />
                       </Avatar>
                       <Box>
                          <Typography variant="h6" sx={{ color: 'white', fontWeight: 900 }}>{camp.brandName}</Typography>
                          <Typography variant="caption" sx={{ color: 'zinc.500', textTransform: 'uppercase', letterSpacing: 1 }}>{camp.productType || 'Advertisement'}</Typography>
                       </Box>
                    </Box>
                    <Chip 
                       label={camp.status === 'ACCEPTED' ? 'ACTIVE' : 'PENDING'} 
                       size="small"
                       sx={{ 
                         bgcolor: camp.status === 'ACCEPTED' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(250, 204, 21, 0.1)', 
                         color: camp.status === 'ACCEPTED' ? '#4ADE80' : '#FACC15',
                         fontWeight: 900,
                         fontSize: '0.65rem'
                       }} 
                    />
                  </Box>

                  <Grid container spacing={2} sx={{ mb: 3 }}>
                     <Grid size={{ xs: 6 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                           <DirectionsCarIcon sx={{ fontSize: 18, color: 'zinc.500' }} />
                           <Typography variant="body2" sx={{ color: 'white', fontWeight: 700 }}>{camp.vehicles.length} Vehicles</Typography>
                        </Box>
                     </Grid>
                     <Grid size={{ xs: 6 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                           <PaidIcon sx={{ fontSize: 18, color: 'zinc.500' }} />
                           <Typography variant="body2" sx={{ color: 'white', fontWeight: 700 }}>₹{camp.budget || 'N/A'}</Typography>
                        </Box>
                     </Grid>
                     <Grid size={{ xs: 12 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                           <CalendarMonthIcon sx={{ fontSize: 18, color: 'zinc.500' }} />
                           <Typography variant="body2" sx={{ color: 'zinc.400' }}>Duration: {camp.campaignDuration || 'TBD'}</Typography>
                        </Box>
                     </Grid>
                  </Grid>

                  <Divider sx={{ borderColor: '#222', mb: 3 }} />
                  
                  <Box sx={{ mb: 3 }}>
                     <Typography variant="caption" sx={{ color: 'zinc.600', textTransform: 'uppercase', fontWeight: 900, mb: 1, display: 'block' }}>Registered Fleet</Typography>
                     <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {camp.vehicles.map((v: any) => (
                           <Chip 
                              key={v._id} 
                              label={v.registrationNumber} 
                              size="small" 
                              variant="outlined" 
                              sx={{ color: 'zinc.400', borderColor: '#333', fontSize: '0.6rem' }} 
                           />
                        ))}
                     </Box>
                  </Box>

                  <Button 
                    fullWidth 
                    variant="outlined" 
                    sx={{ 
                      borderColor: '#333', 
                      color: 'white', 
                      borderRadius: 3, 
                      fontWeight: 800,
                      '&:hover': { bgcolor: '#1A1A1A', borderColor: '#FACC15' }
                    }}
                    onClick={() => window.location.href = `/fleet/vehicles`}
                  >
                    Manage Vehicles
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
