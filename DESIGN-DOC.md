# **EMS Student Organization Website \- Design Document**

## **Executive Summary**

This document outlines the requirements for a comprehensive web application to manage an EMS student organization. The system will handle member management, event scheduling and assignments, training coordination, certification tracking, and hours logging. The application replaces a static informational website with a full-featured member portal.

## **User Roles & Permissions**

### **1\. Public Users (Non-logged in)**

* View general organization information
* Access sign-up form for new membership

### **2\. Pending Members**

* Limited access (same as public)
* Can view their profile showing missing requirements
* Can upload certifications and update personal information
* Cannot access member resources or sign up for events/training

### **3\. General Members (Dues Paid)**

* Access to Canvas link and member resources
* View and update personal profile
* Upload and manage certifications
* Sign up for training (all types)
* View pending hours and total hours worked
* Change password and personal information

### **4\. Certified Members (Dues Paid \+ Valid Certs)**

* All General Member permissions
* Sign up for events based on certification level:
  * **First Aiders (FA):** CPR \+ First Aid \+ 4 ICS forms
  * **EMRs:** EMR \+ First Aid \+ 4 ICS forms
  * **EMTs:** Indiana EMT Reciprocity \+ 4 ICS forms
* Can sign up for roles at or below their certification level
* View event assignments and details

### **5\. Supervisors**

* All Certified Member permissions
* Can sign up for supervisor waitlists
* Access to assigned event details and member lists
* Confirm/modify hours for members on their events
* View contact information for members on their assigned events

### **6\. Board Members**

* All Supervisor permissions
* Create, modify, and delete events and training sessions
* Assign members from waitlists to events
* Approve/reject uploaded certifications
* Set certification expiration dates
* Confirm dues payments and expiration
* Add/remove penalty points with reasons
* View all member profiles and contact information
* Send notifications to members

### **7\. Administrators**

* All Board Member permissions
* Highest level system access
* User management capabilities

## **Core Features & User Stories**

### **Member Management**

**As a new user, I want to:**

* Create an account with @iu.edu email
* Provide basic information (name, phone, class standing, pronouns)
* Upload certifications for approval
* View my profile showing missing requirements

**As a general member, I want to:**

* Update my personal information and password
* View my certification status and expiration dates
* Access member resources (Canvas link) once dues are paid
* Track my total hours and pending hours
* View penalty points with reasons and dates

**As a board member, I want to:**

* Approve/reject member certifications and set expiration dates
* Confirm dues payments and set expiration dates
* Add/remove penalty points with reasons
* View all member contact information and profiles

### **Event Management**

**As a certified member, I want to:**

* View upcoming events with details (name, location, time, shifts, requirements)
* Sign up for waitlists based on my certifications
* Only see roles I'm qualified for
* View my assignment status
* Receive email notifications about assignments

**As a supervisor, I want to:**

* Sign up for supervisor waitlists
* View details of my assigned events
* See contact information for assigned members
* Confirm/modify hours for event participants

**As a board member, I want to:**

* Create events with multiple shifts and role requirements
* View waitlists with member hours and penalty points
* Assign members from waitlists to events
* Click member names to view full profiles
* Modify/delete events and notify affected members
* Maintain waitlists after assignments for backup coverage

### **Training Management**

**As a member, I want to:**

* View available training sessions
* Sign up for general training (dues payment not required)
* Sign up for AHA training components (CPR only, First Aid only, or both)
* View training costs and payment information

**As a board member, I want to:**

* Create training sessions with participant limits
* Confirm payments for AHA training to move members from waitlist
* Track attendance and completion

### **Notification System**

**Automated email notifications for:**

* Event assignments and non-selections
* Event modifications/cancellations
* Certification expiration warnings (30 days prior)
* Account status changes

## **Database Schema**

### **Members Table**

member (
    user\_id: INT PRIMARY KEY AUTO\_INCREMENT,
    first\_name: VARCHAR(100) NOT NULL,
    last\_name: VARCHAR(100) NOT NULL,
    a a iu\_email: VARCHAR(255) UNIQUE NOT NULL,
    phone\_number: VARCHAR(14),
    gender: TINYINT (0=Female, 1=Male, 2=Other),
    class\_year: TINYINT (0=Freshman, 1=Sophomore, 2=Junior, 3=Senior, 4=Other),
    pronouns: TINYINT (0=He/Him, 1=She/Her, 2=Other),
    position\_club: TINYINT (0=GM, 1=GM FA/EMR, 2=GM EMT, 3=Supervisor EMT),
    position\_web: TINYINT (0=Admin, 1=Board, 2=Supervisor, 3=Member),
    psid: VARCHAR(9),
    student\_id: VARCHAR(20),
    total\_hours: DECIMAL(5,2) DEFAULT 0,
    pending\_hours: DECIMAL(5,2) DEFAULT 0,
    dues\_paid: BOOLEAN DEFAULT FALSE,
    dues\_expiration: DATE,
    account\_status: TINYINT (0=Pending, 1=Active, 2=Inactive),
    created\_at: TIMESTAMP DEFAULT CURRENT\_TIMESTAMP,
    updated\_at: TIMESTAMP DEFAULT CURRENT\_TIMESTAMP ON UPDATE CURRENT\_TIMESTAMP
);

