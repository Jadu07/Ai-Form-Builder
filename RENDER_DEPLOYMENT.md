# Deploy to Render - Complete Guide

This guide will help you deploy your AI Form Generator to Render.

## Prerequisites

- GitHub repository with your code
- Supabase project set up
- OpenRouter API key (optional - fallback will work)
- Render account

## Step 1: Prepare Your Repository

1. **Push your code to GitHub** (if not already done)
   ```bash
   git add .
   git commit -m "Prepare for Render deployment"
   git push origin main
   ```

## Step 2: Deploy Backend to Render

1. **Go to Render Dashboard**
   - Visit [render.com](https://render.com)
   - Sign up/Login with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select your repository

3. **Configure Backend Service**
   - **Name**: `form-generator-backend`
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npx prisma generate`
   - **Start Command**: `npm start`

4. **Set Environment Variables**
   ```
   NODE_ENV=production
   PORT=10000
   SUPABASE_URL=https://wolfxvnbhknziwhbfmgl.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndvbGZ4dm5iaGtueml3aGJmbWdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1NjQ1NTcsImV4cCI6MjA3NTE0MDU1N30.zskzgKOA7tZry793B2KleFnmJM8oNp42D5pmOX3uKmk
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndvbGZ4dm5iaGtueml3aGJmbWdsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTU2NDU1NywiZXhwIjoyMDc1MTQwNTU3fQ.maKZNAJbSzBwL0HJ-8SEWIUqJSiXtxQR3Zruo3-ROxM
   OPENROUTER_API_KEY=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
   DATABASE_URL=postgresql://postgres.wolfxvnbhknziwhbfmgl:Yash*123@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true
   DIRECT_URL=postgresql://postgres.wolfxvnbhknziwhbfmgl:Yash*123@aws-1-ap-south-1.pooler.supabase.com:5432/postgres
   ```

5. **Deploy Backend**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note the backend URL (e.g., `https://form-generator-backend.onrender.com`)

## Step 3: Deploy Frontend to Render

1. **Create New Static Site**
   - Click "New +" → "Static Site"
   - Connect your GitHub repository (same one)

2. **Configure Frontend Service**
   - **Name**: `form-generator-frontend`
   - **Environment**: `Static`
   - **Region**: Same as backend
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

3. **Set Environment Variables**
   ```
   VITE_SUPABASE_URL=https://wolfxvnbhknziwhbfmgl.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndvbGZ4dm5iaGtueml3aGJmbWdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1NjQ1NTcsImV4cCI6MjA3NTE0MDU1N30.zskzgKOA7tZry793B2KleFnmJM8oNp42D5pmOX3uKmk
   VITE_API_URL=https://form-generator-backend-kb06.onrender.com
   ```

4. **Deploy Frontend**
   - Click "Create Static Site"
   - Wait for deployment to complete
   - Note the frontend URL (e.g., `https://form-generator-frontend.onrender.com`)

## Step 4: Update CORS Settings

1. **Update Backend CORS**
   - Go to your backend service in Render
   - Add environment variable:
   ```
   FRONTEND_URL=https://form-generator-frontend.onrender.com
   ```
   - Redeploy the backend

## Step 5: Test Your Deployment

1. **Visit your frontend URL**
2. **Create an account** (if not already done)
3. **Test form creation**:
   - Go to "Create New Form"
   - Enter a description like "Create a contact form with name and email"
   - Click "Generate Form"
   - Verify the form is created successfully

## Step 6: Database Setup (if needed)

1. **Run Prisma migrations** (if database schema changed):
   ```bash
   cd backend
   npx prisma db push
   ```

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure `FRONTEND_URL` is set in backend environment variables
   - Check that frontend URL is correct

2. **Build Failures**
   - Check build logs in Render dashboard
   - Ensure all dependencies are in package.json

3. **Database Connection Issues**
   - Verify DATABASE_URL is correct
   - Check Supabase connection settings

4. **Environment Variables**
   - Double-check all environment variables are set correctly
   - Ensure no typos in variable names

### Monitoring

- **Backend**: Monitor logs in Render dashboard
- **Frontend**: Monitor deployments in Render dashboard
- **Database**: Monitor usage in Supabase dashboard

## Custom Domain (Optional)

1. **Add Custom Domain**
   - Go to your service settings
   - Add your custom domain
   - Update DNS records as instructed

2. **Update Environment Variables**
   - Update `FRONTEND_URL` in backend
   - Update `VITE_API_URL` in frontend

## Security Notes

- Never commit API keys to your repository
- Use environment variables for all sensitive data
- Regularly rotate your API keys
- Monitor your usage and costs

---

Your AI Form Generator is now live on Render! 🎉

**Frontend URL**: `https://form-generator-frontend.onrender.com`
**Backend URL**: `https://form-generator-backend.onrender.com`
