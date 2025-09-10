# Role-Based Dashboard Implementation

## Overview
The dashboard now supports a two-tab layout (Personal/HR) that dynamically displays content based on the user's selected role during onboarding.

## Components

### 1. DashboardTabs (`src/components/UI/DashboardTabs.tsx`)
- Tab navigation component for switching between Personal and HR views
- Shows role descriptions and icons
- Handles active state styling

### 2. PersonalDashboard (`src/pages/Dashboard/PersonalDashboard.tsx`)
- Job search focused dashboard for personal users
- Features: Applications tracking, saved jobs, interview scheduling
- Mock data for demonstration

### 3. HRDashboard (`src/pages/Dashboard/HRDashboard.tsx`)
- Recruitment focused dashboard for HR professionals
- Features: Candidate management, job postings, hiring metrics
- Mock data for demonstration

### 4. Main Dashboard (`src/pages/Dashboard/Dashboard.tsx`)
- Container component that manages role switching
- Integrates with OnboardingContext for role detection
- Supports URL parameters for testing

## Features

### Role Detection
- Automatically detects user role from onboarding data
- Falls back to default role if no onboarding data exists
- Supports URL parameters for testing (`?role=personal` or `?role=hr`)

### Testing
- **Test Onboarding** button in sidebar - Opens onboarding modal
- **Test Role Switch** button in sidebar - Switches between Personal/HR views
- URL parameters for direct role testing

### Responsive Design
- Mobile-friendly tab layout
- Consistent card-based design
- Smooth transitions and hover effects

## Usage

### For Users
1. Complete onboarding and select your role (Personal or HR)
2. Dashboard automatically shows appropriate view
3. Use tabs to switch between roles if needed

### For Development
1. Use "Test Role Switch" button in sidebar
2. Or navigate to `/dashboard?role=personal` or `/dashboard?role=hr`
3. Use "Test Onboarding" to test the full onboarding flow

## Data Flow
```
OnboardingContext → getUserRole() → Dashboard → Role-Based Component
```

## Future Enhancements
- Real data integration instead of mock data
- Role-specific API endpoints
- Advanced role permissions
- Customizable dashboard widgets
