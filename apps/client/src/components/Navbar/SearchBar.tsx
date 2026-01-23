import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";

export default function SearchBar({
  value,
  onChange,
  onSearch,
  onClear,
}: {
  value: string;
  onChange: (v: string) => void;
  onSearch: () => void;
  onClear: () => void;
}) {
  return (
    <div className="w-80 max-w-[70vw] flex items-center px-4 bg-slate-100 rounded-md">
      <input
        type="text"
        placeholder="Search tales"
        className="w-full text-xs bg-transparent py-[11px] outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSearch();
        }}
      />

      {value && (
        <IoMdClose className="text-xl text-slate-500 cursor-pointer hover:text-black mr-3" onClick={onClear} />
      )}

      <FaMagnifyingGlass className="text-slate-400 cursor-pointer hover:text-black" onClick={onSearch} />
    </div>
  );
}
