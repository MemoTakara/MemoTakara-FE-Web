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

// Hàm cập nhật thông tin người dùng
export const updateAccount = async ({ name, username, email }) => {
  try {
    const response = await axiosClient.post("/users/updateAccount", {
      name,
      username,
      email,
    });
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Đã xảy ra lỗi không xác định.",
      }
    );
  }
};

// Unlink Google account
export const unlinkGoogleAccount = async () => {
  try {
    const response = await axiosClient.post("/auth/google/unlink");
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Không thể hủy liên kết tài khoản Google.",
      }
    );
  }
};
