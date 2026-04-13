import { MdOutlineFavoriteBorder, MdOutlinePhotoLibrary, MdOutlineTravelExplore } from "react-icons/md";

export default function LeftOptions({
  totalTales,
  favoriteTales,
  totalImages,
}: {
  totalTales: number;
  favoriteTales: number;
  totalImages: number;
}) {
  return (
    <div className="space-y-3">
      <div className="rounded-3xl border border-slate-200 bg-white p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-700">
            <MdOutlineTravelExplore className="text-2xl" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-800">All tales</p>
            <p className="text-xs text-slate-500">{totalTales} saved moments</p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
            <MdOutlineFavoriteBorder className="text-2xl" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-800">Favorites</p>
            <p className="text-xs text-slate-500">{favoriteTales} highlighted</p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <MdOutlinePhotoLibrary className="text-2xl" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-800">Images</p>
            <p className="text-xs text-slate-500">{totalImages} uploaded</p>
          </div>
        </div>
      </div>
    </div>
  );
}