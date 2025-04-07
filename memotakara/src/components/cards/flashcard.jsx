import "./flashcard.css";
import { useState } from "react";
import { Card, Button } from "antd";
import LoadingPage from "@/views/error-pages/LoadingPage";
import MemoSpeaker from "@/components/speaker";

const MemoFlash = ({ flashcards, collectionTag }) => {
  const [currentIndex, setCurrentIndex] = useState(0); // Quản lý thẻ hiện tại
  const [flipped, setFlipped] = useState(false); // Trạng thái lật thẻ

  if (!flashcards) return <LoadingPage />;
  if (flashcards.length === 0) return <div>Không có flashcards nào.</div>;

  const mapTagToLang = (tag) => {
    if (!tag || typeof tag !== "string") return "en";
    const normalizedTag = tag.toLowerCase();
    if (["english", "tiếng anh"].includes(normalizedTag)) return "en";
    if (["japanese", "tiếng nhật"].includes(normalizedTag)) return "ja";
    if (["chinese", "tiếng trung"].includes(normalizedTag)) return "zh";
    return "en";
  };

  // Hàm để xử lý nút "Nhớ" hoặc "Quên"
  const handleRemember = (status) => {
    const cardId = flashcards[currentIndex].id;
    console.log(`Thẻ ${cardId} được đánh dấu là: ${status}`);
    // Gọi đến API ở backend để cập nhật trạng thái
    // fetch('/api/update-card-status', {
    //   method: 'POST',
    //   body: JSON.stringify({ cardId, status }),
    //   headers: { 'Content-Type': 'application/json' }
    // });
    // Chuyển sang thẻ tiếp theo
    setFlipped(false); // Đặt lại trạng thái lật
    setCurrentIndex((prevIndex) => (prevIndex + 1) % flashcards.length); // Thay đổi thẻ
  };

  const card = flashcards[currentIndex];

  return (
    <div className="memo-flash-container">
      <Card className="memo-flash-card" onClick={() => setFlipped(!flipped)}>
        <div className={`memo-flash-inner ${flipped ? "flipped" : ""}`}>
          <div
            className="memo-flash-front"
            style={{
              borderRadius: "10px",
              border: "3px solid var(--color-stroke)",
            }}
          >
            <div className="memo-flash-icon">
              <MemoSpeaker
                text={card.front}
                lang={mapTagToLang(collectionTag)}
              />
            </div>
            <div
              className="memo-flash-front-content"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                flex: 1,
                width: "100%",
                height: "100%",
                fontSize: "var(--body-size-bigger)",
                padding: "40px",
                cursor: "pointer",
              }}
            >
              {card.front}
            </div>
          </div>
          <div
            className="memo-flash-back"
            style={{
              borderRadius: "10px",
              border: "3px solid var(--color-stroke)",
            }}
          >
            <div
              className="memo-flash-back-content"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                width: "100%",
                height: "100%",
                fontSize: "var(--body-size-bigger)",
                padding: "40px",
                cursor: "pointer",
              }}
            >
              {card.pronunciation}
              <br />
              <br />
              {card.back}
              <br />
              <br />
              {card.kanji ? card.kanji : null}{" "}
              {/* Hiển thị kanji nếu có, ngược lại không hiển thị gì */}
            </div>
          </div>
        </div>
      </Card>

      <div className="memo-flash-status">
        <Button onClick={() => handleRemember("forgotten")}>Quên</Button>
        {`${currentIndex + 1}/${flashcards.length}`}
        <Button onClick={() => handleRemember("remembered")}>Nhớ</Button>
      </div>
    </div>
  );
};

export default MemoFlash;
