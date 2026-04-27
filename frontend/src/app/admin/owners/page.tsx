'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Box, Typography, Card, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Avatar, Chip, CircularProgress, 
  IconButton, Tooltip, Button, Dialog, DialogTitle, DialogContent, 
  Grid, Stack, Divider, TextField, DialogActions
} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import EditIcon from '@mui/icons-material/Edit';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import axios from 'axios';

interface User {
  _id: string;
  userId: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  accountType: string;
  isProfileComplete: boolean;
  isBlocked: boolean;
  createdAt: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function VehicleOwnersPage() {
  const router = useRouter();
  const [owners, setOwners] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [editFormData, setEditFormData] = useState({ fullName: '', email: '', mobileNumber: '' });
  const [confirmBlock, setConfirmBlock] = useState<{ open: boolean, user: User | null }>({ open: false, user: null });

  useEffect(() => {
    fetchOwners();
  }, []);

  const fetchOwners = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/api/auth/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.data.success) {
        const fleetOwners = res.data.data.filter((u: User) => u.accountType === 'fleet');
        setOwners(fleetOwners);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockToggle = (e: React.MouseEvent, owner: User) => {
    e.stopPropagation();
    setConfirmBlock({ open: true, user: owner });
  };

  const processBlockToggle = async () => {
    if (!confirmBlock.user) return;
    const token = localStorage.getItem('token');
    try {
      await axios.patch(`${API_URL}/api/auth/users/${confirmBlock.user._id}/block`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setConfirmBlock({ open: false, user: null });
      fetchOwners();
    } catch (err) {
      console.error('Error toggling block status:', err);
    }
  };

  const handleEditClick = (e: React.MouseEvent, owner: User) => {
    e.stopPropagation();
    setEditUser(owner);
    setEditFormData({ fullName: owner.fullName, email: owner.email, mobileNumber: owner.mobileNumber });
  };

  const handleUpdateUser = async () => {
    if (!editUser) return;
    const token = localStorage.getItem('token');
    try {
      await axios.patch(`${API_URL}/api/auth/users/${editUser._id}`, editFormData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setEditUser(null);
      fetchOwners();
    } catch (err) {
      console.error('Error updating user:', err);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}-${month}-${year}`;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress sx={{ color: '#FACC15' }} />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ color: 'white', fontWeight: 900, mb: 4, textTransform: 'uppercase' }}>
        Vehicle <span style={{ color: '#FACC15' }}>Owners</span>
      </Typography>

      <TableContainer component={Paper} sx={{ bgcolor: '#121212', borderRadius: 1.5, border: '1px solid #333', backgroundImage: 'none' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#181818' }}>
            <TableRow>
              <TableCell sx={{ color: '#FACC15', fontWeight: 800, borderBottom: '1px solid #333' }}>VA ID</TableCell>
              <TableCell sx={{ color: '#FACC15', fontWeight: 800, borderBottom: '1px solid #333' }}>OWNER NAME</TableCell>
              <TableCell sx={{ color: '#FACC15', fontWeight: 800, borderBottom: '1px solid #333' }}>CONTACT DETAILS</TableCell>
              <TableCell sx={{ color: '#FACC15', fontWeight: 800, borderBottom: '1px solid #333' }}>STATUS</TableCell>
              <TableCell sx={{ color: '#FACC15', fontWeight: 800, borderBottom: '1px solid #333' }}>REGISTERED ON</TableCell>
              <TableCell sx={{ color: '#FACC15', fontWeight: 800, borderBottom: '1px solid #333' }} align="center">ACTIONS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {owners.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 10, color: 'zinc.600' }}>
                  No vehicle owners found in the system.
                </TableCell>
              </TableRow>
            ) : (
              owners.map((owner, index) => (
                <TableRow 
                  key={owner._id} 
                  onClick={() => router.push(`/admin/owners/${owner._id}`)}
                  sx={{ 
                    cursor: 'pointer', 
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.03)' },
                    transition: 'background-color 0.2s'
                  }}
                >
                  <TableCell sx={{ color: '#FACC15', fontWeight: 800, borderBottom: '1px solid #222' }}>{owner.userId || 'N/A'}</TableCell>
                  <TableCell sx={{ borderBottom: '1px solid #222' }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ bgcolor: '#1E1E1E', color: '#FACC15', fontWeight: 800, border: '1px solid #333' }}>
                        {owner.fullName[0]}
                      </Avatar>
                      <Typography sx={{ color: 'white', fontWeight: 700 }}>{owner.fullName}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ borderBottom: '1px solid #222' }}>
                    <Stack spacing={0.5}>
                      <Typography variant="body2" sx={{ color: 'zinc.300' }}>{owner.email}</Typography>
                      <Typography variant="caption" sx={{ color: 'zinc.500' }}>{owner.mobileNumber}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ borderBottom: '1px solid #222' }}>
                    {owner.isBlocked ? (
                      <Chip label="Blocked" size="small" color="error" sx={{ fontWeight: 800, fontSize: '0.65rem' }} />
                    ) : (
                      <Chip label="Active" size="small" color="success" sx={{ fontWeight: 800, fontSize: '0.65rem' }} />
                    )}
                  </TableCell>
                  <TableCell sx={{ color: 'zinc.400', borderBottom: '1px solid #222' }}>
                    {formatDate(owner.createdAt)}
                  </TableCell>
                  <TableCell align="center" sx={{ borderBottom: '1px solid #222' }} onClick={(e) => e.stopPropagation()}>
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Tooltip title="View Profile">
                        <IconButton size="small" onClick={() => router.push(`/admin/owners/${owner._id}`)} sx={{ color: '#FACC15' }}>
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Details">
                        <IconButton size="small" onClick={(e) => handleEditClick(e, owner)} sx={{ color: 'white' }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={owner.isBlocked ? "Unblock User" : "Block User"}>
                        <IconButton size="small" onClick={(e) => handleBlockToggle(e, owner)} sx={{ color: owner.isBlocked ? '#10B981' : '#EF4444' }}>
                          {owner.isBlocked ? <CheckCircleIcon fontSize="small" /> : <BlockIcon fontSize="small" />}
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

      {/* Edit User Dialog */}
      <Dialog 
        open={!!editUser} 
        onClose={() => setEditUser(null)}
        PaperProps={{
          sx: { bgcolor: '#121212', color: 'white', borderRadius: 1.5, border: '1px solid #333', backgroundImage: 'none' }
        }}
      >
        <DialogTitle sx={{ fontWeight: 900, borderBottom: '1px solid #222' }}>Edit Owner Details</DialogTitle>
        <DialogContent sx={{ p: 3, pt: '24px !important' }}>
          <Stack spacing={3} sx={{ minWidth: 400 }}>
            <TextField 
              label="Full Name" 
              fullWidth 
              value={editFormData.fullName}
              onChange={(e) => setEditFormData({...editFormData, fullName: e.target.value})}
              sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#000', borderRadius: 1 } }}
            />
            <TextField 
              label="Email Address" 
              fullWidth 
              value={editFormData.email}
              onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
              sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#000', borderRadius: 1 } }}
            />
            <TextField 
              label="Mobile Number" 
              fullWidth 
              value={editFormData.mobileNumber}
              onChange={(e) => setEditFormData({...editFormData, mobileNumber: e.target.value})}
              sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#000', borderRadius: 1 } }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid #222' }}>
          <Button onClick={() => setEditUser(null)} sx={{ color: 'zinc.500' }}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleUpdateUser}
            sx={{ bgcolor: '#FACC15', color: 'black', fontWeight: 800, '&:hover': { bgcolor: '#FDE047' } }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog for Block/Unblock */}
      <Dialog 
        open={confirmBlock.open} 
        onClose={() => setConfirmBlock({ open: false, user: null })}
        PaperProps={{
          sx: { bgcolor: '#121212', color: 'white', borderRadius: 1.5, border: '1px solid #333' }
        }}
      >
        <DialogTitle sx={{ fontWeight: 900, borderBottom: '1px solid #222' }}>
           Confirm {confirmBlock.user?.isBlocked ? 'Unblock' : 'Block'} Action
        </DialogTitle>
        <DialogContent sx={{ p: 4, pt: 3 }}>
           <Typography sx={{ color: 'zinc.400' }}>
              Are you sure you want to <strong>{confirmBlock.user?.isBlocked ? 'UNBLOCK' : 'BLOCK'}</strong> the user 
              <strong> {confirmBlock.user?.fullName}</strong>?
           </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
           <Button onClick={() => setConfirmBlock({ open: false, user: null })} sx={{ color: 'zinc.500' }}>Cancel</Button>
           <Button 
             variant="contained" 
             onClick={processBlockToggle}
             sx={{ 
               bgcolor: confirmBlock.user?.isBlocked ? '#10B981' : '#EF4444', 
               color: 'white', 
               fontWeight: 900,
               '&:hover': { bgcolor: confirmBlock.user?.isBlocked ? '#059669' : '#DC2626' }
             }}
           >
              Confirm {confirmBlock.user?.isBlocked ? 'Unblock' : 'Block'}
           </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
