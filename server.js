require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const { envSnapshot } = require('./src/config/env');
const { requestAudit } = require('./src/middleware/requestAudit');
const { errorHandler } = require('./src/middleware/errorHandler');
const healthRoutes = require('./src/routes/health.routes');
const systemRoutes = require('./src/routes/system.routes');
const usageRoutes = require('./src/routes/usage.routes');
const dashboardRoutes = require('./src/routes/dashboard.routes');
const entryRoutes = require('./src/routes/entry.routes');

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || false }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(requestAudit);

app.use('/api/health', healthRoutes);
app.use('/api/system', systemRoutes);
app.use('/api/usage', usageRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/entry', entryRoutes);

app.use((req, res) => {
  res.status(404).json({
    status: 'not_found',
    path: req.path,
    rule: 'No public or protected route is exposed before USTAV validation.'
  });
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`DaniniHub runtime active on port ${port}`);
  console.log(JSON.stringify({ env: envSnapshot() }));
});
