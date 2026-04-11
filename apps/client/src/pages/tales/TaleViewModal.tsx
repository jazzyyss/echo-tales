import moment from "moment";
import { MdClose, MdDelete, MdLocationOn, MdFavorite } from "react-icons/md";
import type { Tale } from "../../types/tale";
import { useAuthStore, type Me } from "../../auth/authStore";

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

  const me: Me | null = useAuthStore(s => s.me);
  return (
    <div className="relative w-full max-w-4xl mx-auto p-4">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h5 className="text-xl font-semibold text-slate-800">{tale.title}</h5>
          <p className="text-sm text-slate-500 mt-1">
            <i>By:</i> <b>{me?.fullName}</b> <i>on </i> 
            ({moment(tale.visitedDate).format("Do MMM YYYY")})
          </p>
        </div>
        <div className="flex flex-row">
          {tale.owner._id == me?.id && 
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onDelete}
              className="inline-flex items-center gap-2 rounded text-black bg-amber-50 hover:bg-red-800 px-4 py-2 hover:text-white cursor-pointer"
            >
              <MdDelete className="text-lg" />
            </button>
          </div>
        }
        <button
          className="text-slate-700 p-2 rounded-full cursor-pointer hover:text-red-800"
          onClick={onClose}
          aria-label="Close"
        >
          <MdClose className="text-2xl" />
        </button>
        </div>
        
      </div>

      <div className="space-y-6">
        {tale.images.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {tale.images.map((image) => (
              <img
                key={image.publicId}
                src={image.secureUrl}
                alt={tale.title}
                className="w-full h-56 object-cover rounded-lg border border-slate-200"
              />
            ))}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
          {tale.owner._id === me?.id && 
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1">
            Visibility: {tale.visibility}
          </span>
          }

          {tale.isFav && (
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-3 py-1 text-rose-600">
              <MdFavorite />
              Favorite
            </span>
          )}
        </div>

        {tale.visitedLocation.length > 0 && (
          <div>
            <h6 className="text-xs font-semibold text-slate-500 mb-2">VISITED LOCATIONS</h6>
            <div className="flex flex-wrap gap-2">
              {tale.visitedLocation.map((location) => (
                <span
                  key={location}
                  className="inline-flex items-center gap-1 rounded-full bg-cyan-50 text-cyan-700 px-3 py-1 text-sm"
                >
                  <MdLocationOn />
                  {location}
                </span>
              ))}
            </div>
          </div>
        )}

        <div>
          <h6 className="text-xs font-semibold text-slate-500 mb-2">STORY</h6>
          <p className="text-sm leading-7 text-slate-700 whitespace-pre-wrap">{tale.story}</p>
        </div>
      </div>
    </div>
  );
}