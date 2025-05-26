import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ToggleWhite = ({
  textKeyDefault,
  textKeyClicked,
  style,
  iconDefault,
  iconClicked,
  onClick,
}) => {
  const { t } = useTranslation();
  const [isClicked, setIsClicked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    setIsClicked(!isClicked);
    if (onClick) onClick();
  };

  const btnWhiteStyle = {
    display: "flex", // Căn chỉnh icon và text
    alignItems: "center",
    justifyContent: "center",
    gap: "8px", // Khoảng cách giữa icon và text

    backgroundColor: isHovered
      ? "var(--color-light-button-hover)" // Hover
      : isClicked
      ? "var(--color-light-background)" // Khi active
      : "#fff", // Mặc định,
    color: "var(--color-text)",

    padding: "10px",
    borderRadius: "var(--button-border-radius)",
    border: "1px solid var(--color-light-button)",

    cursor: "pointer",

    fontSize: "var(--small-size)",

    transition: "0.3s ease-in-out", // tạo hiệu ứng mượt mà
    transform: isHovered ? "scale(0.98)" : "scale(1)", // Hiệu ứng phóng to khi hover
    ...style, // Kết hợp với style được truyền từ props
  };

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={btnWhiteStyle}
    >
      {isClicked ? (
        <>
          {iconClicked && <FontAwesomeIcon icon={iconClicked} />}
          {t(`buttons.${textKeyClicked}`)}
        </>
      ) : (
        <>
          {iconDefault && <FontAwesomeIcon icon={iconDefault} />}
          {t(`buttons.${textKeyDefault}`)}
        </>
      )}
    </button>
  );
};

export default ToggleWhite;
