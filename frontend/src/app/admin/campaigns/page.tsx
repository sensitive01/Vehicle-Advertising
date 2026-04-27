'use client';
import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Card, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Chip, CircularProgress, Divider, 
  TablePagination, Button, Grid, Stack, IconButton, Tooltip, Dialog, 
  DialogTitle, DialogContent, DialogActions, Alert, Checkbox, FormControlLabel,
  FormGroup, Snackbar, TextField, MenuItem, InputAdornment
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import BusinessIcon from '@mui/icons-material/Business';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import SettingsIcon from '@mui/icons-material/Settings';
import PaymentsIcon from '@mui/icons-material/Payments';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SaveIcon from '@mui/icons-material/Save';
import Paper from '@mui/material/Paper';

export default function AdminCampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [viewOpen, setViewOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  
  const [allVehicles, setAllVehicles] = useState<any[]>([]);
  const [selectedVehicleIds, setSelectedVehicleIds] = useState<string[]>([]);
  const [actionLoading, setActionLoading] = useState(false);

  // Quoting State
  const [isQuoting, setIsQuoting] = useState(false);
  const [quoteData, setQuoteData] = useState({
    designCharges: 0,
    printingCharges: 0,
    serviceCharges: 0,
    transportCharges: 0,
    installationCharges: 0,
    rentalChargesPerKm: 0,
    averageKm: 3000,
    gst: 18,
    duration: '3 months',
    notes: ''
  });

  // Snackbar State
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'info' | 'warning' });

  useEffect(() => {
    fetchCampaigns();
    fetchVehicles();
  }, []);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/advertiser/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      console.log('[DEBUG] Campaigns fetched:', data.data);
      if (data.success) setCampaigns(data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchVehicles = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/fleet/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setAllVehicles(data.data);
    } catch (err) { console.error(err); }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning' = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/advertiser/status/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        setCampaigns(prev => prev.map(c => c._id === id ? { ...c, status } : c));
        if (selectedCampaign?._id === id) setSelectedCampaign({ ...selectedCampaign, status });
        setViewOpen(false);
        showSnackbar(`Campaign ${status.toLowerCase()} successfully!`);
      }
    } catch (err) { 
      console.error(err);
      showSnackbar('Error updating status', 'error');
    }
    finally { setActionLoading(false); }
  };

  const handleAssignVehicles = async () => {
    if (!selectedCampaign?._id) return;
    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/advertiser/assign-vehicles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ 
          campaignId: selectedCampaign?._id, 
          vehicleIds: selectedVehicleIds 
        })
      });
      const data = await res.json();
      if (data.success) {
        setAssignOpen(false);
        setSelectedVehicleIds([]);
        showSnackbar(data.message || 'Campaign assignments updated successfully!');
        fetchVehicles(); // Refresh local list
      }
    } catch (err) { 
      console.error(err);
      showSnackbar('Error assigning vehicles', 'error');
    }
    finally { setActionLoading(false); }
  };

  const calculateTotal = () => {
    const getVal = (val: string | number) => (val === '' ? 0 : Number(val));
    const oneTime = getVal(quoteData.designCharges) + getVal(quoteData.printingCharges) + getVal(quoteData.serviceCharges) + getVal(quoteData.transportCharges) + getVal(quoteData.installationCharges);
    
    let months = 3;
    if (quoteData.duration === '6 months') months = 6;
    if (quoteData.duration === '1 year') months = 12;

    const recurring = (getVal(quoteData.rentalChargesPerKm) * getVal(quoteData.averageKm) * (selectedCampaign?.numberOfVehicles || 1)) * months;
    const baseTotal = oneTime + recurring;
    const gstAmount = (baseTotal * getVal(quoteData.gst)) / 100;
    return { oneTime, recurring, subtotal: baseTotal, gst: gstAmount, total: baseTotal + gstAmount, months, vehicles: selectedCampaign?.numberOfVehicles || 1 };
  };

  const handleOpenQuoter = (campaign: any) => {
    setSelectedCampaign(campaign);
    setQuoteData({
      designCharges: campaign.designCharges || 0,
      printingCharges: campaign.printingCharges || 0,
      serviceCharges: campaign.serviceCharges || 0,
      transportCharges: campaign.transportCharges || 0,
      installationCharges: campaign.installationCharges || 0,
      rentalChargesPerKm: campaign.rentalChargesPerKm || 0,
      averageKm: campaign.averageKm || 3000,
      gst: campaign.gst || 18,
      duration: campaign.duration || '3 months',
      notes: campaign.notes || ''
    });
    setIsQuoting(true);
  };

  const handleCloseQuoter = () => {
    setIsQuoting(false);
    setSelectedCampaign(null);
  };

  const handleSaveQuote = async () => {
    if (!selectedCampaign?._id) return;
    setActionLoading(true);
    const { total } = calculateTotal();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/advertiser/quote/${selectedCampaign._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ 
          ...quoteData,
          quotedPrice: total
        })
      });
      const data = await res.json();
      if (data.success) {
        setCampaigns(prev => prev.map(c => c._id === selectedCampaign._id ? data.data : c));
        setIsQuoting(false);
        showSnackbar('Quotation updated successfully!');
      }
    } catch (err) { 
      console.error(err);
      showSnackbar('Error updating quotation', 'error');
    }
    finally { setActionLoading(false); }
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
      <Typography variant="h4" sx={{ color: 'white', fontWeight: 900, mb: 4, textTransform: 'uppercase' }}>
        Advertising <span style={{ color: '#FACC15' }}>Review</span>
      </Typography>

      <Card sx={{ bgcolor: '#121212', border: '1px solid #333', borderRadius: 1.5, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#1A1A1A' }}>
              <TableRow>
                <TableCell sx={{ color: '#FACC15', fontWeight: 800 }}>AD ID</TableCell>
                <TableCell sx={{ color: '#FACC15', fontWeight: 800 }}>Brand Name</TableCell>
                <TableCell sx={{ color: '#FACC15', fontWeight: 800 }}>Advertiser</TableCell>
                <TableCell sx={{ color: '#FACC15', fontWeight: 800 }}>Vehicles</TableCell>
                <TableCell sx={{ color: '#FACC15', fontWeight: 800 }}>Budget (Est)</TableCell>
                <TableCell sx={{ color: '#FACC15', fontWeight: 800 }}>Status</TableCell>
                <TableCell sx={{ color: '#FACC15', fontWeight: 800 }} align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={7} sx={{ textAlign: 'center', py: 6 }}><CircularProgress color="warning" /></TableCell></TableRow>
              ) : campaigns.length === 0 ? (
                <TableRow><TableCell colSpan={7} sx={{ textAlign: 'center', py: 6, color: 'zinc.600' }}>No campaign requests found.</TableCell></TableRow>
              ) : (
                campaigns.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((c) => (
                  <TableRow key={c._id} sx={{ '&:hover': { bgcolor: '#1A1A1A' } }}>
                    <TableCell sx={{ color: '#FACC15', fontWeight: 800 }}>{c.adId || 'CP------'}</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 700 }}>{c.brandName}</TableCell>
                    <TableCell>
                      {c.userId && typeof c.userId === 'object' ? (
                        <>
                          <Typography sx={{ color: 'zinc.300', fontSize: '0.85rem', fontWeight: 600 }}>{c.userId.fullName}</Typography>
                          <Typography sx={{ color: 'zinc.500', fontSize: '0.75rem' }}>{c.userId.email}</Typography>
                        </>
                      ) : (
                        <Box>
                           <Typography sx={{ color: 'zinc.600', fontSize: '0.85rem' }}>{typeof c.userId === 'string' ? `ID: ${c.userId}` : 'Unknown Advertiser'}</Typography>
                           <Typography variant="caption" sx={{ color: '#EF4444' }}>Profile incomplete or missing</Typography>
                        </Box>
                      )}
                    </TableCell>
                    <TableCell sx={{ color: 'zinc.300', fontWeight: 700 }}>{c.numberOfVehicles} Units</TableCell>
                    <TableCell sx={{ color: '#FACC15', fontWeight: 900 }}>
                      {c.quotedPrice > 0 ? (
                        <Box>
                          <Typography sx={{ fontWeight: 900, color: '#4ADE80' }}>₹ {c.quotedPrice.toLocaleString('en-IN')}</Typography>
                          <Typography variant="caption" sx={{ color: 'zinc.600', fontSize: '0.6rem', display: 'block', mt: -0.5 }}>OFFICIAL QUOTE</Typography>
                        </Box>
                      ) : (
                        <Box>
                          <Typography sx={{ fontWeight: 900 }}>₹ {(c.rentalChargesPerKm * c.averageKm * (c.numberOfVehicles || 1)).toLocaleString('en-IN')}</Typography>
                          <Typography variant="caption" sx={{ color: 'zinc.600', fontSize: '0.6rem', display: 'block', mt: -0.5 }}>EST. MONTHLY TOTAL</Typography>
                        </Box>
                      )}
                    </TableCell>
                    <TableCell>
                       <Chip 
                          label={c.status || 'PENDING'} 
                          size="small" 
                          sx={{ 
                            bgcolor: c.status === 'ACTIVE' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(250, 204, 21, 0.1)', 
                            color: c.status === 'ACTIVE' ? '#4ADE80' : '#FACC15', 
                            fontWeight: 800,
                            fontSize: '0.65rem'
                          }} 
                        />
                    </TableCell>
                    <TableCell align="center">
                       <Stack direction="row" spacing={1} justifyContent="center">
                          <Tooltip title="Review Campaign">
                            <IconButton onClick={() => { setSelectedCampaign(c); setViewOpen(true); }} sx={{ color: 'white' }}>
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Make a Quote">
                            <IconButton onClick={() => handleOpenQuoter(c)} sx={{ color: '#FACC15' }}>
                              <AssignmentIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          {c.status === 'ACTIVE' && (
                            <Tooltip title="Assign Vehicles">
                              <IconButton 
                                onClick={() => { 
                                  setSelectedCampaign(c); 
                                  const alreadyAssigned = allVehicles
                                    .filter(v => {
                                      const vid = v.activeCampaignId?._id || v.activeCampaignId;
                                      const cid = c._id;
                                      return vid === cid;
                                    })
                                    .map(v => v._id);
                                  setSelectedVehicleIds(alreadyAssigned);
                                  setAssignOpen(true); 
                                }} 
                                sx={{ color: '#FACC15', '&:hover': { bgcolor: 'rgba(250, 204, 21, 0.1)' } }}
                              >
                                <AppRegistrationIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                       </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination component="div" count={campaigns.length} rowsPerPage={rowsPerPage} page={page} onPageChange={(e, p) => setPage(p)} onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }} rowsPerPageOptions={[10, 25, 50, 100]} sx={{ color: 'zinc.400', borderTop: '1px solid #333' }} />
      </Card>

      {/* Review Dialog */}
      <Dialog 
        open={viewOpen} 
        onClose={() => setViewOpen(false)} 
        maxWidth="md" 
        fullWidth 
        PaperProps={{ sx: { bgcolor: '#121212', color: 'white', borderRadius: 1.5, border: '1px solid #333' } }}
      >
      <DialogTitle component="div" sx={{ p: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #222' }}>
           <Typography variant="h5" sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1 }}>Campaign <span style={{ color: '#FACC15' }}>Review</span></Typography>
           <IconButton onClick={() => setViewOpen(false)} sx={{ color: 'zinc.500' }}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 4, '&::-webkit-scrollbar': { display: 'none' }, scrollbarWidth: 'none' }}>
           {selectedCampaign && (
             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {selectedCampaign.status === 'PENDING' && (
                   <Alert severity="warning" sx={{ bgcolor: 'rgba(250, 204, 21, 0.05)', color: '#FACC15', border: '1px solid rgba(250, 204, 21, 0.2)' }}>
                      This campaign is currently pending administrative approval.
                   </Alert>
                )}

                <Box>
                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                      <BusinessIcon sx={{ color: '#FACC15' }} />
                      <Typography variant="h6" sx={{ fontWeight: 800 }}>Advertiser Identity</Typography>
                   </Box>
                   <Grid container spacing={3}>
                      <Grid size={{ xs: 12, md: 4 }}><InfoBlock label="Full Name" value={selectedCampaign.userId?.fullName} /></Grid>
                      <Grid size={{ xs: 12, md: 4 }}><InfoBlock label="Brand" value={selectedCampaign.brandName} /></Grid>
                      <Grid size={{ xs: 12, md: 4 }}><InfoBlock label="Category" value={selectedCampaign.businessCategory} /></Grid>
                      <Grid size={{ xs: 12, md: 4 }}><InfoBlock label="Email" value={selectedCampaign.userId?.email} /></Grid>
                      <Grid size={{ xs: 12, md: 4 }}><InfoBlock label="Contact" value={selectedCampaign.userId?.mobileNumber} /></Grid>
                   </Grid>
                </Box>
                
                <Divider sx={{ borderColor: '#222' }} />

                <Box>
                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                      <GpsFixedIcon sx={{ color: '#FACC15' }} />
                      <Typography variant="h6" sx={{ fontWeight: 800 }}>Campaign Scope</Typography>
                   </Box>
                   <Grid container spacing={3}>
                      <Grid size={{ xs: 12, md: 4 }}><InfoBlock label="Start Date" value={formatDate(selectedCampaign.startDate)} /></Grid>
                      <Grid size={{ xs: 12, md: 4 }}><InfoBlock label="Operating Location" value={selectedCampaign.operatingLocation} /></Grid>
                      <Grid size={{ xs: 12, md: 4 }}><InfoBlock label="Target Vehicles" value={`${selectedCampaign.numberOfVehicles} ${selectedCampaign.targetVehicleType} units`} /></Grid>
                      <Grid size={{ xs: 12, md: 4 }}><InfoBlock label="Reach" value={`${selectedCampaign.averageRunningLocation?.pin} (+${selectedCampaign.averageRunningLocation?.radius}km)`} /></Grid>
                   </Grid>
                </Box>

                <Divider sx={{ borderColor: '#222' }} />

                <Box>
                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                      <InsertPhotoIcon sx={{ color: '#FACC15' }} />
                      <Typography variant="h6" sx={{ fontWeight: 800 }}>Ad Creative & Placements</Typography>
                   </Box>
                   <Box sx={{ mb: 3 }}>
                      <Typography variant="caption" sx={{ color: 'zinc.500', fontWeight: 800, mb: 1, display: 'block', textTransform: 'uppercase' }}>Selected Placements</Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                         {(selectedCampaign.adOptions || []).map((opt: string) => (
                            <Chip key={opt} label={opt} size="small" sx={{ bgcolor: 'rgba(250, 204, 21, 0.1)', color: '#FACC15', fontWeight: 700, border: '1px solid rgba(250, 204, 21, 0.2)' }} />
                         ))}
                      </Box>
                   </Box>
                   <Typography variant="caption" sx={{ color: 'zinc.500', fontWeight: 800, mb: 1.5, display: 'block', textTransform: 'uppercase' }}>Creative Preview</Typography>
                   <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      {selectedCampaign.adImages && selectedCampaign.adImages.length > 0 ? (
                         selectedCampaign.adImages.map((img: string, i: number) => (
                            <Paper key={i} sx={{ width: 140, height: 100, overflow: 'hidden', borderRadius: 2, border: '1px solid #333', bgcolor: '#000' }}>
                               <img src={img} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            </Paper>
                         ))
                      ) : (
                         <Box sx={{ p: 4, width: '100%', bgcolor: '#0A0A0A', borderRadius: 2, border: '1px dashed #222', textAlign: 'center' }}>
                            <Typography variant="body2" sx={{ color: 'zinc.600' }}>No ad creative photos uploaded</Typography>
                         </Box>
                      )}
                   </Box>
                </Box>

                <Divider sx={{ borderColor: '#222' }} />

                <Grid container spacing={4}>
                   <Grid size={{ xs: 12, md: 6 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                         <SettingsIcon sx={{ color: '#FACC15' }} />
                         <Typography variant="h6" sx={{ fontWeight: 800 }}>Technical Specs</Typography>
                      </Box>
                      <Grid container spacing={2}>
                         
                          <Grid size={{ xs: 6 }}><InfoBlock label="Duration" value={selectedCampaign.duration} /></Grid>
                         <Grid size={{ xs: 6 }}><InfoBlock label="Ad Length" value={selectedCampaign.adDimensions?.length || 'N/A'} /></Grid>
                         <Grid size={{ xs: 6 }}><InfoBlock label="Ad Width" value={selectedCampaign.adDimensions?.width || 'N/A'} /></Grid>
                      </Grid>
                   </Grid>
                   <Grid size={{ xs: 12, md: 6 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                         <PaymentsIcon sx={{ color: '#FACC15' }} />
                         <Typography variant="h6" sx={{ fontWeight: 800 }}>Commercials</Typography>
                      </Box>
                      <Grid container spacing={2}>
                         <Grid size={{ xs: 6 }}><InfoBlock label="Rental / KM" value={`₹ ${selectedCampaign.rentalChargesPerKm}`} /></Grid>
                         <Grid size={{ xs: 6 }}><InfoBlock label="Avg KM / Mo" value={selectedCampaign.averageKm} /></Grid>
                         <Grid size={{ xs: 6 }}>
                            <InfoBlock 
                               label="Monthly Base Total" 
                               value={`₹ ${(selectedCampaign.rentalChargesPerKm * selectedCampaign.averageKm * (selectedCampaign.numberOfVehicles || 1)).toLocaleString()}`} 
                            />
                         </Grid>
                         {selectedCampaign.quotedPrice > 0 && (
                            <Grid size={{ xs: 12 }}>
                               <Box sx={{ mt: 1, p: 2, bgcolor: 'rgba(250, 204, 21, 0.05)', borderRadius: 1.5, border: '1px solid rgba(250, 204, 21, 0.2)' }}>
                                  <Typography variant="caption" sx={{ color: '#FACC15', fontWeight: 900, display: 'block', mb: 0.5, textTransform: 'uppercase' }}>Official Quote (Total Proposal)</Typography>
                                  <Typography variant="h5" sx={{ color: '#FACC15', fontWeight: 900 }}>₹ {selectedCampaign.quotedPrice.toLocaleString()}</Typography>
                                  <Typography variant="caption" sx={{ color: 'zinc.500', fontWeight: 700 }}>Includes all setup fees, rental for duration, and GST</Typography>
                               </Box>
                            </Grid>
                         )}
                      </Grid>
                   </Grid>
                </Grid>
              </Box>
           )}
        </DialogContent>
        <DialogActions sx={{ p: 4, pt: 2, gap: 2, borderTop: '1px solid #222' }}>
           <Button 
            disabled={actionLoading || selectedCampaign?.status === 'REJECTED'} 
            onClick={() => handleUpdateStatus(selectedCampaign._id, 'REJECTED')}
            variant="outlined" 
            startIcon={<CancelIcon />} 
            sx={{ color: '#F87171', borderColor: 'rgba(248, 113, 113, 0.3)', fontWeight: 800, borderRadius: 2, px: 3, '&:hover': { borderColor: '#F87171', bgcolor: 'rgba(248, 113, 113, 0.05)' } }}
           >
             Reject Campaign
           </Button>
           <Button 
            disabled={actionLoading || selectedCampaign?.status === 'ACTIVE'} 
            onClick={() => handleUpdateStatus(selectedCampaign._id, 'ACTIVE')}
            variant="contained" 
            startIcon={<CheckCircleIcon />} 
            sx={{ bgcolor: '#4ADE80', color: 'black', fontWeight: 900, borderRadius: 2, px: 4, '&:hover': { bgcolor: '#22C55E' } }}
           >
             Approve & Activate
           </Button>
        </DialogActions>
      </Dialog>

      {/* Assignment Dialog */}
      <Dialog 
        open={assignOpen} 
        onClose={() => setAssignOpen(false)} 
        maxWidth="sm" 
        fullWidth 
        PaperProps={{ sx: { bgcolor: '#121212', color: 'white', borderRadius: 1.5, border: '1px solid #333' } }}
      >
        <DialogTitle component="div" sx={{ p: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #222' }}>
           <Typography variant="h5" sx={{ fontWeight: 900, textTransform: 'uppercase' }}>Assign <span style={{ color: '#FACC15' }}>Vehicles</span></Typography>
           <IconButton onClick={() => setAssignOpen(false)} sx={{ color: 'zinc.500' }}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
           <Typography variant="subtitle2" sx={{ color: 'zinc.500', mb: 3 }}>Select vehicles to assign to <strong>{selectedCampaign?.brandName}</strong> campaign.</Typography>
           
           <Box sx={{ maxHeight: 400, overflowY: 'auto', pr: 1, '&::-webkit-scrollbar': { width: '4px' }, '&::-webkit-scrollbar-thumb': { bgcolor: '#333', borderRadius: 10 } }}>
             <FormGroup>
                {allVehicles.filter(v => v.status === 'Approved').length === 0 ? (
                  <Typography sx={{ color: 'zinc.600', textAlign: 'center', py: 4 }}>No approved vehicles available for assignment.</Typography>
                ) : (
                  allVehicles.filter(v => v.status === 'Approved').map((v) => (
                    <FormControlLabel
                      key={v._id}
                      control={
                        <Checkbox 
                          checked={selectedVehicleIds.includes(v._id)} 
                          onChange={(e) => {
                            if (e.target.checked) setSelectedVehicleIds([...selectedVehicleIds, v._id]);
                            else setSelectedVehicleIds(selectedVehicleIds.filter(id => id !== v._id));
                          }}
                          sx={{ color: '#333', '&.Mui-checked': { color: '#FACC15' } }}
                        />
                      }
                      label={
                         <Box sx={{ py: 1, display: 'flex', gap: 2, alignItems: 'center', width: '100%' }}>
                           <Box sx={{ width: 50, height: 40, borderRadius: 1, overflow: 'hidden', bgcolor: '#000', border: '1px solid #333', flexShrink: 0 }}>
                              <img src={v.images?.[0] || "https://placehold.co/50x40/000000/FACC15?text=V"} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                           </Box>
                           <Box sx={{ flex: 1, minWidth: 0 }}>

                              <Typography variant="body2" sx={{ fontWeight: 700, color: 'white' }}>{v.registrationNumber} ({v.make} {v.vehicleModel})</Typography>
                              <Typography variant="caption" sx={{ color: 'zinc.500' }}>Owner: {v.userId?.fullName} | {v.parkingLocation?.address || v.parkingLocation}</Typography>
                           </Box>
                           {selectedVehicleIds.includes(v._id) && (
                              <Chip label="SELECTED" size="small" sx={{ bgcolor: 'rgba(250, 204, 21, 0.1)', color: '#FACC15', fontWeight: 900, fontSize: '0.6rem' }} />
                           )}
                        </Box>
                      }
                      sx={{ width: '100%', ml: 0, borderBottom: '1px solid #222', '&:hover': { bgcolor: '#1A1A1A' } }}
                    />
                  ))
                )}
             </FormGroup>
           </Box>
        </DialogContent>
        <DialogActions sx={{ p: 4, pt: 2, borderTop: '1px solid #222' }}>
           <Button onClick={() => setAssignOpen(false)} sx={{ color: 'zinc.500', fontWeight: 800 }}>Cancel</Button>
           <Button 
            disabled={actionLoading} 
            onClick={handleAssignVehicles}
            variant="contained" 
            sx={{ bgcolor: '#FACC15', color: 'black', fontWeight: 900, px: 4, borderRadius: 2 }}
           >
             {actionLoading ? 'Syncing...' : `Sync ${selectedVehicleIds.length} Assignments`}
           </Button>
        </DialogActions>
      </Dialog>

      {/* Make Quote Dialog */}
      <Dialog 
        open={isQuoting} onClose={handleCloseQuoter} maxWidth="md" fullWidth 
        PaperProps={{ sx: { 
          bgcolor: '#1E1E1E', color: 'white', borderRadius: 1.5, border: '1px solid #333',
          backgroundImage: 'none'
        } }}
      >
        <DialogTitle component="div" sx={{ borderBottom: '1px solid #333', pb: 2, p: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 900 }}>Generate <span style={{ color: '#FACC15' }}>Quotation</span></Typography>
          <Typography variant="caption" sx={{ color: 'zinc.500', fontWeight: 700 }}>For Campaign: {selectedCampaign?.brandName} ({selectedCampaign?.adId})</Typography>
        </DialogTitle>
        <DialogContent sx={{ mt: 3, p: 4, '&::-webkit-scrollbar': { display: 'none' }, scrollbarWidth: 'none' }}>
          {selectedCampaign && (
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <Typography sx={{ color: 'zinc.500', fontSize: '0.75rem', fontWeight: 900, mb: 2, textTransform: 'uppercase', letterSpacing: 1 }}>Setup & One-Time Charges</Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField 
                      label="Design Charges" fullWidth type="number" size="small"
                      value={quoteData.designCharges} onChange={(e) => setQuoteData({...quoteData, designCharges: e.target.value})}
                      sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#000', color: 'white' } }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField 
                      label="Printing Charges" fullWidth type="number" size="small"
                      value={quoteData.printingCharges} onChange={(e) => setQuoteData({...quoteData, printingCharges: e.target.value})}
                      sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#000', color: 'white' } }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField 
                      label="Service Charges" fullWidth type="number" size="small"
                      value={quoteData.serviceCharges} onChange={(e) => setQuoteData({...quoteData, serviceCharges: e.target.value})}
                      sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#000', color: 'white' } }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField 
                      label="Transport Charges" fullWidth type="number" size="small"
                      value={quoteData.transportCharges} onChange={(e) => setQuoteData({...quoteData, transportCharges: e.target.value})}
                      sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#000', color: 'white' } }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField 
                      label="Installation Charges" fullWidth type="number" size="small"
                      value={quoteData.installationCharges} onChange={(e) => setQuoteData({...quoteData, installationCharges: e.target.value})}
                      sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#000', color: 'white' } }}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Divider sx={{ my: 2, borderColor: '#333' }} />
                <Typography sx={{ color: 'zinc.500', fontSize: '0.75rem', fontWeight: 900, mb: 2, textTransform: 'uppercase', letterSpacing: 1 }}>Recurring Rental Model</Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField 
                      label="Rental / KM" fullWidth type="number" size="small"
                      value={quoteData.rentalChargesPerKm} onChange={(e) => setQuoteData({...quoteData, rentalChargesPerKm: e.target.value})}
                      sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#000', color: 'white' } }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField 
                      label="Avg KM / Month" fullWidth type="number" size="small"
                      value={quoteData.averageKm} onChange={(e) => setQuoteData({...quoteData, averageKm: e.target.value})}
                      sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#000', color: 'white' } }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField 
                      select label="Duration" fullWidth size="small"
                      value={quoteData.duration} onChange={(e) => setQuoteData({...quoteData, duration: e.target.value})}
                      sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#000', color: 'white' } }}
                    >
                      <MenuItem value="3 months">3 Months</MenuItem>
                      <MenuItem value="6 months">6 Months</MenuItem>
                      <MenuItem value="1 year">1 Year</MenuItem>
                    </TextField>
                  </Grid>
                </Grid>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Typography sx={{ color: 'zinc.500', fontSize: '0.75rem', fontWeight: 900, mb: 1.5, textTransform: 'uppercase', mt: 2 }}>Calculation Breakdown</Typography>
                <TableContainer component={Paper} sx={{ bgcolor: '#000', border: '1px solid #222', backgroundImage: 'none' }}>
                   <Table size="small">
                      <TableHead sx={{ bgcolor: '#0A0A0A' }}>
                         <TableRow>
                            <TableCell sx={{ color: 'zinc.500', fontWeight: 800, fontSize: '0.7rem' }}>PARTICULARS</TableCell>
                            <TableCell sx={{ color: 'zinc.500', fontWeight: 800, fontSize: '0.7rem' }}>FORMULA / DETAILS</TableCell>
                            <TableCell sx={{ color: 'zinc.500', fontWeight: 800, fontSize: '0.7rem' }} align="right">AMOUNT</TableCell>
                         </TableRow>
                      </TableHead>
                      <TableBody>
                         <TableRow>
                            <TableCell sx={{ color: 'zinc.300', fontSize: '0.8rem' }}>One-Time Setup Fees</TableCell>
                            <TableCell sx={{ color: 'zinc.500', fontSize: '0.75rem' }}>Design + Print + Service + Install + Transport</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 700 }} align="right">₹{calculateTotal().oneTime.toLocaleString()}</TableCell>
                         </TableRow>
                         <TableRow>
                            <TableCell sx={{ color: 'zinc.300', fontSize: '0.8rem' }}>Recurring Rental</TableCell>
                            <TableCell sx={{ color: 'zinc.500', fontSize: '0.75rem' }}>₹{quoteData.rentalChargesPerKm} × {quoteData.averageKm} KM × {calculateTotal().vehicles} Units × {calculateTotal().months} Mo</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 700 }} align="right">₹{calculateTotal().recurring.toLocaleString()}</TableCell>
                         </TableRow>
                         <TableRow sx={{ bgcolor: 'rgba(255,255,255,0.02)' }}>
                            <TableCell colSpan={2} sx={{ color: 'white', fontWeight: 800, fontSize: '0.8rem' }}>Base Subtotal</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 800 }} align="right">₹{calculateTotal().subtotal.toLocaleString()}</TableCell>
                         </TableRow>
                      </TableBody>
                   </Table>
                </TableContainer>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Box sx={{ mt: 2, p: 3, bgcolor: '#000', borderRadius: 2, border: '1px solid #333' }}>
                  <Grid container alignItems="center" spacing={2}>
                    <Grid size={{ xs: 6 }}>
                       <Typography sx={{ color: 'zinc.400', fontWeight: 700 }}>Base Subtotal</Typography>
                       <Typography variant="h6" sx={{ color: 'white', fontWeight: 900 }}>₹{calculateTotal().subtotal.toLocaleString()}</Typography>
                    </Grid>
                    <Grid size={{ xs: 3 }}>
                       <Typography sx={{ color: 'zinc.400', fontWeight: 700 }}>GST ({quoteData.gst}%)</Typography>
                       <Typography variant="h6" sx={{ color: 'zinc.300', fontWeight: 800 }}>₹{calculateTotal().gst.toLocaleString()}</Typography>
                    </Grid>
                    <Grid size={{ xs: 3 }} sx={{ textAlign: 'right' }}>
                       <Typography sx={{ color: '#FACC15', fontWeight: 900, textTransform: 'uppercase', fontSize: '0.7rem' }}>Total Proposal</Typography>
                       <Typography variant="h5" sx={{ color: '#FACC15', fontWeight: 900 }}>₹{calculateTotal().total.toLocaleString()}</Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Typography sx={{ color: 'zinc.500', fontSize: '0.75rem', fontWeight: 900, mb: 1.5, textTransform: 'uppercase', mt: 1 }}>Campaign Notes (Visible on Quote)</Typography>
                <TextField 
                  fullWidth multiline rows={4} placeholder="Enter all custom terms, payment schedules, or special campaign conditions here..."
                  value={quoteData.notes} onChange={(e) => setQuoteData({...quoteData, notes: e.target.value})}
                  sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#000', color: 'zinc.300', fontSize: '0.9rem', lineHeight: 1.6 } }}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid #333' }}>
          <Button onClick={handleCloseQuoter} sx={{ color: 'zinc.500', fontWeight: 700 }}>Cancel</Button>
          <Button 
            variant="contained" 
            disabled={actionLoading}
            onClick={handleSaveQuote}
            startIcon={actionLoading ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
            sx={{ bgcolor: '#FACC15', color: 'black', fontWeight: 900, px: 4, borderRadius: 1.5, '&:hover': { bgcolor: '#FDE047' } }}
          >
            Update Quote
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Notification */}
      {/* Snackbar Notification */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%', bgcolor: snackbar.severity === 'success' ? '#1A1A1A' : undefined, color: snackbar.severity === 'success' ? '#4ADE80' : undefined, border: snackbar.severity === 'success' ? '1px solid #4ADE80' : undefined }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
