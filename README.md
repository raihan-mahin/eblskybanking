# EBL SkyBank Mobile

Build a complete, polished, mobile-first interactive prototype named:

EBL Sky Banking

This is a completely new Lovable project. Assume there is no existing code, design system, data, route, component, or previous instruction.

I will upload reference screenshots for:

1. Home — Quick Banking tab

2. Home — Recent tab

3. Categorized Home

4. Fund Transfer

5. Bill Payments

6. Add Money

7. Explore

8. Group DPS

9. Instant Account Opening

10. Available logos and supporting visual assets

Treat the uploaded screenshots as the primary visual references for their corresponding screens.

Do not create a marketing website, landing page, presentation page, or documentation page. Build the actual clickable mobile banking prototype.

This prototype uses fictional local data. Do not connect to real banking systems, payment gateways, OTP providers, identity-verification services, paid APIs, or external AI services.

Do not ask follow-up questions. Directly generate the best complete first version.

==================================================

1. PRIORITIES

==================================================

Follow this priority order:

1. Match the uploaded interface references closely.

2. Create a polished and visually attractive UI.

3. Make every major feature clickable and functional.

4. Preserve all existing and proposed features.

5. Keep the app organized through clear categories.

6. Use reusable components to stay within the free Lovable limit.

7. Store all demo information locally.

8. Avoid unnecessary pages, duplicate code, and heavy libraries.

Do not stop after generating only the Home page.

Do not provide a plan before building.

==================================================

2. FREE LOVABLE BUILD STRATEGY

==================================================

This must be achievable in one limited free-account build.

Use:

- React

- TypeScript

- Tailwind CSS

- React Router

- Lucide React icons

- Poppins font

- React Context with useReducer

- localStorage

- Lightweight CSS or SVG charts

- Browser speech APIs where supported

- Uploaded image and logo assets

Do not use:

- Supabase

- Lovable Cloud backend

- External databases

- External AI APIs

- Paid authentication

- Real payment processing

- Real OTP services

- Real biometric verification

- Heavy chart libraries

- Large animation libraries

- Remote image-generation services

- A separate hard-coded route for every feature

Create only these primary routes:

- /login

- /home

- /my-banking

- /qr

- /explore

- /service/:serviceId

- /settings

Use the reusable `/service/:serviceId` route, modal sheets, drawers, tabs, accordions, and step-by-step wizards for secondary functionality.

Create one central service registry. Each service should have:

- id

- title

- category

- description

- icon

- icon background

- flow type

- authentication rule

- search keywords

Use shared flow types:

1. Transaction Flow

2. Management Flow

3. Dashboard Flow

4. Savings Flow

5. Scheduling Flow

6. Assistant Flow

7. Onboarding Flow

8. Settings Flow

9. Information Flow

Every visible feature must open a real local-state interaction. No important tile should be decorative or inactive.

==================================================

3. DESIGN SYSTEM

==================================================

Closely follow the uploaded screenshots.

Preserve:

- Warm yellow header

- White page background

- Large rounded white cards

- Deep-blue section headings

- Black primary text

- Gray secondary text

- Thin light-gray borders

- Soft shadows

- Pastel circles behind icons

- Orange or yellow active indicators

- Green success states

- Orange pending states

- Red failure states

- Clean Poppins-style typography

- Bottom navigation with Home, My Banking, QR, Explore

Approximate colors:

- Yellow: #FFC400

- Deep blue: #123B82

- Orange: #FF5A00

- Primary text: #151515

- Secondary text: #707070

- Background: #F7F7F7

- Border: #E8E8E8

- Success: #279B48

- Pending: #FF8A00

- Error: #D64545

Typography:

- Main page title: 24–28px, Poppins 600

- Section heading: 18–20px, Poppins 600

- Card title: 15–16px, Poppins 500

- Body: 14px, Poppins 400

- Supporting text: 12–13px

- Buttons: 15px, Poppins 500

Layout:

- Optimized for 360px–430px

- Maximum width on desktop: 430px

- Centered mobile app container on wider screens

- Fixed bottom navigation

- No horizontal page scrolling

- Minimum touch target: 44px

- Page padding: approximately 18px

- Card radius: approximately 18px

- Transitions: approximately 150–220ms

Do not use:

- Purple fintech themes

- Glassmorphism

- Cryptocurrency visuals

- Stock-trading visuals

- Desktop sidebars

- Decorative fonts

- Excessive gradients

- Excessive animation

- A section named “New Features”

Blend proposed features naturally into normal banking categories.

==================================================

4. DEMO USER AND STATE

==================================================

Use this user throughout:

Name:

Abu Raihan Mahin

Mobile:

01712-345678

Demo Login PIN:

1234

Demo OTP:

123456

Primary Account:

EBL Savings Account

Masked Account:

XXXX XXXX XXXX 1234

Starting Balance:

৳82,450

Monthly Salary:

