'use client';
import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Card, Button, Chip, 
  CircularProgress, IconButton, Tooltip, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, TablePagination, Dialog, DialogTitle,
  DialogContent, DialogActions, Grid, Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import BusinessIcon from '@mui/icons-material/Business';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import AssessmentIcon from '@mui/icons-material/Assessment';
import Link from 'next/link';

export default function MyAdvertisementsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);

  const [viewOpen, setViewOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);

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
      if (data.success) setCampaigns(data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const InfoBlock = ({ label, value }: { label: string, value: any }) => (
    <Box sx={{ mb: 2 }}>
      <Typography variant="body2" sx={{ color: '#FACC15', fontWeight: 800, mb: 0.5, textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: 1 }}>
        {label}
      </Typography>
      <Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>{value || 'N/A'}</Typography>
    </Box>
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6 }}>
        <Box>
           <Typography variant="h4" sx={{ color: 'white', fontWeight: 900, textTransform: 'uppercase' }}>
            My <span style={{ color: '#FACC15' }}>Advertisements</span>
          </Typography>
          <Typography variant="body1" sx={{ color: 'zinc.500', mt: 1 }}>Full list of all campaign requests submitted for the platform.</Typography>
        </Box>
        <Link href="/advertiser/complete-profile" style={{ textDecoration: 'none' }}>
           <Button variant="contained" startIcon={<AddIcon />} sx={{ bgcolor: '#FACC15', color: 'black', fontWeight: 900, px: 4, py: 1.5, borderRadius: 3 }}>
              LAUNCH NEW REQUEST
           </Button>
        </Link>
      </Box>

      <Card sx={{ bgcolor: '#121212', border: '1px solid #333', borderRadius: 4, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#1A1A1A' }}>
              <TableRow>
                <TableCell sx={{ color: '#A1A1AA', fontWeight: 'bold' }}>Brand / Campaign</TableCell>
                <TableCell sx={{ color: '#A1A1AA', fontWeight: 'bold' }}>Location</TableCell>
                <TableCell sx={{ color: '#A1A1AA', fontWeight: 'bold' }}>Vehicle Type</TableCell>
                <TableCell sx={{ color: '#A1A1AA', fontWeight: 'bold' }}>Qty</TableCell>
                <TableCell sx={{ color: '#A1A1AA', fontWeight: 'bold' }}>Budget (Est)</TableCell>
                <TableCell sx={{ color: '#A1A1AA', fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ color: '#A1A1AA', fontWeight: 'bold' }}>Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={7} sx={{ textAlign: 'center', py: 6 }}><CircularProgress color="warning" /></TableCell></TableRow>
              ) : campaigns.length === 0 ? (
                <TableRow><TableCell colSpan={7} sx={{ textAlign: 'center', py: 10 }}>
                  <Typography sx={{ color: 'zinc.600' }}>You haven&apos;t requested any advertisements yet.</Typography>
                </TableCell></TableRow>
              ) : (
                campaigns.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((c) => (
                  <TableRow key={c._id} sx={{ '&:hover': { bgcolor: '#1A1A1A' } }}>
                    <TableCell>
                      <Typography sx={{ color: 'white', fontWeight: 700 }}>{c.brandName}</Typography>
                      <Typography variant="caption" sx={{ color: 'zinc.500' }}>Requested: {formatDate(c.createdAt)}</Typography>
                    </TableCell>
                    <TableCell sx={{ color: 'zinc.300', fontSize: '0.85rem' }}>{c.operatingLocation}</TableCell>
                    <TableCell sx={{ color: 'zinc.300' }}>{c.targetVehicleType}</TableCell>
                    <TableCell sx={{ color: '#FACC15', fontWeight: 800 }}>{c.numberOfVehicles} Units</TableCell>
                    <TableCell sx={{ color: '#4ADE80', fontWeight: 900 }}>₹ {(c.rentalChargesPerKm * c.averageKm || 0).toLocaleString('en-IN')}</TableCell>
                    <TableCell>
                       <Chip 
                          label={c.status || 'PENDING'} 
                          size="small" 
                          sx={{ 
                            bgcolor: c.status === 'ACTIVE' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(250, 204, 21, 0.1)', 
                            color: c.status === 'ACTIVE' ? '#4ADE80' : '#FACC15', 
                            fontWeight: 800 
                          }} 
                        />
                    </TableCell>
                    <TableCell>
                       <IconButton onClick={() => { setSelectedCampaign(c); setViewOpen(true); }} sx={{ color: 'zinc.600', '&:hover': { color: '#FACC15' } }}>
                          <VisibilityIcon fontSize="small" />
                       </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination component="div" count={campaigns.length} rowsPerPage={rowsPerPage} page={page} onPageChange={(e, p) => setPage(p)} onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }} sx={{ color: 'zinc.400', borderTop: '1px solid #333' }} />
      </Card>

      <Dialog 
        open={viewOpen} 
        onClose={() => setViewOpen(false)} 
        maxWidth="md" 
        fullWidth 
        PaperProps={{ sx: { bgcolor: '#121212', color: 'white', borderRadius: 4, border: '1px solid #333' } }}
      >
        <DialogTitle sx={{ p: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #222' }}>
           <Typography variant="h5" sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1 }}>Campaign <span style={{ color: '#FACC15' }}>Overview</span></Typography>
           <IconButton onClick={() => setViewOpen(false)} sx={{ color: 'zinc.500' }}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 4, '&::-webkit-scrollbar': { display: 'none' }, scrollbarWidth: 'none' }}>
           {selectedCampaign && (
             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <Box>
                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                      <BusinessIcon sx={{ color: '#FACC15' }} />
                      <Typography variant="h6" sx={{ fontWeight: 800 }}>Business Identity</Typography>
                   </Box>
                   <Grid container spacing={3}>
                      <Grid item xs={12} md={4}><InfoBlock label="Brand Name" value={selectedCampaign.brandName} /></Grid>
                      <Grid item xs={12} md={4}><InfoBlock label="Category" value={selectedCampaign.businessCategory} /></Grid>
                      <Grid item xs={12} md={4}><InfoBlock label="Operating Location" value={selectedCampaign.operatingLocation} /></Grid>
                   </Grid>
                </Box>
                <Divider sx={{ borderColor: '#222' }} />
                <Box>
                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                      <GpsFixedIcon sx={{ color: '#FACC15' }} />
                      <Typography variant="h6" sx={{ fontWeight: 800 }}>Distribution & Target</Typography>
                   </Box>
                   <Grid container spacing={3}>
                      <Grid item xs={12} md={4}><InfoBlock label="Vehicle Category" value={selectedCampaign.targetVehicleType} /></Grid>
                      <Grid item xs={12} md={4}><InfoBlock label="Target Reach" value={`${selectedCampaign.numberOfVehicles} Vehicles`} /></Grid>
                      <Grid item xs={12} md={4}><InfoBlock label="Target Pin / Radius" value={`${selectedCampaign.averageRunningLocation?.pin} (${selectedCampaign.averageRunningLocation?.radius} KM)`} /></Grid>
                      <Grid item xs={12}><InfoBlock label="Placement Options" value={selectedCampaign.adOptions?.join(', ')} /></Grid>
                   </Grid>
                </Box>
                <Divider sx={{ borderColor: '#222' }} />
                <Box>
                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                      <AssessmentIcon sx={{ color: '#FACC15' }} />
                      <Typography variant="h6" sx={{ fontWeight: 800 }}>Budget & Duration</Typography>
                   </Box>
                   <Grid container spacing={3}>
                      <Grid item xs={6} md={3}><InfoBlock label="Rental/KM" value={`₹ ${selectedCampaign.rentalChargesPerKm}`} /></Grid>
                      <Grid item xs={6} md={3}><InfoBlock label="Expected Avg KM" value={selectedCampaign.averageKm} /></Grid>
                      <Grid item xs={6} md={3}><InfoBlock label="Duration" value={selectedCampaign.duration} /></Grid>
                      <Grid item xs={6} md={3}><InfoBlock label="GST" value={`${selectedCampaign.gst}%`} /></Grid>
                   </Grid>
                   
                   <Box sx={{ mt: 3, p: 3, bgcolor: '#1A1A1A', borderRadius:3, border: '1px solid #222', display: 'flex', justifyContent: 'space-between' }}>
                      <Box>
                         <Typography variant="body2" sx={{ color: 'zinc.500', fontWeight: 800 }}>TOTAL MONTHLY ESTIMATE</Typography>
                         <Typography variant="h4" sx={{ color: '#4ADE80', fontWeight: 900, mt: 1 }}>₹ {(selectedCampaign.rentalChargesPerKm * selectedCampaign.averageKm * selectedCampaign.numberOfVehicles * (1 + selectedCampaign.gst/100)).toLocaleString('en-IN')}</Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                          <Chip label={selectedCampaign.status} sx={{ bgcolor: 'rgba(250, 204, 21, 0.1)', color: '#FACC15', fontWeight: 800 }} />
                          <Typography variant="caption" sx={{ color: 'zinc.600', display: 'block', mt: 1 }}>Requested on: {formatDate(selectedCampaign.createdAt)}</Typography>
                      </Box>
                   </Box>
                </Box>
             </Box>
           )}
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid #222' }}>
           <Button onClick={() => setViewOpen(false)} sx={{ color: '#FACC15', fontWeight: 800 }}>Close Overview</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
