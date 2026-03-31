'use client';
import React, { useEffect, useState } from 'react';
import { Box, Drawer, AppBar, Toolbar, List, Typography, Divider, IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CampaignIcon from '@mui/icons-material/Campaign';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import BusinessIcon from '@mui/icons-material/Business';

const drawerWidth = 260;

export default function AdvertiserLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
    const role = localStorage.getItem('role');
    if (role !== 'advertiser') {
       window.location.href = '/login';
    }
  }, []);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    router.push('/');
  };

  const navItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/advertiser/dashboard' },
    { text: 'My Campaigns', icon: <CampaignIcon />, path: '/advertiser/my-advertisements' },
    { text: 'Payments', icon: <ReceiptLongIcon />, path: '/advertiser/payments' },
  ];

  if (!isClient) return null;

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#0A0A0A', borderRight: '1px solid #1c1c1c' }}>
      <Toolbar sx={{ py: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <BusinessIcon sx={{ color: '#FACC15', fontSize: 32 }} />
        <Typography variant="h6" sx={{ fontWeight: 900, textTransform: 'uppercase', color: 'white', letterSpacing: 1 }}>
          Brand<span style={{ color: '#FACC15' }}>Portal</span>
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
                    borderRadius: '12px',
                    bgcolor: active ? 'rgba(250, 204, 21, 0.1)' : 'transparent',
                    color: active ? '#FACC15' : '#A1A1AA',
                    py: 1.5,
                    '&:hover': { bgcolor: 'rgba(250, 204, 21, 0.2)', color: '#FACC15' }
                  }}
                >
                  <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: active ? 800 : 600, fontSize: '0.95rem' }} />
                </ListItemButton>
              </ListItem>
            </Link>
          );
        })}
      </List>
      <Divider sx={{ borderColor: '#222' }} />
      <Box p={3}>
        <ListItemButton onClick={handleLogout} sx={{ borderRadius: '12px', color: '#EF4444', '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)' } }}>
          <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Log Out" primaryTypographyProps={{ fontWeight: 700 }} />
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
          backdropFilter: 'blur(16px)',
          boxShadow: 'none',
          borderBottom: '1px solid #1c1c1c'
        }}
      >
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: 'none' }, color: '#FACC15' }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1, fontWeight: 800, color: 'white', textTransform: 'uppercase', letterSpacing: 1 }}>
             {navItems.find(i => pathname.includes(i.path))?.text || 'Brand Center'}
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
