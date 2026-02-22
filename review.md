# EduSphere Codebase Review

## Scope
- Reviewed all frontend pages/components under `pages/` and `components/`.
- Reviewed all Supabase Edge Functions under `supabase/functions/`.
- Reviewed SQL schema, RLS, and setup instructions in `sql_codes_used.txt`.

## Critical

1. Unauthenticated account provisioning endpoint (`allot-batch`)
- Where: `supabase/functions/allot-batch/index.ts:13`, `supabase/functions/allot-batch/index.ts:66`, `supabase/functions/allot-batch/index.ts:99`
- Problem: The function uses service-role privileges but never validates the caller's JWT or admin role. Any caller who can hit the function can create student accounts and grant access.
- Fix: Read `Authorization` header, verify JWT user via Supabase Auth, enforce `app_metadata.role === 'admin'`, then run privileged operations.

2. Unauthenticated test submission endpoint allows user impersonation
- Where: `supabase/functions/submit-test/index.ts:22`, `supabase/functions/submit-test/index.ts:30`, `supabase/functions/submit-test/index.ts:64`, `supabase/functions/submit-test/index.ts:90`
- Problem: `user_id` is accepted from client payload and trusted under service-role. Attackers can overwrite any student's responses/attempts.
- Fix: Authenticate request JWT, derive `user_id` from token server-side, ignore client-provided `user_id`.

3. Payment amount and batch are client-controlled end-to-end
- Where: `pages/Payment.tsx:54`, `pages/Payment.tsx:60`, `pages/Payment.tsx:78`, `pages/Payment.tsx:87`, `supabase/functions/create-razorpay-order/index.ts:54`, `supabase/functions/create-razorpay-order/index.ts:71`, `supabase/functions/verify-razorpay-payment/index.ts:63`
- Problem: Price and batch are sent from browser and trusted by both order creation and payment verification. A tampered client can underpay or mismatch batch/amount.
- Fix: Send only `batch_id`; fetch authoritative price on server from DB; persist expected order metadata server-side and verify against Razorpay response.

4. RLS policies intended for service role are globally permissive
- Where: `sql_codes_used.txt:208`, `sql_codes_used.txt:220`, `sql_codes_used.txt:291`
- Problem: Policies named "Service role ..." do not specify `TO service_role`. With typical Supabase grants, this can allow anon/authenticated write access (`payments` insert, `users` insert, `exam_attempts` all).
- Fix: Drop/recreate policies with explicit roles and strict predicates. For service-role workflows, remove unnecessary permissive RLS policies entirely.

5. Hardcoded admin credentials in repository SQL setup
- Where: `sql_codes_used.txt:476`, `sql_codes_used.txt:477`, `sql_codes_used.txt:478`
- Problem: Real admin email/password is committed in plaintext.
- Fix: Rotate immediately, remove credentials from repo, keep setup docs secret-free.

6. Batch allotment can proceed without successful payment
- Where: `supabase/functions/allot-batch/index.ts:73`, `supabase/functions/allot-batch/index.ts:75`, `supabase/functions/allot-batch/index.ts:89`
- Problem: Function checks only `access_granted`; it does not require `payment_status = 'success'`.
- Fix: Include and enforce `payment_status = 'success'` in payment lookup before account creation.

## High

1. Public file upload endpoint with service-role privileges
- Where: `supabase/functions/upload-teacher-photo/index.ts:15`, `supabase/functions/upload-teacher-photo/index.ts:22`, `supabase/functions/upload-teacher-photo/index.ts:29`, `supabase/functions/upload-teacher-photo/index.ts:40`
- Problem: No auth check, no size cap, no MIME/content validation; public abuse can create storage-cost and content risk.
- Fix: Require admin auth, enforce max payload size, strict MIME/extension/byte-signature checks.

2. Payment verification does not confirm capture/amount/order with Razorpay API
- Where: `supabase/functions/verify-razorpay-payment/index.ts:35`, `supabase/functions/verify-razorpay-payment/index.ts:56`
- Problem: Signature check alone is not enough for full payment integrity/replay safety.
- Fix: Fetch payment/order details from Razorpay server-to-server and verify capture status, amount, order_id, and expected batch.

