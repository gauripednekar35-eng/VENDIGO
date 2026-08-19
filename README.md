# VENDIGO - Hyperlocal Street Food Discovery Platform 🍢🍔🌮

VENDIGO is a full-stack, responsive web application designed for college projects and real-world hyperlocal discovery. It connects users with local street food vendors, offers OpenStreetMap interactive stall mapping, complete menu browsing, multi-role access (Customer, Vendor, Admin), menu & shop CRUD, and Cash on Delivery order processing.

---

## 🎨 Theme & Design Aesthetics
- **Primary Color**: `#2E7D32` (Swiggy / Zomato Emerald Green)
- **Secondary Color**: `#FF8F00` (Street Food Warm Orange)
- **Background**: Crisp `#FAFAFA` white background with glassmorphism overlays
- **Card Design**: Soft rounded 3XL corners, subtle elevation, and dynamic hover micro-animations

---

## ⚡ Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Leaflet (OpenStreetMap)
- **Backend**: Node.js, Express.js, JWT Authentication, Mongoose / MongoDB schemas
- **Payment Method**: 100% Cash on Delivery (COD)

---

## 🚀 Quick Start Instructions

### 1. Run React Frontend Client
```bash
cd client
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Run Express Backend Server API
```bash
cd server
npm install
npm run dev
```
The server will run on [http://localhost:5000](http://localhost:5000).

---

## 👑 Features Breakdown

### 1. Customer Discovery
- **Hero & Search**: Search bar with real-time vendor and dish filtering.
- **OpenStreetMap Discovery**: Live Leaflet map displaying vendor pins with ratings and direct menu access.
- **Vendor Listing & Details**: Open/Closed status, rating badges, prep time, price for two, and category filters.
- **Cart & Checkout**: Slide-out cart drawer, single-vendor consistency enforcement modal, address selector, and Cash on Delivery placement.
- **Order Tracking**: Real-time status tracker (*Pending -> Accepted -> Preparing -> Ready -> Delivered*).

### 2. Street Vendor Hub
- **Store Status**: One-click toggle between **OPEN** and **CLOSED**.
- **Shop Management**: Update stall name, prep time, address, and banner photo.
- **Menu CRUD**: Add, edit, delete dishes, set prices, and toggle dish availability.
- **Kitchen Orders**: View incoming orders, accept/reject, and advance cooking status.

### 3. Admin Governance
- **Stall Approval**: Audit pending street vendor applications and approve listing.
- **User & Vendor Governance**: Audit all registered users and vendors with delete capabilities.

---

## 🌟 Demo User Roles
You can instantly switch roles using the header role switcher bar:
- **Customer**: `customer@vendigo.com`
- **Vendor**: `vendor@vendigo.com`
- **Admin**: `admin@vendigo.com`
