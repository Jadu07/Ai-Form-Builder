#!/bin/bash

echo "🧪 Testing AI Form Generator..."

# Test backend
echo "📦 Testing backend..."
cd backend
if node -e "require('./lib/supabase'); require('./lib/prisma'); console.log('✅ Backend dependencies OK');" 2>/dev/null; then
    echo "✅ Backend setup is working"
else
    echo "❌ Backend has issues"
    exit 1
fi

# Test frontend build
echo "📦 Testing frontend build..."
cd ../frontend
if npm run build >/dev/null 2>&1; then
    echo "✅ Frontend builds successfully"
else
    echo "❌ Frontend build failed"
    exit 1
fi

echo ""
echo "🎉 All tests passed! The application is ready to run."
echo ""
echo "To start the application:"
echo "1. Backend:  cd backend && npm run dev"
echo "2. Frontend: cd frontend && npm run dev"
echo ""
echo "🌐 Access at:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:4000"



