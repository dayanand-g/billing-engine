import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FunctionComponent = () => {
  const location = useLocation();

  return (
    <AppBar position="static" color="primary" elevation={0}>
      <Toolbar>
        {/* Brand Logo / Name */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          Dynamic Billing Engine
        </Typography>

        {/* Navigation Links */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            color="inherit" 
            component={Link} 
            to="/"
            sx={{ 
              borderBottom: location.pathname === '/' ? '2px solid white' : 'none',
              borderRadius: 0
            }}
          >
            Plan Builder
          </Button>
          <Button 
            color="inherit" 
            component={Link} 
            to="/invoice"
            sx={{ 
              borderBottom: location.pathname === '/invoice' ? '2px solid white' : 'none',
              borderRadius: 0
            }}
          >
            Customer Invoice
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;