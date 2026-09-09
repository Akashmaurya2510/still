import { clsx, type ClassValue } from "clsx";
import { flushSync } from "react-dom";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function uid() {
  return Math.random().toString(36).slice(2, 11) + Date.now().toString(36);
}

export function haptic(ms = 12) {
  try {
    navigator.vibrate?.(ms);
  } catch {
    /* ignore */
  }
}

export function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "S";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => { ready: Promise<void> };
};

/**
 * Runs a state change (e.g. a theme switch) inside the View Transitions API,
 * then animates the new view in as a circle expanding from the click point —
 * the same "radial reveal" feel Telegram uses for its theme toggle.
 * Falls back to an instant, unanimated change on unsupported browsers or
 * when the user prefers reduced motion.
 */
export function withThemeTransition(e: React.MouseEvent<HTMLElement>, run: () => void) {
  const x = e.clientX;
  const y = e.clientY;
  const doc = document as ViewTransitionDocument;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!doc.startViewTransition || reduced) {
    run();
    return;
  }

  const transition = doc.startViewTransition(() => {
    flushSync(run);
  });

  transition.ready
    .then(() => {
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y),
      );
      document.documentElement.animate(
        {
          clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`],
        },
        {
          duration: 550,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    })
    .catch(() => {
      /* transition was skipped/interrupted; theme already applied via run() */
    });
}
