# Vercel Deployment Checklist

## ✅ Pre-Deployment Checklist

### 1. Configuration Files

- [x] `.vercelignore` - Created to exclude unnecessary files
- [x] `vercel.json` - Updated with correct configuration
- [x] `package.json` - Updated main entry point to `index.js`
- [x] `config/database.js` - Removed hardcoded credentials

### 2. Environment Variables (Set in Vercel Dashboard)

- [ ] `MONGODB_URI` - MongoDB connection string (REQUIRED)
- [ ] `NODE_ENV=production`
- [ ] `RATE_LIMIT_MAX_REQUESTS=100` (reduced for serverless)
- [ ] `CORS_ORIGIN` - Your frontend domain
- [ ] `ENABLE_SWAGGER=false` (disable in production)

### 3. GitHub Repository

- [ ] Push all changes to GitHub
- [ ] Ensure repository is public or connected to Vercel account

## 🚀 Deployment Steps

### Step 1: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import your repository

### Step 2: Configure Environment Variables

1. In Vercel dashboard, go to your project
2. Click "Settings" → "Environment Variables"
3. Add the required variables from `vercel-env-example.txt`

### Step 3: Deploy

1. Click "Deploy" button
2. Wait for deployment to complete
3. Test your API endpoints

## 🔗 API Endpoints After Deployment

Your API will be available at:

- **Base URL**: `https://your-app-name.vercel.app`
- **API Base**: `https://your-app-name.vercel.app/api`
- **Health Check**: `https://your-app-name.vercel.app/health`
- **Documentation**: `https://your-app-name.vercel.app/api-docs` (if enabled)

## 🧪 Testing Your Deployment

### Test Health Endpoint

```bash
curl https://your-app-name.vercel.app/health
```

### Test API Endpoints

```bash
# Get all products
curl https://your-app-name.vercel.app/api/products

# Get all users
curl https://your-app-name.vercel.app/api/users
```

## 🔧 Troubleshooting

### Common Issues

1. **Build Failures**

   - Check Vercel function logs
   - Ensure all dependencies are in `package.json`
   - Verify `index.js` exists and exports the app

2. **Database Connection Errors**

   - Verify `MONGODB_URI` is set correctly
   - Check MongoDB Atlas IP whitelist (add 0.0.0.0/0 for Vercel)
   - Ensure database user has proper permissions

3. **CORS Issues**

   - Set `CORS_ORIGIN` to your frontend domain
   - Use `*` for development only

4. **Rate Limiting Issues**
   - Reduce `RATE_LIMIT_MAX_REQUESTS` if hitting limits
   - Consider implementing caching

### Vercel Function Logs

1. Go to Vercel dashboard
2. Click "Functions" tab
3. Click on `index.js` function
4. View logs for debugging

## 📝 Post-Deployment Updates

### Update n8n Workflow URLs

After deployment, update your n8n workflow JSON files:

1. Replace `http://localhost:3000` with your Vercel URL
2. Example: `https://your-app-name.vercel.app`

### Update Documentation

Update any documentation with the new production URL.

## 🔒 Security Considerations

- [ ] Review CORS settings for production
- [ ] Ensure MongoDB credentials are secure
- [ ] Consider implementing authentication
- [ ] Review rate limiting settings
- [ ] Enable HTTPS (automatic with Vercel)

## 📊 Monitoring

- Monitor Vercel function execution time
- Set up error tracking if needed
- Monitor database connection health
- Track API usage and performance
