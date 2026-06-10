# CFP Tracker Product Requirements Document

## Product summary
CFP Tracker helps library teams manage conference proposal opportunities, proposal drafts, deadlines, presenter information, submission statuses, outcomes, and post-acceptance work in one shared web app.

## Version 1 audience
Library teams tracking conference submissions together.

## Version 1 goal
Create a working web app where library teams can log in, create a team workspace, track proposals and conferences, manage presenter bios, monitor proposal status, share read-only views, and export proposal data.

## Core user story
As a library team member, I want to track conference proposal opportunities and proposal drafts in one place so our team can see what we are considering, what is due, what has been submitted, what was accepted, and what still needs work.

## Must-have features
1. Email-based login.
2. Team onboarding after first login.
3. Team workspace.
4. Proposal-centered dashboard.
5. Conference/CFP records.
6. Proposal records with owner, status, dates, draft link, submission confirmation, and presentation details.
7. People records with reusable bios and bio type/length.
8. Proposal-to-conference relationship.
9. Proposal-to-people relationship for co-presenters at the database level.
10. Read-only share-link creation.
11. Public read-only share page.
12. CSV, PDF, and Word export.
13. Row-level security so each team can access only its own records.

## Version 1 statuses
- Idea
- Drafting
- Ready for Review
- Submitted
- Accepted
- Slides in Progress
- Presented
- Waitlisted
- Rejected
- Archived

## Conference fields
- Conference name, required
- Organization, required
- Location
- Format: virtual, in-person, hybrid, required
- Conference start date
- Conference end date
- Proposal deadline, required
- CFP URL
- Submission portal URL
- Theme
- Session formats
- Notes

## Proposal fields
- Proposal title, required
- Conference, required
- Status, required
- Primary owner, required
- Short description
- Abstract
- Learning outcomes
- Submission date
- Decision date
- Accepted/rejected result
- Co-presenters
- Tags/topics
- Needed materials
- Notes
- Draft link
- Submission confirmation number or note
- Presentation date/time
- Session format selected
- Review due date

## People fields
- Name, required
- Email
- Bio
- Bio type or length
- Organization
- Role
- Notes

## Needs Attention rules
A proposal should be flagged when:
- Review due date is within 7 days and status is Drafting.
- Proposal deadline is within 14 days and status is not Submitted, Accepted, Presented, Rejected, or Archived.
- Draft link is blank and status is Drafting or Ready for Review.
- Submission confirmation is blank and status is Submitted.
- Proposal is Accepted but presentation date/time is blank.

## Version 1 permissions
- Owner: creates the team, can manage team records.
- Member: can manage proposal, conference, people, and share-link records.
- Public viewer: can view a share page if given an active share link.

## Out of scope for Version 1
- AI proposal drafting.
- Calendar sync.
- Email reminders.
- File uploads.
- Rubric scoring.
- Real-time simultaneous editing.
- Public template gallery.
- Complex permissions.

## Success criteria
CFP Tracker succeeds if a library team can add conferences, add proposals, connect proposals to conferences, assign owners and co-presenters, track status, view upcoming deadlines, export proposal data, share a read-only view, and verify that another team cannot access its records.
