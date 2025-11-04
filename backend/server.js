require('dotenv').config({ path: '.env.production' });
const express = require('express');
const cors = require('cors');
const {db} = require('./db');
const loginRoutes = require('./routes/login');
const boneRoutes = require('./routes/bones');
const inventoryRoutes = require('./routes/inventory');
const metricsRoutes = require('./routes/metrics');
const miscRoutes = require('./routes/misc');
const verifyEmailRoutes = require('./routes/verify-email');
const { useCrudRoutes } = require('./routes/crud');
const { applyRateLimit } = require('./middleware/rate-limit');

const app = express();
app.use(cors());
app.use(express.json());

// Shared helpers
//app.use(applyRateLimit);

// Attach routes
app.use('/', [
  loginRoutes,
  boneRoutes,
  inventoryRoutes,
  metricsRoutes,
  miscRoutes,
  verifyEmailRoutes
]);

useCrudRoutes(app); // this one dynamically registers tables

const port = 7286;
// -------------------- START SERVER --------------------
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});