৳70,000

Early Salary Access Eligibility:

৳20,000

Starting Reward Points:

3,240

Reward Level:

Gold

Points Needed for Platinum:

760

Store in localStorage:

- Login state

- User profile

- Current PIN

- Biometric settings

- Accounts and balances

- Transactions

- Recent service usage

- Usage counts

- Beneficiaries

- Bangladesh bank list

- MFS wallets

- Saved billers

- Saved mobile numbers

- Cards

- Card controls

- Card PIN state

- Receipts

- Notifications

- Rewards

- Reward history

- Reward missions

- Saved schedules

- Auto Pay instructions

- Split Pay records

- Savings goals

- DPS and FDR records

- Group DPS records

- Early Salary Access records

- Support conversations

- Support tickets

- Accessibility preferences

- Security settings

Include Reset Demo Data inside Settings.

==================================================

5. SHARED COMPONENTS

==================================================

Create reusable components:

- AppHeader

- BottomNavigation

- AccountCard

- RewardSummaryCard

- SegmentedTabs

- ServiceTile

- ServiceGrid

- SectionCard

- ListRow

- SearchField

- FormField

- AmountInput

- BankSelector

- WalletSelector

- BeneficiarySelector

- DynamicServicePanel

- TransactionWizard

- AuthenticationSheet

- OTPDialog

- ReviewScreen

- SuccessReceipt

- ErrorState

- ConfirmationDialog

- ProgressBar

- CircularProgress

- StatusBadge

- InsightCard

- MiniBarChart

- MiniLineChart

- DonutChart

- ChatPanel

- TicketForm

- VoiceAssistantButton

- ToastMessage

Reuse these components throughout the app.

==================================================

6. LOGIN AND REGISTRATION

==================================================

Create a clean login screen using the uploaded logo asset.

Include:

- EBL Sky Banking logo

- Mobile-number input

- Four-digit PIN input

- Show or hide PIN

- Login

- Fingerprint

- Face ID

- Forgot PIN

- Open Account

- Explore Demo

Valid login:

Mobile:

01712-345678

PIN:

1234

Login functionality:

- Correct information opens Home.

- Incorrect information shows an error.

- Explore Demo opens Home immediately.

- Remember login state locally.

Fingerprint login simulation:

1. Open scan sheet.

2. Show fingerprint animation.

3. Display successful verification.

4. Open Home.

Face ID login simulation:

1. Open face-scanning frame.

2. Run short scanning animation.

3. Display successful verification.

4. Open Home.

Forgot Login PIN:

1. Enter registered mobile number.

2. Send simulated OTP.

3. Accept OTP 123456.

4. Enter new four-digit PIN.

5. Confirm new PIN.

6. Save the new PIN locally.

7. Show success.

8. Return to login.

Open Account must open Instant Account Opening.

==================================================

7. GLOBAL NAVIGATION

==================================================

Use exactly four bottom-navigation tabs:

1. Home

2. My Banking

3. QR

4. Explore

Active tab:

- Yellow accent

- Dark icon

- Yellow underline

- Clear text label

Normal app header:

- Circular avatar

- “Good Evening”

- “Abu Raihan Mahin”

- Notification bell

- Small unread indicator

Avatar menu:

- Profile

- Accounts

- Rewards

- Personalization

- Security

- Accessibility

- Notifications

- Help and Support

- Reset Demo Data

- Logout

==================================================

8. HOME PAGE

==================================================

Follow the uploaded Home screenshots closely.

HOME ORDER

1. Header

2. Account card

3. Compact Rewards summary

4. Quick Banking / Recent tab module

5. Smart Banking

6. Savings & Goals

7. More Services

8. Bottom navigation

ACCOUNT CARD

Show:

- Account

- Masked account number

- Currency shortcut

- Account-switch shortcut

- Dropdown indicator

- Hidden balance by default

Show Balance functionality:

- Tap to display ৳82,450.

- Tap again to hide it.

COMPACT REWARDS SUMMARY

Place a small understated Rewards card directly below the Account card.

Show:

- Small gift or star icon

- “Rewards”

- “3,240 Points”

- Level: Gold

- “760 points to Platinum”

- Thin progress bar

- “+35 points this month”

- Small “View Rewards” action

Do not make this card visually dominant.

Tapping it opens the full Rewards dashboard.

QUICK BANKING / RECENT TABS

Directly below Rewards, create a segmented tab module.

Tabs:

- Quick Banking

- Recent

Quick Banking is active by default.

QUICK BANKING TAB

Show the six core services in a 2×3 grid:

- Fund Transfer

- Bill Payment

- Card Payment

- Recharge

- Add Money

- More

Under Add Money show:

“One-tap up to ৳5,000”

Each service opens its working flow.

RECENT TAB

When selected, replace the grid with a recent usage list.

Initial examples:

- bKash Add Money — Today, 6:45 PM

