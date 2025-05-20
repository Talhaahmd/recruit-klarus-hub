
# Supabase Backend Setup for HR Application

This document provides step-by-step instructions for setting up the Supabase backend for the HR application.

## Prerequisites

1. Create a [Supabase](https://supabase.com) account if you don't have one already.
2. Create a new project in the Supabase dashboard.

## Setup Steps

### 1. Set up the database schema

1. Go to the **SQL Editor** in your Supabase dashboard.
2. Copy the contents of `schema.sql` in this directory.
3. Paste it into the SQL editor and run the queries to set up all tables and RLS policies.

### 2. Set up environment variables

Create a `.env` file in the root directory of your project with the following variables:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Replace `your-project-id` and `your-anon-key` with your actual Supabase project ID and anon key.

### 3. Enable authentication

1. Go to the **Authentication** section in your Supabase dashboard.
2. Under **Settings** > **Auth Providers**, configure the providers you want to use.
3. For email/password authentication, make sure it's enabled and configure any email templates you want.

### 4. Set up storage

The schema already includes setup for the `candidate-files` bucket, but you should verify it's created correctly:

1. Go to **Storage** in your Supabase dashboard.
2. Verify that the `candidate-files` bucket exists and is public (allows unauthenticated reads).

### 5. Database Relationships

The schema includes all necessary foreign key relationships:
- `candidates.job_id` references `jobs.id`
- All tables have `user_id` which references `auth.users.id`

### 6. Row Level Security (RLS)

All tables have RLS enabled with policies that ensure users can only access their own data. The policies are:
- SELECT: Users can view their own records
- INSERT: Users can create records with their user_id
- UPDATE: Users can update their own records
- DELETE: Users can delete their own records

## API Functions

The following SQL functions are available for special operations:
- `increment_job_applicants(job_id)`: Increases the applicant count for a job
- `decrement_job_applicants(job_id)`: Decreases the applicant count for a job

## Testing the Setup

After setting up the Supabase backend, you can verify it works correctly by:

1. Signing up a new user
2. Creating a job posting
3. Adding a candidate for that job
4. Verifying that the job's applicant count increases

If everything is working as expected, you've successfully set up your Supabase backend!
