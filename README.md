# 🏗️ SteelFabPro - Admin Dashboard

SteelFabPro is a full-stack web application for managing users, projects, and inventory in the steel fabrication industry. The Admin Dashboard allows administrators to monitor activities, export data, and manage system records efficiently.

## 🚀 Features

- 🔐 **Admin Authentication**
- 👥 **User Management**: View, search, edit (future), and delete users.
- 📁 **Project Management**: Track client-submitted projects, assigned manufacturers, status updates.
- 📦 **Inventory Logs**: View all materials submitted with manufacturer details and timestamps.
- 🔍 **Search & Filter**: Instant search functionality for users and projects.
- 📤 **Export Options**:
  - Export complete dashboard as **PDF**
  - Export records as **Excel (XLSX)**
- 🌗 **Dark Mode Compatible**

---

## 🛠️ Tech Stack

| Frontend          | Backend          | Database      |
|-------------------|------------------|---------------|
| Next.js (App Router) | Node.js + Express-style API Routes | MongoDB with Mongoose |
| Tailwind CSS      | PDFKit, XLSX     |               |

---

## 📂 Folder Structure

```

steelfabpro/
├── app/
│   ├── api/
│   │   ├── admin/
│   │   │   ├── users/
│   │   │   ├── projects/
│   │   │   ├── inventory/
│   │   │   └── export/
│   │   │       ├── pdf/route.ts
│   │   │       └── excel/route.ts
│   └── dashboard/
│       └── admin/page.tsx
├── models/
│   ├── User.ts
│   ├── Project.ts
│   └── Inventory.ts
├── lib/
│   ├── db.ts
│   └── auth.ts
├── public/
├── .env.local
└── README.md

````

---

## 🧑‍💻 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/steelfabpro.git
cd steelfabpro
````

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file:

```bash
MONGODB_URI=your_mongo_connection_string
JWT_SECRET=your_secure_jwt_secret
```

### 4. Run the development server

```bash
npm run dev
```

Visit: `https://steelfabpro.vercel.app/`

---

## 📤 Export Feature

* **PDF**: `/api/admin/export/pdf`
  Downloads a professional PDF report with users, projects, and inventory.

* **Excel**: `/api/admin/export/excel`
  Downloads an Excel file with multiple sheets: `Users`, `Projects`, and `Inventory`.

Both features are accessible via buttons on the dashboard.

---

## 🔒 Authentication & Authorization

* Tokens stored in `localStorage`
* Protected routes using middleware/guards
* Role-based access: Only `admin` can access `/dashboard/admin`

---

## 📦 Dependencies

* `next` – React + server-side rendering
* `mongoose` – MongoDB ODM
* `pdfkit` – PDF generation
* `xlsx` – Excel file generation
* `file-saver` – For triggering downloads client-side

---

## 📝 Future Improvements

* Edit forms for Users and Projects
* Assign manufacturers via UI
* Pagination for large data sets
* Role-based dashboards (Manufacturer / Client)

---

## 🙌 Author

Developed by [Gouresh Madye](https://github.com/MADEYE42)

---