- Electricity Bill — Today, 4:20 PM

- Split Pay — Yesterday, 9:15 PM

- Tuition Fee — 12 May, 2025

- Recharge — 11 May, 2025

Each item must:

- Show an icon

- Show the last-used time

- Open the related service

- Update automatically after service use or transaction completion

SMART BANKING

Show:

- Split Pay

- AI Money Manager

- Early Salary Access

- AI Support

Add subtle useful badges:

- Split Pay: “2 requests”

- AI Money Manager: “3 insights”

- Early Salary Access: “Eligible ৳20,000”

- AI Support: “Online”

SAVINGS & GOALS

Show visually attractive cards for:

- Instant DPS

- Group DPS

- Goal Setting

Use:

- Progress bars

- Completion percentage

- Small action text

- Simple illustration or icon

MORE SERVICES

Show:

- Instant Account Opening

- Auto Pay

- Tuition Fee

- AI Voice Assistant

==================================================

9. COMPLETE EXPLORE PAGE

==================================================

The Explore page must show every existing and proposed feature.

Do not remove features to simplify the page.

Use:

- Search bar at the top

- Expandable category cards

- Horizontally scrollable feature rows

- Small category subtitles

- “See All” actions

- Compact feature tiles

Search must filter by feature name and keywords.

CATEGORY 1 — AI & PERSONAL FINANCE

- AI Money Manager

- Goal Setting

- AI Financial Advisor

- Automatic Payment Intelligence

- AI Voice Assistant

- Budget Management

- Spending Insights

- Upcoming Payments

CATEGORY 2 — PAYMENTS & TRANSFERS

- Fund Transfer

- Split Pay

- Add Money

- MFS Transfer

- Mobile Recharge

- Auto Pay

- Scheduled Transfer

- QR Payment

- Beneficiaries

- Transfer History

CATEGORY 3 — BILLS, EDUCATION & ENTERTAINMENT

- Electricity

- Gas

- Water

- Internet

- TV

- Visa Fee

- Tuition Fee

- Entertainment Gift Cards

- Netflix Gift Card

- Spotify Premium

- Google Play Gift Card

- Apple Gift Card

- Smart Bill Reminder

- Saved Billers

CATEGORY 4 — SAVINGS & GROWTH

- Instant DPS

- DPS

- Fixed Deposit

- Group DPS

- Savings Goals

- Auto Contribution

- Early Salary Access

- Instant Account Opening

CATEGORY 5 — CARDS, LOANS & REWARDS

- Card Services

- Add Card

- Activate Card

- Card Controls

- Rewards

- Reward Offers

- Loan Services

- Transaction Limits

- Statements

- Certificates

- Receipts

CATEGORY 6 — COMMUNITY & LIFESTYLE

- Donations

- Zakat

- Islamic Features

- E-Toll

- Vehicle Management

- Entertainment

- Education Payments

CATEGORY 7 — SECURITY, ACCESS & SUPPORT

- AI Customer Support

- Help and Support

- Tutorials

- FAQs

- Login PIN Reset

- Card PIN Reset

- Fingerprint Setup

- Face ID Setup

- Biometric Reset

- Accessibility

- Notifications

- Language

- Trusted Devices

- Login History

- Active Sessions

Include a Recommended for You card at the bottom.

==================================================

10. SHARED TRANSACTION ENGINE

==================================================

Use one reusable transaction engine for:

- Fund Transfer

- MFS Transfer

- Add Money

- Bill Payment

- Card Payment

- Recharge

- Tuition Fee

- Gift Card Purchase

- Donation

- E-Toll

- QR Payment

- DPS Contribution

- Group DPS Contribution

- Split Pay Payment

STANDARD TRANSACTION FLOW

1. Select source account.

2. Select recipient, bank, wallet, biller, institution, card, or service.

3. Enter amount.

4. Add optional note.

5. Display fee when relevant.

6. Display estimated Reward Points when eligible.

7. Review details.

8. Select authentication method.

9. Complete authentication.

10. Request OTP only when required.

11. Complete transaction.

12. Generate receipt.

SUCCESS ACTIONS

On success:

- Deduct amount and fee

- Update relevant destination or service

- Add transaction to history

- Generate transaction ID

- Generate receipt

- Create notification

- Update Recent tab

- Increase service usage count

- Calculate Reward Points

- Update reward mission progress

- Save everything locally

- Show success animation

Success screen actions:

- Download Receipt

- Share Receipt

- Repeat Transaction

- Done

FAILURE ACTIONS

On failure:

- Do not deduct balance

- Do not award Reward Points

- Preserve entered information

- Show the failure reason

- Allow retry

- Allow cancel

- Offer AI Support

VALIDATION

- Required fields cannot be blank

- Amount must be positive

- Amount cannot exceed balance

- Bangladesh mobile-number format must be valid

- Recipient is required

- Scheduled dates cannot be in the past

