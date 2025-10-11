# 🕉️ TEMPLE MANAGEMENT SYSTEM - COMPLETE MASTER PLAN

## **TEMPLE INFORMATION**

### **Official Details:**

**Name:** Shri Raghavendra Swamy Brundavana Sannidhi
**Organization:** Guru Seva Mandali (Regd.)
**Tagline:** Shri Moola Ramo Vijayathe

**Address:**
No. 9/2, Damodhara Mudaliar Street
Halasuru, Bangalore - 560 008
Karnataka, India

**Contact:**
Phone 1: 99028 20105
Phone 2: 70193 37306

**Mission & Vision:**
Shri Guru Raghavendra Swamy Brundavana Sannidhi, Halasuru, Bangalore, is a beacon of spiritual solace and devotion for countless devotees. It has become a central hub for our community, serving its religious, spiritual, educational, cultural, social, and charitable needs.

**Current Project:**
Comprehensive expansion project with goal of completion by 2026.
Estimated budget: ₹6.50 Crores

**Expansion includes:**
- Reconstruction of the sacred Brundavana of Shri Guru Raghavendra Swamy
- Construction of new Garbha Gruha with Mukha Mantapa
- Building of new Chariot (Ratha) & new Pallaki (Palanquin)
- Establishment of fully equipped Indoor Yagashala & Holy Kitchen
- Provision of Guest Rooms and Fresh-up Facilities
- Installation of Elevator, Generator and Solar Power System
- Creation of Covered Carport, Walkway for outdoor Parikrama
- Installation of dedicated Borewell & Well
- Installation of CCTV Surveillance across premises

**Bank Details (for donations):**
Bank Name: HDFC Bank
Account Name: Guru Seva Mandali
Account Number: 50200070839659
Branch: Indira Nagar
RTGS/NEFT IFSC: HDFC0000184
Bank Address: #548/D, Maruthi Mansion, CMH Road, Indiranagar, Bangalore - 560 038

**Google Maps:** (Location available via QR code in temple documents)

---

## **PROJECT OVERVIEW**

A comprehensive digital platform for temple management with two core modules:
1. **Donation Management System** - Accept donations, generate certificates, track donors
2. **Special Pooja Booking System** - Book religious services, manage schedules, confirm bookings

---

## **TABLE OF CONTENTS**

