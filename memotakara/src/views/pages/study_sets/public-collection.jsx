// hiển thị trong public list và chi tiết của public collection
// cần chia Public để sao chép collection
import CollectionList from "@/components/create-collection/collection-list";
import { getPublicCollections } from "@/api/collection";
import { useTranslation } from "react-i18next";

const PublicList = ({ isPublic }) => {
  const { t } = useTranslation();
  return (
    <CollectionList
      title={t("components.set-item.public-collection-title")}
      isPublic={isPublic}
      fetchCollections={getPublicCollections}
      isRecent={false}
    />
  );
};

export default PublicList;
