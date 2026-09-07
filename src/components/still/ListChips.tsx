import { LISTS, useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function ListChips() {
  const listScope = useAppStore((s) => s.listScope);
  const setListScope = useAppStore((s) => s.setListScope);

  return (
    <div className="no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1 py-0.5">
      {LISTS.map((list) => {
        const active = listScope === list.id;
        return (
          <button
            key={list.id}
            type="button"
            onClick={() => setListScope(list.id)}
            className={cn(
              "shrink-0 rounded-pill px-3.5 py-2 text-sm font-medium transition-colors duration-150",
              active
                ? "glass-strong text-fg"
                : "text-muted hover:bg-fg/6 hover:text-fg",
            )}
          >
            {list.label}
          </button>
        );
      })}
    </div>
  );
}
