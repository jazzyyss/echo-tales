import { useEffect, useMemo, useState } from "react";
import moment from "moment";
import Modal from "react-modal";
import { DayPicker } from "react-day-picker";
import { MdAdd, MdCalendarMonth, MdClose } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import * as env from "../../utils/env";
import "react-toastify/dist/ReactToastify.css";

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
  const [showMobileCalendar, setShowMobileCalendar] = useState(false);

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
    load();
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
    if (from && to) setFilterType("date");
  };

  const resetFilter = () => {
    setDateRange({ from: null, to: null });
    setFilterType("");
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
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} onSearch={onSearch} onClearSearch={clearSearch} />

      <div className="container mx-auto py-4 sm:py-6 md:py-10 px-4 sm:px-6">
        <FilterInfoTitle filterType={filterType} filterDates={dateRange} onClear={resetFilter} />

        <button
          className="md:hidden w-full mb-4 p-3 flex items-center justify-between bg-white border border-slate-200 rounded-lg shadow-sm"
          onClick={() => setShowMobileCalendar((v) => !v)}
        >
          <div className="flex items-center gap-2">
            <MdCalendarMonth className="text-xl text-slate-600" />
            <span className="text-sm font-medium">
              {dateRange.from || dateRange.to ? "Selected Date Range" : "Select Dates"}
            </span>
          </div>

          {showMobileCalendar ? (
            <MdClose className="text-xl text-slate-600" />
          ) : (
            <span className="text-sm text-slate-600">
              {dateRange.from && dateRange.to
                ? `${moment(dateRange.from).format("MMM D")} - ${moment(dateRange.to).format("MMM D")}`
                : "No dates selected"}
            </span>
          )}
        </button>

        {showMobileCalendar && (
          <div className="md:hidden mb-4">
            <div className="bg-white border border-slate-200 shadow-lg shadow-slate-200/60 rounded-lg">
              <div className="p-3">
                <DayPicker
                  captionLayout="dropdown"
                  mode="range"
                  selected={dateRange as any}
                  onSelect={(r) => {
                    onSelectRange(r as any);
                    if ((r as any)?.from && (r as any)?.to) setShowMobileCalendar(false);
                  }}
                  pagedNavigation
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 md:gap-7">
          <div className="flex-1 order-2 md:order-1">
            {loading ? (
              <div className="text-sm text-slate-500">Loading…</div>
            ) : filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((t) => (
                  <TravelStoryCard
                    key={t.id}
                    imgUrl={t.imgUrls?.[0] ? env.API_URL.replace("/api", "")+t.imgUrls?.[0] : ""}
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

          <div className="hidden md:block w-[350px] order-1 md:order-2">
            <div className="bg-white border border-slate-200 shadow-lg shadow-slate-200/60 rounded-lg">
              <div className="p-3">
                <DayPicker
                  captionLayout="dropdown"
                  mode="range"
                  selected={dateRange as any}
                  onSelect={onSelectRange as any}
                  pagedNavigation
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={openAdd}
        onRequestClose={() => setOpenAdd(false)}
        appElement={document.getElementById("root") as HTMLElement}
        className="model-box"
        style={{
          overlay: { backgroundColor: "rgba(0, 0, 0, 0.2)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center" },
          content: { position: "relative", inset: "auto", maxWidth: "90vw", width: "600px", maxHeight: "90vh", margin: "20px", overflow: "auto", padding: "20px", borderRadius: "8px", background: "#fff", border: "1px solid #ccc" },
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
          overlay: { backgroundColor: "rgba(0, 0, 0, 0.2)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center" },
          content: { position: "relative", inset: "auto", maxWidth: "90vw", width: "600px", maxHeight: "90vh", margin: "20px", overflow: "auto", padding: "20px", borderRadius: "8px", background: "#fff", border: "1px solid #ccc" },
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

      <button
        className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-full bg-cyan-600 hover:bg-cyan-500 fixed right-4 bottom-4 sm:right-10 sm:bottom-10 shadow-lg"
        onClick={() => setOpenAdd(true)}
        aria-label="Add tale"
      >
        <MdAdd className="text-2xl sm:text-[32px] text-white" />
      </button>

      <ToastContainer />
    </>
  );
}
