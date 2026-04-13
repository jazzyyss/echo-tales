import moment from "moment";
import type { Tale } from "../../types/tale";

export default function RightPanel({ tales }: { tales: Tale[] }) {
  const publicCount = tales.filter((t) => t.visibility === "public").length;
  const privateCount = tales.filter((t) => t.visibility === "private").length;
  const unlistedCount = tales.filter((t) => t.visibility === "unlisted").length;
  const latest = tales[0] ?? null;

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-slate-200 bg-white p-5">
        <h3 className="text-sm font-semibold text-slate-900">Visibility</h3>
        <div className="mt-4 grid gap-3">
          <div className="rounded-2xl bg-slate-50 p-3">
            <p className="text-xs text-slate-500">Public</p>
            <p className="mt-1 text-xl font-semibold text-slate-900">{publicCount}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-3">
            <p className="text-xs text-slate-500">Private</p>
            <p className="mt-1 text-xl font-semibold text-slate-900">{privateCount}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-3">
            <p className="text-xs text-slate-500">Unlisted</p>
            <p className="mt-1 text-xl font-semibold text-slate-900">{unlistedCount}</p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5">
        <h3 className="text-sm font-semibold text-slate-900">Latest tale</h3>
        {latest ? (
          <div className="mt-4">
            <p className="line-clamp-2 text-sm font-medium text-slate-800">{latest.title}</p>
            <p className="mt-2 text-xs text-slate-500">
              Updated {moment(latest.updatedAt).fromNow()}
            </p>
            <p className="mt-3 line-clamp-4 text-sm leading-6 text-slate-600">
              {latest.story}
            </p>
          </div>
        ) : (
          <p className="mt-4 text-sm text-slate-500">No tales yet.</p>
        )}
      </div>
    </div>
  );
}