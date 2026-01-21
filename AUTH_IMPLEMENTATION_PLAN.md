# 🔐 Implementation Plan - Authentication System

## 📊 OVERVIEW

Implementasi sistem authentication lengkap dengan:
- Login & Signup pages
- Protected routes
- Admin authentication
- Supabase Auth integration
- Premium UI design

---

## 🎯 ARCHITECTURE

### **Authentication Flow:**

```
User clicks "Login" button
    ↓
Redirect to /auth/login
    ↓
User fills form & submit
    ↓
Supabase Auth validates
    ↓
Success → Redirect to dashboard/home
    ↓
Fail → Show error message
```

### **Protected Routes Flow:**

```
User tries to access /ptsp
    ↓
Check if authenticated
    ↓
Yes → Show PTSP page
    ↓
No → Redirect to /auth/login
```

---

## 📁 FILE STRUCTURE

```
src/
├── app/
│   ├── auth/
│   │   ├── login/
│   │   │   └── page.tsx          # Login page
│   │   ├── signup/
│   │   │   └── page.tsx          # Signup page
│   │   └── layout.tsx            # Auth layout (centered, premium design)
│   ├── admin/
│   │   ├── login/
│   │   │   └── page.tsx          # Admin login page
│   │   └── page.tsx              # Admin dashboard (protected)
│   └── ptsp/
│       └── page.tsx              # PTSP page (protected)
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx         # Login form component
│   │   ├── SignupForm.tsx        # Signup form component
│   │   └── AuthCard.tsx          # Card wrapper for auth forms
│   └── shared/
│       └── Navbar.tsx            # Update with login button
├── lib/
│   ├── supabase.ts               # Supabase client
│   └── auth.ts                   # Auth helper functions
└── middleware.ts                 # Route protection middleware
```

---

## 🎨 UI DESIGN SPECIFICATIONS

### **Design Principles:**
1. **Premium & Modern** - Glassmorphism, gradients, smooth animations
2. **Consistent** - Follow existing website design language
3. **Responsive** - Mobile-first approach
4. **Accessible** - WCAG compliant

### **Color Palette:**
```css
Primary: hsl(var(--primary))      /* Blue gradient */
Secondary: hsl(var(--secondary))  /* Purple accent */
Background: Dark mode with gradient
Card: Glassmorphism effect
Text: White/Gray hierarchy
```

### **Components:**
- **Auth Card**: Glassmorphic card with blur effect
- **Input Fields**: Floating labels, focus animations
- **Buttons**: Gradient background, hover effects
- **Social Login**: Google, GitHub buttons (optional)

---

## 🔧 IMPLEMENTATION STEPS

### **PHASE 1: Setup Supabase Auth** ⚙️

**Step 1.1: Install Dependencies**
```bash
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
```

**Step 1.2: Configure Supabase Client**
```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

**Step 1.3: Add Environment Variables**
```env
NEXT_PUBLIC_SUPABASE_URL=https://hhcqjrlvupoktcdhhraj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### **PHASE 2: Create Auth Pages** 📄

**Step 2.1: Auth Layout**
```typescript
// src/app/auth/layout.tsx
- Centered layout
- Background gradient
- Animated particles (optional)
- Logo at top
```

**Step 2.2: Login Page**
```typescript
// src/app/auth/login/page.tsx
Features:
- Email & Password fields
- "Remember me" checkbox
- "Forgot password?" link
- "Don't have account? Sign up" link
- Social login buttons (optional)
- Form validation
- Loading states
- Error handling
```

**Step 2.3: Signup Page**
```typescript
// src/app/auth/signup/page.tsx
Features:
- Full name field
- Email field
- Password field
- Confirm password field
- Terms & conditions checkbox
- "Already have account? Login" link
- Form validation
- Password strength indicator
- Loading states
- Error handling
```

**Step 2.4: Admin Login Page**
```typescript
// src/app/admin/login/page.tsx
Features:
- Similar to user login
- Different branding (Admin badge)
- Role-based redirect
- Admin-specific validation
```

---

### **PHASE 3: Create Auth Components** 🧩

**Step 3.1: LoginForm Component**
```typescript
// src/components/auth/LoginForm.tsx
- Controlled form inputs
- Supabase signInWithPassword
- Error handling
- Success redirect
- Loading spinner
```

