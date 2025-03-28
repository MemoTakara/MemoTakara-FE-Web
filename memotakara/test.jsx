import React, { useState } from "react";
import { AutoComplete, Input } from "antd";
import { searchItems } from "../api/search"; // Hàm gọi API

const App = () => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Gọi API khi nhập từ khóa
  const handleSearch = async (value) => {
    if (!value) {
      setOptions([]);
      return;
    }

    setLoading(true);
    const results = await searchItems(value);
    setLoading(false);

    // Format lại kết quả cho AutoComplete
    const formattedOptions = results.map((item) => ({
      value: item.name, // Giả sử API trả về trường "name"
      label: item.name,
    }));

    setOptions(formattedOptions);
  };

  const onSelect = (value) => {
    console.log("Đã chọn:", value);
  };

  return (
    <AutoComplete
      style={{ width: 300 }}
      options={options}
      onSelect={onSelect}
      onSearch={handleSearch}
      size="large"
    >
      <Input.Search
        size="large"
        placeholder="Nhập từ khóa..."
        enterButton
        loading={loading}
      />
    </AutoComplete>
  );
};

export default App;
