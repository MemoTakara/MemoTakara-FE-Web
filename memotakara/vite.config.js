import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  esbuild: {
    jsxInject: `import React from 'react'`, // Tự động thêm React vào JSX
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // Định nghĩa alias
    },
  },
});
