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
    <div className={`flex items-center gap-3 ${isMobile ? "flex-row gap-45" : ""}`}>
      <Link to={`/me/${me.username}`} 
        className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center overflow-hidden rounded-full text-slate-950 font-medium bg-slate-100"
      >
        {me?.media.profilePicture.secureUrl ? (
          <img
            src={me.media.profilePicture.secureUrl}
            alt={me.fullName}
            /* className="h-24 w-24 rounded-3xl object-cover border border-slate-200 shadow-sm" */
          />
        ) : (
          <div /* className="flex h-24 w-24 items-center justify-center rounded-3xl bg-cyan-600 text-3xl font-semibold text-white shadow-sm" */>
            {getInitials(me.fullName)}
          </div>
        )}
      </Link>
      <div className={isMobile ? "text-center" : ""}>
        <p className="text-sm font-medium truncate max-w-[200px]">{me.fullName}</p>
        <button className="text-sm font-bold text-red-700 hover:text-red-950 cursor-pointer" onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}
