const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from parent directory (project root contains index.html)
app.use(express.static(path.join(__dirname, '..')));

// lightweight health check
app.get('/health', (req, res) => res.send('OK'));

app.listen(port, () => {
  console.log(`Local server running at http://localhost:${port}`);
});
