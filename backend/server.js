require('dotenv').config({ path: '.env' });

const express = require('express');
const cors = require('cors');
const { db } = require('./db');

const loginRoutes = require('./routes/login');
const boneEditorRoutes = require('./routes/bone-editor');
const dashboardRoutes = require('./routes/dashboard');
const inventoryRoutes = require('./routes/inventory');
const metricsRoutes = require('./routes/metrics');
const miscRoutes = require('./routes/misc');
const verifyEmailRoutes = require('./routes/verify-email');
const { useCrudRoutes } = require('./routes/crud');

const boneDetailsRoutes = require('./routes/boneDetails');  
const boneViewerRoutes = require('./routes/boneViewer');    

const app = express();
app.use(cors());
app.use(express.json());

app.use('/', [
  loginRoutes,
  boneEditorRoutes,
  inventoryRoutes,
  metricsRoutes,
  dashboardRoutes,
  miscRoutes,
  verifyEmailRoutes,
  boneDetailsRoutes,   
  boneViewerRoutes,    
]);

useCrudRoutes(app);

const port = process.env.PORT || 7286;

const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
server.on('error', (err) => {
  if (err && err.code === 'EADDRINUSE') {
    console.error(
      `Port ${port} is already in use.` +
      `→ Stop the other process: lsof -i :${port} ; kill -9 <pid>\n` +
      `→ Or start on another port: PORT=${Number(port) + 1} node server.js\n`
    );
  } else {
    console.error(err);
  }
});
