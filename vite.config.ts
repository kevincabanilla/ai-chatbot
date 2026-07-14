import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ],
  server: {
    port: 3000,
    open: false,
  },
  resolve: {
    alias: {
      // Always update the paths in tsconfig.app.json when updating this.
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@/shared": fileURLToPath(new URL("./shared", import.meta.url)),
    },
  },
});
