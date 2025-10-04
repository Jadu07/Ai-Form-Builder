# Deploy Frontend as Web Service on Render

Your backend is successfully deployed at: `https://form-generator-backend-kb06.onrender.com/`

## Frontend Web Service Deployment Steps

### 1. Go to Render Dashboard
- Visit [render.com](https://render.com)
- Sign in to your account

### 2. Create New Web Service (Not Static Site)
- Click "New +" → "Web Service"
- Connect your GitHub repository (same one as backend)

### 3. Configure Frontend Web Service
- **Name**: `form-generator-frontend`
- **Environment**: `Node`
- **Region**: Same as your backend
- **Branch**: `main`
- **Root Directory**: `frontend`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

### 4. Set Environment Variables
```
NODE_ENV=production
PORT=10000
VITE_SUPABASE_URL=https://wolfxvnbhknziwhbfmgl.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndvbGZ4dm5iaGtueml3aGJmbWdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1NjQ1NTcsImV4cCI6MjA3NTE0MDU1N30.zskzgKOA7tZry793B2KleFnmJM8oNp42D5pmOX3uKmk
VITE_API_URL=https://form-generator-backend-kb06.onrender.com
```

### 5. Deploy
- Click "Create Web Service"
- Wait for deployment to complete
- Note your frontend URL (e.g., `https://form-generator-frontend.onrender.com`)

### 6. Update Backend CORS (Important!)
After you get your frontend URL, you need to update the backend:

1. Go to your backend service in Render
2. Go to "Environment" tab
3. Add this environment variable:
   ```
   FRONTEND_URL=https://your-actual-frontend-url.onrender.com
   ```
4. Click "Save Changes"
5. The backend will automatically redeploy

### 7. Test Your Application
1. Visit your frontend URL
2. Create an account
3. Test form creation
4. Verify everything works!

## What's Different from Static Site Deployment?

### Web Service Benefits:
- ✅ **Better Performance**: Express server handles routing
- ✅ **SPA Support**: Proper handling of React Router
- ✅ **Custom Headers**: Can add security headers
- ✅ **API Proxying**: Can proxy API calls if needed
- ✅ **Better Caching**: More control over caching strategies

### Technical Details:
- **Server**: Express.js server serving the built React app
- **Routing**: All routes are handled by React Router
- **Static Files**: Served from `/dist` directory
- **Port**: Uses `process.env.PORT` (Render sets this automatically)

## Expected Results
- **Backend**: `https://form-generator-backend-kb06.onrender.com/` ✅ (Working)
- **Frontend**: `https://form-generator-frontend.onrender.com` (After deployment)

## Troubleshooting

### Common Issues:

1. **Build Failures**
   - Check that all dependencies are installed
   - Verify the build command runs successfully locally

2. **CORS Errors**
   - Make sure `FRONTEND_URL` is set in backend environment variables
   - Wait for backend to redeploy after adding the environment variable

3. **Routing Issues**
   - The Express server handles all routes and serves `index.html`
   - React Router handles client-side routing

4. **Environment Variables**
   - Make sure all `VITE_*` variables are set correctly
   - Check that `VITE_API_URL` points to your backend

### Monitoring:
- **Logs**: Check Render dashboard for server logs
- **Performance**: Monitor response times in Render dashboard
- **Errors**: Check browser console for client-side errors

---

Your AI Form Generator will be fully functional as a web service! 🚀

**Backend**: `https://form-generator-backend-kb06.onrender.com/` ✅
**Frontend**: `https://form-generator-frontend.onrender.com` (After deployment)
