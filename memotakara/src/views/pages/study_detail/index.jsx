// public collection nhưng chưa sở hữu, chỉ được XEM thôi, KHÔNG có học
import "./index.css";
import { useEffect, useState } from "react";
import { Pagination } from "antd";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { LOCAL_STORAGE_KEYS } from "@/constants/localStorageKeys";
import { getCollectionById, getCollectionByIdPublic } from "@/api/collection";
import { getFlashcardsByCollection } from "@/api/flashcard";

import LoadingPage from "@/views/error-pages/LoadingPage";
import MemoCard from "@/components/cards/card"; // Component hiển thị thông tin flashcards
import MemoFlash from "@/components/cards/flashcard";
import OwnSet from "@/components/set-item/own-set";
import PublicSet from "@/components/set-item/public-set"; // Component hiển thị thông tin collection

function StudyDetail({ isPublic }) {
  const { t } = useTranslation();
  const { id } = useParams();

  const [isAuthor, setAuthor] = useState(false);
  const [collection, setCollection] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [totalFlashcards, setTotalFlashcards] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(() => {
    // Lấy từ localStorage nếu có
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.MEMO_ITEMS_PER_PAGE);
    return saved ? parseInt(saved, 10) : 10;
  }); // Người dùng có thể thay đổi số lượng/trang

  useEffect(() => {
    const fetchCollectionDetail = async () => {
      try {
        setLoading(true);
        const data = isPublic
          ? await getCollectionByIdPublic(id)
          : await getCollectionById(id);
        setAuthor(data.can_edit);
        setCollection(data.collection);
      } catch (err) {
        console.error("Lỗi API:", err);
        setError(t("views.pages.study_detail.error-loading"));
      } finally {
        setLoading(false);
      }
    };

    fetchCollectionDetail();
  }, [id, t]);

  useEffect(() => {
    if (!collection) return;

    const fetchFlashcards = async () => {
      try {
        const res = await getFlashcardsByCollection(id, {
          per_page: itemsPerPage,
          page: currentPage,
        });

        setFlashcards(res.data);
        // console.log("detail fc", flashcards);
        setTotalFlashcards(res.total);
      } catch (err) {
        console.error("Lỗi API flashcards:", err);
        setError(t("views.pages.study_detail.error-loading"));
      }
    };

    fetchFlashcards();
  }, [collection, currentPage, itemsPerPage, id, t]);

  if (loading) return <LoadingPage />;
  if (error) return <div>{error}</div>;
  if (!collection) {
    return <div>{t("views.pages.study_detail.no-collection-data")}</div>; // Kiểm tra nếu không tìm thấy collection
  }

  // Hàm xử lý cập nhật collection
  const handleUpdateCollection = (updatedCollection) => {
    setCollection((prevCollection) => ({
      ...prevCollection,
      ...updatedCollection,
    }));
  };

  // Hàm xử lý cập nhật flashcard
  const handleUpdatedFlashcard = (updatedCard) => {
    setFlashcards((prev) =>
      prev.map((card) => (card.id === updatedCard.id ? updatedCard : card))
    );
  };

  // Hàm xử lý xóa flashcard
  const handleDeletedFlashcard = (deletedId) => {
    setFlashcards((prev) => prev.filter((card) => card.id !== deletedId));
    setTotalFlashcards((prev) => prev - 1);
  };

  return (
    <div className="std-detail-container">
      {isPublic ? (
        <PublicSet
          collection={collection}
          isPublic={isPublic}
          isAuthor={isAuthor}
          onUpdate={handleUpdateCollection}
          isDetail={true}
        />
      ) : (
        <OwnSet
          collection={collection}
          isAuthor={isAuthor}
          onUpdate={handleUpdateCollection}
          isDetail={true}
        />
      )}

      <MemoFlash
        collection={collection}
        flashcards={collection.flashcards}
        total={totalFlashcards}
        languageFront={collection.language_front || ""}
      />

      <div className="std-detail-flashcards-title">
        {`${t(
          "views.pages.study_detail.flashcards-title"
        )} (${totalFlashcards}):`}
      </div>

      <MemoCard
        flashcards={flashcards}
        total={totalFlashcards}
        languageFront={collection.language_front || ""}
        isAuthor={isAuthor}
        onUpdated={handleUpdatedFlashcard}
        onDeleted={handleDeletedFlashcard}
      />

      <Pagination
        current={currentPage}
        pageSize={itemsPerPage}
        total={totalFlashcards}
        onChange={(page) => setCurrentPage(page)}
        onShowSizeChange={(current, size) => {
          setItemsPerPage(size);
          setCurrentPage(1);
          localStorage.setItem(LOCAL_STORAGE_KEYS.MEMO_ITEMS_PER_PAGE, size);
        }}
        showSizeChanger
        pageSizeOptions={["5", "10", "15", "20"]}
        style={{ marginTop: 24, textAlign: "center" }}
      />
    </div>
  );
}

export default StudyDetail;
