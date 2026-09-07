import { useState } from "react";
import { FilterTabs } from "./FilterTabs";
import { Header } from "./Header";
import { ListChips } from "./ListChips";
import { SearchBar } from "./SearchBar";
import { TaskInput } from "./TaskInput";
import { TaskList } from "./TaskList";
import { ThemeSync } from "./ThemeSync";
import { useAppStore } from "@/lib/store";

export function App() {
  const [searching, setSearching] = useState(false);
  const setSearch = useAppStore((s) => s.setSearch);
  const hydrated = useAppStore((s) => s.hydrated);

  return (
    <>
      <ThemeSync />
      <div className="app-shell flex h-full w-full flex-col">
        <div className="app-frame mx-auto flex h-full w-full max-w-md flex-col bg-bg/40 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] md:px-5">
          <div
            className="flex min-h-0 flex-1 flex-col gap-4"
            style={{ opacity: hydrated ? 1 : 0, transition: "opacity 180ms var(--ease-out-smooth)" }}
          >
            <Header
              searching={searching}
              onToggleSearch={() => {
                if (searching) setSearch("");
                setSearching((v) => !v);
              }}
            />
            {searching ? <SearchBar /> : <TaskInput />}
            <FilterTabs />
            <ListChips />
            <TaskList />
          </div>
        </div>
      </div>
    </>
  );
}
