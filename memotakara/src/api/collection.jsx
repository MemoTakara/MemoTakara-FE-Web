import axiosClient from "@/axiosClient";

// Lấy danh sách các collection công khai của 1 người dùng xác định
export const getPublicCollectionsByUser = async (userId) => {
  try {
    const response = await axiosClient.get(`/collections/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching public collections:", error);
    throw error;
  }
};

// Lấy danh sách tất cả bộ sưu tập với bộ lọc và phân trang
export const getCollections = async (params = {}) => {
  try {
    const response = await axiosClient.get("/collections", { params });
    return response.data.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách bộ sưu tập:", error);
    return { success: false, data: [], filters: {} };
  }
};

// Lấy danh sách bộ sưu tập của người dùng
export const getMyCollections = async (params = {}) => {
  try {
    const response = await axiosClient.get("/collections/my-collections", {
      params,
    });
    return response.data.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách bộ sưu tập của người dùng:", error);
    return { success: false, data: [] };
  }
};

// Tạo một bộ sưu tập mới
export const createCollection = async (collectionData) => {
  try {
    const response = await axiosClient.post("/collections", collectionData);
    return response.data.data;
  } catch (error) {
    console.error("Lỗi khi tạo bộ sưu tập:", error);
    return { success: false, message: "Failed to create collection" };
  }
};

// Lấy thông tin một bộ sưu tập cụ thể (public)
export const getCollectionByIdPublic = async (id) => {
  try {
    const response = await axiosClient.get(`/public-collections/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin bộ sưu tập:", error);
    return { success: false, message: "Collection not found" };
  }
};

// Lấy thông tin một bộ sưu tập cụ thể
export const getCollectionById = async (id) => {
  try {
    const response = await axiosClient.get(`/collections/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin bộ sưu tập:", error);
    return { success: false, message: "Collection not found" };
  }
};

// Cập nhật một bộ sưu tập cụ thể
export const updateCollection = async (id, collectionData) => {
  try {
    const response = await axiosClient.put(
      `/collections/${id}`,
      collectionData
    );
    return response.data.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật bộ sưu tập:", error);
    return { success: false, message: "Failed to update collection" };
  }
};

// Xóa một bộ sưu tập cụ thể
export const deleteCollection = async (id) => {
  try {
    const response = await axiosClient.delete(`/collections/${id}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xóa bộ sưu tập:", error);
    return { success: false, message: "Failed to delete collection" };
  }
};

// Sao chép một bộ sưu tập
export const duplicateCollection = async (id) => {
  try {
    const response = await axiosClient.post(`/collections/${id}/duplicate`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi sao chép bộ sưu tập:", error);
    return { success: false, message: "Failed to duplicate collection" };
  }
};

// Đánh giá một bộ sưu tập
export const rateCollection = async (id, ratingData) => {
  try {
    const response = await axiosClient.post(
      `/collections/${id}/rate`,
      ratingData
    );
    return response.data.data;
  } catch (error) {
    console.error("Lỗi khi đánh giá bộ sưu tập:", error);
    return { success: false, message: "Failed to submit rating" };
  }
};

// Lấy danh sách bộ sưu tập phổ biến
export const getPopularCollections = async () => {
  try {
    const response = await axiosClient.get("/collections/popular");
    return response.data.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách bộ sưu tập phổ biến:", error);
    return { success: false, data: [] };
  }
};

// Gọi để lấy danh sách collection đã xem gần đây
export const getRecentCollections = async () => {
  try {
    const res = await axiosClient.get("/collections/recent");
    return res.data.data;
  } catch (error) {
    console.error("Lỗi khi lấy recent list collection:", error);
  }
};

// Không dùng: Lấy danh sách bộ sưu tập nổi bật
// export const getFeaturedCollections = async () => {
//   try {
//     const response = await axiosClient.get("/collections/featured");
//     return response.data.data;
//   } catch (error) {
//     console.error("Lỗi khi lấy danh sách bộ sưu tập nổi bật:", error);
//     return { success: false, data: [] };
//   }
// };

// Không dùng: Tìm kiếm bộ sưu tập với bộ lọc nâng cao
// export const searchCollections = async (params = {}) => {
//   try {
//     const response = await axiosClient.get("/collections/search", { params });
//     return response.data.data;
//   } catch (error) {
//     console.error("Lỗi khi tìm kiếm bộ sưu tập:", error);
//     return { success: false, data: [] };
//   }
// };

// Không dùng: Lấy danh sách bộ sưu tập theo tag
// export const getCollectionsByTags = async (tags = []) => {
//   try {
//     const response = await axiosClient.get("/collections/by-tags", {
//       params: { tags: tags.join(",") },
//     });
//     return response.data.data;
//   } catch (error) {
//     console.error("Lỗi khi lấy danh sách bộ sưu tập theo tag:", error);
//     return { success: false, data: [] };
//   }
// };
