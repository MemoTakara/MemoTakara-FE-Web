import "./index.css";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { getFlashcardsByCollection } from "@/api/flashcard"; // Giữ nguyên để lấy flashcards
import LoadingPage from "@/views/error-pages/LoadingPage";
import MemoSpeaker from "@/components/speaker";

const MemoCard = ({ collectionId, collectionTag, isPublic }) => {
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!collectionId) return; // Chỉ chạy nếu có collectionId
    const fetchData = async () => {
      try {
        setLoading(true);

        // Lấy danh sách flashcards của collection
        const flashcardData = await getFlashcardsByCollection(collectionId);
        setFlashcards(flashcardData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [collectionId]);

  if (loading) return <LoadingPage />;
  if (error) return <div>{error}</div>;

  const mapTagToLang = (tag) => {
    if (!tag || typeof tag !== "string") return "en"; // Kiểm tra undefined/null hoặc không phải string
    const normalizedTag = tag.toLowerCase(); // Chuyển tag về chữ thường để dễ so sánh
    if (["english", "tiếng anh"].includes(normalizedTag)) return "en";
    if (["japanese", "tiếng nhật"].includes(normalizedTag)) return "ja";
    if (["chinese", "tiếng trung"].includes(normalizedTag)) return "zh";
    return "en"; // Mặc định là tiếng Anh nếu không xác định được
  };

  return (
    <div>
      {flashcards.map((card) => (
        <div key={card.id} className="memo-card-container">
          <div className="memo-card-left">{card.front}</div>

          <div className="memo-card-right">
            <div className="memo-card-back">
              {card.pronunciation}
              <br />
              <br />
              {card.back}
              <br />
              <br />
              {card.kanji ? card.kanji : null}{" "}
              {/* Hiển thị kanji nếu có, ngược lại không hiển thị gì */}
            </div>

            <div className="memo-card-icon">
              {/* Truyền mã ngôn ngữ được chuyển đổi từ tag */}
              <MemoSpeaker
                text={card.front}
                lang={mapTagToLang(collectionTag)}
              />

              {!isPublic && ( // Ẩn nút xóa nếu collection là public
                <div className="memo-card-link">
                  <FontAwesomeIcon
                    icon={faTrashCan}
                    style={{
                      fontSize: "var(--body-size)",
                      color: "var(--color-error-button)",
                      marginLeft: "5px",
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MemoCard;