### **Authentication Table**

authentication (
    user\_id: INT FOREIGN KEY REFERENCES member(user\_id),
    password\_hash: VARCHAR(255) NOT NULL,
    last\_login: DATETIME,
    last\_password\_change: DATETIME,
    reset\_token: VARCHAR(255),
    reset\_token\_expiration: DATETIME
);

### **Emergency Contacts Table**

emergency\_contacts (
    user\_id: INT FOREIGN KEY REFERENCES member(user\_id),
    first\_name: VARCHAR(100) NOT NULL,
    last\_name: VARCHAR(100) NOT NULL,
    phone\_number: VARCHAR(14) NOT NULL
);

### **Certifications Table**

certifications (
    cert\_id: INT PRIMARY KEY AUTO\_INCREMENT,
    user\_id: INT FOREIGN KEY REFERENCES member(user\_id),
    cert\_type: TINYINT (0=FA, 1=BLS/CPR, 2=EMT, 3=EMR, 4=ICS-100, 5=ICS-200, 6=ICS-700, 7=ICS-800),
    file\_path: VARCHAR(500),
    upload\_date: TIMESTAMP DEFAULT CURRENT\_TIMESTAMP,
    is\_approved: BOOLEAN DEFAULT FALSE,
    expiration\_date: DATE,
    approved\_by: INT FOREIGN KEY REFERENCES member(user\_id),
    approved\_date: TIMESTAMP
);

### **Events Table**

events (
    event\_id: INT PRIMARY KEY AUTO\_INCREMENT,
    event\_name: VARCHAR(500) NOT NULL,
    event\_date: DATE NOT NULL,
    start\_time: TIME NOT NULL,
    end\_time: TIME NOT NULL,
    location: VARCHAR(500) NOT NULL,
    description: TEXT,
    fa\_emr\_needed: INT DEFAULT 0,
    emt\_needed: INT DEFAULT 0,
    supervisor\_needed: INT DEFAULT 1,
    is\_finalized: BOOLEAN DEFAULT FALSE,
    created\_by: INT FOREIGN KEY REFERENCES member(user\_id),
    created\_at: TIMESTAMP DEFAULT CURRENT\_TIMESTAMP
);

### **Event Signups Table**

event\_signups (
    signup\_id: INT PRIMARY KEY AUTO\_INCREMENT,
    event\_id: INT FOREIGN KEY REFERENCES events(event\_id),
    user\_id: INT FOREIGN KEY REFERENCES member(user\_id),
    position\_type: TINYINT (0=Supervisor, 1=EMT, 2=FA/EMR),
    signup\_time: TIMESTAMP DEFAULT CURRENT\_TIMESTAMP,
    is\_assigned: BOOLEAN DEFAULT FALSE,
    assigned\_by: INT FOREIGN KEY REFERENCES member(user\_id),
    assigned\_time: TIMESTAMP
);

### **Event Hours Table**

event\_hours (
    hour\_id: INT PRIMARY KEY AUTO\_INCREMENT,
    event\_id: INT FOREIGN KEY REFERENCES events(event\_id),
    user\_id: INT FOREIGN KEY REFERENCES member(user\_id),
    calculated\_hours: DECIMAL(4,2),
    confirmed\_hours: DECIMAL(4,2),
    confirmed\_by: INT FOREIGN KEY REFERENCES member(user\_id),
    is\_confirmed: BOOLEAN DEFAULT FALSE,
    confirmed\_date: TIMESTAMP
);

### **Penalty Points Table**

penalty\_points (
    point\_id: INT PRIMARY KEY AUTO\_INCREMENT,
    user\_id: INT FOREIGN KEY REFERENCES member(user\_id),
    points: INT NOT NULL,
    reason: TEXT NOT NULL,
    assigned\_by: INT FOREIGN KEY REFERENCES member(user\_id),
    assigned\_date: TIMESTAMP DEFAULT CURRENT\_TIMESTAMP,
    auto\_remove\_date: DATE,
    is\_active: BOOLEAN DEFAULT TRUE
);

### **Training Sessions Table**

