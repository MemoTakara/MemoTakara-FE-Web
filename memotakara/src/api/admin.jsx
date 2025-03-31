import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Lấy danh sách all user
export const getUsers = async () => {
  try {
    const response = await API.get(`${API_BASE_URL}/admins/users`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách người dùng:", error);
    throw error;
  }
};

// Mở, khóa tài khoản
export const toggleUserStatus = async (userId) => {
  try {
    const response = await API.post(
      `${API_BASE_URL}/admins/users/${userId}/toggle-lock`
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thay đổi trạng thái người dùng:", error);
    throw error;
  }
};

// Xóa người dùng
export const deleteUser = async (userId) => {
  try {
    const response = await API.delete(`${API_BASE_URL}/admins/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xóa người dùng:", error);
    throw error;
  }
};

// Gửi thông báo
export const sendNotification = async (userId, message) => {
  try {
    const response = await API.post(`${API_BASE_URL}/admins/notifications`, {
      user_id: userId,
      message,
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi gửi thông báo:", error);
    throw error;
  }
};

// Lấy list all collection
export const getCollections = async () => {
  try {
    const response = await API.get(`${API_BASE_URL}/admins/collections`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách collections:", error);
    throw error;
  }
};

// Tạo collection
export const createCollection = async (collectionData) => {
  try {
    const response = await API.post(
      `${API_BASE_URL}/admins/collections`,
      collectionData
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tạo collection:", error);
    throw error;
  }
};

// Update collection
export const updateCollection = async (collectionId, collectionData) => {
  try {
    const response = await API.put(
      `${API_BASE_URL}/admins/collections/${collectionId}`,
      collectionData
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật collection:", error);
    throw error;
  }
};

// Delete collection
export const deleteCollection = async (collectionId) => {
  try {
    const response = await API.delete(
      `${API_BASE_URL}/admins/collections/${collectionId}`
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xóa collection:", error);
    throw error;
  }
};

// Lấy danh sách flashcard của collection
export const getFlashcards = async (collectionId) => {
  try {
    const response = await API.get(
      `${API_BASE_URL}/admins/collections/${collectionId}/flashcards`
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách flashcards:", error);
    throw error;
  }
};

// Tạo flashcard
export const addFlashcard = async (collectionId, flashcardData) => {
  try {
    const response = await API.post(
      `${API_BASE_URL}/admins/collections/${collectionId}/flashcards`,
      flashcardData
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm flashcard:", error);
    throw error;
  }
};

// Update flashcard
export const updateFlashcard = async (flashcardId, flashcardData) => {
  try {
    const response = await API.put(
      `${API_BASE_URL}/admins/flashcards/${flashcardId}`,
      flashcardData
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật flashcard:", error);
    throw error;
  }
};

// Delete flashcard
export const deleteFlashcard = async (flashcardId) => {
  try {
    const response = await API.delete(
      `${API_BASE_URL}/admins/flashcards/${flashcardId}`
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xóa flashcard:", error);
    throw error;
  }
};
