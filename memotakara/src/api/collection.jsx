import axiosClient from "@/axiosClient";

// Hàm lấy danh sách public collection
export const getPublicCollections = async () => {
  try {
    const response = await axiosClient.get("/public-collections");
    return response.data; // Trả về danh sách collections
  } catch (error) {
    console.error("Lỗi khi lấy danh sách public collections:", error);
    return [];
  }
};

// Hàm lấy chi tiết của một public collection theo ID
export const getPublicCollectionDetail = async (id) => {
  try {
    const response = await axiosClient.get(`/public-collections/${id}`);
    return response.data; // Trả về chi tiết của collection
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết public collection:", error);
    return null; // Hoặc bạn có thể trả giá trị khác nếu cần
  }
};

// Lấy danh sách các collection công khai của 1 người dùng xác định
export const getPublicCollectionsByUser = async (userId) => {
  try {
    const response = await axiosClient.get(`/collections/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching public collections:", error);
    throw error;
  }
};

// Lấy chi tiết 1 collection theo ID
export const getCollectionById = async (id) => {
  try {
    const response = await axiosClient.get(`/collections/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching collection detail:", error);
    throw error; // Đẩy lỗi lên để xử lý ở nơi gọi
  }
};

// Hàm lấy danh sách collection user sở hữu
export const getOwnCollections = async () => {
  const response = await axiosClient.get("/collections");
  return response.data;
};

// Hàm tạo mới collection
export const createCollection = async (data) => {
  try {
    const response = await axiosClient.post("/collections", data);
    return response.data;
  } catch (err) {
    throw new Error("Error creating collection");
  }
};

// Hàm update thông tin của collection
export const updateCollection = async (collectionId, collectionData) => {
  try {
    const response = await axiosClient.put(
      `/collections/${collectionId}`,
      collectionData
    );
    return response.data;
  } catch (err) {
    throw new Error("Error updating collection");
  }
};

// Xóa collection theo ID
export const deleteCollection = async (id) => {
  const response = await axiosClient.delete(`/collections/${id}`);
  return response.data;
};

// Hàm tìm kiếm public collection theo tên, tag, tác giả
export const searchItems = async (query) => {
  try {
    const response = await axiosClient.get(`/search-public?query=${query}`);
    return response.data; // Trả về kết quả tìm kiếm
  } catch (error) {
    console.error("Lỗi khi tìm kiếm:", error);
    return [];
  }
};

// Duplicate collection
export const duplicateCollection = async (collectionId) => {
  try {
    const response = await axiosClient.post(
      `/collections/${collectionId}/duplicate`
    );
    return {
      success: true,
      message: response.data.message,
      newCollectionId: response.data.new_collection_id,
    };
  } catch (error) {
    console.error("Error duplicating collection:", error);
    return {
      success: false,
      message: error.response?.data?.error || "Failed to duplicate collection",
    };
  }
};
