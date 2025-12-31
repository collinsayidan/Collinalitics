import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("dark");

  // Load saved theme on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("theme");
      const prefersLight =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: light)").matches;

      const initial =
        saved === "light" || saved === "dark"
          ? saved
          : prefersLight
          ? "light"
          : "dark";

      setTheme(initial);
      document.documentElement.setAttribute("data-theme", initial);
    } catch {}
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);

    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {}
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle color theme"
      className="inline-flex items-center justify-center w-10 h-10 rounded-md border border-white/10 text-slate-200 hover:bg-white/5 transition"
    >
      {theme === "light" ? (
        <i className="fa-solid fa-moon" />
      ) : (
        <i className="fa-regular fa-sun" />
      )}
    </button>
  );
}
