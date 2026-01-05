# 🚀 Quick Reference Guide

## Common Commands

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Deployment

```bash
# Deploy to Vercel (first time)
vercel

# Deploy to production
vercel --prod

# Check deployment status
vercel ls
```

### Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit environment variables
# Add your Supabase URL and anon key
```

## Common Tasks

### Adding a New Page

1. Create page component in `src/pages/`:

```vue
<template>
  <q-page>
    <!-- Your content -->
  </q-page>
</template>

<script setup>
defineOptions({
  name: "YourPageName",
});
</script>
```

2. Add route in `src/router/index.js`:

```javascript
{
  path: '/your-path',
  component: () => import('../pages/YourPage.vue'),
  meta: { requiresAuth: true } // if protected
}
```

### Adding a New Store

1. Create store in `src/stores/`:

```javascript
import { defineStore } from "pinia";

export const useYourStore = defineStore("yourStore", {
  state: () => ({
    // your state
  }),
  actions: {
    // your actions
  },
});
```

2. Use in component:

```javascript
import { useYourStore } from "../stores/yourStore";

const yourStore = useYourStore();
```

### Accessing Supabase

```javascript
import { supabase } from "../supabase";

// Query data
const { data, error } = await supabase.from("table_name").select("*");

// Insert data
const { data, error } = await supabase
  .from("table_name")
  .insert({ column: "value" });

// Update data
const { data, error } = await supabase
  .from("table_name")
  .update({ column: "new_value" })
  .eq("id", userId);
```

### Using Notifications

```javascript
import { useQuasar } from "quasar";

const $q = useQuasar();

// Success notification
$q.notify({
  type: "positive",
  message: "Success!",
});

// Error notification
$q.notify({
  type: "negative",
  message: "Error occurred",
});

// Info notification
$q.notify({
  type: "info",
  message: "Information",
});
```

### Dark Mode Toggle

```javascript
import { useThemeStore } from "../stores/theme";

const themeStore = useThemeStore();

// Toggle dark mode
themeStore.toggleDarkMode();

// Check current mode
const isDark = themeStore.darkMode;
```

## Troubleshooting

### Build Errors

**Problem**: Module not found

```bash
# Solution: Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**Problem**: Vite build fails

```bash
# Solution: Clear cache and rebuild
npm run build -- --force
```

### Supabase Connection Issues

**Problem**: Cannot connect to Supabase

```bash
# Check environment variables
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY

# Restart dev server after changing .env
npm run dev
```

**Problem**: RLS policies blocking queries

```sql
-- Check policies in Supabase SQL editor
SELECT * FROM pg_policies WHERE tablename = 'your_table';

-- Temporarily disable RLS for testing (NOT for production!)
ALTER TABLE your_table DISABLE ROW LEVEL SECURITY;
```

### Deployment Issues

**Problem**: Vercel build fails

- Check that all dependencies are in `package.json`
- Verify environment variables are set in Vercel dashboard
- Check build logs for specific errors

**Problem**: 404 on page refresh

- Ensure `vercel.json` exists with proper routing config
- Verify SPA routing is configured

## Database Queries

### Get User Profile

```sql
SELECT * FROM profiles WHERE id = 'user-id';
```

### Get User Transactions

```sql
SELECT * FROM transactions
WHERE sender_id = 'user-id' OR receiver_id = 'user-id'
ORDER BY created_at DESC;
```

### Check Balance

```sql
SELECT balance FROM profiles WHERE id = 'user-id';
```

### Get Transaction History

```sql
SELECT
  t.*,
  sender.full_name as sender_name,
  receiver.full_name as receiver_name
FROM transactions t
LEFT JOIN profiles sender ON t.sender_id = sender.id
LEFT JOIN profiles receiver ON t.receiver_id = receiver.id
WHERE t.sender_id = 'user-id' OR t.receiver_id = 'user-id'
ORDER BY t.created_at DESC;
```

## Useful Supabase Functions

### Create New Transaction

```javascript
const { data, error } = await supabase.from("transactions").insert({
  sender_id: currentUserId,
  receiver_id: recipientId,
  receiver_wallet_id: recipientWallet,
  amount: parseFloat(amount),
  type: "transfer",
  description: description || "Transfer",
});
```

### Subscribe to Realtime Changes

```javascript
const channel = supabase
  .channel("transactions-channel")
  .on(
    "postgres_changes",
    {
      event: "INSERT",
      schema: "public",
      table: "transactions",
      filter: `receiver_id=eq.${userId}`,
    },
    (payload) => {
      console.log("New transaction:", payload.new);
    }
  )
  .subscribe();

// Cleanup
supabase.removeChannel(channel);
```

## Performance Tips

### Optimize Images

```bash
# Use WebP format for better compression
# Lazy load images with v-lazy directive
```

### Code Splitting

```javascript
// Use dynamic imports for routes
component: () => import("../pages/YourPage.vue");
```

### Reduce Bundle Size

```bash
# Analyze bundle
npm run build -- --mode analyze

# Remove unused dependencies
npm prune
```

## Testing Checklist

- [ ] User registration works
- [ ] User login works
- [ ] Send money functionality
- [ ] Receive money with QR
- [ ] Transaction history displays
- [ ] Dark mode toggle works
- [ ] Notifications appear
- [ ] Biometric page loads
- [ ] Mobile responsive
- [ ] PWA installable

## Keyboard Shortcuts (Development)

- `Ctrl + C` - Stop dev server
- `Ctrl + Shift + R` - Hard refresh browser
- `F12` - Open DevTools
- `Ctrl + Shift + I` - Open DevTools (alternative)

## Useful Links

- [Vue 3 Docs](https://vuejs.org/)
- [Quasar Docs](https://quasar.dev/)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind Docs](https://tailwindcss.com/)
- [Vercel Docs](https://vercel.com/docs)
- [Pinia Docs](https://pinia.vuejs.org/)

## Support

For issues or questions:

1. Check this guide first
2. Review README.md
3. Check DEPLOYMENT.md for deployment issues
4. Review ARCHITECTURE.md for system understanding
5. Open an issue on GitHub

---

**Quick Tip**: Keep this file open while developing for fast reference! 🚀
