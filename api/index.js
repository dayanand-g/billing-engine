const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const db = require('./db');

const app = express();
//const PORT = 3000;

// Middleware
app.use(cors()); 
app.use(express.json());

// Routes
// Health Check: Just to make sure the server is alive
app.get('/api/health', (req, res) => {
  res.json({ status: 'Billing Engine is running smoothly.' });
});

// 1. Create a new Pricing Plan
app.post('/api/plans', (req, res) => {
  const { name, basePrice, usageRates } = req.body;

  // Basic validation: Ensure the frontend sends the right data types
  if (!name || typeof basePrice !== 'number' || !Array.isArray(usageRates)) {
    return res.status(400).json({ 
      error: 'Invalid data. Required: name (string), basePrice (number), usageRates (array)' 
    });
  }

  // Construct the new plan object
  const newPlan = {
    id: crypto.randomUUID(), 
    name,
    basePrice, // from frontend ex, $50/month base fee
    usageRates // from frontend ex, [{ metric: "API_CALL", ratePerUnit: 0.05 }]
  };

  // Save to our in-memory database
  db.plans.push(newPlan);
  
  res.status(201).json({ 
    message: 'Plan created successfully', 
    plan: newPlan 
  });
});

// 2. Get all Pricing Plans
app.get('/api/plans', (req, res) => {
  res.json(db.plans);
});

// 3. Subscribe a Customer to a Plan
app.post('/api/customers/:customerId/subscribe', (req, res) => {
  const { customerId } = req.params;
  const { planId } = req.body;

  // Find the customer in our mock DB
  const customer = db.customers.find(c => c.id === customerId);
  const plan = db.plans.find(p => p.id === planId);

  if (!customer) return res.status(404).json({ error: 'Customer not found' });
  if (!plan) return res.status(404).json({ error: 'Plan not found' });

  // Update the customer's plan
  customer.planId = planId;

  res.json({ 
    message: `${customer.name} successfully subscribed to ${plan.name}`, 
    customer 
  });
});

// 4. Ingest Usage Data (The Metering API)
app.post('/api/usage', (req, res) => {
  const { customerId, metric, quantity } = req.body;

  if (!customerId || !metric || typeof quantity !== 'number') {
    return res.status(400).json({ 
      error: 'Invalid payload. Required: customerId, metric, quantity (number)' 
    });
  }

  // Record the event with a timestamp
  const usageEvent = {
    id: crypto.randomUUID(),
    customerId,
    metric,
    quantity,
    timestamp: new Date().toISOString()
  };

  db.usageEvents.push(usageEvent);

  res.status(201).json({ 
    message: 'Usage recorded successfully', 
    event: usageEvent 
  });
});

// 5. Generate Invoice (The Calculation Engine)
app.get('/api/customers/:customerId/invoice', (req, res) => {
  const { customerId } = req.params;

  // 1. Get Customer & Plan
  const customer = db.customers.find(c => c.id === customerId);
  if (!customer || !customer.planId) {
    return res.status(404).json({ error: 'Customer or active subscription not found' });
  }

  const plan = db.plans.find(p => p.id === customer.planId);

  // 2. Filter usage for This customer
  const customerUsage = db.usageEvents.filter(e => e.customerId === customerId);

  // 3. Calculate Usage Costs
  let totalUsageCost = 0;
  const breakdown = [];

  plan.usageRates.forEach(rate => {
    // Sum up all units for this specific metric (e.g., all API_CALLs)
    const totalUnits = customerUsage
      .filter(e => e.metric === rate.metric)
      .reduce((sum, e) => sum + e.quantity, 0);

    const costForMetric = totalUnits * rate.ratePerUnit;
    totalUsageCost += costForMetric;

    breakdown.push({
      metric: rate.metric,
      totalUnits,
      rate: rate.ratePerUnit,
      subtotal: costForMetric
    });
  });

  // 4. Final Calculation
  const totalAmount = plan.basePrice + totalUsageCost;

  res.json({
    customerName: customer.name,
    planName: plan.name,
    billingPeriod: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    baseSubscriptionFee: plan.basePrice,
    usageBreakdown: breakdown,
    totalAmountDue: totalAmount
  });
});

//  Server listens on the specified port
// app.listen(PORT, () => {
//   console.log(`🚀 Zenskar Billing Engine running on http://localhost:${PORT}`);
// });

module.exports = app;