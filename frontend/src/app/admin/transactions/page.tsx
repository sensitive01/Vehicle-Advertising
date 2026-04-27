'use client';
import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Card, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Chip, TablePagination, Stack, Grid, CircularProgress
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

export default function AdminTransactionsPage() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [advertiserAds, setAdvertiserAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };
      
      const [txRes, campRes, adRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/transactions/all`, { headers }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/campaigns/all`, { headers }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/advertiser/all`, { headers })
      ]);

      const txData = await txRes.json();
      const campData = await campRes.json();
      const adData = await adRes.json();

      if (txData.success) setTransactions(txData.data);
      if (campData.success) setCampaigns(campData.data);
      if (adData.success) setAdvertiserAds(adData.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  // Calculate Revenue from both Campaigns and Advertiser Profiles
  const revenueFromCampaigns = campaigns.reduce((sum, c) => sum + (c.pricing?.estimatedTotal || 0), 0);
  const revenueFromAdvertisers = advertiserAds.reduce((sum, a) => sum + (a.quotedPrice || 0), 0);
  
  const totalRevenue = revenueFromCampaigns + revenueFromAdvertisers;
  const totalPayouts = transactions.filter(t => t.type === 'Credit').reduce((sum, t) => sum + t.amount, 0);

  return (
    <Box>
       <Typography variant="h4" sx={{ color: 'white', fontWeight: 900, mb: 4, textTransform: 'uppercase' }}>
        Finance <span style={{ color: '#FACC15' }}>Gateway</span>
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
         <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ bgcolor: '#121212', p: 4, border: '1px solid #333', borderRadius: 1.5, position: 'relative', overflow: 'hidden' }}>
               <Box sx={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', bgcolor: '#4ADE80' }} />
               <Typography variant="body2" sx={{ color: 'zinc.500', fontWeight: 800 }}>TOTAL REVENUE</Typography>
               <Typography variant="h3" sx={{ color: 'white', fontWeight: 900, mt: 1 }}>₹ {totalRevenue.toLocaleString('en-IN')}</Typography>
            </Card>
         </Grid>
         <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ bgcolor: '#121212', p: 4, border: '1px solid #333', borderRadius: 1.5, position: 'relative', overflow: 'hidden' }}>
               <Box sx={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', bgcolor: '#FACC15' }} />
               <Typography variant="body2" sx={{ color: 'zinc.500', fontWeight: 800 }}>TOTAL PAYOUTS</Typography>
               <Typography variant="h3" sx={{ color: 'white', fontWeight: 900, mt: 1 }}>₹ {totalPayouts.toLocaleString('en-IN')}</Typography>
            </Card>
         </Grid>
         <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ bgcolor: '#121212', p: 4, border: '1px solid #333', borderRadius: 1.5, position: 'relative', overflow: 'hidden' }}>
               <Box sx={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', bgcolor: '#3B82F6' }} />
               <Typography variant="body2" sx={{ color: 'zinc.500', fontWeight: 800 }}>NET BALANCE</Typography>
               <Typography variant="h3" sx={{ color: 'white', fontWeight: 900, mt: 1 }}>₹ {(totalRevenue - totalPayouts).toLocaleString('en-IN')}</Typography>
            </Card>
         </Grid>
      </Grid>

      <Card sx={{ bgcolor: '#121212', border: '1px solid #333', borderRadius: 1.5, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#1A1A1A' }}>
              <TableRow>
                <TableCell sx={{ color: '#A1A1AA', fontWeight: 'bold' }}>TXN ID</TableCell>
                <TableCell sx={{ color: '#A1A1AA', fontWeight: 'bold' }}>Entity / Type</TableCell>
                <TableCell sx={{ color: '#A1A1AA', fontWeight: 'bold' }}>Amount</TableCell>
                <TableCell sx={{ color: '#A1A1AA', fontWeight: 'bold' }}>Method</TableCell>
                <TableCell sx={{ color: '#A1A1AA', fontWeight: 'bold' }}>Date</TableCell>
                <TableCell sx={{ color: '#A1A1AA', fontWeight: 'bold' }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={6} sx={{ textAlign: 'center', py: 6 }}><CircularProgress color="warning" /></TableCell></TableRow>
              ) : transactions.length === 0 ? (
                <TableRow><TableCell colSpan={6} sx={{ textAlign: 'center', py: 6, color: 'zinc.600' }}>No transactions found.</TableCell></TableRow>
              ) : (
                transactions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((t) => (
                  <TableRow key={t._id} sx={{ '&:hover': { bgcolor: '#1A1A1A' } }}>
                    <TableCell sx={{ color: 'zinc.500', fontWeight: 700, fontSize: '0.8rem' }}>{t.transactionId}</TableCell>
                    <TableCell sx={{ py: 2 }}>
                       <Stack direction="row" spacing={1.5} alignItems="center">
                          {t.type === 'Credit' ? <ArrowUpwardIcon sx={{ color: '#EF4444', fontSize: 18 }} /> : <ArrowDownwardIcon sx={{ color: '#4ADE80', fontSize: 18 }} />}
                          <Box>
                             <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '0.9rem' }}>{t.userId?.fullName || 'System'}</Typography>
                             <Typography variant="caption" sx={{ color: 'zinc.500' }}>{t.type === 'Credit' ? 'Payout to Owner' : 'Ad Payment'}</Typography>
                          </Box>
                       </Stack>
                    </TableCell>
                    <TableCell sx={{ color: t.type === 'Credit' ? '#F87171' : '#FACC15', fontWeight: 900 }}>
                      {t.type === 'Credit' ? '- ' : '+ '} ₹ {t.amount.toLocaleString('en-IN')}
                    </TableCell>
                    <TableCell sx={{ color: 'zinc.400' }}>{t.paymentMethod}</TableCell>
                    <TableCell sx={{ color: 'zinc.500', fontSize: '0.85rem' }}>{new Date(t.createdAt).toLocaleDateString('en-GB')}</TableCell>
                    <TableCell>
                      <Chip 
                        label={t.status.toUpperCase()} 
                        size="small" 
                        sx={{ 
                          bgcolor: t.status === 'Completed' || t.status === 'Success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(250, 204, 21, 0.1)', 
                          color: t.status === 'Completed' || t.status === 'Success' ? '#4ADE80' : '#FACC15', 
                          fontWeight: 800,
                          fontSize: '0.65rem'
                        }} 
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination component="div" count={transactions.length} rowsPerPage={rowsPerPage} page={page} onPageChange={(e, p) => setPage(p)} onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }} sx={{ color: 'zinc.400', borderTop: '1px solid #333' }} />
      </Card>
    </Box>
  );
}
