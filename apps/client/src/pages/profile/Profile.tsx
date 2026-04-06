import { useEffect, useMemo, useRef, useState } from "react";
import moment from "moment";
import Modal from "react-modal";
import { MdCameraAlt, MdClose, MdDeleteOutline, MdMenu, MdOutlineEmail, MdOutlineTravelExplore } from "react-icons/md";
import { toast } from "react-toastify";

import { useAuthStore, type Me } from "../../auth/authStore";
import Navbar from "../../components/Navbar/Navbar";
import type { Tale } from "../../types/tale";
import { deleteTale, listTales, toggleFav } from "../../api/tales";
import { deleteProfilePicture, uploadProfilePicture } from "../../api/user";

import TalesFeed from "./TalesFeed";
import RightPanel from "./RightPanel";
import LeftOptions from "./LeftOptions";
import TaleViewModal from "../tales/TaleViewModal";

export default function Profile() {
  const [searchQuery, setSearchQuery] = useState("");
  const [tales, setTales] = useState<Tale[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const [openView, setOpenView] = useState<{ isShown: boolean; data: Tale | null }>({
    isShown: false,
    data: null,
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const me: Me | null = useAuthStore((s) => s.me);
  const setMe = useAuthStore((s) => s.setMe);

  const openTale = (t: Tale) => setOpenView({ isShown: true, data: t });
  const closeTale = () => setOpenView({ isShown: false, data: null });

  const load = async () => {
    setLoading(true);
    try {
      const data = await listTales();
      const mine = data.filter((t) => t.owner.username === me?.username);
      setTales(mine);
    } catch {
      toast.error("Failed to load tales");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!me?.username) return;
    void load();
  }, [me?.username]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return tales;

    return tales.filter((t) => {
      const blob = `${t.title} ${t.story} ${t.visitedLocation.join(" ")}`.toLowerCase();
      return blob.includes(q);
    });
  }, [tales, searchQuery]);

  const onSearch = (q: string) => {
    setSearchQuery(q);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const handleFavToggle = async (t: Tale, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    try {
      const updated = await toggleFav(t.id);
      setTales((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
      toast.success("Favorite updated");
    } catch {
      toast.error("Failed to update favorite");
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

  const handleProfileUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleProfileFileChange = async (file: File | null) => {
    if (!file) return;

    setUploadingAvatar(true);
    try {
      const data = await uploadProfilePicture(file);
      setMe(data.user);
      toast.success("Profile picture updated");
    } catch {
      toast.error("Failed to upload profile picture");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleDeleteProfilePicture = async () => {
    if (!me) return;

    setUploadingAvatar(true);
    try {
      await deleteProfilePicture();

      setMe({
        ...me,
        media: {
          ...me.media,
          profilePicture: {
            publicId: null,
            secureUrl: null,
            width: null,
            height: null,
            format: null,
            bytes: null,
            uploadedAt: null,
          },
        },
      });

      toast.success("Profile picture removed");
    } catch {
      toast.error("Failed to remove profile picture");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const favoriteCount = tales.filter((t) => t.isFav).length;
  const totalImages = tales.reduce((sum, tale) => sum + tale.images.length, 0);

  return (
    <>
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={onSearch}
        onClearSearch={clearSearch}
      />

      <div className="min-h-screen bg-slate-50">
        {/* <div className="md:hidden sticky top-0 z-50 h-16 bg-white border-b px-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label="Toggle options"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200"
          >
            {sidebarOpen ? <MdClose className="text-xl" /> : <MdMenu className="text-xl" />}
          </button>

          <div className="font-semibold text-slate-800">Profile</div>
          <div className="w-10" />
        </div> */}

        <div className="mx-auto max-w-7xl px-4 py-4 md:py-6">
          <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4">
                <div className="relative">
                  {me?.media.profilePicture.secureUrl ? (
                    <img
                      src={me.media.profilePicture.secureUrl}
                      alt={me.fullName}
                      className="h-24 w-24 rounded-3xl object-cover border border-slate-200 shadow-sm"
                    />
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-cyan-600 text-3xl font-semibold text-white shadow-sm">
                      {me?.fullName?.charAt(0).toUpperCase() ?? "U"}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleProfileUploadClick}
                    disabled={uploadingAvatar}
                    className="absolute -bottom-2 -right-2 inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50"
                    aria-label="Upload profile picture"
                  >
                    <MdCameraAlt className="text-lg" />
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleProfileFileChange(e.target.files?.[0] ?? null)}
                  />
                </div>

                <div className="min-w-0">
                  <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">
                    {me?.fullName ?? "Profile"}
                  </h1>
                  <p className="mt-1 text-sm text-slate-500">@{me?.username ?? "username"}</p>

                  <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-600">
                    <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1">
                      <MdOutlineEmail />
                      {me?.email}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-3 py-1 text-cyan-700">
                      <MdOutlineTravelExplore />
                      {tales.length} tales
                    </span>
                  </div>

                  <p className="mt-4 text-sm text-slate-500">
                    Member since {me?.createdAt ? moment(me.createdAt).format("MMMM YYYY") : "—"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 md:w-[360px]">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Stories</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900">{tales.length}</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Favorites</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900">{favoriteCount}</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Images</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900">{totalImages}</p>
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleProfileUploadClick}
                disabled={uploadingAvatar}
                className="inline-flex items-center gap-2 rounded-2xl bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700 disabled:opacity-50"
              >
                <MdCameraAlt />
                {uploadingAvatar ? "Uploading..." : "Change profile picture"}
              </button>

              {me?.media.profilePicture.secureUrl && (
                <button
                  type="button"
                  onClick={handleDeleteProfilePicture}
                  disabled={uploadingAvatar}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  <MdDeleteOutline />
                  Remove picture
                </button>
              )}
            </div>
          </div>

          <div className="md:grid md:grid-cols-[260px_minmax(0,1fr)_280px] md:gap-6">
            <aside className="hidden md:block rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <LeftOptions
                fullName={me?.fullName ?? ""}
                username={me?.username ?? ""}
                totalTales={tales.length}
                favoriteTales={favoriteCount}
              />
            </aside>

            <main className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              {loading ? (
                <div className="text-sm text-slate-500">Loading...</div>
              ) : (
                <TalesFeed tales={filtered} onSelectTale={openTale} onFavoriteToggle={handleFavToggle} />
              )}
            </main>

            <aside className="hidden md:block rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <RightPanel tales={tales} />
            </aside>
          </div>

          <div
            className={`md:hidden fixed left-0 right-0 z-30 bg-white border-b shadow-lg transition-all duration-300 ${
              sidebarOpen ? "top-16 opacity-100" : "top-[-100%] opacity-0"
            }`}
            style={{ maxHeight: "calc(100vh - 96px)" }}
          >
            <div className="overflow-y-auto p-4">
              <LeftOptions
                fullName={me?.fullName ?? ""}
                username={me?.username ?? ""}
                totalTales={tales.length}
                favoriteTales={favoriteCount}
              />
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={openView.isShown}
        onRequestClose={closeTale}
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
            borderRadius: "16px",
            background: "#fff",
            border: "1px solid #e2e8f0",
          },
        }}
      >
        <TaleViewModal
          tale={openView.data}
          onClose={closeTale}
          onDelete={() => {
            const t = openView.data;
            if (t) void handleDelete(t);
          }}
        />
      </Modal>
    </>
  );
}