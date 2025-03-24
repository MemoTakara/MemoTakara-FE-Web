useEffect(() => {
  const fetchUser = async () => {
    if (!token) return; // ⛔ Không có token thì không gọi API

    try {
      const response = await axios.get(`${API_BASE_URL}/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log("Unauthorized - Clearing token...");
        updateToken(null);
      } else {
        console.error("Lỗi khác:", error);
      }
    }
  };

  if (token) {
    fetchUser();
  }
}, [token]);
