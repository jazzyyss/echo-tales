import type { Me } from "../../auth/authStore";
import {Link} from "react-router-dom";

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const a = parts[0]?.[0] ?? "";
  const b = parts[1]?.[0] ?? "";
  return (a + b).toUpperCase();
}

export default function ProfileInfo({
  me,
  onLogout,
  isMobile = false,
}: {
  me: Me | null;
  onLogout: () => void;
  isMobile?: boolean;
}) {
  if (!me) return null;

  return (
    <div className={`flex items-center gap-3 ${isMobile ? "flex-col" : ""}`}>
      <Link to={`/me/${me.username}`} 
        className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100"
      >
        {getInitials(me.fullName)}
      </Link>
      <div className={isMobile ? "text-center" : ""}>
        <p className="text-sm font-medium truncate max-w-[200px]">{me.fullName}</p>
        <button className="text-sm text-slate-700 underline hover:text-slate-900 cursor-pointer" onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}
