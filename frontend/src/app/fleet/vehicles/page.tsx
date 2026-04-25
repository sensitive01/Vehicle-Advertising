'use client';
import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Card, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, 
  DialogActions, TextField, MenuItem, IconButton, CircularProgress, Chip,
  TablePagination, Tooltip, Paper, Divider, Checkbox, FormControlLabel, FormGroup,
  Avatar, Grid, Stack, Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const AD_OPTIONS = ['Left doors', 'Right doors', 'front bonnet', 'Rear door', 'Roof carrier handles'];

interface Vehicle {
  _id?: string;
  registrationNumber: string;
  registrationType: 'Personal' | 'Yellow board';
  fuelType: 'Petrol' | 'Diesel' | 'CNG' | 'Electric' | 'Others';
  vehicleCategory: 'Passenger' | 'Goods' | any;
  passengerSubtype?: string; 
  goodsSubtype?: string;
  carSubtype?: string;
  seatingCapacity: number | string;
  make: string;
  vehicleModel: string;
  variant: string;
  color: string;
  travelRoutine: string;
  averageKmPerDay: number | string;
  ownerName: string;
  ownerContact: string;
  ownerEmail?: string;
  vehicleProof?: string;
  parkingLocation: {
    address: string;
    lat?: number;
    lng?: number;
  };
  adOptions: string[];
  images: string[];
  status?: string;
  activeCampaignId?: any;
  campaignStatus?: 'NONE' | 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt?: string;
}

const emptyVehicle: Vehicle = {
  registrationNumber: '',
  registrationType: 'Personal',
  fuelType: 'Petrol',
  vehicleCategory: 'Passenger',
  make: '',
  vehicleModel: '',
  variant: '',
  color: '',
  travelRoutine: 'City ride',
  averageKmPerDay: '',
  ownerName: '',
  ownerContact: '',
  parkingLocation: { address: '', lat: 0, lng: 0 },
  seatingCapacity: '',
  adOptions: [],
  images: []
};

