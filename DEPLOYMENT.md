# Vercel Deployment Guide

This guide will help you deploy the E-commerce API to Vercel.

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. Git repository (GitHub, GitLab, or Bitbucket)
3. Node.js installed locally (for testing)

## Deployment Steps

### 1. Prepare Your Repository

Make sure your code is pushed to a Git repository (GitHub, GitLab, or Bitbucket).

### 2. Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your Git repository
4. Vercel will automatically detect it's a Node.js project
5. Click "Deploy"

#### Option B: Deploy via Vercel CLI

1. Install Vercel CLI:

   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:

   ```bash
   vercel login
   ```

3. Deploy:

   ```bash
   vercel
   ```

4. Follow the prompts to configure your project

### 3. Environment Variables (Optional)

If you need environment variables, add them in the Vercel dashboard:

1. Go to your project dashboard
2. Click "Settings" → "Environment Variables"
3. Add any required variables

### 4. Update n8n Tools Configuration

After deployment, update your `n8n-tools.json` file to use the new Vercel URL:

1. Replace `http://localhost:3000` with your Vercel URL
2. Example: `https://your-app-name.vercel.app`

### 5. Test Your Deployment

Your API will be available at:

- **API Base**: `https://your-app-name.vercel.app/api`
- **Documentation**: `https://your-app-name.vercel.app/api-docs`
- **Health Check**: `https://your-app-name.vercel.app/health`

## File Structure for Vercel

```
├── index.js              # Main entry point for Vercel
├── vercel.json           # Vercel configuration
├── package.json          # Dependencies and scripts
├── .vercelignore         # Files to exclude from deployment
├── routes/               # API routes
├── controllers/          # Business logic
├── models/              # Data models and validation
├── n8n-tools.json       # n8n workflow tools
└── agent-system-prompt.md # AI agent instructions
```

## Configuration Files

### vercel.json

```json
{
  "builds": [
    {
      "src": "./index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.js"
    }
  ]
}
```

### package.json

- `main`: Set to "index.js"
- `scripts`: Includes build scripts for Vercel

## Environment Variables

The following environment variables can be configured in Vercel:

- `NODE_ENV`: Set to "production"
- `PORT`: Automatically set by Vercel
- `CORS_ORIGIN`: Configure CORS if needed
- `RATE_LIMIT_MAX_REQUESTS`: Adjust rate limiting

## API Endpoints

After deployment, your API will have these endpoints:

- `GET /` - API information
- `GET /health` - Health check
- `GET /api-docs` - Swagger documentation
- `GET /api/products` - Products API
- `GET /api/users` - Users API
- `GET /api/carts` - Carts API
- `GET /api/orders` - Orders API
- `GET /api/checkouts` - Checkouts API
- `GET /api/shipments` - Shipments API

## Troubleshooting

### Common Issues

1. **Build Failures**: Check that all dependencies are in `package.json`
2. **Runtime Errors**: Check Vercel function logs
3. **CORS Issues**: Configure CORS_ORIGIN environment variable
4. **Rate Limiting**: Adjust rate limit settings if needed

### Logs

View logs in the Vercel dashboard:

1. Go to your project
2. Click "Functions" tab
3. Click on a function to view logs

## Updating Your Deployment

To update your deployment:

1. Push changes to your Git repository
2. Vercel will automatically redeploy
3. Or manually trigger deployment in the Vercel dashboard

## Custom Domain (Optional)

To use a custom domain:

1. Go to your project settings
2. Click "Domains"
3. Add your custom domain
4. Configure DNS settings as instructed

## Performance Optimization

- Vercel automatically optimizes Node.js functions
- Consider implementing caching for better performance
- Use Vercel's Edge Functions for global distribution if needed

## Security Considerations

- All environment variables are secure in Vercel
- HTTPS is automatically enabled
- Consider implementing authentication for production use
- Review and update CORS settings for production
