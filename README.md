# EBG Merged Sales Portal & Super Admin

This is a merged application containing both the Sales Portal and Super Admin functionality in a single React application.

## 🚀 Quick Start

### Installation

1. Navigate to the project directory:
```bash
cd "Merged Sales-portal-super-admin"
```

2. Install dependencies:
```bash
npm install
```

### Running the Application

Start the development server:
```bash
npm run dev
```

The application will automatically:
- Start on **http://localhost:3000**
- Open in your default browser

## 🌐 Access Points

### Sales Portal (Public Pages)
- **Homepage**: http://localhost:3000/
- **Downloads**: http://localhost:3000/downloads
- **Contact Us**: http://localhost:3000/contact-us
- **Book Now**: http://localhost:3000/book-now
- **Sales Login**: http://localhost:3000/sales/login
- **Sales Dashboard** (Protected): http://localhost:3000/sales/dashboard

### Admin Portal (Protected)
- **Admin Login**: http://localhost:3000/admin/login
- **Admin Dashboard**: http://localhost:3000/admin/
- **User Management**: http://localhost:3000/admin/user-management
- **Role Management**: http://localhost:3000/admin/role-management
- **Investment Management**: http://localhost:3000/admin/investment-management
- **Booking Management**: http://localhost:3000/admin/booking-list-management
- **Investment Opportunities**: http://localhost:3000/admin/investment-opportunity-management
- **Investors Management**: http://localhost:3000/admin/investors-management
- **Sales Management**: http://localhost:3000/admin/sales-management
- **Payout Management**: http://localhost:3000/admin/payout-management
- **Settings**: http://localhost:3000/admin/settings
- **Profile**: http://localhost:3000/admin/profile

## 🔐 Login Credentials

### Sales Portal Login
- **Email**: `sales@ebg.com`
- **Password**: `sales123`

### Admin Portal Login
- **Email**: `admin@ebg.com`
- **Password**: `admin123`

## 📋 Available Scripts

### Development
```bash
npm run dev
```
Starts the Vite development server on port 3000.

### Production Build
```bash
npm run build
```
Creates an optimized production build in the `dist` folder.

### Preview Production Build
```bash
npm run preview
```
Previews the production build locally.

## 🏗️ Project Structure

```
Merged Sales-portal-super-admin/
├── src/
│   ├── pages/
│   │   ├── admin/          # Admin portal pages (13 files)
│   │   └── sales/          # Sales portal pages (9 files)
│   ├── components/
│   │   └── AdminLayout.jsx # Admin layout component
│   ├── layouts/
│   │   └── MainLayout.jsx  # Sales portal layout
│   ├── utils/
│   │   └── api.js          # Unified API utilities
│   ├── App.jsx             # Main routing component
│   ├── main.jsx            # Entry point
│   ├── index.css           # Global styles (Tailwind)
│   └── App.css             # Admin styles (Bootstrap)
├── public/
│   └── images/             # Image assets
├── package.json
├── vite.config.js
└── README.md
```

## 🎨 Technology Stack

### Frontend
- **React 18.2.0** - UI library
- **React Router DOM 6.23.1** - Routing
- **Vite 5.0.0** - Build tool & dev server
- **Tailwind CSS 3.4.3** - Sales portal styling
- **Bootstrap 5.3.2** - Admin portal styling
- **Bootstrap Icons 1.13.1** - Icon library

### State Management
- **Axios 1.6.2** - HTTP client for API calls
- **Zustand 5.0.8** - State management (if needed)

## 🔒 Authentication & Routes

### Protected Routes
- **Sales Protected**: Requires `isAuthenticated === 'true'` in localStorage
- **Admin Protected**: Requires `isAuthenticated === 'true'` AND `userRole === 'Admin'`

### Route Structure
- Sales routes: `/sales/*`
- Admin routes: `/admin/*`
- Public routes: `/`, `/downloads`, `/contact-us`, `/book-now`

## 📝 Key Features

### Sales Portal
- Public-facing pages (Home, Downloads, Contact, Book Now)
- Protected Sales Dashboard
- Lead management
- Payment tracking
- Owner-specific data filtering

### Admin Portal
- Complete admin dashboard
- User & Role management
- Investment & Opportunity management
- Booking management
- Investor management
- Sales & Payout tracking
- Settings & Profile management
- Only 2 opportunities: Master Franchise & Signature Store

## 🐛 Troubleshooting

### Port Already in Use
If port 3000 is already in use, edit `vite.config.js` and change the port:
```javascript
server: {
  port: 3001, // Change to any available port
}
```

### Module Not Found Errors
If you encounter import errors:
```bash
npm install
```

### Bootstrap Icons Not Loading
Ensure `bootstrap-icons` is installed:
```bash
npm install bootstrap-icons
```

## 📦 Dependencies

See `package.json` for complete list of dependencies and versions.

## 🚢 Deployment

### Build for Production
```bash
npm run build
```

### Deploy the `dist` folder
The build output in the `dist` folder can be deployed to any static hosting service:
- Netlify
- Vercel
- GitHub Pages
- AWS S3
- Any web server

## 📞 Support

For issues or questions, please check:
1. All dependencies are installed (`npm install`)
2. Node.js version is compatible (v16+ recommended)
3. Port 3000 is available
4. All environment variables are set (if using `.env`)

---

**Last Updated**: All files merged and verified
**Status**: ✅ Production Ready
