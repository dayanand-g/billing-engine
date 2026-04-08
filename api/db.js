const { sql } = require('@vercel/postgres');

// This is exactly how you'll fetch plans from the live database
async function getPlans() {
  const { rows } = await sql`SELECT * FROM plans;`;
  return rows;
}

// This acts as our mock database for the prototype.
// const db = {
//   // Stores the pricing rules created by the Finance Team
//   plans: [
//     {
//       id: "plan_gold_001",
//       name: "Gold Enterprise Plan",
//       basePrice: 500.00,
//       usageRates: [
//         { metric: "API_CALL", ratePerUnit: 0.10 },
//         { metric: "STORAGE_GB", ratePerUnit: 0.50 }
//       ]
//     }
//   ], 
  
//   // Stores our mock customers
//   customers: [
//     { id: "cust_001", name: "Acme Corp", planId: "plan_gold_001" },
//     { id: "cust_002", name: "Globex Inc", planId: null }
//   ],
  
//   // Stores the raw usage events (example: "Acme Corp made 1 API call")
//   usageEvents: [] 
// };

module.exports = { sql, getPlans };;