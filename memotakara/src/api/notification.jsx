import axiosClient from "@/axiosClient";

// Gửi thông báo
// export const sendNotification = async (values) => {
//   try {
//     const response = await axiosClient.post(
//       "/admins/notifications/send",
//       values
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Lỗi khi gửi thông báo:", error.response || error);
//     throw error;
//   }
// };

// Hàm lấy danh sách thông báo
// export const getNotifications = async () => {
//   try {
//     const response = await axiosClient.get("/admins/notifications");
//     return response.data;
//   } catch (error) {
//     console.error("Lỗi khi lấy danh sách thông báo:", error.response || error);
//     throw error;
//   }
// };

// Lấy danh sách thông báo của người dùng đã xác thực
export const getNotifications = async (params = {}) => {
  try {
    const response = await axiosClient.get(`/notification`, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

// Lấy số lượng thông báo chưa đọc
export const getUnreadNotificationCount = async () => {
  try {
    const response = await axiosClient.get(`/notification/unread-count`);
    return response.data;
  } catch (error) {
    console.error("Error fetching unread notification count:", error);
    throw error;
  }
};

// Lấy các thông báo gần đây (50 thông báo mới nhất)
export const getRecentNotifications = async () => {
  try {
    const response = await axiosClient.get(`/notification/recent`);
    return response.data;
  } catch (error) {
    console.error("Error fetching recent notifications:", error);
    throw error;
  }
};

// Đánh dấu một thông báo là đã đọc
export const markNotificationAsRead = async (id) => {
  try {
    const response = await axiosClient.post(`/notification/${id}/mark-read`);
    return response.data;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};

// Đánh dấu nhiều thông báo là đã đọc
export const markMultipleNotificationsAsRead = async (notificationIds) => {
  try {
    const response = await axiosClient.post(
      `/notification/mark-read-multiple`,
      { notification_ids: notificationIds }
    );
    return response.data;
  } catch (error) {
    console.error("Error marking multiple notifications as read:", error);
    throw error;
  }
};

// Đánh dấu tất cả thông báo là đã đọc
export const markAllNotificationsAsRead = async () => {
  try {
    const response = await axiosClient.post(`/notification/mark-all-read`);
    return response.data;
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    throw error;
  }
};

// Xóa một thông báo
export const deleteNotification = async (id) => {
  try {
    const response = await axiosClient.delete(`/notification/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting notification:", error);
    throw error;
  }
};

// Xóa nhiều thông báo
export const deleteMultipleNotifications = async (notificationIds) => {
  try {
    const response = await axiosClient.delete(`/notification/delete-multiple`, {
      data: { notification_ids: notificationIds },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting multiple notifications:", error);
    throw error;
  }
};

// Xóa tất cả thông báo đã đọc
export const deleteAllReadNotifications = async () => {
  try {
    const response = await axiosClient.delete(`/notification/delete-all-read`);
    return response.data;
  } catch (error) {
    console.error("Error deleting all read notifications:", error);
    throw error;
  }
};

// Lấy thống kê thông báo
export const getNotificationStatistics = async () => {
  try {
    const response = await axiosClient.get(`/notification/statistics`);
    return response.data;
  } catch (error) {
    console.error("Error fetching notification statistics:", error);
    throw error;
  }
};

// Gửi thông báo (chỉ admin)
export const sendNotification = async (data) => {
  try {
    const response = await axiosClient.post(`/notification/send`, data);
    return response.data;
  } catch (error) {
    console.error("Error sending notification:", error);
    throw error;
  }
};

// Gửi thông báo hàng loạt (chỉ admin)
export const sendBulkNotifications = async (data) => {
  try {
    const response = await axiosClient.post(`/notification/send-bulk`, data);
    return response.data;
  } catch (error) {
    console.error("Error sending bulk notifications:", error);
    throw error;
  }
};

// Lấy chi tiết một thông báo
export const getNotificationDetail = async (id) => {
  try {
    const response = await axiosClient.get(`/notification/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching notification detail:", error);
    throw error;
  }
};