- Authentication is required

- OTP must be correct when required

==================================================

11. PAYMENT AUTHENTICATION AND OTP RULE

==================================================

Apply this exact rule to all monetary transactions.

For transactions of ৳5,000 or below:

- No OTP

- Confirm using:

  - Fingerprint

  - Face ID

  - PIN

- Complete after successful confirmation

For transactions above ৳5,000:

- First confirm using Fingerprint, Face ID, or PIN

- Then show OTP screen

- Accept demo OTP 123456

- Complete only after correct OTP

Display where relevant:

“One-tap available up to ৳5,000”

“Amounts above ৳5,000 require OTP”

AuthenticationSheet:

- Fingerprint

- Face ID

- PIN

- Cancel

Fingerprint:

- Scan icon and animation

- “Touch the fingerprint sensor”

- Success or retry state

Face ID:

- Face-scanning frame

- Scan animation

- Success or retry state

PIN:

- Four-digit keypad

- Correct PIN: current saved login PIN, initially 1234

- Wrong PIN shows an error

- Allow retry

SECURITY EXCEPTION

Always require OTP for these recovery operations regardless of transaction amount:

- Login PIN reset

- Card PIN reset

- Registering a new trusted device

- Re-enrolling Fingerprint

- Re-enrolling Face ID

==================================================

12. SECURITY SETTINGS AND RESET FUNCTIONS

==================================================

Create a Security section containing:

- Change Login PIN

- Reset Login PIN

- Reset Card PIN

- Enable Fingerprint

- Enable Face ID

- Reset Biometric Verification

- Preferred Confirmation Method

- Trusted Devices

- Active Sessions

- Login History

- Auto Logout Duration

- Security Alerts

- Freeze Card shortcut

CHANGE LOGIN PIN

1. Enter current PIN.

2. Enter new four-digit PIN.

3. Confirm new PIN.

4. Authenticate.

5. Save new PIN.

6. Show success.

RESET LOGIN PIN

1. Confirm registered mobile number.

2. Send simulated OTP.

3. Enter OTP 123456.

4. Enter new four-digit PIN.

5. Confirm it.

6. Save new PIN.

7. Create security notification.

RESET CARD PIN

1. Select a card.

2. Show masked card number.

3. Confirm identity using Fingerprint, Face ID, or login PIN.

4. Send simulated OTP.

5. Enter OTP 123456.

6. Enter new four-digit card PIN.

7. Confirm new card PIN.

8. Save the mock PIN state.

9. Create security notification.

10. Show success.

ENABLE FINGERPRINT

1. Open Fingerprint Settings.

2. Confirm current login PIN.

3. Show simulated fingerprint scan.

4. Show successful enrollment.

5. Enable Fingerprint toggle.

6. Allow it to become the default confirmation method.

ENABLE FACE ID

1. Open Face ID Settings.

2. Confirm current login PIN.

3. Show simulated face scan.

4. Show successful enrollment.

5. Enable Face ID toggle.

6. Allow it to become the default confirmation method.

RESET BIOMETRIC VERIFICATION

1. Confirm current PIN.

2. Select Fingerprint or Face ID.

3. Remove current simulated enrollment.

4. Send OTP 123456.

5. Allow re-enrollment.

6. Save security changes locally.

==================================================

13. FUND TRANSFER

==================================================

Follow the uploaded Fund Transfer screen.

CATEGORIES

TRANSFER OPTIONS

- My Account

- EBL

- Other Bank

- MFS

SMART SHORTCUTS

- Split Pay

- Auto Pay & Scheduled Transfer

MANAGE

- Beneficiary

- Scheduled Transfer List

- Transfer History

OTHER BANK

Show a searchable Bangladesh bank selector with:

- City Bank

- BRAC Bank

- Islami Bank Bangladesh PLC

- Dutch-Bangla Bank

- Eastern Bank PLC

- Standard Chartered Bangladesh

- Bank Asia

- Prime Bank

- Mutual Trust Bank

- United Commercial Bank

Flow:

1. Select bank.

2. Enter account-holder name.

3. Enter account number.

4. Select transfer type:

   - NPSB / Instant

   - BEFTN

   - RTGS

5. Enter amount.

6. Show mock fee.

7. Review.

8. Authenticate.

9. Apply OTP rule.

10. Generate receipt.

MFS

Show:

- bKash

- Nagad

- Rocket

- Upay

Flow:

1. Select provider.

2. Enter or select wallet number.

3. Enter amount.

4. Review.

5. Authenticate.

6. Apply OTP rule.

7. Complete.

==================================================

14. SPLIT PAY

==================================================

Include:

- Create Split

- Request Money

- Pay Request

- Sent Requests

- Received Requests

- Active Splits

- Completed

CREATE SPLIT

1. Enter title.

2. Enter total amount.

3. Select participants.

4. Choose Equal or Custom Split.

