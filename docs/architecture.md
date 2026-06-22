# EqualVoice Platform Architecture

## Goal
Create a focused safety and reporting platform for gender-based harassment, discrimination, abuse, and workplace/school inequality.

## Frontend Architecture
- Single-page flow per page: `index.html`, `report.html`, `my-reports.html`, `support.html`, `emergency.html`
- Shared styling from `assets/css/style.css`
- Shared client logic from `assets/js/app.js`
- Mobile-first responsive layout with accessible navigation and WCAG-friendly contrast.
- Future-ready placeholder hooks for Firebase or Supabase integration.

## Component Breakdown
- `site-header`: sticky navigation and brand anchor
- `hero`: landing message and call-to-action
- `form-card`: guided report workflow container
- `form-step`: step-by-step reporting sections
- `support-list`: support services cards and trusted contact guidance
- `report-list` / `report-card`: saved report dashboard
- `alert-panel`: emergency status and geolocation support

## JavaScript Architecture
- Modular page initialization based on DOM content and `data-page` attributes
- Local storage persistence for `reports` and `trusted contacts`
- Validation functions for required fields and step transitions
- Recommendation engine keyed by incident type
- Backend integration shell for future Firebase/Supabase sync

## Data Flow
1. User navigates to `report.html`
2. User completes guided report form
3. Client validates each step locally
4. Report object is saved to local storage
5. Report appears in `my-reports.html`
6. Emergency page captures trusted contact data and geolocation

## Security & Privacy
- Anonymous reporting option available
- Local-only storage by default for privacy preservation
- Prepared backend connectors can be extended with auth, encryption, and secure file upload
- Clear disclaimers when browser features are unavailable

## Future Scalability
- Add authentication layer (Firebase Auth / Supabase Auth)
- Add secure file storage (Firebase Storage / Supabase Storage)
- Move local persistence to a backend database
- Add notifications and email alerts via backend functions
- Support multi-language and accessibility enhancements
