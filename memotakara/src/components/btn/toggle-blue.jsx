import { useState } from "react";
import { useTranslation } from "react-i18next";

const ToggleBlue = ({
  textKeyDefault,
  textKeyClicked,
  disabled,
  style,
  iconDefault,
  iconClicked,
  onClick,
}) => {
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
      : "var(--color-light-button)",
    color: disabled ? "var(--color-text-disabled)" : "#fff",
    padding: "10px",
    borderRadius: "var(--button-border-radius)",
    border: disabled
      ? "1px solid #999"
      : isHovered
      ? "1px solid var(--color-light-button)"
      : "1px solid",
    cursor: disabled ? "not-allowed" : "pointer",
    fontSize: "var(--small-size)",
    transition: "0.3s ease-in-out",
    transform: disabled ? "scale(0.95)" : "scale(1)",
    opacity: disabled ? 0.6 : 1,
    ...style,
  };

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={disabled}
      style={btnBlueStyle}
    >
      {isClicked ? (
        <>
          {iconClicked && <span>{iconClicked}</span>}
          {t(`buttons.${textKeyClicked}`)}
        </>
      ) : (
        <>
          {iconDefault && <span>{iconDefault}</span>}
          {t(`buttons.${textKeyDefault}`)}
        </>
      )}
    </button>
  );
};

export default ToggleBlue;
