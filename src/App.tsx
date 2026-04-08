import * as React from 'react';
import { Container, CssBaseline, ThemeProvider, createTheme, Box } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './pages/navbar';
import Footer from './pages/footer';
import PlanBuilder from './pages/planBuilder';
import InvoiceView from './pages/invoiceView';

type IAppProps = object; 

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#000000' }, 
    background: { default: '#f4f4f5' }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const App: React.FunctionComponent<IAppProps> = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> 
      <BrowserRouter>
        {/* The Flexbox wrapper keeps the footer at the bottom */}
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          
          <Navbar />

          {/* Main content area expands to fill available space */}
          <Container component="main" maxWidth="md" sx={{ flexGrow: 1, py: 6 }}>
            <Routes>
              <Route path="/" element={<PlanBuilder />} />
              <Route path="/invoice" element={<InvoiceView />} />
            </Routes>
          </Container>

          <Footer />

        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;