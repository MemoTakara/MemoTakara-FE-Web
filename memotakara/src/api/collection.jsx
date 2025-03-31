import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Hàm lấy danh sách public collection
export const getPublicCollections = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/public-collections`);
    return response.data; // Trả về danh sách collections
  } catch (error) {
    console.error("Lỗi khi lấy danh sách public collections:", error);
    return [];
  }
};

// Hàm lấy danh sách collection user sở hữu
export const getOwnCollections = async () => {
  const response = await axios.get(`${API_BASE_URL}/collections`);
  return response.data;
};

// Hàm tìm kiếm public collection theo tên, tag, tác giả
export const searchItems = async (query) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/search-public?query=${query}`
    );
    return response.data; // Trả về kết quả tìm kiếm
  } catch (error) {
    console.error("Lỗi khi tìm kiếm:", error);
    return [];
  }
};
