import React from 'react';
import { Box, Typography, Link as MuiLink } from '@mui/material';

const Footer: React.FunctionComponent = () => {
  return (
    <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', backgroundColor: '#e4e4e7' }}>
      <Typography variant="body2" color="text.secondary" align="center">
        {'Built for the Billing Engineering Team © '}
        {new Date().getFullYear()}
        {'. '}
        <MuiLink color="inherit" href="#">
          Learn about Dynamic Billing Engine
        </MuiLink>
      </Typography>
    </Box>
  );
};

export default Footer;