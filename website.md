This is EduSphere — an EAMCET coaching platform built with React + TypeScript (Vite) on the frontend and Supabase as the backend (Auth, Database, Storage, Edge Functions). Payments are handled via Razorpay. The app has three distinct user types: public visitors, students, and admins.
The architecture is a SPA (Single Page Application) with client-side routing. Supabase Edge Functions handle sensitive server-side logic like payment verification, batch allotment, and test submission. The database has 10 tables covering batches, payments, users, classes, tests, and doubts. sql_codes_used.txt has all the sql queries used for website and table structure also go through it.

Public Pages

Landing.tsx — Homepage showing platform branding and batch/course cards with pricing. Has CTA buttons leading to the payment page.
Login.tsx — Student login page with email and password. Redirects to dashboard on success.
Payment.tsx — Collects student name, phone, email and processes payment via Razorpay. Inserts record into payments table on success.
PaymentSuccess.tsx — Confirmation page shown after successful payment with payment ID and course details. One-time view page.
PrivacyPolicy / TermsConditions / RefundPolicy — Static legal pages required for Razorpay compliance. No database interaction.

Student Pages

Dashboard.tsx — Main authenticated student interface with sidebar navigation and all student sections rendered as sub-views.
TestsSection.tsx — Lists all available exams with the student's attempt status. Shows Attempt / Retake / View Result buttons accordingly.
TestAttemptPage.tsx — Full  exam interface with timer, auto-save, and submit. Calls submit-test Edge Function on completion.
TestResultPage.tsx — Shows score and all  questions with student's answers vs correct answers highlighted green/red.
MyClasses section — Shows today's  live class cards (Maths, Physics, Chemistry) with teacher photo and YouTube live link button.
RecordedClasses section — Date picker to browse recorded classes, shows 3 subject cards for the selected date with watch buttons.
DoubtsClasses section — Lists upcoming doubt sessions with date, time, subject and Google Meet join button. Visible only to Lakshya batch.
Profile section — Displays student's personal details, batch info, and exam statistics like total tests attempted and average score.


Admin Pages

AdminLogin.tsx — Email/password login page specifically for admins. Uses Supabase Auth with admin role.
AdminDashboard.tsx — Overview stats page showing total students, revenue, today's classes, and pending allotments.
AllotBatches.tsx — Form to create student accounts. Triggers the allot-batch Edge Function.
AdminDailyClasses.tsx — Add and manage today's live classes withnYouTube live links.
AdminRecordedClasses.tsx — Add and manage recorded class entries with YouTube video links.
AdminDoubtsClasses.tsx — Schedule and manage doubt-clearing sessions with Google Meet links for Lakshya batch.