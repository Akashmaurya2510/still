import { useEffect, useRef, useState } from "react";
import { Download, Moon, Sun, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { downloadBackup, makeBackup, readBackupFile } from "@/lib/backup";
import { useAppStore } from "@/lib/store";
import { cn, haptic, initials, withThemeTransition } from "@/lib/utils";
import { IconButton } from "./IconButton";

export function SettingsPanel() {
  const open = useAppStore((s) => s.settingsOpen);
  const setOpen = useAppStore((s) => s.setSettingsOpen);
  const profileName = useAppStore((s) => s.profileName);
  const setProfileName = useAppStore((s) => s.setProfileName);
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);
  const tasks = useAppStore((s) => s.tasks);
  const replaceFromBackup = useAppStore((s) => s.replaceFromBackup);

  const [nameDraft, setNameDraft] = useState(profileName);
  const [pending, setPending] = useState<{ name: string; count: number } | null>(null);
  const [pendingData, setPendingData] = useState<ReturnType<typeof makeBackup> | null>(null);
  const [mounted, setMounted] = useState(open);
  const [closing, setClosing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setMounted(true);
      setClosing(false);
      return;
    }
    setClosing(true);
    const t = window.setTimeout(() => {
      setMounted(false);
      setClosing(false);
    }, 200);
    return () => window.clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (open) setNameDraft(profileName);
  }, [open, profileName]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        if (pending) {
          setPending(null);
          setPendingData(null);
        } else {
          setOpen(false);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, pending, setOpen]);

  function saveName() {
    setProfileName(nameDraft);
  }

  function exportBackup() {
    downloadBackup(makeBackup({ tasks, profileName, theme }));
    haptic(10);
    toast.success("Backup downloaded");
  }

  async function onPickFile(file: File | undefined) {
    if (!file) return;
    try {
      const backup = await readBackupFile(file);
      setPendingData(backup);
      setPending({ name: file.name, count: backup.tasks.length });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not read backup");
    }
  }

  function confirmImport() {
    if (!pendingData) return;
    replaceFromBackup(pendingData);
    setPending(null);
    setPendingData(null);
    haptic(12);
    toast.success("Backup restored");
  }

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Close settings"
        className={cn("absolute inset-0 bg-overlay", closing ? "overlay-out" : "overlay-in")}
        onClick={() => {
          if (pending) {
            setPending(null);
            setPendingData(null);
          } else {
            setOpen(false);
          }
        }}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
        className={cn(
          "glass-strong relative max-h-[90dvh] w-full overflow-y-auto rounded-t-3xl p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:max-w-md sm:rounded-3xl sm:p-6",
          closing ? "sheet-out" : "sheet-in",
        )}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 id="settings-title" className="font-display text-2xl font-medium tracking-tight">
            Settings
          </h2>
          <IconButton label="Close" onClick={() => setOpen(false)}>
            <X className="size-5" strokeWidth={1.75} />
          </IconButton>
        </div>

        {pending && pendingData ? (
          <div className="flex flex-col gap-4">
            <p className="text-sm leading-relaxed text-fg">
              Replace all current tasks with this backup? {pending.count} task
              {pending.count === 1 ? "" : "s"} from{" "}
              <span className="font-medium">{pending.name}</span>. This cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setPending(null);
                  setPendingData(null);
                }}
                className="flex h-11 flex-1 items-center justify-center rounded-2xl bg-fg/8 text-sm font-medium text-fg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmImport}
                className="flex h-11 flex-1 items-center justify-center rounded-2xl bg-fg text-sm font-medium text-bg"
              >
                Restore
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <section>
              <p className="mb-3 text-xs font-medium tracking-wide text-muted">Profile</p>
              <div className="flex items-center gap-3">
                <div className="glass flex size-14 shrink-0 items-center justify-center rounded-full text-base font-medium text-fg">
                  {initials(nameDraft || profileName)}
                </div>
                <label className="min-w-0 flex-1">
                  <span className="sr-only">Your name</span>
                  <input
                    value={nameDraft}
                    onChange={(e) => setNameDraft(e.target.value)}
                    onBlur={saveName}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        saveName();
                        (e.currentTarget as HTMLInputElement).blur();
                      }
                    }}
                    placeholder="Your name"
                    maxLength={40}
                    className="h-12 w-full rounded-2xl bg-fg/6 px-4 text-base text-fg outline-none placeholder:text-muted"
                  />
                </label>
              </div>
              <p className="mt-2 text-xs text-muted">Shown in greetings and on your report.</p>
            </section>

            <section>
              <p className="mb-3 text-xs font-medium tracking-wide text-muted">Appearance</p>
              <div className="grid grid-cols-2 gap-2">
                <ThemeChoice
                  active={theme === "oled"}
                  label="OLED"
                  icon={<Moon className="size-4" strokeWidth={1.75} />}
                  onClick={(e) => withThemeTransition(e, () => setTheme("oled"))}
                />
                <ThemeChoice
                  active={theme === "light"}
                  label="Light"
                  icon={<Sun className="size-4" strokeWidth={1.75} />}
                  onClick={(e) => withThemeTransition(e, () => setTheme("light"))}
                />
              </div>
            </section>

            <section>
              <p className="mb-3 text-xs font-medium tracking-wide text-muted">Backup</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={exportBackup}
                  className="glass flex h-12 items-center justify-center gap-2 rounded-2xl text-sm font-medium text-fg"
                >
                  <Download className="size-4" strokeWidth={1.75} />
                  Export
                </button>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="glass flex h-12 items-center justify-center gap-2 rounded-2xl text-sm font-medium text-fg"
                >
                  <Upload className="size-4" strokeWidth={1.75} />
                  Import
                </button>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="application/json,.json"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  void onPickFile(file);
                  e.target.value = "";
                }}
              />
              <p className="mt-2 text-xs text-muted">
                Download a JSON copy of your tasks, or restore one. Data stays on this device.
              </p>
            </section>

            <InstallHint />
          </div>
        )}
      </div>
    </div>
  );
}