export default function MyVehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [step, setStep] = useState(1);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [formData, setFormData] = useState<Vehicle>(emptyVehicle);
  const [mode, setMode] = useState<'add' | 'edit' | 'view'>('add');

  // Campaign Response State
  const [campaignDialogOpen, setCampaignDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchMyVehicles();
  }, []);

  const fetchMyVehicles = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/fleet/myfleet`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setVehicles(data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleCampaignResponse = async (id: string, status: string) => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/fleet/campaign-response/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        setCampaignDialogOpen(false);
        fetchMyVehicles();
      }
    } catch (err) { console.error(err); }
    finally { setActionLoading(false); }
  };

  const handleOpenAdd = () => {
    setFormData({ ...emptyVehicle });
    setMode('add');
    setStep(1);
    setOpenDialog(true);
  };

  const handleOpenEdit = (v: Vehicle) => {
    setFormData({ 
      ...v, 
      images: v.images || [], 
      adOptions: v.adOptions || [],
      parkingLocation: v.parkingLocation || { address: '', lat: 0, lng: 0 }
    });
    setMode('edit');
    setStep(1);
    setOpenDialog(true);
  };

  const handleOpenView = (v: Vehicle) => {
    setFormData({ 
      ...v, 
      images: v.images || [], 
      adOptions: v.adOptions || [],
      parkingLocation: v.parkingLocation || { address: '', lat: 0, lng: 0 }
    });
    setMode('view');
    setOpenDialog(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this vehicle?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/fleet/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) fetchMyVehicles();
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const isEdit = mode === 'edit';
      const url = isEdit ? `${process.env.NEXT_PUBLIC_API_URL}/api/fleet/${formData._id}` : `${process.env.NEXT_PUBLIC_API_URL}/api/fleet/add`;
      const method = isEdit ? 'PATCH' : 'POST';
      const cleanPayload = { 
        ...formData, 
        averageKmPerDay: Number(formData.averageKmPerDay)||0, 
        seatingCapacity: Number(formData.seatingCapacity)||0 
      };
      const body = isEdit ? cleanPayload : { vehicles: [cleanPayload] };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.success) {
        setOpenDialog(false);
        fetchMyVehicles();
      }
    } catch (err) { console.error(err); }
    finally { setSubmitting(false); }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'images' | 'vehicleProof') => {
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

    if (field === 'images') {
      setFormData(prev => ({ ...prev, images: [...prev.images, ...urls] }));
    } else {
      setFormData(prev => ({ ...prev, vehicleProof: urls[0] }));
    }
    setUploading(false);
  };

  const customFieldStyle = {
    '& .MuiOutlinedInput-root': {
      bgcolor: '#1E1E1E',
      '& fieldset': { borderColor: '#333' },
      '&:hover fieldset': { borderColor: '#444' },
      '&.Mui-focused fieldset': { borderColor: '#FACC15' },
      color: 'white', borderRadius: 2
    },
    '& .MuiInputLabel-root': { color: '#A1A1AA' },
    '& .MuiInputBase-input': { p: '12px 14px' }
  };

  const Label = ({ children }: { children: React.ReactNode }) => (
    <Typography variant="body2" sx={{ color: '#FACC15', fontWeight: 800, mb: 0.5, textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: 1 }}>
      {children}
    </Typography>
  );

  const InfoBlock = ({ label, value }: { label: string, value: any }) => (
    <Box sx={{ mb: 1 }}>
      <Label>{label}</Label>
      <Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>{value || 'N/A'}</Typography>
    </Box>
  );

  const renderViewContent = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
       <Box>
          <Label>Vehicle Photos</Label>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 1 }}>
            {(formData.images || []).map((img, i) => (
              <Paper key={i} sx={{ width: 120, height: 90, overflow: 'hidden', borderRadius: 2, border: '1px solid #333' }}>
                <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </Paper>
            ))}
          </Box>
       </Box>
       <Divider sx={{ borderColor: '#222' }} />
       <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
             <InfoBlock label="Registration Number" value={formData.registrationNumber} />
             <InfoBlock label="Type" value={formData.registrationType} />
             <InfoBlock label="Fuel" value={formData.fuelType} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
             <InfoBlock label="Make / Brand" value={formData.make} />
             <InfoBlock label="Model / Variant" value={`${formData.vehicleModel} ${formData.variant}`} />
             <InfoBlock label="Color" value={formData.color} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
             <InfoBlock label="Category" value={`${formData.vehicleCategory} (${formData.passengerSubtype || formData.goodsSubtype})`} />
             <InfoBlock label="Seating" value={formData.seatingCapacity} />
             <InfoBlock label="Owner" value={formData.ownerName} />
          </Grid>
       </Grid>
       <Divider sx={{ borderColor: '#222' }} />
       <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
             <Label>Vehicle Proof Document</Label>
             <Paper sx={{ mt: 1, width: '100%', height: 180, bgcolor: '#000', borderRadius: 2, overflow: 'hidden', border: '1px solid #333' }}>
                {formData.vehicleProof ? <img src={formData.vehicleProof} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'zinc.600' }}>No Proof Uploaded</Box>}
             </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
             <InfoBlock label="Routine" value={formData.travelRoutine} />
             <InfoBlock label="Avg KM / Day" value={formData.averageKmPerDay} />
             <InfoBlock label="Ad Options" value={(formData.adOptions || []).join(', ')} />
             <InfoBlock label="Parking Location" value={formData.parkingLocation?.address} />
          </Grid>
       </Grid>
    </Box>
  );

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box>
                <Label>Vehicle Photos</Label>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 1 }}>
                  {(formData.images || []).map((img, i) => (
                    <Paper key={i} sx={{ position: 'relative', width: 100, height: 75, overflow: 'hidden', borderRadius: 2, border: '1px solid #333' }}>
                      <img src={img} style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#000' }} />
                      <IconButton size="small" onClick={() => setFormData({ ...formData, images: (formData.images || []).filter((_, idx) => idx !== i) })} sx={{ position: 'absolute', top: 2, right: 2, bgcolor: 'rgba(255,0,0,0.8)', color: 'white', '&:hover': { bgcolor: 'red' }, p: 0.1 }}><CloseIcon sx={{ fontSize: 12 }} /></IconButton>
                    </Paper>
                  ))}
                  <Button variant="outlined" component="label" sx={{ width: 100, height: 75, border: '2px dashed #444', color: 'zinc.500', display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      {uploading ? <CircularProgress size={20} color="inherit" /> : <><CloudUploadIcon sx={{ fontSize: 20 }} /><Typography variant="caption" sx={{ fontSize: '0.6rem' }}>ADD PHOTOS</Typography></>}
                      <input type="file" hidden multiple onChange={(e) => handleImageUpload(e, 'images')} />
                  </Button>
                </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
               <Box sx={{ flex: 2 }}>
                 <Label>Registration Number</Label>
                 <TextField fullWidth placeholder="MH-01-AB-1234" value={formData.registrationNumber} onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })} sx={customFieldStyle}/>
               </Box>
               <Box sx={{ flex: 1 }}>
                  <Label>Registration Type</Label>
                  <TextField select fullWidth value={formData.registrationType} onChange={(e) => setFormData({ ...formData, registrationType: e.target.value as any })} sx={customFieldStyle}>
                    <MenuItem value="Personal">Personal</MenuItem>
                    <MenuItem value="Yellow board">Yellow board</MenuItem>
                  </TextField>
               </Box>
            </Box>
          </Box>
        );
      case 2:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
               <Box sx={{ flex: 1 }}>
                  <Label>Fuel Type</Label>
                  <TextField select fullWidth value={formData.fuelType} onChange={(e) => setFormData({ ...formData, fuelType: e.target.value as any })} sx={customFieldStyle}>
                    <MenuItem value="Petrol">Petrol</MenuItem>
                    <MenuItem value="Diesel">Diesel</MenuItem>
                    <MenuItem value="CNG">CNG</MenuItem>
                    <MenuItem value="Electric">Electric</MenuItem>
                    <MenuItem value="Others">Others</MenuItem>
                  </TextField>
               </Box>
               <Box sx={{ flex: 1 }}>
                  <Label>Category</Label>
                  <TextField select fullWidth value={formData.vehicleCategory} onChange={(e) => setFormData({ ...formData, vehicleCategory: e.target.value as any, passengerSubtype: '', goodsSubtype: '' })} sx={customFieldStyle}>
                    <MenuItem value="Passenger">Passenger</MenuItem>
                    <MenuItem value="Goods">Goods</MenuItem>
                  </TextField>
               </Box>
            </Box>
            {formData.vehicleCategory === 'Passenger' ? (
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Label>Passenger Type</Label>
                  <TextField select fullWidth value={formData.passengerSubtype} onChange={(e) => setFormData({ ...formData, passengerSubtype: e.target.value, carSubtype: '' })} sx={customFieldStyle}>
                    {['Auto', 'car/jeep', 'TT', 'Mini Bus', 'Bus', 'Others'].map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                  </TextField>
                </Box>
                {formData.passengerSubtype === 'car/jeep' && (
                  <Box sx={{ flex: 1 }}>
                    <Label>Car Subtype</Label>
                    <TextField select fullWidth value={formData.carSubtype} onChange={(e) => setFormData({ ...formData, carSubtype: e.target.value })} sx={customFieldStyle}>
                      {['Hatchback', 'Sedan', 'Jeep', 'mid SUV', 'SUV'].map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                    </TextField>
                  </Box>
                )}
              </Box>
            ) : (
              <Box>
                <Label>Goods Type</Label>
                <TextField select fullWidth value={formData.goodsSubtype} onChange={(e) => setFormData({ ...formData, goodsSubtype: e.target.value })} sx={customFieldStyle}>
                  {['Auto', 'Jeep', 'Mini Truck', 'Truck', 'Container', 'Others'].map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                </TextField>
              </Box>
            )}
          </Box>
        );
      case 3:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
             <Box sx={{ display: 'flex', gap: 2 }}>
               <Box sx={{ flex: 1 }}>
                 <Label>Brand / Make</Label>
                 <TextField fullWidth placeholder="Tata" value={formData.make} onChange={(e) => setFormData({ ...formData, make: e.target.value })} sx={customFieldStyle}/>
               </Box>
               <Box sx={{ flex: 1 }}>
                 <Label>Model</Label>
                 <TextField fullWidth placeholder="Harrier" value={formData.vehicleModel} onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })} sx={customFieldStyle}/>
               </Box>
             </Box>
             <Box sx={{ display: 'flex', gap: 2 }}>
               <Box sx={{ flex: 1 }}>
                 <Label>Variant</Label>
                 <TextField fullWidth value={formData.variant} onChange={(e) => setFormData({ ...formData, variant: e.target.value })} sx={customFieldStyle}/>
               </Box>
               <Box sx={{ flex: 1 }}>
                 <Label>Color</Label>
                 <TextField fullWidth value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} sx={customFieldStyle}/>
               </Box>
             </Box>
             <Box>
               <Label>Parking Location</Label>
               <TextField 
                fullWidth 
                multiline 
                rows={2} 
                value={formData.parkingLocation?.address || ''} 
                onChange={(e) => setFormData({ ...formData, parkingLocation: { ...formData.parkingLocation, address: e.target.value } })} 
                sx={customFieldStyle}
               />
             </Box>
          </Box>
        );
      case 4:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
             <Box sx={{ display: 'flex', gap: 2 }}>
               <Box sx={{ flex: 1 }}>
                 <Label>Owner Name</Label>
                 <TextField fullWidth value={formData.ownerName} onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })} sx={customFieldStyle}/>
               </Box>
               <Box sx={{ flex: 1 }}>
                 <Label>Contact Number</Label>
                 <TextField fullWidth value={formData.ownerContact} onChange={(e) => setFormData({ ...formData, ownerContact: e.target.value })} sx={customFieldStyle}/>
               </Box>
             </Box>
             <Box>
                <Label>Vehicle Proof (RC / Insurance)</Label>
                <Box sx={{ position: 'relative' }}>
                   <Button variant="outlined" component="label" sx={{ width: '100%', height: 160, border: '2px dashed #444', color: 'white', display: 'flex', flexDirection: 'column', gap: 1, position: 'relative', overflow: 'hidden', p: 0.5, bgcolor: '#000' }}>
                     {uploading ? <CircularProgress size={24} color="inherit" /> : formData.vehicleProof ? <img src={formData.vehicleProof} style={{ width: 'auto', maxWidth: '100%', height: 'auto', maxHeight: '100%', objectFit: 'contain' }} /> : <><CloudUploadIcon sx={{ color: '#FACC15' }}/><Typography variant="caption" sx={{ color: 'zinc.500' }}>UPLOAD RC / INSURANCE</Typography></>}
                     {!formData.vehicleProof && <input type="file" hidden onChange={(e) => handleImageUpload(e, 'vehicleProof')} />}
                   </Button>
                   {formData.vehicleProof && <IconButton size="small" onClick={() => setFormData({ ...formData, vehicleProof: '' })} sx={{ position: 'absolute', top: 5, right: 5, bgcolor: 'red', color: 'white' }}><DeleteIcon sx={{ fontSize: 16 }} /></IconButton>}
                </Box>
             </Box>
          </Box>
        );
      case 5:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
             <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                   <Label>Travel Routine</Label>
                   <TextField select fullWidth value={formData.travelRoutine} onChange={(e) => setFormData({ ...formData, travelRoutine: e.target.value })} sx={customFieldStyle}>
                     {['City ride', 'Outstation ride', 'state permit', 'All India ride', 'random'].map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                   </TextField>
                </Box>
                <Box sx={{ flex: 1 }}>
                   <Label>Avg KM / Day</Label>
                   <TextField fullWidth value={formData.averageKmPerDay} onChange={(e) => setFormData({ ...formData, averageKmPerDay: e.target.value })} sx={customFieldStyle}/>
                </Box>
             </Box>
             <Box>
               <Label>Advertisement Options</Label>
               <FormGroup sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                 {AD_OPTIONS.map(opt => (
                   <FormControlLabel key={opt} control={<Checkbox checked={(formData.adOptions || []).includes(opt)} onChange={(e) => {
                     const opts = e.target.checked ? [...(formData.adOptions || []), opt] : (formData.adOptions || []).filter(o => o !== opt);
                     setFormData({ ...formData, adOptions: opts });
                   }} sx={{ color: '#333', '&.Mui-checked': { color: '#FACC15' } }} />} label={<Typography variant="body2" sx={{ color: 'zinc.300' }}>{opt}</Typography>} />
                 ))}
               </FormGroup>
             </Box>
          </Box>
        );
      default: return null;
    }
  };

  const isView = mode === 'view';

  const dialogContent = (
    <Box>
      <DialogTitle component="div" sx={{ p: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 900, textTransform: 'uppercase' }}>
          {isView ? 'Vehicle' : (mode === 'edit' ? 'Update' : 'Register')} <span style={{ color: '#FACC15' }}>{isView ? 'Overview' : 'Details'}</span>
        </Typography>
        {!isView && <Typography variant="caption" sx={{ color: 'zinc.500' }}>Step {step}/5</Typography>}
        {isView && <IconButton onClick={() => setOpenDialog(false)} sx={{ color: 'zinc.500' }}><CloseIcon /></IconButton>}
      </DialogTitle>
      <Divider sx={{ borderColor: '#222' }} />
      <DialogContent 
        sx={{ 
          p: 4, 
          minHeight: 400,
          '&::-webkit-scrollbar': { display: 'none' },
          scrollbarWidth: 'none',
        }}
      >
         {isView ? renderViewContent() : renderStep()}
      </DialogContent>
      {!isView && (
        <>
          <Divider sx={{ borderColor: '#222' }} />
          <DialogActions sx={{ p: 4, justifyContent: 'space-between' }}>
             <Button disabled={step === 1} onClick={() => setStep(s => s - 1)} startIcon={<ArrowBackIosIcon sx={{ fontSize: 12 }} />} sx={{ color: 'zinc.500' }}>Back</Button>
             <Box sx={{ display: 'flex', gap: 2 }}>
               <Button onClick={() => setOpenDialog(false)} sx={{ color: 'zinc.600' }}>Exit</Button>
               {step < 5 ? (
                 <Button variant="contained" onClick={() => setStep(s => s + 1)} endIcon={<ArrowForwardIosIcon sx={{ fontSize: 12 }} />} sx={{ bgcolor: '#FACC15', color: 'black', fontWeight: 900 }}>Continue</Button>
               ) : (
                 <Button variant="contained" onClick={handleSubmit} disabled={submitting} sx={{ bgcolor: '#FACC15', color: 'black', fontWeight: 900 }}>{submitting ? 'Processing...' : (mode === 'edit' ? 'Save Changes' : 'Register Vehicle')}</Button>
               )}
             </Box>
          </DialogActions>
        </>
      )}
    </Box>
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Stack direction="row" spacing={2} alignItems="center">
           <Typography variant="h4" sx={{ color: 'white', fontWeight: 900, textTransform: 'uppercase' }}>
             My <span style={{ color: '#FACC15' }}>Vehicles</span>
           </Typography>
        </Stack>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAdd} sx={{ bgcolor: '#FACC15', color: 'black', fontWeight: 700, px: 3 }}>
          Register New Vehicle
        </Button>
      </Box>

      {/* Campaign Request Alerts */}
      {vehicles.some(v => v.campaignStatus === 'PENDING') && (
         <Alert 
            severity="info" 
            icon={<InfoIcon sx={{ color: '#FACC15' }} />}
            sx={{ mb: 3, bgcolor: 'rgba(250, 204, 21, 0.05)', color: '#FACC15', border: '1px solid rgba(250, 204, 21, 0.2)', borderRadius: 1 }}
         >
            You have new advertising campaign requests pending for your vehicles!
         </Alert>
      )}

      <Card sx={{ bgcolor: '#121212', border: '1px solid #333', borderRadius: 1.5, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#1A1A1A' }}>
              <TableRow>
                <TableCell sx={{ color: '#A1A1AA', fontWeight: 'bold' }}>Photos</TableCell>
                <TableCell sx={{ color: '#A1A1AA', fontWeight: 'bold' }}>Vehicle Details</TableCell>
                <TableCell sx={{ color: '#A1A1AA', fontWeight: 'bold' }}>Ad Space</TableCell>
                <TableCell sx={{ color: '#A1A1AA', fontWeight: 'bold' }}>Campaigns</TableCell>
                <TableCell sx={{ color: '#A1A1AA', fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ color: '#A1A1AA', fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={6} sx={{ textAlign: 'center', py: 4 }}><CircularProgress color="inherit" size={24} /></TableCell></TableRow>
              ) : vehicles.length === 0 ? (
                <TableRow><TableCell colSpan={6} sx={{ textAlign: 'center', py: 10, color: 'zinc.600' }}>No vehicles registered yet.</TableCell></TableRow>
              ) : (
                vehicles.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((v) => (
                  <TableRow key={v._id} sx={{ '&:hover': { bgcolor: '#1A1A1A' } }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {v.images?.[0] ? (
                          <Paper sx={{ width: 60, height: 40, overflow: 'hidden', borderRadius: 1.5, border: '1px solid #333' }}>
                             <img src={v.images[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </Paper>
                        ) : <Avatar variant="rounded" sx={{ width: 60, height: 40, bgcolor: '#333' }}>V</Avatar>}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ color: 'white', fontWeight: 700 }}>{v.registrationNumber}</Typography>
                      <Typography variant="caption" sx={{ color: 'zinc.500' }}>{v.make} {v.vehicleModel}</Typography>
                    </TableCell>
                    <TableCell>
                       <Typography variant="caption" sx={{ color: 'zinc.300', fontWeight: 600 }}>{v.vehicleCategory}</Typography>
                       <Typography sx={{ color: 'zinc.500', fontSize: '0.7rem' }}>{v.adOptions.length} Spots available</Typography>
                    </TableCell>
                    <TableCell>
                       {v.campaignStatus === 'PENDING' ? (
                          <Tooltip title="Campaign Request Pending">
                             <Button 
                                size="small" 
                                color="warning" 
                                variant="outlined" 
                                onClick={() => { setSelectedVehicle(v); setCampaignDialogOpen(true); }}
                                sx={{ fontSize: '0.65rem', fontWeight: 900, borderColor: '#FACC15', color: '#FACC15', '&:hover': { bgcolor: 'rgba(250, 204, 21, 0.1)', borderColor: '#FACC15' } }}
                             >
                                ACTION REQ
                             </Button>
                          </Tooltip>
                       ) : v.campaignStatus === 'ACCEPTED' ? (
                          <Chip label={v.activeCampaignId?.brandName || 'ACTIVE'} size="small" sx={{ bgcolor: 'rgba(34, 197, 94, 0.1)', color: '#4ADE80', fontWeight: 900 }} />
                       ) : (
                          <Typography variant="caption" sx={{ color: 'zinc.700' }}>NONE</Typography>
                       )}
                    </TableCell>
                    <TableCell>
                      <Chip label={v.status} size="small" sx={{ bgcolor: v.status === 'Verified' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(250, 204, 21, 0.1)', color: v.status === 'Verified' ? '#4ADE80' : '#FACC15', fontWeight: 'bold' }} />
                    </TableCell>
                    <TableCell>
                       <Stack direction="row" spacing={0.5}>
                          <IconButton onClick={() => handleOpenView(v)} sx={{ color: 'zinc.400' }}><VisibilityIcon fontSize="small" /></IconButton>
                          <IconButton onClick={() => handleOpenEdit(v)} sx={{ color: 'zinc.400' }}><EditIcon fontSize="small" /></IconButton>
                          <IconButton onClick={() => v._id && handleDelete(v._id)} sx={{ color: 'zinc.400' }}><DeleteIcon fontSize="small" /></IconButton>
                       </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination component="div" count={vehicles.length} rowsPerPage={rowsPerPage} page={page} onPageChange={(e, p) => setPage(p)} onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }} rowsPerPageOptions={[10, 25, 50, 100]} sx={{ color: 'zinc.400' }} />
      </Card>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth PaperProps={{ sx: { bgcolor: '#141414', color: 'white', borderRadius: 1.5, border: '1px solid #333' } }}>
        {dialogContent}
      </Dialog>

      {/* Campaign Response Modal */}
      <Dialog 
        open={campaignDialogOpen} 
        onClose={() => setCampaignDialogOpen(false)} 
        maxWidth="sm" 
        fullWidth 
        PaperProps={{ sx: { bgcolor: '#121212', color: 'white', borderRadius: 1.5, border: '1px solid #333' } }}
      >
        <DialogTitle component="div" sx={{ p: 4, borderBottom: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           <Typography variant="h5" sx={{ fontWeight: 900 }}>Campaign <span style={{ color: '#FACC15' }}>Request</span></Typography>
           <IconButton onClick={() => setCampaignDialogOpen(false)} sx={{ color: 'zinc.500' }}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
           {selectedVehicle && selectedVehicle.activeCampaignId && (
             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                   <Avatar sx={{ bgcolor: '#FACC15', color: 'black', fontWeight: 900 }}>{selectedVehicle.activeCampaignId.brandName?.[0]}</Avatar>
                   <Box>
                      <Typography variant="h6" sx={{ fontWeight: 800 }}>{selectedVehicle.activeCampaignId.brandName}</Typography>
                      <Typography variant="body2" sx={{ color: 'zinc.500' }}>{selectedVehicle.activeCampaignId.businessCategory}</Typography>
                   </Box>
                </Box>
                <Divider sx={{ borderColor: '#222' }} />
                <Grid container spacing={2}>
                   <Grid size={{ xs: 6 }}>
                      <Box>
                         <Typography variant="caption" sx={{ color: 'zinc.500', fontWeight: 800, textTransform: 'uppercase' }}>Payout Rate</Typography>
                         <Typography variant="h6" sx={{ color: '#4ADE80', fontWeight: 800 }}>₹ {selectedVehicle.activeCampaignId.rentalChargesPerKm} / KM</Typography>
                      </Box>
                   </Grid>
                   <Grid size={{ xs: 6 }}>
                      <Box>
                         <Typography variant="caption" sx={{ color: 'zinc.500', fontWeight: 800, textTransform: 'uppercase' }}>Duration</Typography>
                         <Typography variant="h6" sx={{ color: 'white', fontWeight: 800 }}>{selectedVehicle.activeCampaignId.duration}</Typography>
                      </Box>
                   </Grid>
                </Grid>
                <Box sx={{ p: 2, bgcolor: '#1A1A1A', borderRadius: 2, border: '1px solid #222' }}>
                   <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>This campaign is requesting ad space on your <strong>{selectedVehicle.registrationNumber}</strong> ({selectedVehicle.make} {selectedVehicle.vehicleModel}).</Typography>
                </Box>
                <Alert severity="info" sx={{ bgcolor: 'transparent', color: 'zinc.400', p: 0, '& .MuiAlert-icon': { display: 'none' } }}>
                   By accepting, you agree to place the branding material on your vehicle for the selected duration.
                </Alert>
             </Box>
           )}
        </DialogContent>
        <DialogActions sx={{ p: 4, pt: 0, gap: 2, borderTop: 'none' }}>
           <Button 
            disabled={actionLoading} 
            onClick={() => selectedVehicle?._id && handleCampaignResponse(selectedVehicle._id, 'REJECTED')}
            variant="outlined" 
            sx={{ flex: 1, borderColor: '#333', color: 'zinc.500', fontWeight: 800, '&:hover': { borderColor: 'red', color: 'red' } }}
           >
             Reject
           </Button>
           <Button 
            disabled={actionLoading} 
            onClick={() => selectedVehicle?._id && handleCampaignResponse(selectedVehicle._id, 'ACCEPTED')}
            variant="contained" 
            startIcon={<CheckCircleIcon />}
            sx={{ flex: 2, bgcolor: '#FACC15', color: 'black', fontWeight: 900 }}
           >
             Accept & Start Earning
           </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
