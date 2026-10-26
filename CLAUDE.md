# SDCL Student Portal

Student portal for UniKL Royal College of Medicine Perak (UniKL RCMP), handled by the Student Development and Campus Lifestyle (SDCL) Department. Students submit requests (financial aid, medical outpatient, parking sticker, food coupon) and staff or boards approve them. Fresh build: no data is migrated from the old UNIFA system.

## Domain model

The portal is split into **units**, each with **modules**. Build each unit as a separate module so the Student Residential Unit can be added later without touching the others.

| Unit | Module | Approval flow |
|---|---|---|
| Student Development (SD) | Student Welfare Application | Student -> recommended by SD staff -> Board Committee approves in-system during their meeting (approvers: CEO and Board) |
| Student Development (SD) | Medical Outpatient Application | Student -> HOD / DD approval board. Every approver must approve. **One rejection automatically rejects the whole application.** |
| Campus Lifestyle (CL) | Request Parking Sticker | Student -> any CL staff. Student submits basic vehicle info. Approval is **yearly** (renewal each year). |
| Campus Lifestyle (CL) | Food Coupon | Student -> any CL staff. One-time approval. A digital coupon then appears for the student to claim; staff redeem it; it then expires. Unclaimed coupons do **not** expire. |
| Student Residential (SRD), **coming soon** | CRM for Hostel; CMS | CMS: SRD staff post hostel blogs and room details, shown **publicly** (no login). CRM scope is undecided. |

Welfare and Medical both have **categories with different requirements** (amount, frequency, and supporting documents). Design categories as data (a `categories` table with configurable required fields and documents), not hard-coded — see [Welfare and Medical categories](#welfare-and-medical-categories) for the confirmed list.

## Roles and access
- Roles: Student (User), staff per unit (SD staff, CL staff, SRD staff), System Admin, HOD and DD (Medical approvers), CEO and Board (Welfare approvers).
- Each role can only view and manage what relates to it. Enforce this on the **server** for every endpoint, not just by hiding UI.
- Each role lands on its own dashboard after login.
- System Admin manages staff accounts and the system. (Assumed: only System Admin creates staff accounts and assigns roles; confirm with the client.)
- Reports: each role sees only its own unit's reports. Export format is **PDF only**.

## Authentication
- Microsoft SSO is mandatory. Students use `@s.unikl.edu.my`; all other roles use `@unikl.edu.my`.
- ID and password login exists **only for the development process**. Put it behind an environment flag that is off in production.
- Azure app registration access is available.
- Do not infer the role from the email domain alone. Map the verified Microsoft identity to a role stored in the database.

## Student profile (completed first, before any application)
Fields: Microsoft SSO email and name, student ID, program, current semester (based on the application), contact number, bank name, bank number.

## Welfare and Medical categories
Confirmed category list, amounts, and required documents (source of truth for seeding the `categories` table). All are one-off/one-time unless stated otherwise.

**Student Welfare Application**
| Category | Amount | Notes | Supporting documents |
|---|---|---|---|
| Living Allowance / Accommodation | Up to RM500 | Basic living or accommodation expenses | Bank account / statement |
| Learning Aid | Up to RM1,500 for the entire study period | Laptop or study-related gadgets only; mobile phones and entertainment devices excluded. Applicant must not already receive related financial aid, loans, or sponsorship from external sponsors | Bank account / statement |
| UniKL Meal Initiative (UMI) | Not specified | Basic meals only, not for non-essential food expenses | Bank account / statement |
| Medical Support & Supply | Up to RM200 | One-time per study period, for non-cosmetic medical aids (crutches, arm slings, back supports, prescription glasses) | Health report from a certified specialist doctor |
| Bereavement | RM1,000 (next of kin of a registered student) / RM200 per parent or spouse | Next-of-kin priority: spouse, then parent(s) | Death certificate + proof of relationship |
| Travel Assistance (Bereavement) | RM50 within Peninsular Malaysia / RM300 between East and Peninsular Malaysia | One-off, to return to hometown due to the death of a parent or spouse | Death certificate + proof of relationship |
| Natural Disasters | RM200 per accident | Eligible accidents in Malaysia during active study: floods, storms, thunderstorms, landslides, building collapse, fallen trees, fires | Photos of the disaster + police report |
| Others | Case-by-case | For matters not covered above but significantly affecting safety, well-being, or ability to study; applicant explains the case | Documents as requested by the committee |

**Medical Outpatient Application**
| Category | Amount | Notes | Supporting documents |
|---|---|---|---|
| Medical Outpatient | RM100 per year | Outpatient treatment only (clinic visits, minor procedures, prescribed medications); must submit within 1 month of the treatment/visit date | Supporting documents from the visit |

## Security and legal rules (important)
- **Reversible encryption** for phone number and bank number (use authenticated encryption such as AES-256-GCM; the key comes from environment or secret storage, never from the repo). Do not hash these fields.
- Never write decrypted phone or bank values to logs, error messages, or PDF reports unless a feature explicitly needs them.
- Uploaded documents are **not** encrypted; standard upload file types and size limits apply.
- **Consent form** is shown on a student's first use (their first task is filling in profile details). Log the first time they agree. No versioning needed.
- Notifications go mainly by Microsoft email.

## Data retention
- Keep logs and all applications for **4 years from the application date**.
- After 4 years, data is **flagged for System Admin review and deletion**. Never delete it automatically.

## Implementation guidance
- Model each application with a status and an approvals table (one row per approver). Medical Outpatient: reject immediately if any approver rejects; approve only when all have approved.
- Keep an audit trail of status changes and approval decisions.
- Parking Sticker needs an approval validity period (one year) and a renewal path.
- Food Coupon needs its own states: issued, claimed, redeemed, expired. Redeemed coupons cannot be reused.
- Build the SRD CMS as a public read-only area plus an SRD staff editor.
- Treat the dashboard and report scoping by role as a first-class requirement from the start.

## Suggested build order (timeline not decided; adjust when the client confirms)
1. Auth (Microsoft SSO, role mapping), student profile, consent, encryption helpers
2. Application engine: categories, documents, approvals, notifications
3. SD modules (Welfare, Medical)
4. CL modules (Parking Sticker, Food Coupon)
5. Dashboards and PDF reports
6. SRD (CMS first, CRM once scoped)

## Open items (do not guess; ask the user)
- Go-live date or phases
- Requirements document (to be attached by the user)
- Hostel CRM scope (enquiries and bookings, or complaints and maintenance)
- Whether only System Admin creates staff accounts
- Exact hosting URL
