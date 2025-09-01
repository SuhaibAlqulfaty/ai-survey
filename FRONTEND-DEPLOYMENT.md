# 🚀 React Frontend - Deployment Guide

## Environment Variables Configuration

### 📁 **Current Setup:**

The frontend uses environment variables to connect to your Laravel backend API. Here's how it works:

### 🔧 **Environment Files:**

1. **`.env`** - Development configuration (localhost)
2. **`.env.production`** - Production configuration (your live server)

### 📝 **Key Environment Variables:**

```bash
# Most Important - Your Backend API URL
REACT_APP_API_URL=https://survey-api.messageboost.ai/api

# App Configuration
REACT_APP_NAME=Engage.sa Survey Platform
REACT_APP_VERSION=1.0.0

# Production Settings
REACT_APP_DEBUG=false
REACT_APP_LOG_LEVEL=error
```

## 🌐 **Frontend-Backend Communication:**

### **How It Works:**
1. **API Client** (`src/api/client.js`) reads `REACT_APP_API_URL`
2. **All API calls** go to your Laravel backend at `survey-api.messageboost.ai`
3. **Authentication** uses Bearer tokens stored in localStorage
4. **CORS** is handled by your Laravel backend

### **API Endpoints Used:**
- `GET /api/health` - Health check
- `POST /api/auth/login` - User authentication
- `GET /api/auth/profile` - User profile
- `POST /api/surveys` - Create surveys
- `GET /api/surveys` - List surveys
- `POST /api/surveys/{id}/responses` - Submit responses

## 🚀 **Deployment Options:**

### **Option 1: Static Hosting (Recommended)**

Build and deploy as static files:

```bash
# Install dependencies
npm install

# Build for production (uses .env.production)
npm run build

# Deploy the 'dist' folder to:
# - Netlify
# - Vercel
# - AWS S3 + CloudFront
# - GitHub Pages
# - Your web server
```

### **Option 2: Laravel Integration**

Serve from your Laravel backend:

```bash
# Build the frontend
npm run build

# Copy built files to Laravel public directory
cp -r dist/* /path/to/laravel/public/

# Laravel will serve the React app
```

## 🔧 **Production Configuration:**

### **1. Update Environment Variables:**

Create `.env.production`:
```bash
REACT_APP_API_URL=https://survey-api.messageboost.ai/api
REACT_APP_DEBUG=false
```

### **2. Build Commands:**

```bash
# Development build
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

### **3. Backend CORS Configuration:**

Ensure your Laravel backend allows requests from your frontend domain:

```php
// config/cors.php
'allowed_origins' => [
    'https://your-frontend-domain.com',
    'https://survey.messageboost.ai', // Your frontend URL
],
```

## 🌍 **Deployment Scenarios:**

### **Scenario 1: Separate Domains**
- **Frontend:** `https://survey.messageboost.ai`
- **Backend:** `https://survey-api.messageboost.ai`
- **Configuration:** Update `REACT_APP_API_URL` to backend URL

### **Scenario 2: Same Domain**
- **Frontend:** `https://messageboost.ai/survey`
- **Backend:** `https://messageboost.ai/api`
- **Configuration:** Update `REACT_APP_API_URL` to `/api`

### **Scenario 3: Laravel Subdirectory**
- **Frontend:** Served by Laravel from `public/`
- **Backend:** Same Laravel app
- **Configuration:** `REACT_APP_API_URL=/api`

## 📋 **Deployment Checklist:**

### **Before Deployment:**
- [ ] Update `REACT_APP_API_URL` in `.env.production`
- [ ] Set `REACT_APP_DEBUG=false`
- [ ] Test API connectivity
- [ ] Configure CORS in Laravel backend

### **During Deployment:**
- [ ] Run `npm run build`
- [ ] Upload `dist/` folder contents
- [ ] Configure web server (if needed)
- [ ] Test all functionality

### **After Deployment:**
- [ ] Test survey form submission
- [ ] Test authentication flow
- [ ] Check browser console for errors
- [ ] Verify API calls in Network tab

## 🔍 **Testing Frontend-Backend Connection:**

### **1. Check Environment Variables:**
```javascript
// In browser console
console.log(process.env.REACT_APP_API_URL);
```

### **2. Test API Health:**
```bash
curl https://survey-api.messageboost.ai/api/health
```

### **3. Check CORS:**
```javascript
// In browser console
fetch('https://survey-api.messageboost.ai/api/health')
  .then(response => response.json())
  .then(data => console.log(data));
```

## 🚨 **Common Issues & Solutions:**

### **CORS Errors:**
```
Access to fetch at 'https://survey-api.messageboost.ai/api/health' 
from origin 'https://survey.messageboost.ai' has been blocked by CORS policy
```

**Solution:** Update Laravel CORS configuration

### **API URL Not Found:**
```
GET https://survey.messageboost.ai/api/health 404 (Not Found)
```

**Solution:** Check `REACT_APP_API_URL` in `.env.production`

### **Environment Variables Not Loading:**
```
process.env.REACT_APP_API_URL is undefined
```

**Solution:** Ensure variables start with `REACT_APP_` and rebuild

## 📞 **Quick Setup Commands:**

```bash
# Clone and setup
git clone your-frontend-repo
cd your-frontend-repo

# Install dependencies
npm install

# Create production environment file
cp .env.production.example .env.production

# Edit with your API URL
nano .env.production

# Build for production
npm run build

# Deploy dist/ folder to your hosting service
```

Your frontend is now ready to communicate with your Laravel backend at `survey-api.messageboost.ai`!

