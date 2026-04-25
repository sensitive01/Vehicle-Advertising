'use client';
import React, { useState, useEffect } from 'react';
import { 
  Box, Container, Typography, Card, TextField, MenuItem, 
  Button, Divider, Stack, Grid, CircularProgress, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Avatar, Tooltip
} from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import HistoryIcon from '@mui/icons-material/History';
import VerifiedIcon from '@mui/icons-material/Verified';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function DailyReportPage() {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    vehicleId: '',
    isRunning: true,
    openingKm: 0,
    openingProof: '',
    closingKm: 0,
    closingProof: '',
    drivenBy: '',
    reasonIfNotRunning: '',
    damageReported: false,
    damageProof: '',
    damageReason: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const [vRes, rRes] = await Promise.all([
        axios.get(`${API_URL}/api/fleet/myfleet`, { headers }),
        axios.get(`${API_URL}/api/reports/myreports`, { headers })
      ]);
      
      setVehicles(vRes.data.data || []);
      setReports(rRes.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVehicleChange = async (id: string) => {
    setFormData(prev => ({ ...prev, vehicleId: id }));
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/api/reports/last-km/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFormData(prev => ({ ...prev, openingKm: res.data.lastClosingKm || 0 }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await axios.post(`${API_URL}/api/fleet/upload`, fd);
      setFormData(prev => ({ ...prev, [field]: res.data.secure_url }));
    } catch (err) {
      console.error('Upload failed', err);
    }
  };

  const handleSubmit = async () => {
    if (!formData.vehicleId || !formData.drivenBy) {
      alert('Please select vehicle and specify driver name');
      return;
    }
    if (formData.isRunning && (formData.closingKm <= formData.openingKm)) {
      alert('Closing KM must be greater than Opening KM');
      return;
    }
    
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/api/reports/submit`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Report submitted successfully!');
      fetchData();
      // Reset form
      setFormData({
        vehicleId: '',
        isRunning: true,
        openingKm: 0,
        openingProof: '',
        closingKm: 0,
        closingProof: '',
        drivenBy: '',
        reasonIfNotRunning: '',
        damageReported: false,
        damageProof: '',
        damageReason: ''
      });
    } catch (err) {
      console.error(err);
      alert('Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const cardStyle = {
    bgcolor: '#121212', border: '1px solid #333', borderRadius: 1.5, p: 3
  };

  const fieldStyle = {
    '& .MuiOutlinedInput-root': {
      bgcolor: '#0A0A0A', '& fieldset': { borderColor: '#222' },
      '&:hover fieldset': { borderColor: '#444' },
      '&.Mui-focused fieldset': { borderColor: '#FACC15' },
      color: 'white', borderRadius: 2
    },
    '& .MuiInputLabel-root': { color: '#A1A1AA' },
    '& .MuiInputBase-input': { p: '12px 14px' }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress sx={{ color: '#FACC15' }} size={50} />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Stack spacing={4}>
        
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" sx={{ color: 'white', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1 }}>
              Daily <span style={{ color: '#FACC15' }}>Activity Report</span>
            </Typography>
            <Typography sx={{ color: 'zinc.500', fontWeight: 600, mt: 0.5 }}>Log your daily fleet performance and maintenance checks.</Typography>
          </Box>
        </Box>

        <Grid container spacing={4}>
          {/* Submission Form */}
          <Grid size={{ xs: 12, lg: 5 }}>
            <Card sx={cardStyle}>
               <Stack spacing={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                     <AssessmentIcon sx={{ color: '#FACC15' }} />
                     <Typography sx={{ color: 'white', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: 1 }}>Submit New Entry</Typography>
                  </Box>
                  
                  <TextField select fullWidth label="Select Vehicle" value={formData.vehicleId} onChange={(e) => handleVehicleChange(e.target.value)} sx={fieldStyle}>
                    {vehicles.map(v => <MenuItem key={v._id} value={v._id}>{v.registrationNumber} ({v.make} {v.vehicleModel})</MenuItem>)}
                  </TextField>

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 6 }}>
                      <TextField fullWidth type="number" label="Opening KM" value={formData.openingKm} onChange={(e) => setFormData({...formData, openingKm: Number(e.target.value)})} sx={fieldStyle} />
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <TextField fullWidth type="number" label="Closing KM" value={formData.closingKm} onChange={(e) => setFormData({...formData, closingKm: Number(e.target.value)})} sx={fieldStyle} />
                    </Grid>
                  </Grid>

                  <TextField fullWidth label="Driver Name" value={formData.drivenBy} onChange={(e) => setFormData({...formData, drivenBy: e.target.value})} placeholder="Full name of driver" sx={fieldStyle} />

                  <Box sx={{ p: 2, bgcolor: '#0A0A0A', borderRadius: 2, border: '1px solid #222' }}>
                    <Typography variant="caption" sx={{ color: 'zinc.500', fontWeight: 700, mb: 1.5, display: 'block' }}>CLOSING KM PROOF (PHOTO)</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                       <Button variant="outlined" component="label" startIcon={<CloudUploadIcon />} sx={{ borderColor: '#333', color: 'white', textTransform: 'none', px: 3 }}>
                          {formData.closingProof ? 'Change Photo' : 'Upload Proof'}
                          <input type="file" hidden onChange={(e) => handleFileUpload(e, 'closingProof')} />
                       </Button>
                       {formData.closingProof && <VerifiedIcon sx={{ color: '#10B981' }} />}
                    </Box>
                  </Box>

                  <Box>
                    <Typography variant="caption" sx={{ color: 'zinc.500', display: 'block', mb: 1, fontWeight: 700 }}>IS VEHICLE RUNNING?</Typography>
                    <Stack direction="row" spacing={2}>
                       <Button variant={formData.isRunning ? "contained" : "outlined"} onClick={() => setFormData({...formData, isRunning: true})} sx={{ flex: 1, bgcolor: formData.isRunning ? '#FACC15' : 'transparent', color: formData.isRunning ? 'black' : 'zinc.500' }}>Running</Button>
                       <Button variant={!formData.isRunning ? "contained" : "outlined"} onClick={() => setFormData({...formData, isRunning: false})} sx={{ flex: 1, bgcolor: !formData.isRunning ? '#EF4444' : 'transparent', color: !formData.isRunning ? 'white' : 'zinc.500' }}>Not Running</Button>
                    </Stack>
                  </Box>

                  {!formData.isRunning && (
                    <TextField fullWidth multiline rows={2} label="Reason for Not Running" value={formData.reasonIfNotRunning} onChange={(e) => setFormData({...formData, reasonIfNotRunning: e.target.value})} sx={fieldStyle} />
                  )}

                  <Button variant="contained" fullWidth onClick={handleSubmit} disabled={submitting} sx={{ bgcolor: '#FACC15', color: 'black', fontWeight: 900, py: 2, borderRadius: 2 }}>
                    {submitting ? 'Submitting...' : 'Post Daily Log Entry'}
                  </Button>
               </Stack>
            </Card>
          </Grid>

          {/* Recent History */}
          <Grid size={{ xs: 12, lg: 7 }}>
            <Card sx={{ ...cardStyle, p: 0, overflow: 'hidden' }}>
              <Box sx={{ p: 3, bgcolor: '#1A1A1A', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                 <HistoryIcon sx={{ color: '#FACC15' }} />
                 <Typography sx={{ color: 'white', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: 1 }}>Recent Entry Log</Typography>
              </Box>
              <TableContainer sx={{ maxHeight: 600 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ bgcolor: '#0D0D0D', color: '#A1A1AA', fontWeight: 'bold' }}>Vehicle</TableCell>
                      <TableCell sx={{ bgcolor: '#0D0D0D', color: '#A1A1AA', fontWeight: 'bold' }}>KM Driven</TableCell>
                      <TableCell sx={{ bgcolor: '#0D0D0D', color: '#A1A1AA', fontWeight: 'bold' }}>Driver</TableCell>
                      <TableCell sx={{ bgcolor: '#0D0D0D', color: '#A1A1AA', fontWeight: 'bold' }}>Status</TableCell>
                      <TableCell sx={{ bgcolor: '#0D0D0D', color: '#A1A1AA', fontWeight: 'bold' }} align="right">Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reports.length > 0 ? (
                      reports.map((r) => (
                        <TableRow key={r._id} sx={{ '&:hover': { bgcolor: '#1A1A1A' } }}>
                          <TableCell sx={{ borderBottom: '1px solid #222' }}>
                             <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '0.85rem' }}>{r.vehicleId?.registrationNumber || 'Deleted'}</Typography>
                          </TableCell>
                          <TableCell sx={{ borderBottom: '1px solid #222' }}>
                             <Typography sx={{ color: '#FACC15', fontWeight: 800 }}>{r.kmDriven} KM</Typography>
                             <Typography variant="caption" sx={{ color: 'zinc.600' }}>{r.openingKm} - {r.closingKm}</Typography>
                          </TableCell>
                          <TableCell sx={{ borderBottom: '1px solid #222' }}>
                             <Typography sx={{ color: 'zinc.400', fontSize: '0.8rem', fontWeight: 600 }}>{r.drivenBy}</Typography>
                          </TableCell>
                          <TableCell sx={{ borderBottom: '1px solid #222' }}>
                             {r.isRunning ? (
                               <VerifiedIcon sx={{ color: '#10B981', fontSize: 20 }} />
                             ) : (
                               <Tooltip title={r.reasonIfNotRunning || 'N/A'}>
                                 <WarningAmberIcon sx={{ color: '#EF4444', fontSize: 20 }} />
                               </Tooltip>
                             )}
                          </TableCell>
                          <TableCell sx={{ borderBottom: '1px solid #222' }} align="right">
                             <Typography sx={{ color: 'zinc.500', fontSize: '0.75rem' }}>{new Date(r.createdAt).toLocaleDateString()}</Typography>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} sx={{ textAlign: 'center', py: 10, color: 'zinc.700' }}>No reports submitted yet.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Grid>
        </Grid>

      </Stack>
    </Container>
  );
}
