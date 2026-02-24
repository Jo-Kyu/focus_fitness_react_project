import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base:
    process.env.NODE_ENV === "production"
      ? "/focus_fitness_react_project/" // 部署 GitHub Pages
      : "/", // 本地開發
});
