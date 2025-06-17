import axiosClient from "@/axiosClient";

/**
 * Gửi kết quả review flashcard theo thuật toán SM-2
 * @param {object} params
 * @param {number} params.flashcard_id
 * @param {'again'|'hard'|'good'|'easy'} params.quality
 */

// Học bằng flashcard (review theo SM-2)
// export const reviewFlashcard = async ({
//   flashcard_id,
//   quality,
//   response_time_ms = null,
//   study_mode = "flashcard", // default giống backend
// }) => {
//   try {
//     const response = await axiosClient.post("/fc-review", {
//       flashcard_id,
//       quality,
//       response_time_ms,
//       study_mode,
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Lỗi khi review flashcard:", error.response || error);
//     throw error;
//   }
// };

// Lấy due flashcard của 1 collection
// export const getDueFlashcards = async (collectionId) => {
//   try {
//     const res = await axiosClient.get(`/fc-review/due/${collectionId}`);
//     return res.data.flashcards;
//   } catch (error) {
//     console.error("Lỗi khi lấy flashcards đến hạn:", error);
//     return [];
//   }
// };

// Lấy tiến độ học của user với 1 collection
export const getCollectionProgress = async (collectionId) => {
  try {
    const response = await axiosClient.get(
      `/fc-review/progress-summary/${collectionId}`
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy tiến độ:", error.response || error);
    throw error;
  }
};
