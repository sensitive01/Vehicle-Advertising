'use client';
import React from 'react';
import { Box, Typography, Card, Stack, Grid, Chip } from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PendingActionsIcon from '@mui/icons-material/PendingActions';

export default function AdvertiserPaymentsPage() {
  return (
    <Box>
      <Typography variant="h4" sx={{ color: 'white', fontWeight: 900, mb: 4, textTransform: 'uppercase' }}>
        BILLING & <span style={{ color: '#FACC15' }}>PAYMENTS</span>
      </Typography>

      <Grid container spacing={4} sx={{ mb: 6 }}>
         <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ bgcolor: '#121212', p: 4, border: '1px solid #222', borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
               <Box sx={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', bgcolor: '#4ADE80' }} />
               <Typography variant="body2" sx={{ color: 'zinc.500', fontWeight: 800 }}>TOTAL SPENT</Typography>
               <Typography variant="h3" sx={{ color: 'white', fontWeight: 900 }}>₹ 0.00</Typography>
            </Card>
         </Grid>
         <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ bgcolor: '#121212', p: 4, border: '1px solid #222', borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
               <Box sx={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', bgcolor: '#FACC15' }} />
               <Typography variant="body2" sx={{ color: 'zinc.500', fontWeight: 800 }}>PENDING DUES</Typography>
               <Typography variant="h3" sx={{ color: 'white', fontWeight: 900 }}>₹ 0.00</Typography>
            </Card>
         </Grid>
      </Grid>

      <Card sx={{ bgcolor: '#121212', border: '1px solid #222', borderRadius: 4, py: 10, textAlign: 'center' }}>
         <ReceiptLongIcon sx={{ fontSize: 60, color: 'zinc.800', mb: 2 }} />
         <Typography variant="h6" sx={{ color: 'zinc.500' }}>No invoice history found.</Typography>
         <Typography variant="body2" sx={{ color: 'zinc.600', mt: 1 }}>Invoices will be generated once your active campaigns start running.</Typography>
      </Card>
    </Box>
  );
}
