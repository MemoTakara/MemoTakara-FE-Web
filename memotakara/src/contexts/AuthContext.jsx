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
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("ACCESS_TOKEN"));

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
      if (token) {
        try {
          const response = await axios.get("http://localhost:8000/api/user", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(response.data); // 🟢 User sẽ có thêm thuộc tính role từ backend
        } catch (error) {
          updateToken(null); // Xóa token nếu không hợp lệ
        }
      }
    };

    fetchUser();
  }, [token]);

  // 🟢 Đăng nhập (Gửi request đến backend)
  const login = async (username, password) => {
    try {
      const response = await axios.post("http://localhost:8000/api/login", {
        username,
        password,
      });

      setUser(response.data.user); // Lưu thông tin user từ backend, 🔵 Backend phải trả về { user, role }
    } catch (error) {
      console.error(
        "Login failed:",
        error.response?.data?.message || error.message
      );
    }
  };

  // 🔵 Đăng ký (Gửi request đến backend)
  const register = async (username, email, password) => {
    try {
      const response = await axios.post("http://localhost:8000/api/register", {
        username,
        email,
        password,
      });

      setUser(response.data.user); // Nhận dữ liệu user từ backend
    } catch (error) {
      console.error(
        "Registration failed:",
        error.response?.data?.message || error.message
      );
    }
  };

  // 🔴 Đăng xuất
  const logout = () => {
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