5. Add note.

6. Review participant amounts.

7. Send requests.

8. Save record.

9. Create notifications.

Example:

Dinner at Banani

Total: ৳5,000

Participants:

- Mahin

- Arnav

- Taslim

- Suddhi

- Wasif

Equal split:

৳1,000 each

PAY REQUEST

1. Open request.

2. View sender, amount, and reason.

3. Select account.

4. Review.

5. Authenticate.

6. Apply OTP rule.

7. Update status.

8. Generate receipt.

Statuses:

- Requested

- Pending

- Partially Paid

- Paid

- Declined

- Cancelled

==================================================

15. BILL PAYMENTS AND ENTERTAINMENT

==================================================

Follow the uploaded categorized Bill Payments screen.

Top controls:

- Search biller or service

- Recent Payment

- Saved Billers

- Auto Pay

UTILITIES

- Electricity

- Gas

- Water

- Internet

- TV

FEES & SERVICES

- Visa Fee

- Tuition Fee

ENTERTAINMENT & GIFT CARDS

- Netflix Gift Card

- Spotify Premium

- Google Play Gift Card

- Apple Gift Card

GIVING

- Zakat

- Donation

BILL FLOW

1. Select service.

2. Select provider.

3. Enter customer number.

4. Retrieve mock bill.

5. Show amount and due date.

6. Select account.

7. Save biller option.

8. Auto Pay option.

9. Review.

10. Authenticate.

11. Apply OTP rule.

12. Generate receipt.

GIFT CARD FLOW

1. Select provider.

2. Select gift-card value.

3. Enter recipient email or mobile.

4. Select account.

5. Review.

6. Authenticate.

7. Apply OTP rule.

8. Generate mock gift-card record.

9. Generate receipt.

SMART BILL REMINDER

Show:

- Bills due

- Total upcoming amount

- Due dates

- Pay Now

- Enable Auto Pay

- Dismiss

==================================================

16. TUITION FEE

==================================================

Support:

- School

- College

- University

Flow:

1. Select education level.

2. Select institution.

3. Enter student name.

4. Enter student ID or roll.

5. Select class, session, or semester.

6. Select fee type.

7. Retrieve mock amount.

8. Select account.

9. Save institution option.

10. Save student option.

11. Choose Pay Now, Schedule, or Auto Pay.

12. Review.

13. Authenticate.

14. Apply OTP rule.

15. Generate receipt.

Fee types:

- Admission

- Tuition

- Semester

- Examination

- Registration

- Library

- Transport

- Other

==================================================

17. ADD MONEY

==================================================

Follow the uploaded Add Money screen closely.

Fields:

- Pay From

- Add Money From

- Wallet Number

- Amount

- Confirm With

Providers:

- bKash

- Nagad

- Rocket

Flow:

1. Select account or card.

2. Select wallet provider.

3. Enter or choose wallet number.

4. Enter amount.

5. Select Fingerprint, Face ID, or PIN.

6. Review.

7. Confirm.

8. Apply OTP rule.

9. Complete.

10. Generate receipt.

Include:

- Saved Wallet

- Recent Wallet

- Remaining One-Tap Limit

- Disable One-Tap toggle

- Add Money History

==================================================

18. CARD SERVICES

==================================================

Include:

- My Cards

- EBL Card

- Other Bank Card

- Card Payment

- Prepaid Card Top-up

- Add Card

- Activate Card

- Card Products

- Card Balance

- Card Statement

- Unbilled Transactions

Card controls:

- Freeze / Unfreeze

- Online Transactions

- International Transactions

- Contactless Payments

- Transaction Limit

- Report Lost Card

- Reset Card PIN

All sensitive card controls require Fingerprint, Face ID, or PIN.

Card PIN reset additionally requires OTP 123456.

==================================================

19. AUTO PAY AND SCHEDULED TRANSFER

==================================================

Create one scheduling system supporting:

- Transfers

- Utility Bills

- Internet

- Recharge

- Tuition Fee

- Card Payment

- MFS

- DPS

- Group DPS

- Donations

Fields:

- Schedule name

- Service type

- Recipient or biller

- Amount

- Frequency

- Start date

- Optional end date

- Source account

- Reminder

- Active / paused status

Actions:

- Create

- Edit

- Pause

- Resume

- Skip Next

- Delete

- View History

Require authentication before activation.

==================================================

20. REWARDS SYSTEM

==================================================

HOME SUMMARY

Keep the compact Rewards card below the Account card.

FULL REWARDS DASHBOARD

Show:

- Current points

- Current level

- Progress to next level

- Points earned this month

- Points expiring soon

- Estimated redeemable value

- Circular progress chart

- Monthly points bar chart

- Reward history

LEVELS

- Bronze: 0–999

- Silver: 1,000–2,999

- Gold: 3,000–5,999

- Platinum: 6,000+

EARNING RULE

