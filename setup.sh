#!/bin/bash

echo "🚀 Setting up AI Form Generator..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

# Generate Prisma client
echo "🔧 Generating Prisma client..."
cd ../backend
npx prisma generate

if [ $? -ne 0 ]; then
    echo "❌ Failed to generate Prisma client"
    exit 1
fi

echo "✅ Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Set up your environment variables in backend/.env and frontend/.env"
echo "2. Run 'npx prisma db push' in the backend directory to set up the database"
echo "3. Start the backend: cd backend && npm run dev"
echo "4. Start the frontend: cd frontend && npm run dev"
echo ""
echo "🌐 Your app will be available at:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:4000"
echo ""
echo "🎉 Happy coding!"