training\_sessions (
    training\_id: INT PRIMARY KEY AUTO\_INCREMENT,
    training\_name: VARCHAR(500) NOT NULL,
    training\_date: DATE NOT NULL,
    start\_time: TIME NOT NULL,
    end\_time: TIME NOT NULL,
    location: VARCHAR(500) NOT NULL,
    description: TEXT,
    max\_participants: INT,
    is\_aha\_training: BOOLEAN DEFAULT FALSE,
    cpr\_cost: DECIMAL(6,2),
    fa\_cost: DECIMAL(6,2),
    both\_cost: DECIMAL(6,2),
    point\_contact: VARCHAR(255),
    created\_by: INT FOREIGN KEY REFERENCES member(user\_id)
);

### **Training Signups Table**

training\_signups (
    signup\_id: INT PRIMARY KEY AUTO\_INCREMENT,
    training\_id: INT FOREIGN KEY REFERENCES training\_sessions(training\_id),
    user\_id: INT FOREIGN KEY REFERENCES member(user\_id),
    signup\_type: TINYINT (0=CPR Only, 1=FA Only, 2=Both),
    payment\_confirmed: BOOLEAN DEFAULT FALSE,
    confirmed\_by: INT FOREIGN KEY REFERENCES member(user\_id),
    signup\_time: TIMESTAMP DEFAULT CURRENT\_TIMESTAMP
);

## **API Endpoints**

### **Authentication**

* `POST /api/auth/register` \- Register new member
* `POST /api/auth/login` \- Member login
* `POST /api/auth/logout` \- Member logout
* `POST /api/auth/forgot-password` \- Password reset request
* `PUT /api/auth/reset-password` \- Reset password with token
* `PUT /api/auth/change-password` \- Change password (authenticated)

### **Members**

* `GET /api/members/profile` \- Get own profile
* `PUT /api/members/profile` \- Update own profile
* `GET /api/members` \- Get all members (board only)
* `GET /api/members/:id` \- Get specific member (board/supervisor for assigned events)
* `PUT /api/members/:id/dues` \- Update dues status (board only)
* `POST /api/members/:id/penalty-points` \- Add penalty points (board only)
* `DELETE /api/penalty-points/:id` \- Remove penalty points (board only)

### **Certifications**

* `POST /api/certifications/upload` \- Upload certification file
* `GET /api/certifications` \- Get own certifications
* `PUT /api/certifications/:id/approve` \- Approve certification (board only)
* `DELETE /api/certifications/:id` \- Delete certification file

### **Events**

* `GET /api/events` \- Get all events
* `GET /api/events/:id` \- Get specific event details
* `POST /api/events` \- Create event (board only)
* `PUT /api/events/:id` \- Update event (board only)
* `DELETE /api/events/:id` \- Delete event (board only)
* `POST /api/events/:id/signup` \- Sign up for event
* `GET /api/events/:id/waitlist` \- Get event waitlist (board/supervisor only)
* `POST /api/events/:id/assign` \- Assign members from waitlist (board only)

### **Training**

* `GET /api/training` \- Get all training sessions
* `POST /api/training` \- Create training (board only)
* `POST /api/training/:id/signup` \- Sign up for training
* `PUT /api/training/:id/payment` \- Confirm payment (board only)

### **Calendar**

* `GET /api/calendar` \- Get all events and training for calendar view
* `GET /api/calendar/:month/:year` \- Get events for specific month

## **UI/UX Requirements**

### **Navigation Structure**

Public Nav: Home | About | Services | Join IC-EMS
Member Nav: Dashboard | Calendar | Events | Training | Profile | Resources | Logout
Board Nav: \+ Manage Members | Manage Events | Manage Training

Note: Supervisors see an additional "Supervised" tab within the unified Events page rather than a separate navigation item.

### **Key Pages**

**Dashboard (Member Home)**

* Calendar view of all events and training sessions (clickable for details/signup)
* Quick stats widget: total hours, pending hours, certification expiration alerts
* Current signups and waitlist status
* Recent events worked (last 30 days)
* Action items: missing certifications, dues status, pending items
* Upcoming assignments (next 7 days)

**Events Page (Unified)**

* Calendar view (default) showing all events and training
* List view toggle for detailed information
* Tabs: Upcoming | My Events | Supervised (supervisor+ only) | Past
* Filter by date, location, role type, event status
* Clear indication of signup eligibility
* Waitlist status display
* Supervisors see assigned member counts and "Manage Hours" links in the Supervised tab

**Profile Page**

* Personal information (editable)
* Certification status with expiration dates
* Hours summary
* Penalty points history
* Dues payment status

**Calendar Page**

* Monthly/weekly view of all events and training sessions
* Color coding: Events (blue), General Training (green), AHA Training (orange)
* Click events to view details or sign up
* Filter options: Show Events Only, Show Training Only, Show All
* Quick signup buttons on calendar popups

