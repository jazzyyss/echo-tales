import { useEffect, useMemo, useState } from "react";
import moment from "moment";
import Modal from "react-modal";
import { DayPicker } from "react-day-picker";
import { MdCalendarMonth, MdClose } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-day-picker/dist/style.css";

import type { Tale } from "../../types/tale";
import { deleteTale, listTales, toggleLike } from "../../api/tales";
import { getEmptyMessage, type FilterType } from "../../utils/empty";

import EmptyCard from "../../components/Cards/EmptyCard";
import FilterInfoTitle from "../../components/Cards/FilterInfoTitle";
import TravelStoryCard from "../../components/Cards/TravelStoryCard";
import Navbar from "../../components/Navbar/Navbar";
import TaleViewModal from "./TaleViewModal";
import TaleAddModal from "./TaleAddEditModal";

type DateRange = { from: Date | null; to: Date | null };

const modalStyle = {
  overlay: {
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    zIndex: 999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    position: "relative" as const,
    inset: "auto",
    maxWidth: "92vw",
    width: "760px",
    maxHeight: "90vh",
    margin: "20px",
    overflow: "auto" as const,
    padding: "24px",
    borderRadius: "24px",
    background: "#fff",
    border: "1px solid #e2e8f0",
  },
};

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

  const favoriteCount = useMemo(
    () => tales.filter((t) => t.isFav).length,
    [tales]
  );

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
    }
  };

  const resetFilter = () => {
    setDateRange({ from: null, to: null });
    setFilterType("");
    setShowDateFilter(false);
  };

  const handleLikeToggle = async (t: Tale, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    try {
      const updated = await toggleLike(t.id);
      setTales((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
    } catch {
      toast.error("Failed to update like");
    }
  };

  const handleDelete = async (t: Tale) => {
    try {
      await deleteTale(t.id);
      toast.success("Tale deleted");
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
        onCreateClick={() => setOpenAdd(true)}
      />

      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
          <div className="mt-6">
            <FilterInfoTitle
              filterType={filterType}
              filterDates={dateRange}
              onClear={resetFilter}
            />
          </div>

          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Recent memories</h2>
            </div>

            <button
              type="button"
              onClick={() => setShowDateFilter((v) => !v)}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              {showDateFilter ? <MdClose className="text-lg" /> : <MdCalendarMonth className="text-lg" />}
              Date filter
            </button>
          </div>

          {showDateFilter && (
            <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <DayPicker
                captionLayout="dropdown"
                mode="range"
                min={1}
                selected={dateRange as any}
                onSelect={(r) => onSelectRange(r as any)}
                pagedNavigation
              />
            </div>
          )}

          {loading ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-sm text-slate-500 shadow-sm">
              Loading tales...
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((t) => (
                <TravelStoryCard
                  key={t.id}
                  imgUrl={t.images?.[0]?.secureUrl ?? ""}
                  title={t.title ?? ""}
                  story={t.story ?? ""}
                  date={t.visitedDate}
                  visitedLocation={t.visitedLocation}
                  isLiked={t.isLikedByMe}
                  likeCount={t.likeCount}
                  commentCount={t.commentCount}
                  onClick={() => setOpenView({ isShown: true, data: t })}
                  onLikeToggle={(e) => handleLikeToggle(t, e)}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <EmptyCard message={getEmptyMessage(filterType)} />
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={openAdd}
        onRequestClose={() => setOpenAdd(false)}
        appElement={document.getElementById("root") as HTMLElement}
        style={modalStyle}
      >
        <TaleAddModal onClose={() => setOpenAdd(false)} onSaved={load} />
      </Modal>

      <Modal
        isOpen={openView.isShown}
        onRequestClose={() => setOpenView({ isShown: false, data: null })}
        appElement={document.getElementById("root") as HTMLElement}
        style={modalStyle}
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

      <button
        className="fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-cyan-600 text-white shadow-lg hover:bg-cyan-700 md:hidden"
        onClick={() => setOpenAdd(true)}
        aria-label="Add tale"
      >
        +
      </button>

      <ToastContainer />
    </>
  );
}