import axiosClient from "@/axiosClient";

// Hàm yêu cầu đổi mật khẩu
export const changePassword = async (oldPassword, newPassword) => {
  try {
    const response = await axiosClient.post("users/change-password", {
      old_password: oldPassword,
      new_password: newPassword,
      new_password_confirmation: newPassword, // Xác nhận mật khẩu như mật khẩu mới
    });
    return response.data; // Trả về dữ liệu thành công
  } catch (error) {
    throw error.response?.data; // Ném lỗi đã xảy ra
  }
};

// Lấy danh sách all user
export const getUsers = async () => {
  try {
    const response = await axiosClient.get("/admins/users");
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách người dùng:", error.response || error);
    throw error;
  }
};

// Tạo mới user
export const createUser = async (userData) => {
  try {
    const response = await axiosClient.post(`/admins/users`, userData);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tạo người dùng:", error.response || error);
    throw error;
  }
};

// Mở, khóa tài khoản
export const toggleUserStatus = async (userId) => {
  try {
    const response = await axiosClient.post(
      `/admins/users/${userId}/toggle-lock`
    );
    return response.data;
  } catch (error) {
    console.error(
      "Lỗi khi thay đổi trạng thái người dùng:",
      error.response || error
    );
    throw error;
  }
};

// Xóa người dùng
export const deleteUser = async (userId) => {
  try {
    const response = await axiosClient.delete(`/admins/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xóa người dùng:", error.response || error);
    throw error;
  }
};

// Lấy list all collection
export const getCollections = async () => {
  try {
    const response = await axiosClient.get("/admins/collections");
    return response.data;
  } catch (error) {
    console.error(
      "Lỗi khi lấy danh sách collections:",
      error.response || error
    );
    throw error;
  }
};

// Tạo collection
export const createCollection = async (collectionData) => {
  try {
    const response = await axiosClient.post(
      "/admins/collections",
      collectionData
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tạo collection:", error.response || error);
    throw error;
  }
};

// Update collection
export const updateCollection = async (collectionId, collectionData) => {
  try {
    const response = await axiosClient.put(
      `/admins/collections/${collectionId}`,
      collectionData
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật collection:", error.response || error);
    throw error;
  }
};

// Delete collection
export const deleteCollection = async (collectionId) => {
  try {
    const response = await axiosClient.delete(
      `/admins/collections/${collectionId}`
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xóa collection:", error.response || error);
    throw error;
  }
};

// Lấy danh sách flashcard của toàn hệ thống
export const getAllFlashcards = async (collectionId) => {
  try {
    const response = await axiosClient.get("/admins/flashcards");
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách flashcards:", error.response || error);
    throw error;
  }
};

// Lấy danh sách flashcard của collection
export const getFlashcards = async (collectionId) => {
  try {
    const response = await axiosClient.get(
      `/admins/collections/${collectionId}/flashcards`
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách flashcards:", error.response || error);
    throw error;
  }
};

// Tạo flashcard
export const addFlashcard = async (collectionId, formData) => {
  try {
    const response = await axiosClient.post(
      `/admins/collections/${collectionId}/flashcards`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm flashcard:", error.response || error);
    throw error;
  }
};

// Update flashcard
export const updateFlashcard = async (flashcardId, formData) => {
  try {
    // Laravel không hỗ trợ PUT với FormData trực tiếp, nên cần dùng POST + _method
    formData.append("_method", "PUT");

    const response = await axiosClient.post(
      `/admins/flashcards/${flashcardId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật flashcard:", error.response || error);
    throw error;
  }
};

// Delete flashcard
export const deleteFlashcard = async (flashcardId) => {
  try {
    const response = await axiosClient.delete(
      `/admins/flashcards/${flashcardId}`
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xóa flashcard:", error.response || error);
    throw error;
  }
};
