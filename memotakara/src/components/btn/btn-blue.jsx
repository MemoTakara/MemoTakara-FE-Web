import { useState } from "react";
import { useTranslation } from "react-i18next";

const BtnBlue = ({ textKey, disabled, style, onClick }) => {
  const { t } = useTranslation();
  const [isClicked, setIsClicked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (!disabled) {
      setIsClicked(!isClicked);
      if (onClick) onClick();
    }
  };

  const btnBlueStyle = {
    backgroundColor: disabled
      ? "var(--color-btn-disabled)"
      : "var(--color-light-button)", // Đổi màu nền
    color: disabled ? "var(--color-text-disabled)" : "#fff", // Đổi màu chữ

    padding: "10px",
    borderRadius: "var(--button-border-radius)",
    border: disabled
      ? "1px solid #999"
      : isHovered
      ? "1px solid var(--color-light-button)"
      : "1px solid",

    cursor: disabled ? "not-allowed" : "pointer",

    fontSize: "var(--small-size)",

    transition: "0.3s ease-in-out", // tạo hiệu ứng mượt mà
    transform: disabled ? "scale(0.95)" : "scale(1)", // Hiệu ứng phóng to khi hover
    opacity: disabled ? 0.6 : 1, // Giảm độ rõ khi bị disable
    ...style, // Kết hợp với style được truyền từ props
  };

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={disabled}
      style={btnBlueStyle}
    >
      {t(`buttons.${textKey}`)}
    </button>
  );
};

export default BtnBlue;
