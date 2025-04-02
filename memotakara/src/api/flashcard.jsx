import axiosClient from "@/axiosClient";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Lấy danh sách flashcards theo collection_id
 * @param {number} collectionId
 * @returns {Promise} Danh sách flashcards
 */
export const getFlashcardsByCollection = async (collectionId) => {
  try {
    const response = await axiosClient.get(
      `${API_BASE_URL}/collection-flashcard/${collectionId}`
    );
    return response.data;
  } catch (error) {
    throw new Error("Không thể tải flashcard.");
  }
};
