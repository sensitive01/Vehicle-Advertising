'use client';
import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Card, Grid, TextField, Button, Avatar, 
  Tabs, Tab, Paper, Stack, Divider, IconButton, CircularProgress, Alert, Chip,
  InputAdornment
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import SecurityIcon from '@mui/icons-material/Security';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
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

export default function FleetProfilePage() {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  // Bank Form
  const [bankData, setBankData] = useState({
    accountHolderName: '',
    accountNumber: '',
    ifscCode: '',
    bankName: '',
    branchName: '',
    passbookProof: ''
  });

  // Password Form
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [isEditingBank, setIsEditingBank] = useState(false);
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
      
      const [userRes, profileRes] = await Promise.all([
        axios.get(`${API_URL}/api/auth/me`, { headers }),
        axios.get(`${API_URL}/api/fleet/profile`, { headers })
      ]);

      if (userRes.data.success) setUser(userRes.data.data);
      if (profileRes.data.success) {
        setProfile(profileRes.data.data);
        if (profileRes.data.data.bankDetails) {
          setBankData(profileRes.data.data.bankDetails);
          setIsEditingBank(false);
        } else {
          setIsEditingBank(true);
        }
      }
    } catch (err) {
      console.error('Error fetching profile data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBankSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setAlert(null);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.patch(`${API_URL}/api/fleet/profile`, { bankDetails: bankData }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setAlert({ type: 'success', msg: 'Bank details updated successfully!' });
        setIsEditingBank(false);
        fetchData();
      }
    } catch (err: any) {
      setAlert({ type: 'error', msg: err.response?.data?.message || 'Failed to update bank details' });
    } finally {
      setSaving(false);
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
      const res = await axios.post(`${API_URL}/api/fleet/change-password`, {
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setSaving(true);
    try {
      const res = await axios.post(`${API_URL}/api/fleet/upload`, formData);
      if (res.data.secure_url) {
        setBankData({ ...bankData, passbookProof: res.data.secure_url });
        setAlert({ type: 'success', msg: 'Proof document uploaded!' });
      }
    } catch (err) {
      console.error('Upload error:', err);
      setAlert({ type: 'error', msg: 'Failed to upload document' });
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
          Owner <span style={{ color: '#FACC15' }}>Profile</span>
        </Typography>
        {user?.isBlocked && (
           <Chip label="Account Suspended" color="error" sx={{ fontWeight: 900, borderRadius: 1 }} />
        )}
      </Box>

      {alert && (
        <Alert severity={alert.type} sx={{ mb: 3, borderRadius: 1.5, bgcolor: alert.type === 'success' ? 'rgba(74, 222, 128, 0.05)' : 'rgba(239, 68, 68, 0.05)', border: '1px solid', borderColor: alert.type === 'success' ? 'rgba(74, 222, 128, 0.2)' : 'rgba(239, 68, 68, 0.2)' }}>
          {alert.msg}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4, lg: 3 }}>
          <Stack spacing={3}>
            <Card sx={{ bgcolor: '#121212', border: '1px solid #333', borderRadius: 2, p: 3, textAlign: 'center', backgroundImage: 'none', position: 'relative', overflow: 'visible' }}>
              <Box sx={{ position: 'relative', width: 100, height: 100, mx: 'auto', mb: 2 }}>
                <Avatar 
                  sx={{ width: '100%', height: '100%', bgcolor: '#1E1E1E', color: '#FACC15', fontSize: 36, fontWeight: 900, border: '2px solid #FACC15' }}
                >
                  {user?.fullName[0]}
                </Avatar>
                <Box sx={{ position: 'absolute', bottom: 0, right: 0, bgcolor: '#10B981', width: 24, height: 24, borderRadius: '50%', border: '3px solid #121212' }} />
              </Box>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 800 }}>{user?.fullName}</Typography>
              <Typography variant="body2" sx={{ color: '#FACC15', fontWeight: 700, mb: 1 }}>{user?.userId}</Typography>
              <Chip label={user?.accountType} size="small" sx={{ bgcolor: 'rgba(250, 204, 21, 0.1)', color: '#FACC15', fontWeight: 900, textTransform: 'uppercase', fontSize: '0.65rem' }} />
            </Card>

            <Card sx={{ bgcolor: '#121212', border: '1px solid #333', borderRadius: 2, p: 2.5, backgroundImage: 'none' }}>
              <Typography variant="caption" sx={{ color: 'zinc.500', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1, display: 'block', mb: 2 }}>Contact Details</Typography>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'zinc.600', fontWeight: 800 }}>Primary Email</Typography>
                  <Typography variant="body2" sx={{ color: 'white', fontWeight: 600, wordBreak: 'break-all' }}>{user?.email}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'zinc.600', fontWeight: 800 }}>Mobile Number</Typography>
                  <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>{user?.mobileNumber}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'zinc.600', fontWeight: 800 }}>Member Since</Typography>
                  <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>{formatDate(user?.createdAt)}</Typography>
                </Box>
              </Stack>
            </Card>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 8, lg: 9 }}>
          <Card sx={{ bgcolor: '#121212', border: '1px solid #333', borderRadius: 2, backgroundImage: 'none', minHeight: 520, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ borderBottom: 1, borderColor: '#222' }}>
              <Tabs 
                value={tabValue} 
                onChange={(e, v) => setTabValue(v)} 
                variant="fullWidth"
                sx={{ 
                  '& .MuiTab-root': { color: 'zinc.500', fontWeight: 700, py: 2, minHeight: 64 },
                  '& .Mui-selected': { color: '#FACC15 !important', bgcolor: 'rgba(250, 204, 21, 0.02)' },
                  '& .MuiTabs-indicator': { bgcolor: '#FACC15', height: 3 }
                }}
              >
                <Tab icon={<PersonIcon sx={{ fontSize: 20 }} />} iconPosition="start" label="Identity" />
                <Tab icon={<AccountBalanceIcon sx={{ fontSize: 20 }} />} iconPosition="start" label="Banking" />
                <Tab icon={<SecurityIcon sx={{ fontSize: 20 }} />} iconPosition="start" label="Security" />
              </Tabs>
            </Box>

            <Box sx={{ px: 4, py: 1, flexGrow: 1 }}>
              <TabPanel value={tabValue} index={0}>
                <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 800, mb: 3 }}>Identity & Access</Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField label="Full Legal Name" fullWidth value={user?.fullName} disabled sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#080808' } }} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField label="Platform ID" fullWidth value={user?.userId} disabled sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#080808' } }} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField label="Registered Email" fullWidth value={user?.email} disabled sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#080808' } }} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField label="Contact Number" fullWidth value={user?.mobileNumber} disabled sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#080808' } }} />
                  </Grid>
                </Grid>
                <Box sx={{ mt: 4, p: 2, borderRadius: 2, bgcolor: 'rgba(250, 204, 21, 0.03)', border: '1px solid rgba(250, 204, 21, 0.1)' }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <CheckCircleIcon sx={{ color: '#FACC15', fontSize: 20 }} />
                    <Typography variant="body2" sx={{ color: 'zinc.400' }}>
                      These are verified account details. To request a change, please raise a ticket in the support section or contact your account manager.
                    </Typography>
                  </Stack>
                </Box>
              </TabPanel>

               <TabPanel value={tabValue} index={1}>
                <form onSubmit={handleBankSubmit}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 800 }}>Payout Configuration</Typography>
                    {!isEditingBank && (
                      <IconButton 
                        onClick={() => setIsEditingBank(true)} 
                        sx={{ 
                          color: '#FACC15', 
                          bgcolor: 'rgba(250, 204, 21, 0.05)', 
                          border: '1px solid rgba(250, 204, 21, 0.1)',
                          '&:hover': { bgcolor: 'rgba(250, 204, 21, 0.1)' } 
                        }}
                      >
                        <EditIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    )}
                  </Box>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField 
                        label="Account Holder Name" 
                        fullWidth 
                        required
                        size="small"
                        disabled={!isEditingBank}
                        value={bankData.accountHolderName}
                        onChange={(e) => setBankData({...bankData, accountHolderName: e.target.value})}
                        sx={{ '& .MuiOutlinedInput-root': { bgcolor: isEditingBank ? '#000' : '#080808' } }} 
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField 
                        label="Bank Name" 
                        fullWidth 
                        required
                        size="small"
                        disabled={!isEditingBank}
                        value={bankData.bankName}
                        onChange={(e) => setBankData({...bankData, bankName: e.target.value})}
                        sx={{ '& .MuiOutlinedInput-root': { bgcolor: isEditingBank ? '#000' : '#080808' } }} 
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField 
                        label="Account Number" 
                        fullWidth 
                        required
                        size="small"
                        disabled={!isEditingBank}
                        value={bankData.accountNumber}
                        onChange={(e) => setBankData({...bankData, accountNumber: e.target.value})}
                        sx={{ '& .MuiOutlinedInput-root': { bgcolor: isEditingBank ? '#000' : '#080808' } }} 
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField 
                        label="IFSC Code" 
                        fullWidth 
                        required
                        size="small"
                        disabled={!isEditingBank}
                        value={bankData.ifscCode}
                        onChange={(e) => setBankData({...bankData, ifscCode: e.target.value})}
                        sx={{ '& .MuiOutlinedInput-root': { bgcolor: isEditingBank ? '#000' : '#080808' } }} 
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Typography variant="caption" sx={{ color: 'zinc.500', fontWeight: 900, mb: 1.5, display: 'block', textTransform: 'uppercase' }}>Verification Proof</Typography>
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', p: 2, bgcolor: isEditingBank ? '#080808' : '#0a0a0a', borderRadius: 1.5, border: '1px solid #222', opacity: isEditingBank ? 1 : 0.7 }}>
                        <Paper 
                          sx={{ 
                            width: 100, height: 64, bgcolor: '#121212', border: '1px solid #333', 
                            display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: 1
                          }}
                        >
                          {bankData.passbookProof ? (
                            <img src={bankData.passbookProof} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <CloudUploadIcon sx={{ color: 'zinc.800', fontSize: 24 }} />
                          )}
                        </Paper>
                        <Box sx={{ flexGrow: 1 }}>
                          {isEditingBank ? (
                            <Button 
                              component="label" 
                              variant="text" 
                              size="small"
                              startIcon={<CloudUploadIcon />}
                              sx={{ color: '#FACC15', fontWeight: 800, '&:hover': { bgcolor: 'rgba(250, 204, 21, 0.05)' } }}
                            >
                              {bankData.passbookProof ? 'Replace Document' : 'Upload Passbook/Cheque'}
                              <input type="file" hidden accept="image/*" onChange={handleFileUpload} disabled={saving} />
                            </Button>
                          ) : (
                            <Typography variant="body2" sx={{ color: 'zinc.400', fontWeight: 700, ml: 1 }}>Verification Proof Attached</Typography>
                          )}
                          <Typography variant="caption" sx={{ display: 'block', color: 'zinc.600', ml: 1 }}>JPG, PNG allowed. Max 2MB.</Typography>
                        </Box>
                        {bankData.passbookProof && <CheckCircleIcon sx={{ color: '#10B981', mr: 1 }} />}
                      </Box>
                    </Grid>
                  </Grid>
                  {isEditingBank && (
                    <Button 
                      type="submit" 
                      variant="contained" 
                      disabled={saving}
                      fullWidth
                      startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
                      sx={{ mt: 4, bgcolor: '#FACC15', color: 'black', fontWeight: 900, py: 1.2, borderRadius: 1.5, '&:hover': { bgcolor: '#FDE047' } }}
                    >
                      Update Payout Settings
                    </Button>
                  )}
                </form>
              </TabPanel>

              <TabPanel value={tabValue} index={2}>
                <form onSubmit={handlePasswordSubmit}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 800 }}>Security & Credentials</Typography>
                    {!isEditingSecurity && (
                      <IconButton 
                        onClick={() => setIsEditingSecurity(true)} 
                        sx={{ 
                          color: '#FACC15', 
                          bgcolor: 'rgba(250, 204, 21, 0.05)', 
                          border: '1px solid rgba(250, 204, 21, 0.1)',
                          '&:hover': { bgcolor: 'rgba(250, 204, 21, 0.1)' } 
                        }}
                      >
                        <EditIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    )}
                  </Box>

                  {isEditingSecurity ? (
                    <Stack spacing={2.5} sx={{ maxWidth: 450 }}>
                      <TextField 
                        label="Current Password" 
                        type={showPasswords.current ? 'text' : 'password'} 
                        fullWidth 
                        required
                        size="small"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                        sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#000' } }} 
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
                        size="small"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                        sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#000' } }} 
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
                        size="small"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                        sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#000' } }} 
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
                      <Button 
                        type="submit" 
                        variant="contained" 
                        disabled={saving}
                        startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <SecurityIcon />}
                        sx={{ mt: 2, bgcolor: '#FACC15', color: 'black', fontWeight: 900, py: 1.2, borderRadius: 1.5, '&:hover': { bgcolor: '#FDE047' } }}
                      >
                        Update Password
                      </Button>
                      <Button 
                        size="small" 
                        onClick={() => setIsEditingSecurity(false)}
                        sx={{ color: 'zinc.600', fontWeight: 700, textTransform: 'none' }}
                      >
                        Cancel and Go Back
                      </Button>
                    </Stack>
                  ) : (
                    <Box sx={{ p: 4, borderRadius: 2, bgcolor: '#080808', border: '1px solid #222', textAlign: 'center' }}>
                      <Box sx={{ bgcolor: 'rgba(250, 204, 21, 0.05)', width: 64, height: 64, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
                        <SecurityIcon sx={{ color: '#FACC15', fontSize: 32 }} />
                      </Box>
                      <Typography variant="h6" sx={{ color: 'white', fontWeight: 800, mb: 1 }}>Account Protected</Typography>
                      <Typography variant="body2" sx={{ color: 'zinc.500', maxWidth: 350, mx: 'auto', mb: 3 }}>
                        Your security credentials are encrypted. Click the edit icon above to change your password or update your security settings.
                      </Typography>
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
