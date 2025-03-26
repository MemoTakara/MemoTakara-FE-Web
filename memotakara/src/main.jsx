import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "@/views/routes";
import Providers from "@/contexts"; // Import toàn bộ Context
import i18n from "@/i18n";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  </React.StrictMode>
);
