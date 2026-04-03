import { useMemo, useState } from "react";
import moment from "moment";
import { MdClose } from "react-icons/md";
import { toast } from "react-toastify";

import { createTale, uploadTaleImages } from "../../api/tales";
import TagInput from "../../components/Input/TagInput";
import ImageSelector from "../../components/Input/ImageSelector";
import type { ImageAsset } from "../../types/media";

export default function TaleAddModal({
  onClose,
  onSaved,
}: {
  onClose: () => void;
  onSaved: () => Promise<void> | void;
}) {
  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");
  const [visitedLocation, setVisitedLocation] = useState<string[]>([]);
  const [visitedDate, setVisitedDate] = useState<Date>(new Date());

  const [images, setImages] = useState<File[]>([]);
  const [visibility, setVisibility] = useState<"private" | "public" | "unlisted">("public");
  const [isFav, setIsFav] = useState(false);

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const canSubmit = useMemo(() => {
    return title.trim().length > 0 && story.trim().length > 0 && images.length > 0;
  }, [title, story, images.length]);

  const submit = async () => {
    if (!canSubmit) {
      setError("Title, story, and at least one image are required.");
      return;
    }

    setError("");
    setSaving(true);

    try {
      setUploading(true);
      const uploadedImages: ImageAsset[] = await uploadTaleImages(images);
      setUploading(false);

      await createTale({
        title: title.trim(),
        story: story.trim(),
        visibility,
        visitedLocation,
        isFav,
        images: uploadedImages,
        visitedDate: moment(visitedDate).toISOString(),
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
    <div className="relative w-full max-w-4xl mx-auto p-4">
      <div className="flex items-start justify-between gap-4 mb-6">
        <h5 className="text-xl font-medium text-slate-700">Add Tale</h5>

        <button
          className="text-slate-700 p-2 rounded-full"
          onClick={onClose}
          aria-label="Close"
        >
          <MdClose className="text-2xl" />
        </button>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-slate-600">Title</label>
          <input
            type="text"
            className="text-xl sm:text-lg text-slate-950 outline-none w-full p-2 bg-slate-50 rounded"
            placeholder="Your title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-600">Visited:</span>
          <input
            type="date"
            className="border rounded px-2 py-1"
            value={moment(visitedDate).format("YYYY-MM-DD")}
            onChange={(e) => setVisitedDate(new Date(e.target.value))}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-slate-600">Visibility</label>
          <select
            className="border rounded px-3 py-2 bg-white"
            value={visibility}
            onChange={(e) =>
              setVisibility(e.target.value as "private" | "public" | "unlisted")
            }
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="unlisted">Unlisted</option>
          </select>
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={isFav}
            onChange={(e) => setIsFav(e.target.checked)}
          />
          Mark as favorite
        </label>

        <ImageSelector images={images} setImages={setImages} />

        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-slate-600">Story</label>
          <textarea
            className="text-sm text-slate-950 outline-none bg-slate-50 p-4 rounded min-h-[100px] w-full"
            placeholder="Your story..."
            value={story}
            onChange={(e) => setStory(e.target.value)}
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600 block mb-2">
            VISITED LOCATIONS
          </label>
          <TagInput tags={visitedLocation} setTags={setVisitedLocation} />
        </div>

        {images.length > 0 && (
          <p className="text-xs text-slate-500">
            {images.length} image{images.length > 1 ? "s" : ""} selected
          </p>
        )}

        {error && <p className="text-red-500 text-xs">{error}</p>}

        <button
          type="button"
          className="w-full sm:w-auto px-4 py-2 rounded bg-cyan-600 text-white hover:bg-cyan-700 disabled:opacity-50"
          onClick={submit}
          disabled={saving || uploading}
        >
          <span className="inline-flex items-center gap-2">
            {saving || uploading ? "Saving..." : "Create"}
          </span>
        </button>
      </div>
    </div>
  );
}