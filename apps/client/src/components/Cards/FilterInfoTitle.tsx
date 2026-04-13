import moment from "moment";
import { MdOutlineClose } from "react-icons/md";
import type { FilterType } from "../../utils/empty";

type DateRange = { from: Date | null; to: Date | null };

export default function FilterInfoTitle({
  filterType,
  filterDates,
  onClear,
}: {
  filterType: FilterType;
  filterDates: DateRange;
  onClear: () => void;
}) {
  if (!filterType) return null;

  if (filterType === "search") {
    return (
      <div className="mb-5 flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3">
        <p className="text-sm font-medium text-slate-700">Showing search results</p>
        <button
          type="button"
          onClick={onClear}
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800"
        >
          <MdOutlineClose />
          Clear
        </button>
      </div>
    );
  }

  if (filterType === "date" && filterDates.from && filterDates.to) {
    return (
      <div className="mb-5 flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3">
        <p className="text-sm font-medium text-slate-700">
          {moment(filterDates.from).format("MMM D, YYYY")} -{" "}
          {moment(filterDates.to).format("MMM D, YYYY")}
        </p>
        <button
          type="button"
          onClick={onClear}
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800"
        >
          <MdOutlineClose />
          Clear
        </button>
      </div>
    );
  }

  return null;
}