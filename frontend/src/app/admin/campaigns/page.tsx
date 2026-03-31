'use client';
import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Card, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Chip, CircularProgress, Divider, 
  TablePagination, Button, Grid, Stack, IconButton, Tooltip, Dialog, 
  DialogTitle, DialogContent, DialogActions, Alert, Checkbox, FormControlLabel,
  FormGroup, Snackbar
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import BusinessIcon from '@mui/icons-material/Business';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';

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
      const res = await fetch('http://localhost:5000/api/advertiser/all', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setCampaigns(data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchVehicles = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/fleet/all', {
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
      const res = await fetch(`http://localhost:5000/api/advertiser/status/${id}`, {
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
      const res = await fetch('http://localhost:5000/api/advertiser/assign-vehicles', {
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

      <Card sx={{ bgcolor: '#121212', border: '1px solid #333', borderRadius: 4, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#1A1A1A' }}>
              <TableRow>
                <TableCell sx={{ color: '#A1A1AA', fontWeight: 'bold' }}>Brand Name</TableCell>
                <TableCell sx={{ color: '#A1A1AA', fontWeight: 'bold' }}>Advertiser</TableCell>
                <TableCell sx={{ color: '#A1A1AA', fontWeight: 'bold' }}>Vehicles</TableCell>
                <TableCell sx={{ color: '#A1A1AA', fontWeight: 'bold' }}>Budget (Est)</TableCell>
                <TableCell sx={{ color: '#A1A1AA', fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ color: '#A1A1AA', fontWeight: 'bold' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={6} sx={{ textAlign: 'center', py: 6 }}><CircularProgress color="warning" /></TableCell></TableRow>
              ) : campaigns.length === 0 ? (
                <TableRow><TableCell colSpan={6} sx={{ textAlign: 'center', py: 6, color: 'zinc.600' }}>No campaign requests found.</TableCell></TableRow>
              ) : (
                campaigns.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((c) => (
                  <TableRow key={c._id} sx={{ '&:hover': { bgcolor: '#1A1A1A' } }}>
                    <TableCell sx={{ color: 'white', fontWeight: 700 }}>{c.brandName}</TableCell>
                    <TableCell>
                      <Typography sx={{ color: 'zinc.300', fontSize: '0.85rem', fontWeight: 600 }}>{c.userId?.fullName}</Typography>
                      <Typography sx={{ color: 'zinc.500', fontSize: '0.75rem' }}>{c.userId?.email}</Typography>
                    </TableCell>
                    <TableCell sx={{ color: 'zinc.300', fontWeight: 700 }}>{c.numberOfVehicles} Units</TableCell>
                    <TableCell sx={{ color: '#FACC15', fontWeight: 900 }}>₹ {(c.rentalChargesPerKm * c.averageKm || 0).toLocaleString('en-IN')}</TableCell>
                    <TableCell>
                       <Chip 
                          label={c.status || 'PENDING'} 
                          size="small" 
                          sx={{ 
                            bgcolor: c.status === 'ACTIVE' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(250, 204, 21, 0.1)', 
                            color: c.status === 'ACTIVE' ? '#4ADE80' : '#FACC15', 
                            fontWeight: 'bold' 
                          }} 
                        />
                    </TableCell>
                    <TableCell>
                       <Stack direction="row" spacing={1}>
                          <Tooltip title="Review Campaign">
                            <IconButton onClick={() => { setSelectedCampaign(c); setViewOpen(true); }} sx={{ color: 'zinc.500', '&:hover': { color: '#FACC15' } }}>
                              <VisibilityIcon />
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
        PaperProps={{ sx: { bgcolor: '#121212', color: 'white', borderRadius: 4, border: '1px solid #333' } }}
      >
        <DialogTitle sx={{ p: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #222' }}>
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
                      <Grid item xs={12} md={4}><InfoBlock label="Full Name" value={selectedCampaign.userId?.fullName} /></Grid>
                      <Grid item xs={12} md={4}><InfoBlock label="Brand" value={selectedCampaign.brandName} /></Grid>
                      <Grid item xs={12} md={4}><InfoBlock label="Category" value={selectedCampaign.businessCategory} /></Grid>
                      <Grid item xs={12} md={4}><InfoBlock label="Email" value={selectedCampaign.userId?.email} /></Grid>
                      <Grid item xs={12} md={4}><InfoBlock label="Contact" value={selectedCampaign.userId?.mobileNumber} /></Grid>
                   </Grid>
                </Box>
                
                <Divider sx={{ borderColor: '#222' }} />

                <Box>
                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                      <GpsFixedIcon sx={{ color: '#FACC15' }} />
                      <Typography variant="h6" sx={{ fontWeight: 800 }}>Campaign Scope</Typography>
                   </Box>
                   <Grid container spacing={3}>
                      <Grid item xs={12} md={4}><InfoBlock label="Operating Location" value={selectedCampaign.operatingLocation} /></Grid>
                      <Grid item xs={12} md={4}><InfoBlock label="Target Vehicles" value={`${selectedCampaign.numberOfVehicles} ${selectedCampaign.targetVehicleType} units`} /></Grid>
                      <Grid item xs={12} md={4}><InfoBlock label="Reach" value={`${selectedCampaign.averageRunningLocation?.pin} (+${selectedCampaign.averageRunningLocation?.radius}km)`} /></Grid>
                   </Grid>
                </Box>
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
        PaperProps={{ sx: { bgcolor: '#121212', color: 'white', borderRadius: 4, border: '1px solid #333' } }}
      >
        <DialogTitle sx={{ p: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #222' }}>
           <Typography variant="h5" sx={{ fontWeight: 900, textTransform: 'uppercase' }}>Assign <span style={{ color: '#FACC15' }}>Vehicles</span></Typography>
           <IconButton onClick={() => setAssignOpen(false)} sx={{ color: 'zinc.500' }}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
           <Typography variant="subtitle2" sx={{ color: 'zinc.500', mb: 3 }}>Select vehicles to assign to <strong>{selectedCampaign?.brandName}</strong> campaign.</Typography>
           
           <Box sx={{ maxHeight: 400, overflowY: 'auto', pr: 1, '&::-webkit-scrollbar': { width: '4px' }, '&::-webkit-scrollbar-thumb': { bgcolor: '#333', borderRadius: 10 } }}>
             <FormGroup>
                {allVehicles.filter(v => v.status === 'Verified').length === 0 ? (
                  <Typography sx={{ color: 'zinc.600', textAlign: 'center', py: 4 }}>No verified vehicles available for assignment.</Typography>
                ) : (
                  allVehicles.filter(v => v.status === 'Verified').map((v) => (
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
                        <Box sx={{ py: 1, display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                           <Box>
                              <Typography variant="body2" sx={{ fontWeight: 700, color: 'white' }}>{v.registrationNumber} ({v.make} {v.vehicleModel})</Typography>
                              <Typography variant="caption" sx={{ color: 'zinc.500' }}>Owner: {v.userId?.fullName} | {v.parkingLocation}</Typography>
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
