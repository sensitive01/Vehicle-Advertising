'use client';
import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Card, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, 
  DialogActions, TextField, MenuItem, IconButton, CircularProgress, Chip,
  Divider, Paper, Checkbox, FormControlLabel, Grid
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';

interface Vehicle {
  _id: string;
  registrationNumber: string;
  vehicleModel: string;
}

interface Report {
  _id: string;
  vehicleId: Vehicle;
  date: string;
  isRunning: boolean;
  kmDriven: number;
  drivenBy: string;
  status?: string;
  closingKm: number;
}

export default function DailyReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [openAdd, setOpenAdd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form State
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [isRunning, setIsRunning] = useState(true);
  const [openingKm, setOpeningKm] = useState<number | string>('');
  const [openingProof, setOpeningProof] = useState('');
  const [closingKm, setClosingKm] = useState<number | string>('');
  const [closingProof, setClosingProof] = useState('');
  const [drivenBy, setDrivenBy] = useState('');
  const [reasonIfNotRunning, setReasonIfNotRunning] = useState('');
  const [damageReported, setDamageReported] = useState(false);
  const [damageReason, setDamageReason] = useState('');
  const [damageProof, setDamageProof] = useState('');

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const [repRes, vehRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports/myreports`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/fleet/myfleet`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      const repData = await repRes.json();
      const vehData = await vehRes.json();
      if (repData.success) setReports(repData.data);
      if (vehData.success) setVehicles(vehData.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleVehicleChange = async (vid: string) => {
    setSelectedVehicle(vid);
    // Fetch last KM
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports/last-km/${vid}`, { headers: { 'Authorization': `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) {
        setOpeningKm(data.lastClosingKm || '');
        setClosingKm(data.lastClosingKm || '');
      }
    } catch (err) { console.error(err); }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, setter: (url: string) => void) => {
    if (!e.target.files?.[0]) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', e.target.files[0]);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/fleet/upload`, { method: 'POST', body: fd });
      const data = await res.json();
      if (data.secure_url) setter(data.secure_url);
    } catch (err) { console.error(err); }
    finally { setUploading(false); }
  };

  const handleSubmit = async () => {
    if (!selectedVehicle || !drivenBy) {
      alert('Please fill all required fields (Vehicle & Driver Name)');
      return;
    }
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          vehicleId: selectedVehicle, isRunning, openingKm, openingProof, 
          closingKm, closingProof, drivenBy, reasonIfNotRunning,
          damageReported, damageProof, damageReason
        })
      });
      const data = await res.json();
      if (data.success) {
        setOpenAdd(false);
        fetchInitialData();
      } else {
        alert(data.message);
      }
    } catch (err) { console.error(err); }
    finally { setSubmitting(false); }
  };

  const customFieldStyle = {
    '& .MuiOutlinedInput-root': {
      bgcolor: '#1E1E1E', '& fieldset': { borderColor: '#333' },
      '&:hover fieldset': { borderColor: '#444' },
      '&.Mui-focused fieldset': { borderColor: '#FACC15' },
      color: 'white', borderRadius: 2
    },
    '& .MuiInputLabel-root': { color: '#A1A1AA' },
    '& .MuiInputBase-input': { p: '12px 14px' },
    '& input[type=number]': {
      '-moz-appearance': 'textfield'
    },
    '& input[type=number]::-webkit-outer-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0
    },
    '& input[type=number]::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0
    }
  };

  const Label = ({ children }: { children: React.ReactNode }) => (
    <Typography variant="body2" sx={{ color: '#FACC15', fontWeight: 800, mb: 0.5, textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: 1 }}>
      {children}
    </Typography>
  );

  return (
    <Box>
       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ color: 'white', fontWeight: 900, textTransform: 'uppercase' }}>
          Daily <span style={{ color: '#FACC15' }}>Reports</span>
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenAdd(true)} sx={{ bgcolor: '#FACC15', color: 'black', fontWeight: 700, px: 3 }}>
          Submit New Report
        </Button>
      </Box>

      <Card sx={{ bgcolor: '#121212', border: '1px solid #333', borderRadius: 1.5, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#1A1A1A' }}>
              <TableRow>
                <TableCell sx={{ color: '#A1A1AA', fontWeight: 'bold' }}>Vehicle</TableCell>
                <TableCell sx={{ color: '#A1A1AA', fontWeight: 'bold' }}>Date</TableCell>
                <TableCell sx={{ color: '#A1A1AA', fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ color: '#A1A1AA', fontWeight: 'bold' }}>Km Driven</TableCell>
                <TableCell sx={{ color: '#A1A1AA', fontWeight: 'bold' }}>Driven By</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={5} sx={{ textAlign: 'center', py: 4 }}><CircularProgress color="inherit" size={24} /></TableCell></TableRow>
              ) : reports.length === 0 ? (
                <TableRow><TableCell colSpan={5} sx={{ textAlign: 'center', py: 6, color: 'zinc.600' }}>No reports submitted yet.</TableCell></TableRow>
              ) : (
                reports.map((r, i) => (
                  <TableRow key={r._id} sx={{ '&:hover': { bgcolor: '#1A1A1A' } }}>
                    <TableCell>
                      <Typography sx={{ color: 'white', fontWeight: 700 }}>{r.vehicleId?.registrationNumber || 'N/A'}</Typography>
                    </TableCell>
                    <TableCell sx={{ color: 'zinc.400', fontSize: '0.85rem' }}>
                      {new Date(r.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-')} 
                      <Typography variant="caption" sx={{ ml: 1, color: 'zinc.600' }}>{new Date(r.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={r.isRunning ? 'VEHICLE ACTIVE' : 'VEHICLE IDLE'} 
                        size="small" 
                        sx={{ 
                          bgcolor: r.isRunning ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
                          color: r.isRunning ? '#4ADE80' : '#F87171', 
                          fontWeight: 900,
                          fontSize: '0.6rem',
                          height: 22,
                          px: 0.5
                        }} 
                      />
                    </TableCell>
                    <TableCell sx={{ color: 'zinc.300' }}>{r.kmDriven} KM</TableCell>
                    <TableCell sx={{ color: 'zinc.300' }}>{r.drivenBy}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Dialog 
        open={openAdd} 
        onClose={() => setOpenAdd(false)} 
        maxWidth="sm" 
        fullWidth 
        PaperProps={{ 
          sx: { 
            bgcolor: '#141414', 
            color: 'white', 
            borderRadius: 2, 
            border: '1px solid #333',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
          } 
        }}
      >
        <DialogTitle sx={{ p: 4, pb: 2 }}>
           <Typography variant="h5" sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1 }}>Daily <span style={{ color: '#FACC15' }}>Submission</span></Typography>
           <Typography variant="caption" sx={{ color: 'zinc.500', display: 'block', mt: 0.5 }}>Submit your vehicle's daily operational metrics</Typography>
        </DialogTitle>
        
        <DialogContent sx={{ 
          p: 4, pt: 1, display: 'flex', flexDirection: 'column', gap: 3,
          overflowY: 'auto',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          '-ms-overflow-style': 'none',
        }}>
           <Box>
             <Label>Choose Vehicle</Label>
             <TextField select fullWidth value={selectedVehicle} onChange={(e) => handleVehicleChange(e.target.value)} sx={customFieldStyle}>
               {vehicles.map(v => <MenuItem key={v._id} value={v._id}>{v.registrationNumber} - {v.vehicleModel}</MenuItem>)}
             </TextField>
           </Box>

           <Box>
              <Label>Was vehicle running today?</Label>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button onClick={() => setIsRunning(true)} sx={{ flex: 1, py: 1.5, borderRadius: 2, bgcolor: isRunning ? 'rgba(34, 197, 94, 0.1)' : '#1A1A1A', color: isRunning ? '#4ADE80' : 'zinc.600', border: '1px solid', borderColor: isRunning ? '#4ADE80' : '#333', fontWeight: 800, transition: '0.3s' }}>YES</Button>
                <Button onClick={() => setIsRunning(false)} sx={{ flex: 1, py: 1.5, borderRadius: 2, bgcolor: !isRunning ? 'rgba(239, 68, 68, 0.1)' : '#1A1A1A', color: !isRunning ? '#F87171' : 'zinc.600', border: '1px solid', borderColor: !isRunning ? '#F87171' : '#333', fontWeight: 800, transition: '0.3s' }}>NO</Button>
              </Box>
           </Box>

           <Box>
             <Label>Driven By</Label>
             <TextField fullWidth placeholder="Operator Name" value={drivenBy} onChange={(e) => setDrivenBy(e.target.value)} sx={customFieldStyle}/>
           </Box>

           {isRunning ? (
             <>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box sx={{ flex: 1 }}>
                     <Label>Opening KM</Label>
                     <TextField 
                       fullWidth 
                       type="number" 
                       value={openingKm} 
                       onChange={(e) => setOpeningKm(e.target.value)}  
                       sx={customFieldStyle}
                       InputProps={{
                         sx: { color: Number(openingKm) > 0 ? '#4ADE80' : 'white' }
                       }}
                       helperText={Number(openingKm) > 0 ? "Pre-filled from yesterday's closing. You can adjust if needed." : "Enter initial KM for first submission"}
                       FormHelperTextProps={{ sx: { color: Number(openingKm) > 0 ? '#4ADE80' : 'zinc.600', fontSize: '0.6rem', fontWeight: 700 } }}
                     />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                     <Label>Closing KM</Label>
                     <TextField 
                       fullWidth 
                       type="number" 
                       value={closingKm} 
                       onChange={(e) => setClosingKm(e.target.value)} 
                       sx={customFieldStyle}
                       placeholder="0"
                     />
                  </Box>
                </Box>
                
                <Grid container spacing={2}>
                   <Grid size={{ xs: 12, sm: 6 }}>
                      <Label>Opening Photo (Optional)</Label>
                      {!openingProof ? (
                        <Button variant="outlined" component="label" fullWidth sx={{ border: '1px solid #333', bgcolor: '#000', color: 'zinc.500', height: 100, borderRadius: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                          {uploading ? <CircularProgress size={20} /> : <><CloudUploadIcon sx={{ fontSize: 28 }}/> <Typography variant="caption" sx={{ fontWeight: 800 }}>Upload Photo</Typography></>}
                          <input type="file" hidden onChange={(e) => handleImageUpload(e, setOpeningProof)} />
                        </Button>
                      ) : (
                        <Box sx={{ position: 'relative', width: '100%', height: 100, borderRadius: 2, overflow: 'hidden', border: '1px solid #FACC15' }}>
                           <img src={openingProof} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                           <IconButton size="small" onClick={() => setOpeningProof('')} sx={{ position: 'absolute', top: 5, right: 5, bgcolor: 'rgba(0,0,0,0.5)', color: 'white', '&:hover': { bgcolor: 'black' } }}><CloseIcon sx={{ fontSize: 14 }}/></IconButton>
                        </Box>
                      )}
                   </Grid>
                   <Grid size={{ xs: 12, sm: 6 }}>
                      <Label>Closing Photo (Optional)</Label>
                      {!closingProof ? (
                        <Button variant="outlined" component="label" fullWidth sx={{ border: '1px solid #333', bgcolor: '#000', color: 'zinc.500', height: 100, borderRadius: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                          {uploading ? <CircularProgress size={20} /> : <><CloudUploadIcon sx={{ fontSize: 28 }}/> <Typography variant="caption" sx={{ fontWeight: 800 }}>Upload Photo</Typography></>}
                          <input type="file" hidden onChange={(e) => handleImageUpload(e, setClosingProof)} />
                        </Button>
                      ) : (
                        <Box sx={{ position: 'relative', width: '100%', height: 100, borderRadius: 2, overflow: 'hidden', border: '1px solid #FACC15' }}>
                           <img src={closingProof} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                           <IconButton size="small" onClick={() => setClosingProof('')} sx={{ position: 'absolute', top: 5, right: 5, bgcolor: 'rgba(0,0,0,0.5)', color: 'white', '&:hover': { bgcolor: 'black' } }}><CloseIcon sx={{ fontSize: 14 }}/></IconButton>
                        </Box>
                      )}
                   </Grid>
                </Grid>
             </>
           ) : (
             <Box>
               <Label>Reason for not running</Label>
               <TextField fullWidth multiline rows={2} placeholder="Explain why..." value={reasonIfNotRunning} onChange={(e) => setReasonIfNotRunning(e.target.value)} sx={customFieldStyle}/>
             </Box>
           )}

           <Divider sx={{ borderColor: '#222', my: 1 }} />
           
           <Box>
              <FormControlLabel control={<Checkbox checked={damageReported} onChange={(e) => setDamageReported(e.target.checked)} sx={{ color: '#333', '&.Mui-checked': { color: '#FACC15' } }} />} label={<Typography sx={{ color: 'white', fontWeight: 800, fontSize: '0.8rem', letterSpacing: 0.5 }}>REPORT ADVERTISEMENT DAMAGE?</Typography>} />
           </Box>

           {damageReported && (
             <>
                <Box>
                   <Label>Damage Proof Photo</Label>
                   {!damageProof ? (
                     <Button variant="outlined" component="label" fullWidth sx={{ border: '1px solid #333', bgcolor: '#000', color: 'zinc.500', height: 80, borderRadius: 2 }}>
                        {uploading ? <CircularProgress size={20} /> : <><CloudUploadIcon sx={{ mr: 1 }}/> Upload Damage Photo</>}
                        <input type="file" hidden onChange={(e) => handleImageUpload(e, setDamageProof)} />
                     </Button>
                   ) : (
                     <Box sx={{ position: 'relative', width: 120, height: 80, borderRadius: 2, overflow: 'hidden', border: '1px solid #F87171' }}>
                        <img src={damageProof} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <IconButton size="small" onClick={() => setDamageProof('')} sx={{ position: 'absolute', top: 5, right: 5, bgcolor: 'rgba(0,0,0,0.5)', color: 'white' }}><CloseIcon sx={{ fontSize: 12 }}/></IconButton>
                     </Box>
                   )}
                </Box>
                <Box>
                  <Label>Damage Description</Label>
                  <TextField fullWidth multiline rows={2} placeholder="What happened?" value={damageReason} onChange={(e) => setDamageReason(e.target.value)} sx={customFieldStyle}/>
                </Box>
             </>
           )}

        </DialogContent>
        <DialogActions sx={{ p: 4, pt: 2 }}>
           <Button onClick={() => setOpenAdd(false)} sx={{ color: 'zinc.600', fontWeight: 700 }}>Cancel</Button>
           <Button variant="contained" onClick={handleSubmit} disabled={submitting || !selectedVehicle} sx={{ bgcolor: '#FACC15', color: 'black', fontWeight: 900, px: 4, py: 1.2, borderRadius: 2, '&:hover': { bgcolor: '#EAB308' } }}>{submitting ? 'Submitting...' : 'Confirm & Submit Report'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
