'use client';
import React, { useEffect, useState } from 'react';
import { 
  Box, Typography, Card, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, TablePagination, Chip, Button, Dialog, DialogTitle, 
  DialogContent, DialogActions, Grid, Stack, TextField, MenuItem, 
  FormControl, Select, CircularProgress, Alert, Snackbar, 
  IconButton
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DownloadIcon from '@mui/icons-material/Download';
import Tooltip from '@mui/material/Tooltip';

interface Lead {
  _id: string;
  contactName: string;
  mobileNumber: string;
  email: string;
  vehicleType: string;
  requirementDetails: string;
  status: string;
  quotedPrice?: number;
  designCharges?: number;
  printingCharges?: number;
  serviceCharges?: number;
  transportCharges?: number;
  installationCharges?: number;
  rentalPerKm?: number;
  expectedAvgKm?: number;
  gstPercentage?: number;
  notes?: string;
  createdAt: string;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  
  // Create Lead State
  const [isAdding, setIsAdding] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newLead, setNewLead] = useState({
    contactName: '',
    mobileNumber: '',
    email: '',
    vehicleType: 'Any',
    requirementDetails: '',
    status: 'New'
  });

  // Quoting Modal State
  const [isQuoting, setIsQuoting] = useState(false);
  const [quotingLead, setQuotingLead] = useState<Lead | null>(null);

  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // Quote Data for complex breakdown
  const [quoteData, setQuoteData] = useState<{
    designCharges: number | string;
    printingCharges: number | string;
    serviceCharges: number | string;
    transportCharges: number | string;
    installationCharges: number | string;
    rentalPerKm: number | string;
    expectedAvgKm: number | string;
    gstPercentage: number | string;
    durationMonths: number;
    notes?: string;
  }>({
    designCharges: 0,
    printingCharges: 0,
    serviceCharges: 0,
    transportCharges: 0,
    installationCharges: 0,
    rentalPerKm: 0,
    expectedAvgKm: 3000,
    gstPercentage: 18,
    durationMonths: 3,
    notes: ''
  });

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/leads`);
      const data = await res.json();
      if (data.success) {
        setLeads(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch leads', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenViewer = (lead: Lead) => setSelectedLead(lead);
  const handleCloseViewer = () => setSelectedLead(null);

  const handleOpenQuoter = (lead: Lead) => {
    setQuotingLead(lead);
    setQuoteData({
      designCharges: lead.designCharges || 0,
      printingCharges: lead.printingCharges || 0,
      serviceCharges: lead.serviceCharges || 0,
      transportCharges: lead.transportCharges || 0,
      installationCharges: lead.installationCharges || 0,
      rentalPerKm: lead.rentalPerKm || 0,
      expectedAvgKm: lead.expectedAvgKm || 3000,
      gstPercentage: lead.gstPercentage || 18,
      durationMonths: 3,
      notes: lead.notes || ''
    });
    setIsQuoting(true);
  };
  const handleCloseQuoter = () => {
    setIsQuoting(false);
    setQuotingLead(null);
  };

  const calculateTotal = () => {
    const getVal = (val: string | number) => (val === '' ? 0 : Number(val));
    const oneTime = getVal(quoteData.designCharges) + getVal(quoteData.printingCharges) + getVal(quoteData.serviceCharges) + getVal(quoteData.transportCharges) + getVal(quoteData.installationCharges);
    const recurring = (getVal(quoteData.rentalPerKm) * getVal(quoteData.expectedAvgKm)) * getVal(quoteData.durationMonths);
    const baseTotal = oneTime + recurring;
    const gstAmount = (baseTotal * getVal(quoteData.gstPercentage)) / 100;
    return { subtotal: baseTotal, gst: gstAmount, total: baseTotal + gstAmount };
  };

  const handleUpdateLead = async (status: string, leadId?: string) => {
    const targetId = leadId || selectedLead?._id || quotingLead?._id;
    if (!targetId) return;
    setSubmitting(true);
    const { total } = calculateTotal();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/leads/${targetId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status, 
          quotedPrice: total,
          ...quoteData
        })
      });
      const data = await res.json();
      if (data.success) {
        setNotification({ open: true, message: `Lead updated to ${status}`, severity: 'success' });
        fetchLeads();
        handleCloseViewer();
        handleCloseQuoter();
      }
    } catch (error) {
      console.error('Update failed:', error);
      setNotification({ open: true, message: 'Update failed', severity: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenAdder = () => setIsAdding(true);
  const handleCloseAdder = () => {
    setIsAdding(false);
    setNewLead({
      contactName: '',
      mobileNumber: '',
      email: '',
      vehicleType: 'Any',
      requirementDetails: '',
      status: 'New'
    });
  };

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLead)
      });
      const data = await res.json();
      if (data.success) {
        setNotification({ open: true, message: 'Lead added successfully!', severity: 'success' });
        fetchLeads();
        handleCloseAdder();
      } else {
        setNotification({ open: true, message: data.error || 'Failed to add lead', severity: 'error' });
      }
    } catch (err: unknown) {
      console.error(err);
      setNotification({ open: true, message: 'Network error occurred', severity: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatDateTime = (isoString: string) => {
    if (!isoString) return 'N/A';
    const d = new Date(isoString);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = String(d.getFullYear()).slice(-2);
    return `${day}-${month}-${year}`;
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ color: 'white', fontWeight: 900, textTransform: 'uppercase', mb: 0 }}>
          Advertisement <span style={{ color: '#FACC15' }}>Leads</span>
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={handleOpenAdder}
          sx={{ bgcolor: '#FACC15', color: 'black', fontWeight: 700, p: '10px 24px', borderRadius: 1, '&:hover': { bgcolor: '#FDE047' } }}
        >
          Add New Lead
        </Button>
      </Box>

      <Card sx={{ bgcolor: '#121212', border: '1px solid #333', borderRadius: 1.5, overflow: 'hidden' }}>
        <TableContainer>
          <Table sx={{ minWidth: 800 }}>
            <TableHead sx={{ bgcolor: '#1A1A1A' }}>
              <TableRow>
                <TableCell sx={{ color: '#A1A1AA', fontWeight: 'bold' }}>SL</TableCell>
                <TableCell sx={{ color: '#A1A1AA', fontWeight: 'bold' }}>Contact Date</TableCell>
                <TableCell sx={{ color: '#A1A1AA', fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ color: '#A1A1AA', fontWeight: 'bold' }}>Email Address</TableCell>
                <TableCell sx={{ color: '#A1A1AA', fontWeight: 'bold' }}>Vehicle Preference</TableCell>
                <TableCell sx={{ color: '#A1A1AA', fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ color: '#A1A1AA', fontWeight: 'bold', textAlign: 'center' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={7} sx={{ color: 'white', textAlign: 'center', py: 4 }}>Loading Lead Data...</TableCell></TableRow>
              ) : leads.length === 0 ? (
                <TableRow><TableCell colSpan={7} sx={{ color: 'zinc.400', textAlign: 'center', py: 4 }}>No inquiries found.</TableCell></TableRow>
              ) : (
                leads.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((lead, index) => (
                  <TableRow key={lead._id} sx={{ '&:hover': { bgcolor: '#1A1A1A' }, transition: 'background-color 0.2s' }}>
                    <TableCell sx={{ color: 'zinc.500' }}>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell sx={{ color: 'zinc.300' }}>{formatDateTime(lead.createdAt)}</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>{lead.contactName}</TableCell>
                    <TableCell sx={{ color: 'zinc.300' }}>{lead.email}</TableCell>
                    <TableCell sx={{ color: 'zinc.300' }}>{lead.vehicleType === 'Any' ? 'Mixed Fleet' : lead.vehicleType}</TableCell>
                    <TableCell>
                      <Chip label={lead.status} size="small" sx={{ 
                        bgcolor: lead.status === 'New' ? 'rgba(250, 204, 21, 0.2)' : 'rgba(59, 130, 246, 0.2)', 
                        color: lead.status === 'New' ? '#FACC15' : '#60A5FA',
                        fontWeight: 'bold',
                        border: lead.status === 'New' ? '1px solid #FACC15' : '1px solid #60A5FA'
                      }} />
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                        <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
                          <Tooltip title="View Lead Details">
                            <Button 
                              size="small" variant="outlined" startIcon={<VisibilityIcon />}
                              onClick={() => handleOpenViewer(lead)}
                              sx={{ color: 'zinc.400', borderColor: '#333', textTransform: 'none', borderRadius: 2, '&:hover': { borderColor: '#555', bgcolor: 'rgba(255,255,255,0.05)' } }}
                            >
                              View Info
                            </Button>
                          </Tooltip>

                          {lead.quotedPrice && lead.quotedPrice > 0 ? (
                            <Tooltip title="Download Invoice PDF">
                              <IconButton 
                                size="small"
                                onClick={() => window.open(`${process.env.NEXT_PUBLIC_API_URL}/api/leads/${lead._id}/download-quote`, '_blank')}
                                sx={{ color: '#FACC15', bgcolor: 'rgba(250, 204, 21, 0.1)', border: '1px solid rgba(250, 204, 21, 0.2)', '&:hover': { bgcolor: 'rgba(250, 204, 21, 0.2)' } }}
                              >
                                <DownloadIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          ) : null}

                          <Tooltip title={lead.quotedPrice ? "Already Quoted - Click to Update" : "Create New Quote"}>
                            <Button 
                              size="small" variant="contained"
                              startIcon={<AssignmentIcon />}
                              onClick={() => handleOpenQuoter(lead)}
                              sx={{ 
                                bgcolor: lead.quotedPrice ? '#3B82F6' : '#FACC15', 
                                color: lead.quotedPrice ? 'white' : 'black',
                                fontWeight: 800, textTransform: 'none', borderRadius: 2, px: 2,
                                '&:hover': { bgcolor: lead.quotedPrice ? '#2563EB' : '#EAB308' }
                              }}
                            >
                              {lead.quotedPrice ? 'Update Quote' : 'Make Quote'}
                            </Button>
                          </Tooltip>
                        </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={leads.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[15, 30, 50]}
          sx={{ color: 'zinc.400', borderTop: '1px solid #333' }}
        />
      </Card>

      {/* View Lead Dialog */}
      <Dialog 
        open={!!selectedLead} onClose={handleCloseViewer} maxWidth="md" fullWidth 
        PaperProps={{ sx: { 
          bgcolor: '#1E1E1E', color: 'white', borderRadius: 1, border: '1px solid #333',
          '&::-webkit-scrollbar': { display: 'none' },
          msOverflowStyle: 'none',
          scrollbarWidth: 'none'
        } }}
      >
        <DialogTitle component="div" sx={{ borderBottom: '1px solid #333', pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>Lead <span style={{ color: '#FACC15' }}>Details</span></Typography>
          {selectedLead && (
            <Chip label={selectedLead.status} sx={{ bgcolor: 'rgba(250, 204, 21, 0.2)', color: '#FACC15', fontWeight: 'bold' }} />
          )}
        </DialogTitle>
        <DialogContent sx={{ 
          mt: 3,
          '&::-webkit-scrollbar': { display: 'none' },
          msOverflowStyle: 'none',
          scrollbarWidth: 'none'
        }}>
          {selectedLead && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <Typography sx={{ color: 'zinc.500', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 700, mb: 1 }}>Contact Overview</Typography>
                <div className="bg-[#121212] p-4 rounded-xl border border-zinc-800 space-y-3 h-full">
                  <Typography><strong>Name:</strong> {selectedLead.contactName}</Typography>
                  <Typography><strong>Phone:</strong> {selectedLead.mobileNumber}</Typography>
                  <Typography><strong>Email:</strong> {selectedLead.email}</Typography>
                </div>
              </div>
              
              <div className="flex flex-col">
                <Typography sx={{ color: 'zinc.500', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 700, mb: 1 }}>Campaign Requirements</Typography>
                <div className="bg-[#121212] p-4 rounded-xl border border-zinc-800 space-y-3 h-full">
                  <Typography><strong>Vehicle Pref:</strong> {selectedLead.vehicleType === 'Any' ? 'Mixed Fleet' : selectedLead.vehicleType}</Typography>
                  <Typography><strong>Date Req:</strong> {formatDateTime(selectedLead.createdAt)}</Typography>
                </div>
              </div>

              <div className="col-span-1 md:col-span-2">
                <Typography sx={{ color: 'zinc.500', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 700, mb: 1 }}>Message & Details</Typography>
                <div className="bg-[#121212] p-6 rounded-xl border border-zinc-800">
                  <Typography sx={{ color: 'zinc.300', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{selectedLead.requirementDetails}</Typography>
                </div>
              </div>

              <div className="col-span-1 md:col-span-2">
                <Typography sx={{ color: 'zinc.500', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 700, mb: 1 }}>Message & Details</Typography>
                <div className="bg-[#121212] p-6 rounded-xl border border-zinc-800">
                  <Typography sx={{ color: 'zinc.300', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{selectedLead.requirementDetails}</Typography>
                </div>
              </div>

              {selectedLead.quotedPrice && selectedLead.quotedPrice > 0 && (
                <div className="col-span-1 md:col-span-2 mt-4">
                  <Box sx={{ bgcolor: 'rgba(96, 165, 250, 0.05)', p: 3, border: '1px solid rgba(96, 165, 250, 0.2)', borderRadius: 1.5 }}>
                    <Typography sx={{ color: '#60A5FA', fontWeight: 900, mb: 1, textTransform: 'uppercase', fontSize: '0.75rem' }}>Active Quotation Detected</Typography>
                    <Typography variant="h5" sx={{ color: 'white', fontWeight: 900 }}>Total Value: ₹{selectedLead.quotedPrice.toLocaleString()}</Typography>
                  </Box>
                </div>
              )}
            </div>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid #333', justifyContent: 'space-between' }}>
          <Button onClick={handleCloseViewer} variant="outlined" sx={{ color: '#A1A1AA', borderColor: '#444' }}>
            Close Info
          </Button>
          <Stack direction="row" spacing={2}>
            <Button 
              onClick={() => handleUpdateLead('Contacted')} 
              disabled={submitting || selectedLead?.status === 'Contacted'}
              variant="outlined" 
              sx={{ color: 'white', borderColor: '#FACC15', fontWeight: 700 }}
            >
              Mark Contacted
            </Button>
            <Button 
              onClick={() => handleUpdateLead('Closed')} 
              disabled={submitting || selectedLead?.status === 'Closed'}
              variant="contained" 
              sx={{ bgcolor: '#EF4444', color: 'white', fontWeight: 800 }}
            >
              Reject Lead
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>

      {/* Make Quote Dialog */}
      <Dialog 
        open={isQuoting} onClose={handleCloseQuoter} maxWidth="md" fullWidth 
        PaperProps={{ sx: { 
          bgcolor: '#1E1E1E', color: 'white', borderRadius: 1, border: '1px solid #333',
          '&::-webkit-scrollbar': { display: 'none' },
          msOverflowStyle: 'none',
          scrollbarWidth: 'none'
        } }}
      >
        <DialogTitle component="div" sx={{ borderBottom: '1px solid #333', pb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>Create <span style={{ color: '#FACC15' }}>Quotation</span></Typography>
          <Typography variant="caption" sx={{ color: 'zinc.500' }}>For: {quotingLead?.contactName} ({quotingLead?.email})</Typography>
        </DialogTitle>
        <DialogContent sx={{ 
          mt: 3,
          '&::-webkit-scrollbar': { display: 'none' },
          msOverflowStyle: 'none',
          scrollbarWidth: 'none'
        }}>
          {quotingLead && (
            <Grid container spacing={3}>
              {/* One-time Costs */}
              <Grid size={{ xs: 12 }}>
                <Typography sx={{ color: 'zinc.500', fontSize: '0.75rem', fontWeight: 800, mb: 2 }}>ONE-TIME SETUP CHARGES (INR)</Typography>
                <Grid container spacing={2}>
                  {[
                    { label: 'Design', key: 'designCharges' },
                    { label: 'Printing', key: 'printingCharges' },
                    { label: 'Service', key: 'serviceCharges' },
                    { label: 'Transport', key: 'transportCharges' },
                    { label: 'Installation', key: 'installationCharges' }
                  ].map((field) => (
                    <Grid size={{ xs: 6, sm: 2.4 }} key={field.key}>
                      <Typography sx={{ color: 'zinc.500', fontSize: '0.7rem', fontWeight: 600, mb: 0.5, ml: 0.5 }}>{field.label.toUpperCase()}</Typography>
                      <TextField 
                        fullWidth type="number" size="small"
                        value={quoteData[field.key as keyof typeof quoteData]} 
                        onChange={(e) => {
                           const val = e.target.value;
                           if (val === '') { setQuoteData({...quoteData, [field.key]: ''}); return; }
                           setQuoteData({...quoteData, [field.key]: Math.max(0, Number(val))});
                        }}
                        inputProps={{ min: 0 }}
                        sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#000', color: 'white', borderRadius: 2, '& fieldset': { borderColor: '#333' }, '&.Mui-focused fieldset': { borderColor: '#FACC15' } } }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Grid>

              {/* Recurring Rental Logic */}
              <Grid size={{ xs: 12 }}>
                <Typography sx={{ color: 'zinc.500', fontSize: '0.75rem', fontWeight: 800, mb: 2, mt: 1 }}>RECURRING AD RENTAL ESTIMATION</Typography>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 3 }}>
                      <Typography sx={{ color: 'zinc.500', fontSize: '0.7rem', fontWeight: 600, mb: 0.5, ml: 0.5 }}>RENTAL (PER KM)</Typography>
                      <TextField 
                        fullWidth type="number" size="small"
                        value={quoteData.rentalPerKm} onChange={(e) => {
                           const val = e.target.value;
                           if (val === '') { setQuoteData({...quoteData, rentalPerKm: ''}); return; }
                           setQuoteData({...quoteData, rentalPerKm: Math.max(0, Number(val))});
                        }}
                        inputProps={{ min: 0 }}
                        sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#000', color: 'white', borderRadius: 2, '& fieldset': { borderColor: '#333' }, '&.Mui-focused fieldset': { borderColor: '#FACC15' } } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 3 }}>
                      <Typography sx={{ color: 'zinc.500', fontSize: '0.7rem', fontWeight: 600, mb: 0.5, ml: 0.5 }}>AVG KM/MONTH</Typography>
                      <TextField 
                        fullWidth type="number" size="small"
                        value={quoteData.expectedAvgKm} onChange={(e) => {
                           const val = e.target.value;
                           if (val === '') { setQuoteData({...quoteData, expectedAvgKm: ''}); return; }
                           setQuoteData({...quoteData, expectedAvgKm: Math.max(0, Number(val))});
                        }}
                        inputProps={{ min: 0 }}
                        sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#000', color: 'white', borderRadius: 2, '& fieldset': { borderColor: '#333' }, '&.Mui-focused fieldset': { borderColor: '#FACC15' } } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 3 }}>
                      <Typography sx={{ color: 'zinc.500', fontSize: '0.7rem', fontWeight: 600, mb: 0.5, ml: 0.5 }}>CAMPAIGN DURATION</Typography>
                      <FormControl fullWidth sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#000', color: 'white', borderRadius: 2, '& fieldset': { borderColor: '#333' }, '&.Mui-focused fieldset': { borderColor: '#FACC15' } } }}>
                        <Select size="small" value={quoteData.durationMonths} onChange={(e) => setQuoteData({...quoteData, durationMonths: Number(e.target.value)})}>
                            <MenuItem value={3}>3 Months</MenuItem>
                            <MenuItem value={6}>6 Months</MenuItem>
                            <MenuItem value={12}>1 Year</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 3 }}>
                      <Typography sx={{ color: 'zinc.500', fontSize: '0.7rem', fontWeight: 600, mb: 0.5, ml: 0.5 }}>GST (%)</Typography>
                      <TextField 
                        fullWidth type="number" size="small"
                        value={quoteData.gstPercentage} onChange={(e) => {
                           const val = e.target.value;
                           if (val === '') { setQuoteData({...quoteData, gstPercentage: ''}); return; }
                           setQuoteData({...quoteData, gstPercentage: Math.max(0, Number(val))});
                        }}
                        inputProps={{ min: 0, max: 100 }}
                        sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#000', color: 'white', borderRadius: 2, '& fieldset': { borderColor: '#333' }, '&.Mui-focused fieldset': { borderColor: '#FACC15' } } }}
                      />
                    </Grid>
                </Grid>
              </Grid>

              {/* Summary Box */}
              <Grid size={{ xs: 12 }}>
                <Box sx={{ bgcolor: 'rgba(250, 204, 21, 0.05)', p: 3, border: '1px solid rgba(250, 204, 21, 0.2)', borderRadius: 1.5 }}>
                    <Grid container spacing={3} justifyContent="space-between" alignItems="center">
                      <Grid size={{ xs: 12, sm: 'auto' }}>
                          <Stack direction="row" spacing={4}>
                            <Box>
                                <Typography variant="caption" sx={{ color: 'zinc.500', fontWeight: 700 }}>SUBTOTAL</Typography>
                                <Typography sx={{ color: 'white', fontWeight: 800 }}>₹{calculateTotal().subtotal.toLocaleString()}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" sx={{ color: 'zinc.500', fontWeight: 700 }}>GST ({quoteData.gstPercentage}%)</Typography>
                                <Typography sx={{ color: 'white', fontWeight: 800 }}>₹{calculateTotal().gst.toLocaleString()}</Typography>
                            </Box>
                          </Stack>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 'auto' }}>
                          <Typography variant="h5" sx={{ color: '#FACC15', fontWeight: 900 }}>TOTAL: ₹{calculateTotal().total.toLocaleString()}</Typography>
                      </Grid>
                    </Grid>
                </Box>
              </Grid>

              {/* Editable Notes for PDF */}
              <Grid size={{ xs: 12 }}>
                <Typography sx={{ color: 'zinc.500', fontSize: '0.75rem', fontWeight: 800, mb: 1, mt: 1 }}>CAMPAIGN NOTES / SPECIAL TERMS (APPEARS ON PDF)</Typography>
                <TextField 
                  fullWidth multiline rows={3} placeholder="Add any custom terms, duration details, or a personalized message for the advertiser here..."
                  value={quoteData.notes} onChange={(e) => setQuoteData({...quoteData, notes: e.target.value})}
                  sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#000', color: '#D4D4D8', borderRadius: 1, fontSize: '0.85rem', '& fieldset': { borderColor: '#333' }, '&.Mui-focused fieldset': { borderColor: '#FACC15' } } }}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid #333' }}>
          <Button onClick={handleCloseQuoter} sx={{ color: 'zinc.500' }}>Cancel</Button>
          <Button 
            variant="contained" 
            disabled={submitting}
            onClick={() => handleUpdateLead('Quoted')}
            sx={{ bgcolor: '#FACC15', color: 'black', fontWeight: 900, px: 4, borderRadius: 1, '&:hover': { bgcolor: '#FDE047' } }}
          >
            {submitting ? <CircularProgress size={24} color="inherit" /> : 'GENERATE & EMAIL QUOTE'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Lead Dialog */}
      <Dialog 
        open={isAdding} onClose={handleCloseAdder} maxWidth="sm" fullWidth 
        PaperProps={{ sx: { 
          bgcolor: '#1E1E1E', color: 'white', borderRadius: 1.5, border: '1px solid #333',
          '&::-webkit-scrollbar': { display: 'none' },
          msOverflowStyle: 'none',
          scrollbarWidth: 'none'
        } }}
      >
        <form onSubmit={handleCreateLead}>
          <DialogTitle component="div" sx={{ borderBottom: '1px solid #333', pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>Add New <span style={{ color: '#FACC15' }}>Lead</span></Typography>
            <IconButton onClick={handleCloseAdder} sx={{ color: 'zinc.400' }}><CloseIcon /></IconButton>
          </DialogTitle>
          <DialogContent sx={{ 
            mt: 3,
            '&::-webkit-scrollbar': { display: 'none' },
            msOverflowStyle: 'none',
            scrollbarWidth: 'none'
          }}>
            <Stack spacing={3}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <Typography sx={{ color: '#A1A1AA', fontSize: '0.8rem', fontWeight: 600, mb: 1, ml: 0.5 }}>CONTACT NAME *</Typography>
                  <TextField 
                    fullWidth required placeholder="Enter full name"
                    value={newLead.contactName} onChange={(e) => setNewLead({...newLead, contactName: e.target.value})}
                    sx={{ 
                      '& .MuiOutlinedInput-root': { bgcolor: '#000', color: 'white', borderRadius: 1, '& fieldset': { borderColor: '#333' }, '&:hover fieldset': { borderColor: '#444' }, '&.Mui-focused fieldset': { borderColor: '#FACC15' } },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ color: '#A1A1AA', fontSize: '0.8rem', fontWeight: 600, mb: 1, ml: 0.5 }}>MOBILE NUMBER *</Typography>
                  <TextField 
                    fullWidth required placeholder="+91 ..."
                    value={newLead.mobileNumber} onChange={(e) => setNewLead({...newLead, mobileNumber: e.target.value})}
                    sx={{ 
                      '& .MuiOutlinedInput-root': { bgcolor: '#000', color: 'white', borderRadius: 1, '& fieldset': { borderColor: '#333' }, '&:hover fieldset': { borderColor: '#444' }, '&.Mui-focused fieldset': { borderColor: '#FACC15' } },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ color: '#A1A1AA', fontSize: '0.8rem', fontWeight: 600, mb: 1, ml: 0.5 }}>EMAIL ADDRESS *</Typography>
                  <TextField 
                    fullWidth required type="email" placeholder="email@example.com"
                    value={newLead.email} onChange={(e) => setNewLead({...newLead, email: e.target.value})}
                    sx={{ 
                      '& .MuiOutlinedInput-root': { bgcolor: '#000', color: 'white', borderRadius: 1, '& fieldset': { borderColor: '#333' }, '&:hover fieldset': { borderColor: '#444' }, '&.Mui-focused fieldset': { borderColor: '#FACC15' } },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ color: '#A1A1AA', fontSize: '0.8rem', fontWeight: 600, mb: 1, ml: 0.5 }}>VEHICLE PREFERENCE</Typography>
                  <FormControl fullWidth>
                    <Select 
                      value={newLead.vehicleType} onChange={(e) => setNewLead({...newLead, vehicleType: e.target.value as string})}
                      sx={{ bgcolor: '#000', color: 'white', borderRadius: 1, '& fieldset': { borderColor: '#333' }, '&:hover fieldset': { borderColor: '#444' }, '&.Mui-focused fieldset': { borderColor: '#FACC15' } }}
                    >
                      <MenuItem value="Any">Mixed Fleet</MenuItem>
                      <MenuItem value="Trucks">Trucks Only</MenuItem>
                      <MenuItem value="Buses">Buses Only</MenuItem>
                      <MenuItem value="Vans">Vans / Mini-loads</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ color: '#A1A1AA', fontSize: '0.8rem', fontWeight: 600, mb: 1, ml: 0.5 }}>INITIAL STATUS</Typography>
                  <FormControl fullWidth>
                    <Select 
                      value={newLead.status} onChange={(e) => setNewLead({...newLead, status: e.target.value as string})}
                      sx={{ bgcolor: '#000', color: 'white', borderRadius: 1, '& fieldset': { borderColor: '#333' }, '&:hover fieldset': { borderColor: '#444' }, '&.Mui-focused fieldset': { borderColor: '#FACC15' } }}
                    >
                      <MenuItem value="New">New Lead</MenuItem>
                      <MenuItem value="Contacted">Contacted</MenuItem>
                      <MenuItem value="Interested">Interested</MenuItem>
                      <MenuItem value="Closed">Closed</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography sx={{ color: '#A1A1AA', fontSize: '0.8rem', fontWeight: 600, mb: 1, ml: 0.5 }}>REQUIREMENT DETAILS *</Typography>
                  <TextField 
                    fullWidth required multiline rows={4} placeholder="Describe the campaign requirements..."
                    value={newLead.requirementDetails} onChange={(e) => setNewLead({...newLead, requirementDetails: e.target.value})}
                    sx={{ 
                      '& .MuiOutlinedInput-root': { bgcolor: '#000', color: 'white', borderRadius: 1.5, '& fieldset': { borderColor: '#333' }, '&:hover fieldset': { borderColor: '#444' }, '&.Mui-focused fieldset': { borderColor: '#FACC15' } },
                    }}
                  />
                </Grid>
              </Grid>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3, borderTop: '1px solid #333' }}>
            <Button onClick={handleCloseAdder} sx={{ color: 'zinc.400', fontWeight: 600 }}>Cancel</Button>
            <Button 
              type="submit" disabled={submitting} variant="contained" 
              sx={{ bgcolor: '#FACC15', color: 'black', fontWeight: 800, p: '10px 24px', borderRadius: 1, '&:hover': { bgcolor: '#FDE047' } }}
            >
              {submitting ? <CircularProgress size={24} color="inherit" /> : 'Create Lead'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar 
        open={notification.open} 
        autoHideDuration={4000} 
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={notification.severity} sx={{ borderRadius: 1, fontWeight: 700 }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
