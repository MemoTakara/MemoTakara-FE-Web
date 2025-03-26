import { useTranslation } from "react-i18next";
import { Select } from "antd";

const BtnLanguage = () => {
  const { i18n } = useTranslation();

  const handleLanguage = (value) => {
    // Thiết lập newLang dựa trên value được chọn
    let newLang;
    switch (value) {
      case "Tiếng Việt":
        newLang = "vi";
        break;
      case "English":
        newLang = "en";
        break;
      case "日本語":
        newLang = "ja";
        break;
      case "中文":
        newLang = "zh";
        break;
      default:
        newLang = "en"; // Mặc định là tiếng Anh
        break;
    }

    i18n.changeLanguage(newLang);
    localStorage.setItem("language", newLang); // Lưu vào localStorage
  };

  // Thiết lập defaultValue dựa trên ngôn ngữ hiện tại
  const defaultValue = (() => {
    switch (i18n.language) {
      case "vi":
        return "Tiếng Việt";
      case "en":
        return "English";
      case "ja":
        return "日本語";
      case "zh":
        return "中文";
      default:
        return "English"; // Mặc định là tiếng Anh
    }
  })();

  return (
    <Select
      defaultValue={defaultValue}
      style={{
        width: 115,
        height: 40,
      }}
      onChange={handleLanguage}
      options={[
        {
          value: "Tiếng Việt",
          label: "Tiếng Việt",
        },
        {
          value: "English",
          label: "English",
        },
        {
          value: "日本語",
          label: "日本語",
        },
        {
          value: "中文",
          label: "中文",
        },
      ]}
    />
  );
};

export default BtnLanguage;
