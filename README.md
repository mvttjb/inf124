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
    images.ts                         # Figma asset URLs (expire after 7 days — re-export to refresh)

  components/
    Layout.tsx                        # Sidebar + main content wrapper (wraps Navbar + <main>)
    Navbar.tsx                        # Left nav bar with links to all main routes + sign out
    WireframeScreen.tsx               # Reusable screen display with browser chrome & skeleton loader
    WireframeScreen.module.css        # Styles for WireframeScreen

    auth/
      AuthSidebar.tsx                 # Dark left panel shown on auth pages (brand, description, feature highlights)
      GoogleSsoButton.tsx             # "Google SSO" button + AuthSocialDivider helper

    browse/
      BrowseGroupCard.tsx             # Card used in /search — shows schedule, location, member progress bar, join/waitlist CTA

    dashboard/
      StudyGroupCard.tsx              # Card for groups the user already belongs to (hero image, live badge, action button)
      RecommendedGroupCard.tsx        # Compact card for suggested groups (bookmark, join button, member avatars)

    ui/                               # shadcn/ui primitives (do not edit directly)
      badge.tsx                       # Badge — default / secondary / destructive / outline variants
      button.tsx                      # Button — default / outline / ghost / link / destructive variants + sizes
      card.tsx                        # Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
      input.tsx                       # Input — styled text input

  app/
    layout.tsx                        # Root layout (sets <html> / <body>, global font)
    page.tsx                          # Root route — redirects to /login

    (auth)/
      layout.tsx                      # Auth layout — two-column (AuthSidebar + form area)
      login/page.tsx                  # Screen 1: email/password login form
      register/page.tsx               # Screen 2: new account registration form
      reset-password/page.tsx         # Screen 3: forgot-password / reset form

    (dashboard)/
      layout.tsx                      # Dashboard layout — wraps pages in <Layout> (Navbar + main)
      dashboard/page.tsx              # Screen 4: user's groups, recommended groups, calendar
      search/page.tsx                 # Screen 5: browse & filter groups (BrowseGroupCard grid)
      groups/[id]/page.tsx            # Screen 6: group details — info, members, join/leave
      create-group/page.tsx           # Screen 7: multi-step group creation form
      requests/page.tsx               # Screen 9: incoming/outgoing join requests & invitations

    profile/
      page.tsx                        # Screen 8: user profile, bio, availability, settings

  lib/
    browseGroups.ts                   # Mock data + filtering logic for group search
    requests.ts                       # Mock data for join requests / invitations
    utils.ts                          # cn() helper (clsx + tailwind-merge)

  types/
    browse.ts                         # BrowseGroup type used by /search and BrowseGroupCard
    dashboard.ts                      # StudyGroupCardData and RecommendedGroupCardData types

  globals.d.ts                        # Global TypeScript declarations
  index.css                           # CSS variables & Tailwind base styles
```
