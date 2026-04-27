'use client';
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const MapPicker = dynamic(() => import('../../../components/MapPicker'), { 
  ssr: false,
  loading: () => <Box sx={{ height: 250, bgcolor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CircularProgress size={20} /></Box>
});
import { 
  Box, Typography, Card, Button, Chip, 
  CircularProgress, IconButton, Tooltip, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, TablePagination, Dialog, DialogTitle,
  DialogContent, DialogActions, Grid, Divider, Stack, TextField,
  MenuItem, Checkbox, FormControlLabel, FormGroup, Autocomplete, Paper, Avatar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import BusinessIcon from '@mui/icons-material/Business';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Link from 'next/link';

const AD_OPTIONS = ['Left doors', 'Right doors', 'front bonnet', 'Rear door', 'Roof carrier handles'];

export default function MyAdvertisementsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);

  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [assignedVehicles, setAssignedVehicles] = useState<any[]>([]);
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [vehicleDetailsOpen, setVehicleDetailsOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Location States
  const [locationOptions, setLocationOptions] = useState<any[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState<{lat: string, lon: string} | null>(null);

  const [editFormData, setEditFormData] = useState({
    brandName: '',
    businessCategory: '',
    operatingLocation: '',
    targetVehicleType: 'Passenger',
    numberOfVehicles: 0,
    startDate: '',
    adOptions: [] as string[],
    averageRunningLocation: { pin: '', radius: 5 },
    duration: '3 months',
    adImages: [] as string[],
    adDimensions: { length: '', width: '' }
  });

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaignVehicles = async (campaignId: string) => {
    setLoadingVehicles(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/fleet/campaign/${campaignId}/vehicles`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setAssignedVehicles(data.data);
      }
    } catch (err) { console.error(err); }
    finally { setLoadingVehicles(false); }
  };

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

  const fieldStyle = {
    '& .MuiOutlinedInput-root': {
      bgcolor: '#1E1E1E', '& fieldset': { borderColor: '#333' },
      '&:hover fieldset': { borderColor: '#444' },
      '&.Mui-focused fieldset': { borderColor: '#FACC15' },
      color: 'white', borderRadius: 2
    },
    '& .MuiInputLabel-root': { color: '#A1A1AA' },
    '& .MuiInputBase-input': { p: '12px 14px' }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const handleEditOpen = (campaign: any) => {
    setSelectedCampaign(campaign);
    setEditFormData({
      brandName: campaign.brandName || '',
      businessCategory: campaign.businessCategory || '',
      operatingLocation: campaign.operatingLocation || '',
      targetVehicleType: campaign.targetVehicleType || 'Passenger',
      numberOfVehicles: campaign.numberOfVehicles || 0,
      startDate: campaign.startDate ? new Date(campaign.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      adOptions: campaign.adOptions || [],
      averageRunningLocation: { 
        pin: campaign.averageRunningLocation?.pin || '', 
        radius: campaign.averageRunningLocation?.radius || 5 
      },
      duration: campaign.duration || '3 months',
      adImages: campaign.adImages || [],
      adDimensions: campaign.adDimensions || { length: '', width: '' }
    });
    setEditOpen(true);
  };

  const searchLocations = async (query: string) => {
    if (!query || query.length < 3) return;
    setLoadingLocations(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/fleet/search-location?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setLocationOptions(data.map((item: any) => ({
        label: item.display_name,
        value: item.display_name,
        lat: item.lat,
        lon: item.lon
      })));
    } catch (err) { console.error(err); }
    finally { setLoadingLocations(false); }
  };

  const reverseGeocode = async (lat: number, lon: number) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/fleet/reverse-geocode?lat=${lat}&lon=${lon}`);
      const data = await res.json();
      if (data && data.display_name) {
        setEditFormData(prev => ({ ...prev, operatingLocation: data.display_name }));
        setSelectedCoords({ lat: String(lat), lon: String(lon) });
      }
    } catch (err) { console.error(err); }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setUploading(true);
    const files = Array.from(e.target.files);
    const urls: string[] = [];

    await Promise.all(files.map(async (file) => {
      const fd = new FormData();
      fd.append('file', file);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/fleet/upload`, { method: 'POST', body: fd });
        const data = await res.json();
        if (data.secure_url) urls.push(data.secure_url);
      } catch (err) { console.error(err); }
    }));

    setEditFormData(prev => ({ ...prev, adImages: [...prev.adImages, ...urls] }));
    setUploading(false);
  };

  const handleToggleEditAdOption = (opt: string) => {
    setEditFormData(prev => ({
      ...prev,
      adOptions: prev.adOptions.includes(opt) 
        ? prev.adOptions.filter(o => o !== opt) 
        : [...prev.adOptions, opt]
    }));
  };

  const handleUpdate = async () => {
    if (!selectedCampaign?._id) return;
    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/advertiser/update/${selectedCampaign._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(editFormData)
      });
      const data = await res.json();
      if (data.success) {
        setCampaigns(prev => prev.map(c => c._id === selectedCampaign._id ? { ...c, ...editFormData } : c));
        setEditOpen(false);
      }
    } catch (err) { 
      console.error(err);
      alert('Error updating campaign');
    }
    finally { setActionLoading(false); }
  };

  const VehicleInfoBlock = ({ label, value }: { label: string, value: any }) => (
    <Box sx={{ mb: 1 }}>
      <Typography variant="caption" sx={{ color: '#FACC15', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.6rem' }}>{label}</Typography>
      <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>{value || 'N/A'}</Typography>
    </Box>
  );

  const renderVehicleOverview = (v: any) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
       <Box>
          <Typography variant="caption" sx={{ color: '#FACC15', fontWeight: 800, mb: 1, display: 'block' }}>VEHICLE PHOTOS</Typography>
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            {(v.images || []).map((img: string, i: number) => (
              <Paper key={i} sx={{ width: 120, height: 90, overflow: 'hidden', borderRadius: 2, border: '1px solid #333' }}>
                <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </Paper>
            ))}
          </Box>
       </Box>
       <Divider sx={{ borderColor: '#222' }} />
       <Grid container spacing={2}>
          <Grid size={{ xs: 6 }}><VehicleInfoBlock label="Registration" value={v.registrationNumber} /></Grid>
          <Grid size={{ xs: 6 }}><VehicleInfoBlock label="Make / Model" value={`${v.make} ${v.vehicleModel}`} /></Grid>
          <Grid size={{ xs: 6 }}><VehicleInfoBlock label="Category" value={v.vehicleCategory} /></Grid>
          <Grid size={{ xs: 6 }}><VehicleInfoBlock label="Fuel Type" value={v.fuelType} /></Grid>
       </Grid>
       <Divider sx={{ borderColor: '#222' }} />
       <Box>
          <Typography variant="caption" sx={{ color: '#FACC15', fontWeight: 800, mb: 1, display: 'block' }}>AD SPACE PHOTOS</Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {v.adOptionImages && Object.entries(v.adOptionImages).map(([opt, url]: any) => (
              <Tooltip key={opt} title={opt}>
                <Paper sx={{ width: 80, height: 60, overflow: 'hidden', borderRadius: 1.5, border: '1px solid #333' }}>
                  <img src={url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </Paper>
              </Tooltip>
            ))}
          </Box>
       </Box>
    </Box>
  );

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
           <Button variant="contained" startIcon={<AddIcon />} sx={{ bgcolor: '#FACC15', color: 'black', fontWeight: 900, px: 4, py: 1.5, borderRadius: 1 }}>
              LAUNCH NEW REQUEST
           </Button>
        </Link>
      </Box>

      <Card sx={{ bgcolor: '#121212', border: '1px solid #333', borderRadius: 1.5, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#1A1A1A' }}>
              <TableRow>
                <TableCell sx={{ color: '#A1A1AA', fontWeight: 'bold' }}>#ID</TableCell>
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
                <TableRow><TableCell colSpan={8} sx={{ textAlign: 'center', py: 6 }}><CircularProgress color="warning" /></TableCell></TableRow>
              ) : campaigns.length === 0 ? (
                <TableRow><TableCell colSpan={8} sx={{ textAlign: 'center', py: 10 }}>
                  <Typography sx={{ color: 'zinc.600' }}>You haven&apos;t requested any advertisements yet.</Typography>
                </TableCell></TableRow>
              ) : (
                campaigns.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((c) => (
                  <TableRow key={c._id} sx={{ '&:hover': { bgcolor: '#1A1A1A' } }}>
                    <TableCell sx={{ color: 'zinc.500', fontSize: '0.75rem', fontWeight: 700 }}>
                       #{c.adId || c._id?.slice(-6).toUpperCase()}
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ color: 'white', fontWeight: 700 }}>{c.brandName}</Typography>
                      <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                        <Typography variant="caption" sx={{ color: 'zinc.500' }}>Req: {formatDate(c.createdAt)}</Typography>
                        <Typography variant="caption" sx={{ color: '#FACC15', fontWeight: 700 }}>Start: {formatDate(c.startDate)}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: 'zinc.300', fontSize: '0.85rem', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                       <Tooltip title={c.operatingLocation}>
                          <span>{c.operatingLocation}</span>
                       </Tooltip>
                    </TableCell>
                    <TableCell sx={{ color: 'zinc.300' }}>{c.targetVehicleType}</TableCell>
                    <TableCell sx={{ color: '#FACC15', fontWeight: 800 }}>{c.numberOfVehicles} Units</TableCell>
                    <TableCell sx={{ color: '#FACC15', fontWeight: 800 }}>
                      {c.quotedPrice > 0 ? (
                        <Box>
                          <Typography sx={{ fontWeight: 900, color: '#4ADE80' }}>₹ {c.quotedPrice.toLocaleString('en-IN')}</Typography>
                          <Typography variant="caption" sx={{ color: 'zinc.600', fontSize: '0.6rem', display: 'block', mt: -0.5 }}>OFFICIAL QUOTE</Typography>
                        </Box>
                      ) : (
                        <Box>
                          <Typography sx={{ fontWeight: 900, color: '#4ADE80' }}>₹ {(c.rentalChargesPerKm * c.averageKm * (c.numberOfVehicles || 1)).toLocaleString('en-IN')}</Typography>
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
                            fontWeight: 800 
                          }} 
                        />
                    </TableCell>
                     <TableCell>
                        <Stack direction="row" spacing={0.5}>
                          <Tooltip title="View Overview">
                            <IconButton onClick={() => { setSelectedCampaign(c); setViewOpen(true); fetchCampaignVehicles(c._id); }} sx={{ color: 'zinc.600', '&:hover': { color: '#FACC15' } }}>
                                <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit Campaign">
                            <IconButton onClick={() => handleEditOpen(c)} sx={{ color: 'zinc.600', '&:hover': { color: '#FACC15' } }}>
                                <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
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
        PaperProps={{ sx: { bgcolor: '#121212', color: 'white', borderRadius: 1.5, border: '1px solid #333' } }}
      >
        <DialogTitle component="div" sx={{ p: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #222' }}>
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
                      <Grid size={{ xs: 12, md: 4 }}><InfoBlock label="Brand Name" value={selectedCampaign.brandName} /></Grid>
                      <Grid size={{ xs: 12, md: 4 }}><InfoBlock label="Category" value={selectedCampaign.businessCategory} /></Grid>
                      <Grid size={{ xs: 12, md: 4 }}><InfoBlock label="Operating Location" value={selectedCampaign.operatingLocation} /></Grid>
                   </Grid>
                </Box>
                <Divider sx={{ borderColor: '#222' }} />
                <Box>
                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                      <GpsFixedIcon sx={{ color: '#FACC15' }} />
                      <Typography variant="h6" sx={{ fontWeight: 800 }}>Distribution & Target</Typography>
                   </Box>
                   <Grid container spacing={3}>
                      <Grid size={{ xs: 12, md: 4 }}><InfoBlock label="Vehicle Category" value={selectedCampaign.targetVehicleType} /></Grid>
                      <Grid size={{ xs: 12, md: 4 }}><InfoBlock label="Target Reach" value={`${selectedCampaign.numberOfVehicles} Vehicles`} /></Grid>
                      <Grid size={{ xs: 12, md: 4 }}><InfoBlock label="Target Pin / Radius" value={`${selectedCampaign.averageRunningLocation?.pin} (${selectedCampaign.averageRunningLocation?.radius} KM)`} /></Grid>
                      <Grid size={{ xs: 12 }}><InfoBlock label="Placement Options" value={selectedCampaign.adOptions?.join(', ')} /></Grid>
                   </Grid>
                </Box>
                <Divider sx={{ borderColor: '#222' }} />
                <Box>
                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                      <DirectionsCarIcon sx={{ color: '#FACC15' }} />
                      <Typography variant="h6" sx={{ fontWeight: 800 }}>Participating Fleet / Vehicles</Typography>
                   </Box>
                   
                   {loadingVehicles ? (
                     <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress size={24} color="warning" /></Box>
                   ) : assignedVehicles.length > 0 ? (
                     <Grid container spacing={2}>
                        {assignedVehicles.map((v: any) => (
                           <Grid size={{ xs: 12, sm: 6, md: 4 }} key={v._id}>
                              <Paper 
                                 onClick={() => { setSelectedVehicle(v); setVehicleDetailsOpen(true); }}
                                 sx={{ 
                                    p: 2, bgcolor: '#1A1A1A', border: '1px solid #333', borderRadius: 2, 
                                    display: 'flex', gap: 2, alignItems: 'center', cursor: 'pointer',
                                    transition: '0.2s', '&:hover': { borderColor: '#FACC15', bgcolor: '#222' }
                                 }}
                              >
                                 <Avatar variant="rounded" src={v.images?.[0]} sx={{ width: 50, height: 40, bgcolor: '#333' }}>V</Avatar>
                                 <Box>
                                    <Typography variant="body2" sx={{ color: 'white', fontWeight: 800 }}>{v.registrationNumber}</Typography>
                                    <Typography variant="caption" sx={{ color: 'zinc.500', fontSize: '0.65rem' }}>{v.make} {v.vehicleModel}</Typography>
                                 </Box>
                                 <Chip label={v.campaignStatus} size="small" sx={{ ml: 'auto', bgcolor: v.campaignStatus === 'ACCEPTED' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(250, 204, 21, 0.1)', color: v.campaignStatus === 'ACCEPTED' ? '#4ADE80' : '#FACC15', fontWeight: 900, fontSize: '0.55rem', height: 20 }} />
                              </Paper>
                           </Grid>
                        ))}
                     </Grid>
                   ) : (
                     <Box sx={{ p: 4, bgcolor: '#000', borderRadius: 2, border: '1px dashed #222', textAlign: 'center' }}>
                        <Typography sx={{ color: 'zinc.600', fontStyle: 'italic' }}>No vehicles have been linked to this campaign yet.</Typography>
                        <Typography variant="caption" sx={{ color: 'zinc.700' }}>Admin will allot vehicles once they are verified.</Typography>
                     </Box>
                   )}
                </Box>
                <Divider sx={{ borderColor: '#222' }} />
                <Box>
                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                      <AssessmentIcon sx={{ color: '#FACC15' }} />
                      <Typography variant="h6" sx={{ fontWeight: 800 }}>Budget & Duration</Typography>
                   </Box>
                   <Grid container spacing={3}>
                      <Grid size={{ xs: 6, md: 3 }}><InfoBlock label="Rental/KM" value={`₹ ${selectedCampaign.rentalChargesPerKm}`} /></Grid>
                      <Grid size={{ xs: 6, md: 3 }}><InfoBlock label="Expected Avg KM" value={selectedCampaign.averageKm} /></Grid>
                      <Grid size={{ xs: 6, md: 3 }}><InfoBlock label="Duration" value={selectedCampaign.duration} /></Grid>
                      <Grid size={{ xs: 6, md: 3 }}><InfoBlock label="GST" value={`${selectedCampaign.gst}%`} /></Grid>
                   </Grid>
                   
                   <Box sx={{ mt: 3, p: 3, bgcolor: '#1A1A1A', borderRadius:3, border: '1px solid #222' }}>
                       <Typography sx={{ color: 'zinc.500', fontSize: '0.75rem', fontWeight: 900, mb: 1.5, textTransform: 'uppercase' }}>Calculation Breakdown</Typography>
                       <Box sx={{ mb: 4, bgcolor: '#000', borderRadius: 2, border: '1px solid #333', overflow: 'hidden' }}>
                          <Table size="small">
                             <TableHead sx={{ bgcolor: '#111' }}>
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
                                   <TableCell sx={{ color: 'white', fontWeight: 700 }} align="right">
                                      ₹ {(selectedCampaign.designCharges + selectedCampaign.printingCharges + selectedCampaign.serviceCharges + selectedCampaign.installationCharges + selectedCampaign.transportCharges).toLocaleString('en-IN')}
                                   </TableCell>
                                </TableRow>
                                <TableRow>
                                   <TableCell sx={{ color: 'zinc.300', fontSize: '0.8rem' }}>Recurring Rental</TableCell>
                                   <TableCell sx={{ color: 'zinc.500', fontSize: '0.75rem' }}>
                                      ₹{selectedCampaign.rentalChargesPerKm} × {selectedCampaign.averageKm} KM × {selectedCampaign.numberOfVehicles} Units × {parseInt(selectedCampaign.duration) || 1} Mo
                                   </TableCell>
                                   <TableCell align="right" sx={{ color: 'white', fontWeight: 700 }}>
                                      ₹ {(selectedCampaign.rentalChargesPerKm * selectedCampaign.averageKm * selectedCampaign.numberOfVehicles * (parseInt(selectedCampaign.duration) || 1)).toLocaleString('en-IN')}
                                   </TableCell>
                                </TableRow>
                                <TableRow sx={{ bgcolor: 'rgba(255,255,255,0.02)' }}>
                                   <TableCell colSpan={2} sx={{ color: 'white', fontWeight: 800, fontSize: '0.8rem' }}>Base Subtotal</TableCell>
                                   <TableCell align="right" sx={{ color: 'white', fontWeight: 800 }}>
                                      ₹ {(
                                        (selectedCampaign.designCharges + selectedCampaign.printingCharges + selectedCampaign.serviceCharges + selectedCampaign.installationCharges + selectedCampaign.transportCharges) + 
                                        (selectedCampaign.rentalChargesPerKm * selectedCampaign.averageKm * selectedCampaign.numberOfVehicles * (parseInt(selectedCampaign.duration) || 1))
                                      ).toLocaleString('en-IN')}
                                   </TableCell>
                                </TableRow>
                             </TableBody>
                          </Table>
                       </Box>

                       {/* Setup Details (Mini-Grid) */}
                       {(selectedCampaign.designCharges > 0 || selectedCampaign.printingCharges > 0 || selectedCampaign.serviceCharges > 0) && (
                         <Box sx={{ mb: 4 }}>
                            <Typography variant="caption" sx={{ color: 'zinc.500', fontWeight: 900, mb: 2, display: 'block', textTransform: 'uppercase', letterSpacing: 1 }}>Setup Fee Breakdown</Typography>
                            <Grid container spacing={2}>
                               {selectedCampaign.designCharges > 0 && <Grid size={{ xs: 6, md: 3 }}><InfoBlock label="Design" value={`₹ ${selectedCampaign.designCharges}`} /></Grid>}
                               {selectedCampaign.printingCharges > 0 && <Grid size={{ xs: 6, md: 3 }}><InfoBlock label="Printing" value={`₹ ${selectedCampaign.printingCharges}`} /></Grid>}
                               {selectedCampaign.serviceCharges > 0 && <Grid size={{ xs: 6, md: 3 }}><InfoBlock label="Service" value={`₹ ${selectedCampaign.serviceCharges}`} /></Grid>}
                               {selectedCampaign.installationCharges > 0 && <Grid size={{ xs: 6, md: 3 }}><InfoBlock label="Installation" value={`₹ ${selectedCampaign.installationCharges}`} /></Grid>}
                            </Grid>
                            <Divider sx={{ my: 2, borderColor: '#222' }} />
                         </Box>
                       )}<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box>
                             <Typography variant="body2" sx={{ color: 'zinc.500', fontWeight: 800 }}>{selectedCampaign.quotedPrice > 0 ? 'OFFICIAL QUOTED TOTAL' : 'TOTAL MONTHLY ESTIMATE'}</Typography>
                             <Typography variant="h4" sx={{ color: '#4ADE80', fontWeight: 900, mt: 1 }}>
                                ₹ {selectedCampaign.quotedPrice > 0 
                                   ? selectedCampaign.quotedPrice.toLocaleString('en-IN') 
                                   : (selectedCampaign.rentalChargesPerKm * selectedCampaign.averageKm * selectedCampaign.numberOfVehicles * (1 + selectedCampaign.gst/100)).toLocaleString('en-IN')}
                             </Typography>
                             {selectedCampaign.quotedPrice > 0 && (
                               <Typography variant="caption" sx={{ color: 'zinc.500', mt: 0.5, display: 'block' }}>Includes all recurring & setup charges + GST</Typography>
                             )}
                          </Box>
                          <Box sx={{ textAlign: 'right' }}>
                              <Chip label={selectedCampaign.status} sx={{ bgcolor: 'rgba(250, 204, 21, 0.1)', color: '#FACC15', fontWeight: 800 }} />
                              <Typography variant="caption" sx={{ color: 'zinc.600', display: 'block', mt: 1 }}>Requested on: {formatDate(selectedCampaign.createdAt)}</Typography>
                          </Box>
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

      {/* Edit Dialog */}
      <Dialog 
        open={editOpen} onClose={() => setEditOpen(false)} maxWidth="md" fullWidth 
        PaperProps={{ sx: { bgcolor: '#121212', color: 'white', borderRadius: 1.5, border: '1px solid #333' } }}
      >
        <DialogTitle sx={{ p: 3, borderBottom: '1px solid #222' }}>
          <Typography variant="h6" sx={{ fontWeight: 900 }}>Edit <span style={{ color: '#FACC15' }}>Advertisement</span></Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 4, mt: 2, '&::-webkit-scrollbar': { display: 'none' }, scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
           <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              
              {/* Brand Info */}
              <Box>
                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                    <BusinessIcon sx={{ color: '#FACC15' }} />
                    <Typography variant="body2" sx={{ color: '#FACC15', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.5 }}>Business Identity</Typography>
                 </Box>
                 <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                       <TextField fullWidth label="Brand Name" value={editFormData.brandName} onChange={(e) => setEditFormData({...editFormData, brandName: e.target.value})} sx={fieldStyle} InputLabelProps={{ shrink: true }} />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                       <TextField fullWidth label="Business Category" value={editFormData.businessCategory} onChange={(e) => setEditFormData({...editFormData, businessCategory: e.target.value})} sx={fieldStyle} InputLabelProps={{ shrink: true }} />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                       <Autocomplete
                          fullWidth freeSolo options={locationOptions} loading={loadingLocations}
                          value={editFormData.operatingLocation}
                          onInputChange={(e, value) => { setEditFormData(prev => ({ ...prev, operatingLocation: value })); searchLocations(value); }}
                          onChange={(e, value: any) => {
                            const label = typeof value === 'string' ? value : value?.label;
                            if (label) {
                              setEditFormData(prev => ({ ...prev, operatingLocation: label }));
                              if (value?.lat && value?.lon) setSelectedCoords({ lat: value.lat, lon: value.lon });
                            }
                          }}
                          ListboxProps={{ sx: { bgcolor: '#121212', color: 'white', '& .MuiAutocomplete-option': { borderBottom: '1px solid #222', fontSize: '0.85rem', py: 1.5 } } }}
                          renderInput={(params) => (
                            <TextField {...params} fullWidth label="Operating Location" sx={fieldStyle} InputLabelProps={{ shrink: true }} />
                          )}
                       />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <Box sx={{ width: '100%', height: 250, borderRadius: 2, overflow: 'hidden', border: '1px solid #333', bgcolor: '#000' }}>
                           <MapPicker 
                             lat={selectedCoords ? Number(selectedCoords.lat) : 0} 
                             lng={selectedCoords ? Number(selectedCoords.lon) : 0} 
                             onLocationSelect={(lat, lng) => reverseGeocode(lat, lng)}
                           />
                        </Box>
                    </Grid>
                 </Grid>
              </Box>

              <Divider sx={{ borderColor: '#222' }} />

              {/* Targeting */}
              <Box>
                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                    <GpsFixedIcon sx={{ color: '#FACC15' }} />
                    <Typography variant="body2" sx={{ color: '#FACC15', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.5 }}>Targeting & Reach</Typography>
                 </Box>
                 <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 4 }}>
                       <TextField select fullWidth label="Vehicle Category" value={editFormData.targetVehicleType} onChange={(e) => setEditFormData({...editFormData, targetVehicleType: e.target.value})} sx={fieldStyle}>
                          <MenuItem value="Passenger">Passenger Fleet</MenuItem>
                          <MenuItem value="Goods">Goods Transport</MenuItem>
                          <MenuItem value="Auto Rickshaw">Auto Rickshaw</MenuItem>
                          <MenuItem value="Bus">Public Transport</MenuItem>
                       </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                       <TextField select fullWidth label="Duration" value={editFormData.duration} onChange={(e) => setEditFormData({...editFormData, duration: e.target.value})} sx={fieldStyle}>
                          <MenuItem value="3 months">3 Months</MenuItem>
                          <MenuItem value="6 months">6 Months</MenuItem>
                          <MenuItem value="1 year">1 Year</MenuItem>
                       </TextField>
                    </Grid>
                    <Grid size={{ xs: 6, md: 2 }}>
                       <TextField fullWidth type="number" label="Qty" value={editFormData.numberOfVehicles} onChange={(e) => setEditFormData({...editFormData, numberOfVehicles: Number(e.target.value)})} sx={fieldStyle} InputLabelProps={{ shrink: true }} />
                    </Grid>
                    <Grid size={{ xs: 6, md: 2 }}>
                       <TextField fullWidth type="date" label="Start Date" value={editFormData.startDate} onChange={(e) => setEditFormData({...editFormData, startDate: e.target.value})} sx={fieldStyle} InputLabelProps={{ shrink: true }} />
                    </Grid>
                 </Grid>

                 <Box sx={{ mt: 3 }}>
                    <Typography variant="caption" sx={{ color: 'zinc.500', display: 'block', mb: 1.5, fontWeight: 700 }}>AD PLACEMENT OPTIONS</Typography>
                    <FormGroup sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 1 }}>
                       {AD_OPTIONS.map(opt => (
                         <FormControlLabel key={opt} control={<Checkbox checked={editFormData.adOptions.includes(opt)} onChange={() => handleToggleEditAdOption(opt)} sx={{ color: '#333', '&.Mui-checked': { color: '#FACC15' } }} />} label={<Typography variant="body2" sx={{ color: 'zinc.300' }}>{opt}</Typography>} />
                       ))}
                    </FormGroup>
                 </Box>

                 <Grid container spacing={3} sx={{ mt: 1 }}>
                    <Grid size={{ xs: 12, md: 6 }}>
                       <TextField fullWidth label="Target PIN" value={editFormData.averageRunningLocation.pin} onChange={(e) => setEditFormData({...editFormData, averageRunningLocation: {...editFormData.averageRunningLocation, pin: e.target.value}})} sx={fieldStyle} InputLabelProps={{ shrink: true }} />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                       <TextField select fullWidth label="Operating Radius" value={editFormData.averageRunningLocation.radius} onChange={(e) => setEditFormData({...editFormData, averageRunningLocation: {...editFormData.averageRunningLocation, radius: Number(e.target.value)}})} sx={fieldStyle}>
                          {[5, 10, 20, 50, 100].map(v => <MenuItem key={v} value={v}>{v} KM Radius</MenuItem>)}
                       </TextField>
                    </Grid>
                 </Grid>
              </Box>

              <Divider sx={{ borderColor: '#222' }} />

              {/* Creatives */}
              <Box>
                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                    <CloudUploadIcon sx={{ color: '#FACC15' }} />
                    <Typography variant="body2" sx={{ color: '#FACC15', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.5 }}>Creatives & Size</Typography>
                 </Box>
                 <Grid container spacing={4}>
                    <Grid size={{ xs: 12, md: 7 }}>
                       <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                          {editFormData.adImages.map((img, i) => (
                             <Box key={i} sx={{ position: 'relative', width: 80, height: 80, borderRadius: 2, overflow: 'hidden', border: '1px solid #333' }}>
                                <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <IconButton size="small" onClick={() => setEditFormData(prev => ({ ...prev, adImages: prev.adImages.filter((_, idx) => idx !== i) }))} sx={{ position: 'absolute', top: 2, right: 2, bgcolor: 'rgba(255,0,0,0.8)', color: 'white', p: 0.1 }}><CloseIcon sx={{ fontSize: 12 }} /></IconButton>
                             </Box>
                          ))}
                          <Button variant="outlined" component="label" sx={{ width: 80, height: 80, border: '2px dashed #444', color: 'zinc.500', display: 'flex', flexDirection: 'column' }}>
                             {uploading ? <CircularProgress size={20} color="inherit" /> : <><CloudUploadIcon /><Typography variant="caption" sx={{ fontSize: '0.5rem' }}>UPLOAD</Typography></>}
                             <input type="file" hidden multiple onChange={handleImageUpload} />
                          </Button>
                       </Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 5 }}>
                       <Stack direction="row" spacing={2} alignItems="center">
                          <TextField fullWidth placeholder="Length" value={editFormData.adDimensions.length} onChange={(e) => setEditFormData({...editFormData, adDimensions: {...editFormData.adDimensions, length: e.target.value}})} sx={fieldStyle} />
                          <Typography sx={{ color: 'zinc.500' }}>X</Typography>
                          <TextField fullWidth placeholder="Width" value={editFormData.adDimensions.width} onChange={(e) => setEditFormData({...editFormData, adDimensions: {...editFormData.adDimensions, width: e.target.value}})} sx={fieldStyle} />
                       </Stack>
                    </Grid>
                 </Grid>
              </Box>
           </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid #222' }}>
           <Button onClick={() => setEditOpen(false)} sx={{ color: 'zinc.500', fontWeight: 800 }}>Cancel</Button>
           <Button 
            variant="contained" 
            onClick={handleUpdate} 
            disabled={actionLoading}
            startIcon={actionLoading ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
            sx={{ bgcolor: '#FACC15', color: 'black', fontWeight: 900, px: 4 }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
