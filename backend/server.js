const express = require('express');
const path = require('path');
const https = require('https');
// Load environment variables from .env (optional)
try { require('dotenv').config(); } catch (e) { /* dotenv optional */ }

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '..', 'public'), { index: 'index.html' }));

// lightweight health check
app.get('/health', (req, res) => res.send('OK'));

// Proxy endpoint to fetch stock data from Marketstack securely using server-side API key
app.get('/api/stock', (req, res) => {
  const symbol = (req.query.symbol || '').trim().toUpperCase();
  if (!symbol) return res.status(400).json({ error: 'Missing symbol query parameter' });

  const apiKey = process.env.MARKETSTACK_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server missing MARKETSTACK_API_KEY environment variable' });
  }

  // Marketstack EOD endpoint - limit to 10 days
  const path = `/v1/eod?access_key=${encodeURIComponent(apiKey)}&symbols=${encodeURIComponent(symbol)}&limit=10`;
  const options = {
    hostname: 'api.marketstack.com',
    port: 443,
    path,
    method: 'GET'
  };

  const proxyReq = https.request(options, (proxyRes) => {
    let body = '';
    proxyRes.on('data', (chunk) => (body += chunk));
    proxyRes.on('end', () => {
      try {
        const parsed = JSON.parse(body);
        res.json(parsed);
      } catch (err) {
        res.status(502).json({ error: 'Invalid response from Marketstack', details: body });
      }
    });
  });

  proxyReq.on('error', (err) => {
    res.status(502).json({ error: 'Failed to reach Marketstack', details: err.message });
  });

  proxyReq.end();
});

app.listen(port, () => {
  console.log(`Local server running at http://localhost:${port}`);
});
