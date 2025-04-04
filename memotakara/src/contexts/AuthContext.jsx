import { createContext, useState, useEffect, useContext } from "react";
import axiosClient from "@/axiosClient";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    localStorage.getItem("ACCESS_TOKEN") || null
  );

  // Cập nhật token vào localStorage
  const updateToken = (newToken) => {
    setToken(newToken);
    if (newToken) {
      localStorage.setItem("ACCESS_TOKEN", newToken);
    } else {
      localStorage.removeItem("ACCESS_TOKEN");
    }
  };

  // Kiểm tra nếu có token thì lấy thông tin user
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;

      try {
        const response = await axiosClient.get("/users");
        setUser(response.data);
      } catch (error) {
        if (error.response?.status === 401) {
          updateToken(null);
        } else {
          console.error("Lỗi khác:", error);
        }
      }
    };

    fetchUser();
  }, [token]);

  // Đăng nhập (Gửi request đến backend)
  const login = async (email, password) => {
    try {
      const response = await axiosClient.post("/login", {
        email,
        password,
      });

      updateToken(response.data.token);
      setUser(response.data.user); // Lưu thông tin user từ backend, Backend phải trả về { user, role }
      return response.data; // Trả về dữ liệu nếu login thành công
    } catch (error) {
      console.error(
        "Login failed:",
        error.response?.data?.message || error.message
      );
      // Ném lỗi để `handleLogin()` có thể xử lý đúng
      throw error;
    }
  };

  // Đăng ký (Gửi request đến backend)
  const register = async (username, email, password, password_confirmation) => {
    try {
      const response = await axiosClient.post("/register", {
        username,
        email,
        password,
        password_confirmation,
      });
      updateToken(response.data.token);
      setUser(response.data.user);
    } catch (error) {
      console.error(
        "Registration failed:",
        error.response?.data?.message || error.message
      );

      // Ném lỗi để handleRegister() xử lý
      throw error;
    }
  };

  // Đăng xuất
  const logout = async () => {
    if (!token) return; // Không làm gì nếu không có token

    try {
      await axiosClient.post("/logout", null, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error(
        "Logout failed:",
        error.response?.data?.message || error.message
      );
    }

    setUser(null);
    updateToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
