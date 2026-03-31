'use client';
import React, { useEffect, useState } from 'react';
import { Box, Drawer, AppBar, Toolbar, List, Typography, Divider, IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CampaignIcon from '@mui/icons-material/Campaign';
import AssessmentIcon from '@mui/icons-material/Assessment';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Badge } from '@mui/material';

const drawerWidth = 260;

export default function FleetLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  
  const [isClient, setIsClient] = useState(false);
  
  const [pendingCount, setPendingCount] = useState(0);

  const fetchPendingCount = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/fleet/myfleet`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        const count = data.data.filter((v: any) => v.campaignStatus === 'PENDING').length;
        setPendingCount(count);
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    setIsClient(true);
    const role = localStorage.getItem('role');
    if (role !== 'fleet') {
       window.location.href = '/login';
    }
    fetchPendingCount();
  }, []);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    router.push('/');
  };

  const navItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/fleet/dashboard' },
    { text: 'My Vehicles', icon: <DirectionsCarIcon />, path: '/fleet/vehicles' },
    { text: 'Daily Reports', icon: <AssessmentIcon />, path: '/fleet/reports' },
    { text: 'My Advertisements', icon: <CampaignIcon />, path: '/fleet/advertisements' },
  ];

  if (!isClient) return null;

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#0A0A0A', borderRight: '1px solid #1c1c1c' }}>
      <Toolbar sx={{ py: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <DirectionsCarIcon sx={{ color: '#FACC15', fontSize: 28 }} />
        <Typography variant="h6" sx={{ fontWeight: 900, textTransform: 'uppercase', color: 'white' }}>
          Fleet<span style={{ color: '#FACC15' }}>Panel</span>
        </Typography>
      </Toolbar>
      <Divider sx={{ borderColor: '#222' }} />
      <List sx={{ flexGrow: 1, px: 2, py: 4, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {navItems.map((item) => {
          const active = pathname.includes(item.path);
          return (
            <Link href={item.path} key={item.text} style={{ textDecoration: 'none' }}>
              <ListItem disablePadding>
                <ListItemButton 
                  sx={{ 
                    borderRadius: '8px',
                    bgcolor: active ? 'rgba(250, 204, 21, 0.1)' : 'transparent',
                    color: active ? '#FACC15' : '#A1A1AA',
                    '&:hover': { bgcolor: 'rgba(250, 204, 21, 0.2)', color: '#FACC15' }
                  }}
                >
                  <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: active ? 800 : 500 }} />
                  {item.text === 'My Vehicles' && pendingCount > 0 && (
                    <Badge badgeContent={pendingCount} color="error" sx={{ mr: 1, '& .MuiBadge-badge': { fontWeight: 900 } }} />
                  )}
                </ListItemButton>
              </ListItem>
            </Link>
          );
        })}
      </List>
      <Divider sx={{ borderColor: '#222' }} />
      <Box p={2}>
        <ListItemButton onClick={handleLogout} sx={{ borderRadius: '8px', color: '#EF4444', '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)' } }}>
          <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Log Out" primaryTypographyProps={{ fontWeight: 600 }} />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#050505' }}>
      <AppBar 
        position="fixed" 
        sx={{ 
          width: { sm: `calc(100% - ${drawerWidth}px)` }, 
          ml: { sm: `${drawerWidth}px` }, 
          bgcolor: 'rgba(5, 5, 5, 0.8)', 
          backdropFilter: 'blur(12px)',
          boxShadow: 'none',
          borderBottom: '1px solid #1c1c1c'
        }}
      >
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: 'none' }, color: '#FACC15' }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1, fontWeight: 700, color: 'white' }}>
             {navItems.find(i => pathname.includes(i.path))?.text || 'Fleet Setup'}
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, bgcolor: '#0A0A0A' } }}
        >
          {drawerContent}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, bgcolor: '#0A0A0A', borderRight: '1px solid #1c1c1c' } }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 4, lg: 6 }, width: { sm: `calc(100% - ${drawerWidth}px)` }, mt: 8 }}>
        {children}
      </Box>
    </Box>
  );
}
