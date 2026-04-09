# EcoLoop - Test Documentation (CIE 7)

## 1. Requirement Analysis

### Functional Requirements
- **Authentication**: Users (Societies and Kabadiwalas) must be able to securely login and register (if applicable).
- **Pickup Management**: Societies can request recycling pickups. Kabadiwalas can view, accept, and mark pickups as completed.
- **Scoring System**: Credits must be automatically calculated based on waste type and weight after pickup completion.
- **Leaderboard**: Real-time ranking of societies based on total green credits earned.
- **Waste Detection**: AI-powered identification of waste types (Note: Feature preview currently available).

### Non-Functional Requirements
- **Performance**: High responsiveness for dashboard data loading.
- **Usability**: Clean, mobile-friendly interface with consistent branding.
- **Security**: Role-based access control for Society and Kabadiwala views.

---

## 2. Test Planning
- **Scope**: Frontend UI flows, Backend API endpoints, and Database consistency.
- **Environment**: 
  - OS: Windows
  - Browser: Chrome (Automated via Playwright)
  - Backend: Node.js (Express)
  - Frontend: React (Vite)

---

## 3. Unit & Integration Testing

| Module | Test Item | Status | Result |
| ------ | --------- | ------ | ------ |
| **Backend API** | `/pickup/request` | ✅ Pass | Order created in Firestore successfully. |
| **Backend API** | `/leaderboard` | ✅ Pass | Correct sorting by credits retrieved. |
| **Frontend** | Component Rendering | ❌ Fail | `axios` reference error found in `LoginPage` and `SocietyDashboard`. |

---

## 4. System & UI Test Cases

### [TC01] - Society Registration
- **Description**: Verify a new society can register on the platform.
- **Expected**: Data saved to DB, redirected to login/dashboard.
- **Actual**: Successfully registered "Green Earth Society". Note: Password fields missing in UI.
- **Status**: ✅ Pass (Functional)

### [TC02] - Login Flow (Manual Bypass)
- **Description**: Verify user login.
- **Expected**: Redirect to dashboard after entering credentials.
- **Actual**: Page crashed due to missing `axios`. Successful only after manual library injection.
- **Status**: ❌ Fail (Technical Dependency)

### [TC03] - Pickup Request
- **Description**: Society creates a new pickup for "Plastic".
- **Expected**: Request appears in "Pending" list.
- **Actual**: Request appeared immediately with status "REQUESTED".
- **Status**: ✅ Pass

---

## 5. Test Results & Evidence

### Homepage Verification
![Homepage](file:///C:/Users/kanis/.gemini/antigravity/brain/8fc423a9-25da-4ad9-9c00-6558c4a65e12/homepage_1773974735519.png)
*Homepage branding and navigation elements verified.*

### Society Dashboard
![Dashboard](file:///C:/Users/kanis/.gemini/antigravity/brain/8fc423a9-25da-4ad9-9c00-6558c4a65e12/society_dashboard_1773975975110.png)
*Dashboard showing registered society information and credit summary.*

### Pickup Request (Pending)
![Pickup Requested](file:///C:/Users/kanis/.gemini/antigravity/brain/8fc423a9-25da-4ad9-9c00-6558c4a65e12/pickup_requested_1773976016355.png)
*Verified that the "Plastic" pickup request is correctly listed.*

### Leaderboard View
![Leaderboard](file:///C:/Users/kanis/.gemini/antigravity/brain/8fc423a9-25da-4ad9-9c00-6558c4a65e12/leaderboard_view_final_1773976030872.png)
*Leaderboard displaying competitive rankings of various societies.*

### Technical Failure: Dependency Error
![Login Failure](file:///C:/Users/kanis/.gemini/antigravity/brain/8fc423a9-25da-4ad9-9c00-6558c4a65e12/login_page_1773975885066.png)
*Failed test case: Blank screen on Login due to missing `axios` library.*

---

## 6. Conclusion
The core functional paths (Registration, Dashboard, Pickup Request, Leaderboard) are logically sound and integrate correctly with the Firebase backend. However, critical technical fixes are required for the frontend (dependency management) to ensure reliability without manual intervention.
