// src/api/flashcardApi.js

import axiosClient from "@/axiosClient";

/**
 * Gửi kết quả review flashcard theo thuật toán SM-2
 * @param {object} params
 * @param {number} params.flashcard_id
 * @param {'again'|'hard'|'good'|'easy'} params.quality
 */
export const reviewFlashcard = async ({ flashcard_id, quality }) => {
  try {
    const response = await axiosClient.post("/review", {
      flashcard_id,
      quality,
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi review flashcard:", error.response || error);
    throw error;
  }
};

/**
 * Lấy tiến độ học hiện tại của user với collectionId
 * @param {number|string} collectionId
 */
export const getCollectionProgress = async (collectionId) => {
  try {
    const response = await axiosClient.get(`/progress-summary/${collectionId}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy tiến độ:", error.response || error);
    throw error;
  }
};
