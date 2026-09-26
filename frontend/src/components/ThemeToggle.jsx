import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const dark = theme === "dark";

  return (
    <button
      type="button"
      className={`themeToggle ${dark ? "isDark" : "isLight"}`}
      onClick={toggleTheme}
      aria-label={`Switch to ${dark ? "light" : "dark"} theme`}
      title={`Switch to ${dark ? "light" : "dark"} theme`}
      role="switch"
      aria-checked={dark}
    >
      <span className="themeTrack" aria-hidden="true">
        <span className="themeTrackIcon sunIcon"><Sun size={12} /></span>
        <span className="themeTrackIcon moonIcon"><Moon size={11} /></span>
        <span className="themeKnob" />
      </span>
    </button>
  );
}
