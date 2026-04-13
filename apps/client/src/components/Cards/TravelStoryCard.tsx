import moment from "moment";
import {
  MdChatBubbleOutline,
  MdFavorite,
  MdFavoriteBorder,
  MdLocationOn,
} from "react-icons/md";

export default function TravelStoryCard({
  imgUrl,
  title,
  date,
  story,
  visitedLocation,
  isLiked,
  likeCount,
  commentCount,
  onClick,
  onLikeToggle,
}: {
  imgUrl: string;
  title: string;
  date: string;
  story: string;
  visitedLocation: string[];
  isLiked: boolean;
  likeCount: number;
  commentCount: number;
  onClick: () => void;
  onLikeToggle: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="relative">
        <button type="button" className="block w-full text-left" onClick={onClick}>
          {imgUrl ? (
            <img
              src={imgUrl}
              alt={title || "Tale image"}
              className="h-64 w-full object-cover sm:h-72"
            />
          ) : (
            <div className="flex h-64 w-full items-center justify-center bg-slate-100 text-sm text-slate-400 sm:h-72">
              No image
            </div>
          )}
        </button>

        {visitedLocation.length > 0 && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="inline-flex max-w-full items-center gap-2 rounded-full bg-black/55 px-3 py-2 text-xs font-medium text-white backdrop-blur">
              <MdLocationOn className="text-base" />
              <span className="truncate">{visitedLocation.join(", ")}</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4">
        <button type="button" onClick={onClick} className="block w-full text-left">
          <div className="min-w-0">
            <h3 className="line-clamp-1 text-base font-semibold text-slate-900">
              {title || "Untitled tale"}
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              {moment(date).format("MMM D, YYYY")}
            </p>
          </div>

          <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
            {story}
          </p>
        </button>

        <div className="mt-4 flex items-center gap-4">
          <button
            type="button"
            onClick={onLikeToggle}
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-rose-600"
          >
            {isLiked ? (
              <MdFavorite className="text-xl text-rose-500" />
            ) : (
              <MdFavoriteBorder className="text-xl" />
            )}
            <span>{likeCount}</span>
          </button>

          <button
            type="button"
            onClick={onClick}
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
          >
            <MdChatBubbleOutline className="text-xl" />
            <span>{commentCount}</span>
          </button>
        </div>
      </div>
    </article>
  );
}