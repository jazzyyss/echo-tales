import moment from "moment";
//import { FaHeart } from "react-icons/fa";
import { GrMapLocation } from "react-icons/gr";

export default function TravelStoryCard({
  imgUrl,
  title,
  date,
  story,
  visitedLocation,
  isFavorite,
  onClick,
  onFavoriteToggle,
}: {
  imgUrl: string;
  title: string;
  date: string;
  story: string;
  visitedLocation: string[];
  isFavorite: boolean;
  onClick: () => void;
  onFavoriteToggle: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) {

  void isFavorite;
  void onFavoriteToggle;

  return (
    
    <div className="border rounded-lg overflow-hidden bg-white hover:shadow-lg hover:shadow-slate-200 transition-all relative cursor-pointer">
      <img src={imgUrl} alt={title} className="w-full h-56 object-cover" onClick={onClick} />

      {/* <button
        className="w-10 h-10 flex items-center justify-center bg-white/40 rounded-lg border border-white/30 absolute top-4 right-4"
        onClick={onFavoriteToggle}
        aria-label="Toggle Favorite"
      >
        <FaHeart className={isFavorite ? "text-red-500" : "text-white"} />
      </button> */}

      <div className="p-4" onClick={onClick}>
        <h6 className="text-sm font-medium">{title}</h6>
        <span className="text-xs text-slate-500">{moment(date).format("Do MMM YYYY")}</span>

        <p className="text-xs text-slate-600 mt-2">{story.slice(0, 80)}</p>

        {!!visitedLocation.length && (
          <div className="inline-flex items-center gap-2 text-[13px] text-cyan-600 bg-cyan-200/40 rounded mt-3 px-2 py-1">
            <GrMapLocation className="text-sm" />
            <span className="truncate max-w-[220px]">{visitedLocation.join(", ")}</span>
          </div>
        )}
      </div>
    </div>
  );
}
