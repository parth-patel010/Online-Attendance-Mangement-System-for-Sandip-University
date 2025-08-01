# 🎓 Sandip University Attendance Management System

A comprehensive, modern attendance management system built for Sandip University with real-time tracking, sub-division support, and detailed reporting capabilities.

![Sandip University](public/logo.png)

## ✨ Features

### 🎯 Core Functionality
- **📊 Real-time Attendance Tracking** - Submit and monitor student attendance instantly
- **🏫 Sub-division Support** - Manage A1, A2, A3 batches within divisions
- **👥 Multi-role Access** - Separate portals for students/faculty and administrators
- **📈 Detailed Reports** - Generate comprehensive attendance reports with CSV export
- **🔐 Secure Authentication** - Protected login system for all users

### 🎨 User Experience
- **📱 Fully Responsive Design** - Works perfectly on mobile, tablet, and desktop
- **🎪 Beautiful UI/UX** - Modern interface with smooth animations
- **⚡ Fast Performance** - Optimized for quick loading and smooth interactions
- **🎯 Intuitive Navigation** - Easy-to-use interface for all user types

### 🛠️ Technical Features
- **🗄️ Database Management** - Complete CRUD operations for all entities
- **📊 Advanced Reporting** - Filter by date ranges (today, yesterday, this month, this year)
- **📤 CSV Export** - Download attendance data with date range comments
- **🔧 Admin Dashboard** - Comprehensive management interface

## 🏗️ System Architecture

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Radix UI** - Accessible component primitives

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Prisma ORM** - Database management
- **PostgreSQL** - Reliable database (Neon)
- **bcrypt** - Secure password hashing

### Database Schema
```
Admin/User → Authentication
Department → Divisions → SubDivisions
Faculty → Attendance Records
Subject → Attendance Records
Timing → Attendance Records
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL database

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sandip-attendance
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp example.env .env.local
   ```
   
   Update `.env.local` with your database URL:
   ```env
   DATABASE_URL=your_postgresql_connection_string
   ```

4. **Database Setup**
   ```bash
   # Push schema to database
   npm run db:push
   
   # Seed initial data
   npm run db:seed
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Access the Application**
   - Open [http://localhost:3000](http://localhost:3000)
   - Login with: `sandip_university@gmail.com` / `codecrafters@123`

## 📱 Application Structure

### 🏠 Home Page (`/`)
- **Welcome Interface** - University branding and navigation
- **Feature Cards** - Quick access to Attendance Portal and Admin Panel
- **Responsive Design** - Optimized for all devices

### 🔐 Authentication Pages
- **User Login** (`/login`) - Split-screen design with university background
- **Admin Login** (`/admin2025`) - Secure admin authentication

### 📊 Attendance Portal (`/attendance-portal`)
- **Department Selection** - Choose from available departments
- **Division Management** - Select divisions and sub-divisions
- **Subject Assignment** - Choose relevant subjects
- **Faculty Selection** - Assign faculty members
- **Timing Slots** - Select appropriate time periods
- **Attendance Submission** - Record present/absent students

### ⚙️ Admin Dashboard (`/admin2025/dashboard`)
- **Reports Tab** - View and export attendance data
- **Management Tab** - CRUD operations for all entities

#### 📈 Reports Features
- **Date Range Filtering** - Today, yesterday, this month, this year
- **CSV Export** - Download reports with date range comments
- **Real-time Data** - Live attendance statistics
- **Detailed Views** - Comprehensive attendance breakdown

#### 🔧 Management Features
- **Departments** - Create, edit, delete departments
- **Divisions** - Manage divisions within departments
- **Sub-divisions** - Handle A1, A2, A3 batches
- **Subjects** - Course and subject management
- **Faculty** - Faculty member administration
- **Timings** - Time slot configuration

## 🎨 Design Features

### 🖼️ Visual Design
- **University Branding** - Sandip University logo and colors
- **Professional Layout** - Clean, modern interface
- **Split-screen Login** - Beautiful background image integration
- **Responsive Grid** - Adaptive layouts for all screen sizes

### 🎪 Animations
- **Framer Motion** - Smooth page transitions
- **Loading States** - Professional loading indicators
- **Hover Effects** - Interactive element feedback
- **Staggered Animations** - Sequential element reveals

### 📱 Mobile Optimization
- **Touch-friendly** - Optimized for mobile interactions
- **Responsive Typography** - Scalable text across devices
- **Mobile-first Design** - Built for mobile, enhanced for desktop
- **Gesture Support** - Swipe and touch interactions

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:push      # Push database schema
npm run db:seed      # Seed database with initial data
```

### Project Structure
```
sandip-attendance/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API routes
│   │   ├── admin2025/      # Admin dashboard
│   │   ├── attendance-portal/ # Attendance submission
│   │   ├── login/          # User authentication
│   │   └── page.tsx        # Home page
│   ├── components/         # Reusable UI components
│   └── lib/               # Utility functions
├── prisma/                # Database schema and migrations
├── public/               # Static assets
└── package.json          # Dependencies and scripts
```

## 🚀 Deployment

### Vercel Deployment
The project is configured for easy deployment on Vercel:

1. **Connect Repository** - Link your GitHub repository to Vercel
2. **Environment Variables** - Set `DATABASE_URL` in Vercel dashboard
3. **Automatic Deployment** - Push to main branch triggers deployment

### Environment Configuration
```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

## 🔐 Security Features

- **Password Hashing** - bcrypt encryption for all passwords
- **Input Validation** - Comprehensive form validation
- **SQL Injection Protection** - Prisma ORM prevents SQL attacks
- **CORS Configuration** - Proper cross-origin resource sharing
- **Environment Variables** - Secure configuration management

## 📊 Database Management

### Initial Data
The system comes pre-seeded with:
- **Departments**: Computer Science, Information Technology, Mechanical Engineering
- **Divisions**: A and B divisions for each department
- **Subjects**: Relevant subjects for each department
- **Faculty**: Sample faculty members
- **Timings**: 8 time slots from 7 AM to 3 PM
- **Admin User**: `sandip_university@gmail.com` / `codecrafters@123`

### Database Operations
- **Automatic Migrations** - Schema changes are handled automatically
- **Data Seeding** - Easy population of initial data
- **Backup Support** - PostgreSQL native backup capabilities

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

## 📝 License

This project is developed for Sandip University. All rights reserved.

## 👨‍💻 Developer

**Design & Development by Assistant Professor Darshan Ahire**

---

## 🎯 Quick Access

- **🏠 Home**: [http://localhost:3000](http://localhost:3000)
- **🔐 User Login**: [http://localhost:3000/login](http://localhost:3000/login)
- **⚙️ Admin Login**: [http://localhost:3000/admin2025](http://localhost:3000/admin2025)
- **📊 Attendance Portal**: [http://localhost:3000/attendance-portal](http://localhost:3000/attendance-portal)

---

*Built with ❤️ for Sandip University*
#   O n l i n e - A t t e n d a n c e - M a n g e m e n t - S y s t e m - f o r - S a n d i p - U n i v e r s i t y  
 