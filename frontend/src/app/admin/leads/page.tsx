'use client';
import React, { useEffect, useState } from 'react';
import { 
  Box, Typography, Card, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, TablePagination, Chip, Button, Dialog, DialogTitle, 
  DialogContent, DialogActions, Grid 
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';

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

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/leads');
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
      <Typography variant="h4" sx={{ color: 'white', fontWeight: 900, mb: 4, textTransform: 'uppercase' }}>
        Advertisement <span style={{ color: '#FACC15' }}>Leads</span>
      </Typography>

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
      <Dialog open={!!selectedLead} onClose={handleCloseViewer} maxWidth="md" fullWidth PaperProps={{ sx: { bgcolor: '#1E1E1E', color: 'white', borderRadius: 3, border: '1px solid #333' } }}>
        <DialogTitle sx={{ borderBottom: '1px solid #333', pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>Lead <span style={{ color: '#FACC15' }}>Details</span></Typography>
          {selectedLead && (
            <Chip label={selectedLead.status} sx={{ bgcolor: 'rgba(250, 204, 21, 0.2)', color: '#FACC15', fontWeight: 'bold' }} />
          )}
        </DialogTitle>
        <DialogContent sx={{ mt: 3 }}>
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
    </Box>
  );
}
