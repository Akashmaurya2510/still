import { useState } from "react";
import { FilterTabs } from "./FilterTabs";
import { Header } from "./Header";
import { ListChips } from "./ListChips";
import { SearchBar } from "./SearchBar";
import { TaskInput } from "./TaskInput";
import { TaskList } from "./TaskList";
import { useAppStore } from "@/lib/store";

export function TasksView() {
  const [searching, setSearching] = useState(false);
  const setSearch = useAppStore((s) => s.setSearch);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <Header
        searching={searching}
        onToggleSearch={() => {
          if (searching) setSearch("");
          setSearching((v) => !v);
        }}
      />
      {searching ? <SearchBar /> : <TaskInput />}
      <FilterTabs />
      <div className="lg:hidden">
        <ListChips />
      </div>
      <TaskList />
    </div>
  );
}
