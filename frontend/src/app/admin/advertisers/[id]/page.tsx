'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Box, Typography, Card, Grid, Avatar, Chip, CircularProgress, 
  Stack, Button, Tabs, Tab, Divider, Paper, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, IconButton, 
  Tooltip
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import BusinessIcon from '@mui/icons-material/Business';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CampaignIcon from '@mui/icons-material/Campaign';
import PersonIcon from '@mui/icons-material/Person';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 4 }}>{children}</Box>}
    </div>
  );
}

export default function AdvertiserProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  
  const [advertiser, setAdvertiser] = useState<any>(null);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      // Get user details
      const userRes = await axios.get(`${API_URL}/api/auth/users`, { headers });
      const userData = userRes.data.data.find((u: any) => u._id === id);
      setAdvertiser(userData);

      // Get user's campaigns
      const campRes = await axios.get(`${API_URL}/api/advertiser/user/${id}`, { headers });
      setCampaigns(campRes.data.data || []);

    } catch (err) {
      console.error('Error fetching advertiser profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress sx={{ color: '#FACC15' }} />
      </Box>
    );
  }

  if (!advertiser) return <Box p={10}><Typography sx={{ color: 'white' }}>Advertiser not found</Typography></Box>;

  return (
    <Box>
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={() => router.push('/admin/advertisers')}
        sx={{ color: '#FACC15', mb: 4, fontWeight: 700 }}
      >
        Back to Advertisers List
      </Button>

      <Card sx={{ bgcolor: '#121212', border: '1px solid #333', borderRadius: 1.5, mb: 4, backgroundImage: 'none' }}>
        <Box sx={{ p: 4, bgcolor: '#181818' }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="center">
            <Avatar sx={{ width: 100, height: 100, bgcolor: '#FACC15', color: 'black', fontSize: 40, fontWeight: 900 }}>
              {advertiser.fullName[0]}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                <Typography variant="h4" sx={{ color: 'white', fontWeight: 900 }}>{advertiser.fullName}</Typography>
                <Chip 
                  label="Advertiser" 
                  sx={{ bgcolor: 'rgba(250, 204, 21, 0.1)', color: '#FACC15', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.7rem' }} 
                />
              </Stack>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <PhoneIcon sx={{ fontSize: 18, color: '#FACC15' }} />
                  <Typography sx={{ color: 'zinc.400' }}>{advertiser.mobileNumber}</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <EmailIcon sx={{ fontSize: 18, color: '#FACC15' }} />
                  <Typography sx={{ color: 'zinc.400' }}>{advertiser.email}</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <CalendarMonthIcon sx={{ fontSize: 18, color: '#FACC15' }} />
                  <Typography sx={{ color: 'zinc.400' }}>Partner Since: {formatDate(advertiser.createdAt)}</Typography>
                </Stack>
              </Stack>
            </Box>
          </Stack>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: '#333' }}>
          <Tabs 
            value={activeTab} 
            onChange={(_, val) => setActiveTab(val)} 
            sx={{ 
              px: 3,
              '& .MuiTab-root': { color: 'zinc.500', fontWeight: 700, py: 3, px: 4 },
              '& .Mui-selected': { color: '#FACC15 !important' },
              '& .MuiTabs-indicator': { bgcolor: '#FACC15', height: 3 }
            }}
          >
            <Tab icon={<PersonIcon sx={{ mb: '4px !important' }} />} iconPosition="start" label="Personal Details" />
            <Tab icon={<CampaignIcon sx={{ mb: '4px !important' }} />} iconPosition="start" label="Brand Campaigns" />
            <Tab icon={<ReceiptLongIcon sx={{ mb: '4px !important' }} />} iconPosition="start" label="Billing History" />
          </Tabs>
        </Box>

        <Box sx={{ p: 4 }}>
          {/* Tab 0: Personal Details */}
          <CustomTabPanel value={activeTab} index={0}>
            <Grid container spacing={4}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="h6" sx={{ color: 'white', mb: 3, fontWeight: 800 }}>Account Profile</Typography>
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'zinc.600', fontWeight: 800, textTransform: 'uppercase' }}>ADVERTISER ID</Typography>
                    <Typography sx={{ color: '#FACC15', fontWeight: 700 }}>{advertiser.userId || 'N/A'}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'zinc.600', fontWeight: 800, textTransform: 'uppercase' }}>Verification Status</Typography>
                    <Chip 
                      label={advertiser.isProfileComplete ? 'Fully Documented' : 'Pending Documentation'} 
                      size="small"
                      sx={{ mt: 1, bgcolor: advertiser.isProfileComplete ? '#10B98120' : '#EF444420', color: advertiser.isProfileComplete ? '#10B981' : '#EF4444', fontWeight: 800 }}
                    />
                  </Box>
                </Stack>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="h6" sx={{ color: 'white', mb: 3, fontWeight: 800 }}>Engagement Summary</Typography>
                <Grid container spacing={2}>
                   <Grid size={{ xs: 6 }}>
                      <Card sx={{ p: 3, bgcolor: '#000', border: '1px solid #222', textAlign: 'center' }}>
                         <Typography variant="h4" sx={{ color: '#FACC15', fontWeight: 900 }}>{campaigns.length}</Typography>
                         <Typography variant="caption" sx={{ color: 'zinc.500', fontWeight: 700 }}>TOTAL CAMPAIGNS</Typography>
                      </Card>
                   </Grid>
                   <Grid size={{ xs: 6 }}>
                      <Card sx={{ p: 3, bgcolor: '#000', border: '1px solid #222', textAlign: 'center' }}>
                         <Typography variant="h4" sx={{ color: '#4ADE80', fontWeight: 900 }}>{campaigns.filter(c => c.status === 'ACTIVE').length}</Typography>
                         <Typography variant="caption" sx={{ color: 'zinc.500', fontWeight: 700 }}>ACTIVE NOW</Typography>
                      </Card>
                   </Grid>
                </Grid>
              </Grid>
            </Grid>
          </CustomTabPanel>

          {/* Tab 1: Campaigns */}
          <CustomTabPanel value={activeTab} index={1}>
            {campaigns.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 10, bgcolor: '#0A0A0A', borderRadius: 1.5, border: '1px dashed #333' }}>
                <CampaignIcon sx={{ fontSize: 48, color: 'zinc.800', mb: 2 }} />
                <Typography sx={{ color: 'zinc.600' }}>No advertising campaigns created by this advertiser.</Typography>
              </Box>
            ) : (
              <TableContainer component={Paper} sx={{ bgcolor: '#181818', borderRadius: 1.5, border: '1px solid #333', backgroundImage: 'none' }}>
                <Table>
                  <TableHead sx={{ bgcolor: '#000' }}>
                    <TableRow>
                      <TableCell sx={{ color: '#FACC15', fontWeight: 800 }}>BRAND NAME</TableCell>
                      <TableCell sx={{ color: '#FACC15', fontWeight: 800 }}>LOCATION</TableCell>
                      <TableCell sx={{ color: '#FACC15', fontWeight: 800 }}>VEHICLES</TableCell>
                      <TableCell sx={{ color: '#FACC15', fontWeight: 800 }}>BUDGET (EST)</TableCell>
                      <TableCell sx={{ color: '#FACC15', fontWeight: 800 }}>STATUS</TableCell>
                      <TableCell sx={{ color: '#FACC15', fontWeight: 800 }} align="center">ACTION</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {campaigns.map((camp) => (
                      <TableRow key={camp._id} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' } }}>
                        <TableCell>
                          <Typography sx={{ color: 'white', fontWeight: 700 }}>{camp.brandName}</Typography>
                          <Typography variant="caption" sx={{ color: 'zinc.500' }}>{camp.businessCategory}</Typography>
                        </TableCell>
                        <TableCell sx={{ color: 'zinc.300' }}>{camp.operatingLocation}</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 700 }}>{camp.numberOfVehicles} Units</TableCell>
                        <TableCell sx={{ color: '#FACC15', fontWeight: 800 }}>
                          ₹{(camp.rentalChargesPerKm * camp.averageKm || 0).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={camp.status} 
                            size="small" 
                            sx={{ 
                              bgcolor: camp.status === 'ACTIVE' ? 'rgba(74, 222, 128, 0.1)' : 'rgba(250, 204, 21, 0.1)', 
                              color: camp.status === 'ACTIVE' ? '#4ADE80' : '#FACC15', 
                              fontWeight: 800,
                              fontSize: '0.65rem'
                            }} 
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="Manage Campaign">
                            <IconButton sx={{ color: 'white' }} onClick={() => router.push('/admin/campaigns')}>
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CustomTabPanel>

          {/* Tab 2: Billing */}
          <CustomTabPanel value={activeTab} index={2}>
            <Box sx={{ textAlign: 'center', py: 10, bgcolor: '#0A0A0A', borderRadius: 1.5, border: '1px dashed #333' }}>
              <ReceiptIcon sx={{ fontSize: 48, color: 'zinc.800', mb: 2 }} />
              <Typography sx={{ color: 'zinc.600' }}>No invoice or transaction history available for this advertiser.</Typography>
            </Box>
          </CustomTabPanel>
        </Box>
      </Card>
    </Box>
  );
}
