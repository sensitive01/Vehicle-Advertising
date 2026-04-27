'use client';
import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Card, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Chip, CircularProgress, Paper, IconButton, 
  Tooltip, Stack, Avatar, TextField, InputAdornment, Dialog,
  DialogTitle, DialogContent, DialogActions, Button
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import CampaignIcon from '@mui/icons-material/Campaign';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function AdminAdvertisersPage() {
  const [advertisers, setAdvertisers] = useState<any[]>([]);
  const [campaignCounts, setCampaignCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Block States
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmUser, setConfirmUser] = useState<any>(null);
  const [blockLoading, setBlockLoading] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const usersRes = await axios.get(`${API_URL}/api/auth/users`, { headers });
      const campaignsRes = await axios.get(`${API_URL}/api/advertiser/all`, { headers });

      if (usersRes.data.success) {
        const filtered = usersRes.data.data.filter((u: any) => 
          u.accountType === 'advertiser'
        );
        setAdvertisers(filtered);

        if (campaignsRes.data.success) {
          const counts: Record<string, number> = {};
          campaignsRes.data.data.forEach((camp: any) => {
            const uid = camp.userId?._id || camp.userId;
            if (uid) counts[uid] = (counts[uid] || 0) + 1;
          });
          setCampaignCounts(counts);
        }
      }
    } catch (err) {
      console.error('Error fetching advertisers data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockRequest = (user: any) => {
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
      const res = await axios.patch(`${API_URL}/api/auth/users/${userId}/block`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setAdvertisers(prev => prev.map(u => u._id === userId ? { ...u, isBlocked: res.data.isBlocked } : u));
      }
    } catch (err) {
      console.error('Error toggling block status:', err);
      alert('Error toggling block status');
    } finally {
      setBlockLoading(null);
      setConfirmUser(null);
    }
  };

  const filteredAdvertisers = advertisers.filter(adv => 
    adv.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    adv.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    adv.mobileNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    adv.userId?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}-${month}-${year}`;
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ color: 'white', fontWeight: 900, textTransform: 'uppercase' }}>
          Registered <span style={{ color: '#FACC15' }}>Advertisers</span>
        </Typography>
        
        <TextField
          placeholder="Search name, email or ID..."
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ 
            width: 350,
            '& .MuiOutlinedInput-root': { 
              bgcolor: '#121212', 
              color: 'white',
              borderRadius: 2,
              '& fieldset': { borderColor: '#333' },
              '&:hover fieldset': { borderColor: '#FACC15' }
            } 
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'zinc.500' }} />
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Card sx={{ bgcolor: '#121212', border: '1px solid #333', borderRadius: 1.5, overflow: 'hidden', backgroundImage: 'none' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#1A1A1A' }}>
              <TableRow>
                <TableCell sx={{ color: '#FACC15', fontWeight: 800 }}>SL NO</TableCell>
                <TableCell sx={{ color: '#FACC15', fontWeight: 800 }}>USER ID</TableCell>
                <TableCell sx={{ color: '#FACC15', fontWeight: 800 }}>ADVERTISER INFO</TableCell>
                <TableCell sx={{ color: '#FACC15', fontWeight: 800 }}>CONTACT</TableCell>
                <TableCell sx={{ color: '#FACC15', fontWeight: 800 }}>CAMPAIGNS</TableCell>
                <TableCell sx={{ color: '#FACC15', fontWeight: 800 }}>JOINED ON</TableCell>
                <TableCell sx={{ color: '#FACC15', fontWeight: 800 }}>STATUS</TableCell>
                <TableCell sx={{ color: '#FACC15', fontWeight: 800 }} align="center">ACTION</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} sx={{ textAlign: 'center', py: 10 }}>
                    <CircularProgress sx={{ color: '#FACC15' }} />
                  </TableCell>
                </TableRow>
              ) : filteredAdvertisers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} sx={{ textAlign: 'center', py: 10, color: 'zinc.600' }}>
                    No advertisers found in the system.
                  </TableCell>
                </TableRow>
              ) : (
                filteredAdvertisers.map((adv, index) => (
                  <TableRow key={adv._id} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' }, opacity: adv.isBlocked ? 0.5 : 1 }}>
                    <TableCell sx={{ color: 'zinc.500', fontWeight: 700 }}>
                      {String(index + 1).padStart(2, '0')}
                    </TableCell>
                    <TableCell sx={{ color: '#FACC15', fontWeight: 700 }}>
                      {adv.userId || 'VA------'}
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{ bgcolor: adv.isBlocked ? 'zinc.800' : '#FACC15', color: 'black', fontWeight: 900, width: 36, height: 36 }}>
                          {adv.fullName[0]}
                        </Avatar>
                        <Typography sx={{ color: 'white', fontWeight: 700 }}>{adv.fullName}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ color: 'zinc.300', fontWeight: 600 }}>{adv.email}</Typography>
                      <Typography variant="caption" sx={{ color: 'zinc.500' }}>{adv.mobileNumber}</Typography>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <CampaignIcon sx={{ color: '#FACC15', fontSize: 18 }} />
                        <Typography sx={{ color: 'white', fontWeight: 800 }}>
                          {campaignCounts[adv._id] || 0}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ color: 'zinc.400' }}>
                      {formatDate(adv.createdAt)}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={adv.isBlocked ? 'Blocked' : (adv.isProfileComplete ? 'Complete' : 'Pending')} 
                        size="small" 
                        sx={{ 
                          bgcolor: adv.isBlocked ? 'rgba(239, 68, 68, 0.1)' : (adv.isProfileComplete ? 'rgba(74, 222, 128, 0.1)' : 'rgba(250, 204, 21, 0.1)'), 
                          color: adv.isBlocked ? '#EF4444' : (adv.isProfileComplete ? '#4ADE80' : '#FACC15'), 
                          fontWeight: 800,
                          fontSize: '0.7rem'
                        }} 
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Tooltip title="View Detailed Profile">
                          <IconButton size="small" sx={{ color: 'white' }} onClick={() => router.push(`/admin/advertisers/${adv._id}`)}>
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={adv.isBlocked ? "Unblock Advertiser" : "Block Advertiser"}>
                          <IconButton size="small" onClick={() => handleBlockRequest(adv)} sx={{ color: adv.isBlocked ? '#4ADE80' : '#EF4444' }}>
                            {blockLoading === adv._id ? <CircularProgress size={20} color="inherit" /> : (adv.isBlocked ? <CheckCircleIcon fontSize="small" /> : <BlockIcon fontSize="small" />)}
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
      </Card>

      {/* Confirmation Dialog */}
      <Dialog 
        open={confirmOpen} 
        onClose={() => setConfirmOpen(false)} 
        PaperProps={{ sx: { bgcolor: '#1E1E1E', color: 'white', borderRadius: 1.5, minWidth: 320, backgroundImage: 'none' } }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontWeight: 900 }}>
          <WarningAmberIcon sx={{ color: '#FACC15' }} /> Confirm Security Action
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to {confirmUser?.isBlocked ? 'restore access for' : 'suspend'} <span style={{ color: '#FACC15', fontWeight: 'bold' }}>{confirmUser?.fullName}</span>?
          </Typography>
          {!confirmUser?.isBlocked && (
             <Typography variant="caption" sx={{ color: 'zinc.500', display: 'block', mt: 1 }}>
               This will immediately restrict their ability to create new campaigns.
             </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setConfirmOpen(false)} sx={{ color: 'zinc.500', fontWeight: 700 }}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleToggleBlock} 
            sx={{ 
              bgcolor: confirmUser?.isBlocked ? '#4ADE80' : '#EF4444', 
              color: 'black', 
              fontWeight: 900,
              '&:hover': { bgcolor: confirmUser?.isBlocked ? '#34D399' : '#DC2626' }
            }}
          >
            Yes, {confirmUser?.isBlocked ? 'Unblock' : 'Block'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
