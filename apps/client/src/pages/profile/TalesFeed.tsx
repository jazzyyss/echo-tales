import moment from "moment";
import type { Tale } from "../../types/tale";
import TravelStoryCard from "../../components/Cards/TravelStoryCard";

export default function TalesFeed({
  tales,
  onSelectTale,
  onFavoriteToggle,
}: {
  tales: Tale[];
  onSelectTale: (tale: Tale) => void;
  onFavoriteToggle: (tale: Tale, e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  if (!tales.length) {
    return (
      <div className="flex min-h-[320px] items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">No tales yet</h3>
          <p className="mt-2 text-sm text-slate-500">
            Start adding travel stories and they’ll show up here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Your travel stories</h2>
          <p className="mt-1 text-sm text-slate-500">
            {tales.length} {tales.length === 1 ? "story" : "stories"} in your profile
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3">
        {tales.map((tale) => (
          <div key={tale.id} className="group">
            <TravelStoryCard
              imgUrl={tale.images?.[0]?.secureUrl ?? ""}
              title={tale.title}
              story={tale.story}
              date={tale.visitedDate}
              visitedLocation={tale.visitedLocation}
              isFavorite={tale.isFav}
              onClick={() => onSelectTale(tale)}
              onFavoriteToggle={(e) => onFavoriteToggle(tale, e)}
            />

            <div className="mt-2 flex items-center justify-between px-1">
              <span className="text-xs text-slate-500">
                Updated {moment(tale.updatedAt).fromNow()}
              </span>

              <span
                className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                  tale.visibility === "public"
                    ? "bg-emerald-50 text-emerald-700"
                    : tale.visibility === "private"
                    ? "bg-slate-100 text-slate-700"
                    : "bg-amber-50 text-amber-700"
                }`}
              >
                {tale.visibility}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}