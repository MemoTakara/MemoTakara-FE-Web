// recent list của user: cả private và public
// cần chia Public để sao chép collection
import CollectionList from "@/components/create-collection/collection-list";
import { getRecentCollections } from "@/api/recentCollection";
import { useTranslation } from "react-i18next";

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
