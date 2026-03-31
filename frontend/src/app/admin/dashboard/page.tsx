'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, Container, Card } from '@mui/material';

export default function AdminDashboard() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    // Quick frontend verification for demo setup
    if (token && role === 'superadmin') {
      setIsAdmin(true);
    } else {
      window.location.href = '/login';
    }
  }, []);

  if (!isAdmin) return <Box p={10}><Typography className="text-white">Verifying Authorization...</Typography></Box>;

  return (
    <Container maxWidth="xl" sx={{ pt: 6, pb: 10 }}>
      <Typography variant="h3" sx={{ color: 'white', fontWeight: 900, mb: 1, textTransform: 'uppercase' }}>
        Admin <span style={{ color: '#FACC15' }}>Dashboard</span>
      </Typography>
      <Typography sx={{ color: 'zinc.400', mb: 6 }}>
        Welcome back, Administrator. You have full system access.
      </Typography>

      <Card sx={{ bgcolor: '#121212', p: 6, border: '1px solid #333', borderRadius: 4 }}>
        <Typography variant="h5" sx={{ color: '#FACC15', mb: 2, fontWeight: 'bold' }}>System Overview</Typography>
        <Typography sx={{ color: 'zinc.300' }}>
          This is the central administration hub. The dashboard layout and specific administrative features (Leads, Registration Management, Configurations) will be populated here in upcoming iterations.
        </Typography>
      </Card>
    </Container>
  );
}
