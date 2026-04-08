import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Stack, Divider, Box, Chip, CircularProgress } from '@mui/material';
import { getInvoice } from '../../api';
import type { InvoiceData, UsageBreakdownItem } from '../../api';

const InvoiceView: React.FunctionComponent = () => {
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchInvoice = async () => {
    try {
      const data = await getInvoice('cust_001'); 
      setInvoice(data);
    } catch (err) {
      console.error("Error fetching invoice", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoice();
    // In a real app, we can poll this every 30 seconds for "live" usage
  }, []);

  if (loading) return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 4 }} />;
  if (!invoice) return <Typography>No invoice data found.</Typography>;

  return (
    <Card sx={{ maxWidth: 600, mx: 'auto', mt: 4, borderRadius: 2, borderLeft: '6px solid #000' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" fontWeight="bold">Current Month's Invoice</Typography>
          <Chip label="Draft" size="small" />
        </Box>

        <Stack spacing={1} sx={{ mb: 3 }}>
          <Typography variant="body2"><strong>Customer:</strong> {invoice.customerName}</Typography>
          <Typography variant="body2"><strong>Plan:</strong> {invoice.planName}</Typography>
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle2" color="text.secondary" gutterBottom>USAGE BREAKDOWN</Typography>
        {invoice.usageBreakdown.map((item: UsageBreakdownItem, idx: number) => (
        <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', my: 1 }}>
            <Typography variant="body2">{item.metric} (x{item.totalUnits})</Typography>
            <Typography variant="body2">${item.subtotal.toFixed(2)}</Typography>
        </Box>
        ))}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 1 }}>
          <Typography variant="body2">Base Subscription</Typography>
          <Typography variant="body2">${invoice.baseSubscriptionFee.toFixed(2)}</Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" fontWeight="bold">Total Due</Typography>
          <Typography variant="h5" fontWeight="bold" color="primary">
            ${invoice.totalAmountDue.toFixed(2)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default InvoiceView;