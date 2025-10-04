#!/bin/bash

echo "🚀 Deploying AI Form Generator to Render..."
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not initialized. Please run:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    echo "   git remote add origin <your-github-repo-url>"
    echo "   git push -u origin main"
    exit 1
fi

# Check if there are uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 Uncommitted changes detected. Committing them..."
    git add .
    git commit -m "Prepare for Render deployment - $(date)"
fi

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push origin main

echo ""
echo "✅ Code pushed to GitHub successfully!"
echo ""
echo "🔧 Next steps:"
echo "1. Go to https://render.com"
echo "2. Sign up/Login with GitHub"
echo "3. Follow the deployment guide in RENDER_DEPLOYMENT.md"
echo ""
echo "📋 Quick deployment checklist:"
echo "   □ Deploy backend service"
echo "   □ Set environment variables"
echo "   □ Deploy frontend service"
echo "   □ Update CORS settings"
echo "   □ Test the application"
echo ""
echo "📖 For detailed instructions, see: RENDER_DEPLOYMENT.md"
