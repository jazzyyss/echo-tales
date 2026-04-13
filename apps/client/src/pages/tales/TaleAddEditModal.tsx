import { useMemo, useState } from "react";
import moment from "moment";
import { MdClose, MdLocationOn, MdPublic, MdLock, MdLink } from "react-icons/md";
import { toast } from "react-toastify";

import { createTale, uploadTaleImages } from "../../api/tales";
import ImageSelector from "../../components/Input/ImageSelector";
import type { ImageAsset } from "../../types/media";

type Visibility = "private" | "public" | "unlisted";

export default function TaleAddModal({
  onClose,
  onSaved,
}: {
  onClose: () => void;
  onSaved: () => Promise<void> | void;
}) {
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [visitedDate, setVisitedDate] = useState<Date>(new Date());
  const [images, setImages] = useState<File[]>([]);
  const [visibility, setVisibility] = useState<Visibility>("public");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const locations = useMemo(() => {
    return locationInput
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);
  }, [locationInput]);

  const canSubmit = useMemo(() => {
    return images.length > 0 && caption.trim().length > 0;
  }, [images.length, caption]);

  const submit = async () => {
    if (!canSubmit) {
      setError("Add at least one image and a caption.");
      return;
    }

    setError("");
    setSaving(true);

    try {
      setUploading(true);
      const uploadedImages: ImageAsset[] = await uploadTaleImages(images);
      setUploading(false);

      await createTale({
        title: title.trim() || undefined,
        caption: caption.trim(),
        visibility,
        visitedLocation: locations,
        visitedDate: moment(visitedDate).toISOString(),
        images: uploadedImages,
      });

      toast.success("Tale created");
      await onSaved();
      onClose();
    } catch {
      setError("Failed to create tale.");
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Share a moment</h2>
          <p className="mt-1 text-sm text-slate-500">
            Add photos, a short caption, and post it to your travel timeline.
          </p>
        </div>

        <button
          className="rounded-2xl p-2 text-slate-600 hover:bg-slate-100"
          onClick={onClose}
          aria-label="Close"
        >
          <MdClose className="text-2xl" />
        </button>
      </div>

      <div className="space-y-6">
        <ImageSelector images={images} setImages={setImages} />

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Title <span className="normal-case text-slate-400">(optional)</span>
            </label>
            <input
              type="text"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-500"
              placeholder="Banff at dusk"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Date
            </label>
            <input
              type="date"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-500"
              value={moment(visitedDate).format("YYYY-MM-DD")}
              onChange={(e) => setVisitedDate(new Date(e.target.value))}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Caption
          </label>
          <textarea
            className="min-h-[130px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-500"
            placeholder="Cold air, blue water, and finally a view worth the drive."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
          <p className="text-xs text-slate-400">
            This is the main text of the post.
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Location <span className="normal-case text-slate-400">(optional)</span>
          </label>
          <div className="relative">
            <MdLocationOn className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400" />
            <input
              type="text"
              className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-cyan-500"
              placeholder="Banff, Alberta"
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
            />
          </div>
          <p className="text-xs text-slate-400">
            Use commas if you want more than one location.
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Visibility
          </label>

          <div className="grid gap-3 sm:grid-cols-3">
            <button
              type="button"
              onClick={() => setVisibility("public")}
              className={`rounded-2xl border px-4 py-3 text-left transition ${
                visibility === "public"
                  ? "border-cyan-600 bg-cyan-50"
                  : "border-slate-200 bg-white hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
                <MdPublic className="text-lg" />
                Public
              </div>
              <p className="mt-1 text-xs text-slate-500">Visible in feed</p>
            </button>

            <button
              type="button"
              onClick={() => setVisibility("unlisted")}
              className={`rounded-2xl border px-4 py-3 text-left transition ${
                visibility === "unlisted"
                  ? "border-cyan-600 bg-cyan-50"
                  : "border-slate-200 bg-white hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
                <MdLink className="text-lg" />
                Unlisted
              </div>
              <p className="mt-1 text-xs text-slate-500">Hidden from feed</p>
            </button>

            <button
              type="button"
              onClick={() => setVisibility("private")}
              className={`rounded-2xl border px-4 py-3 text-left transition ${
                visibility === "private"
                  ? "border-cyan-600 bg-cyan-50"
                  : "border-slate-200 bg-white hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
                <MdLock className="text-lg" />
                Private
              </div>
              <p className="mt-1 text-xs text-slate-500">Only for you</p>
            </button>
          </div>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            type="button"
            className="rounded-2xl bg-cyan-600 px-5 py-3 text-sm font-medium text-white hover:bg-cyan-700 disabled:opacity-50"
            onClick={submit}
            disabled={saving || uploading}
          >
            {saving || uploading ? "Posting..." : "Post tale"}
          </button>
        </div>
      </div>
    </div>
  );
}