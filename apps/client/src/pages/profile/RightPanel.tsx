import moment from "moment";
import type { Tale } from "../../types/tale";

export default function RightPanel({
  tales,
}: {
  tales: Tale[];
}) {
  const publicCount = tales.filter((t) => t.visibility === "public").length;
  const privateCount = tales.filter((t) => t.visibility === "private").length;
  const unlistedCount = tales.filter((t) => t.visibility === "unlisted").length;

  const latest = tales[0] ?? null;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Visibility
        </p>

        <div className="mt-3 grid grid-cols-1 gap-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs text-slate-500">Public</p>
            <p className="mt-1 text-2xl font-semibold text-slate-800">{publicCount}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs text-slate-500">Private</p>
            <p className="mt-1 text-2xl font-semibold text-slate-800">{privateCount}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs text-slate-500">Unlisted</p>
            <p className="mt-1 text-2xl font-semibold text-slate-800">{unlistedCount}</p>
          </div>
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Latest activity
        </p>

        <div className="mt-3 rounded-2xl border border-slate-200 p-4">
          {latest ? (
            <>
              <p className="text-sm font-semibold text-slate-800 line-clamp-2">{latest.title}</p>
              <p className="mt-2 text-xs text-slate-500">
                Updated {moment(latest.updatedAt).fromNow()}
              </p>
              <p className="mt-3 line-clamp-4 text-sm leading-6 text-slate-600">
                {latest.story}
              </p>
            </>
          ) : (
            <p className="text-sm text-slate-500">No travel stories yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}