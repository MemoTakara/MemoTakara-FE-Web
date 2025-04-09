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
            style={{ fontSize: "var(--body-size)", marginRight: 8 }}
          />
          {t("components.set-item.copy-icon")}
        </div>
      ),
    },
  ],
  [isAuthor, t]
);
