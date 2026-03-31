'use client';
import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Card, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Chip, CircularProgress, Alert, TablePagination, 
  IconButton, Tooltip, Dialog, DialogTitle, DialogContent, Button, Divider,
  Avatar, Paper, DialogActions, Grid, Stack
} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BlockIcon from '@mui/icons-material/Block';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CloseIcon from '@mui/icons-material/Close';

interface User {
  _id: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  accountType: string;
  isProfileComplete: boolean;
  isBlocked: boolean;
  createdAt: string;
}

interface Vehicle {
  _id: string;
  registrationNumber: string;
  registrationType: string;
  fuelType: string;
  vehicleCategory: string;
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
  parkingLocation: string;
  adOptions: string[];
  images: string[];
  status: string;
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Modal States
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userVehicles, setUserVehicles] = useState<Vehicle[]>([]);
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  
  // View Detail State
  const [viewOpen, setViewOpen] = useState(false);
  const [viewVehicle, setViewVehicle] = useState<Vehicle | null>(null);
  
  // Confirm Block State
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmUser, setConfirmUser] = useState<User | null>(null);
  
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [blockLoading, setBlockLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/auth/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setUsers(data.data);
      else setErrorMsg(data.message || 'Failed to fetch users');
    } catch (err) {
      console.error(err);
      setErrorMsg('Server connection failed');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserVehicles = async (user: User) => {
    setSelectedUser(user);
    setModalOpen(true);
    setLoadingVehicles(true);
    setUserVehicles([]);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/fleet/user/${user._id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setUserVehicles(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingVehicles(false);
    }
  };

  const handleBlockRequest = (user: User) => {
    setConfirmUser(user);
    setConfirmOpen(true);
  };

  const handleToggleBlock = async () => {
    if (!confirmUser) return;
    const userId = confirmUser._id;
    setBlockLoading(userId);
    setConfirmOpen(false);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/auth/users/${userId}/block`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setUsers(prev => prev.map(u => u._id === userId ? { ...u, isBlocked: data.isBlocked } : u));
      } else alert(data.message);
    } catch (err) {
      console.error(err);
      alert('Error toggling block status');
    } finally {
      setBlockLoading(null);
      setConfirmUser(null);
    }
  };

  const handleApprove = async (vehicleId: string) => {
    setActionLoading(vehicleId);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/fleet/approve/${vehicleId}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setUserVehicles(prev => prev.map(v => v._id === vehicleId ? { ...v, status: 'Verified' } : v));
      } else alert(data.message);
    } catch (err) {
      console.error(err);
      alert('Verification failed');
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };

  const Label = ({ children }: { children: React.ReactNode }) => (
    <Typography variant="body2" sx={{ color: '#FACC15', fontWeight: 800, mb: 0.5, textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: 1 }}>
      {children}
    </Typography>
  );

  const InfoBlock = ({ label, value }: { label: string, value: any }) => (
    <Box sx={{ mb: 1.5 }}>
      <Label>{label}</Label>
      <Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>{value || 'N/A'}</Typography>
    </Box>
  );

  const renderVehicleView = (v: Vehicle) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
       <Box>
          <Label>Vehicle Photos</Label>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 1 }}>
            {v.images?.map((img, i) => (
              <Paper key={i} sx={{ width: 120, height: 90, overflow: 'hidden', borderRadius: 2, border: '1px solid #333' }}>
                <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="vehicle" onClick={() => window.open(img, '_blank')} />
              </Paper>
            ))}
          </Box>
       </Box>
       <Divider sx={{ borderColor: '#222' }} />
       <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
             <InfoBlock label="Registration Number" value={v.registrationNumber} />
             <InfoBlock label="Type" value={v.registrationType} />
             <InfoBlock label="Fuel" value={v.fuelType} />
          </Grid>
          <Grid item xs={12} md={4}>
             <InfoBlock label="Make / Brand" value={v.make} />
             <InfoBlock label="Model / Variant" value={`${v.vehicleModel} ${v.variant}`} />
             <InfoBlock label="Color" value={v.color} />
          </Grid>
          <Grid item xs={12} md={4}>
             <InfoBlock label="Category" value={`${v.vehicleCategory} (${v.passengerSubtype || v.goodsSubtype})`} />
             <InfoBlock label="Seating" value={v.seatingCapacity} />
             <InfoBlock label="Owner" value={v.ownerName} />
          </Grid>
       </Grid>
       <Divider sx={{ borderColor: '#222' }} />
       <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
             <Label>Vehicle Proof Document</Label>
             <Paper sx={{ mt: 1, width: '100%', height: 200, bgcolor: '#000', borderRadius: 2, overflow: 'hidden', border: '1px solid #333' }}>
                {v.vehicleProof ? <img src={v.vehicleProof} style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt="proof" onClick={() => window.open(v.vehicleProof, '_blank')} /> : <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'zinc.600' }}>No Proof Uploaded</Box>}
             </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
             <InfoBlock label="Routine" value={v.travelRoutine} />
             <InfoBlock label="Avg KM / Day" value={v.averageKmPerDay} />
             <InfoBlock label="Ad Options" value={v.adOptions?.join(', ')} />
             <InfoBlock label="Parking Location" value={v.parkingLocation} />
          </Grid>
       </Grid>
    </Box>
  );

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ color: 'white', fontWeight: 900, mb: 4, textTransform: 'uppercase' }}>
        Manage <span style={{ color: '#FACC15' }}>Users</span>
      </Typography>

      {errorMsg && <Alert severity="error" sx={{ mb: 4 }}>{errorMsg}</Alert>}

      <Card sx={{ bgcolor: '#121212', border: '1px solid #333', borderRadius: 4, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#1A1A1A' }}>
              <TableRow>
                <TableCell sx={{ color: '#A1A1AA', fontWeight: 'bold' }}>Sl. No.</TableCell>
                <TableCell sx={{ color: '#A1A1AA', fontWeight: 'bold' }}>Full Name</TableCell>
                <TableCell sx={{ color: '#A1A1AA', fontWeight: 'bold' }}>Email</TableCell>
                <TableCell sx={{ color: '#A1A1AA', fontWeight: 'bold' }}>Role</TableCell>
                <TableCell sx={{ color: '#A1A1AA', fontWeight: 'bold' }}>Profile</TableCell>
                <TableCell sx={{ color: '#A1A1AA', fontWeight: 'bold' }}>Access</TableCell>
                <TableCell sx={{ color: '#A1A1AA', fontWeight: 'bold' }}>Joined On</TableCell>
                <TableCell sx={{ color: '#A1A1AA', fontWeight: 'bold' }}>Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={8} sx={{ textAlign: 'center', py: 6 }}><CircularProgress color="warning" /></TableCell></TableRow>
              ) : users.length === 0 ? (
                <TableRow><TableCell colSpan={8} sx={{ textAlign: 'center', py: 6, color: 'zinc.500' }}>No users registered yet.</TableCell></TableRow>
              ) : (
                users
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user, index) => (
                  <TableRow key={user._id} sx={{ '&:hover': { bgcolor: '#1A1A1A' }, opacity: user.isBlocked ? 0.6 : 1 }}>
                    <TableCell sx={{ color: 'zinc.400' }}>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>{user.fullName}</TableCell>
                    <TableCell sx={{ color: 'zinc.300' }}>{user.email}</TableCell>
                    <TableCell>
                      <Chip 
                        label={user.accountType.toUpperCase()} 
                        size="small" 
                        sx={{ 
                          bgcolor: user.accountType === 'fleet' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(168, 85, 247, 0.1)', 
                          color: user.accountType === 'fleet' ? '#60A5FA' : '#A855F7',
                          fontWeight: 'bold', border: `1px solid ${user.accountType === 'fleet' ? '#3B82F6' : '#A855F7'}`
                        }} 
                      />
                    </TableCell>
                    <TableCell>
                      <Chip label={user.isProfileComplete ? 'Complete' : 'Pending'} size="small" sx={{ bgcolor: user.isProfileComplete ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: user.isProfileComplete ? '#4ADE80' : '#F87171', fontWeight: 'bold' }} />
                    </TableCell>
                    <TableCell>
                      <Chip label={user.isBlocked ? 'Blocked' : 'Active'} size="small" sx={{ bgcolor: user.isBlocked ? 'rgba(244, 67, 54, 0.1)' : 'rgba(34, 197, 94, 0.1)', color: user.isBlocked ? '#F44336' : '#4ADE80', fontWeight: 'bold' }} />
                    </TableCell>
                    <TableCell sx={{ color: 'zinc.500' }}>{formatDate(user.createdAt)}</TableCell>
                    <TableCell>
                       <Box sx={{ display: 'flex', gap: 1 }}>
                         {user.accountType === 'fleet' && (
                           <Tooltip title="View Registered Fleet">
                             <IconButton onClick={() => fetchUserVehicles(user)} sx={{ color: '#FACC15', '&:hover': { bgcolor: 'rgba(250, 204, 21, 0.1)' } }}>
                               <VisibilityIcon />
                             </IconButton>
                           </Tooltip>
                         )}
                         <Tooltip title={user.isBlocked ? "Unblock User" : "Block User"}>
                            <IconButton onClick={() => handleBlockRequest(user)} sx={{ color: user.isBlocked ? '#4ADE80' : '#F44336', '&:hover': { bgcolor: user.isBlocked ? 'rgba(74, 222, 128, 0.1)' : 'rgba(244, 67, 54, 0.1)' } }}>
                               {blockLoading === user._id ? <CircularProgress size={20} color="inherit" /> : <BlockIcon />}
                            </IconButton>
                         </Tooltip>
                       </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination rowsPerPageOptions={[10, 25, 50, 100]} component="div" count={users.length} rowsPerPage={rowsPerPage} page={page} onPageChange={(e, p) => setPage(p)} onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }} sx={{ color: 'zinc.400', borderTop: '1px solid #333' }} />
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} PaperProps={{ sx: { bgcolor: '#1E1E1E', color: 'white', borderRadius: 4, minWidth: 320 } }}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <WarningAmberIcon sx={{ color: '#FACC15' }} /> Confirm Action
        </DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
          <Typography variant="body1">Are you sure you want to {confirmUser?.isBlocked ? 'unblock' : 'block'} <span style={{ color: '#FACC15', fontWeight: 'bold' }}>{confirmUser?.fullName}</span>?</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setConfirmOpen(false)} sx={{ color: 'zinc.500' }}>Cancel</Button>
          <Button variant="contained" onClick={handleToggleBlock} sx={{ bgcolor: confirmUser?.isBlocked ? '#4ADE80' : '#EF4444', color: 'black', fontWeight: 800 }}>Yes, {confirmUser?.isBlocked ? 'Unblock' : 'Block'}</Button>
        </DialogActions>
      </Dialog>

      {/* Vehicles Dialog */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="lg" fullWidth PaperProps={{ sx: { bgcolor: '#121212', color: 'white', borderRadius: 3, border: '1px solid #333' } }}>
        <DialogTitle sx={{ borderBottom: '1px solid #222', p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 900 }}>Fleet for <span style={{ color: '#FACC15' }}>{selectedUser?.fullName}</span></Typography>
            <Typography variant="body2" sx={{ color: 'zinc.500' }}>Official registered vehicles under this profile</Typography>
          </Box>
          <Button onClick={() => setModalOpen(false)} sx={{ color: 'zinc.400' }}>Close</Button>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          {loadingVehicles ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress color="warning" /></Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: '#0A0A0A' }}>
                  <TableRow>
                     <TableCell sx={{ color: '#A1A1AA', fontWeight: 'bold' }}>Reg. No</TableCell>
                     <TableCell sx={{ color: '#A1A1AA', fontWeight: 'bold' }}>Details</TableCell>
                     <TableCell sx={{ color: '#A1A1AA', fontWeight: 'bold' }}>Photos</TableCell>
                     <TableCell sx={{ color: '#A1A1AA', fontWeight: 'bold' }}>Status</TableCell>
                     <TableCell sx={{ color: '#A1A1AA', fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {userVehicles.map((v) => (
                    <TableRow key={v._id} sx={{ '&:hover': { bgcolor: '#1A1A1A' } }}>
                      <TableCell sx={{ color: 'white', fontWeight: 600 }}>{v.registrationNumber}</TableCell>
                      <TableCell sx={{ color: 'zinc.300' }}>{v.make} | {v.vehicleModel}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {v.images?.slice(0, 2).map((img, idx) => (
                            <Paper key={idx} sx={{ width: 60, height: 40, overflow: 'hidden', borderRadius: 1, border: '1px solid #333' }}>
                              <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="vehicle" />
                            </Paper>
                          ))}
                        </Box>
                      </TableCell>
                      <TableCell>
                         <Chip label={v.status} size="small" sx={{ bgcolor: v.status === 'Pending Verification' ? 'rgba(250, 204, 21, 0.1)' : 'rgba(34, 197, 94, 0.1)', color: v.status === 'Pending Verification' ? '#FACC15' : '#4ADE80', fontWeight: 'bold' }} />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Tooltip title="View All Details">
                             <IconButton size="small" onClick={() => { setViewVehicle(v); setViewOpen(true); }} sx={{ color: '#FACC15', bgcolor: 'rgba(250, 204, 21, 0.1)' }}>
                                <VisibilityIcon fontSize="small" />
                             </IconButton>
                          </Tooltip>
                          {v.status === 'Pending Verification' && (
                            <Button variant="contained" size="small" startIcon={actionLoading === v._id ? <CircularProgress size={16} color="inherit" /> : <CheckCircleIcon />} onClick={() => handleApprove(v._id)} disabled={!!actionLoading} sx={{ bgcolor: '#4ADE80', color: 'black', fontWeight: 800 }}>Approve</Button>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
      </Dialog>

      {/* Full Vehicle View Dialog */}
      <Dialog open={viewOpen} onClose={() => setViewOpen(false)} maxWidth="md" fullWidth PaperProps={{ sx: { bgcolor: '#141414', color: 'white', borderRadius: 4, border: '1px solid #333' } }}>
        <DialogTitle sx={{ p: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 900, textTransform: 'uppercase' }}>Vehicle <span style={{ color: '#FACC15' }}>Overview</span></Typography>
          <IconButton onClick={() => setViewOpen(false)} sx={{ color: 'zinc.500' }}><CloseIcon /></IconButton>
        </DialogTitle>
        <Divider sx={{ borderColor: '#222' }} />
        <DialogContent sx={{ p: 4, '&::-webkit-scrollbar': { display: 'none' }, scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
           {viewVehicle && renderVehicleView(viewVehicle)}
        </DialogContent>
        <Divider sx={{ borderColor: '#222' }} />
        <DialogActions sx={{ p: 3 }}>
           <Button onClick={() => setViewOpen(false)} sx={{ color: '#FACC15', fontWeight: 800 }}>Close Overview</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
