import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import url from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'dist/public')));

// Proxy pour les API
app.all('/api/*', (req, res) => {
  const backendUrl = new URL(`http://localhost:8000${req.originalUrl}`);
  
  const options = {
    hostname: backendUrl.hostname,
    port: backendUrl.port,
    path: backendUrl.pathname + backendUrl.search,
    method: req.method,
    headers: {
      ...req.headers,
      'host': 'localhost:8000'
    }
  };

  console.log(`Proxying ${req.method} ${options.path} to backend`);

  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });

  proxyReq.on('error', (err) => {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Proxy error', details: err.message });
  });

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    req.pipe(proxyReq);
  } else {
    proxyReq.end();
  }
});

// Fallback pour les routes React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/public/index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
