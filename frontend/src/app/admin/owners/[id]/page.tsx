'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { 
  Box, Typography, Card, Grid, Avatar, Chip, CircularProgress, 
  Stack, Button, Tabs, Tab, Divider, Paper, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, IconButton, 
  Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  MenuItem, Select, FormControl, InputLabel, Checkbox, ListItemText,
  OutlinedInput
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CampaignIcon from '@mui/icons-material/Campaign';
import PersonIcon from '@mui/icons-material/Person';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import EditIcon from '@mui/icons-material/Edit';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CancelIcon from '@mui/icons-material/Cancel';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const AD_PLACEMENT_OPTIONS = [
  'Left door', 'Right door', 'Front bonnet', 'Rear door', 'Roof carrier handles', 'Full body wrap'
];

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

export default function OwnerProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Initialize tab from query param if present
  const initialTab = parseInt(searchParams.get('tab') || '0');
  const [activeTab, setActiveTab] = useState(initialTab);
  
  const [owner, setOwner] = useState<any>(null);
  const [fleet, setFleet] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [fleetProfile, setFleetProfile] = useState<any>(null);
  
  const [loading, setLoading] = useState(true);
  const [viewCampOpen, setViewCampOpen] = useState(false);
  const [selectedCampDetail, setSelectedCampDetail] = useState<any>(null);
  
  // Edit State
  const [editVehicle, setEditVehicle] = useState<any>(null);
  const [editData, setEditData] = useState<any>({});
  
  // Confirmation Dialog State
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean, type: 'verify' | 'reject', vehicle: any }>({
    open: false,
    type: 'verify',
    vehicle: null
  });

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

    const handleOpenCampDetails = (camp: any) => {
    const campaign = fleet.find(v => (v.activeCampaignId?._id || v.activeCampaignId) === camp.id)?.activeCampaignId;
    if (campaign && typeof campaign === 'object') {
      setSelectedCampDetail(campaign);
      setViewCampOpen(true);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const userRes = await axios.get(`${API_URL}/api/auth/users`, { headers });
      const userData = userRes.data.data.find((u: any) => u._id === id);
      setOwner(userData);

      const fleetRes = await axios.get(`${API_URL}/api/fleet/user/${id}`, { headers });
      setFleet(fleetRes.data.data || []);

      const transRes = await axios.get(`${API_URL}/api/transactions/user/${id}`, { headers });
      setTransactions(transRes.data.data || []);

      const profileRes = await axios.get(`${API_URL}/api/fleet/profile/${id}`, { headers });
      if (profileRes.data.success) setFleetProfile(profileRes.data.data);

    } catch (err) {
      console.error('Error fetching owner profile:', err);
    } finally {
      setLoading(false);
    }
  };

  // Extract Unique Campaigns from Fleet
  const getUniqueCampaigns = () => {
    const campaignsMap = new Map();
    fleet.forEach(vehicle => {
      const campaign = vehicle.activeCampaignId;
      if (campaign) {
        const isPopulated = typeof campaign === 'object' && campaign !== null;
        const cid = isPopulated ? (campaign._id || campaign.id) : campaign;
        
        if (!campaignsMap.has(cid)) {
          campaignsMap.set(cid, {
            id: cid,
            brandName: isPopulated ? (campaign.brandName || campaign.campaignTitle || 'Unnamed Campaign') : 'Loading...',
            businessCategory: isPopulated ? (campaign.businessCategory || 'N/A') : '...',
            status: isPopulated ? (campaign.status || 'ACTIVE') : 'PENDING',
            vehicleCount: 1,
            totalMonthlyEarnings: isPopulated ? (Number(campaign.rentalChargesPerKm || 0) * Number(campaign.averageKm || 0)) : 0
          });
        } else {
          const existing = campaignsMap.get(cid);
          existing.vehicleCount += 1;
          if (isPopulated) {
             existing.totalMonthlyEarnings += (Number(campaign.rentalChargesPerKm || 0) * Number(campaign.averageKm || 0));
          }
        }
      }
    });
    return Array.from(campaignsMap.values());
  };

  const activeCampaigns = getUniqueCampaigns();

  const handleBlockVehicle = async (vehicle: any) => {
    const token = localStorage.getItem('token');
    try {
      await axios.patch(`${API_URL}/api/fleet/block/${vehicle._id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      console.error('Error blocking vehicle:', err);
    }
  };

  const handleEditVehicle = (vehicle: any) => {
    setEditVehicle(vehicle);
    setEditData({ 
      ...vehicle, 
      adOptions: vehicle.adOptions || [] 
    });
  };

  const handleSaveVehicle = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.patch(`${API_URL}/api/fleet/update/${editVehicle._id}`, editData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditVehicle(null);
      fetchData();
    } catch (err) {
      console.error('Error updating vehicle:', err);
    }
  };

  const processVerification = async () => {
    const { type, vehicle } = confirmDialog;
    const token = localStorage.getItem('token');
    const endpoint = type === 'verify' ? 'approve' : 'reject';
    
    try {
      await axios.patch(`${API_URL}/api/fleet/${endpoint}/${vehicle._id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConfirmDialog({ ...confirmDialog, open: false });
      fetchData();
    } catch (err) {
      console.error(`Error during ${type}:`, err);
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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress sx={{ color: '#FACC15' }} />
      </Box>
    );
  }

  if (!owner) return <Box p={10}><Typography sx={{ color: 'white' }}>Owner not found</Typography></Box>;

  return (
    <Box>
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={() => router.push('/admin/owners')}
        sx={{ color: '#FACC15', mb: 4, fontWeight: 700 }}
      >
        Back to Owners List
      </Button>

      <Card sx={{ bgcolor: '#121212', border: '1px solid #333', borderRadius: 1.5, mb: 4, backgroundImage: 'none' }}>
        <Box sx={{ p: 4, bgcolor: '#181818' }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="center">
            <Avatar sx={{ width: 100, height: 100, bgcolor: '#FACC15', color: 'black', fontSize: 40, fontWeight: 900 }}>
              {owner.fullName[0]}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                <Typography variant="h4" sx={{ color: 'white', fontWeight: 900 }}>{owner.fullName}</Typography>
                <Chip 
                  label={owner.isBlocked ? 'Blocked' : 'Active'} 
                  color={owner.isBlocked ? 'error' : 'success'} 
                  size="small" 
                  sx={{ fontWeight: 800, textTransform: 'uppercase' }} 
                />
              </Stack>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <PhoneIcon sx={{ fontSize: 18, color: '#FACC15' }} />
                  <Typography sx={{ color: 'zinc.400' }}>{owner.mobileNumber}</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <EmailIcon sx={{ fontSize: 18, color: '#FACC15' }} />
                  <Typography sx={{ color: 'zinc.400' }}>{owner.email}</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <CalendarMonthIcon sx={{ fontSize: 18, color: '#FACC15' }} />
                  <Typography sx={{ color: 'zinc.400' }}>Joined: {formatDate(owner.createdAt)}</Typography>
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
            <Tab icon={<DirectionsCarIcon sx={{ mb: '4px !important' }} />} iconPosition="start" label="Registered Fleet" />
            <Tab icon={<CampaignIcon sx={{ mb: '4px !important' }} />} iconPosition="start" label="Active Campaigns" />
            <Tab icon={<ReceiptIcon sx={{ mb: '4px !important' }} />} iconPosition="start" label="Transactions" />
          </Tabs>
        </Box>

        <Box sx={{ p: 4 }}>
          {/* Tab Panels (Details omitted for brevity, same as previous) */}
          <CustomTabPanel value={activeTab} index={0}>
             {/* Personal Details Content */}
             <Grid container spacing={4}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="h6" sx={{ color: 'white', mb: 3, fontWeight: 800 }}>Account Information</Typography>
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'zinc.600', fontWeight: 800, textTransform: 'uppercase' }}>USER ID</Typography>
                    <Typography sx={{ color: '#FACC15', fontWeight: 700 }}>{owner.userId || 'N/A'}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'zinc.600', fontWeight: 800, textTransform: 'uppercase' }}>Full Name</Typography>
                    <Typography sx={{ color: 'white', fontWeight: 700 }}>{owner.fullName}</Typography>
                  </Box>
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="h6" sx={{ color: 'white', mb: 3, fontWeight: 800 }}>Banking Details</Typography>
                {fleetProfile?.bankDetails ? (
                  <Stack spacing={3}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
                      <Box>
                        <Typography variant="caption" sx={{ color: 'zinc.600', fontWeight: 800, textTransform: 'uppercase' }}>Account Holder</Typography>
                        <Typography sx={{ color: 'white', fontWeight: 700 }}>{fleetProfile.bankDetails.accountHolderName}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ color: 'zinc.600', fontWeight: 800, textTransform: 'uppercase' }}>Bank Name</Typography>
                        <Typography sx={{ color: 'white', fontWeight: 700 }}>{fleetProfile.bankDetails.bankName}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ color: 'zinc.600', fontWeight: 800, textTransform: 'uppercase' }}>Account Number</Typography>
                        <Typography sx={{ color: '#FACC15', fontWeight: 700 }}>{fleetProfile.bankDetails.accountNumber}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ color: 'zinc.600', fontWeight: 800, textTransform: 'uppercase' }}>IFSC Code</Typography>
                        <Typography sx={{ color: 'white', fontWeight: 700 }}>{fleetProfile.bankDetails.ifscCode}</Typography>
                      </Box>
                    </Box>
                    
                    {fleetProfile.bankDetails.passbookProof && (
                      <Box>
                        <Typography variant="caption" sx={{ color: 'zinc.600', fontWeight: 800, textTransform: 'uppercase', display: 'block', mb: 1.5 }}>Verification Proof (Passbook/Cheque)</Typography>
                        <Paper 
                          sx={{ 
                            width: 'fit-content', p: 1, bgcolor: '#000', border: '1px solid #333', borderRadius: 2, cursor: 'pointer',
                            transition: 'all 0.2s', '&:hover': { transform: 'scale(1.02)', borderColor: '#FACC15' }
                          }}
                          onClick={() => window.open(fleetProfile.bankDetails.passbookProof, '_blank')}
                        >
                          <img src={fleetProfile.bankDetails.passbookProof} style={{ width: 240, height: 150, objectFit: 'cover', borderRadius: 8 }} />
                        </Paper>
                      </Box>
                    )}
                  </Stack>
                ) : (
                  <Box sx={{ p: 6, bgcolor: '#0A0A0A', borderRadius: 2, border: '1px dashed #333', textAlign: 'center' }}>
                    <AccountBalanceIcon sx={{ fontSize: 48, color: 'zinc.800', mb: 2 }} />
                    <Typography sx={{ color: 'zinc.600', fontWeight: 600 }}>No banking details configured yet.</Typography>
                  </Box>
                )}
              </Grid>
            </Grid>
          </CustomTabPanel>

          <CustomTabPanel value={activeTab} index={1}>
            {/* Fleet Content */}
            {fleet.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 10, bgcolor: '#0A0A0A', borderRadius: 1.5, border: '1px dashed #333' }}>
                <DirectionsCarIcon sx={{ fontSize: 48, color: 'zinc.800', mb: 2 }} />
                <Typography sx={{ color: 'zinc.600' }}>No vehicles registered yet.</Typography>
              </Box>
            ) : (
              <TableContainer component={Paper} sx={{ bgcolor: '#181818', borderRadius: 1.5, border: '1px solid #333', backgroundImage: 'none' }}>
                <Table>
                  <TableHead sx={{ bgcolor: '#000' }}>
                    <TableRow>
                      <TableCell sx={{ color: '#FACC15', fontWeight: 800 }}>FLEET ID</TableCell>
                      <TableCell sx={{ color: '#FACC15', fontWeight: 800 }}>VEHICLE INFO</TableCell>
                      <TableCell sx={{ color: '#FACC15', fontWeight: 800 }}>REGISTRATION</TableCell>
                      <TableCell sx={{ color: '#FACC15', fontWeight: 800 }}>STATUS</TableCell>
                       <TableCell sx={{ color: '#FACC15', fontWeight: 800 }} align="right">ACTIONS</TableCell>
                      <TableCell sx={{ color: '#FACC15', fontWeight: 800 }} align="center">ACTIONS</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {fleet.map((vehicle) => (
                      <TableRow key={vehicle._id}>
                        <TableCell sx={{ color: '#FACC15', fontWeight: 700 }}>{vehicle.vehicleId || 'N/A'}</TableCell>
                        <TableCell>
                           <Typography sx={{ color: 'white', fontWeight: 700 }}>{vehicle.make} {vehicle.vehicleModel}</Typography>
                           <Typography variant="caption" sx={{ color: 'zinc.500' }}>{vehicle.color} • {vehicle.fuelType}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ color: 'white', fontWeight: 700 }}>{vehicle.registrationNumber}</Typography>
                        </TableCell>
                        <TableCell>
                           <Chip label={vehicle.status} size="small" sx={{ bgcolor: '#FACC1515', color: '#FACC15', fontWeight: 800 }} />
                        </TableCell>
                        <TableCell align="center">
                          <Stack direction="row" spacing={1} justifyContent="center">
                             {vehicle.status === 'Pending Verification' && (
                               <>
                                 <Tooltip title="Verify Vehicle">
                                   <IconButton size="small" sx={{ color: '#4ADE80' }} onClick={() => setConfirmDialog({ open: true, type: 'verify', vehicle })}>
                                     <CheckCircleIcon fontSize="small" />
                                   </IconButton>
                                 </Tooltip>
                                 <Tooltip title="Reject Vehicle">
                                   <IconButton size="small" sx={{ color: '#F87171' }} onClick={() => setConfirmDialog({ open: true, type: 'reject', vehicle })}>
                                     <CancelIcon fontSize="small" />
                                   </IconButton>
                                 </Tooltip>
                               </>
                             )}
                             <Tooltip title="Edit Specifications">
                               <IconButton size="small" sx={{ color: 'white' }} onClick={() => handleEditVehicle(vehicle)}>
                                 <EditIcon fontSize="small" />
                               </IconButton>
                             </Tooltip>
                             <Tooltip title="View Ad Campaigns">
                               <IconButton size="small" sx={{ color: '#FACC15' }} onClick={() => router.push(`/admin/fleet/${vehicle._id}/ads?ownerId=${id}&tab=1`)}>
                                 <CampaignIcon fontSize="small" />
                               </IconButton>
                             </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CustomTabPanel>

          <CustomTabPanel value={activeTab} index={2}>
            {/* Active Campaigns Content */}
            <TableContainer component={Paper} sx={{ bgcolor: '#181818', borderRadius: 1.5, border: '1px solid #333', backgroundImage: 'none' }}>
                <Table>
                  <TableHead sx={{ bgcolor: '#000' }}>
                    <TableRow>
                      <TableCell sx={{ color: '#FACC15', fontWeight: 800 }}>SL NO</TableCell>
                      <TableCell sx={{ color: '#FACC15', fontWeight: 800 }}>BRAND NAME</TableCell>
                      <TableCell sx={{ color: '#FACC15', fontWeight: 800 }}>VEHICLES</TableCell>
                      <TableCell sx={{ color: '#FACC15', fontWeight: 800 }}>EST. TOTAL INCOME / MO</TableCell>
                      <TableCell sx={{ color: '#FACC15', fontWeight: 800 }}>STATUS</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {activeCampaigns.map((camp, index) => (
                      <TableRow key={camp.id}>
                        <TableCell sx={{ color: 'zinc.500' }}>{String(index + 1).padStart(2, '0')}</TableCell>
                        <TableCell><Typography sx={{ color: 'white', fontWeight: 700 }}>{camp.brandName}</Typography></TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 700 }}>{camp.vehicleCount} Units</TableCell>
                        <TableCell sx={{ color: '#4ADE80', fontWeight: 900 }}>₹{camp.totalMonthlyEarnings.toLocaleString()}</TableCell>
                        <TableCell><Chip label={camp.status} size="small" sx={{ bgcolor: '#FACC1515', color: '#FACC15', fontWeight: 800 }} /></TableCell>
                        <TableCell align="right">
                           <IconButton size="small" onClick={() => handleOpenCampDetails(camp)} sx={{ color: '#FACC15', bgcolor: 'rgba(250, 204, 21, 0.05)' }}>
                              <VisibilityIcon fontSize="small" />
                           </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
          </CustomTabPanel>

          <CustomTabPanel value={activeTab} index={3}>
            {transactions.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 10, bgcolor: '#0A0A0A', borderRadius: 1.5, border: '1px dashed #333' }}>
                <ReceiptIcon sx={{ fontSize: 48, color: 'zinc.800', mb: 2 }} />
                <Typography sx={{ color: 'zinc.600' }}>No transactions found for this owner.</Typography>
              </Box>
            ) : (
              <TableContainer component={Paper} sx={{ bgcolor: '#181818', borderRadius: 1.5, border: '1px solid #333', backgroundImage: 'none' }}>
                <Table>
                  <TableHead sx={{ bgcolor: '#000' }}>
                    <TableRow>
                      <TableCell sx={{ color: '#FACC15', fontWeight: 800 }}>TRANSACTION ID</TableCell>
                      <TableCell sx={{ color: '#FACC15', fontWeight: 800 }}>DATE</TableCell>
                      <TableCell sx={{ color: '#FACC15', fontWeight: 800 }}>DESCRIPTION</TableCell>
                      <TableCell sx={{ color: '#FACC15', fontWeight: 800 }}>TYPE</TableCell>
                      <TableCell sx={{ color: '#FACC15', fontWeight: 800 }} align="right">AMOUNT</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {transactions.map((tx) => (
                      <TableRow key={tx._id} hover sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' } }}>
                        <TableCell sx={{ color: '#FACC15', fontWeight: 700, fontFamily: 'monospace' }}>
                          {tx.transactionId || tx._id.slice(-10).toUpperCase()}
                        </TableCell>
                        <TableCell sx={{ color: 'zinc.400' }}>{formatDate(tx.createdAt)}</TableCell>
                        <TableCell>
                          <Typography sx={{ color: 'white', fontWeight: 600 }}>
                            {tx.description ? tx.description.replace(/Payout for Daily Report [a-f0-9]{24}/, 'Payout for Daily Report') : 'Payout processed'}
                          </Typography>
                          {tx.referenceId && (
                            <Typography variant="caption" sx={{ color: 'zinc.600', display: 'block' }}>Ref: {tx.referenceId}</Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={tx.type === 'Credit' ? 'DEBIT' : 'CREDIT'} 
                            size="small" 
                            sx={{ 
                              bgcolor: tx.type === 'Credit' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)', 
                              color: tx.type === 'Credit' ? '#F87171' : '#4ADE80', 
                              fontWeight: 800,
                              fontSize: '0.65rem'
                            }} 
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Typography sx={{ 
                            color: tx.type === 'Credit' ? '#F87171' : '#4ADE80', 
                            fontWeight: 900,
                            fontSize: '1rem'
                          }}>
                            {tx.type === 'Credit' ? '-' : '+'}₹{tx.amount.toLocaleString()}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CustomTabPanel>
        </Box>
      </Card>

      {/* COMPREHENSIVE Edit Vehicle Dialog */}
      <Dialog 
        open={!!editVehicle} 
        onClose={() => setEditVehicle(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { bgcolor: '#121212', color: 'white', borderRadius: 1.5, border: '1px solid #333', backgroundImage: 'none' }
        }}
      >
        <DialogTitle sx={{ fontWeight: 900, borderBottom: '1px solid #222', p: 3 }}>
          Update Vehicle Specifications <Typography variant="caption" sx={{ color: '#FACC15', display: 'block', mt: 0.5 }}>{editVehicle?.vehicleId}</Typography>
        </DialogTitle>
        <DialogContent 
          sx={{ 
            p: 4, 
            pt: '32px !important',
            '&::-webkit-scrollbar': { display: 'none' },
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          <Typography variant="subtitle2" sx={{ color: 'zinc.600', fontWeight: 800, mb: 2, textTransform: 'uppercase' }}>Vehicle Photos</Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 4, p: 2, bgcolor: '#000', borderRadius: 2, border: '1px solid #222' }}>
            {editData.images && editData.images.length > 0 ? (
              editData.images.map((img: string, i: number) => (
                <Paper key={i} sx={{ width: 120, height: 90, overflow: 'hidden', borderRadius: 2, border: '1px solid #333' }}>
                  <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </Paper>
              ))
            ) : (
              <Typography sx={{ color: 'zinc.600', fontSize: '0.8rem' }}>No main photos uploaded</Typography>
            )}
          </Box>

          <Typography variant="subtitle2" sx={{ color: 'zinc.600', fontWeight: 800, mb: 2, textTransform: 'uppercase' }}>General Information</Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField 
                label="Registration Number" 
                fullWidth 
                value={editData.registrationNumber || ''}
                onChange={(e) => setEditData({...editData, registrationNumber: e.target.value})}
                sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#000' } }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: 'zinc.500' }}>Registration Type</InputLabel>
                <Select
                  value={editData.registrationType || ''}
                  label="Registration Type"
                  onChange={(e) => setEditData({...editData, registrationType: e.target.value})}
                  sx={{ bgcolor: '#000', color: 'white' }}
                >
                  <MenuItem value="Personal">Personal</MenuItem>
                  <MenuItem value="Yellow board">Yellow board</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField 
                label="Brand / Make" 
                fullWidth 
                value={editData.make || ''}
                onChange={(e) => setEditData({...editData, make: e.target.value})}
                sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#000' } }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField 
                label="Vehicle Model" 
                fullWidth 
                value={editData.vehicleModel || ''}
                onChange={(e) => setEditData({...editData, vehicleModel: e.target.value})}
                sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#000' } }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField 
                label="Variant" 
                fullWidth 
                value={editData.variant || ''}
                onChange={(e) => setEditData({...editData, variant: e.target.value})}
                sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#000' } }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField 
                label="Color" 
                fullWidth 
                value={editData.color || ''}
                onChange={(e) => setEditData({...editData, color: e.target.value})}
                sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#000' } }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: 'zinc.500' }}>Fuel Type</InputLabel>
                <Select
                  value={editData.fuelType || ''}
                  label="Fuel Type"
                  onChange={(e) => setEditData({...editData, fuelType: e.target.value})}
                  sx={{ bgcolor: '#000', color: 'white' }}
                >
                  <MenuItem value="Petrol">Petrol</MenuItem>
                  <MenuItem value="Diesel">Diesel</MenuItem>
                  <MenuItem value="CNG">CNG</MenuItem>
                  <MenuItem value="Electric">Electric</MenuItem>
                  <MenuItem value="Others">Others</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Typography variant="subtitle2" sx={{ color: 'zinc.600', fontWeight: 800, mb: 2, textTransform: 'uppercase' }}>Classification & Usage</Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: 'zinc.500' }}>Category</InputLabel>
                <Select
                  value={editData.vehicleCategory || ''}
                  label="Category"
                  onChange={(e) => setEditData({...editData, vehicleCategory: e.target.value})}
                  sx={{ bgcolor: '#000', color: 'white' }}
                >
                  <MenuItem value="Passenger">Passenger</MenuItem>
                  <MenuItem value="Goods">Goods</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            {editData.vehicleCategory === 'Passenger' && (
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: 'zinc.500' }}>Passenger Subtype</InputLabel>
                  <Select
                    value={editData.passengerSubtype || ''}
                    label="Passenger Subtype"
                    onChange={(e) => setEditData({...editData, passengerSubtype: e.target.value})}
                    sx={{ bgcolor: '#000', color: 'white' }}
                  >
                    <MenuItem value="Auto">Auto</MenuItem>
                    <MenuItem value="Car/Jeep">Car/Jeep</MenuItem>
                    <MenuItem value="Mini Bus">Mini Bus</MenuItem>
                    <MenuItem value="Bus">Bus</MenuItem>
                    <MenuItem value="Van">Van</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}

            {editData.passengerSubtype === 'Car/Jeep' && editData.vehicleCategory === 'Passenger' && (
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: 'zinc.500' }}>Car Style</InputLabel>
                  <Select
                    value={editData.carSubtype || ''}
                    label="Car Style"
                    onChange={(e) => setEditData({...editData, carSubtype: e.target.value})}
                    sx={{ bgcolor: '#000', color: 'white' }}
                  >
                    <MenuItem value="Hatchback">Hatchback</MenuItem>
                    <MenuItem value="Sedan">Sedan</MenuItem>
                    <MenuItem value="SUV">SUV</MenuItem>
                    <MenuItem value="MUV">MUV</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}

            {editData.vehicleCategory === 'Goods' && (
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: 'zinc.500' }}>Goods Subtype</InputLabel>
                  <Select
                    value={editData.goodsSubtype || ''}
                    label="Goods Subtype"
                    onChange={(e) => setEditData({...editData, goodsSubtype: e.target.value})}
                    sx={{ bgcolor: '#000', color: 'white' }}
                  >
                    <MenuItem value="Tempo/Tata Ace">Tempo/Tata Ace</MenuItem>
                    <MenuItem value="Pickup Truck">Pickup Truck</MenuItem>
                    <MenuItem value="Heavy Truck">Heavy Truck</MenuItem>
                    <MenuItem value="Trailer">Trailer</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}

            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField 
                label="Seating Capacity" 
                fullWidth 
                type="number"
                value={editData.seatingCapacity || 0}
                onChange={(e) => setEditData({...editData, seatingCapacity: Number(e.target.value)})}
                sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#000' } }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: 'zinc.500' }}>Travel Routine</InputLabel>
                <Select
                  value={editData.travelRoutine || ''}
                  label="Travel Routine"
                  onChange={(e) => setEditData({...editData, travelRoutine: e.target.value})}
                  sx={{ bgcolor: '#000', color: 'white' }}
                >
                  <MenuItem value="City ride">City ride</MenuItem>
                  <MenuItem value="Outstation">Outstation</MenuItem>
                  <MenuItem value="State permit">State permit</MenuItem>
                  <MenuItem value="All India">All India</MenuItem>
                  <MenuItem value="Random">Random</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField 
                label="Average KM per Day" 
                fullWidth 
                type="number"
                value={editData.averageKmPerDay || 0}
                onChange={(e) => setEditData({...editData, averageKmPerDay: Number(e.target.value)})}
                sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#000' } }}
              />
            </Grid>
          </Grid>

          <Typography variant="subtitle2" sx={{ color: 'zinc.600', fontWeight: 800, mb: 2, textTransform: 'uppercase' }}>Ad Placement Options</Typography>
          <Box sx={{ mb: 4 }}>
            <FormControl fullWidth>
              <InputLabel sx={{ color: 'zinc.500' }}>Selected Placements</InputLabel>
              <Select
                multiple
                value={editData.adOptions || []}
                onChange={(e) => setEditData({...editData, adOptions: e.target.value})}
                input={<OutlinedInput label="Selected Placements" sx={{ bgcolor: '#000' }} />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value: string) => (
                      <Chip key={value} label={value} size="small" sx={{ bgcolor: '#FACC15', color: 'black', fontWeight: 700 }} />
                    ))}
                  </Box>
                )}
                sx={{ color: 'white' }}
              >
                {AD_PLACEMENT_OPTIONS.map((name) => (
                  <MenuItem key={name} value={name}>
                    <Checkbox checked={(editData.adOptions || []).indexOf(name) > -1} sx={{ color: '#FACC15', '&.Mui-checked': { color: '#FACC15' } }} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {editData.adOptionImages && Object.keys(editData.adOptionImages).length > 0 && (
              <Box sx={{ mt: 2, p: 2, bgcolor: '#000', borderRadius: 2, border: '1px solid #222' }}>
                <Typography variant="caption" sx={{ color: 'zinc.500', fontWeight: 800, mb: 1, display: 'block', textTransform: 'uppercase' }}>Current Ad Space Photos</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {Object.entries(editData.adOptionImages).map(([opt, url]: [string, any]) => (
                    <Tooltip key={opt} title={opt}>
                      <Paper sx={{ width: 100, height: 75, overflow: 'hidden', borderRadius: 1.5, border: '1px solid #333', position: 'relative' }}>
                        <img src={url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, bgcolor: 'rgba(0,0,0,0.6)', p: 0.5 }}>
                           <Typography sx={{ color: 'white', fontSize: '0.6rem', textAlign: 'center', fontWeight: 700 }}>{opt}</Typography>
                        </Box>
                      </Paper>
                    </Tooltip>
                  ))}
                </Box>
              </Box>
            )}
          </Box>

          <Typography variant="subtitle2" sx={{ color: 'zinc.600', fontWeight: 800, mb: 2, textTransform: 'uppercase' }}>Verification & Maintenance</Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
               <FormControl fullWidth>
                <InputLabel sx={{ color: 'zinc.500' }}>Verification Status</InputLabel>
                <Select
                  value={editData.status || ''}
                  label="Verification Status"
                  onChange={(e) => setEditData({...editData, status: e.target.value})}
                  sx={{ bgcolor: '#000', color: '#FACC15', fontWeight: 800 }}
                >
                  <MenuItem value="Pending Verification">Pending Verification</MenuItem>
                  <MenuItem value="Approved">Approved</MenuItem>
                  <MenuItem value="Rejected">Rejected</MenuItem>
                  <MenuItem value="Under Service">Under Service</MenuItem>
                  <MenuItem value="Not Operational">Not Operational</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {editData.status === 'Under Service' && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField 
                  label="Service Reason" 
                  fullWidth 
                  value={editData.serviceReason || ''}
                  onChange={(e) => setEditData({...editData, serviceReason: e.target.value})}
                  sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#000' } }}
                />
              </Grid>
            )}
          </Grid>

          <Typography variant="subtitle2" sx={{ color: 'zinc.600', fontWeight: 800, mb: 2, textTransform: 'uppercase' }}>Owner Documentation Info</Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField 
                label="Owner Name (on RC)" 
                fullWidth 
                value={editData.ownerName || ''}
                onChange={(e) => setEditData({...editData, ownerName: e.target.value})}
                sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#000' } }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField 
                label="Owner Contact" 
                fullWidth 
                value={editData.ownerContact || ''}
                onChange={(e) => setEditData({...editData, ownerContact: e.target.value})}
                sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#000' } }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid #222' }}>
          <Button onClick={() => setEditVehicle(null)} sx={{ color: 'zinc.500', fontWeight: 700 }}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleSaveVehicle}
            sx={{ 
              bgcolor: '#FACC15', 
              color: 'black', 
              fontWeight: 900,
              px: 4,
              '&:hover': { bgcolor: '#FDE047' }
            }}
          >
            Update All Data
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog 
        open={confirmDialog.open} 
        onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
        PaperProps={{ sx: { bgcolor: '#121212', color: 'white', borderRadius: 1.5, border: '1px solid #333' } }}
      >
        <DialogTitle sx={{ fontWeight: 900, borderBottom: '1px solid #222' }}>
           Confirm <span style={{ color: confirmDialog.type === 'verify' ? '#4ADE80' : '#F87171' }}>{confirmDialog.type === 'verify' ? 'Verification' : 'Rejection'}</span>
        </DialogTitle>
        <DialogContent sx={{ p: 4, pt: 3 }}>
           <Typography sx={{ color: 'zinc.400' }}>
              Are you sure you want to {confirmDialog.type === 'verify' ? 'APPROVE' : 'REJECT'} the vehicle 
              <strong> {confirmDialog.vehicle?.registrationNumber}</strong> ({confirmDialog.vehicle?.make} {confirmDialog.vehicle?.vehicleModel})?
           </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
           <Button onClick={() => setConfirmDialog({ ...confirmDialog, open: false })} sx={{ color: 'zinc.500' }}>Cancel</Button>
           <Button 
             variant="contained" 
             onClick={processVerification}
             sx={{ 
               bgcolor: confirmDialog.type === 'verify' ? '#4ADE80' : '#F87171', 
               color: 'black', 
               fontWeight: 900,
               '&:hover': { bgcolor: confirmDialog.type === 'verify' ? '#22C55E' : '#EF4444' }
             }}
           >
              Confirm {confirmDialog.type === 'verify' ? 'Approval' : 'Rejection'}
           </Button>
        </DialogActions>
      </Dialog>

      {/* Campaign Details Dialog */}
      <Dialog 
        open={viewCampOpen} 
        onClose={() => setViewCampOpen(false)} 
        maxWidth="md" 
        fullWidth 
        PaperProps={{ sx: { bgcolor: '#121212', color: 'white', borderRadius: 1.5, border: '1px solid #333' } }}
      >
        <DialogTitle component="div" sx={{ p: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #222' }}>
           <Typography variant="h5" sx={{ fontWeight: 900, textTransform: 'uppercase' }}>Campaign <span style={{ color: '#FACC15' }}>Details</span></Typography>
           <IconButton onClick={() => setViewCampOpen(false)} sx={{ color: 'zinc.500' }}><CancelIcon /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
           {selectedCampDetail && (
             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <Grid container spacing={3}>
                   <Grid size={{ xs: 12, md: 4 }}>
                      <Typography variant="caption" sx={{ color: 'zinc.600', fontWeight: 800, textTransform: 'uppercase' }}>Brand Name</Typography>
                      <Typography variant="h6" sx={{ color: 'white', fontWeight: 800 }}>{selectedCampDetail.brandName}</Typography>
                   </Grid>
                   <Grid size={{ xs: 12, md: 4 }}>
                      <Typography variant="caption" sx={{ color: 'zinc.600', fontWeight: 800, textTransform: 'uppercase' }}>Category</Typography>
                      <Typography variant="body1" sx={{ color: 'zinc.300', fontWeight: 700 }}>{selectedCampDetail.businessCategory}</Typography>
                   </Grid>
                   <Grid size={{ xs: 12, md: 4 }}>
                      <Typography variant="caption" sx={{ color: 'zinc.600', fontWeight: 800, textTransform: 'uppercase' }}>Operating City</Typography>
                      <Typography variant="body1" sx={{ color: 'zinc.300', fontWeight: 700 }}>{selectedCampDetail.operatingLocation}</Typography>
                   </Grid>
                </Grid>
                
                <Divider sx={{ borderColor: '#222' }} />
                
                <Grid container spacing={3}>
                   <Grid size={{ xs: 6, md: 3 }}>
                      <Typography variant="caption" sx={{ color: 'zinc.600', fontWeight: 800, textTransform: 'uppercase' }}>Rental/KM</Typography>
                      <Typography variant="h6" sx={{ color: '#4ADE80', fontWeight: 900 }}>₹{selectedCampDetail.rentalChargesPerKm}</Typography>
                   </Grid>
                   <Grid size={{ xs: 6, md: 3 }}>
                      <Typography variant="caption" sx={{ color: 'zinc.600', fontWeight: 800, textTransform: 'uppercase' }}>Expected KM</Typography>
                      <Typography variant="h6" sx={{ color: 'white', fontWeight: 900 }}>{selectedCampDetail.averageKm}</Typography>
                   </Grid>
                   <Grid size={{ xs: 6, md: 3 }}>
                      <Typography variant="caption" sx={{ color: 'zinc.600', fontWeight: 800, textTransform: 'uppercase' }}>Duration</Typography>
                      <Typography variant="body1" sx={{ color: 'zinc.300', fontWeight: 700 }}>{selectedCampDetail.duration}</Typography>
                   </Grid>
                   <Grid size={{ xs: 6, md: 3 }}>
                      <Typography variant="caption" sx={{ color: 'zinc.600', fontWeight: 800, textTransform: 'uppercase' }}>Campaign Status</Typography>
                      <Chip label={selectedCampDetail.status} size="small" sx={{ bgcolor: 'rgba(34, 197, 94, 0.1)', color: '#4ADE80', fontWeight: 800, mt: 0.5 }} />
                   </Grid>
                </Grid>

                <Box sx={{ p: 3, bgcolor: '#1A1A1A', borderRadius: 2, border: '1px solid #222' }}>
                   <Typography variant="caption" sx={{ color: 'zinc.600', fontWeight: 900, mb: 1, display: 'block', textTransform: 'uppercase' }}>Ad Placement Details</Typography>
                   <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {selectedCampDetail.adOptions?.map((opt: string) => (
                        <Chip key={opt} label={opt} size="small" variant="outlined" sx={{ color: '#FACC15', borderColor: '#FACC1540', fontWeight: 700 }} />
                      ))}
                   </Box>
                </Box>
             </Box>
           )}
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid #222' }}>
           <Button onClick={() => setViewCampOpen(false)} sx={{ color: '#FACC15', fontWeight: 800 }}>Close Details</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

