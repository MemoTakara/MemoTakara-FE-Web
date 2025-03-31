import { useState, useEffect } from "react";
import {
  getFlashcards,
  addFlashcard,
  updateFlashcard,
  deleteFlashcard,
} from "@/api/admin";

const FlashcardManagement = () => {
  const [words, setWords] = useState([]);

  useEffect(() => {
    fetchWords();
  }, []);

  const fetchWords = async () => {
    const data = await getWords();
    setWords(data);
  };

  const handleDelete = async (id) => {
    await deleteWord(id);
    fetchWords();
  };

  return (
    <div>
      <h2>Quản lý từ vựng</h2>
      <ul>
        {words.map((word) => (
          <li key={word.id}>
            {word.text}
            <button onClick={() => handleDelete(word.id)}>Xóa</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FlashcardManagement;
