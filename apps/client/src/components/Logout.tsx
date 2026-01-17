import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../auth/authStore";

export default function LogoutButton() {
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate("/login", { replace: true });
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
    >
      Logout
    </button>
  );
}
