Matthew Bautista, Steven Lee, Logan Szeto, Lance Vu

## Screens

| Screen | Route | Description |
|--------|-------|-------------|
| 1 – Login | `/login` | Auth — email/password login |
| 2 – Register | `/register` | Auth — new account sign-up |
| 3 – Reset Password | `/reset-password` | Auth — forgot password flow |
| 4 – Dashboard | `/dashboard` | Main hub with groups & calendar |
| 5 – Group Search | `/search` | Browse & filter groups |
| 6 – Group Details | `/group-details` | Full group profile & join |
| 7 – Create Group | `/create-group` | Multi-step group creation form |
| 8 – Profile | `/profile` | User profile & settings |
| 9 – Availability | `/availability` | Weekly availability grid |
| 10 – Requests | `/requests` | Manage invitations & join requests | 


## Setup:  
npm install
npm start

App runs at http://localhost:3000 and opens to `/login` by default.

## Project Structure (Idea but not all pages are implemented yet)

```
src/
  assets/
    images.ts           # Figma asset URLs (expire after 7 days — re-export to refresh)
  components/
    Layout.tsx          # Sidebar + main content wrapper
    Layout.module.css
    Navbar.tsx          # Left navigation bar
    Navbar.module.css
    WireframeScreen.tsx # Reusable screen display with browser chrome
    WireframeScreen.module.css
  pages/
    LoginPage.tsx
    RegisterPage.tsx
    ResetPasswordPage.tsx
    DashboardPage.tsx
    GroupSearchPage.tsx
    GroupDetailsPage.tsx
    CreateGroupPage.tsx
    ProfilePage.tsx
    AvailabilityPage.tsx
    ManageRequestsPage.tsx
  App.tsx               # Router config
  index.tsx             # Entry point
  index.css             # Global CSS variables & resets
```
