// hiển thị trong public list và chi tiết của public collection
// cần chia Public để sao chép collection
import { useTranslation } from "react-i18next";

import { getCollections } from "@/api/collection";
import CollectionList from "@/components/collection-modal/collection-list";

const PublicList = ({ isPublic }) => {
  const { t } = useTranslation();

  const fetchPublicCollections = async (params) => {
    return await getCollections({
      ...params,
      privacy: "public", // lọc public
      per_page: 5, // số lượng tối đa (hoặc dùng state để phân trang thật)
      sort_by: "rating",
      sort_order: "desc",
    });
  };

  return (
    <CollectionList
      title={t("components.set-item.public-collection-title")}
      isPublic={isPublic}
      fetchCollections={fetchPublicCollections}
      isRecent={false}
    />
  );
};

export default PublicList;
