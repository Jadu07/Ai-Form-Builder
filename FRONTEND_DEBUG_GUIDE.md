# Frontend API Connection Debug Guide

## Issue: Frontend failing to fetch forms in production

### Step 1: Check Your Frontend URL
First, tell me your actual frontend URL from Render. It should look like:
- `https://form-generator-frontend.onrender.com` or
- `https://form-generator-frontend-xxxxx.onrender.com`

### Step 2: Update Backend CORS
Once you have your frontend URL, update the backend environment variables:

1. Go to your backend service in Render
2. Go to "Environment" tab
3. Add/Update this environment variable:
   ```
   FRONTEND_URL=https://your-actual-frontend-url.onrender.com
   ```
4. Save changes (backend will auto-redeploy)

### Step 3: Check Browser Console
1. Open your frontend URL in browser
2. Open Developer Tools (F12)
3. Go to Console tab
4. Look for:
   - `API_URL: https://form-generator-backend-kb06.onrender.com` (should show correct URL)
   - Any error messages starting with "API Error:"

### Step 4: Check Network Tab
1. In Developer Tools, go to Network tab
2. Try to create a form or load forms
3. Look for failed requests to `/api/forms`
4. Check the status code and error message

### Step 5: Test Backend Directly
Test these URLs in your browser:
1. `https://form-generator-backend-kb06.onrender.com/api/health` (should return OK)
2. `https://form-generator-backend-kb06.onrender.com/api/forms` (should return 401 - that's expected without auth)

### Common Issues & Solutions:

#### Issue 1: CORS Error
**Symptoms**: Console shows "CORS policy" error
**Solution**: 
- Make sure `FRONTEND_URL` is set in backend environment variables
- Wait for backend to redeploy after adding the variable

#### Issue 2: 401 Unauthorized
**Symptoms**: API calls return 401 status
**Solution**: 
- Check if user is logged in
- Check if Supabase authentication is working
- Verify Supabase environment variables in frontend

#### Issue 3: Network Error
**Symptoms**: "Failed to fetch" or network error
**Solution**:
- Check if backend URL is correct
- Verify backend is running and accessible
- Check if there are any firewall issues

#### Issue 4: Wrong API URL
**Symptoms**: Console shows wrong API_URL
**Solution**:
- Check frontend environment variables in Render
- Make sure `VITE_API_URL` is set correctly

### Debug Information Needed:
Please provide:
1. Your frontend URL
2. Any console errors from browser
3. Network tab errors
4. Backend logs (if accessible)

### Quick Fix Commands:
If you need to update environment variables:

**Backend (in Render dashboard):**
```
FRONTEND_URL=https://your-frontend-url.onrender.com
```

**Frontend (in Render dashboard):**
```
VITE_API_URL=https://form-generator-backend-kb06.onrender.com
VITE_SUPABASE_URL=https://wolfxvnbhknziwhbfmgl.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndvbGZ4dm5iaGtueml3aGJmbWdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1NjQ1NTcsImV4cCI6MjA3NTE0MDU1N30.zskzgKOA7tZry793B2KleFnmJM8oNp42D5pmOX3uKmk
```

### Next Steps:
1. Get your frontend URL
2. Update backend CORS with that URL
3. Check browser console for errors
4. Let me know what errors you see
