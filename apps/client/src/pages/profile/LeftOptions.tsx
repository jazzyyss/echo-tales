import { MdOutlinePerson, MdOutlinePhotoLibrary, MdOutlineTravelExplore, MdOutlineFavoriteBorder } from "react-icons/md";

export default function LeftOptions({
  fullName,
  username,
  totalTales,
  favoriteTales,
}: {
  fullName: string;
  username: string;
  totalTales: number;
  favoriteTales: number;
}) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Profile
        </p>
        <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-600/10 text-cyan-700">
              <MdOutlinePerson className="text-2xl" />
            </div>

            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-slate-800">{fullName}</h3>
              <p className="truncate text-sm text-slate-500">@{username}</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Workspace
        </p>

        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
              <MdOutlineTravelExplore className="text-xl" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-800">Travel Stories</p>
              <p className="text-xs text-slate-500">{totalTales} published or saved</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              <MdOutlineFavoriteBorder className="text-xl" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-800">Favorites</p>
              <p className="text-xs text-slate-500">{favoriteTales} marked favorite</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <MdOutlinePhotoLibrary className="text-xl" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-800">Media</p>
              <p className="text-xs text-slate-500">Profile photo and tale gallery</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}