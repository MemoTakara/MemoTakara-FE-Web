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
  server: {
    cors: {
      origin: [
        "http://localhost:5173", // Địa chỉ frontend thứ nhất
        "https://memo-takara-fe-web.vercel.app/", // Địa chỉ frontend thứ hai
      ], // Thêm miền của front-end
    },
  },
});
