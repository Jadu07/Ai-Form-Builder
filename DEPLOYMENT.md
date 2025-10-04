# Deployment Guide

This guide will help you deploy the AI Form Generator to production.

## Prerequisites

- GitHub repository with your code
- Supabase project set up
- OpenRouter API key
- Railway/Render account (for backend)
- Vercel account (for frontend)

## Backend Deployment (Railway)

1. **Connect Repository**
   - Go to [Railway](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository

2. **Configure Environment Variables**
   ```
   PORT=4000
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   OPENROUTER_API_KEY=your_openrouter_api_key
   DATABASE_URL=your_database_url
   DIRECT_URL=your_direct_database_url
   NODE_ENV=production
   ```

3. **Set Build Settings**
   - Root Directory: `backend`
   - Build Command: `npm install && npx prisma generate`
   - Start Command: `npm start`

4. **Deploy**
   - Railway will automatically deploy
   - Note the generated URL (e.g., `https://your-app.railway.app`)

## Frontend Deployment (Vercel)

1. **Connect Repository**
   - Go to [Vercel](https://vercel.com)
   - Click "New Project" → Import from GitHub
   - Select your repository

2. **Configure Build Settings**
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Set Environment Variables**
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_API_URL=https://your-backend-url.railway.app
   ```

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your frontend

## Database Setup

1. **Run Migrations**
   ```bash
   cd backend
   npx prisma db push
   ```

2. **Verify Tables**
   - Check Supabase dashboard
   - Ensure all tables are created

## Post-Deployment

1. **Update CORS Settings**
   - In your backend, update CORS origins to include your frontend URL

2. **Test the Application**
   - Visit your frontend URL
   - Create an account
   - Generate a test form
   - Verify all features work

3. **Set up Custom Domain (Optional)**
   - Configure custom domains in Vercel/Railway
   - Update environment variables accordingly

## Monitoring

- **Backend**: Monitor logs in Railway dashboard
- **Frontend**: Monitor deployments in Vercel dashboard
- **Database**: Monitor usage in Supabase dashboard

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Update CORS origins in backend
   - Check environment variables

2. **Database Connection Issues**
   - Verify DATABASE_URL is correct
   - Check Supabase connection settings

3. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed

### Support

- Check Railway/Vercel documentation
- Review Supabase setup guide
- Open GitHub issues for bugs

---

Your AI Form Generator is now live! 🎉


