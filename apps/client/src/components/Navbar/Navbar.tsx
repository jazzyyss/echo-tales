import { useState } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { MdClose, MdSearch } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../auth/authStore";
import ProfileInfo from "./ProfileInfo";
import SearchBar from "./SearchBar";
import { Link } from "react-router-dom";

type Props = {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  onSearch: (query: string) => void;
  onClearSearch: () => void;
};

export default function Navbar({ searchQuery, setSearchQuery, onSearch, onClearSearch }: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const me = useAuthStore((s) => s.me);
  const logout = useAuthStore((s) => s.logout);
  const authed = useAuthStore((s) => !!s.accessToken);

  const navigate = useNavigate();

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
    <nav className="bg-white sticky top-0 z-50 border-b">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <Link to="/dashboard" className="flex items-center font-semibold text-slate-900">Tales<span className="text-blue-400">Echo</span></Link>

          {authed && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="pointer-events-auto">
                <SearchBar value={searchQuery} onChange={setSearchQuery} onSearch={handleSearch} onClear={handleClear} />
              </div>
            </div>
          )}

          <div className="hidden md:flex md:items-center md:space-x-4">
            <ProfileInfo me={me} onLogout={handleLogout} />
          </div>

          <div className="flex items-center md:hidden">
            {authed && (
              <button
                className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
                onClick={() => setIsSearchOpen((v) => !v)}
              >
                <MdSearch className="h-6 w-6" />
              </button>
            )}

            <button
              className="ml-2 p-2 rounded-md text-gray-600 hover:bg-gray-100"
              onClick={() => setIsMenuOpen((v) => !v)}
            >
              {isMenuOpen ? <MdClose className="h-6 w-6" /> : <FaRegUserCircle className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {authed && isSearchOpen && (
          <div className="md:hidden px-2 pb-3">
            <SearchBar value={searchQuery} onChange={setSearchQuery} onSearch={handleSearch} onClear={handleClear} />
          </div>
        )}

        {authed && isMenuOpen && (
          <div className="md:hidden px-2 pb-3 pt-2 flex justify-center">
            <ProfileInfo me={me} onLogout={handleLogout} isMobile />
          </div>
        )}
      </div>
    </nav>
  );
}
