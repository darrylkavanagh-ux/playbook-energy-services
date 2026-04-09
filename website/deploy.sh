#!/bin/bash

# FoxLite Forensics - One-Click Deploy Script
# This script deploys your website to Vercel with one command

echo "🚀 FoxLite Forensics Deployment Script"
echo "======================================="
echo ""

# Navigate to website directory
cd "$(dirname "$0")"

echo "📍 Current directory: $(pwd)"
echo ""

# Check if vercel is installed
if ! command -v npx &> /dev/null; then
    echo "❌ Error: npm/npx not found"
    echo "Please install Node.js first"
    exit 1
fi

echo "✅ Vercel CLI available"
echo ""

# Deploy to production
echo "🚀 Deploying to Vercel..."
echo ""
echo "⚠️  You will be asked to:"
echo "   1. Log in to Vercel (opens browser)"
echo "   2. Confirm deployment settings"
echo ""
echo "Press ENTER to continue..."
read

# Run Vercel deploy
npx vercel --prod

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🎉 Your website is now live!"
echo ""
