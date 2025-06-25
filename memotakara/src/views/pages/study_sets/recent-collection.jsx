// recent list của user: cả private và public
// cần chia Public để sao chép collection
import { useTranslation } from "react-i18next";

import { getRecentCollections } from "@/api/collection";
import CollectionList from "@/components/collection-modal/collection-list";

const RecentList = () => {
  const { t } = useTranslation();
  return (
    <CollectionList
      title={t("views.pages.recent-list.title")}
      isPublic={false}
      fetchCollections={getRecentCollections}
      isRecent={true}
    />
  );
};

export default RecentList;
