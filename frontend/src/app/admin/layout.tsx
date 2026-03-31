'use client';
import React, { useEffect, useState } from 'react';
import { Box, Drawer, AppBar, Toolbar, List, Typography, Divider, IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ArticleIcon from '@mui/icons-material/Article';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CampaignIcon from '@mui/icons-material/Campaign';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import SettingsIcon from '@mui/icons-material/Settings';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const drawerWidth = 260;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
    const role = localStorage.getItem('role');
    if (role !== 'superadmin' && role !== 'SuperAdmin') {
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
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
    { text: 'Leads', icon: <ArticleIcon />, path: '/admin/leads' },
    { text: 'User Management', icon: <PeopleIcon />, path: '/admin/users' },
    { text: 'Campaigns', icon: <CampaignIcon />, path: '/admin/campaigns' },
    { text: 'Daily Reports', icon: <AssessmentIcon />, path: '/admin/reports' },
    { text: 'Transactions', icon: <ReceiptLongIcon />, path: '/admin/transactions' },
    { text: 'System Settings', icon: <SettingsIcon />, path: '/admin/settings' },
  ];

  if (!isClient) return null;

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#0A0A0A', borderRight: '1px solid #1c1c1c' }}>
      <Toolbar sx={{ py: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <DirectionsCarIcon sx={{ color: '#FACC15', fontSize: 28 }} />
        <Typography variant="h6" sx={{ fontWeight: 900, textTransform: 'uppercase', color: 'white' }}>
          Fleet<span style={{ color: '#FACC15' }}>Ad</span> Admin
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
             {navItems.find(i => pathname.includes(i.path))?.text || 'Admin Panel'}
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
