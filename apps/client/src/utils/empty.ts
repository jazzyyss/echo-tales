export type FilterType = "" | "search" | "date";

export function getEmptyMessage(filter: FilterType) {
  if (filter === "search") return "No results found. Try a different search.";
  if (filter === "date") return "No tales in this date range.";
  return "No tales yet. Create your first one.";
}
