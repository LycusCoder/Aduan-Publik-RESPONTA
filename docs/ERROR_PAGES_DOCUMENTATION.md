# 📄 Error Pages Documentation

**Date:** 2025-11-01  
**Version:** 1.0.0  
**Project:** RESPONTA - Kota Tegal  

---

## 🎨 Overview

Error pages yang modern dan branded untuk RESPONTA, mencerminkan transformasi digital Kota Tegal, Jawa Tengah.

---

## 📋 Pages Created

### 1. 404 Not Found
**File:** `/app/resources/js/pages/errors/NotFound.tsx`  
**Route:** `*` (catch-all route)

**Features:**
- ✅ Large 404 number with gradient effect
- ✅ Animated SVG illustration (bounce effect)
- ✅ Clear error message in Bahasa Indonesia
- ✅ Branded badge (RESPONTA - Kota Tegal)
- ✅ Action buttons:
  - Back button (navigate back)
  - Dashboard button (go to dashboard)
- ✅ Quick links to popular pages (Aduan, Create Aduan, Login)
- ✅ Footer with branding and transformasi digital tagline

**Design:**
- Color scheme: Blue & Teal gradient
- Background: Gradient from blue-50 to teal-50
- Animations: Bounce animation on illustration
- Icons: HeroIcons (HomeIcon, ArrowLeftIcon, MagnifyingGlassIcon)

**Use Case:**
- User navigates to non-existent route
- Invalid URL entered
- Page deleted or moved

---

### 2. 403 Forbidden
**File:** `/app/resources/js/pages/errors/Forbidden.tsx`  
**Route:** `/403` and `/admin/403`

**Features:**
- ✅ Large 403 number with gradient effect
- ✅ Shield icon with pulse animation
- ✅ Clear access denied message
- ✅ Info box explaining possible causes:
  - User not logged in
  - Role doesn't have access
  - Session expired
- ✅ Action buttons:
  - Back button
  - Login button (redirect to login)
- ✅ Branded badge

**Design:**
- Color scheme: Red & Orange gradient
- Background: Gradient from red-50 to orange-50
- Animations: Pulse animation on shield icon
- Icons: ShieldExclamationIcon

**Use Case:**
- User tries to access admin page without permission
- Role-based access control blocked
- Unauthorized API access attempt

---

### 3. 500 Server Error
**File:** `/app/resources/js/pages/errors/ServerError.tsx`  
**Route:** `/500` and `/admin/500`

**Features:**
- ✅ Large 500 number with gradient effect
- ✅ Warning icon with pulse animation
- ✅ User-friendly error message
- ✅ Info box with helpful tips:
  - Refresh the page
  - Go back to previous page
  - Contact support if issue persists
- ✅ Action buttons:
  - Refresh button (with loading state and spin animation)
  - Dashboard button
- ✅ Support contact information
- ✅ Branded badge

**Design:**
- Color scheme: Purple & Pink gradient
- Background: Gradient from purple-50 to pink-50
- Animations: Pulse animation on icon, spin on refresh
- Icons: ExclamationTriangleIcon, ArrowPathIcon

**Use Case:**
- Backend API error
- Database connection issue
- Unhandled exception on server
- Service unavailable

---

### 4. Maintenance Mode
**File:** `/app/resources/js/pages/errors/Maintenance.tsx`  
**Route:** `/maintenance`

**Features:**
- ✅ Fullscreen immersive design
- ✅ Gradient background with animated elements
- ✅ Real-time clock display
- ✅ RESPONTA logo and title
- ✅ Maintenance status message
- ✅ Info cards:
  - Scheduled maintenance
  - Estimated time
  - Status update
- ✅ Current date & time display (live updating)
- ✅ Kota Tegal branding with flag icon
- ✅ Professional footer

**Design:**
- Color scheme: Blue & Teal gradient (full screen)
- Background: Rich gradient from blue-600 to teal-700
- Animations: 
  - Floating orbs in background
  - Bounce animation on wrench icon
  - Live clock update every second
