import { useMemo, useState } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { MdAdd, MdClose, MdSearch } from "react-icons/md";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../auth/authStore";
import ProfileInfo from "./ProfileInfo";
import SearchBar from "./SearchBar";

type Props = {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  onSearch: (query: string) => void;
  onClearSearch: () => void;
  onCreateClick?: () => void;
};

export default function Navbar({
  searchQuery,
  setSearchQuery,
  onSearch,
  onClearSearch,
  onCreateClick,
}: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const me = useAuthStore((s) => s.me);
  const logout = useAuthStore((s) => s.logout);
  const authed = useAuthStore((s) => !!s.accessToken);

  const navigate = useNavigate();
  const location = useLocation();

  const isDashboard = useMemo(
    () => location.pathname === "/dashboard",
    [location.pathname]
  );

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const handleSearch = () => {
    const q = searchQuery.trim();
    if (q) onSearch(q);
  };

  const handleClear = () => {
    onClearSearch();
    setSearchQuery("");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="text-lg font-semibold text-slate-900">
            Tales<span className="text-cyan-600">Echo</span>
          </Link>
          {authed && (
            <span className="hidden rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 md:inline-flex">
              Travel moments
            </span>
          )}
        </div>

        {authed && (
          <div className="hidden md:block">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={handleSearch}
              onClear={handleClear}
            />
          </div>
        )}

        <div className="hidden items-center gap-3 md:flex">
          {authed && isDashboard && onCreateClick && (
            <button
              type="button"
              onClick={onCreateClick}
              className="inline-flex items-center gap-2 rounded-2xl bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700"
            >
              <MdAdd className="text-lg" />
              New tale
            </button>
          )}

          <ProfileInfo me={me} onLogout={handleLogout} />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          {authed && (
            <button
              className="rounded-xl p-2 text-slate-600 hover:bg-slate-100"
              onClick={() => setIsSearchOpen((v) => !v)}
              aria-label="Toggle search"
            >
              <MdSearch className="h-6 w-6" />
            </button>
          )}

          {authed && isDashboard && onCreateClick && (
            <button
              className="rounded-xl p-2 text-slate-600 hover:bg-slate-100"
              onClick={onCreateClick}
              aria-label="Create tale"
            >
              <MdAdd className="h-6 w-6" />
            </button>
          )}

          <button
            className="rounded-xl p-2 text-slate-600 hover:bg-slate-100"
            onClick={() => setIsMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <MdClose className="h-6 w-6" />
            ) : (
              <FaRegUserCircle className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {authed && isSearchOpen && (
        <div className="border-t border-slate-200 px-4 py-3 md:hidden">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={handleSearch}
            onClear={handleClear}
          />
        </div>
      )}

      {authed && isMenuOpen && (
        <div className="border-t border-slate-200 px-4 py-3 md:hidden">
          <ProfileInfo me={me} onLogout={handleLogout} isMobile />
        </div>
      )}
    </nav>
  );
}