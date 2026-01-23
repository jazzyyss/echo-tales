import { useState } from "react";
import { GrMapLocation } from "react-icons/gr";
import { MdAdd, MdClose } from "react-icons/md";

export default function TagInput({
  tags,
  setTags,
}: {
  tags: string[];
  setTags: (tags: string[]) => void;
}) {
  const [inputValue, setInputValue] = useState("");

  const addNewTag = () => {
    const v = inputValue.trim();
    if (!v) return;
    if (tags.includes(v)) return;
    setTags([...tags, v]);
    setInputValue("");
  };

  const removeTag = (tag: string) => setTags(tags.filter((t) => t !== tag));

  return (
    <div>
      {tags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap mt-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-2 text-sm text-cyan-600 bg-cyan-200/40 px-3 py-1 rounded"
            >
              <GrMapLocation className="text-sm" /> {tag}
              <button onClick={() => removeTag(tag)} aria-label={`Remove ${tag}`}>
                <MdClose />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4 mt-3">
        <input
          type="text"
          value={inputValue}
          className="text-sm bg-transparent border px-3 py-2 rounded outline-none"
          placeholder="Add Location"
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addNewTag();
            }
          }}
        />
        <button
          type="button"
          className="w-8 h-8 flex items-center justify-center rounded border border-cyan-500 hover:bg-cyan-500"
          onClick={addNewTag}
          aria-label="Add location"
        >
          <MdAdd className="text-2xl text-cyan-500 hover:text-white" />
        </button>
      </div>
    </div>
  );
}