function ThemeChoice({
  active,
  label,
  icon,
  onClick,
}: {
  active: boolean;
  label: string;
  icon: React.ReactNode;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-12 items-center justify-center gap-2 rounded-2xl text-sm font-medium",
        "transition-[background-color,color,transform] duration-200 ease-[var(--ease-spring)] active:scale-[0.97]",
        active ? "bg-fg text-bg" : "glass text-fg",
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function InstallHint() {
  const [canInstall, setCanInstall] = useState(false);
  const promptRef = useRef<{ prompt: () => Promise<unknown> } | null>(null);
  const [standalone, setStandalone] = useState(false);
  const [ios, setIos] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(display-mode: standalone)");
    setStandalone(media.matches || (navigator as Navigator & { standalone?: boolean }).standalone === true);
    setIos(/iphone|ipad|ipod/i.test(navigator.userAgent));
    const onPrompt = (e: Event) => {
      e.preventDefault();
      promptRef.current = e as Event & { prompt: () => Promise<unknown> };
      setCanInstall(true);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  if (standalone) {
    return (
      <section>
        <p className="mb-1 text-xs font-medium tracking-wide text-muted">Home Screen</p>
        <p className="text-sm text-muted">Still is installed on this device.</p>
      </section>
    );
  }

  return (
    <section>
      <p className="mb-2 text-xs font-medium tracking-wide text-muted">Home Screen</p>
      {canInstall ? (
        <button
          type="button"
          onClick={() => {
            void promptRef.current?.prompt();
          }}
          className="glass flex h-12 w-full items-center justify-center rounded-2xl text-sm font-medium text-fg"
        >
          Install Still
        </button>
      ) : (
        <p className="text-sm leading-relaxed text-muted">
          {ios
            ? "On iPhone or iPad, tap Share, then Add to Home Screen."
            : "Install Still from your browser menu for a full-screen app."}
        </p>
      )}
    </section>
  );
}
