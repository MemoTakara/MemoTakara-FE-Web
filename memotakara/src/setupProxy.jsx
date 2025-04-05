import { createProxyMiddleware } from "http-proxy-middleware";

export default function (app) {
  app.use(
    createProxyMiddleware("/api", {
      target: "http://3.90.184.100:80", // Điểm cuối API
      changeOrigin: true,
      secure: false, // Bỏ qua xác minh SSL
      onProxyReq: (proxyReq, req, res) => {
        proxyReq.setHeader("X-Forwarded-Proto", "https");
      },
    })
  );
}
