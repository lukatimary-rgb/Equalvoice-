# EqualVoice User Flow

## Overview
The platform guides users through a simple safety reporting experience while providing access to support services and emergency alerts.

## Pages
- `index.html`: Home page with core mission, trust messaging, and action buttons.
- `report.html`: Guided reporting workflow with four steps.
- `my-reports.html`: Dashboard showing saved incident reports and status.
- `support.html`: Support services and safety guidance.
- `emergency.html`: Trusted contact alerts with geolocation status.

## User journey
1. User lands on `index.html`.
2. User navigates to `report.html` to begin a guided incident report.
3. The user completes:
   - Step 1: Choose incident type.
   - Step 2: Describe incident.
   - Step 3: Upload evidence.
   - Step 4: Review recommended actions.
4. User submits the report.
5. The report is saved to local storage.
6. User visits `my-reports.html` to view status and evidence details.
7. If a user needs immediate support, they visit `emergency.html` to send a trusted alert.
8. User can also review support services on `support.html`.

## Decision points
- Incident type determines tailored recommendations.
- Anonymous reporting changes how identity is recorded in the dashboard.
- Geolocation availability changes emergency alert messaging.

## Accessibility
- Clear labels and keyboard-friendly navigation.
- High contrast colors for readability.
- Form validation and live status updates.
