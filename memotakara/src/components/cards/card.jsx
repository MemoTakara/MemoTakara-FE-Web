import "./card.css";
import { useTranslation } from "react-i18next";

import LoadingPage from "@/views/error-pages/LoadingPage";
import FlashcardDropdown from "@/components/flashcard-modal/flashcard-menu";
import MemoSpeaker from "@/components/widget/speaker";

const MemoCard = ({
  flashcards,
  total,
  languageFront,
  isAuthor,
  onUpdated,
  onDeleted,
}) => {
  const { t } = useTranslation();

  if (!flashcards) return <LoadingPage />;
  if (total === 0) return <div>{t("components.cards.no-fc")}</div>;

  return (
    <div>
      {flashcards.map((card) => (
        <div key={card.id} className="memo-card-container">
          <div className="memo-card-left">
            <div>{card.front}</div>
            <MemoSpeaker text={card.front} lang={languageFront} />
          </div>

          <div className="memo-card-right">
            <div className="memo-card-back">
              {card.pronunciation}
              <br />
              <br />
              {card.back}
              <br />
              <br />
              {card.kanji || null}
            </div>

            <div className="memo-card-icon">
              <FlashcardDropdown
                isAuthor={isAuthor}
                initialData={card}
                onUpdated={onUpdated}
                onDeleted={() => onDeleted(card.id)}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MemoCard;
