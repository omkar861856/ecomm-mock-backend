#!/bin/bash

echo "🍃 Setting up MongoDB integration for E-commerce API"
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Install MongoDB dependencies
echo "📦 Installing MongoDB dependencies..."
npm install mongoose dotenv

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
# MongoDB Configuration
MONGODB_URI=mongodb+srv://ecomm_mock:QUSAEpWfeg1aSWAA@cluster0.wttchje.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0

# Database Configuration
DB_NAME=ecommerce
NODE_ENV=development

# API Configuration
PORT=3000

# CORS Configuration
CORS_ORIGIN=*

# Rate Limiting Configuration
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=1000
EOF
    echo "✅ .env file created"
else
    echo "⚠️  .env file already exists, skipping creation"
fi

# Test MongoDB connection
echo "🔌 Testing MongoDB connection..."
node -e "
const mongoose = require('mongoose');
const mongoURI = 'mongodb+srv://ecomm_mock:QUSAEpWfeg1aSWAA@cluster0.wttchje.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ MongoDB connection successful');
  process.exit(0);
}).catch((error) => {
  console.log('❌ MongoDB connection failed:', error.message);
  process.exit(1);
});
"

if [ $? -eq 0 ]; then
    echo "✅ MongoDB connection test passed"
else
    echo "❌ MongoDB connection test failed"
    echo "Please check your MongoDB Atlas configuration"
    exit 1
fi

# Seed the database
echo "🌱 Seeding MongoDB database..."
npm run seed-mongo

if [ $? -eq 0 ]; then
    echo "✅ Database seeded successfully"
else
    echo "❌ Database seeding failed"
    exit 1
fi

echo ""
echo "🎉 MongoDB setup completed successfully!"
echo ""
echo "📊 What was created:"
echo "   - MongoDB connection configuration"
echo "   - Mongoose schemas for all entities"
echo "   - Sample data (products, users, orders, etc.)"
echo "   - MongoDB-based controllers"
echo ""
echo "🚀 Next steps:"
echo "   1. Start the server: npm start"
echo "   2. Test the API endpoints"
echo "   3. Check MongoDB Atlas for your data"
echo ""
echo "📚 Documentation:"
echo "   - Read MONGODB_SETUP.md for detailed information"
echo "   - Check the Swagger docs at /api-docs"
echo ""
echo "🔗 MongoDB Atlas Dashboard:"
echo "   https://cloud.mongodb.com/"
echo ""
