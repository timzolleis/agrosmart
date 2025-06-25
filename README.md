# AgroSmart 🌾

A modern farm management application built with React Router, TypeScript, and Prisma. AgroSmart helps farmers track their livestock, manage herds, and maintain detailed pasture journals for better agricultural decision-making.

## 🚀 Features

### 📱 **Core Functionality**
- **Multi-Farm Management**: Support for multiple farms with easy switching
- **Herd Management**: Track and organize livestock herds
- **Pasture Journal**: Detailed logging of pasture usage and herd movements
- **User Authentication**: Secure login and registration system

### 🛠️ **Technical Features**
- **Modern Stack**: Built with React Router v7, TypeScript, and Prisma ORM
- **Real-time UI**: Server-side rendering with hot module replacement
- **Type Safety**: Full TypeScript coverage with Zod validation
- **Database**: PostgreSQL with Prisma for robust data management
- **Internationalization**: Multi-language support with i18next
- **Component Library**: Radix UI components with Tailwind CSS styling

### 🎨 **User Experience**
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Dark Mode Support**: Built-in theme switching
- **Interactive Tables**: Sortable, paginated data tables with search
- **Form Validation**: Real-time validation with helpful error messages
- **Toast Notifications**: User-friendly feedback for all actions

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **pnpm** (recommended package manager)
- **PostgreSQL** database
- **Git**

## ⚡ Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd agrosmart
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/agrosmart"
BETTER_AUTH_SECRET="your-secret-key-here"
BETTER_AUTH_URL="http://localhost:5173"
```

### 4. Database Setup
```bash
# Generate Prisma client
pnpm run generate:prisma

# Run database migrations
pnpm run migrate

# Optional: Seed the database with sample data
pnpm prisma db seed
```

### 5. Start Development Server
```bash
pnpm run dev
```

Your application will be available at `http://localhost:5173`.

## 🏗️ Project Structure

```
agrosmart/
├── app/                          # Application source code
│   ├── components/               # Reusable UI components
│   │   ├── ui/                  # Base UI components (buttons, forms, etc.)
│   │   ├── common/              # Shared components
│   │   ├── farm/                # Farm-specific components
│   │   └── pasture-journal/     # Pasture journal components
│   ├── modules/                 # Feature modules
│   │   ├── authentication/     # Auth logic
│   │   ├── farm/               # Farm management
│   │   ├── herd/               # Herd management
│   │   └── pasture-journal/    # Pasture tracking
│   ├── routes/                 # Page routes and layouts
│   ├── lib/                    # Utilities and configurations
│   └── utils/                  # Helper functions
├── prisma/                     # Database schema and migrations
├── public/                     # Static assets and translations
└── generated/                  # Generated code (Prisma client, etc.)
```

## 📚 Usage Guide

### Getting Started
1. **Register an Account**: Visit `/register` to create your account
2. **Create Your First Farm**: After login, you'll be prompted to create a farm
3. **Add Herds**: Navigate to herd management to add your livestock groups
4. **Track Pasture Usage**: Use the pasture journal to log field usage and herd movements

### Managing Farms
- **Switch Farms**: Use the farm switcher in the sidebar to switch between multiple farms
- **Farm Settings**: Access farm-specific settings and information

### Pasture Journal
- **Create Entries**: Log which herd is using which field on specific dates
- **View History**: Browse historical pasture usage with sortable tables
- **Edit & Delete**: Modify or remove entries as needed
- **Filter Data**: Sort by date, field name, or herd for easy tracking

### User Interface
- **Sidebar Navigation**: Quick access to all features
- **Responsive Design**: Optimized for desktop and mobile use
- **Search & Filter**: Find specific records quickly
- **Export Options**: (Coming soon) Export data for external analysis
