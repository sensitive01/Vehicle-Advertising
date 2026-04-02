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

interface Lead {
  _id: string;
  contactName: string;
  mobileNumber: string;
  email: string;
  vehicleType: string;
  requirementDetails: string;
  status: string;
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

  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

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
    } catch (err) {
      console.error('Failed to fetch leads', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenViewer = (lead: Lead) => setSelectedLead(lead);
  const handleCloseViewer = () => setSelectedLead(null);

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
    const d = new Date(isoString);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    return `${day}-${month}-${year} ${time}`;
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
          sx={{ bgcolor: '#FACC15', color: 'black', fontWeight: 700, p: '10px 24px', borderRadius: 3, '&:hover': { bgcolor: '#FDE047' } }}
        >
          Add New Lead
        </Button>
      </Box>

      <Card sx={{ bgcolor: '#121212', border: '1px solid #333', borderRadius: 4, overflow: 'hidden' }}>
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
                      <Button 
                        variant="outlined" 
                        size="small" 
                        startIcon={<VisibilityIcon />}
                        onClick={() => handleOpenViewer(lead)}
                        sx={{ textTransform: 'none', borderRadius: 2 }}
                      >
                        View Info
                      </Button>
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
          bgcolor: '#1E1E1E', color: 'white', borderRadius: 3, border: '1px solid #333',
          '&::-webkit-scrollbar': { display: 'none' },
          msOverflowStyle: 'none',
          scrollbarWidth: 'none'
        } }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid #333', pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
            </div>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid #333' }}>
          <Button onClick={handleCloseViewer} variant="outlined" sx={{ color: 'white', borderColor: '#555', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.05)' } }}>
            Close Window
          </Button>
          <Button onClick={handleCloseViewer} variant="contained" sx={{ bgcolor: '#FACC15', color: 'black', fontWeight: 700, '&:hover': { bgcolor: '#FDE047' } }}>
            Mark as Contacted
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Lead Dialog */}
      <Dialog 
        open={isAdding} onClose={handleCloseAdder} maxWidth="sm" fullWidth 
        PaperProps={{ sx: { 
          bgcolor: '#1E1E1E', color: 'white', borderRadius: 4, border: '1px solid #333',
          '&::-webkit-scrollbar': { display: 'none' },
          msOverflowStyle: 'none',
          scrollbarWidth: 'none'
        } }}
      >
        <form onSubmit={handleCreateLead}>
          <DialogTitle sx={{ borderBottom: '1px solid #333', pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                      '& .MuiOutlinedInput-root': { bgcolor: '#000', color: 'white', borderRadius: 3, '& fieldset': { borderColor: '#333' }, '&:hover fieldset': { borderColor: '#444' }, '&.Mui-focused fieldset': { borderColor: '#FACC15' } },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ color: '#A1A1AA', fontSize: '0.8rem', fontWeight: 600, mb: 1, ml: 0.5 }}>MOBILE NUMBER *</Typography>
                  <TextField 
                    fullWidth required placeholder="+91 ..."
                    value={newLead.mobileNumber} onChange={(e) => setNewLead({...newLead, mobileNumber: e.target.value})}
                    sx={{ 
                      '& .MuiOutlinedInput-root': { bgcolor: '#000', color: 'white', borderRadius: 3, '& fieldset': { borderColor: '#333' }, '&:hover fieldset': { borderColor: '#444' }, '&.Mui-focused fieldset': { borderColor: '#FACC15' } },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ color: '#A1A1AA', fontSize: '0.8rem', fontWeight: 600, mb: 1, ml: 0.5 }}>EMAIL ADDRESS *</Typography>
                  <TextField 
                    fullWidth required type="email" placeholder="email@example.com"
                    value={newLead.email} onChange={(e) => setNewLead({...newLead, email: e.target.value})}
                    sx={{ 
                      '& .MuiOutlinedInput-root': { bgcolor: '#000', color: 'white', borderRadius: 3, '& fieldset': { borderColor: '#333' }, '&:hover fieldset': { borderColor: '#444' }, '&.Mui-focused fieldset': { borderColor: '#FACC15' } },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ color: '#A1A1AA', fontSize: '0.8rem', fontWeight: 600, mb: 1, ml: 0.5 }}>VEHICLE PREFERENCE</Typography>
                  <FormControl fullWidth>
                    <Select 
                      value={newLead.vehicleType} onChange={(e) => setNewLead({...newLead, vehicleType: e.target.value as string})}
                      sx={{ bgcolor: '#000', color: 'white', borderRadius: 3, '& fieldset': { borderColor: '#333' }, '&:hover fieldset': { borderColor: '#444' }, '&.Mui-focused fieldset': { borderColor: '#FACC15' } }}
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
                      sx={{ bgcolor: '#000', color: 'white', borderRadius: 3, '& fieldset': { borderColor: '#333' }, '&:hover fieldset': { borderColor: '#444' }, '&.Mui-focused fieldset': { borderColor: '#FACC15' } }}
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
                      '& .MuiOutlinedInput-root': { bgcolor: '#000', color: 'white', borderRadius: 4, '& fieldset': { borderColor: '#333' }, '&:hover fieldset': { borderColor: '#444' }, '&.Mui-focused fieldset': { borderColor: '#FACC15' } },
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
              sx={{ bgcolor: '#FACC15', color: 'black', fontWeight: 800, p: '10px 24px', borderRadius: 3, '&:hover': { bgcolor: '#FDE047' } }}
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
        <Alert severity={notification.severity} sx={{ borderRadius: 3, fontWeight: 700 }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
