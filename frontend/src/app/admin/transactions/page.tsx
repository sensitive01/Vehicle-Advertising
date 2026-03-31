'use client';
import React, { useState } from 'react';
import { 
  Box, Typography, Card, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Chip, TablePagination, Stack, Grid
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

export default function AdminTransactionsPage() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);

  const mockData = [
     { id: 'TXN001', date: '2026-03-31', brand: 'Nike Inc.', amount: 45000, status: 'Success', method: 'Razorpay' },
     { id: 'TXN002', date: '2026-03-30', brand: 'Pepsi Co.', amount: 120000, status: 'Success', method: 'Bank Transfer' },
     { id: 'TXN003', date: '2026-03-29', brand: 'Tata Motors', amount: 85000, status: 'Processing', method: 'Razorpay' }
  ];

  return (
    <Box>
       <Typography variant="h4" sx={{ color: 'white', fontWeight: 900, mb: 4, textTransform: 'uppercase' }}>
        Finance <span style={{ color: '#FACC15' }}>Gateway</span>
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
         <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ bgcolor: '#121212', p: 4, border: '1px solid #333', borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
               <Box sx={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', bgcolor: '#4ADE80' }} />
               <Typography variant="body2" sx={{ color: 'zinc.500', fontWeight: 800 }}>TOTAL REVENUE</Typography>
               <Typography variant="h3" sx={{ color: 'white', fontWeight: 900, mt: 1 }}>₹ 2,50,000</Typography>
            </Card>
         </Grid>
         <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ bgcolor: '#121212', p: 4, border: '1px solid #333', borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
               <Box sx={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', bgcolor: '#FACC15' }} />
               <Typography variant="body2" sx={{ color: 'zinc.500', fontWeight: 800 }}>PENDING SETTLEMENT</Typography>
               <Typography variant="h3" sx={{ color: 'white', fontWeight: 900, mt: 1 }}>₹ 85,000</Typography>
            </Card>
         </Grid>
         <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ bgcolor: '#121212', p: 4, border: '1px solid #333', borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
               <Box sx={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', bgcolor: '#3B82F6' }} />
               <Typography variant="body2" sx={{ color: 'zinc.500', fontWeight: 800 }}>ACTIVE CONTRACTS</Typography>
               <Typography variant="h3" sx={{ color: 'white', fontWeight: 900, mt: 1 }}>12</Typography>
            </Card>
         </Grid>
      </Grid>

      <Card sx={{ bgcolor: '#121212', border: '1px solid #333', borderRadius: 4, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#1A1A1A' }}>
              <TableRow>
                <TableCell sx={{ color: '#A1A1AA', fontWeight: 'bold' }}>TXN ID</TableCell>
                <TableCell sx={{ color: '#A1A1AA', fontWeight: 'bold' }}>Brand / Advertiser</TableCell>
                <TableCell sx={{ color: '#A1A1AA', fontWeight: 'bold' }}>Amount</TableCell>
                <TableCell sx={{ color: '#A1A1AA', fontWeight: 'bold' }}>Method</TableCell>
                <TableCell sx={{ color: '#A1A1AA', fontWeight: 'bold' }}>Date</TableCell>
                <TableCell sx={{ color: '#A1A1AA', fontWeight: 'bold' }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockData.map((t) => (
                <TableRow key={t.id} sx={{ '&:hover': { bgcolor: '#1A1A1A' } }}>
                  <TableCell sx={{ color: 'zinc.500', fontWeight: 700 }}>{t.id}</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 700 }}>{t.brand}</TableCell>
                  <TableCell sx={{ color: '#FACC15', fontWeight: 900 }}>₹ {t.amount.toLocaleString('en-IN')}</TableCell>
                  <TableCell sx={{ color: 'zinc.400' }}>{t.method}</TableCell>
                  <TableCell sx={{ color: 'zinc.500' }}>{t.date}</TableCell>
                  <TableCell>
                    <Chip label={t.status.toUpperCase()} size="small" sx={{ bgcolor: t.status === 'Success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(250, 204, 21, 0.1)', color: t.status === 'Success' ? '#4ADE80' : '#FACC15', fontWeight: 'bold' }} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination component="div" count={3} rowsPerPage={rowsPerPage} page={page} onPageChange={(e, p) => setPage(p)} onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }} sx={{ color: 'zinc.400', borderTop: '1px solid #333' }} />
      </Card>
    </Box>
  );
}
