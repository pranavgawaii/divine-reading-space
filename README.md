# Divine Reading Space 📚✨

![Status](https://img.shields.io/badge/Status-Active-success)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-orange)

**Divine Reading Space** is a premium, SaaS-style library seat booking platform designed for serious aspirants and students. It offers a distraction-free environment for deep work, managed through a high-end digital experience.

This tailored solution includes a **Student Dashboard** for booking and payments, and a powerful **Admin Panel** for seat management and analytics.

---

## 🚀 Features

### 🎓 For Students
*   **Premium Dashboard**: A distraction-free command center to manage subscriptions and bookings.
*   **Visual Seat Selection**: Interactive map to choose specific seats (Window/Aisle) with real-time availability.
*   **Streamlined Payments**: UPI integration with screenshot upload and verification status tracking.
*   **Mobile-First Design**: Fully responsive interface that works perfectly on phones and tablets.

### 🛡️ For Admins
*   **Live Overview**: Real-time stats on Active Bookings, Monthly Revenue, and Occupancy Rates.
*   **Payment Verification**: dedicated workflow to Approve/Reject payment screenshots with one click.
*   **Seat Management**: Toggle maintenance mode for broken seats or block seats for VIPs.
*   **Student Directory**: Complete list of students with booking history and contact details.

---

## 🛠️ Tech Stack

*   **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Server Actions)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) (Premium "Bento Grid" Design System)
*   **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL, Row Level Security)
*   **Icons**: [Lucide React](https://lucide.dev/)

---

## 🏁 Getting Started

Follow these steps to set up the project locally.

### 1. Prerequisities
Make sure you have `Node.js` (v18+) and `npm` installed.

### 2. Clone the Repository
```bash
git clone https://github.com/pranavgawaii/divine-reading-space.git
cd divine-reading-space
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Create a `.env.local` file in the root directory and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Setup Database (Supabase)
Run the SQL scripts located in the `supabase/` folder in your Supabase SQL Editor:

1.  **`supabase/schema.sql`**: Sets up Tables (`profiles`, `bookings`, `seats`, `payments`), RLS Policies, and triggers.
2.  **`supabase/storage.sql`**: Configures the Storage Bucket for payment screenshots.
3.  **`supabase/admin_policies.sql`**: Grant special access rights to admin users.

> **Note**: To make a user an admin, manually add their `user_id` to the `admin_users` table in Supabase.

### 6. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📁 Project Structure

```bash
├── app/
│   ├── admin/          # Admin Panel (Protected Routes)
│   ├── api/            # Backend API Routes (Next.js Server Actions)
│   ├── dashboard/      # Student Dashboard (Protected Routes)
│   ├── login/          # Auth Pages
│   ├── layout.tsx      # Root Layout
│   └── page.tsx        # Landing Page (Bento Grid Design)
├── lib/
│   ├── supabase/       # Supabase Client/Server Utilities
│   └── utils.ts        # Helper functions
├── public/             # Static Assets
├── supabase/           # SQL Migration Scripts
└── ...config files
```

---

## 🔒 Security & Architecture

*   **Authentication**: Managed via Supabase Auth (Email/Password).
*   **Authorization**: 
    *   **RLS (Row Level Security)** ensures students can only see their own data.
    *   **Middleware** protects `/dashboard` and `/admin` routes from unauthorized access.
*   **Data Integrity**: Foreign key constraints and transaction-like flows for booking verifications.

---

## 🤝 Contributing

1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/amazing-feature`).
3.  Commit your changes (`git commit -m 'Add amazing feature'`).
4.  Push to the branch (`git push origin feature/amazing-feature`).
5.  Open a Pull Request.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

**Built with ❤️ for the community.**
