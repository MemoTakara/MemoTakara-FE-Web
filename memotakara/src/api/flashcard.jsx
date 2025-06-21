import axiosClient from "@/axiosClient";

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
