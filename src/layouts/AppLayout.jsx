import { Outlet, Navigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import useAuthStore from '../stores/useAuthStore';

export default function AppLayout() {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