Award 1 point for every ৳100 of eligible successful spending.

Round down partial amounts.

Eligible:

- Merchant card payment

- QR merchant payment

- Bill payment

- Recharge

- Tuition payment

- Entertainment gift-card purchase

- DPS contribution

- Group DPS contribution

- Selected Add Money campaigns

Not eligible:

- Own-account transfer

- Failed transaction

- Cancelled transaction

- Refund

- Cash withdrawal

- Fees

Review screen example:

“You will earn approximately 24 Reward Points.”

Success screen:

“+24 Reward Points earned.”

BONUS MISSIONS

Include:

- Pay 3 utility bills

- Complete 2 recharges

- Make one QR payment

- Contribute to a DPS

- Purchase an entertainment gift card

Show:

- Progress

- Points reward

- Completion

- Expiry

REDEMPTION

Options:

- 500 points → ৳50 cashback

- 800 points → ৳100 recharge voucher

- 1,000 points → ৳100 bill voucher

- 1,500 points → ৳150 entertainment discount

- 2,000 points → ৳200 statement adjustment

- Donation using points

Redemption flow:

1. Select reward.

2. Show required and available points.

3. Select destination when needed.

4. Review.

5. Authenticate.

6. Deduct points.

7. Generate reward receipt.

8. Update reward history.

9. Create notification.

Do not allow redemption with insufficient points.

If a transaction is refunded, reverse its points.

==================================================

21. AI MONEY MANAGER

==================================================

Make this visually rich but lightweight.

Use CSS or SVG only.

Show:

- Monthly Income

- Monthly Expenses

- Net Savings

- Spending-category donut chart

- Weekly-spending bars

- Savings trend line

- Upcoming payments

- Budget progress

- Goal progress

Rule-based insights:

- “Your food spending is 15% higher than last month.”

- “You have 2 bills due this week.”

- “Your savings rate is 18%.”

- “You are ৳37,500 away from your Nepal Trip goal.”

- “You usually recharge this number near the 5th.”

Each insight should have an action:

- View Transactions

- Set Budget

- Create Goal

- Enable Auto Pay

- Schedule Recharge

- Dismiss

Do not use an external AI API.

==================================================

22. GOAL SETTING

==================================================

Goal examples:

- Nepal Trip

- New Phone

- Laptop

- Tuition Fee

- Emergency Fund

Create Goal flow:

1. Enter title.

2. Select icon.

3. Enter target amount.

4. Enter current savings.

5. Select target date.

6. Select source account.

7. Enter monthly contribution.

8. Enable optional auto contribution.

9. Save.

Show:

- Progress

- Saved amount

- Remaining amount

- Monthly recommendation

- Estimated completion

- Contribution history

Actions:

- Add Money

- Edit

- Pause

- Delete

- Enable Auto Contribution

==================================================

23. AI FINANCIAL ADVISOR

==================================================

Create a rule-based conversational screen.

Suggested questions:

- Can I afford a new phone?

- How much should I save this month?

- Where did I spend the most?

- Will I have enough for tuition?

- How can I reach my Nepal Trip goal faster?

- What bills are due soon?

Use locally stored:

- Balance

- Salary

- Expenses

- Bills

- Rewards

- Goals

- Scheduled payments

Use short answers with relevant visual cards and action buttons.

==================================================

24. AUTOMATIC PAYMENT INTELLIGENCE

==================================================

Detect repeated mock activity:

- Monthly internet bill

- Regular recharge

- Family transfer

- Tuition instalment

- DPS contribution

Show suggestions:

- Enable Auto Pay

- Schedule Transfer

- Save Biller

- Save Beneficiary

- Create Reminder

Never activate anything automatically.

Require user approval.

==================================================

25. EARLY SALARY ACCESS

==================================================

Show:

- Salary: ৳70,000

- Eligible Limit: ৳20,000

- Example Request: ৳10,000

- Illustrative Fee: ৳250

- Repayment: ৳10,250

Flow:

1. Check mock eligibility.

2. Enter requested amount.

3. Show fee.

4. Show repayment.

5. Show salary date.

6. Accept terms.

7. Authenticate.

8. Apply OTP rule.

9. Show demo approval.

10. Update record.

11. Show repayment status.

Statuses:

- Eligible

- Submitted

- Approved

- Disbursed

- Repayment Pending

- Repaid

==================================================

26. GROUP DPS

==================================================

Follow the uploaded Group DPS screen.

Example:

Nepal Trip

Target:

৳100,000

Saved:

৳62,500

Monthly per member:

৳500

Members:

- Mahin

- Arnav

- Taslim

- Suddhi

- Wasif

Functions:

- Create Group

- Set Goal

- Set Target

- Set Monthly Contribution

- Add Member

- Accept Invitation

- Pay Contribution

- Auto Contribution

- Remind Members

- View Activity

- Leave Group

- Close Group

Contribution flow:

1. Select member.

