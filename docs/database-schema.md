# EqualVoice Database Schema

## Reports
Collection / table: `reports`

Fields:
- `id` (string): unique report identifier
- `userId` (string | null): authenticated user ID or null for anonymous
- `type` (string): incident type
- `description` (string): incident details
- `anonymous` (boolean): whether the reporter chose anonymous mode
- `evidence` (array<string>): file names or storage references
- `status` (string): `Submitted`, `Under review`, `Resolved`
- `recommendedActions` (array<string>): generated action list
- `createdAt` (timestamp): creation date
- `updatedAt` (timestamp): last modification date

## Users
Collection / table: `users`

Fields:
- `id` (string): user identifier
- `name` (string): display name
- `email` (string): email address
- `phone` (string): optional phone number
- `privacyPreference` (string): `Full`, `Anonymous`, `Confidential`
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

## Trusted Contacts
Collection / table: `trusted_contacts`

Fields:
- `id` (string): unique contact record ID
- `userId` (string): linked user ID or anonymous session key
- `name` (string): contact name
- `contactInfo` (string): phone or email
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

## Evidence Files
Collection / bucket: `evidence_files`

Fields:
- `reportId` (string): linked report ID
- `fileName` (string): original file name
- `storagePath` (string): secure storage reference
- `uploadedAt` (timestamp)
- `uploadedBy` (string|null): user ID or anonymous session

## Notifications
Collection / table: `notifications`

Fields:
- `id` (string)
- `reportId` (string)
- `recipient` (string)
- `type` (string): `TrustedContactAlert`, `StatusUpdate`, `Reminder`
- `sentAt` (timestamp)
- `status` (string)

## Notes
- Use secure storage references for evidence files.
- Encrypt sensitive fields in transit and at rest.
- Support anonymous reports by allowing null user IDs.
