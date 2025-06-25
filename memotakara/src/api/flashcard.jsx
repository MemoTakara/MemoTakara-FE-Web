import axiosClient from "@/axiosClient";

// Lấy danh sách flashcard trong một collection
export const getFlashcardsByCollection = async (collectionId, params = {}) => {
  try {
    const response = await axiosClient.get(
      `/flashcards/collection/${collectionId}`,
      { params }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching flashcards:", error);
    throw error;
  }
};

// Lấy thông tin chi tiết của một flashcard
export const getFlashcardDetail = async (id) => {
  try {
    const response = await axiosClient.get(`/flashcards/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching flashcard detail:", error);
    throw error;
  }
};

// Tạo một flashcard mới
export const createFlashcard = async (data) => {
  try {
    const response = await axiosClient.post("/flashcards", data);
    return response.data;
  } catch (error) {
    console.error("Error creating flashcard:", error);
    throw error;
  }
};

// Cập nhật một flashcard
export const updateFlashcard = async (id, data) => {
  try {
    const response = await axiosClient.put(`/flashcards/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating flashcard:", error);
    throw error;
  }
};

// Xóa một flashcard
export const deleteFlashcard = async (id) => {
  try {
    const response = await axiosClient.delete(`/flashcards/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting flashcard:", error);
    throw error;
  }
};

// Tạo flashcard hàng loạt
export const bulkCreateFlashcards = async (data) => {
  try {
    const response = await axiosClient.post("/flashcards/bulk", data);
    return response.data;
  } catch (error) {
    console.error("Error bulk creating flashcards:", error);
    throw error;
  }
};

// Đánh dấu hoặc bỏ đánh dấu flashcard khó
export const toggleFlashcardLeech = async (id, studyMode) => {
  try {
    const response = await axiosClient.post(`/flashcards/${id}/toggle-leech`, {
      study_mode: studyMode,
    });
    return response.data;
  } catch (error) {
    console.error("Error toggling flashcard leech status:", error);
    throw error;
  }
};
