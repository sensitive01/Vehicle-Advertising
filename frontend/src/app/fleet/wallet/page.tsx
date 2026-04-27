'use client';
import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Card, Grid, Stack, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, Chip, 
  CircularProgress, Container, Avatar, Divider
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function FleetWalletPage() {
  const [loading, setLoading] = useState(true);
  const [walletBalance, setWalletBalance] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const userRes = await axios.get(`${API_URL}/api/auth/me`, { headers });
      const userData = userRes.data.data;
      
      const txRes = await axios.get(`${API_URL}/api/transactions/user/${userData._id}`, { headers });
      const txData = txRes.data.data || [];
      setTransactions(txData);

      // Fallback: If wallet balance is 0, calculate from transactions
      let balance = userData.walletBalance || 0;
      if (balance === 0 && txData.length > 0) {
        balance = txData.filter((t: any) => t.status === 'Completed' && t.type === 'Credit')
                        .reduce((sum: number, t: any) => sum + t.amount, 0);
      }
      setWalletBalance(balance);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xl">
      <Stack spacing={4}>
        <Box>
          <Typography variant="h4" sx={{ color: 'white', fontWeight: 900, textTransform: 'uppercase' }}>
            My <span style={{ color: '#FACC15' }}>Wallet</span>
          </Typography>
          <Typography sx={{ color: 'zinc.500', fontWeight: 600, mt: 1 }}>Manage your earnings and payout history</Typography>
        </Box>

        <Grid container spacing={3}>
           <Grid item xs={12} md={4}>
              <Card sx={{ 
                bgcolor: '#121212', p: 4, borderRadius: 1.5, border: '1px solid #333',
                position: 'relative', overflow: 'hidden'
              }}>
                 <Box sx={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', bgcolor: '#10B981' }} />
                 <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#10B981', width: 56, height: 56 }}>
                       <AccountBalanceWalletIcon fontSize="large" />
                    </Avatar>
                    <Box>
                       <Typography variant="h3" sx={{ color: 'white', fontWeight: 900 }}>₹{walletBalance.toLocaleString()}</Typography>
                       <Typography sx={{ color: 'zinc.500', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase' }}>Available Balance</Typography>
                    </Box>
                 </Stack>
              </Card>
           </Grid>
        </Grid>

        <Card sx={{ bgcolor: '#121212', borderRadius: 1.5, border: '1px solid #333', overflow: 'hidden' }}>
           <Box sx={{ p: 3, borderBottom: '1px solid #333', display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <ReceiptLongIcon sx={{ color: '#FACC15' }} />
              <Typography sx={{ color: 'white', fontWeight: 800, fontSize: '1rem', textTransform: 'uppercase' }}>Transaction History</Typography>
           </Box>
           
           <TableContainer>
              <Table>
                 <TableHead sx={{ bgcolor: '#1A1A1A' }}>
                    <TableRow>
                       <TableCell sx={{ color: '#A1A1AA', fontWeight: 'bold' }}>Transaction ID</TableCell>
                       <TableCell sx={{ color: '#A1A1AA', fontWeight: 'bold' }}>Description</TableCell>
                       <TableCell sx={{ color: '#A1A1AA', fontWeight: 'bold' }}>Amount</TableCell>
                       <TableCell sx={{ color: '#A1A1AA', fontWeight: 'bold' }}>Date</TableCell>
                       <TableCell sx={{ color: '#A1A1AA', fontWeight: 'bold' }}>Status</TableCell>
                    </TableRow>
                 </TableHead>
                 <TableBody>
                    {loading ? (
                       <TableRow><TableCell colSpan={5} align="center" sx={{ py: 8 }}><CircularProgress color="warning" /></TableCell></TableRow>
                    ) : transactions.length === 0 ? (
                       <TableRow><TableCell colSpan={5} align="center" sx={{ py: 8, color: 'zinc.600', fontWeight: 700 }}>No transactions found.</TableCell></TableRow>
                    ) : (
                       transactions.map((t) => (
                          <TableRow key={t._id} sx={{ '&:hover': { bgcolor: '#1A1A1A' } }}>
                             <TableCell sx={{ color: 'zinc.500', fontWeight: 700 }}>{t.transactionId}</TableCell>
                             <TableCell sx={{ color: 'white', fontWeight: 600 }}>{t.description}</TableCell>
                             <TableCell sx={{ color: '#10B981', fontWeight: 900 }}>+ ₹{t.amount.toLocaleString()}</TableCell>
                             <TableCell sx={{ color: 'zinc.400' }}>{new Date(t.createdAt).toLocaleDateString('en-GB')}</TableCell>
                             <TableCell>
                                <Chip 
                                   label={t.status.toUpperCase()} 
                                   size="small" 
                                   sx={{ 
                                      bgcolor: 'rgba(34, 197, 94, 0.1)', 
                                      color: '#4ADE80', 
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
        </Card>
      </Stack>
    </Container>
  );
}
