require('dotenv').config();
if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is missing. Copy .env.example to .env and configure it.');
const express = require('express');
const cors = require('cors');
const app = express();
const port = Number(process.env.PORT || 5000);
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.get('/api/health', (_, res) => res.json({ message: 'Job Portal API is running' }));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/companies', require('./routes/companyRoutes'));
app.use('/api/resumes', require('./routes/resumeRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use((req, res) => res.status(404).json({ message: 'API route not found' }));
app.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ message: 'Resume must be 5 MB or smaller' });
  if (err.message?.includes('Only PDF')) return res.status(400).json({ message: err.message });
  console.error(err);
  res.status(500).json({ message: 'Server error. Please try again.' });
});
const server = app.listen(port, () => console.log(`Job Portal API running at http://localhost:${port}`));
server.on('error', error => {
  if (error.code === 'EADDRINUSE') console.error(`Port ${port} is already in use. Stop the other server or change PORT in .env.`);
  else console.error('Unable to start server:', error.message);
  process.exitCode = 1;
});
