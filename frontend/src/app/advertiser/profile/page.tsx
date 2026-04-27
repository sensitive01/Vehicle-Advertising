'use client';
import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Card, Grid, TextField, Button, Avatar, 
  Tabs, Tab, Paper, Stack, Divider, IconButton, CircularProgress, Alert, Chip,
  InputAdornment
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import SecurityIcon from '@mui/icons-material/Security';
import SaveIcon from '@mui/icons-material/Save';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ py: 4 }}>{children}</Box>}
    </div>
  );
}

export default function AdvertiserProfilePage() {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  // Password Form
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [isEditingSecurity, setIsEditingSecurity] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  useEffect(() => {
    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}-${month}-${year}`;
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get(`${API_URL}/api/auth/me`, { headers });
      if (res.data.success) setUser(res.data.data);
    } catch (err) {
      console.error('Error fetching profile data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setAlert({ type: 'error', msg: 'New passwords do not match' });
      return;
    }
    setSaving(true);
    setAlert(null);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API_URL}/api/auth/change-password`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setAlert({ type: 'success', msg: 'Password changed successfully!' });
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setIsEditingSecurity(false);
      }
    } catch (err: any) {
      setAlert({ type: 'error', msg: err.response?.data?.message || 'Failed to change password' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress sx={{ color: '#FACC15' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h5" sx={{ color: 'white', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1 }}>
          Brand <span style={{ color: '#FACC15' }}>Profile</span>
        </Typography>
      </Box>

      {alert && (
        <Alert severity={alert.type} sx={{ mb: 3, borderRadius: 1.5, bgcolor: alert.type === 'success' ? 'rgba(74, 222, 128, 0.05)' : 'rgba(239, 68, 68, 0.05)', border: '1px solid', borderColor: alert.type === 'success' ? 'rgba(74, 222, 128, 0.2)' : 'rgba(239, 68, 68, 0.2)' }}>
          {alert.msg}
        </Alert>
      )}

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 4, lg: 3 }}>
          <Stack spacing={3}>
            <Card sx={{ 
              bgcolor: '#121212', border: '1px solid #333', borderRadius: 1.5, p: 3, 
              textAlign: 'center', backgroundImage: 'none', position: 'relative', overflow: 'hidden' 
            }}>
              <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 4, bgcolor: '#FACC15' }} />
              <Box sx={{ position: 'relative', width: 100, height: 100, mx: 'auto', mb: 2 }}>
                <Avatar 
                  sx={{ 
                    width: '100%', height: '100%', bgcolor: '#1E1E1E', color: '#FACC15', 
                    fontSize: 40, fontWeight: 900, border: '2px solid #FACC15',
                    boxShadow: '0 0 20px rgba(250, 204, 21, 0.1)'
                  }}
                >
                  {user?.fullName ? user.fullName[0].toUpperCase() : 'A'}
                </Avatar>
              </Box>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 900, letterSpacing: 0.5 }}>{user?.fullName}</Typography>
              <Typography variant="body2" sx={{ color: '#FACC15', fontWeight: 800, mb: 1.5, fontSize: '0.75rem' }}>{user?.userId}</Typography>
              <Chip 
                label={user?.accountType?.toUpperCase() || 'ADVERTISER'} 
                size="small" 
                sx={{ bgcolor: 'rgba(250, 204, 21, 0.1)', color: '#FACC15', fontWeight: 900, fontSize: '0.6rem', height: 20 }} 
              />
            </Card>

            <Card sx={{ bgcolor: '#121212', border: '1px solid #333', borderRadius: 1.5, p: 3, backgroundImage: 'none' }}>
              <Typography variant="caption" sx={{ color: 'zinc.500', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.5, display: 'block', mb: 2.5 }}>Contact Details</Typography>
              <Stack spacing={2.5}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'zinc.600', fontWeight: 800, fontSize: '0.65rem', textTransform: 'uppercase' }}>Email Address</Typography>
                  <Typography variant="body2" sx={{ color: 'white', fontWeight: 700, wordBreak: 'break-all' }}>{user?.email}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'zinc.600', fontWeight: 800, fontSize: '0.65rem', textTransform: 'uppercase' }}>Phone Number</Typography>
                  <Typography variant="body2" sx={{ color: 'white', fontWeight: 700 }}>{user?.mobileNumber}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'zinc.600', fontWeight: 800, fontSize: '0.65rem', textTransform: 'uppercase' }}>Joined Platform</Typography>
                  <Typography variant="body2" sx={{ color: 'white', fontWeight: 700 }}>{formatDate(user?.createdAt)}</Typography>
                </Box>
              </Stack>
            </Card>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 8, lg: 9 }}>
          <Card sx={{ bgcolor: '#121212', border: '1px solid #333', borderRadius: 1.5, backgroundImage: 'none', minHeight: 520, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ borderBottom: '1px solid #222' }}>
              <Tabs 
                value={tabValue} 
                onChange={(e, v) => setTabValue(v)} 
                variant="fullWidth"
                sx={{ 
                  '& .MuiTab-root': { color: 'zinc.500', fontWeight: 800, py: 2.5, minHeight: 70, fontSize: '0.85rem' },
                  '& .Mui-selected': { color: '#FACC15 !important', bgcolor: 'rgba(250, 204, 21, 0.02)' },
                  '& .MuiTabs-indicator': { bgcolor: '#FACC15', height: 4, borderRadius: '4px 4px 0 0' }
                }}
              >
                <Tab icon={<PersonIcon sx={{ fontSize: 20 }} />} iconPosition="start" label="IDENTITY" />
                <Tab icon={<SecurityIcon sx={{ fontSize: 20 }} />} iconPosition="start" label="SECURITY" />
              </Tabs>
            </Box>

            <Box sx={{ px: { xs: 2, md: 5 }, py: 2, flexGrow: 1 }}>
              <TabPanel value={tabValue} index={0}>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 900, mb: 4, fontSize: '1rem', textTransform: 'uppercase' }}>Brand Representative Identity</Typography>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField label="Full Legal Name" fullWidth value={user?.fullName} disabled sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#080808', borderRadius: 1.5 } }} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField label="Brand ID" fullWidth value={user?.userId} disabled sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#080808', borderRadius: 1.5 } }} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField label="Registered Email" fullWidth value={user?.email} disabled sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#080808', borderRadius: 1.5 } }} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField label="Contact Number" fullWidth value={user?.mobileNumber} disabled sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#080808', borderRadius: 1.5 } }} />
                  </Grid>
                </Grid>
                <Box sx={{ mt: 5, p: 3, borderRadius: 1.5, bgcolor: 'rgba(250, 204, 21, 0.03)', border: '1px solid rgba(250, 204, 21, 0.1)' }}>
                  <Stack direction="row" spacing={2.5} alignItems="flex-start">
                    <CheckCircleIcon sx={{ color: '#FACC15', fontSize: 22, mt: 0.2 }} />
                    <Typography variant="body2" sx={{ color: 'zinc.400', lineHeight: 1.6, fontWeight: 500 }}>
                      Your brand identity has been verified. These details are used for legal agreements and official communication. If you need to update any of this information, please contact our support team.
                    </Typography>
                  </Stack>
                </Box>
              </TabPanel>

              <TabPanel value={tabValue} index={1}>
                <form onSubmit={handlePasswordSubmit}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 900, fontSize: '1rem', textTransform: 'uppercase' }}>Security Credentials</Typography>
                    {!isEditingSecurity && (
                      <Button 
                        startIcon={<EditIcon sx={{ fontSize: 16 }} />}
                        onClick={() => setIsEditingSecurity(true)} 
                        sx={{ 
                          color: '#FACC15', 
                          fontWeight: 800,
                          fontSize: '0.75rem',
                          bgcolor: 'rgba(250, 204, 21, 0.05)', 
                          border: '1px solid rgba(250, 204, 21, 0.1)',
                          px: 2,
                          '&:hover': { bgcolor: 'rgba(250, 204, 21, 0.1)' } 
                        }}
                      >
                        CHANGE PASSWORD
                      </Button>
                    )}
                  </Box>

                  {isEditingSecurity ? (
                    <Stack spacing={3} sx={{ maxWidth: 500 }}>
                      <TextField 
                        label="Current Password" 
                        type={showPasswords.current ? 'text' : 'password'} 
                        fullWidth 
                        required
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                        sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#000', borderRadius: 1.5 } }} 
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={() => setShowPasswords({...showPasswords, current: !showPasswords.current})} edge="end" sx={{ color: 'zinc.600' }}>
                                {showPasswords.current ? <VisibilityOff sx={{ fontSize: 20 }} /> : <Visibility sx={{ fontSize: 20 }} />}
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                      <TextField 
                        label="New Password" 
                        type={showPasswords.new ? 'text' : 'password'} 
                        fullWidth 
                        required
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                        sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#000', borderRadius: 1.5 } }} 
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})} edge="end" sx={{ color: 'zinc.600' }}>
                                {showPasswords.new ? <VisibilityOff sx={{ fontSize: 20 }} /> : <Visibility sx={{ fontSize: 20 }} />}
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                      <TextField 
                        label="Confirm New Password" 
                        type={showPasswords.confirm ? 'text' : 'password'} 
                        fullWidth 
                        required
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                        sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#000', borderRadius: 1.5 } }} 
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})} edge="end" sx={{ color: 'zinc.600' }}>
                                {showPasswords.confirm ? <VisibilityOff sx={{ fontSize: 20 }} /> : <Visibility sx={{ fontSize: 20 }} />}
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                        <Button 
                          type="submit" 
                          variant="contained" 
                          disabled={saving}
                          startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <SecurityIcon />}
                          sx={{ bgcolor: '#FACC15', color: 'black', fontWeight: 900, py: 1.5, borderRadius: 1.5, flexGrow: 1, '&:hover': { bgcolor: '#FDE047' } }}
                        >
                          Update Security Credentials
                        </Button>
                        <Button 
                          variant="outlined"
                          onClick={() => setIsEditingSecurity(false)}
                          sx={{ color: 'zinc.500', borderColor: '#333', fontWeight: 800, px: 3, borderRadius: 1.5, '&:hover': { bgcolor: 'rgba(255,255,255,0.02)', borderColor: '#444' } }}
                        >
                          Cancel
                        </Button>
                      </Stack>
                    </Stack>
                  ) : (
                    <Box sx={{ p: 6, borderRadius: 2, bgcolor: '#080808', border: '1px solid #222', textAlign: 'center' }}>
                      <Box sx={{ bgcolor: 'rgba(250, 204, 21, 0.05)', width: 80, height: 80, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3 }}>
                        <SecurityIcon sx={{ color: '#FACC15', fontSize: 36 }} />
                      </Box>
                      <Typography variant="h6" sx={{ color: 'white', fontWeight: 900, mb: 1.5 }}>Account Security Active</Typography>
                      <Typography variant="body2" sx={{ color: 'zinc.500', maxWidth: 400, mx: 'auto', mb: 4, lineHeight: 1.7 }}>
                        Your brand account is protected. We recommend changing your password regularly to maintain maximum security for your advertising data.
                      </Typography>
                      <Button 
                        variant="text" 
                        onClick={() => setIsEditingSecurity(true)}
                        sx={{ color: '#FACC15', fontWeight: 900, '&:hover': { bgcolor: 'rgba(250, 204, 21, 0.05)' } }}
                      >
                        CHANGE ACCOUNT PASSWORD
                      </Button>
                    </Box>
                  )}
                </form>
              </TabPanel>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
