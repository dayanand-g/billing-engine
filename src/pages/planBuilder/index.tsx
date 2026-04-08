import React, { useState } from 'react';
import { 
  Box, Card, CardContent, Typography, TextField, Button, IconButton, Stack, Divider 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { createPlan } from '../../api';

interface UsageRates {
    metric: string;
    ratePerUnit: number;
}

const PlanBuilder: React.FunctionComponent = () => {

    const [name, setName] = useState('Enterprise Tier 1');
    const [basePrice, setBasePrice] = useState<number>(100);
    
    // This array holds our dynamic usage metrics
    const [usageRates, setUsageRates] = useState<UsageRates[]>([
        { metric: 'API_CALL', ratePerUnit: 0.05 }
    ]);

    // --- Dynamic Form Handlers ---
    const handleAddRate = () => {
        setUsageRates([...usageRates, { metric: '', ratePerUnit: 0 }]);
    };

    const handleRemoveRate = (index: number) => {
        const updatedRates = usageRates.filter((_, i) => i !== index);
        setUsageRates(updatedRates);
    };

    const handleRateChange = (index: number, field: keyof UsageRates, value: string | number) => {
        const updatedRates = [...usageRates];
        updatedRates[index] = { ...updatedRates[index], [field]: value };
        setUsageRates(updatedRates);
    };

    // --- Submit Handler ---
    const handleSubmit = async () => {
        try {
        const payload = { name, basePrice, usageRates };
        const response = await createPlan(payload);
        alert(`Success! Plan created with ID: ${response.plan.id}`);
        } catch (error) {
        console.error("Failed to create plan", error);
        alert("Error creating plan. Is your backend running?");
        }
    };

    return (
        <Card sx={{ maxWidth: 600, mx: 'auto', mt: 4, boxShadow: 3 }}>
        <CardContent>
            <Typography variant="h5" gutterBottom fontWeight="bold">
            Create Pricing Plan
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Define the base subscription fee and any usage-based metering rules.
            </Typography>

            <Stack spacing={3}>
            {/* Base Plan Info */}
            <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField 
                label="Plan Name" 
                fullWidth 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                />
                <TextField 
                label="Base Price ($/mo)" 
                type="number" 
                sx={{ width: 150 }}
                value={basePrice} 
                onChange={(e) => setBasePrice(Number(e.target.value))} 
                />
            </Box>

            <Divider />

            {/* Dynamic Usage Rates Section */}
            <Box>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Usage Metering Rules
                </Typography>
                
                <Stack spacing={2}>
                {usageRates.map((rate, index) => (
                    <Box key={index} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <TextField 
                        label="Metric (e.g., API_CALL)" 
                        size="small" 
                        fullWidth
                        value={rate.metric}
                        onChange={(e) => handleRateChange(index, 'metric', e.target.value)}
                    />
                    <TextField 
                        label="Rate ($)" 
                        type="number" 
                        size="small" 
                        sx={{ width: 120 }}
                        slotProps={{ htmlInput: { step: "0.01" } }}
                        value={rate.ratePerUnit}
                        onChange={(e) => handleRateChange(index, 'ratePerUnit', Number(e.target.value))}
                    />
                    <IconButton color="error" onClick={() => handleRemoveRate(index)}>
                        <DeleteIcon />
                    </IconButton>
                    </Box>
                ))}
                </Stack>

                <Button 
                startIcon={<AddCircleOutlineIcon />} 
                onClick={handleAddRate} 
                sx={{ mt: 2 }}
                >
                Add Usage Rule
                </Button>
            </Box>

            {/* Submit Button */}
            <Button 
                variant="contained" 
                size="large" 
                onClick={handleSubmit}
                disableElevation
            >
                Save Pricing Plan
            </Button>
            </Stack>
        </CardContent>
        </Card>
    );
};

export default PlanBuilder;
