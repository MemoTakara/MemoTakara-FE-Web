import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Lấy danh sách flashcards theo collection_id
 * @param {number} collectionId
 * @returns {Promise} Danh sách flashcards
 */
export const getFlashcardsByCollection = async (collectionId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/collection-flashcard/${collectionId}`
    );
    return response.data;
  } catch (error) {
    throw new Error("Không thể tải flashcard.");
  }
};
