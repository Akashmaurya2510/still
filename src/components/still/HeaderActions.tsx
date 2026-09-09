import { Moon, Search, Settings, Sun, X } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { withThemeTransition } from "@/lib/utils";
import { IconButton } from "./IconButton";

type Props = {
  searching?: boolean;
  onToggleSearch?: () => void;
};

export function HeaderActions({ searching, onToggleSearch }: Props) {
  const theme = useAppStore((s) => s.theme);
  const toggleTheme = useAppStore((s) => s.toggleTheme);
  const setSettingsOpen = useAppStore((s) => s.setSettingsOpen);

  return (
    <div className="flex items-center gap-0.5">
      {onToggleSearch && (
        <IconButton label={searching ? "Close search" : "Search"} onClick={onToggleSearch}>
          {searching ? (
            <X className="size-5" strokeWidth={1.75} />
          ) : (
            <Search className="size-5" strokeWidth={1.75} />
          )}
        </IconButton>
      )}
      <IconButton
        label={theme === "oled" ? "Switch to light mode" : "Switch to OLED mode"}
        onClick={(e) => withThemeTransition(e, toggleTheme)}
      >
        {theme === "oled" ? (
          <Sun className="size-5" strokeWidth={1.75} />
        ) : (
          <Moon className="size-5" strokeWidth={1.75} />
        )}
      </IconButton>
      <IconButton label="Settings" className="lg:hidden" onClick={() => setSettingsOpen(true)}>
        <Settings className="size-5" strokeWidth={1.75} />
      </IconButton>
    </div>
  );
}
