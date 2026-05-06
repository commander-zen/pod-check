const STORAGE_KEY = "cardstock_theme";

export function getTheme() {
  return localStorage.getItem(STORAGE_KEY) ?? "default";
}

export function setTheme(theme) {
  localStorage.setItem(STORAGE_KEY, theme);
  applyTheme(theme);
}

export function applyTheme(theme) {
  if (!theme || theme === "default") {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.setAttribute("data-theme", theme);
  }
}

export function initTheme() {
  applyTheme(getTheme());
}
