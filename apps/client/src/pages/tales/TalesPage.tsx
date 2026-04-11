import { useEffect, useMemo, useState } from "react";
import moment from "moment";
import Modal from "react-modal";
import { DayPicker } from "react-day-picker";
import { MdAdd, MdCalendarMonth, MdClose } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-day-picker/dist/style.css";

import type { Tale } from "../../types/tale";
import { deleteTale, listTales, toggleFav } from "../../api/tales";
import { getEmptyMessage, type FilterType } from "../../utils/empty";

import EmptyCard from "../../components/Cards/EmptyCard";
import FilterInfoTitle from "../../components/Cards/FilterInfoTitle";
import TravelStoryCard from "../../components/Cards/TravelStoryCard";

import Navbar from "../../components/Navbar/Navbar";
import TaleViewModal from "./TaleViewModal";
import TaleAddModal from "./TaleAddEditModal";

type DateRange = { from: Date | null; to: Date | null };

export default function TalesPage() {
  const [tales, setTales] = useState<Tale[]>([]);
  const [loading, setLoading] = useState(true);

  const [openAdd, setOpenAdd] = useState(false);
  const [openView, setOpenView] = useState<{ isShown: boolean; data: Tale | null }>({
    isShown: false,
    data: null,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("");
  const [dateRange, setDateRange] = useState<DateRange>({ from: null, to: null });
  const [showDateFilter, setShowDateFilter] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await listTales();
      setTales(data);
    } catch {
      toast.error("Failed to load tales");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(() => {
    if (filterType === "search") {
      const q = searchQuery.trim().toLowerCase();
      if (!q) return tales;

      return tales.filter((t) => {
        const blob = `${t.title} ${t.story} ${t.visitedLocation.join(" ")}`.toLowerCase();
        return blob.includes(q);
      });
    }

    if (filterType === "date" && dateRange.from && dateRange.to) {
      const start = moment(dateRange.from).startOf("day").valueOf();
      const end = moment(dateRange.to).endOf("day").valueOf();

      return tales.filter((t) => {
        const d = moment(t.visitedDate).valueOf();
        return d >= start && d <= end;
      });
    }

    return tales;
  }, [tales, filterType, searchQuery, dateRange]);

  const onSearch = (q: string) => {
    setSearchQuery(q);
    setFilterType("search");
  };

  const clearSearch = () => {
    setSearchQuery("");
    setFilterType("");
  };

  const onSelectRange = (range: { from?: Date; to?: Date } | undefined) => {
    const from = range?.from ?? null;
    const to = range?.to ?? null;

    setDateRange({ from, to });

    if (from && to) {
      setFilterType("date");
      setShowDateFilter(false);
    } else {
      setFilterType("");
    }
  };

  const resetFilter = () => {
    setDateRange({ from: null, to: null });
    setFilterType("");
    setShowDateFilter(false);
  };

  const handleFavToggle = async (t: Tale, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    try {
      const updated = await toggleFav(t.id);
      setTales((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
      toast.success("Updated");
    } catch {
      toast.error("Failed to update");
    }
  };

  const handleDelete = async (t: Tale) => {
    try {
      await deleteTale(t.id);
      toast.success("Deleted");
      setOpenView({ isShown: false, data: null });
      await load();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <>
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={onSearch}
        onClearSearch={clearSearch}
      />

      <div className="container mx-auto py-4 sm:py-6 md:py-10 px-4 sm:px-6">
        <FilterInfoTitle filterType={filterType} filterDates={dateRange} onClear={resetFilter} />

        <div className="flex-1">
          {loading ? (
            <div className="text-sm text-slate-500">Loading...</div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filtered.map((t) => (
                <TravelStoryCard
                  key={t.id}
                  imgUrl={t.images?.[0]?.secureUrl ?? ""}
                  title={t.title}
                  story={t.story}
                  date={t.visitedDate}
                  visitedLocation={t.visitedLocation}
                  isFavorite={t.isFav}
                  onClick={() => setOpenView({ isShown: true, data: t })}
                  onFavoriteToggle={(e) => handleFavToggle(t, e)}
                />
              ))}
            </div>
          ) : (
            <EmptyCard message={getEmptyMessage(filterType)} />
          )}
        </div>
      </div>

      {showDateFilter && (
        <div
          className="fixed inset-0 z-40 bg-black/20"
          onClick={() => setShowDateFilter(false)}
        >
          <div
            className="absolute left-1/2 -translate-x-1/2 bottom-24 sm:bottom-28 w-[92vw] max-w-[350px] rounded-xl border border-slate-200 bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h3 className="text-sm font-semibold text-slate-800">Filter by date</h3>
              <button
                className="rounded-md p-1 hover:bg-slate-100"
                onClick={() => setShowDateFilter(false)}
                aria-label="Close date filter"
              >
                <MdClose className="text-xl text-slate-600" />
              </button>
            </div>

            <div className="p-3">
              <DayPicker
                captionLayout="dropdown"
                mode="range"
                min={1}
                selected={dateRange as any}
                onSelect={(r) => onSelectRange(r as any)}
                pagedNavigation
              />
            </div>

            <div className="flex items-center justify-between border-t px-4 py-3">
              <button
                className="text-sm font-medium text-slate-500 hover:text-slate-700"
                onClick={resetFilter}
              >
                Clear
              </button>

              <div className="text-xs text-slate-500">
                {dateRange.from && dateRange.to
                  ? `${moment(dateRange.from).format("MMM D")} - ${moment(dateRange.to).format(
                      "MMM D"
                    )}`
                  : dateRange.from
                  ? "Select end date"
                  : "No dates selected"}
              </div>
            </div>
          </div>
        </div>
      )}

      <Modal
        isOpen={openAdd}
        onRequestClose={() => setOpenAdd(false)}
        appElement={document.getElementById("root") as HTMLElement}
        className="model-box"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            zIndex: 999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
          content: {
            position: "relative",
            inset: "auto",
            maxWidth: "90vw",
            width: "600px",
            maxHeight: "90vh",
            margin: "20px",
            overflow: "auto",
            padding: "20px",
            borderRadius: "8px",
            background: "#fff",
            border: "1px solid #ccc",
          },
        }}
      >
        <TaleAddModal onClose={() => setOpenAdd(false)} onSaved={load} />
      </Modal>

      <Modal
        isOpen={openView.isShown}
        onRequestClose={() => setOpenView({ isShown: false, data: null })}
        appElement={document.getElementById("root") as HTMLElement}
        className="model-box"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            zIndex: 999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
          content: {
            position: "relative",
            inset: "auto",
            maxWidth: "90vw",
            width: "700px",
            maxHeight: "90vh",
            margin: "20px",
            overflow: "auto",
            padding: "20px",
            borderRadius: "8px",
            background: "#fff",
            border: "1px solid #ccc",
          },
        }}
      >
        <TaleViewModal
          tale={openView.data}
          onClose={() => setOpenView({ isShown: false, data: null })}
          onDelete={() => {
            const t = openView.data;
            if (t) void handleDelete(t);
          }}
        />
      </Modal>

      <div className="fixed right-4 bottom-4 sm:right-10 sm:bottom-10 z-50 flex flex-col gap-3">
        <button
          className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-white border border-slate-200 hover:bg-slate-50 shadow-lg"
          onClick={() => setShowDateFilter((v) => !v)}
          aria-label="Open date filter"
        >
          {showDateFilter ? (
            <MdClose className="text-2xl text-slate-700" />
          ) : (
            <MdCalendarMonth className="text-2xl text-slate-700" />
          )}
        </button>

        <button
          className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-full bg-cyan-600 hover:bg-cyan-500 shadow-lg"
          onClick={() => setOpenAdd(true)}
          aria-label="Add tale"
        >
          <MdAdd className="text-2xl sm:text-[32px] text-white" />
        </button>
      </div>

      <ToastContainer />
    </>
  );
}