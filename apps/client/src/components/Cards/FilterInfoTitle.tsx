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
    return <h3 className="text-lg font-medium mb-3">Search Results</h3>;
  }

  const startDate = filterDates.from ? moment(filterDates.from).format("Do MMM YYYY") : "N/A";
  const endDate = filterDates.to ? moment(filterDates.to).format("Do MMM YYYY") : "N/A";

  return (
    <div className="flex items-center gap-2 mb-3 flex-wrap">
      <h3 className="text-lg font-medium">Travel Stories from</h3>
      <div className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded">
        <p className="text-xs font-medium">
          {startDate} - {endDate}
        </p>
        <button onClick={onClear} aria-label="Clear date filter">
          <MdOutlineClose />
        </button>
      </div>
    </div>
  );
}