1. [System Architecture](#system-architecture)
2. [Homepage Design](#homepage-design)
3. [User Journeys](#user-journeys)
4. [Database Schema](#database-schema)
5. [Features Overview](#features-overview)
6. [Technical Stack](#technical-stack)
7. [UI/UX Guidelines](#uiux-guidelines)
8. [Integration Points](#integration-points)
9. [Development Roadmap](#development-roadmap)
10. [File Structure](#file-structure)

---

## **SYSTEM ARCHITECTURE**

```
┌─────────────────────────────────────────────────────────────────┐
│                    TEMPLE MANAGEMENT PORTAL                      │
│                         (Homepage)                               │
│                                                                  │
│              ┌─────────────┐  ┌─────────────┐                  │
│              │  DONATIONS  │  │   POOJAS    │                  │
│              └──────┬──────┘  └──────┬──────┘                  │
└─────────────────────┼─────────────────┼─────────────────────────┘
                      │                 │
        ┌─────────────▼─────┐  ┌────────▼──────────┐
        │ DONATION MODULE   │  │ BOOKING MODULE    │
        ├───────────────────┤  ├───────────────────┤
        │ • Quick entry     │  │ • Pooja catalog   │
        │ • Amount input    │  │ • Nakshatra form  │
        │ • Payment         │  │ • Date selection  │
        │ • Certificate gen │  │ • Admin confirm   │
        │ • WhatsApp send   │  │ • Notifications   │
        └─────────┬─────────┘  └─────────┬─────────┘
                  │                       │
                  └───────────┬───────────┘
                              │
                ┌─────────────▼─────────────┐
                │   SHARED SERVICES         │
                ├───────────────────────────┤
                │ • User Management         │
                │ • Payment Gateway         │
                │ • WhatsApp Service        │
                │ • Admin Dashboard         │
                │ • Database                │
                └───────────────────────────┘
```

---

## **HOMEPAGE DESIGN**

### **Layout Concept:**

```
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║                    [Temple Logo/Image]                    ║
║                                                           ║
║      SHRI RAGHAVENDRA SWAMY BRUNDAVANA SANNIDHI          ║
║                  Guru Seva Mandali                        ║
║                                                           ║
║───────────────────────────────────────────────────────────║
║                                                           ║
║              How can we serve you today?                  ║
║                                                           ║
║    ┌────────────────────┐    ┌────────────────────┐     ║
║    │                    │    │                    │     ║
║    │        🙏         │    │        📿         │     ║
║    │   MAKE A          │    │   BOOK SPECIAL     │     ║
║    │   DONATION        │    │   POOJA            │     ║
║    │                    │    │                    │     ║
║    │  Contribute to     │    │  Reserve your      │     ║
║    │  temple services   │    │  special puja      │     ║
║    │                    │    │                    │     ║
║    │  [Donate Now →]    │    │  [Book Now →]      │     ║
║    │                    │    │                    │     ║
║    └────────────────────┘    └────────────────────┘     ║
║                                                           ║
║───────────────────────────────────────────────────────────║
║                                                           ║
║   📞 Contact: 99028 20105 / 70193 37306                   ║
║   📍 Halasuru, Bangalore - 560 008                        ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

### **Design Principles:**

1. **Simple & Clear** - Only 2 main options, no clutter
2. **Mobile-First** - Cards stack vertically on mobile
3. **Visual Hierarchy** - Icons, headings, descriptions, CTAs
4. **Quick Access** - One click from homepage to action
5. **Welcoming** - Temple imagery, traditional colors
6. **Trust Signals** - Contact info, temple name prominently displayed

---

## **USER JOURNEYS**

### **Journey 1: Make a Donation (3-4 minutes)**

```
Homepage
   ↓ [Click "Donate Now"]
Google Sign-in / Phone OTP
   ↓ (Auto-fills name, phone)
Donation Form
   ├─ Name (pre-filled)
   ├─ Phone (pre-filled)
   ├─ Amount (enter)
   ├─ Purpose (dropdown: General/Deity/Festival)
   └─ [Proceed to Payment]
   ↓
Razorpay Payment
   ├─ UPI (fastest)
   ├─ Bank Transfer
   └─ Cards
   ↓
✅ Success Page
   ├─ Receipt Number shown: TMPL/FY/2024-25/00123
   ├─ "Certificate sent to WhatsApp"
   └─ [Download PDF] [Donate Again]

BEHIND THE SCENES:
→ Certificate PDF generated automatically
→ WhatsApp sent with PDF
→ Added to donor WhatsApp group
→ Data saved in database
→ Admin dashboard updated

TIME: 3-4 minutes (2 minutes if returning user)
```

### **Journey 2: Book a Pooja (4-5 minutes)**

```
Homepage
   ↓ [Click "Book Pooja"]
Pooja Catalog
   ├─ Nithya Pooja - ₹201
   ├─ Vishesha Alankara Seva - ₹1001
   └─ ... (11 options)
   ↓ [Select & Click "Book"]
Booking Form
   ├─ Name (enter)
   ├─ Phone (enter)
   ├─ Nakshatra (dropdown: 27 options)
   ├─ Preferred Date (date picker)
   ├─ Preferred Time (time picker)
   ├─ Special Instructions (optional)
   └─ [Proceed to Payment]
   ↓
Razorpay Payment
   ↓
✅ Success Page
   ├─ Booking Number: PJB/FY/2024-25/00001
   ├─ "Admin will confirm within 24 hours"
   └─ [View Booking]

BEHIND THE SCENES:
→ Booking saved with PENDING status
→ WhatsApp confirmation sent to user
→ WhatsApp notification sent to admin
→ Admin dashboard shows new booking
→ Admin confirms date/time
→ User gets final confirmation

TIME: 4-5 minutes
```

### **Journey 3: Admin - Confirm Booking (2 minutes)**

```
Admin Login
   ↓
Dashboard
   ├─ "5 Pending Bookings" alert
   └─ [View Bookings]
   ↓
Bookings List
   ├─ PJB/.../00123 - Ramesh - Vishesha... ⏳Pending
   └─ [Click to view]
   ↓
Booking Details
   ├─ Devotee: Ramesh, 9876543210
   ├─ Pooja: Vishesha Alankara Seva
   ├─ Requested: 15-Oct-2025, 10:00 AM
   ├─ [Confirm] [Reschedule] [Contact]
   └─ Final Date: [15-Oct-2025 ✓]
       Final Time: [10:30 AM] ← Admin adjusts
   ↓
[Click "Confirm Booking"]
   ↓
✅ Confirmed
   → Status: PENDING → CONFIRMED
   → Auto WhatsApp sent to user with final schedule
   → Calendar updated

TIME: 2 minutes per booking
```

---

## **DATABASE SCHEMA - COMPLETE**

### **1. Users Table (Shared)**
```sql
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Authentication
    google_id VARCHAR(255) UNIQUE,
    phone_number VARCHAR(15) UNIQUE NOT NULL,
    phone_verified BOOLEAN DEFAULT FALSE,

    -- Personal Info
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),

    -- WhatsApp Group
    whatsapp_group_added BOOLEAN DEFAULT FALSE,
    whatsapp_group_added_at TIMESTAMP,
    whatsapp_opt_in BOOLEAN DEFAULT TRUE,

    -- Statistics
    total_donations DECIMAL(10,2) DEFAULT 0,
    donation_count INT DEFAULT 0,
    booking_count INT DEFAULT 0,
    first_activity_date TIMESTAMP,
    last_activity_date TIMESTAMP,

    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_phone ON users(phone_number);
CREATE INDEX idx_email ON users(email);
```

### **2. Donations Table**
```sql
CREATE TABLE donations (
    donation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    receipt_number VARCHAR(50) UNIQUE NOT NULL,  -- TMPL/FY/2024-25/00001
    user_id UUID REFERENCES users(user_id),

    -- Donation Details
    amount DECIMAL(10,2) NOT NULL,
    donation_type VARCHAR(50),
    donation_purpose TEXT,

    -- Payment
    payment_status VARCHAR(20) NOT NULL,
    payment_method VARCHAR(20) NOT NULL,
    razorpay_order_id VARCHAR(100),
    razorpay_payment_id VARCHAR(100),
    razorpay_signature VARCHAR(255),

    -- Bank Transfer (if applicable)
    bank_name VARCHAR(255),
    bank_account_last4 VARCHAR(4),
    transaction_reference VARCHAR(100),

    -- Receipt
    receipt_pdf_url TEXT,
    whatsapp_sent BOOLEAN DEFAULT FALSE,
    whatsapp_sent_at TIMESTAMP,

    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_receipt_number ON donations(receipt_number);
CREATE INDEX idx_user_donations ON donations(user_id);
CREATE INDEX idx_created_at ON donations(created_at DESC);
```

### **3. Pooja Services Table**
```sql
CREATE TABLE pooja_services (
    pooja_id INT PRIMARY KEY AUTO_INCREMENT,
    pooja_name VARCHAR(255) NOT NULL,
    pooja_name_kannada VARCHAR(255),
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    duration_minutes INT DEFAULT 60,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pre-populate with 11 services
INSERT INTO pooja_services (pooja_name, price, display_order) VALUES
('Nithya Pooja', 201.00, 1),
('Padha Pooja', 201.00, 2),
('Panchmrutha Abhisheka', 201.00, 3),
('Madhu Abhisheka', 251.00, 4),
('Sarva Seva', 501.00, 5),
('Vishesha Alankara Seva', 1001.00, 6),
('Belli Kavachadharane', 1001.00, 7),
('Sahasranama Archane', 251.00, 8),
('Vayusthuthi Punascharne', 501.00, 9),
('Kanakabhisheka', 501.00, 10),
('Vastra Arpane Seva', 2001.00, 11);
```

### **4. Pooja Bookings Table**
```sql
CREATE TABLE pooja_bookings (
    booking_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_number VARCHAR(50) UNIQUE NOT NULL,  -- PJB/FY/2024-25/00001
    user_id UUID REFERENCES users(user_id),

    -- User Info (denormalized for easy access)
    user_name VARCHAR(255) NOT NULL,
    user_phone VARCHAR(15) NOT NULL,
    user_email VARCHAR(255),
    nakshatra VARCHAR(100) NOT NULL,

    -- Pooja Details
    pooja_id INT REFERENCES pooja_services(pooja_id),
    pooja_name VARCHAR(255) NOT NULL,
    pooja_price DECIMAL(10,2) NOT NULL,

    -- Scheduling
    preferred_date DATE,
    preferred_time TIME,
    confirmed_date DATE,
    confirmed_time TIME,
    special_instructions TEXT,

    -- Payment
    payment_status VARCHAR(20) NOT NULL,
    payment_method VARCHAR(20),
    razorpay_order_id VARCHAR(100),
    razorpay_payment_id VARCHAR(100),
    transaction_id VARCHAR(100),

    -- Status & Confirmations
    booking_status VARCHAR(20) DEFAULT 'PENDING',  -- PENDING, CONFIRMED, COMPLETED, CANCELLED
    user_confirmation_sent BOOLEAN DEFAULT FALSE,
    user_confirmation_sent_at TIMESTAMP,
    admin_notification_sent BOOLEAN DEFAULT FALSE,
    admin_notification_sent_at TIMESTAMP,
    confirmed_by_admin_at TIMESTAMP,
    completed_at TIMESTAMP,

    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_booking_number ON pooja_bookings(booking_number);
CREATE INDEX idx_user_phone ON pooja_bookings(user_phone);
CREATE INDEX idx_booking_status ON pooja_bookings(booking_status);
CREATE INDEX idx_preferred_date ON pooja_bookings(preferred_date);
```

### **5. Receipt/Booking Sequences**
```sql
CREATE TABLE receipt_sequence (
    fiscal_year VARCHAR(7) PRIMARY KEY,
    last_sequence INT DEFAULT 0
);

CREATE TABLE booking_sequence (
    fiscal_year VARCHAR(7) PRIMARY KEY,
    last_sequence INT DEFAULT 0
);
```

### **6. WhatsApp Groups**
```sql
CREATE TABLE whatsapp_groups (
    group_id VARCHAR(100) PRIMARY KEY,
    group_name VARCHAR(255) NOT NULL,
    group_invite_link TEXT,
    participant_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE whatsapp_group_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id VARCHAR(100) REFERENCES whatsapp_groups(group_id),
    user_id UUID REFERENCES users(user_id),
    phone_number VARCHAR(15),
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'active'
);
```

### **7. Admin Users**
```sql
CREATE TABLE admin_users (
    admin_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(20) DEFAULT 'viewer',  -- admin, viewer, priest
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## **FEATURES OVERVIEW**

### **MODULE 1: DONATIONS**

#### **User Features:**
✅ Quick donation form (minimal fields)
✅ Google Sign-in / Phone OTP for fast data entry
✅ Auto-fill for returning users
✅ Multiple payment options (UPI, Bank Transfer, Cards)
✅ Instant receipt number generation
✅ Beautiful certificate PDF (custom designed)
✅ WhatsApp delivery of certificate
✅ Download option

#### **Admin Features:**
✅ Donation dashboard (today, month, year totals)
✅ Complete donor database (searchable, filterable)
✅ Individual donor profiles with history
✅ Export to Excel/CSV
✅ Reports (daily, monthly, fiscal year)
✅ Payment method analysis
✅ Failed transaction tracking

#### **Automation:**
✅ Auto-generate unique receipt numbers
✅ Auto-generate certificate PDFs
✅ Auto-send via WhatsApp
✅ Auto-add to donor WhatsApp group
✅ Auto-update donor statistics

---

### **MODULE 2: POOJA BOOKINGS**

#### **User Features:**
✅ Browse 11 available poojas with prices
✅ Simple booking form
✅ Nakshatra selection (27 options with Hindi names)
✅ Date/time preference selection
✅ Special instructions field
✅ Multiple payment options
✅ Instant booking confirmation
✅ WhatsApp booking confirmation
✅ Track booking status

#### **Admin Features:**
✅ Booking dashboard (pending, today, upcoming)
✅ Complete bookings list (filterable by date, status, pooja)
✅ Detailed booking view
✅ Confirm/reschedule/cancel bookings
✅ Calendar view of all bookings
✅ Contact devotee directly
✅ Reports (by pooja type, revenue, nakshatra analysis)
✅ Export bookings

#### **Automation:**
✅ Auto-generate unique booking numbers
✅ Auto-send user confirmation
✅ Auto-notify admin
✅ Auto-send final confirmation after admin confirms
✅ Auto-update calendar
✅ Auto-update statistics

---

### **SHARED FEATURES**

#### **User Management:**
✅ Single sign-on (Google / Phone OTP)
✅ User profile with complete history
✅ Both donations and bookings in one account
✅ Contact preferences
✅ WhatsApp opt-in/out

#### **Payment Gateway:**
✅ Razorpay integration
✅ UPI payments (fastest)
✅ Credit/Debit cards
✅ Net banking
✅ Bank transfer option
✅ Payment verification
✅ Failed payment handling

#### **WhatsApp Service:**
✅ Certificate delivery
✅ Booking confirmations
✅ Admin notifications
✅ Group management
✅ Broadcast messages
✅ Template management

#### **Admin Dashboard:**
✅ Unified view of donations + bookings
✅ Today's activity summary
✅ Pending actions alert
✅ Quick stats
✅ Recent transactions
✅ Search across all data
✅ User management
✅ Settings

---

## **TECHNICAL STACK**

### **Frontend:**
- **Framework:** Next.js 14+ (React with App Router)
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Forms:** React Hook Form + Zod validation
- **State:** React Context / Zustand
- **Icons:** Lucide React
- **Date/Time:** react-datepicker

### **Backend:**
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Language:** TypeScript
- **API:** RESTful
- **Authentication:** NextAuth.js (Google OAuth + Phone OTP)
- **PDF Generation:** Puppeteer
- **File Upload:** Multer

### **Database:**
- **Primary:** PostgreSQL 14+
- **ORM:** Prisma / Drizzle
- **Cache:** Redis (optional, for sessions)

### **Third-Party Services:**
- **Payment:** Razorpay Node SDK
- **WhatsApp:** WATI / Aisensy / Twilio
- **SMS:** Twilio / MSG91
- **Storage:** AWS S3 / Cloudinary (for PDFs)
- **Email:** SendGrid (optional)

### **DevOps:**
- **Frontend Hosting:** Vercel
- **Backend Hosting:** Railway / Render / AWS EC2
- **Database:** Supabase / Neon / AWS RDS
- **CDN:** Cloudflare
- **Monitoring:** Sentry
- **Analytics:** Google Analytics / Mixpanel

---

## **UI/UX GUIDELINES**

### **Design System:**

**Colors:**
```css
/* Primary Colors */
--temple-maroon: #8B0000;
--temple-gold: #DAA520;
--temple-cream: #FFF8DC;

/* Secondary Colors */
--success: #10B981;
--warning: #F59E0B;
--error: #EF4444;
--info: #3B82F6;

/* Neutrals */
--gray-50: #F9FAFB;
--gray-900: #111827;
```

**Typography:**
- **Headings:** Cinzel (formal, elegant)
- **Body:** Inter / Poppins (clean, readable)
- **Regional:** Noto Sans Devanagari (for Hindi)

**Spacing:**
- Base unit: 4px
- Generous padding on mobile (touch-friendly)
- Clear visual separation between sections

**Components:**
- Large, clear buttons (min 44px height on mobile)
- Single-column forms on mobile
- Inline validation with helpful messages
- Loading states for all async actions
- Success animations on completion

### **Mobile-First Principles:**

1. **One thing per screen** - Don't overwhelm
2. **Progressive disclosure** - Show only what's needed
3. **Big touch targets** - Minimum 44x44px
4. **Clear CTAs** - One primary action per screen
5. **Minimal typing** - Use dropdowns, datepickers, auto-fill
6. **Instant feedback** - Loading states, success messages
7. **Easy navigation** - Back button, breadcrumbs
8. **Offline fallback** - Graceful error messages

### **Accessibility:**
- ✅ Semantic HTML
- ✅ ARIA labels
- ✅ Keyboard navigation
- ✅ High contrast ratios (WCAG AA)
- ✅ Screen reader friendly
- ✅ Regional language support

---

## **INTEGRATION POINTS**

### **1. Razorpay Integration**

**Flow:**
```javascript
// Frontend
const handlePayment = async (amount, type) => {
    // Create order
    const response = await fetch('/api/create-order', {
        method: 'POST',
        body: JSON.stringify({ amount, type }) // type: 'donation' or 'booking'
    });
    const { orderId, key } = await response.json();

    // Open Razorpay checkout
    const options = {
        key: key,
        amount: amount * 100,
        currency: 'INR',
        order_id: orderId,
        handler: function(response) {
            verifyPayment(response);
        },
        prefill: {
            name: user.name,
            email: user.email,
            contact: user.phone
        },
        theme: { color: '#8B0000' }
    };

    const razorpay = new Razorpay(options);
    razorpay.open();
};

// Backend
app.post('/api/create-order', async (req, res) => {
    const { amount, type } = req.body;
    const receiptNumber = await generateReceiptNumber(type);

    const order = await razorpay.orders.create({
        amount: amount * 100,
        currency: 'INR',
        receipt: receiptNumber,
        notes: { type, receiptNumber }
    });

    res.json({ orderId: order.id, key: process.env.RAZORPAY_KEY });
});

// Webhook verification
app.post('/api/payment-webhook', async (req, res) => {
    const signature = req.headers['x-razorpay-signature'];
    const isValid = verifyWebhookSignature(req.body, signature);

    if (isValid) {
        const { order_id, payment_id } = req.body.payload.payment.entity;
        await processPaymentSuccess(order_id, payment_id);
    }

    res.json({ status: 'ok' });
});
```

### **2. WhatsApp Integration**

**Message Templates:**

```javascript
// Donation Confirmation
const donationTemplate = (data) => `
🙏 Namaste ${data.name}!

Thank you for your generous donation!

💰 Amount: ₹${data.amount}
🧾 Receipt No: ${data.receiptNumber}
📅 Date: ${data.date}

Your donation certificate is attached.

🕉️ May God bless you and your family!

For queries: 9945594845
`;

// Booking Confirmation (User)
const bookingUserTemplate = (data) => `
🙏 Namaste ${data.name}!

Your pooja booking is confirmed!

🆔 Booking No: ${data.bookingNumber}
📿 Pooja: ${data.poojaName}
💰 Amount: ₹${data.amount}
📅 Requested: ${data.preferredDate}
⭐ Nakshatra: ${data.nakshatra}

Admin will confirm final schedule within 24 hours.

📞 Contact: 9945594845
`;

// Booking Notification (Admin)
const bookingAdminTemplate = (data) => `
🔔 NEW POOJA BOOKING

🆔 ${data.bookingNumber}
👤 ${data.name} (${data.phone})
📿 ${data.poojaName} - ₹${data.amount}
📅 Preferred: ${data.preferredDate} ${data.preferredTime}
⭐ ${data.nakshatra}

ACTION REQUIRED: Confirm booking
[View Dashboard]
`;
```

### **3. Google Authentication**

```javascript
// NextAuth configuration
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })
    ],
    callbacks: {
        async signIn({ user, account }) {
            // Create or update user in database
            await upsertUser({
                googleId: account.providerAccountId,
                email: user.email,
                name: user.name
            });
            return true;
        },
        async session({ session, token }) {
            // Add user ID to session
            session.user.id = token.sub;
            return session;
        }
    }
});
```

---

## **DEVELOPMENT ROADMAP**

### **Phase 1: Foundation (Weeks 1-2)**
**Goal:** Set up infrastructure and core systems

**Tasks:**
- [ ] Set up project repository (Git)
- [ ] Initialize Next.js project
- [ ] Set up PostgreSQL database (local + cloud)
- [ ] Design and create database schema
- [ ] Set up Prisma ORM
- [ ] Configure environment variables
- [ ] Set up authentication (Google + Phone)
- [ ] Integrate Razorpay (test mode)
- [ ] Create basic homepage layout
- [ ] Set up admin dashboard skeleton

**Deliverables:**
- ✅ Working local development environment
- ✅ Database with all tables
- ✅ Authentication working
- ✅ Test payment working

---

### **Phase 2: Donation Module (Weeks 3-4)**
**Goal:** Complete donation functionality

**Tasks:**
- [ ] Design donation form UI
- [ ] Implement donation form with validation
- [ ] Create receipt number generation logic
- [ ] Design certificate template
- [ ] Implement PDF generation (Puppeteer)
- [ ] Set up file storage (S3/Cloudinary)
- [ ] Integrate WhatsApp API
- [ ] Implement certificate delivery
- [ ] Create donor database view (admin)
- [ ] Implement donation reports
- [ ] Test end-to-end donation flow

**Deliverables:**
- ✅ Working donation system
- ✅ Certificate generation
- ✅ WhatsApp delivery
- ✅ Admin can view donations

---

### **Phase 3: Pooja Booking Module (Weeks 5-6)**
**Goal:** Complete booking functionality

**Tasks:**
- [ ] Create pooja catalog UI
- [ ] Design booking form with nakshatra dropdown
- [ ] Implement booking form
- [ ] Create booking number generation logic
- [ ] Implement booking confirmation system
- [ ] Create admin booking management UI
- [ ] Implement booking confirmation workflow
- [ ] Create calendar view
- [ ] Implement booking status updates
- [ ] Send notifications on status changes
- [ ] Test end-to-end booking flow

**Deliverables:**
- ✅ Working booking system
- ✅ Admin can manage bookings
- ✅ Dual confirmation working
- ✅ Calendar view functional

---

### **Phase 4: Integration & Features (Weeks 7-8)**
**Goal:** Integrate both modules and add advanced features

**Tasks:**
- [ ] Create unified homepage
- [ ] Integrate user profiles (donations + bookings)
- [ ] Implement WhatsApp group auto-addition
- [ ] Create unified admin dashboard
- [ ] Implement advanced reporting
- [ ] Add export functionality (Excel/CSV)
- [ ] Implement bulk actions
- [ ] Add search across all data
- [ ] Create mobile-optimized views
- [ ] Add loading states and animations

**Deliverables:**
- ✅ Unified platform
- ✅ Complete admin dashboard
- ✅ Advanced features working

---

### **Phase 5: Polish & Testing (Weeks 9-10)**
**Goal:** Ensure quality and prepare for launch

**Tasks:**
- [ ] User acceptance testing
- [ ] Fix bugs and issues
- [ ] Performance optimization
- [ ] Security audit
- [ ] Accessibility audit
- [ ] Cross-browser testing
- [ ] Mobile device testing
- [ ] Load testing
- [ ] Create user documentation
- [ ] Create admin training materials
- [ ] Set up monitoring (Sentry)
- [ ] Set up analytics

**Deliverables:**
- ✅ Bug-free system
- ✅ Optimized performance
- ✅ Documentation complete

---

### **Phase 6: Deployment & Launch (Week 11)**
**Goal:** Go live!

**Tasks:**
- [ ] Set up production environment
- [ ] Configure production database
- [ ] Set up production domain
- [ ] Configure SSL certificates
- [ ] Set up CDN
- [ ] Configure production payment gateway
- [ ] Set up production WhatsApp API
- [ ] Deploy frontend to Vercel
- [ ] Deploy backend to Railway/Render
- [ ] Set up automated backups
- [ ] Final testing on production
- [ ] Soft launch (limited users)
- [ ] Monitor and fix issues
- [ ] Full public launch

**Deliverables:**
- ✅ Live production system
- ✅ Monitoring in place
- ✅ Ready for users

---

### **Phase 7: Post-Launch (Ongoing)**
**Goal:** Support, maintain, and improve

**Tasks:**
- Monitor system health
- Respond to user feedback
- Fix bugs as reported
- Add new features based on usage
- Optimize based on analytics
- Regular backups and maintenance
- Update dependencies
- Security patches

---

## **FILE STRUCTURE**

```
temple-management-system/
│
├── frontend/                       # Next.js Frontend
│   ├── app/                        # App router
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx                # Homepage
│   │   ├── donate/
│   │   │   ├── page.tsx            # Donation page
│   │   │   └── success/page.tsx    # Success page
│   │   ├── book-pooja/
│   │   │   ├── page.tsx            # Pooja catalog
│   │   │   ├── [id]/page.tsx      # Booking form
│   │   │   └── success/page.tsx    # Success page
│   │   ├── admin/
│   │   │   ├── layout.tsx          # Admin layout
│   │   │   ├── page.tsx            # Dashboard
│   │   │   ├── donations/          # Donation management
│   │   │   ├── bookings/           # Booking management
│   │   │   ├── users/              # User management
│   │   │   └── settings/           # Settings
│   │   └── api/                    # API routes
│   │       ├── auth/               # Authentication
│   │       ├── donations/          # Donation APIs
│   │       ├── bookings/           # Booking APIs
│   │       └── payments/           # Payment APIs
│   │
│   ├── components/                 # Reusable components
│   │   ├── ui/                     # UI components (buttons, inputs, etc.)
│   │   ├── donation/               # Donation-specific components
│   │   ├── booking/                # Booking-specific components
│   │   ├── admin/                  # Admin-specific components
│   │   └── shared/                 # Shared components
│   │
│   ├── lib/                        # Utilities and libraries
│   │   ├── db.ts                   # Database client
│   │   ├── auth.ts                 # Auth utilities
│   │   ├── razorpay.ts             # Razorpay integration
│   │   ├── whatsapp.ts             # WhatsApp integration
│   │   ├── pdf-generator.ts        # PDF generation
│   │   └── utils.ts                # General utilities
│   │
│   ├── styles/                     # Global styles
│   │   └── globals.css             # Tailwind + custom CSS
│   │
│   ├── public/                     # Static assets
│   │   ├── images/                 # Images
│   │   ├── certificates/           # Certificate assets
│   │   └── icons/                  # Icons
│   │
│   ├── prisma/                     # Database schema
│   │   ├── schema.prisma           # Prisma schema
│   │   └── migrations/             # Database migrations
│   │
│   ├── .env.local                  # Environment variables
│   ├── next.config.js              # Next.js config
│   ├── tailwind.config.js          # Tailwind config
│   ├── tsconfig.json               # TypeScript config
│   └── package.json                # Dependencies
│
├── certificate-system/             # Certificate generation (standalone)
│   ├── certificate-template.html   # HTML template
│   ├── generate-certificate.js     # PDF generator
│   └── certificates/               # Generated PDFs
│
├── docs/                           # Documentation
│   ├── API.md                      # API documentation
│   ├── USER-GUIDE.md               # User guide
│   ├── ADMIN-GUIDE.md              # Admin guide
│   └── DEPLOYMENT.md               # Deployment guide
│
├── scripts/                        # Utility scripts
│   ├── seed-database.js            # Seed initial data
│   └── backup.js                   # Backup script
│
├── MASTER-PLAN.md                  # This file
└── README.md                       # Project README
```

---

## **QUICK START SUMMARY**

### **For Users:**
1. Visit homepage
2. Choose "Donate" or "Book Pooja"
3. Fill simple form (3-5 fields)
4. Pay with Razorpay
5. Get instant confirmation on WhatsApp
6. Done! ✅

### **For Admins:**
1. Login to admin dashboard
2. See all donations and bookings
3. Confirm/manage bookings
4. View reports
5. Export data
6. Manage users

### **Key Metrics (Target):**
- **Donation completion:** < 3 minutes
- **Booking completion:** < 5 minutes
- **Admin booking confirmation:** < 2 minutes
- **Mobile-first:** 80%+ mobile users
- **Payment success rate:** > 95%
- **User satisfaction:** > 4.5/5

---

## **NEXT STEPS**

1. **Review this plan** - Make sure all requirements are covered
2. **Finalize design** - Review homepage and UI mockups
3. **Set up development environment** - Install tools, create repos
4. **Start Phase 1** - Database and authentication
5. **Iterate and build** - Follow the roadmap

---

## **CONTACT & SUPPORT**

**Temple Contact:**
- Phone: 99028 20105 / 70193 37306
- Address: No. 9/2, Damodhara Mudaliar Street, Halasuru, Bangalore - 560 008

**Technical Support:**
- Email: tech@temple.org (to be created)
- GitHub: (repository link)

---

**🕉️ This is the complete master plan for your Temple Management System!**

**Every feature from both use cases is covered:**
✅ Donations with certificates
✅ Pooja bookings with scheduling
✅ WhatsApp automation
✅ Admin management
✅ User-friendly design
✅ Mobile-first approach
✅ Complete database design
✅ Development roadmap

Ready to build! 🚀
