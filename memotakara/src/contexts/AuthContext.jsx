import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios"; // Dùng axios để gọi API

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    localStorage.getItem("ACCESS_TOKEN") || null
  );

  // 🟢 Cập nhật token vào localStorage
  const updateToken = (newToken) => {
    setToken(newToken);
    if (newToken) {
      localStorage.setItem("ACCESS_TOKEN", newToken);
    } else {
      localStorage.removeItem("ACCESS_TOKEN");
    }
  };

  // 🟢 Kiểm tra nếu có token thì lấy thông tin user
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;

      // return;
      try {
        console.log("có token à: ", token);
        const response = await axios.get(`${API_BASE_URL}/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        if (error.response?.status === 401) {
          // 🔹 Chỉ xóa nếu lỗi 401 (Unauthorized)
          console.log("Unauthorized - Clearing token...");
          updateToken(null);
        } else {
          console.error("Lỗi khác:", error);
        }
      }
    };

    // if (token) {
    //   setTimeout(fetchUser, 100); // Đợi 100ms rồi gọi tránh lỗi render nhanh
    // }
    fetchUser();
  }, [token, `$API_BASE_URL`]);

  // 🟢 Đăng nhập (Gửi request đến backend)
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        email,
        password,
      });

      updateToken(response.data.token);
      setUser(response.data.user); // Lưu thông tin user từ backend, 🔵 Backend phải trả về { user, role }
    } catch (error) {
      console.error(
        "Login failed:",
        error.response?.data?.message || error.message
      );
    }
  };

  // 🔵 Đăng ký (Gửi request đến backend)
  const register = async (username, email, password, password_confirmation) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/register`, {
        username,
        email,
        password,
        password_confirmation,
      });

      // if (response.data.token) {
      //   updateToken(response.data.token);
      //   setTimeout(() => setUser(response.data.user), 100); // Trì hoãn để tránh lỗi re-render
      // }
      updateToken(response.data.token); // Cập nhật token vào localStorage
      setUser(response.data.user); // Nhận dữ liệu user từ backend
    } catch (error) {
      console.error(
        "Registration failed:",
        error.response?.data?.message || error.message
      );
    }
  };

  // 🔴 Đăng xuất
  const logout = async () => {
    if (!token) return; // Không làm gì nếu không có token

    try {
      await axios.post(`${API_BASE_URL}/logout`, null, {
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