**Step 3.2: SignupForm Component**
```typescript
// src/components/auth/SignupForm.tsx
- Controlled form inputs
- Supabase signUp
- Password validation
- Email verification
- Success message
```

**Step 3.3: AuthCard Component**
```typescript
// src/components/auth/AuthCard.tsx
- Glassmorphic design
- Blur backdrop
- Border gradient
- Shadow effects
- Responsive padding
```

---

### **PHASE 4: Implement Route Protection** 🔒

**Step 4.1: Create Middleware**
```typescript
// src/middleware.ts
- Check authentication status
- Protect /ptsp, /admin, etc
- Redirect unauthenticated users
- Allow public routes
```

**Step 4.2: Create Auth Helper**
```typescript
// src/lib/auth.ts
Functions:
- getUser()
- isAuthenticated()
- logout()
- checkRole()
```

**Step 4.3: Update Protected Pages**
```typescript
// Add auth check to:
- src/app/ptsp/page.tsx
- src/app/admin/page.tsx
- Other protected routes
```

---

### **PHASE 5: Update Navbar** 🎨

**Step 5.1: Add Login Button**
```typescript
// src/components/shared/Navbar.tsx
- Show "Login" when not authenticated
- Show "Dashboard" + "Logout" when authenticated
- User avatar/name display
- Smooth transitions
```

**Step 5.2: Add User Menu**
```typescript
- Dropdown menu for authenticated users
- Profile link
- Settings link
- Logout button
```

---

### **PHASE 6: Supabase Database Setup** 💾

**Step 6.1: Create Users Table**
```sql
-- Extend auth.users with profiles
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  full_name TEXT,
  role TEXT DEFAULT 'user', -- 'user', 'admin'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);
```

