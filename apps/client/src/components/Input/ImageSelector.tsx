import { useEffect, useRef, useState } from "react";
import { FaRegFileImage } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";

export default function ImageSelector({
  images,
  setImages,
}: {
  images: File[];
  setImages: (files: File[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [previews, setPreviews] = useState<string[]>([]);

  const choose = () => inputRef.current?.click();

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setImages([...images, ...files].slice(0, 10));
    e.target.value = "";
  };

  const removeAt = (idx: number) => setImages(images.filter((_, i) => i !== idx));

  useEffect(() => {
    const urls = images.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [images]);

  return (
    <div>
      <input ref={inputRef} type="file" accept="image/*" multiple onChange={onChange} className="hidden" />

      {images.length === 0 ? (
        <button
          type="button"
          className="w-full h-[220px] flex flex-col items-center justify-center gap-4 bg-slate-50 rounded border border-slate-200/50"
          onClick={choose}
        >
          <div className="w-14 h-14 flex items-center justify-center bg-cyan-50 rounded-full border border-cyan-100">
            <FaRegFileImage className="text-xl text-cyan-500" />
          </div>
          <p className="text-sm text-slate-500">Browse image files to upload</p>
        </button>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {previews.map((url, idx) => (
            <div key={url} className="relative">
              <img src={url} alt="Selected" className="w-full h-40 object-cover rounded-lg" />
              <button
                type="button"
                className="absolute top-2 right-2 bg-white/80 border rounded-md p-1"
                onClick={() => removeAt(idx)}
                aria-label="Remove image"
              >
                <MdDeleteOutline className="text-lg" />
              </button>
            </div>
          ))}
          {images.length < 10 && (
            <button
              type="button"
              className="h-40 rounded-lg border border-dashed flex items-center justify-center text-sm text-slate-500"
              onClick={choose}
            >
              + Add more
            </button>
          )}
        </div>
      )}
    </div>
  );
}
