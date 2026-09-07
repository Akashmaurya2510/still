import { useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { useAppStore } from "@/lib/store";

export function SearchBar() {
  const search = useAppStore((s) => s.search);
  const setSearch = useAppStore((s) => s.setSearch);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  return (
    <div className="glass relative rounded-2xl">
      <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" />
      <input
        ref={ref}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search tasks"
        className="w-full rounded-2xl bg-transparent py-3.5 pl-11 pr-4 text-base text-fg outline-none placeholder:text-muted"
      />
    </div>
  );
}