3. Non-atomic user creation flow in allotment
- Where: `supabase/functions/allot-batch/index.ts:99`, `supabase/functions/allot-batch/index.ts:110`, `supabase/functions/allot-batch/index.ts:126`
- Problem: If payment update fails after auth user/profile insert, system is left inconsistent.
- Fix: Use transactional DB function, or compensating rollback for all created artifacts on failure.

4. Race condition on duplicate allotment requests
- Where: `supabase/functions/allot-batch/index.ts:73`, `supabase/functions/allot-batch/index.ts:89`, `supabase/functions/allot-batch/index.ts:126`
- Problem: Parallel requests can both pass pre-check before `access_granted` flips.
- Fix: Lock/update payment row first with conditional update (`WHERE access_granted=false`) and proceed only on successful row claim.

5. Duplicate charge/order risk in payment UI flow
- Where: `pages/Payment.tsx:48`, `pages/Payment.tsx:51`, `pages/Payment.tsx:105`, `pages/Payment.tsx:111`, `components/TermsConsentModal.tsx:156`, `components/TermsConsentModal.tsx:160`
- Problem: Continue can be triggered repeatedly; `processing` is reset before async Razorpay verify callback completes.
- Fix: Guard re-entry (`if (processing) return`), disable modal continue while processing, keep busy state until verification completes/fails.

6. Payment success page is incompatible with current RLS and can stall
- Where: `pages/PaymentSuccess.tsx:14`, `pages/PaymentSuccess.tsx:17`, `pages/PaymentSuccess.tsx:22`, `sql_codes_used.txt:202`
- Problem: Public success page queries `payments`, but policy allows select only by authenticated email JWT. Also no `payment_id` leaves loading forever.
- Fix: Move success read to signed backend endpoint/tokenized payload, and set loading false + explicit error when `payment_id` missing.

7. Student password exposed in plain text input
- Where: `pages/AllotBatches.tsx:204`, `pages/AllotBatches.tsx:206`
- Problem: Password is visible on screen and likely shoulder-surfed.
- Fix: Change to `type="password"` and consider generated temp password/reset flow.

8. Admin role setup instructions mismatch implementation
- Where: `sql_codes_used.txt:478`, `pages/AdminLogin.tsx:27`, `sql_codes_used.txt:490`
- Problem: Setup says `user_metadata.role`, code/policies enforce `app_metadata.role`.
- Fix: Standardize on `app_metadata.role` in both docs and code.

## Medium

1. Timezone inconsistency causes class/date mismatches
- Where: `pages/Dashboard.tsx:64`, `pages/AdminDailyClasses.tsx:20`, `pages/AdminRecordedClasses.tsx:21`, `pages/AdminDoubtsClasses.tsx:21`, `pages/AdminDashboard.tsx:43`
- Problem: Student/date filters use UTC date while admin forms use local date normalization.
- Fix: Use one canonical timezone (likely IST) everywhere and query/store consistently.

2. Nondeterministic class selection if multiple rows per subject/date
- Where: `pages/Dashboard.tsx:448`, `pages/Dashboard.tsx:450`, `pages/Dashboard.tsx:614`, `pages/Dashboard.tsx:616`
- Problem: Last iterated row wins with no ordering/uniqueness guarantee.
- Fix: Add DB unique constraint (`date, subject`) or query with deterministic ordering and explicit pick.

3. Silent fetch failures in landing/admin allotment
- Where: `pages/Landing.tsx:18`, `pages/Landing.tsx:24`, `pages/AllotBatches.tsx:30`, `pages/AllotBatches.tsx:39`
- Problem: Errors are ignored; UI can display empty/success-looking states.
- Fix: Handle and surface query errors for each data source.

4. Auto-save race can persist stale answer
- Where: `pages/tests/TestAttemptPage.tsx:192`, `pages/tests/TestAttemptPage.tsx:540`, `pages/tests/TestAttemptPage.tsx:544`
- Problem: Rapid option changes trigger concurrent saves; out-of-order completion can store older choice.
- Fix: Debounce per-question saves, cancel stale requests, or write only latest revision id.

