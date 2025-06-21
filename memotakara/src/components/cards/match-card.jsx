import { useState, useRef, useEffect } from "react";

import "./match-card.css";
import BtnBlue from "@/components/btn/btn-blue";

const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);

function MatchingCard({ flashcards, onSubmitResult, onRetry, matchResults }) {
  const [leftList, setLeftList] = useState(
    flashcards.map((card) => ({ id: card.id, text: card.front }))
  );
  const [rightList, setRightList] = useState(
    shuffle(flashcards.map((card) => ({ id: card.id, text: card.back })))
  );
  const [matches, setMatches] = useState([]);
  const [selected, setSelected] = useState({ left: null, right: null });
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState([]);

  const containerRef = useRef(null);
  const leftRefs = useRef([]);
  const rightRefs = useRef([]);

  useEffect(() => {
    leftRefs.current = leftRefs.current.slice(0, leftList.length);
    rightRefs.current = rightRefs.current.slice(0, rightList.length);
  }, [leftList, rightList]);

  useEffect(() => {
    // Cập nhật leftList và rightList khi flashcards thay đổi (session mới)
    setLeftList(flashcards.map((card) => ({ id: card.id, text: card.front })));
    setRightList(
      shuffle(flashcards.map((card) => ({ id: card.id, text: card.back })))
    );
    setMatches([]);
    setSelected({ left: null, right: null });
    setSubmitted(false);
    setResults([]);
  }, [flashcards]);

  useEffect(() => {
    // Cập nhật results khi matchResults từ API được truyền vào
    if (matchResults && matchResults.results) {
      const enrichedResults = matchResults.results.map((result) => {
        const card = flashcards.find((fc) => fc.id === result.flashcard_id);
        return {
          ...result,
          frontText: card ? card.front : "Không tìm thấy thẻ",
        };
      });
      setResults(enrichedResults);
      setSubmitted(true);
    }
  }, [matchResults, flashcards]);

  const handleLeftClick = (leftItem) => {
    if (submitted) return;
    if (selected.right !== null) {
      const newMatches = matches.filter(
        (m) => m.left !== leftItem.id && m.right !== selected.right
      );
      newMatches.push({ left: leftItem.id, right: selected.right });
      setMatches(newMatches);
      setSelected({ left: null, right: null });
    } else {
      setSelected((prev) => ({
        ...prev,
        left: prev.left === leftItem.id ? null : leftItem.id,
      }));
    }
  };

  const handleRightClick = (rightItem) => {
    if (submitted) return;
    if (selected.left !== null) {
      const newMatches = matches.filter(
        (m) => m.left !== selected.left && m.right !== rightItem.id
      );
      newMatches.push({ left: selected.left, right: rightItem.id });
      setMatches(newMatches);
      setSelected({ left: null, right: null });
    } else {
      setSelected((prev) => ({
        ...prev,
        right: prev.right === rightItem.id ? null : rightItem.id,
      }));
    }
  };

  const handleSubmit = () => {
    if (matches.length === 0) {
      alert("Vui lòng ghép ít nhất một cặp trước khi gửi!");
      return;
    }
    const submitData = matches.map((pair) => {
      const selectedRight = rightList.find((r) => r.id === pair.right);
      return {
        flashcard_id: pair.left,
        selected_answer: selectedRight.text ?? null,
      };
    });

    const hasInvalid = submitData.some(
      (item) => !item.flashcard_id || !item.selected_answer
    );
    if (hasInvalid) {
      alert("Vui lòng hoàn thành đầy đủ các cặp ghép trước khi gửi!");
      return;
    }

    onSubmitResult && onSubmitResult(submitData);
  };

  const handleRetryClick = () => {
    // Reset trạng thái nội bộ và gọi onRetry để tạo session mới
    setMatches([]);
    setSelected({ left: null, right: null });
    setSubmitted(false);
    setResults([]);
    onRetry && onRetry();
  };

  const getLineCoordinates = () => {
    if (!containerRef.current) return [];

    return matches
      .map((match) => {
        const leftEl = leftRefs.current.find(
          (ref) => ref?.dataset.id === String(match.left)
        );
        const rightEl = rightRefs.current.find(
          (ref) => ref?.dataset.id === String(match.right)
        );
        if (!leftEl || !rightEl) return null;

        const leftRect = leftEl.getBoundingClientRect();
        const rightRect = rightEl.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();

        return {
          x1: leftRect.right - containerRect.left,
          y1: leftRect.top + leftRect.height / 2 - containerRect.top,
          x2: rightRect.left - containerRect.left,
          y2: rightRect.top + rightRect.height / 2 - containerRect.top,
          correct: results.find((r) => r.flashcard_id === match.left)
            ?.is_correct,
        };
      })
      .filter(Boolean);
  };

  return (
    <div className="match-wrap">
      <div className="match-container" ref={containerRef}>
        <div className="column left">
          {leftList.map((item) => (
            <div
              key={item.id}
              data-id={item.id}
              ref={(el) => (leftRefs.current[item.id] = el)}
              className={`match-item ${
                selected.left === item.id ? "selected" : ""
              }`}
              onClick={() => handleLeftClick(item)}
            >
              {item.text}
            </div>
          ))}
        </div>

        <div className="column right">
          {rightList.map((item) => (
            <div
              key={item.id}
              data-id={item.id}
              ref={(el) => (rightRefs.current[item.id] = el)}
              className={`match-item ${
                selected.right === item.id ? "selected" : ""
              }`}
              onClick={() => handleRightClick(item)}
            >
              {item.text}
            </div>
          ))}
        </div>

        <svg className="match-lines">
          {getLineCoordinates().map((line, idx) => (
            <line
              key={idx}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke={submitted ? (line.correct ? "green" : "red") : "black"}
              strokeWidth="2"
            />
          ))}
        </svg>
      </div>

      <div style={{ width: "100%" }}>
        {!submitted ? (
          <div
            className="result-container result-header result-summary"
            style={{
              display: "flex",
              width: "100%",
              textAlign: "right",
              alignItems: "end",
            }}
          >
            <BtnBlue
              textKey="submit"
              onClick={handleSubmit}
              style={{ fontSize: "var(--normal-font-size)" }}
            />
          </div>
        ) : (
          <div className="result-container">
            <div className="result-header">
              <p className="result-summary">
                Kết quả: {results.filter((r) => r.is_correct).length} đúng /{" "}
                {results.length}
              </p>
              <BtnBlue
                textKey="retry"
                onClick={handleRetryClick}
                style={{ fontSize: "var(--normal-font-size)" }}
              />
            </div>
            {results.some((r) => !r.is_correct) && (
              <div className="incorrect-answers">
                <h3>Kết quả đúng cho các cặp sai:</h3>
                <ul>
                  {results
                    .filter((r) => !r.is_correct)
                    .map((r, idx) => (
                      <li key={idx}>
                        <span className="incorrect-pair">
                          {r.frontText} → {r.selected_answer}
                        </span>
                        <span className="correct-answer">
                          Đúng: {r.frontText} → {r.correct_answer}
                        </span>
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MatchingCard;
