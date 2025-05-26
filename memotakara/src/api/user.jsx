import axiosClient from "@/axiosClient";

// Hàm yêu cầu gửi email reset mật khẩu
export const forgotPassword = async (email) => {
  try {
    const response = await axiosClient.post("/forgot-password", {
      email: email,
    });
    return response.data; // Trả về dữ liệu thành công
  } catch (error) {
    throw error.response?.data; // Ném lỗi đã xảy ra
  }
};

// Hàm yêu cầu đặt lại mật khẩu
export const resetPassword = async (token, email, newPassword) => {
  try {
    const response = await axiosClient.post("/reset-password", {
      token: token,
      email: email,
      password: newPassword,
      password_confirmation: newPassword, // Xác nhận mật khẩu như mật khẩu mới
    });
    return response.data; // Trả về dữ liệu thành công
  } catch (error) {
    throw error.response?.data; // Ném lỗi đã xảy ra
  }
};