5. `submit-test` trusts client `started_at`
- Where: `supabase/functions/submit-test/index.ts:22`, `supabase/functions/submit-test/index.ts:83`, `supabase/functions/submit-test/index.ts:84`
- Problem: Time taken can be manipulated (negative/invalid durations).
- Fix: Record start time server-side per attempt session and compute duration only on server.

6. PII in logs
- Where: `supabase/functions/create-razorpay-order/index.ts:41`, `pages/tests/TestAttemptPage.tsx:319`, `pages/tests/TestAttemptPage.tsx:321`
- Problem: Body payloads and result payloads are logged verbosely.
- Fix: Remove sensitive logs in production; keep structured minimal audit logs.

7. Hardcoded anon key in frontend source
- Where: `lib/supabase.ts:10`
- Problem: Key rotation/environment separation is harder; accidental misuse risk increases.
- Fix: Move to env vars (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).

8. Router-level guards are absent
- Where: `src/App.tsx:32`, `src/App.tsx:36`, `src/App.tsx:37`, `src/App.tsx:38`, `src/App.tsx:39`, `src/App.tsx:40`
- Problem: Protected pages are directly routable; checks happen inside pages only.
- Fix: Add dedicated `RequireAuth`/`RequireAdmin` wrappers at route level.

9. Retake history is overwritten by schema + upsert strategy
- Where: `supabase/functions/submit-test/index.ts:74`, `supabase/functions/submit-test/index.ts:100` and unique constraints in SQL table definitions
- Problem: Per-attempt history is lost; latest attempt overwrites prior attempt/response records.
- Fix: Add attempt-versioned model (`attempt_id` FK on responses, remove unique overwrite pattern).

## Low

1. Doubts tab shown in mobile nav even without entitlement
- Where: `pages/Dashboard.tsx:248` (unconditional), compared with conditional tabs at `pages/Dashboard.tsx:196`
- Problem: Non-eligible students can still navigate to a restricted stub page.
- Fix: Gate mobile doubts tab with `hasDoubtsAccess` too.

2. Terms page uses placeholder effective date
- Where: `pages/TermsConditions.tsx` (header line with `Effective Date: [Insert Date]`)
- Problem: Legal text appears incomplete.
- Fix: Set actual effective date and version tracking.

3. Duplicate router files can drift
- Where: `App.tsx:33` vs `src/App.tsx:32`
- Problem: Two app router definitions differ (`/dashboard` vs `/dashboard/*`), raising maintenance risk.
- Fix: Keep a single canonical `App.tsx` and delete/ignore duplicate.

4. Tailwind loaded from CDN in production HTML
- Where: `index.html:8`
- Problem: Runtime dependency/perf/CSP hardening issues.
- Fix: Build Tailwind in project pipeline instead of CDN script.

5. Admin email prefilled on login
- Where: `pages/AdminLogin.tsx:7`
- Problem: Exposes internal admin account naming and encourages credential stuffing target selection.
- Fix: Default to blank input.

## Quick Priority Plan
1. Lock down edge functions (`allot-batch`, `submit-test`, `upload-teacher-photo`) with JWT + role checks.
2. Fix payment integrity: server-authoritative pricing and strict Razorpay verification.
3. Repair dangerous RLS policies in `sql_codes_used.txt` and rotate leaked admin credentials.
4. Fix broken payment success flow + duplicate payment race.
5. Standardize date/time handling and improve error handling across dashboard/admin pages.


Short answer: not safely for 1000 concurrent active users in the current state.

1000 registered users: likely fine.
1000 simultaneous users (especially test attempts): risky right now.
Main bottleneck:

TestAttemptPage.tsx (line 240) autosaves all questions every 30s.
With ~160 questions and 1000 concurrent test-takers, that is roughly 160,000 row upserts every 30s (~5,300 row writes/sec), plus per-click saves at TestAttemptPage.tsx (line 193).
Other blockers under load:

Unprotected service-role edge functions (index.ts, index.ts, index.ts).
Race/consistency issues in payment/allotment flows.
If you want, I can next:

Refactor test autosave to delta-only writes.
Add auth/role checks + rate limits to edge functions.
Add a k6 load-test script targeting 1000 concurrent users.