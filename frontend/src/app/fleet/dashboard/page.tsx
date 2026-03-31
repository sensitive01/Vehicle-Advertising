'use client';
import { Container, Typography, Card } from '@mui/material';

export default function FleetDashboard() {
  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ color: 'white', fontWeight: 900, mb: 4, textTransform: 'uppercase' }}>
        Fleet <span style={{ color: '#FACC15' }}>Dashboard</span>
      </Typography>

      <Card sx={{ bgcolor: '#121212', p: 6, border: '1px solid #333', borderRadius: 4 }}>
        <Typography variant="h6" sx={{ color: 'zinc.400' }}>
          Welcome to your Fleet Owner Dashboard. Summary statistics and live advertising campaign statuses will be displayed here soon.
        </Typography>
      </Card>
    </Container>
  );
}