**Step 6.2: Create Trigger for New Users**
```sql
-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## 🎨 UI COMPONENTS DESIGN

### **Login Page Design:**

```
┌─────────────────────────────────────┐
│                                     │
│         🏫 Sekolah Marantaa        │
│                                     │
│  ┌───────────────────────────────┐ │
│  │                               │ │
│  │     Welcome Back! 👋          │ │
│  │                               │ │
│  │  Email                        │ │
│  │  [___________________]        │ │
│  │                               │ │
│  │  Password                     │ │
│  │  [___________________] 👁      │ │
│  │                               │ │
│  │  ☐ Remember me                │ │
│  │                               │ │
│  │  [    Login    ]              │ │
│  │                               │ │
│  │  Forgot password?             │ │
│  │                               │ │
│  │  Don't have account? Sign up  │ │
│  │                               │ │
│  └───────────────────────────────┘ │
│                                     │
└─────────────────────────────────────┘
```

### **Signup Page Design:**

```
┌─────────────────────────────────────┐
│                                     │
│         🏫 Sekolah Marantaa        │
│                                     │
│  ┌───────────────────────────────┐ │
│  │                               │ │
│  │     Create Account 🚀         │ │
│  │                               │ │
│  │  Full Name                    │ │
│  │  [___________________]        │ │
│  │                               │ │
│  │  Email                        │ │
│  │  [___________________]        │ │
│  │                               │ │
│  │  Password                     │ │
│  │  [___________________] 👁      │ │
│  │  ████░░░░ Weak                │ │
│  │                               │ │
│  │  Confirm Password             │ │
│  │  [___________________] 👁      │ │
│  │                               │ │
│  │  ☐ I agree to Terms           │ │
│  │                               │ │
│  │  [    Sign Up    ]            │ │
│  │                               │ │
│  │  Already have account? Login  │ │
│  │                               │ │
│  └───────────────────────────────┘ │
│                                     │
└─────────────────────────────────────┘
```

---

## 🔄 USER FLOWS

### **Flow 1: New User Registration**
```
1. User clicks "Login" in Navbar
2. Redirected to /auth/login
3. Clicks "Don't have account? Sign up"
4. Redirected to /auth/signup
5. Fills form (name, email, password)
6. Clicks "Sign Up"
7. Supabase creates account
8. Email verification sent
9. User verifies email
10. Redirected to dashboard
```

### **Flow 2: Existing User Login**
```
1. User clicks "Login" in Navbar
2. Redirected to /auth/login
3. Fills email & password
4. Clicks "Login"
5. Supabase validates credentials
6. Success → Redirected to home/dashboard
7. Navbar shows user menu
```

### **Flow 3: Protected Route Access**
```
1. User (not logged in) tries to access /ptsp
2. Middleware checks authentication
3. Not authenticated → Redirect to /auth/login
4. After login → Redirect back to /ptsp
5. User can now access PTSP features
```

### **Flow 4: Admin Login**
```
1. Admin navigates to /admin/login
2. Fills credentials
3. Supabase validates + checks role
4. If role = 'admin' → Access granted
5. If role != 'admin' → Access denied
6. Redirected to admin dashboard
```

---

## 🎯 ACCEPTANCE CRITERIA

### **Login Page:**
- [ ] Form validates email format
- [ ] Form validates password length (min 6 chars)
- [ ] Shows loading state during authentication
- [ ] Shows error message on failure
- [ ] Redirects to home on success
- [ ] "Remember me" persists session
- [ ] "Forgot password" link works
- [ ] Responsive on mobile
- [ ] Follows design system

### **Signup Page:**
- [ ] Form validates all required fields
- [ ] Password strength indicator works
- [ ] Confirm password matches
- [ ] Terms checkbox required
- [ ] Shows loading state
- [ ] Shows success message
- [ ] Email verification sent
- [ ] Redirects after verification
- [ ] Responsive on mobile
- [ ] Follows design system

### **Protected Routes:**
- [ ] /ptsp requires authentication
- [ ] /admin requires admin role
- [ ] Unauthenticated users redirected
- [ ] Return URL preserved
- [ ] Session persists on refresh

### **Navbar:**
- [ ] Shows "Login" when not authenticated
- [ ] Shows user menu when authenticated
- [ ] Logout works correctly
- [ ] Smooth transitions
- [ ] Mobile responsive

---

## 📦 DELIVERABLES

1. ✅ Login page (`/auth/login`)
2. ✅ Signup page (`/auth/signup`)
3. ✅ Admin login page (`/admin/login`)
4. ✅ Auth components (LoginForm, SignupForm, AuthCard)
5. ✅ Route protection middleware
6. ✅ Updated Navbar with login button
7. ✅ Supabase Auth integration
8. ✅ Database schema for profiles
9. ✅ Auth helper functions
10. ✅ Premium UI design

---

## ⏱️ ESTIMATED TIME

- Phase 1 (Setup): 30 minutes
- Phase 2 (Pages): 1 hour
- Phase 3 (Components): 1 hour
- Phase 4 (Protection): 45 minutes
- Phase 5 (Navbar): 30 minutes
- Phase 6 (Database): 30 minutes
- Testing & Polish: 45 minutes

**Total: ~5 hours**

---

## 🚀 IMPLEMENTATION ORDER

1. **First:** Setup Supabase Auth (Phase 1)
2. **Second:** Create auth pages & components (Phase 2 & 3)
3. **Third:** Update Navbar (Phase 5)
4. **Fourth:** Implement route protection (Phase 4)
5. **Fifth:** Setup database (Phase 6)
6. **Last:** Testing & integration

---

## 🎨 DESIGN TOKENS

```typescript
// Colors
const authColors = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  cardBg: 'rgba(255, 255, 255, 0.1)',
  cardBorder: 'rgba(255, 255, 255, 0.2)',
  inputBg: 'rgba(255, 255, 255, 0.05)',
  inputBorder: 'rgba(255, 255, 255, 0.1)',
  text: '#ffffff',
  textSecondary: 'rgba(255, 255, 255, 0.7)',
  primary: '#667eea',
  error: '#ef4444',
  success: '#10b981'
}

// Spacing
const spacing = {
  cardPadding: '2rem',
  inputPadding: '0.75rem 1rem',
  buttonPadding: '0.875rem 2rem'
}

// Effects
const effects = {
  cardBlur: 'blur(10px)',
  cardShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  buttonShadow: '0 4px 15px 0 rgba(102, 126, 234, 0.4)'
}
```

---

**Ready to implement?** 🚀
