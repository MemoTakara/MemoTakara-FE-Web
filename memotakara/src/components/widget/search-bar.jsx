import { useState } from "react";
import { Input, AutoComplete } from "antd";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { getCollections } from "@/api/collection";

const MemoSearch = ({ isGuest }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");

  // Search bar - Gọi API khi nhập từ khóa
  const handleSearch = async (value) => {
    setInputValue(value); // update input khi gõ
    if (!value) {
      setOptions([]);
      return;
    }

    setLoading(true);
    try {
      const results = await getCollections({
        search: value,
        privacy: "public",
        sort_by: "rating",
      });
      const collections = results?.data || [];

      // Format lại kết quả cho AutoComplete
      const formattedOptions = collections.map((item) => ({
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
        displayName: item.collection_name, // Thêm tên để dùng lại sau
      }));

      setOptions(formattedOptions);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
      setLoading(false);
    }
  };

  const onSelectSearch = (value) => {
    const selected = options.find((option) => option.value === value);

    if (selected) {
      setInputValue(selected.displayName); // Show lại tên sau khi click

      if (isGuest) {
        navigate(`/public-collection/${value}`);
      } else {
        navigate(`/public-study-set/${value}`);
      }
    }
  };

  return (
    <AutoComplete
      style={{
        width: 320,
      }}
      options={options}
      onSelect={onSelectSearch}
      onSearch={handleSearch}
      value={inputValue} // controlled input
      onChange={(value) => setInputValue(value)} // update input thủ công
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