2. Confirm amount.

3. Select account.

4. Review.

5. Authenticate.

6. Apply OTP rule.

7. Deduct balance.

8. Increase savings.

9. Update progress.

10. Update status.

11. Add activity.

12. Generate receipt and points.

==================================================

27. PERSONALIZED RECENT AND RECOMMENDATIONS

==================================================

Track service usage locally.

Use it for:

- Recent tab

- For You

- Frequently Used

- Recommended for You

Rules:

- Keep six Quick Banking items fixed

- Update Recent automatically

- Frequently used secondary services move higher

- Allow Pin Service

- Allow Hide Recommendation

- Allow Disable Personalization

- Allow Reset Recommendations

Do not show the technical phrase “Behavioral Feature Sorting.”

==================================================

28. AI VOICE ASSISTANT AND ACCESSIBILITY

==================================================

Add a floating microphone button.

Use browser speech APIs where supported.

Always provide text-command fallback.

Commands:

- Open Fund Transfer

- Open Split Pay

- Pay Electricity Bill

- Open Recharge

- Open Rewards

- Show Recent Transactions

- Read My Balance

- Explain This Page

- Open AI Support

- Turn On High Contrast

- Increase Text Size

- Go Back

The assistant may navigate and prepare forms but cannot complete sensitive actions without authentication.

Accessibility:

- Voice Guidance

- Read Current Screen

- Speech Speed

- Large Text

- Extra-Large Text

- High Contrast

- Reduce Motion

- Visible Keyboard Focus

- Screen-reader Labels

- English / Bangla

==================================================

29. INSTANT ACCOUNT OPENING

==================================================

Follow the uploaded onboarding reference.

Steps:

1. Mobile Verify

2. NID

3. Selfie

4. Details

Mobile Verify:

- Mobile number

- Account type

- OTP 123456

Account types:

- Student

- Savings

- Salary Account

NID:

- Front image selection

- Back image selection

- Local previews

- Simulated extraction

- Editable mock data

Selfie:

- Camera-style placeholder

- Simulated capture

- Simulated liveness check

Details:

- Full name

- Date of birth

- Occupation

- Institution / Employer

- Email

- Address

- Nominee

- Terms

Completion:

- Submit application

- Generate mock account number

- Show success

- Go to Dashboard

==================================================

30. AI CUSTOMER SUPPORT

==================================================

Create a polished rule-based AI Support chat without an external AI API.

Accessible from:

- Home Smart Banking

- Explore

- Profile

- Help and Support

- Selected error screens

UI:

- Header: AI Support

- Online status

- Greeting

- Suggested questions

- Quick replies

- Text input

- Send button

- Optional microphone

- Typing animation

- Related-service buttons

- Create Ticket

- Human Support simulation

Greeting:

“Hello Mahin! How can I help with your banking today?”

SUPPORTED QUESTIONS AND ACTIONS

1. How do I transfer money?

   - Explain steps

   - Open Fund Transfer

2. Why is OTP required?

   - Explain the ৳5,000 rule

   - Open Security Rules

3. How does one-tap payment work?

   - Explain biometric/PIN confirmation without OTP up to ৳5,000

   - Open Add Money

4. How do Rewards work?

   - Explain eligible activities and points

   - Open Rewards

5. How can I redeem Reward Points?

   - Explain redemption

   - Open Reward Redemption

6. How does Split Pay work?

   - Explain request, split, and payment

   - Open Split Pay

7. How do I freeze my card?

   - Explain Card Controls

   - Open Card Controls

8. How do I pay tuition fees?

   - Explain the tuition flow

   - Open Tuition Fee

9. What is Early Salary Access?

   - Explain eligibility and repayment

   - Open Early Salary Access

10. How does Group DPS work?

    - Explain group contributions

    - Open Group DPS

11. Where is my receipt?

    - Explain receipts

    - Open Receipts

12. How do I open an account?

    - Explain onboarding

    - Open Instant Account Opening

13. How do I reset my login PIN?

    - Explain OTP verification

    - Open Reset Login PIN

14. How do I reset my card PIN?

    - Explain card selection, identity confirmation, OTP, and new PIN

    - Open Reset Card PIN

15. How do I add Fingerprint verification?

    - Explain PIN confirmation and enrollment

    - Open Fingerprint Setup

16. How do I add Face ID?

    - Explain PIN confirmation and enrollment

    - Open Face ID Setup

17. How do I reset Fingerprint or Face ID?

    - Explain biometric removal and re-enrollment

    - Open Biometric Reset

18. Why did my transaction fail?

    - Ask transaction type

    - Show likely causes:

      - Insufficient balance

      - Incorrect OTP

      - Invalid recipient

      - Expired scheduled date

      - Transaction limit

    - Offer Retry

    - Offer History

    - Offer Create Ticket

19. How do I purchase a Netflix gift card?

    - Explain gift-card flow

    - Open Entertainment Gift Cards

