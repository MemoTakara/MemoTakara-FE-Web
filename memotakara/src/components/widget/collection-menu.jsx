import { useMemo } from "react";
import { Dropdown } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faPencil } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

const CollectionDropdown = ({ isAuthor, onEdit, onCopy }) => {
  const { t } = useTranslation();

  const menuItems = useMemo(
    () => [
      ...(isAuthor
        ? [
            {
              key: "edit",
              label: (
                <div>
                  <FontAwesomeIcon
                    icon={faPencil}
                    style={{ fontSize: "var(--body-size)", marginRight: 8 }}
                  />
                  {t("components.set-item.edit-icon")}
                </div>
              ),
            },
          ]
        : []),
      {
        key: "copy",
        label: (
          <div>
            <FontAwesomeIcon
              icon={faCopy}
              style={{
                fontSize: "var(--body-size)",
                marginRight: 8,
              }}
            />
            {t("components.set-item.copy-icon")}
          </div>
        ),
      },
    ],
    [isAuthor, t]
  );

  const handleMenuClick = ({ key }) => {
    if (key === "edit") onEdit();
    else if (key === "copy") onCopy();
  };

  return (
    <Dropdown
      menu={{ items: menuItems, onClick: handleMenuClick }}
      placement="bottomRight"
      trigger={["click"]}
    >
      <EllipsisOutlined
        style={{
          fontSize: "var(--body-size-max)",
          marginBottom: "5px",
          cursor: "pointer",
        }}
      />
    </Dropdown>
  );
};

export default CollectionDropdown;
