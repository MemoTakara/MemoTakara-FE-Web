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

const { Option } = Select;

const CollectionManagement = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentCollection, setCurrentCollection] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    setLoading(true);
    try {
      const data = await getCollections();
      setCollections(data);
    } catch (error) {
      messageApi.error("Lỗi khi tải danh sách collections");
    }
    setLoading(false);
  };

  const handleDeleteCollection = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa?")) return;
    try {
      await deleteCollection(id);
      messageApi.success("Xóa thành công");
      fetchCollections();
    } catch {
      messageApi.error("Lỗi khi xóa collection");
    }
  };

  const handleEdit = (record) => {
    setCurrentCollection(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const columns = [
    { title: "ID", dataIndex: "id" },
    { title: "Tên Collection", dataIndex: "collection_name" },
    { title: "Mô tả", dataIndex: "description" },
    {
      title: "Quyền riêng tư",
      dataIndex: "privacy",
      render: (text) => (text ? "Công khai" : "Riêng tư"),
    },
    {
      title: "Tags",
      dataIndex: "tags",
      render: (tags) =>
        tags.length ? tags.map((tag) => tag.name).join(", ") : "-",
    },
    { title: "User ID", dataIndex: "user_id" },
    { title: "Số sao trung bình", dataIndex: "average_rating" },
    {
      title: "Hành động",
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
      <Table
        columns={columns}
        dataSource={collections}
        loading={loading}
        rowKey="id"
      />
    </div>
  );
};

export default CollectionManagement;
