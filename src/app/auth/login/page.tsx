import LoginForm from '@/components/auth/LoginForm';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function LoginPage() {
  return (
    <ProtectedRoute requireAuth={false}>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Property World</h1>
            <p className="text-gray-600 mt-2">Welcome back! Please sign in to your account.</p>
          </div>
          <LoginForm />
        </div>
      </div>
    </ProtectedRoute>
  );
}