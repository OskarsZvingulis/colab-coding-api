# Colab_Coding API demo

Colaborators

Oskars Zvingulis
Gints Turlajs
Raimonds Prieditis

Small demo project that shows how to call the stockdata.org API. The frontend files live at the repository root:

- `index.html`
- `styles.css`
- `script.js`

Backend server files (Express) are under the `backend/` folder. To run the local server:

```bash
cd backend
npm install    # first time only
npm start
```

Or run dev mode (auto-reload):

```bash
npm run dev
```

Project layout keeps the frontend files in the root so you can open `index.html` directly or serve it via the local Node server.

How to push to GitHub

1. Create a GitHub repository (via the website or `gh repo create`).
2. Add the remote and push:

```bash
git remote add origin git@github.com:<your-username>/<repo-name>.git
git branch -M main
git push -u origin main
```

If you prefer, use HTTPS remote URL instead of SSH.
