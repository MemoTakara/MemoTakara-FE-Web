import axiosClient from "@/axiosClient";

// Gửi thông báo
export const sendNotification = async (values) => {
  try {
    const response = await axiosClient.post("/notifications/send", values);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi gửi thông báo:", error.response || error);
    throw error;
  }
};

// Hàm lấy danh sách thông báo
export const getNotifications = async () => {
  try {
    const response = await axiosClient.get("/notifications");
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách thông báo:", error.response || error);
    throw error;
  }
};
