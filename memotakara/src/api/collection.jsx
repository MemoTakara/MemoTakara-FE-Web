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

// Lấy danh sách các collection công khai của 1 người dùng xác định
export const getPublicCollectionsByUser = async (userId) => {
  try {
    const response = await fetch("/collections/user/${userId}");
    if (!response.ok) {
      throw new Error("Error fetching public collections");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching public collections:", error);
    throw error; // Đẩy lỗi lên để xử lý ở nơi gọi
  }
};

// Hàm lấy danh sách collection user sở hữu
export const getOwnCollections = async () => {
  const response = await axiosClient.get("/collections");
  return response.data;
};

// Hàm tìm kiếm public collection theo tên, tag, tác giả
export const searchItems = async (query) => {
  try {
    const response = await axiosClient.get("/search-public?query=${query}");
    return response.data; // Trả về kết quả tìm kiếm
  } catch (error) {
    console.error("Lỗi khi tìm kiếm:", error);
    return [];
  }
};
