
# HR Management Application

A comprehensive HR management application built with React, TypeScript, and Supabase.

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd hr-management-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory based on the `.env.example` file:

```bash
cp .env.example .env
```

Then, edit the `.env` file and add your Supabase project URL and anon key:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

You can find these values in your [Supabase dashboard](https://app.supabase.com) under Project Settings > API.

### 4. Start the development server

```bash
npm run dev
```

### 5. Build for production

```bash
npm run build
```

## Supabase Setup

For detailed instructions on setting up the Supabase backend, see the [Supabase Setup Guide](./supabase/README.md).
