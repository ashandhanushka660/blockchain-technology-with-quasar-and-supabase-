# 🏦 Rupee CBDC Prototype - Sri Lankan Digital Currency Wallet

A premium, mobile-first Progressive Web App (PWA) for managing Sri Lankan Rupee Central Bank Digital Currency (CBDC). Built with Vue 3, Quasar Framework, and Supabase.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-ISC-green.svg)
![Vue](https://img.shields.io/badge/Vue-3.5-brightgreen.svg)
![Quasar](https://img.shields.io/badge/Quasar-2.18-blue.svg)

## ✨ Features

### 🔐 Authentication & Security

- **Email/Password Authentication** - Secure user registration and login
- **Biometric Authentication** - Premium Face ID and Fingerprint mockup UI
- **Route Guards** - Protected dashboard and wallet pages
- **Session Management** - Persistent authentication state

### 💰 Wallet Core Features

- **Real-time Balance Display** - Live LKR CBDC balance updates
- **Send Money** - Transfer funds to other wallet addresses
- **Receive Money** - Generate QR codes for receiving payments
- **Transaction History** - Complete transaction log with filters
- **Wallet Address Management** - Unique CBDC wallet IDs

### 🎨 Premium UI/UX

- **Dark Mode Support** - Toggle between light and dark themes
- **Glassmorphism Design** - Modern, premium aesthetic
- **Responsive Layout** - Optimized for mobile, tablet, and desktop
- **Smooth Animations** - Micro-interactions and transitions
- **Premium Color Palette** - Vibrant gradients and harmonious colors

### 🔔 Real-time Features

- **Live Notifications** - Instant transaction alerts via Supabase Realtime
- **Browser Notifications** - Native notification support
- **Notification Center** - In-app notification management
- **Unread Badge** - Visual indicator for new notifications

### 📱 Progressive Web App

- **Offline Support** - Service worker for offline functionality
- **Install Prompt** - Add to home screen capability
- **App Manifest** - Native app-like experience
- **Optimized Performance** - Fast loading and smooth interactions

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- Modern web browser

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd rupee-cbdc-prototype
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the root directory:

   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase database**

   Run the following SQL in your Supabase SQL editor:

   ```sql
   -- Create profiles table
   CREATE TABLE profiles (
     id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
     email TEXT UNIQUE NOT NULL,
     full_name TEXT,
     wallet_address TEXT UNIQUE NOT NULL,
     balance DECIMAL(15, 2) DEFAULT 10000.00,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Create transactions table
   CREATE TABLE transactions (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
     receiver_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
     receiver_wallet_id TEXT NOT NULL,
     amount DECIMAL(15, 2) NOT NULL CHECK (amount > 0),
     type TEXT NOT NULL DEFAULT 'transfer',
     description TEXT,
     status TEXT DEFAULT 'completed',
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Function to generate unique wallet address
   CREATE OR REPLACE FUNCTION generate_wallet_address()
   RETURNS TEXT AS $$
   DECLARE
     new_address TEXT;
     address_exists BOOLEAN;
   BEGIN
     LOOP
       new_address := 'CBDC-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8));
       SELECT EXISTS(SELECT 1 FROM profiles WHERE wallet_address = new_address) INTO address_exists;
       EXIT WHEN NOT address_exists;
     END LOOP;
     RETURN new_address;
   END;
   $$ LANGUAGE plpgsql;

   -- Trigger to create profile on user signup
   CREATE OR REPLACE FUNCTION public.handle_new_user()
   RETURNS TRIGGER AS $$
   BEGIN
     INSERT INTO public.profiles (id, email, full_name, wallet_address)
     VALUES (
       NEW.id,
       NEW.email,
       COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
       generate_wallet_address()
     );
     RETURN NEW;
   END;
   $$ LANGUAGE plpgsql SECURITY DEFINER;

   CREATE TRIGGER on_auth_user_created
     AFTER INSERT ON auth.users
     FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

   -- Trigger to handle balance updates on transaction
   CREATE OR REPLACE FUNCTION on_transaction_inserted()
   RETURNS TRIGGER AS $$
   BEGIN
     -- Deduct from sender
     UPDATE profiles SET balance = balance - NEW.amount WHERE id = NEW.sender_id;
     -- Add to receiver
     UPDATE profiles SET balance = balance + NEW.amount WHERE id = NEW.receiver_id;
     RETURN NEW;
   END;
   $$ LANGUAGE plpgsql;

   CREATE TRIGGER transaction_balance_update
     AFTER INSERT ON transactions
     FOR EACH ROW EXECUTE FUNCTION on_transaction_inserted();

   -- Enable Row Level Security
   ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
   ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

   -- Profiles policies
   CREATE POLICY "Users can view own profile"
     ON profiles FOR SELECT
     USING (auth.uid() = id);

   CREATE POLICY "Users can update own profile"
     ON profiles FOR UPDATE
     USING (auth.uid() = id);

   -- Transactions policies
   CREATE POLICY "Users can view own transactions"
     ON transactions FOR SELECT
     USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

   CREATE POLICY "Users can insert transactions"
     ON transactions FOR INSERT
     WITH CHECK (auth.uid() = sender_id);

   -- Enable Realtime
   ALTER PUBLICATION supabase_realtime ADD TABLE transactions;
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**

   Navigate to `http://localhost:5173`

## 📦 Build for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

## 🌐 Deploy to Vercel

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

**Quick deploy:**

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

## 🛠️ Tech Stack

- **Frontend Framework**: Vue 3 (Composition API)
- **UI Framework**: Quasar 2.18
- **Styling**: Tailwind CSS 4.1
- **State Management**: Pinia 3.0
- **Routing**: Vue Router 4.6
- **Backend**: Supabase (PostgreSQL + Realtime)
- **Authentication**: Supabase Auth
- **Build Tool**: Vite 7.3
- **PWA**: vite-plugin-pwa
- **QR Code**: qrcode.vue

## 📁 Project Structure

```
rupee-cbdc-prototype/
├── src/
│   ├── assets/          # Static assets
│   ├── css/             # Global styles
│   ├── layouts/         # Layout components
│   │   └── MainLayout.vue
│   ├── pages/           # Page components
│   │   ├── IndexPage.vue       # Dashboard
│   │   ├── LoginPage.vue       # Login
│   │   ├── RegisterPage.vue    # Registration
│   │   ├── BiometricPage.vue   # Biometric auth
│   │   └── HistoryPage.vue     # Transaction history
│   ├── router/          # Vue Router configuration
│   ├── stores/          # Pinia stores
│   │   ├── auth.js             # Authentication state
│   │   ├── theme.js            # Theme management
│   │   └── notifications.js    # Notification state
│   ├── App.vue          # Root component
│   ├── main.js          # Application entry point
│   └── supabase.js      # Supabase client
├── public/              # Public static files
├── .env                 # Environment variables (local)
├── vercel.json          # Vercel configuration
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind configuration
└── package.json         # Dependencies
```

## 🎯 Roadmap

- [x] Phase 1: Authentication & Supabase Integration
  - [x] User registration and login
  - [x] Auth state management
  - [x] Route guards
- [x] Phase 2: Wallet Core Features
  - [x] Send money functionality
  - [x] Transaction history
  - [x] Receive money with QR codes
- [x] Phase 3: Premium Enhancements
  - [x] Biometric authentication UI
  - [x] Dark mode support
  - [x] Real-time notifications
  - [x] PWA optimization

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

ISC License

## 🙏 Acknowledgments

- Quasar Framework for the excellent UI components
- Supabase for the backend infrastructure
- Vue.js team for the amazing framework

## 📞 Support

For support, please open an issue in the GitHub repository.

---

**Made with ❤️ for Sri Lankan Digital Currency Innovation**
