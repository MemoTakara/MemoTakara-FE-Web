// src/App.js
import React, { useEffect, useState } from "react";
import api from "./api";

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/your-endpoint"); // Thay đổi '/your-endpoint' tùy theo yêu cầu API
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Data from API</h1>
      <ul>
        {data.map((item) => (
          <li key={item.id}>{item.name}</li> // Giả sử item có thuộc tính id và name
        ))}
      </ul>
    </div>
  );
}

export default App;
