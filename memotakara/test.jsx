import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";

export default defineConfig({
  plugins: [
    laravel({
      input: ["resources/js/app.js", "resources/css/app.css"],
      refresh: true,
    }),
  ],
  server: {
    cors: {
      origin: ["http://localhost:3000"], // Thêm miền của front-end
    },
  },
});
