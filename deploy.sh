#!/bin/bash

# Vercel Deployment Script
echo "🚀 Starting Vercel deployment process..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed. Installing..."
    npm install -g vercel
fi

# Check if user is logged in to Vercel
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please login to Vercel first:"
    vercel login
fi

# Deploy to Vercel
echo "📦 Deploying to Vercel..."
vercel --prod

# Get the deployment URL
DEPLOYMENT_URL=$(vercel ls --json | jq -r '.[0].url' 2>/dev/null || echo "https://your-app-name.vercel.app")

echo "✅ Deployment completed!"
echo "🌐 Your API is available at: $DEPLOYMENT_URL"
echo "📚 API Documentation: $DEPLOYMENT_URL/api-docs"
echo "❤️  Health Check: $DEPLOYMENT_URL/health"

# Update n8n-tools.json with the new URL
echo "🔄 Updating n8n-tools.json with new URL..."
node update-urls.js "$DEPLOYMENT_URL"

echo "🎉 Deployment process completed!"
echo "📝 Don't forget to update your n8n workflows with the new URLs."
