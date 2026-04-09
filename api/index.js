const express = require('express');
const cors = require('cors');
const { sql } = require('./db'); 

const app = express();

app.use(cors()); 
app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Nexus Billing Engine is live on Vercel.' });
});

// 1. Create a new Pricing Plan (SQL Version)
app.post('/api/plans', async (req, res) => {
  const { name, basePrice, usageRates } = req.body;

  if (!name || typeof basePrice !== 'number' || !Array.isArray(usageRates)) {
    return res.status(400).json({ error: 'Invalid data.' });
  }

  try {
    // We store the array as JSONB in Postgres
    const result = await sql`
      INSERT INTO plans (name, base_price, usage_rates)
      VALUES (${name}, ${basePrice}, ${JSON.stringify(usageRates)})
      RETURNING *
    `;
    
    res.status(201).json({ 
      message: 'Plan created successfully', 
      plan: result[0] 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Get all Pricing Plans (SQL Version)
app.get('/api/plans', async (req, res) => {
  try {
    const plans = await sql`SELECT * FROM plans ORDER BY created_at DESC`;
    res.json(plans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Ingest Usage Data (SQL Version)
app.post('/api/usage', async (req, res) => {
  const { customerId, metric, quantity } = req.body;

  if (!customerId || !metric || typeof quantity !== 'number') {
    return res.status(400).json({ error: 'Invalid payload.' });
  }

  try {
    const result = await sql`
      INSERT INTO usage_events (customer_id, metric, quantity)
      VALUES (${customerId}, ${metric}, ${quantity})
      RETURNING *
    `;
    res.status(201).json({ message: 'Usage recorded', event: result[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Generate Invoice (SQL Version)
app.get('/api/customers/:customerId/invoice', async (req, res) => {
  const { customerId } = req.params;

  try {
      // Fetch Customer and Plan with a JOIN
      const customerData = await sql`
      SELECT c.name as customer_name, p.name as plan_name, p.base_price, p.usage_rates
      FROM customers c
      JOIN plans p ON c.plan_id = p.id
      WHERE c.id = ${customerId}
    `;

    if (customerData.length === 0) return res.status(404).json({ error: 'Customer not found' });
    const customer = customerData[0];

      // Aggregate usage in SQL
      const usageData = await sql`
      SELECT metric, SUM(quantity) as total_units
      FROM usage_events
      WHERE customer_id = ${customerId}
      GROUP BY metric
    `;

    let totalUsageCost = 0;
    const breakdown = customer.usage_rates.map(rate => {
      const usage = usageData.find(u => u.metric === rate.metric);
      const units = usage ? parseInt(usage.total_units) : 0;
      const subtotal = units * parseFloat(rate.ratePerUnit);
      totalUsageCost += subtotal;
      return { metric: rate.metric, totalUnits: units, rate: rate.ratePerUnit, subtotal };
    });

    res.json({
      customerName: customer.customer_name,
      planName: customer.plan_name,
      billingPeriod: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      baseSubscriptionFee: parseFloat(customer.base_price),
      usageBreakdown: breakdown,
      totalAmountDue: parseFloat(customer.base_price) + totalUsageCost
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = app;