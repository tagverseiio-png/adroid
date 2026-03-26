# Deployment Guide - Image Assets Fix

## Problem Solved
Images were not showing in production due to static asset handling issues.

## Solutions Implemented

### 1. Direct Image Imports
- Changed from string paths to direct imports in `ServicesPage.jsx`
- This ensures Vite processes images correctly and generates proper URLs
- Images are now imported as modules and referenced by variables

### 2. Base Path Configuration
- Added `base: '/'` to `vite.config.js`
- Adjust if deploying to subdirectory (e.g., `base: '/your-app/'`)

## Production Deployment Checklist

### For Static Hosting (Vercel, Netlify, etc.)
1. **Build**: `npm run build`
2. **Deploy**: Upload `dist` folder
3. **Verify**: All images should load correctly

### For Custom Server Setup
Ensure your server serves static assets from the `dist/assets` directory:

#### Nginx Example
```nginx
location /assets/ {
    root /path/to/your/project/dist;
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

#### Apache Example
```apache
<Directory "/path/to/your/project/dist/assets">
    Options Indexes FollowSymLinks
    AllowOverride All
    Require all granted
</Directory>
```

#### Node.js/Express Example
```javascript
app.use('/assets', express.static(path.join(__dirname, 'dist/assets')));
```

### For Subdirectory Deployment
If deploying to `https://example.com/my-app/`:

1. Update `vite.config.js`:
   ```js
   base: '/my-app/'
   ```

2. Rebuild: `npm run build`

3. Ensure server routes `/my-app/assets/*` to `dist/assets/*`

## Testing
1. Run `npm run build`
2. Run `npm run preview` 
3. Navigate to `http://localhost:4173`
4. Verify all service images load correctly

## Troubleshooting
- **404 errors**: Check server configuration for static asset serving
- **Broken images**: Verify base path in `vite.config.js` matches deployment URL
- **Build issues**: Ensure all image files exist in `public/assets/` before building

## Files Modified
- `src/ServicesPage.jsx` - Updated image imports
- `vite.config.js` - Added base path configuration
