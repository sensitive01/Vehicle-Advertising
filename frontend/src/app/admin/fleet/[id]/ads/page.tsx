'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { 
  Box, Typography, Card, Grid, Avatar, Chip, CircularProgress, 
  Stack, Button, Divider, Paper, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, IconButton,
  Tooltip, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CampaignIcon from '@mui/icons-material/Campaign';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import BusinessIcon from '@mui/icons-material/Business';
import PaymentsIcon from '@mui/icons-material/Payments';
import InfoIcon from '@mui/icons-material/Info';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function VehicleAdsPage() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const ownerId = searchParams.get('ownerId');
  const returnTab = searchParams.get('tab') || '0';
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [viewOpen, setViewOpen] = useState(false);

  useEffect(() => {
    if (id) fetchAds();
  }, [id]);

  const fetchAds = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/api/fleet/${id}/ads`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data);
    } catch (err) {
      console.error('Error fetching ads:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (ownerId) {
      router.push(`/admin/owners/${ownerId}?tab=${returnTab}`);
    } else {
      router.back();
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress sx={{ color: '#FACC15' }} />
      </Box>
    );
  }

  if (!data?.vehicle) {
    return <Box p={10}><Typography sx={{ color: 'white' }}>Vehicle data not found.</Typography></Box>;
  }

  const campaign = data.campaign;

  return (
    <Box sx={{ p: 4 }}>
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={handleBack}
        sx={{ color: '#FACC15', mb: 4, fontWeight: 700 }}
      >
        Back to Vehicle Fleet
      </Button>

      <Stack spacing={4}>
        {/* Vehicle Summary Header */}
        <Card sx={{ bgcolor: '#121212', border: '1px solid #333', borderRadius: 1.5, backgroundImage: 'none' }}>
          <Box sx={{ p: 3 }}>
            <Stack direction="row" spacing={3} alignItems="center">
              <Avatar variant="rounded" sx={{ width: 64, height: 64, bgcolor: '#FACC15', color: 'black' }}>
                <DirectionsCarIcon sx={{ fontSize: 32 }} />
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ color: 'white', fontWeight: 900 }}>
                  {data.vehicle.make} {data.vehicle.model}
                </Typography>
                <Typography sx={{ color: '#FACC15', fontWeight: 700 }}>
                  {data.vehicle.registrationNumber} • {data.vehicle.vehicleId}
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Card>

        {/* Allotted Ads Table */}
        <Box>
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 800, mb: 2 }}>Allotted Advertisements</Typography>
          {!campaign ? (
            <Box sx={{ textAlign: 'center', py: 10, bgcolor: '#0A0A0A', borderRadius: 1.5, border: '1px dashed #333' }}>
              <CampaignIcon sx={{ fontSize: 48, color: 'zinc.800', mb: 2 }} />
              <Typography sx={{ color: 'zinc.600' }}>No active advertisements currently allotted to this vehicle.</Typography>
            </Box>
          ) : (
            <TableContainer component={Paper} sx={{ bgcolor: '#121212', borderRadius: 1.5, border: '1px solid #333', backgroundImage: 'none' }}>
              <Table>
                <TableHead sx={{ bgcolor: '#000' }}>
                  <TableRow>
                    <TableCell sx={{ color: '#FACC15', fontWeight: 800, width: '80px' }}>SL NO</TableCell>
                    <TableCell sx={{ color: '#FACC15', fontWeight: 800 }}>BRAND NAME</TableCell>
                    <TableCell sx={{ color: '#FACC15', fontWeight: 800 }}>CATEGORY</TableCell>
                    <TableCell sx={{ color: '#FACC15', fontWeight: 800 }}>DURATION</TableCell>
                    <TableCell sx={{ color: '#FACC15', fontWeight: 800 }}>EST. EARNINGS</TableCell>
                    <TableCell sx={{ color: '#FACC15', fontWeight: 800 }}>STATUS</TableCell>
                    <TableCell sx={{ color: '#FACC15', fontWeight: 800 }} align="center">ACTION</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' } }}>
                    <TableCell sx={{ color: 'zinc.500', fontWeight: 700 }}>01</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 700 }}>{campaign.brandName || campaign.campaignTitle}</TableCell>
                    <TableCell sx={{ color: 'zinc.400' }}>{campaign.businessCategory || 'N/A'}</TableCell>
                    <TableCell sx={{ color: 'white' }}>{campaign.duration}</TableCell>
                    <TableCell sx={{ color: '#4ADE80', fontWeight: 800 }}>
                      ₹{(campaign.rentalChargesPerKm * campaign.averageKm || 0).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={campaign.status} 
                        size="small"
                        sx={{ bgcolor: campaign.status === 'ACTIVE' ? '#4ADE8020' : '#FACC1520', color: campaign.status === 'ACTIVE' ? '#4ADE80' : '#FACC15', fontWeight: 900 }} 
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="View Comprehensive Details">
                        <IconButton sx={{ color: 'white' }} onClick={() => setViewOpen(true)}>
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Stack>

      {/* Comprehensive Details Dialog */}
      <Dialog 
        open={viewOpen} 
        onClose={() => setViewOpen(false)} 
        maxWidth="md" 
        fullWidth
        scroll="paper"
        PaperProps={{
          sx: { 
            bgcolor: '#0F0F0F', 
            color: 'white', 
            borderRadius: 1.5, 
            border: '1px solid #333', 
            backgroundImage: 'none',
            mx: { xs: 2, md: 10 } // Ensure it doesn't overlap sidebar too much
          }
        }}
      >
        <DialogTitle sx={{ p: 3, borderBottom: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <BusinessIcon sx={{ color: '#FACC15' }} />
            <Typography variant="h6" sx={{ fontWeight: 900, textTransform: 'uppercase' }}>Campaign <span style={{ color: '#FACC15' }}>Overview</span></Typography>
          </Stack>
          <IconButton onClick={() => setViewOpen(false)} sx={{ color: 'zinc.500' }}><CloseIcon /></IconButton>
        </DialogTitle>
        
        <DialogContent 
          sx={{ 
            p: 4,
            '&::-webkit-scrollbar': { width: '8px', display: 'block' },
            '&::-webkit-scrollbar-track': { bgcolor: '#111' },
            '&::-webkit-scrollbar-thumb': { bgcolor: '#333', borderRadius: '10px', border: '2px solid #111' },
            '&::-webkit-scrollbar-thumb:hover': { bgcolor: '#FACC15' }
          }}
        >
          {campaign && (
            <Stack spacing={4}>
               <Box>
                  <Typography variant="subtitle2" sx={{ color: 'zinc.600', fontWeight: 800, mb: 3, textTransform: 'uppercase' }}>General Specifications</Typography>
                  <Grid container spacing={3}>
                     <Grid item xs={6} md={4}>
                        <Typography variant="caption" sx={{ color: 'zinc.500', fontWeight: 800, display: 'block' }}>BRAND</Typography>
                        <Typography sx={{ color: '#FACC15', fontWeight: 700 }}>{campaign.brandName}</Typography>
                     </Grid>
                     <Grid item xs={6} md={4}>
                        <Typography variant="caption" sx={{ color: 'zinc.500', fontWeight: 800, display: 'block' }}>CATEGORY</Typography>
                        <Typography sx={{ color: 'white', fontWeight: 700 }}>{campaign.businessCategory}</Typography>
                     </Grid>
                     <Grid item xs={6} md={4}>
                        <Typography variant="caption" sx={{ color: 'zinc.500', fontWeight: 800, display: 'block' }}>DURATION</Typography>
                        <Typography sx={{ color: 'white', fontWeight: 700 }}>{campaign.duration}</Typography>
                     </Grid>
                     <Grid item xs={6} md={4}>
                        <Typography variant="caption" sx={{ color: 'zinc.500', fontWeight: 800, display: 'block' }}>OPERATING LOCATION</Typography>
                        <Typography sx={{ color: 'white', fontWeight: 700 }}>{campaign.operatingLocation}</Typography>
                     </Grid>
                     <Grid item xs={6} md={4}>
                        <Typography variant="caption" sx={{ color: 'zinc.500', fontWeight: 800, display: 'block' }}>TARGET RADIUS</Typography>
                        <Typography sx={{ color: 'white', fontWeight: 700 }}>{campaign.averageRunningLocation?.radius || 0} KM</Typography>
                     </Grid>
                     <Grid item xs={6} md={4}>
                        <Typography variant="caption" sx={{ color: 'zinc.500', fontWeight: 800, display: 'block' }}>PIN CODE</Typography>
                        <Typography sx={{ color: 'white', fontWeight: 700 }}>{campaign.averageRunningLocation?.pin}</Typography>
                     </Grid>
                  </Grid>
               </Box>

               <Divider sx={{ borderColor: '#222' }} />

               <Box>
                  <Typography variant="subtitle2" sx={{ color: 'zinc.600', fontWeight: 800, mb: 3, textTransform: 'uppercase' }}>Ad Placements & Creatives</Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 4 }}>
                    {(campaign.adOptions || campaign.adPlacements || [])?.map((p: string) => (
                      <Chip key={p} label={p} size="small" sx={{ bgcolor: '#222', color: 'white', fontWeight: 700 }} />
                    ))}
                  </Stack>
                  
                  <Grid container spacing={2}>
                    {campaign.creatives?.map((c: any, idx: number) => (
                      <Grid item key={idx} xs={12} sm={6}>
                        <Paper sx={{ p: 2, bgcolor: '#000', border: '1px solid #333' }}>
                          <Box component="img" src={c.url} sx={{ width: '100%', height: 160, objectFit: 'contain', mb: 1.5 }} />
                          <Typography variant="caption" sx={{ color: '#FACC15', fontWeight: 800, display: 'block', textAlign: 'center', textTransform: 'uppercase' }}>{c.placement}</Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
               </Box>

               <Divider sx={{ borderColor: '#222' }} />

               <Box>
                  <Typography variant="subtitle2" sx={{ color: 'zinc.600', fontWeight: 800, mb: 3, textTransform: 'uppercase' }}>Financials</Typography>
                  <Card sx={{ bgcolor: '#080808', border: '1px solid #222', p: 3 }}>
                    <Stack spacing={2.5}>
                       <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography sx={{ color: 'zinc.500', fontWeight: 600 }}>Rental / KM</Typography>
                          <Typography sx={{ color: 'white', fontWeight: 800 }}>₹{campaign.rentalChargesPerKm}</Typography>
                       </Box>
                       <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography sx={{ color: 'zinc.500', fontWeight: 600 }}>Avg. KM / Mo</Typography>
                          <Typography sx={{ color: 'white', fontWeight: 800 }}>{campaign.averageKm} KM</Typography>
                       </Box>
                       <Divider sx={{ borderColor: '#333' }} />
                       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography sx={{ color: 'zinc.300', fontWeight: 800 }}>Est. Monthly Earnings</Typography>
                          <Typography sx={{ color: '#4ADE80', fontWeight: 900, fontSize: '1.4rem' }}>
                            ₹{(campaign.rentalChargesPerKm * campaign.averageKm).toLocaleString()}
                          </Typography>
                       </Box>
                    </Stack>
                  </Card>
               </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid #222' }}>
           <Button variant="contained" onClick={() => setViewOpen(false)} sx={{ bgcolor: '#FACC15', color: 'black', fontWeight: 900, px: 4, borderRadius: 1.5 }}>Close Dashboard</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
