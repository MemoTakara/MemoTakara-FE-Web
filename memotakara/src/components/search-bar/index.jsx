import { useState } from "react";
import { Input, AutoComplete } from "antd";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { searchItems } from "@/api/collection";

const MemoSearch = ({ isGuest }) => {
  const { t } = useTranslation();
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Search bar - Gọi API khi nhập từ khóa
  const handleSearch = async (value) => {
    if (!value) {
      setOptions([]);
      return;
    }

    setLoading(true);
    try {
      const results = await searchItems(value);
      setLoading(false);

      // Format lại kết quả cho AutoComplete
      const formattedOptions = results.map((item) => ({
        value: String(item.id), // Giả sử ID của collection được trả về từ API
        label: (
          <div>
            <strong>{item.collection_name}</strong>
            <div style={{ fontSize: "var(--small-body-size)", color: "#888" }}>
              {t("components.header.search_user1")}{" "}
              {item.user?.role === "admin"
                ? "MemoTakara"
                : item.user?.username || t("components.header.search_user2")}
            </div>
          </div>
        ),
      }));

      setOptions(formattedOptions);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
      setLoading(false);
    }
  };

  const onSelectSearch = (value) => {
    console.log("Đã chọn (search):", value);
    // Điều hướng đến trang chi tiết collection
    if (isGuest) {
      navigate(`/public-collection/${value}`);
    } else {
      navigate(`/public-study-set/${value}`);
    }
  };

  return (
    <AutoComplete
      style={{
        width: 250,
      }}
      options={options}
      onSelect={onSelectSearch}
      onSearch={handleSearch}
    >
      <Input.Search
        size="medium"
        placeholder={t("search.placeholder")}
        enterButton={t("search.enter")}
        loading={loading}
      />
    </AutoComplete>
  );
};

export default MemoSearch;
