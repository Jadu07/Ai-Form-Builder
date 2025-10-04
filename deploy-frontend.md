# Deploy Frontend to Render

Your backend is successfully deployed at: `https://form-generator-backend-kb06.onrender.com/`

## Frontend Deployment Steps

### 1. Go to Render Dashboard
- Visit [render.com](https://render.com)
- Sign in to your account

### 2. Create New Static Site
- Click "New +" → "Static Site"
- Connect your GitHub repository (same one as backend)

### 3. Configure Frontend Service
- **Name**: `form-generator-frontend`
- **Environment**: `Static`
- **Region**: Same as your backend
- **Branch**: `main`
- **Root Directory**: `frontend`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`

### 4. Set Environment Variables
```
VITE_SUPABASE_URL=https://wolfxvnbhknziwhbfmgl.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndvbGZ4dm5iaGtueml3aGJmbWdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1NjQ1NTcsImV4cCI6MjA3NTE0MDU1N30.zskzgKOA7tZry793B2KleFnmJM8oNp42D5pmOX3uKmk
VITE_API_URL=https://form-generator-backend-kb06.onrender.com
```

### 5. Deploy
- Click "Create Static Site"
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

## Expected Results
- **Backend**: `https://form-generator-backend-kb06.onrender.com/` ✅ (Working)
- **Frontend**: `https://form-generator-frontend.onrender.com` (After deployment)

## Troubleshooting
If you encounter CORS errors:
1. Make sure `FRONTEND_URL` is set in backend environment variables
2. Wait for backend to redeploy after adding the environment variable
3. Clear your browser cache and try again
