import { useEffect, useMemo, useRef, useState } from "react";
import moment from "moment";
import Modal from "react-modal";
import {
  MdCameraAlt,
  MdDeleteOutline,
  MdOutlineEmail,
  MdOutlineTravelExplore,
} from "react-icons/md";
import { toast } from "react-toastify";

import { useAuthStore, type Me } from "../../auth/authStore";
import Navbar from "../../components/Navbar/Navbar";
import type { Tale } from "../../types/tale";
import { deleteTale, listMyTales, toggleLike } from "../../api/tales";
import { deleteProfilePicture, uploadProfilePicture } from "../../api/user";

import TalesFeed from "./TalesFeed";
import RightPanel from "./RightPanel";
import LeftOptions from "./LeftOptions";
import TaleViewModal from "../tales/TaleViewModal";

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

export default function Profile() {
  const [searchQuery, setSearchQuery] = useState("");
  const [tales, setTales] = useState<Tale[]>([]);
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
      const data = await listMyTales();
      setTales(data);
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

  const favoriteCount = tales.filter((t) => t.isFav).length;
  const totalImages = tales.reduce((sum, tale) => sum + tale.images.length, 0);

  const onSearch = (q: string) => {
    setSearchQuery(q);
  };

  const clearSearch = () => {
    setSearchQuery("");
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
      closeTale();
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

  return (
    <>
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={onSearch}
        onClearSearch={clearSearch}
      />

      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
          <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <div className="relative">
                  {me?.media.profilePicture.secureUrl ? (
                    <img
                      src={me.media.profilePicture.secureUrl}
                      alt={me.fullName}
                      className="h-24 w-24 rounded-3xl border border-slate-200 object-cover"
                    />
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-cyan-600 text-3xl font-semibold text-white">
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
                  <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
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

              <div className="grid grid-cols-3 gap-3 sm:w-[360px]">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Stories</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900">{tales.length}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Favorites</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900">{favoriteCount}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
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
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-red-600 hover:text-white disabled:opacity-50"
                >
                  <MdDeleteOutline />
                  Remove picture
                </button>
              )}
            </div>
          </section>

          <div className="mt-6 grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)_260px]">
            <aside>
              <LeftOptions
                totalTales={tales.length}
                favoriteTales={favoriteCount}
                totalImages={totalImages}
              />
            </aside>

            <main className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              {loading ? (
                <div className="text-sm text-slate-500">Loading...</div>
              ) : (
                <TalesFeed
                  tales={filtered}
                  onSelectTale={openTale}
                  onLikeToggle={handleLikeToggle}
                />
              )}
            </main>

            <aside>
              <RightPanel tales={tales} />
            </aside>
          </div>
        </div>
      </div>

      <Modal
        isOpen={openView.isShown}
        onRequestClose={closeTale}
        appElement={document.getElementById("root") as HTMLElement}
        style={modalStyle}
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