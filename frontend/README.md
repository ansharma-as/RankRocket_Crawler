# RankRocket Frontend (Next.js)

A beautiful, secure, and modern frontend for RankRocket SEO analysis platform built with Next.js 15, React 19, and Tailwind CSS.

## 🚀 Features

- **Beautiful UI**: Modern, responsive design with Tailwind CSS
- **Secure API Routes**: Backend communication through Next.js API routes (no direct backend exposure)
- **Server-Side Rendering**: SEO-optimized with Next.js SSR
- **Real-time Updates**: Live status updates and error handling
- **Mobile Responsive**: Optimized for all device sizes
- **Fast Performance**: Optimized loading states and caching

## 🛠️ Tech Stack

- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with modern features
- **Tailwind CSS 4** - Utility-first CSS framework
- **Lucide React** - Beautiful SVG icons
- **Axios** - HTTP client for API requests

## 🚀 Getting Started

First, install dependencies:

```bash
npm install
```

Set up environment variables:
```bash
# Copy .env.local and configure your backend URL
BACKEND_API_URL=http://localhost:8000
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

```
frontend_next/
├── app/                    # Next.js App Router
│   ├── api/               # Secure API routes
│   ├── dashboard/         # Dashboard page
│   ├── report/[id]/       # Dynamic report pages
│   └── page.js           # Home page
├── components/            # React components
│   ├── Navigation.js     # Navigation header
│   ├── Hero.js          # Landing page hero
│   ├── URLSubmissionForm.js # URL submission form
│   ├── Dashboard.js     # Dashboard component
│   └── Report.js        # Detailed report view
└── .env.local           # Environment variables
```

## 🔐 Security Features

- **API Route Protection**: All backend communication goes through Next.js API routes
- **Environment Variables**: Sensitive data stored securely
- **Input Validation**: URL validation and sanitization
- **Error Handling**: Secure error messages

## 🎨 Pages

### Home Page (`/`)
- Hero section with gradient background
- URL submission form with validation
- Features showcase

### Dashboard (`/dashboard`)
- Reports listing with statistics
- Responsive grid layout

### Report Page (`/report/[id]`)
- Detailed SEO analysis results
- ML-generated recommendations
- Visual metrics display

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.