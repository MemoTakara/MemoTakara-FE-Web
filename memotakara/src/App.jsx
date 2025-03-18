import { Outlet } from "react-router-dom";

function App() {
  return (
    <div>
      <Outlet /> {/* Hiển thị các trang con */}
    </div>
  );
}

export default App;
