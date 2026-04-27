'use client';
import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Card, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Chip, CircularProgress, Paper, Divider, 
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, 
  TablePagination, IconButton, Tooltip, Stack, Avatar, Alert
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PaymentsIcon from '@mui/icons-material/Payments';

export default function AdminReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);

  // Payout Dialog State
  const [payoutDialogOpen, setPayoutDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [payoutAmount, setPayoutAmount] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setReports(data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleOpenPayout = (report: any) => {
    setSelectedReport(report);
    // Auto-calculate payout: 10 INR per KM (Default)
    setPayoutAmount(report.kmDriven * 10);
    setPayoutDialogOpen(true);
  };

  const handleProcessPayout = async () => {
    setProcessing(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports/payout/${selectedReport._id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ amount: payoutAmount })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Payout processed successfully!');
        setReports(reports.map(r => r._id === selectedReport._id ? { ...r, payoutStatus: 'Paid', payoutAmount: payoutAmount } : r));
        setTimeout(() => {
          setPayoutDialogOpen(false);
          setSuccessMsg('');
        }, 1500);
      }
    } catch (err) { console.error(err); }
    finally { setProcessing(false); }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ color: 'white', fontWeight: 900, mb: 4, textTransform: 'uppercase' }}>
        Daily <span style={{ color: '#FACC15' }}>Reports</span>
      </Typography>

      <Card sx={{ bgcolor: '#121212', border: '1px solid #333', borderRadius: 1.5, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#1A1A1A' }}>
              <TableRow>
                <TableCell sx={{ color: '#A1A1AA', fontWeight: 'bold' }}>Vehicle</TableCell>
                <TableCell sx={{ color: '#A1A1AA', fontWeight: 'bold' }}>Owner</TableCell>
                <TableCell sx={{ color: '#A1A1AA', fontWeight: 'bold' }}>KM Driven</TableCell>
                <TableCell sx={{ color: '#A1A1AA', fontWeight: 'bold' }}>Range</TableCell>
                <TableCell sx={{ color: '#A1A1AA', fontWeight: 'bold' }}>Damage</TableCell>
                <TableCell sx={{ color: '#A1A1AA', fontWeight: 'bold' }}>Date & Time</TableCell>
                <TableCell sx={{ color: '#A1A1AA', fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ color: '#A1A1AA', fontWeight: 'bold' }}>Payout</TableCell>
                <TableCell sx={{ color: '#A1A1AA', fontWeight: 'bold' }} align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={9} sx={{ textAlign: 'center', py: 6 }}><CircularProgress color="warning" /></TableCell></TableRow>
              ) : reports.length === 0 ? (
                <TableRow><TableCell colSpan={9} sx={{ textAlign: 'center', py: 6, color: 'zinc.600' }}>No reports submitted yet today.</TableCell></TableRow>
              ) : (
                reports.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((r) => (
                  <TableRow key={r._id} sx={{ '&:hover': { bgcolor: '#1A1A1A' } }}>
                    <TableCell>
                      <Typography sx={{ color: 'white', fontWeight: 700 }}>{r.vehicleId?.registrationNumber}</Typography>
                      <Typography variant="caption" sx={{ color: 'zinc.500' }}>{r.vehicleId?.make} {r.vehicleId?.vehicleModel}</Typography>
                    </TableCell>
                    <TableCell>
                       <Typography sx={{ color: 'zinc.300', fontSize: '0.85rem' }}>{r.userId?.fullName}</Typography>
                    </TableCell>
                    <TableCell sx={{ color: '#FACC15', fontWeight: 900 }}>{r.kmDriven} KM</TableCell>
                    <TableCell sx={{ color: 'zinc.400', fontSize: '0.75rem' }}>{r.openingKm} → {r.closingKm}</TableCell>
                    <TableCell>
                      {r.damageReported ? (
                        <Chip size="small" icon={<WarningIcon sx={{ fontSize: '0.8rem !important' }} />} label="Damage" sx={{ bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#F87171', fontWeight: 800 }} />
                      ) : <Typography variant="caption" sx={{ color: '#4ADE80' }}>All Good</Typography>}
                    </TableCell>
                    <TableCell sx={{ color: 'zinc.500', fontSize: '0.8rem' }}>{formatDate(r.createdAt)}</TableCell>
                    <TableCell>
                      {r.isRunning ? <Chip size="small" label="RUNNING" sx={{ bgcolor: 'rgba(34, 197, 94, 0.1)', color: '#4ADE80', fontWeight: 'bold' }} /> : <Chip size="small" label="IDLE" sx={{ bgcolor: 'rgba(255,165,0,0.1)', color: 'orange', fontWeight: 'bold' }} />}
                    </TableCell>
                    <TableCell>
                       {r.payoutStatus === 'Paid' ? (
                          <Chip size="small" icon={<CheckCircleIcon sx={{ fontSize: '0.8rem !important' }} />} label={`₹${r.payoutAmount}`} sx={{ bgcolor: 'rgba(34, 197, 94, 0.1)', color: '#4ADE80', fontWeight: 800 }} />
                       ) : (
                          <Typography variant="caption" sx={{ color: 'zinc.600' }}>Pending</Typography>
                       )}
                    </TableCell>
                    <TableCell align="right">
                       {r.payoutStatus !== 'Paid' && r.kmDriven > 0 && (
                          <Button 
                            variant="outlined" 
                            size="small" 
                            startIcon={<PaymentsIcon />} 
                            onClick={() => handleOpenPayout(r)}
                            sx={{ borderColor: '#FACC15', color: '#FACC15', fontWeight: 800, fontSize: '0.7rem' }}
                          >
                             Pay Owner
                          </Button>
                       )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination component="div" count={reports.length} rowsPerPage={rowsPerPage} page={page} onPageChange={(e, p) => setPage(p)} onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }} sx={{ color: 'zinc.400', borderTop: '1px solid #333' }} />
      </Card>

      {/* Payout Dialog */}
      <Dialog 
        open={payoutDialogOpen} 
        onClose={() => !processing && setPayoutDialogOpen(false)}
        PaperProps={{ sx: { bgcolor: '#121212', color: 'white', border: '1px solid #333', borderRadius: 2 } }}
      >
         <DialogTitle sx={{ fontWeight: 900, textTransform: 'uppercase' }}>Confirm <span style={{ color: '#FACC15' }}>Payout</span></DialogTitle>
         <DialogContent sx={{ minWidth: 350 }}>
            {successMsg ? (
               <Alert severity="success" sx={{ bgcolor: 'rgba(34, 197, 94, 0.1)', color: '#4ADE80', border: '1px solid #4ADE80' }}>{successMsg}</Alert>
            ) : (
              <Stack spacing={3} sx={{ mt: 1 }}>
                 <Box sx={{ p: 2, bgcolor: '#0A0A0A', borderRadius: 2, border: '1px solid #222' }}>
                    <Typography variant="caption" sx={{ color: 'zinc.500', fontWeight: 700 }}>VEHICLE OWNER</Typography>
                    <Typography sx={{ fontWeight: 800 }}>{selectedReport?.userId?.fullName}</Typography>
                    <Typography variant="body2" sx={{ color: '#FACC15', mt: 1 }}>{selectedReport?.kmDriven} KM Driven (₹10/km default)</Typography>
                 </Box>

                 <TextField 
                   fullWidth 
                   label="Payout Amount (₹)" 
                   type="number" 
                   value={payoutAmount} 
                   onChange={(e) => setPayoutAmount(Number(e.target.value))}
                   sx={{ 
                     '& .MuiOutlinedInput-root': { 
                       bgcolor: '#000', color: 'white',
                       '& fieldset': { borderColor: '#333' },
                       '&.Mui-focused fieldset': { borderColor: '#FACC15' }
                     },
                     '& .MuiInputLabel-root': { color: 'zinc.500' }
                   }}
                 />
              </Stack>
            )}
         </DialogContent>
         <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setPayoutDialogOpen(false)} sx={{ color: 'zinc.500' }}>Cancel</Button>
            <Button 
              variant="contained" 
              onClick={handleProcessPayout} 
              disabled={processing || !!successMsg}
              sx={{ bgcolor: '#FACC15', color: 'black', fontWeight: 900, '&:hover': { bgcolor: '#FDE047' } }}
            >
               {processing ? 'Processing...' : 'Confirm Payment'}
            </Button>
         </DialogActions>
      </Dialog>
    </Box>
  );
}

