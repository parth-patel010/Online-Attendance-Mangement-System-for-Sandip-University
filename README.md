# 🎓 Sandip University Attendance Management System

A comprehensive, modern attendance system built for Sandip University with real-time tracking, sub-division support, and detailed reporting capabilities.

![Sandip University](public/logo.png)

---

## ✨ Features

### 🎯 Core Functionality
- **📊 Real-time Attendance Tracking** – Submit and monitor attendance instantly
- **🏫 Sub-division Support** – Manage A1, A2, A3 batches within divisions
- **👥 Multi-role Access** – Separate portals for students/faculty and administrators
- **📈 Detailed Reports** – Generate and export CSV reports with advanced filters
- **🔐 Secure Authentication** – Role-based protected login system

### 🎨 User Experience
- **📱 Fully Responsive** – Optimized for mobile, tablet, and desktop
- **🎪 Beautiful UI/UX** – Modern interface with smooth animations
- **⚡ Fast Performance** – Quick loading, smooth navigation
- **🎯 Intuitive Navigation** – Easy-to-use for all users

### 🛠️ Technical Features
- **🗄️ Database Management** – Full CRUD support
- **📊 Advanced Reporting** – Date range filters: Today, Yesterday, This Month, This Year
- **📤 CSV Export** – Download reports with comments
- **🔧 Admin Dashboard** – Complete entity management

---

## 🏗️ System Architecture

### Frontend
- **Next.js 15** – App Router architecture
- **TypeScript** – Type-safe coding
- **Tailwind CSS** – Utility-first styling
- **Framer Motion** – Page transitions and animations
- **Radix UI** – Accessible UI primitives

### Backend
- **Next.js API Routes** – Serverless endpoints
- **Prisma ORM** – Database abstraction layer
- **PostgreSQL** – Scalable, reliable database (Neon)
- **bcrypt** – Secure password hashing

### Database Schema
```
Admin/User → Authentication  
Department → Divisions → SubDivisions  
Faculty → Attendance Records  
Subject → Attendance Records  
Timing → Attendance Records
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- PostgreSQL database

### Installation

```bash
# Clone the repo
git clone <repository-url>
cd sandip-attendance

# Install dependencies
npm install

# Copy and configure env
cp example.env .env.local
```

Edit `.env.local`:
```env
DATABASE_URL=your_postgresql_connection_string
```

```bash
# Setup database
npm run db:push
npm run db:seed

# Start dev server
npm run dev
```

Go to: [http://localhost:3000](http://localhost:3000)

Default login:
```
Email: sandip_university@gmail.com
Password: codecrafters@123
```

---

## 📱 Application Structure

### 🏠 Home (`/`)
- Welcome message, branding
- Feature cards: Attendance Portal, Admin Panel

### 🔐 Auth Pages
- `/login` – User login
- `/admin2025` – Admin login

### 📊 Attendance Portal (`/attendance-portal`)
- Select: Department → Division → Sub-division
- Assign: Subject, Faculty, Timing
- Submit attendance count

### ⚙️ Admin Dashboard (`/admin2025/dashboard`)
#### 📈 Reports
- Filter by date ranges
- Export CSV
- Real-time stats
- Detailed breakdown

#### 🔧 Management
- Departments, Divisions, Sub-divisions
- Subjects, Faculty, Timings (CRUD support)

---

## 🎨 Design Features

### 🖼️ Visuals
- Sandip University branding
- Split-screen login with background image
- Responsive grid layout

### 🎪 Animations
- Framer Motion transitions
- Loading indicators
- Hover effects
- Staggered element reveals

### 📱 Mobile-First
- Touch-friendly elements
- Scalable typography
- Mobile gesture support

---

## 🔧 Development Scripts

```bash
npm run dev        # Start dev server
npm run build      # Build for production
npm run start      # Start prod server
npm run lint       # Run ESLint
npm run db:push    # Push DB schema
npm run db:seed    # Seed initial data
```

---

## 🗂️ Project Structure

```
sandip-attendance/
├── src/
│   ├── app/
│   │   ├── api/
│   │   ├── admin2025/
│   │   ├── attendance-portal/
│   │   ├── login/
│   │   └── page.tsx
│   ├── components/
│   └── lib/
├── prisma/
├── public/
└── package.json
```

---

## 🚀 Deployment (Vercel)

1. Connect GitHub repo to Vercel
2. Add environment variable `DATABASE_URL`
3. Push to `main` branch to trigger auto-deploy

### Vercel Config Example

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

---

## 🔐 Security Features

- bcrypt password encryption
- Form input validation
- Prisma protects against SQL injection
- CORS configured properly
- Environment variables for secrets

---

## 📊 Default Database Seed

- **Departments**: CSE, IT, Mech Engg
- **Divisions**: A, B
- **Subjects**: Assigned by dept
- **Faculty**: Sample users
- **Timings**: 8 slots (7 AM – 3 PM)
- **Admin**: `sandip_university@gmail.com` / `codecrafters@123`

---

## 🤝 Contributing

```bash
# Fork the repository
# Create a feature branch
git checkout -b feature/amazing-feature

# Commit your changes
git commit -m "Add amazing feature"

# Push to GitHub
git push origin feature/amazing-feature

# Open a Pull Request
```

---

## 📝 License

This project is built exclusively for Sandip University. All rights reserved.

---

## 👨‍💻 Developer

**Design & Development by Assistant Professor Darshan Ahire**

---

## 🎯 Quick Links

- 🏠 Home: [http://localhost:3000](http://localhost:3000)
- 🔐 User Login: [http://localhost:3000/login](http://localhost:3000/login)
- ⚙️ Admin Login: [http://localhost:3000/admin2025](http://localhost:3000/admin2025)
- 📊 Attendance Portal: [http://localhost:3000/attendance-portal](http://localhost:3000/attendance-portal)

---

*Built with ❤️ for Sandip University*
