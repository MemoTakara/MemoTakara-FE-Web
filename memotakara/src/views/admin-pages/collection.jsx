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

  const handleUpdate = async (values) => {
    try {
      const formattedValues = {
        ...values,
        tag: values.tag?.trim() || "", // Đảm bảo tag là chuỗi
        star_count: values.star_count ? parseFloat(values.star_count) : 0.0, // Chuyển thành số
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
    { title: "Số sao", dataIndex: "average_rating" },
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
      <Button
        type="primary"
        onClick={() => setIsModalVisible(true)}
        style={{ marginBottom: 16 }}
      >
        Thêm Collection
      </Button>
      <Table
        columns={columns}
        dataSource={collections}
        loading={loading}
        rowKey="id"
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
          <Form.Item name="tag" label="Tags">
            <Input placeholder="Nhập tags, cách nhau bởi dấu phẩy" />
          </Form.Item>
          <Form.Item name="star_count" label="Số sao">
            <Input type="number" min={0} max={5} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CollectionManagement;
