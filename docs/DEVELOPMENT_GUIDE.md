# 🔥 RESPONTA Development Guide

**Last Updated:** 2025-02-01  
**Version:** 1.0.0  

---

## 🚀 Quick Start Development

### Development Mode (Recommended)

```bash
bash scripts/dev-app.sh
```

**Features:**
- ✅ Auto-checks system requirements
- ✅ Starts Laravel backend (http://localhost:8000)
- ✅ Starts Vite dev server (http://localhost:5173) 
- ✅ **Hot Reload** for frontend (React/TS/CSS)
- ✅ Backend auto-reloads on next request
- ✅ Automatic cache clearing
- ✅ Real-time log monitoring

**Hot Reload Capabilities:**
- Frontend `.tsx`, `.ts`, `.jsx`, `.js` files → **Instant reload**
- CSS/Tailwind changes → **Instant reload**
- Backend `.php` files → **Reloads on next API call**
- Environment `.env` changes → **Requires manual restart**

---

## 📝 Development Workflow

### 1. Start Development Servers

```bash
# Start both backend and frontend
bash scripts/dev-app.sh
```

You'll see:
```
╔════════════════════════════════════════════════╗
║   🔥 RESPONTA - Development Mode 🔥           ║
║   Hot Reload Enabled for Real-time Dev        ║
╚════════════════════════════════════════════════╝

✓ PHP 8.2 ready
✓ Composer ready  
✓ Node.js ready
✓ Yarn ready

🚀 Starting Development Servers...
✓ Laravel server started (http://localhost:8000)
✓ Vite dev server started (http://localhost:5173)

✨ Development Environment Ready! ✨
```

### 2. Development URLs

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:5173 | Vite dev server with HMR |
| **Backend** | http://localhost:8000 | Laravel API server |
| **Database** | localhost:3306 | MariaDB/MySQL |

### 3. Making Changes

#### Frontend Changes (Hot Reload ⚡)

```bash
# Example: Edit Login page
nano resources/js/pages/auth/Login.tsx

# Save the file → Browser auto-refreshes!
```

**Files that trigger hot reload:**
- `resources/js/**/*.tsx` - React components
- `resources/js/**/*.ts` - TypeScript files  
- `resources/css/**/*.css` - Stylesheets
- `tailwind.config.js` - Tailwind configuration

#### Backend Changes

```bash
# Example: Edit API controller
nano app/Http/Controllers/Api/AduanController.php

# Save the file → Changes apply on next API request
```

**Files that need restart:**
- `.env` - Environment configuration
- `config/**/*.php` - Config files (after cache clear)
- New routes in `routes/api.php` or `routes/web.php`

### 4. Stop Development Servers

Press `Ctrl+C` in the terminal where dev-app.sh is running.

The script will automatically clean up:
- ✅ Laravel server stopped
- ✅ Vite dev server stopped  
- ✅ All child processes terminated

---

## 🛠️ Development Tools

### View Real-time Logs

```bash
# Laravel backend logs
tail -f storage/logs/laravel-dev.log

# Vite frontend logs  
tail -f storage/logs/vite-dev.log

# Combined logs
tail -f storage/logs/*.log
```

### Run Artisan Commands (While Dev Server Running)

```bash
# Open new terminal window/tab

# Clear caches
php artisan cache:clear
php artisan config:clear

# Run migrations
php artisan migrate

# Create new controller
php artisan make:controller Api/NewController

# Tinker REPL
php artisan tinker
```

### Database Operations

```bash
# View database tables
php artisan db:show

# Check migration status  
php artisan migrate:status

# Fresh database + seed
php artisan migrate:fresh --seed

# Run specific seeder
php artisan db:seed --class=UserSeeder
```

---

## 💡 Development Tips & Tricks

### 1. Fast Refresh on Save

Configure your code editor for auto-save:

**VS Code:**
```json
{
  "files.autoSave": "onFocusChange"
}
```

**WebStorm/PHPStorm:**
- Settings → Appearance & Behavior → System Settings → Autosave

### 2. Browser DevTools

- **React DevTools** - Install Chrome/Firefox extension
- **Network Tab** - Monitor API calls  
- **Console** - View frontend errors

### 3. API Testing

```bash
# Test login endpoint
curl -X POST http://localhost:8000/api/v1/login \
  -H "Content-Type: application/json" \
  -d '{"no_hp":"081234567890","password":"password123"}'

# Test with auth token
curl http://localhost:8000/api/v1/aduan \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 4. Debug Mode

Edit `.env`:
```env
APP_DEBUG=true
APP_ENV=local
```

**Never use `APP_DEBUG=true` in production!**

---

## 🐛 Troubleshooting

### Issue: Port Already in Use

```bash
# Check what's using port 8000
lsof -ti:8000

# Kill the process
lsof -ti:8000 | xargs kill -9

# Or use different port
php artisan serve --port=8001
```

### Issue: Vite Not Starting

```bash
# Reinstall node modules
rm -rf node_modules yarn.lock
yarn install

# Manually start vite
yarn dev
```

### Issue: Database Connection Failed

```bash
# Check MariaDB is running
service mariadb status

# Start MariaDB
service mariadb start

# Test connection
mysql -u root -e "SELECT 1;"
```

### Issue: Hot Reload Not Working

```bash
# Clear browser cache (Ctrl+Shift+R)
# Or hard refresh in browser

# Restart dev servers
# Press Ctrl+C then run again:
bash scripts/dev-app.sh
```

### Issue: Permission Denied

```bash
# Fix storage permissions
chmod -R 775 storage bootstrap/cache
chown -R $USER:www-data storage bootstrap/cache
```

---

## 📦 Adding New Dependencies

### Backend (PHP/Composer)

```bash
# Install package
composer require vendor/package

# Dev dependency
composer require --dev vendor/package

# Update dependencies
composer update
```

### Frontend (JavaScript/Yarn)

```bash
# Install package
yarn add package-name

# Dev dependency  
yarn add -D package-name

# Update dependencies
yarn upgrade
```

**Note:** Vite will auto-detect new dependencies and reload!

---

## 🎨 Frontend Development

### Component Structure

```
resources/js/
├── pages/           # Full page components
│   ├── auth/        # Login, Register
│   ├── Dashboard.tsx
│   └── aduan/       # Aduan pages
├── components/      # Reusable components
│   ├── ui/          # UI components (Button, Input, Alert)
│   ├── layout/      # Layout components
│   └── map/         # Map components
├── services/        # API services
├── contexts/        # React contexts
├── types/           # TypeScript types
└── utils/           # Utility functions
```

### Creating New Component

```bash
# Create new UI component
touch resources/js/components/ui/NewComponent.tsx
```

```tsx
// resources/js/components/ui/NewComponent.tsx
import { FC } from 'react';

interface NewComponentProps {
  title: string;
  // Add props here
}

const NewComponent: FC<NewComponentProps> = ({ title }) => {
  return (
    <div className="p-4">
      <h2>{title}</h2>
      {/* Component content */}
    </div>
  );
};

export default NewComponent;
```

**Save file → Browser auto-refreshes! 🔥**

---

## 🔐 Backend Development  

### API Endpoint Development

1. **Create Controller**
```bash
php artisan make:controller Api/FeatureController --api
```

2. **Add Routes**
```php
// routes/api.php
Route::prefix('v1')->group(function () {
    Route::middleware('auth:sanctum')->group(function () {
        Route::apiResource('features', FeatureController::class);
    });
});
```

3. **Implement Controller**
```php
// app/Http/Controllers/Api/FeatureController.php
public function index(Request $request)
{
    $features = Feature::paginate(10);
    
    return response()->json([
        'success' => true,
        'data' => $features
    ]);
}
```

4. **Test Endpoint**
```bash
curl http://localhost:8000/api/v1/features \
  -H "Authorization: Bearer TOKEN"
```

---

## 📊 Performance Monitoring

### Development Performance

```bash
# Check Laravel route performance
php artisan route:list

# Optimize for development (optional)
php artisan optimize:clear
```

### Vite Build Size

```bash
# Check bundle size
yarn build

# Analyze bundle (install plugin first)
yarn add -D rollup-plugin-visualizer
```

---

## 🔄 Git Workflow While Developing

```bash
# Start feature branch
git checkout -b feature/new-feature

# Make changes → Auto-reload works!

# Check status
git status

# Stage changes
git add resources/js/pages/NewPage.tsx

# Commit  
git commit -m "Add: New page component with hot reload"

# Push
git push origin feature/new-feature
```

---

## 🎯 Best Practices

### ✅ DO's

- ✅ Use `dev-app.sh` for development
- ✅ Keep dev server running while coding
- ✅ Use TypeScript for type safety
- ✅ Test API changes with curl/Postman
- ✅ Commit often with clear messages
- ✅ Use React DevTools for debugging
- ✅ Check browser console for errors

### ❌ DON'Ts

- ❌ Don't use production mode for development
- ❌ Don't edit files in `public/build/` (auto-generated)
- ❌ Don't commit `.env` file  
- ❌ Don't skip database migrations
- ❌ Don't ignore TypeScript errors
- ❌ Don't forget to pull latest changes
- ❌ Don't run `yarn build` constantly (slow!)

---

## 📚 Additional Resources

- **Laravel Docs:** https://laravel.com/docs/12.x
- **React Docs:** https://react.dev
- **TypeScript Docs:** https://www.typescriptlang.org/docs
- **Vite Docs:** https://vite.dev
- **Tailwind CSS:** https://tailwindcss.com/docs

---

## 🆘 Need Help?

1. Check this guide first
2. View logs: `tail -f storage/logs/*.log`
3. Check Laravel log: `tail -f storage/logs/laravel.log`
4. Review golden-rules.md for project conventions
5. Ask team members

---

**Happy Coding! 🚀**

*Remember: With hot reload, you see changes instantly - no more manual refreshes!*

---

**Last Updated:** 2025-02-01  
**Maintained by:** RESPONTA Development Team
