import axiosClient from "@/axiosClient";

// Gọi khi user xem chi tiết 1 collection
export const postRecentCollection = async (collectionId) => {
  try {
    const res = await axiosClient.post("/recent-collections", {
      collection_id: collectionId,
    });
    return res.data;
  } catch (error) {
    console.error("Lỗi khi lưu lịch sử truy cập:", error);
  }
};

// Gọi để lấy danh sách collection đã xem gần đây
export const getRecentCollections = async () => {
  try {
    const res = await axiosClient.get(`/recent-collections`);
    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy recent list collection:", error);
  }
};
