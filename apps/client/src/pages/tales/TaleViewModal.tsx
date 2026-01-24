import moment from "moment";
import { GrMapLocation } from "react-icons/gr";
import { MdClose, MdDeleteOutline } from "react-icons/md";
import "react-day-picker/dist/style.css";
import type { Tale } from "../../types/tale";
import * as env from "../../utils/env";
import { useAuthStore } from "../../auth/authStore";

export default function TaleViewModal({
  tale,
  onClose,
  onDelete,
}: {
  tale: Tale | null;
  onClose: () => void;
  onDelete: () => void;
}) {
  if (!tale) return null;

  const user = useAuthStore(s => s.me);

  return (
    <div className="relative max-w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 bg-cyan-50/50 p-2 rounded-l-lg">
          <span>{tale.owner.username}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 bg-cyan-50/50 p-2 rounded-l-lg">
          {(tale.owner.username === user?.username) && <button className="btn-small btn-delete text-xs sm:text-sm flex items-center gap-1" onClick={onDelete}>
            <MdDeleteOutline className="text-base sm:text-lg" />
          </button>}
          <button className="p-1" onClick={onClose} aria-label="Close">
            <MdClose className="text-lg sm:text-xl text-slate-400" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2 py-2 sm:py-4">
        <h1 className="text-xl sm:text-2xl text-slate-950 font-semibold">{tale.title}</h1>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
          <span className="text-xs text-slate-500">{moment(tale.visitedDate).format("Do MMM YYYY")}</span>
          <span>{}</span>
          <div className="inline-flex items-center gap-2 text-[12px] sm:text-[13px] text-cyan-600 bg-cyan-200/40 rounded px-2 py-1 max-w-full overflow-x-auto">
            <GrMapLocation className="text-sm flex-shrink-0" />
            <div className="truncate">{tale.visitedLocation.join(", ")}</div>
          </div>
        </div>
      </div>
      <div className="relative w-full aspect-video sm:h-[300px]">
        <img
          src={tale.imgUrls?.[0] ? env.API_URL.replace("/api", "")+tale.imgUrls?.[0] : ""}
          alt={tale.title}
          className="absolute inset-0 w-full h-full object-cover rounded-lg"
        />
      </div>

      <div className="mt-3 sm:mt-4">
        <p className="text-sm text-slate-950 leading-6 text-justify whitespace-pre-line break-words">{tale.story}</p>
      </div>
    </div>
  );
}