**Event Detail Page**

* Event information
* Role requirements and availability
* Signup/waitlist buttons
* Assigned member list (if assigned)

### **Responsive Design Requirements**

* Mobile-first approach
* Touch-friendly interface for mobile users
* Table layouts that work on small screens
* Optimized file upload for mobile

## **Security Requirements**

### **Authentication & Authorization**

* Secure password hashing (bcrypt)
* Session management with secure tokens
* Role-based access control
* @iu.edu email validation

### **File Security**

* Secure file upload with type validation
* Virus scanning for uploaded files
* Access control for certification files
* File size limits and storage quotas

### **Data Protection**

* HTTPS enforcement
* Input validation and sanitization
* SQL injection prevention
* XSS protection
* Regular security audits

## **Implementation Phases**

### **Phase 1: Core Infrastructure (4-6 weeks)**

* Database setup and migrations
* Authentication system
* Basic member registration and profiles
* Role-based access control

### **Phase 2: Member Management (3-4 weeks)**

* Certification upload and approval
* Dues tracking
* Penalty points system
* Profile management

### **Phase 3: Event System (4-5 weeks)**

* Event creation and management
* Signup and waitlist functionality
* Assignment system
* Hours tracking

### **Phase 4: Training System (2-3 weeks)**

* Training session management
* AHA payment tracking
* General training signups

### **Phase 5: Notifications & Polish (2-3 weeks)**

* Email notification system
* Automated expiration warnings
* UI/UX improvements
* Mobile optimization

### **Phase 6: Testing & Deployment (2-3 weeks)**

* Comprehensive testing
* Performance optimization
* Security audit
* Production deployment

## **Technical Considerations**

### **Recommended Technology Stack**

* **Backend:** Next.js
* **Database:** Supabase
* **Frontend:** React.js
* **File Storage:** Supabase File Storage
* **Email:** [porkbun.gg](http://porkbun.gg) included in DNS
* **Hosting:** Vercel
* **SEO:** Google Cloud Console
* **Analytics:** Google Cloud Analytics \+ Vercel Analytics

### **Performance Requirements**

* Page load times under 2 seconds
* Support for 200+ concurrent users
* 99.9% uptime requirement
* Automated backups

### **Future Enhancements**

* Integration with university systems
* Advanced reporting and analytics
* Calendar integration
* Automated scheduling algorithms

---

## **Implementation Notes**

### **Unified Events Page**

The Events page (`/(member)/events`) has been merged to serve both members and supervisors in a single unified view. The previous separate supervisor route (`/(supervisor)/assigned-events`) now redirects to `/(member)/events`.

**Route structure:**

```
/(member)/events/page.tsx            → Unified events list with role-based tabs
/(member)/events/[eventId]/page.tsx  → Event detail / signup page
/(member)/events/[eventId]/manage/page.tsx → Supervisor hours management page
/(supervisor)/assigned-events/       → Redirects to /events
```

**Tab visibility by role:**

| Tab | Members | Supervisors | Board |
|---|---|---|---|
| Upcoming | ✓ | ✓ | ✓ |
| My Events | ✓ | ✓ | ✓ |
| Supervised | ✗ | ✓ | ✓ |
| Past | ✓ | ✓ | ✓ |

- The "Supervised" tab is conditionally rendered when `member.position_web <= 2` (Supervisor, Board, or Admin).
- Supervised events are fetched via `event_signups` where the user is assigned as `position_type = 0` (Supervisor) and `is_assigned = true`.
- Each supervised event card links to `/events/[eventId]/manage` for hours confirmation.

### **Profile Update Flows**

**Personal Information:**

1. User edits fields (first name, last name, phone, class year, pronouns).
2. "Save Changes" calls `supabase.from("members").update(...)` for the authenticated user.
3. Success/error feedback via `sonner` toast notifications.

**Change Password:**

1. User enters new password and confirmation.
2. Client-side validation: minimum 8 characters, passwords must match.
3. Password update via `supabase.auth.updateUser({ password })`.
4. Success/error feedback via `sonner` toast notifications.
5. Fields are cleared on success.

### **Data Fetching Pattern**

All member-facing pages now fetch real data from Supabase instead of using placeholder/hardcoded values:

- **Dashboard:** Fetches metrics (hours, certs, penalties), upcoming assignments, and recent activity from `members`, `certifications`, `penalty_points`, `event_signups`, and `event_hours` tables.
- **Events:** Fetches upcoming/past events from `events` table, user signups from `event_signups`.
- **Training:** Fetches available sessions from `training_sessions`, enrolled sessions via `training_signups`.
- **Profile:** Fetches certifications from `certifications`, penalty points from `penalty_points`, and member data via `useAuth()`.

All pages implement loading (skeleton), empty, and error states.

