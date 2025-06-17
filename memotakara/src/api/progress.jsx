import axiosClient from "@/axiosClient";

// Lấy streak học từ server
export const getStudyStreak = async () => {
  try {
    const response = await axiosClient.get("progress/streak");
    return response.data.streak;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Lấy dashboard tổng quan
export const getDashboard = async () => {
  try {
    const response = await axiosClient.get("progress/dashboard");
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Lấy tiến độ học của 1 collection
export const getCollectionProgress = async (collectionId) => {
  try {
    const response = await axiosClient.get(
      `progress/collection/${collectionId}`
    );
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Lấy thống kê học tập (analytics)
export const getAnalytics = async (days) => {
  try {
    const response = await axiosClient.get("progress/analytics", {
      params: { days },
    });
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Lấy dữ liệu heatmap
export const getStudyHeatmap = async (year = new Date().getFullYear()) => {
  try {
    const response = await axiosClient.get("progress/heatmap", {
      params: { year },
    });
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Lấy bảng xếp hạng
export const getLeaderboard = async ({ period = "week", limit = 10 } = {}) => {
  try {
    const response = await axiosClient.get("progress/leaderboard", {
      params: { period, limit },
    });
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
