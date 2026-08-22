import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../stores/useAuthStore';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/trips', label: 'Trips' },
  ];

  return (
    <header className="w-full top-0 sticky bg-surface-container-low shadow-sm z-40">
      <div className="flex justify-between items-center px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] py-4 max-w-[var(--spacing-container-max)] mx-auto h-[72px]">
        {/* Brand & Search */}
        <div className="flex items-center gap-[var(--spacing-gutter)]">
          <Link to={isAuthenticated ? '/dashboard' : '/'} className="text-headline-md tracking-tight text-primary font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
            GlobeTrotter
          </Link>
          {isAuthenticated && (
            <div className="hidden md:flex relative group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-primary transition-colors">search</span>
              <input
                className="input h-12 pl-10 pr-4 rounded-full w-64"
                placeholder="Search destinations, trips..."
                type="text"
              />
            </div>
          )}
        </div>

        {/* Desktop Nav Links */}
        {isAuthenticated && (
          <nav className="hidden md:flex items-center gap-[var(--spacing-gutter)]">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`pb-1 border-b-2 transition-colors text-body-sm font-medium ${
                  isActive(link.to)
                    ? 'text-primary font-bold border-primary'
                    : 'text-secondary hover:text-primary border-transparent'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        {/* Actions */}
        <div className="flex items-center gap-[var(--spacing-stack-sm)]">
          {isAuthenticated ? (
            <>
              <Link
                to="/trips/create"
                className="hidden md:inline-flex btn btn-primary btn-sm"
              >
                Create Trip
              </Link>
              <div className="flex items-center gap-2">
                <Link to="/profile" className="btn-icon" aria-label="Settings">
                  <span className="material-symbols-outlined">settings</span>
                </Link>
                {/* Avatar + Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant hover:border-primary transition-colors flex items-center justify-center bg-primary-container text-on-primary text-sm font-bold"
                  >
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </button>

                  {dropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                      <div className="absolute right-0 top-12 w-56 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg p-2 z-20 animate-scale-in">
                        <div className="px-3 py-2 border-b border-surface-variant mb-1">
                          <p className="text-body-sm font-semibold text-primary">{user?.name}</p>
                          <p className="text-label-caps text-secondary">{user?.email}</p>
                        </div>
                        <Link
                          to="/profile"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 text-body-sm text-on-surface hover:bg-surface-container rounded-lg transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px]">person</span>
                          Profile & Settings
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-3 py-2.5 text-body-sm text-error hover:bg-error-container rounded-lg transition-colors w-full text-left"
                        >
                          <span className="material-symbols-outlined text-[18px]">logout</span>
                          Log Out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden btn-icon"
                aria-label="Menu"
              >
                <span className="material-symbols-outlined">{mobileMenuOpen ? 'close' : 'menu'}</span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn btn-ghost btn-sm">Log in</Link>
              <Link to="/signup" className="btn btn-primary btn-sm">Sign up</Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isAuthenticated && mobileMenuOpen && (
        <div className="md:hidden bg-surface-container-lowest border-t border-surface-variant px-[var(--spacing-margin-mobile)] py-4 animate-fade-in">
          <div className="flex flex-col gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-lg text-body-sm transition-colors ${
                  isActive(link.to)
                    ? 'bg-surface-container text-primary font-semibold'
                    : 'text-secondary hover:bg-surface-container-low'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/trips/create"
              onClick={() => setMobileMenuOpen(false)}
              className="btn btn-primary mt-2 w-full"
            >
              Create Trip
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
