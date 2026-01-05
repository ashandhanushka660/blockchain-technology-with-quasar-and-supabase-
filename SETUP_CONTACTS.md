# 🚀 Quick Setup Guide - Wallet Contacts Feature

## Step 1: Database Migration

Before using the contacts feature, you need to run the database migration:

1. **Open Supabase Dashboard**

   - Go to https://supabase.com/dashboard
   - Select your project

2. **Navigate to SQL Editor**

   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run the Migration**

   - Open the file: `migrations/create_wallet_contacts.sql`
   - Copy the entire SQL content
   - Paste it into the SQL Editor
   - Click **"Run"** or press `Ctrl+Enter`

4. **Verify Success**
   - You should see: "Success. No rows returned"
   - Go to "Table Editor" and verify `wallet_contacts` table exists

## Step 2: Access the Feature

The application is now running at: **http://localhost:5173**

### Navigation Options:

**Desktop:**

- Click **"Contacts"** in the left sidebar
- Icon: 📇 (contacts icon)

**Mobile:**

- Tap the **"Contacts"** icon in the bottom navigation bar

## Step 3: Add Your First Contact

1. Click **"+ Add Wallet"** button
2. Fill in the form:
   ```
   Contact Name: John Doe
   Wallet Address: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
   Notes: Business partner (optional)
   ☐ Mark as favorite
   ```
3. Click **"Add Contact"**

## Step 4: Send Money to a Contact

### Method A: From Contacts Page

1. Go to **Contacts** page
2. Find your contact
3. Click **"💸 Send Money"**
4. Enter amount and confirm

### Method B: From Dashboard

1. Click **"Send Money"** on dashboard
2. Click **"📇 Select from Contacts"**
3. Choose a contact
4. Enter amount and confirm

## Features Overview

### ✅ What You Can Do:

- ✨ Add unlimited wallet addresses
- 🔍 Search contacts by name or address
- ⭐ Mark favorites for quick access
- ✏️ Edit contact details
- 🗑️ Delete contacts
- 📋 Copy wallet addresses
- 💸 Send money with one click

### 🎨 UI Features:

- Beautiful gradient cards
- Responsive design (mobile & desktop)
- Real-time search
- Smooth animations
- Dark mode support

## Wallet Address Format

Contacts support flexible address formats:

- **Ethereum Style**: `0x` + 40 hex characters
- **CBDC Style**: `CBDC-` + alphanumeric
- **Other Formats**: Any valid string identifier

Example:

- `0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb`
- `CBDC-6fdd63e85941`

## Testing the Feature

### Test Wallet Addresses (for development):

```
0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed
0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359
0xdbF03B407c01E7cD3CBea99509d93f8DDDC8C6FB
0xD1220A0cf47c7B9Be7A2E6BA89F429762e7b9aDb
```

## Troubleshooting

### Migration Failed?

- Check if you're connected to the correct Supabase project
- Verify you have admin permissions
- Try running the migration again

### Contacts Not Showing?

- Refresh the page (F5)
- Check browser console for errors
- Verify you're logged in
- Ensure migration was successful

### Can't Add Contact?

- Verify wallet address format (must start with 0x)
- Check if address already exists
- Ensure all required fields are filled

## Next Steps

1. ✅ Run the database migration
2. ✅ Add some test contacts
3. ✅ Try sending money to a contact
4. ✅ Explore search and filter features
5. ✅ Mark favorites
6. ✅ Test on mobile view

## Need Help?

- 📖 Read the full documentation: `CONTACTS_FEATURE.md`
- 🐛 Check browser console for errors
- 💬 Contact support if issues persist

---

**Your application is ready!** 🎉

Visit: **http://localhost:5173**

Happy coding! 💼✨
