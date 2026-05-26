require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const { envSnapshot } = require('./src/config/env');
const { requestAudit } = require('./src/middleware/requestAudit');
const { errorHandler } = require('./src/middleware/errorHandler');
const publicRoutes = require('./src/routes/public.routes');
const healthRoutes = require('./src/routes/health.routes');
const systemRoutes = require('./src/routes/system.routes');
const orchestratorRoutes = require('./src/routes/orchestrator.routes');
const usageRoutes = require('./src/routes/usage.routes');
const dashboardRoutes = require('./src/routes/dashboard.routes');
const entryRoutes = require('./src/routes/entry.routes');
const addonsRoutes = require('./src/routes/addons.routes');
const reviewbookRoutes = require('./src/routes/reviewbook.routes');
const gatesRoutes = require('./src/routes/gates.routes');
const artifactsRoutes = require('./src/routes/artifacts.routes');
const legalRoutes = require('./src/routes/legal.routes');
const localizationRoutes = require('./src/routes/localization.routes');
const seoRoutes = require('./src/routes/seo.routes');
const trustRoutes = require('./src/routes/trust.routes');

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || false }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(requestAudit);

app.use('/', publicRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/system', systemRoutes);
app.use('/api/orchestrator', orchestratorRoutes);
app.use('/api/usage', usageRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/entry', entryRoutes);
app.use('/api/addons', addonsRoutes);
app.use('/api/reviewbook', reviewbookRoutes);
app.use('/api/gates', gatesRoutes);
app.use('/api/artifacts', artifactsRoutes);
app.use('/api/legal', legalRoutes);
app.use('/api/localization', localizationRoutes);
app.use('/api/seo', seoRoutes);
app.use('/api/trust', trustRoutes);

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
