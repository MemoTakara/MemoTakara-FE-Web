import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  message,
  Modal,
  Form,
  Input,
  Select,
} from "antd";
import {
  getCollections,
  createCollection,
  updateCollection,
  deleteCollection,
} from "@/api/admin";
import FormattedDate from "@/components/widget/formatted-date";

const { Option } = Select;

const CollectionManagement = () => {
  const [collections, setCollections] = useState([]);
  const [filteredCollections, setFilteredCollections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentCollection, setCurrentCollection] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [privacyFilter, setPrivacyFilter] = useState(null);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    setLoading(true);
    try {
      const data = await getCollections();
      setCollections(data);
      setFilteredCollections(data); // Khởi tạo dữ liệu lọc
    } catch (error) {
      messageApi.error("Lỗi khi tải danh sách collections");
    }
    setLoading(false);
  };

  const filterCollections = (searchValue, privacyValue) => {
    const filteredData = collections.filter((collection) => {
      const matchesCollectionName = collection.collection_name
        .toLowerCase()
        .includes(searchValue.toLowerCase());
      const matchesTags =
        collection.tags &&
        collection.tags.some((tag) =>
          tag.name.toLowerCase().includes(searchValue.toLowerCase())
        );
      const matchesPrivacy =
        privacyValue !== null
          ? collection.privacy.toString() === privacyValue
          : true; // Lọc theo quyền riêng tư
      const matchesUsername = collection.user
        ? collection.user.username
            .toLowerCase()
            .includes(searchValue.toLowerCase())
        : false;

      return (
        (matchesCollectionName || matchesTags || matchesUsername) &&
        matchesPrivacy
      );
    });

    setFilteredCollections(filteredData);
  };

  const handleSearch = (value) => {
    setSearchText(value);
    filterCollections(value, privacyFilter); // Áp dụng tìm kiếm
  };

  const handlePrivacyFilterChange = (value) => {
    setPrivacyFilter(value);
    filterCollections(searchText, value); // Áp dụng lọc quyền riêng tư
  };

  const handleUpdate = async (values) => {
    try {
      const formattedValues = {
        ...values,
        tags:
          typeof values.tags === "string"
            ? values.tags.split(",").map((tag) => tag.trim())
            : values.tags,
      };

      if (currentCollection) {
        await updateCollection(currentCollection.id, formattedValues);
        messageApi.success("Cập nhật collection thành công");
      } else {
        await createCollection(formattedValues);
        messageApi.success("Tạo mới collection thành công");
      }

      fetchCollections();
      setIsModalVisible(false);
      form.resetFields();
      setCurrentCollection(null);
    } catch (error) {
      console.error("Lỗi khi lưu collection:", error);
      messageApi.error(
        `Lỗi khi lưu collection: ${
          error.response?.data?.message || "Lỗi không xác định"
        }`
      );
    }
  };

  const handleDeleteCollection = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa?")) return;
    try {
      await deleteCollection(id);
      messageApi.success("Xóa thành công");
      fetchCollections();
    } catch {
      messageApi.error(
        `Lỗi khi xóa collection: ${
          error.response?.data?.message || "Lỗi không xác định"
        }`
      );
    }
  };

  const handleEdit = (record) => {
    setCurrentCollection(record);
    form.setFieldsValue({
      ...record,
      tags: record.tags ? record.tags.map((tag) => tag.name).join(", ") : "",
    });
    setIsModalVisible(true);
  };

  const columns = [
    { title: "ID", dataIndex: "id", width: 80 },
    {
      title: "Tên Collection",
      dataIndex: "collection_name",
      fixed: "left",
      width: 200,
      sorter: (a, b) => a.collection_name.localeCompare(b.collection_name),
    },
    {
      title: "Quyền riêng tư",
      width: 150,
      dataIndex: "privacy",
      render: (text) => (text ? "Công khai" : "Riêng tư"),
      filters: [
        { text: "Công khai", value: "1" },
        { text: "Riêng tư", value: "0" },
      ],
      filterMultiple: false,
      onFilter: (value, record) => record.privacy.toString() === value,
      filterDropdown: () => (
        <Select
          onChange={handlePrivacyFilterChange}
          style={{ width: 120 }}
          value={privacyFilter}
        >
          <Option value={null}>Tất cả</Option>
          <Option value="1">Công khai</Option>
          <Option value="0">Riêng tư</Option>
        </Select>
      ),
    },
    {
      title: "Tags",
      width: 100,
      dataIndex: "tags",
      render: (tags) =>
        tags.length ? tags.map((tag) => tag.name).join(", ") : "-",
    },
    // { title: "User ID", dataIndex: "user_id", width: 80 },
    {
      title: "Username",
      render: (text, record) => (record.user ? record.user.username : "-"), // Kiểm tra nếu user tồn tại,
      width: 150,
    },
    {
      title: "Số sao",
      dataIndex: "average_rating",
      width: 100,
      // sorter: (a, b) => a.average_rating.localeCompare(b.average_rating),
      sorter: (a, b) => a.average_rating - b.average_rating, // Sắp xếp theo average_rating
    },
    { title: "Mô tả", dataIndex: "description" },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      width: 120,
      render: (text) => (text ? <FormattedDate dateString={text} /> : "-"),
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updated_at",
      width: 120,
      render: (text) => (text ? <FormattedDate dateString={text} /> : "-"),
      sorter: (a, b) => new Date(a.updated_at) - new Date(b.updated_at),
    },
    {
      title: "Hành động",
      fixed: "right",
      width: 200,
      render: (_, record) => (
        <Space>
          <Button onClick={() => handleEdit(record)}>Chỉnh sửa</Button>
          <Button danger onClick={() => handleDeleteCollection(record.id)}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {contextHolder}
      <div
        style={{
          display: "flex",
          alignItem: "center",
          justifyContent: "space-between",
        }}
      >
        <Button
          type="primary"
          onClick={() => setIsModalVisible(true)}
          style={{ marginBottom: 16, width: "12%", marginRight: "auto" }}
        >
          Thêm Collection
        </Button>
        <Input.Search
          placeholder="Tìm kiếm theo tên collection, tag, username"
          onSearch={handleSearch}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ marginBottom: 16, width: 350 }}
        />
      </div>
      <Table
        columns={columns}
        dataSource={filteredCollections}
        loading={loading}
        rowKey="id"
        bordered
        scroll={{ x: 2000 }}
      />

      <Modal
        title={currentCollection ? "Cập nhật Collection" : "Tạo Collection"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setCurrentCollection(null);
        }}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleUpdate}>
          <Form.Item
            name="collection_name"
            label="Tên Collection"
            rules={[{ required: true, message: "Vui lòng nhập tên" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="privacy"
            label="Quyền riêng tư"
            rules={[{ required: true, message: "Vui lòng chọn" }]}
          >
            <Select>
              <Option value={1}>Công khai</Option>
              <Option value={0}>Riêng tư</Option>
            </Select>
          </Form.Item>
          <Form.Item name="tags" label="Tags">
            <Input placeholder="Nhập tags, cách nhau bởi dấu phẩy" />
          </Form.Item>
          <Form.Item name="star_count" label="Số sao" />
        </Form>
      </Modal>
    </div>
  );
};

export default CollectionManagement;