20. How do I enable Auto Pay?

    - Explain schedule setup and authentication

    - Open Auto Pay

LOCAL DATA QUESTIONS

Allow AI Support to answer from local mock data:

- Current balance

- Reward points

- Reward level

- Upcoming bills

- Goal progress

- Recent transaction status

- Split Pay status

- Group DPS progress

- Early Salary eligibility

Require simulated authentication before reading sensitive balance or account information.

UNKNOWN QUESTION

Respond:

“I could not find an exact answer. Try one of the suggested topics or create a support ticket.”

Actions:

- View FAQs

- Create Ticket

- Human Support

==================================================

31. SUPPORT TICKETS

==================================================

Create a mock support-ticket form.

Fields:

- Issue category

- Transaction ID, optional

- Subject

- Description

- Attachment placeholder

- Preferred contact method

Categories:

- Transaction

- Card

- PIN and Security

- Rewards

- Bill Payment

- Add Money

- Account

- Other

After submission:

- Generate ticket number

- Save locally

- Show Submitted status

- Create notification

Statuses:

- Submitted

- In Review

- Resolved

==================================================

32. QR PAYMENTS

==================================================

Include:

- Scan QR simulation

- Upload QR

- My QR

- Recent QR Payments

Flow:

1. Scan or upload.

2. Show merchant.

3. Enter amount.

4. Review.

5. Authenticate.

6. Apply OTP rule.

7. Complete.

8. Generate receipt and points.

==================================================

33. BRAND AND LOGO RULES

==================================================

Use correct logos only when available in uploaded screenshots or uploaded as separate assets.

Examples:

- EBL

- bKash

- Nagad

- Rocket

- Netflix

- Spotify

- Google Play

- Apple

- Bangladesh banks

Do not redraw inaccurate logos.

When a correct logo is unavailable:

- Use the company name

- Use a neutral icon

- Use a tasteful brand-colored badge

- Use initials for banks or institutions

Functionality and visual consistency are more important than an inaccurate logo.

==================================================

34. SEED DATA

==================================================

Seed localStorage with:

- 15 transactions

- 8 notifications

- 6 beneficiaries

- 10 Bangladesh banks

- 4 MFS providers

- 5 saved billers

- 5 saved mobile numbers

- 3 cards

- 4 goals

- 2 DPS records

- 1 FDR

- 1 Group DPS

- 4 Split Pay records

- 3 schedules

- 3 Auto Pay instructions

- 10 receipts

- 10 Reward history entries

- 8 Reward offers

- 4 Reward missions

- 12 AI financial insights

- 20 AI Support intents

- 2 Support tickets

==================================================

35. FINAL ACCEPTANCE TEST

==================================================

Before completing, verify:

VISUAL

- Uploaded screenshots guide each relevant page

- Home matches the supplied Home references

- Compact Rewards card appears below Account

- Quick Banking / Recent tabs work

- Explore contains every category

- UI is organized and visually interesting

- Graphs and progress indicators appear where appropriate

- Poppins-style typography is consistent

- Bottom navigation remains consistent

FUNCTIONAL

- Login works

- Forgot PIN works

- Login PIN reset works

- Card PIN reset works

- Fingerprint setup works

- Face ID setup works

- Biometric reset works

- Quick Banking works

- Recent updates automatically

- Fund Transfer works

- Other-bank selector works

- MFS works

- Split Pay works

- Bill Payment works

- Gift-card purchase works

- Tuition Fee works

- Add Money works

- Recharge works

- Card Controls work

- Auto Pay works

- Scheduled Transfer works

- Rewards work

- Reward points update

- Reward redemption works

- Goal Setting works

- AI Money Manager shows charts

- AI Financial Advisor responds

- Payment Intelligence works

- Early Salary Access works

- Group DPS updates progress

- Voice Assistant has text fallback

- Account Opening completes all four stages

- AI Support answers all listed questions

- AI Support opens PIN and biometric reset flows

- Support tickets work

- QR works

- Receipts update

- Notifications update

- Data survives refresh

TRANSACTION RULE

- Amounts of ৳5,000 or below skip OTP

- Amounts above ৳5,000 require OTP

- Fingerprint, Face ID, and PIN are available

- Current login PIN works

- OTP 123456 works

- Security resets always require OTP

- Failed transactions do not change balance

- Successful transactions update balance, history, rewards, receipts, notifications, Recent, and usage counts

TECHNICAL

- No backend is required

- No paid service is required

- No external AI API is required

- No major button is inactive

- No unnecessary duplicate components exist

- The app compiles without TypeScript or routing errors

- The result is efficient enough for one free Lovable generation

Build the complete first version directly from this single prompt and the uploaded screenshots. Do not ask questions and do not stop after the Home page.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://eblskybanking.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/2ae93418-7c4d-4a6c-8e20-2b65df286c55).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
