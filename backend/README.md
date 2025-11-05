# Local server (backend)

Server files and Node dependencies are in the `backend/` folder. The project root contains the frontend files: `index.html`, `styles.css`, and `script.js`.

How to run (from project root)

1. Start server (run from the `backend` folder):

```bash
cd backend
npm install    # only required the first time
npm start
```

Then open: http://localhost:3000

Health check:

```bash
curl http://localhost:3000/health
# returns: OK
```

Developer (auto-reload) mode

```bash
cd backend
npm run dev
```

Notes
- `server.js` serves static files from the parent directory so the frontend files remain in the project root.
- `node_modules/`, `package.json`, and `package-lock.json` are located in `backend/` now.
