'use client';
import React, { useEffect, useState } from 'react';
import { 
  Container, Typography, Card, Grid, Box, Chip, Divider, 
  Avatar, CircularProgress, Alert, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';
import CampaignIcon from '@mui/icons-material/Campaign';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PaidIcon from '@mui/icons-material/Paid';

export default function MyAdvertisementsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);

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
        <Card sx={{ bgcolor: '#121212', p: 8, textAlign: 'center', border: '1px solid #333', borderRadius: 1.5 }}>
           <CampaignIcon sx={{ fontSize: 64, color: 'zinc.700', mb: 2 }} />
           <Typography variant="h6" sx={{ color: 'zinc.500', fontWeight: 700 }}>
             No active or pending advertisements found for your fleet.
           </Typography>
           <Typography variant="body2" sx={{ color: 'zinc.600', mt: 1 }}>
             New campaign requests from admins will appear here as soon as they are assigned.
           </Typography>
        </Card>
      ) : (
        <Card sx={{ bgcolor: '#121212', border: '1px solid #222', borderRadius: 2, overflow: 'hidden' }}>
           <TableContainer>
              <Table>
                 <TableHead sx={{ bgcolor: '#1A1A1A' }}>
                    <TableRow>
                       <TableCell sx={{ color: '#FACC15', fontWeight: 900, textTransform: 'uppercase', fontSize: '0.75rem' }}>Brand / Campaign</TableCell>
                       <TableCell sx={{ color: '#FACC15', fontWeight: 900, textTransform: 'uppercase', fontSize: '0.75rem' }}>Assigned Vehicles</TableCell>
                       <TableCell sx={{ color: '#FACC15', fontWeight: 900, textTransform: 'uppercase', fontSize: '0.75rem' }}>Est. Monthly Income</TableCell>
                       <TableCell sx={{ color: '#FACC15', fontWeight: 900, textTransform: 'uppercase', fontSize: '0.75rem' }}>Duration</TableCell>
                       <TableCell sx={{ color: '#FACC15', fontWeight: 900, textTransform: 'uppercase', fontSize: '0.75rem' }}>Status</TableCell>
                       <TableCell sx={{ color: '#FACC15', fontWeight: 900, textTransform: 'uppercase', fontSize: '0.75rem' }} align="center">Actions</TableCell>
                    </TableRow>
                 </TableHead>
                 <TableBody>
                    {campaigns.map((camp) => (
                       <TableRow key={camp._id} sx={{ '&:hover': { bgcolor: '#161616' } }}>
                          <TableCell>
                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar sx={{ bgcolor: 'rgba(250, 204, 21, 0.1)', color: '#FACC15', width: 40, height: 40, fontSize: '1rem', fontWeight: 900 }}>
                                   {camp.brandName?.[0]}
                                </Avatar>
                                <Box>
                                   <Typography sx={{ color: 'white', fontWeight: 800 }}>{camp.brandName}</Typography>
                                   <Typography variant="caption" sx={{ color: 'zinc.600' }}>{camp.adId || 'CP------'}</Typography>
                                </Box>
                             </Box>
                          </TableCell>
                          <TableCell>
                             <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', maxWidth: 200 }}>
                                {camp.vehicles.map((v: any) => (
                                   <Chip 
                                      key={v._id} 
                                      label={v.registrationNumber} 
                                      size="small" 
                                      sx={{ height: 20, fontSize: '0.65rem', bgcolor: '#000', color: 'zinc.400', border: '1px solid #222' }} 
                                   />
                                ))}
                             </Box>
                          </TableCell>
                          <TableCell>
                             <Typography sx={{ color: '#4ADE80', fontWeight: 900 }}>₹ {(camp.rentalChargesPerKm * camp.averageKm * camp.vehicles.length || 0).toLocaleString('en-IN')}</Typography>
                             <Typography variant="caption" sx={{ color: 'zinc.600', fontSize: '0.6rem' }}>₹{camp.rentalChargesPerKm}/KM per vehicle</Typography>
                          </TableCell>
                          <TableCell>
                             <Typography sx={{ color: 'zinc.300', fontWeight: 700 }}>{camp.duration}</Typography>
                          </TableCell>
                          <TableCell>
                             <Chip 
                                label={camp.status === 'ACCEPTED' ? 'ACTIVE' : 'PENDING'} 
                                size="small"
                                sx={{ 
                                   bgcolor: camp.status === 'ACCEPTED' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(250, 204, 21, 0.1)', 
                                   color: camp.status === 'ACCEPTED' ? '#4ADE80' : '#FACC15',
                                   fontWeight: 900, fontSize: '0.65rem'
                                }} 
                             />
                          </TableCell>
                          <TableCell align="center">
                             <Button 
                                size="small"
                                variant="outlined"
                                onClick={() => window.location.href = '/fleet/vehicles'}
                                sx={{ 
                                   borderColor: '#333', color: 'zinc.400', fontWeight: 800, fontSize: '0.7rem',
                                   '&:hover': { borderColor: '#FACC15', color: 'white', bgcolor: 'transparent' }
                                }}
                             >
                                Manage Fleet
                             </Button>
                          </TableCell>
                       </TableRow>
                    ))}
                 </TableBody>
              </Table>
           </TableContainer>
        </Card>
      )}
    </Container>
  );
}
