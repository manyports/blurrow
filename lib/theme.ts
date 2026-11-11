/* The site's theme: the reader's choice, kept in localStorage and
   written to <html data-theme>. "system" follows the OS.            */

export type ThemeChoice = "light" | "dark" | "system";

export const THEME_KEY = "blurrow-theme";

const listeners = new Set<() => void>();

export function readTheme(): ThemeChoice {
  try {
    const v = localStorage.getItem(THEME_KEY);
    return v === "light" || v === "dark" ? v : "system";
  } catch {
    return "system";
  }
}

export function writeTheme(choice: ThemeChoice) {
  try {
    localStorage.setItem(THEME_KEY, choice);
  } catch {
    // private windows can refuse storage; the theme still applies for this visit
  }
  listeners.forEach((l) => l());
}

export function subscribeTheme(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

export function applyTheme(choice: ThemeChoice) {
  document.documentElement.dataset.theme = choice;
}

/* Runs before first paint so a dark page never flashes light */
export const themeScript = `try{var t=localStorage.getItem("${THEME_KEY}");if(t!=="light"&&t!=="dark")t="system";document.documentElement.dataset.theme=t}catch(e){}`;
