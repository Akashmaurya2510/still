import { useEffect } from "react";
import { useAppStore } from "@/lib/store";

export function ThemeSync() {
  const theme = useAppStore((s) => s.theme);
  const hydrated = useAppStore((s) => s.hydrated);
  const setHydrated = useAppStore((s) => s.setHydrated);

  useEffect(() => {
    const result = useAppStore.persist.rehydrate();
    void Promise.resolve(result).then(() => setHydrated());
  }, [setHydrated]);

  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.setAttribute("data-theme", theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "oled" ? "#050506" : "#eceff3");
  }, [theme, hydrated]);

  return null;
}