- Glass morphism effect on cards
- Icons: WrenchScrewdriverIcon, ClockIcon

**Use Case:**
- Scheduled system maintenance
- Major updates being deployed
- Database migration in progress
- Infrastructure changes

---

## 🎨 Design System

### Color Palette

**404 Not Found:**
- Primary: Blue (#2563EB)
- Secondary: Teal (#14B8A6)
- Background: Blue-50 to Teal-50

**403 Forbidden:**
- Primary: Red (#DC2626)
- Secondary: Orange (#EA580C)
- Background: Red-50 to Orange-50

**500 Server Error:**
- Primary: Purple (#9333EA)
- Secondary: Pink (#EC4899)
- Background: Purple-50 to Pink-50

**Maintenance:**
- Primary: Blue (#2563EB)
- Secondary: Teal (#14B8A6)
- Background: Blue-600 to Teal-700 (dark)

### Typography

- **Large Numbers:** 9xl font size (144px), bold, gradient text
- **Titles:** 3xl-4xl font size, bold, gray-900
- **Body:** lg font size, gray-600
- **Small Text:** sm-xs font size, gray-500

### Animations

**Custom Animation: `animate-bounce-slow`**
```css
@keyframes bounce-slow {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
}
animation: bounce-slow 3s ease-in-out infinite;
```

**Built-in Animations:**
- `animate-pulse` - For icons and badges
- `animate-spin` - For loading states (refresh button)

### Components Used

**From HeroIcons:**
- HomeIcon
- ArrowLeftIcon
- MagnifyingGlassIcon
- ShieldExclamationIcon
- ExclamationTriangleIcon
- ArrowPathIcon
- WrenchScrewdriverIcon
- ClockIcon

**Layout:**
- Flexbox centering
- Responsive grid (1-3 columns)
- Max-width containers
- Padding responsive (px-4 sm:px-6 lg:px-8)

---

## 🚀 Implementation

### Routing Configuration

**File:** `/app/resources/js/App.tsx`

```typescript
// Admin-specific error routes
<Route path="/admin/403" element={<Forbidden />} />
<Route path="/admin/500" element={<ServerError />} />
<Route path="/admin/*" element={<NotFound />} />

// Global error routes (outside providers)
<Route path="/403" element={<Forbidden />} />
<Route path="/500" element={<ServerError />} />
<Route path="/maintenance" element={<Maintenance />} />
<Route path="*" element={<NotFound />} />
```

**Priority Order:**
1. Specific routes (defined first)
2. Admin wildcard (`/admin/*`)
3. Global wildcard (`*`)

### CSS Updates

**File:** `/app/resources/css/app.css`

Added custom animation:
```css
@keyframes bounce-slow {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
}
```

Utility class:
```css
.animate-bounce-slow {
    animation: bounce-slow 3s ease-in-out infinite;
}
```

---

## 📱 Responsive Design

All error pages are fully responsive:

**Mobile (< 640px):**
- Single column layout
- Stacked buttons
- Smaller text sizes (responsive with `md:` prefix)
- Touch-friendly button sizes (px-6 py-3)

**Tablet (640px - 1024px):**
- Two column button layout
- Adjusted spacing
- Larger illustrations

**Desktop (> 1024px):**
- Full width content (max-w-4xl)
- Side-by-side buttons
- Larger illustrations and text

---

## 🧪 Testing

### Manual Testing

**1. Test 404 Page:**
```
1. Navigate to: http://localhost:8000/non-existent-page
2. Should show 404 page
3. Click "Kembali" button (should go back)
4. Click "Ke Dashboard" button (should go to dashboard)
5. Test quick links (should navigate correctly)
```

**2. Test 403 Page:**
```
1. Navigate to: http://localhost:8000/403
2. Should show 403 page
3. Try accessing admin page without login
4. Should auto-redirect or show 403
```

**3. Test 500 Page:**
```
1. Navigate to: http://localhost:8000/500
2. Should show 500 page
3. Click "Refresh Halaman" (should reload)
4. Check loading state and spin animation
```

**4. Test Maintenance Page:**
```
1. Navigate to: http://localhost:8000/maintenance
2. Should show maintenance page
3. Check live clock is updating (every second)
4. Verify all info cards display correctly
```

### Programmatic Usage

**Redirect to Error Pages:**

```typescript
// In React component
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();

// Redirect to 404
navigate('/404');

// Redirect to 403
navigate('/403');

// Redirect to 500
navigate('/500');

// Redirect to maintenance
navigate('/maintenance');
```

**In API Error Handling:**

```typescript
try {
    await api.getData();
} catch (error) {
    if (error.response?.status === 403) {
        navigate('/403');
    } else if (error.response?.status === 500) {
        navigate('/500');
    }
}
```

---

## 🎯 Branding Elements

### Kota Tegal Identity

**Tagline:**
- "Transformasi Digital Kota Tegal, Jawa Tengah"
- "Transformasi Digital untuk Pelayanan Publik yang Lebih Baik"

**Badge Text:**
- "RESPONTA - Kota Tegal"
- "RESPONTA - Sistem Pelaporan Aduan Warga"

**Copyright:**
- "© 2025 RESPONTA - Sistem Pelaporan Aduan Warga"
- "Pemerintah Kota Tegal, Jawa Tengah"

**Icons Used:**
- Calendar icon (for RESPONTA)
- Shield icon (for security/access)
- Users icon (for community)
- Flag icon (for Kota Tegal)

---

## 🔧 Customization

### Changing Colors

Edit gradient colors in each component:

```typescript
// 404 - Blue & Teal
bg-gradient-to-br from-blue-50 via-white to-teal-50
bg-gradient-to-r from-blue-600 to-teal-600

// 403 - Red & Orange
bg-gradient-to-br from-red-50 via-white to-orange-50
bg-gradient-to-r from-red-600 to-orange-600

// 500 - Purple & Pink
bg-gradient-to-br from-purple-50 via-white to-pink-50
bg-gradient-to-r from-purple-600 to-pink-600
```

### Changing Icons

Replace HeroIcon imports:

```typescript
import { YourIcon } from '@heroicons/react/24/outline';
```

### Changing Text

All text is in Bahasa Indonesia. Edit directly in JSX:

```typescript
<h2 className="...">
    Your Custom Title
</h2>
```

---

## 📊 Files Summary

| File | Lines | Purpose |
|------|-------|---------|
| NotFound.tsx | 120 | 404 error page |
| Forbidden.tsx | 135 | 403 access denied page |
| ServerError.tsx | 140 | 500 server error page |
| Maintenance.tsx | 155 | Maintenance mode page |
| App.tsx | +10 | Routing configuration |
| app.css | +20 | Custom animations |

**Total:** 4 new pages, 2 files modified, ~550 lines of code

---

## ✅ Checklist

- [x] 404 Not Found page created
- [x] 403 Forbidden page created
- [x] 500 Server Error page created
- [x] Maintenance mode page created
- [x] Routing configured in App.tsx
- [x] Custom animations added to CSS
- [x] All pages responsive
- [x] Branding (Kota Tegal) included
- [x] Bahasa Indonesia text
- [x] Professional design
- [x] Gradient backgrounds
- [x] Icons and illustrations
- [x] Action buttons working
- [x] Navigation links working
- [x] Built and tested

---

## 🚀 Next Steps

1. **Optional:** Add illustrations from external library (e.g., undraw.co)
2. **Optional:** Add more error codes (401, 503, etc.)
3. **Optional:** Add animation on page load
4. **Optional:** Add sound effects (optional, for fun)
5. **Deploy** and test in production

---

**Created by:** E1 Agent  
**Date:** 2025-11-01  
**Status:** ✅ Complete & Ready for Use  
**Transformasi Digital:** Kota Tegal, Jawa Tengah 🏛️
