import { useState } from "react";
import { useTranslation } from "react-i18next";

const HeaderSet = ({ textKey, isActive, onClick, style }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { t } = useTranslation();
  const btnHeaderStyle = {
    backgroundColor: isHovered
      ? "var(--color-light-button-hover)" // Hover
      : isActive
      ? "var(--color-light-background)" // Khi active
      : "#fff", // Mặc định,
    color: "var(--color-text)",

    padding: "10px",
    border: "none", // Xóa tất cả border mặc định
    borderRadius: "0",
    borderBottom: isActive ? "2px solid #000" : "none",

    cursor: "pointer",

    fontSize: "var(--header-size)",
    fontWeight: "var(--header-weight-size)",
    fontFamily: "var(--body-font)",
    transition: "0.3s ease-in-out", // tạo hiệu ứng mượt mà
    transform: isHovered ? "scale(0.95)" : "scale(1)", // Hiệu ứng phóng to khi hover
    ...style, // Kết hợp với style được truyền từ props
  };

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={btnHeaderStyle}
    >
      {t(`buttons.${textKey}`)}
    </button>
  );
};

export default HeaderSet;
