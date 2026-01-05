# 💼 Wallet Contacts Feature

## Overview

The Wallet Contacts feature allows users to save frequently used wallet addresses for quick and easy transactions. This eliminates the need to manually enter wallet addresses every time you send money.

## Features

### ✨ Core Functionality

- **Add Contacts**: Save wallet addresses with custom names and notes
- **Search & Filter**: Quickly find contacts by name or wallet address
- **Favorites**: Mark important contacts as favorites for quick access
- **Edit & Delete**: Manage your saved contacts easily
- **Quick Send**: Send money to contacts with a single click
- **Contact Selector**: Choose from saved contacts when sending money

### 🎨 User Interface

- **Beautiful Card Layout**: Modern, responsive design with gradient backgrounds
- **Real-time Search**: Instant filtering as you type
- **Avatar Initials**: Automatic avatar generation from contact names
- **Favorite Indicators**: Visual stars for favorite contacts
- **Empty States**: Helpful messages when no contacts exist

### 🔒 Security

- **Row Level Security (RLS)**: Users can only access their own contacts
- **Unique Constraints**: Prevents duplicate wallet addresses
- **Validation**: Ethereum-style address validation (0x + 40 hex characters)

## Database Setup

### Run the Migration

1. Open your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Open the file: `migrations/create_wallet_contacts.sql`
4. Copy and paste the entire SQL content
5. Click **Run** to execute the migration

The migration creates:

- `wallet_contacts` table with proper schema
- RLS policies for security
- Indexes for performance
- Triggers for automatic timestamp updates

## Usage Guide

### Adding a Contact

1. Navigate to **Contacts** page from the sidebar or bottom navigation
2. Click **"+ Add Wallet"** button
3. Fill in the form:
   - **Contact Name**: e.g., "John Doe" (required)
   - **Wallet Address**: e.g., "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb" (required)
   - **Notes**: Optional description or reminder
   - **Mark as Favorite**: Optional checkbox
4. Click **"Add Contact"** to save

### Sending Money to a Contact

**Method 1: From Contacts Page**

1. Go to **Contacts** page
2. Find your contact
3. Click **"💸 Send Money"** button
4. The send dialog opens with the address pre-filled

**Method 2: From Dashboard**

1. Click **"Send Money"** on the dashboard
2. Click **"📇 Select from Contacts"**
3. Choose a contact from the list
4. The wallet address is automatically filled

### Managing Contacts

- **Search**: Use the search box to filter contacts by name or address
- **Edit**: Click the **"✏️ Edit"** button on any contact card
- **Delete**: Click the **"🗑️ Delete"** button (with confirmation)
- **Copy Address**: Click **"📋 Copy"** to copy the wallet address
- **Toggle Favorite**: Click the **⭐** star icon

## File Structure

```
src/
├── stores/
│   └── contacts.js          # Pinia store for contacts management
├── pages/
│   ├── ContactsPage.vue     # Main contacts page
│   └── IndexPage.vue        # Enhanced with contact selector
├── router/
│   └── index.js             # Added /contacts route
└── layouts/
    └── MainLayout.vue       # Added contacts navigation

migrations/
└── create_wallet_contacts.sql  # Database migration
```

## API Reference

### Contacts Store (`useContactsStore`)

#### State

- `contacts`: Array of contact objects
- `loading`: Boolean loading state
- `error`: Error message string

#### Getters

- `getContactByAddress(address)`: Find contact by wallet address
- `getContactsByName(searchTerm)`: Search contacts by name
- `sortedContacts`: Contacts sorted alphabetically by name

#### Actions

- `fetchContacts(userId)`: Load all contacts for a user
- `addContact(userId, contactData)`: Create a new contact
- `updateContact(contactId, updates)`: Update existing contact
- `deleteContact(contactId)`: Remove a contact
- `toggleFavorite(contactId)`: Toggle favorite status
- `clearContacts()`: Clear all contacts from store

## Contact Object Schema

```javascript
{
  id: UUID,
  user_id: UUID,
  name: String,              // Max 100 characters
  wallet_address: String,    // Ethereum-style address
  notes: String,             // Optional, max 500 characters
  is_favorite: Boolean,
  created_at: Timestamp,
  updated_at: Timestamp
}
```

## Validation Rules

### Wallet Address

- Must start with "0x"
- Followed by exactly 40 hexadecimal characters
- Pattern: `^0x[a-fA-F0-9]{40}$`
- Example: `0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb`

### Contact Name

- Required field
- Maximum 100 characters
- Can contain letters, numbers, and spaces

### Notes

- Optional field
- Maximum 500 characters

## Responsive Design

### Desktop (1024px+)

- Grid layout with 3 columns
- Sidebar navigation visible
- Larger contact cards

### Tablet (768px - 1023px)

- Grid layout with 2 columns
- Collapsible sidebar
- Medium-sized contact cards

### Mobile (< 768px)

- Single column layout
- Bottom navigation bar
- Full-width contact cards
- Touch-optimized buttons

## Keyboard Shortcuts

- **Ctrl/Cmd + K**: Focus search box (when on contacts page)
- **Escape**: Close modals
- **Enter**: Submit forms

## Best Practices

1. **Verify Addresses**: Always double-check wallet addresses before saving
2. **Use Descriptive Names**: Make contact names clear and recognizable
3. **Add Notes**: Include context like "Business Partner" or "Family Member"
4. **Regular Cleanup**: Remove contacts you no longer use
5. **Backup Important Addresses**: Keep a separate backup of critical wallet addresses

## Troubleshooting

### Contacts Not Loading

- Check your internet connection
- Verify you're logged in
- Ensure the migration was run successfully
- Check browser console for errors

### Can't Add Contact

- Verify the wallet address format is correct
- Ensure you haven't already added this address
- Check that all required fields are filled

### Contact Not Appearing in Send Dialog

- Refresh the page
- Check if the contact was saved successfully
- Verify the contacts store is loaded

## Future Enhancements

Potential features for future versions:

- Import/Export contacts
- Contact groups/categories
- Transaction history per contact
- Contact verification status
- QR code scanning for adding contacts
- Contact sharing (encrypted)
- Bulk operations
- Contact analytics

## Support

If you encounter any issues:

1. Check the browser console for errors
2. Verify the database migration was successful
3. Ensure RLS policies are enabled
4. Check Supabase logs for backend errors

---

**Version**: 1.0.0  
**Last Updated**: January 2026  
**Compatibility**: Rupee CBDC Wallet v1.0+
