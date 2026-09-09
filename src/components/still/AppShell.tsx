import { Toaster } from "sonner";
import { useAppStore } from "@/lib/store";
import { SettingsPanel } from "./SettingsPanel";
import { Sidebar } from "./Sidebar";
import { TabBar } from "./TabBar";
import { TasksView } from "./TasksView";
import { ReportView } from "./ReportView";
import { ThemeSync } from "./ThemeSync";
import { useHasMounted } from "./use-has-mounted";

export function AppShell() {
  const theme = useAppStore((s) => s.theme);
  const view = useAppStore((s) => s.view);
  const mounted = useHasMounted();

  return (
    <>
      <ThemeSync />
      <div className="app-shell flex h-full w-full flex-col">
        <div className="app-frame mx-auto flex h-full w-full flex-col bg-bg/40 md:flex-row">
          {mounted ? (
            <>
              <Sidebar />
              <main className="flex min-h-0 min-w-0 flex-1 flex-col px-4 pb-[max(5.5rem,calc(env(safe-area-inset-bottom)+4.75rem))] pt-[max(1rem,env(safe-area-inset-top))] md:px-6 lg:pb-6 lg:pt-6">
                <div key={view} className="view-fade flex min-h-0 flex-1 flex-col">
                  {view === "report" ? <ReportView /> : <TasksView />}
                </div>
              </main>
              <TabBar />
              <SettingsPanel />
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <p className="font-display text-3xl font-medium tracking-tight text-fg">Still</p>
            </div>
          )}
        </div>
      </div>
      <Toaster
        theme={theme === "light" ? "light" : "dark"}
        position="top-center"
        toastOptions={{
          className: "glass-strong !rounded-2xl !border-0 !text-fg",
        }}
      />
    </>
  );
}
