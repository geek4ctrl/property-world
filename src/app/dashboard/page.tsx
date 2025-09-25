'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import UserDashboard from '@/components/auth/UserDashboard';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <UserDashboard />
      <Footer />
    </div>
  );
}
