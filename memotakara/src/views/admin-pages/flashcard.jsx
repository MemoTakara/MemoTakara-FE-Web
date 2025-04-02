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
  getAllFlashcards,
  addFlashcard,
  updateFlashcard,
  deleteFlashcard,
  getCollections,
} from "@/api/admin";

const { Option } = Select;

const FlashcardManagement = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentFlashcard, setCurrentFlashcard] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  useEffect(() => {
    fetchFlashcards();
    fetchCollections();
  }, []);

  const fetchFlashcards = async () => {
    setLoading(true);
    try {
      const data = await getAllFlashcards();
      setFlashcards(data);
    } catch (error) {
      messageApi.error("Lỗi khi tải danh sách flashcards");
    }
    setLoading(false);
  };

  const fetchCollections = async () => {
    try {
      const data = await getCollections();
      setCollections(data);
    } catch (error) {
      messageApi.error("Lỗi khi tải danh sách collections");
    }
  };

  const handleAdd = async (values) => {
    try {
      if (!values.collectionId) {
        throw new Error("collectionId không được để trống");
      }
      const flashcardData = {
        collection_id: values.collectionId,
        front: values.front,
        back: values.back,
        pronunciation: values.pronunciation,
      };
      await addFlashcard(values.collectionId, flashcardData);
      messageApi.success("Thêm flashcard thành công");
      fetchFlashcards();
      setIsModalVisible(false);
    } catch (error) {
      messageApi.error(error.message || "Lỗi khi thêm flashcard");
    }
  };

  const handleEdit = (record) => {
    setCurrentFlashcard(record);
    form.setFieldsValue({
      ...record,
      collectionId: record.collection?.id,
    });
    setIsEditMode(true);
    setIsModalVisible(true);
  };

  const handleUpdate = async (values) => {
    try {
      await updateFlashcard(currentFlashcard.id, values);
      messageApi.success("Cập nhật flashcard thành công");
      fetchFlashcards();
      setIsModalVisible(false);
      setIsEditMode(false);
      setCurrentFlashcard(null);
    } catch (error) {
      messageApi.error("Lỗi khi cập nhật flashcard");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa flashcard này?")) return;
    try {
      await deleteFlashcard(id);
      messageApi.success("Xóa flashcard thành công");
      fetchFlashcards();
    } catch (error) {
      messageApi.error("Lỗi khi xóa flashcard");
    }
  };

  const handleAddFlashcardClick = () => {
    setIsEditMode(false);
    setCurrentFlashcard(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const columns = [
    { title: "ID", dataIndex: "id" },
    { title: "Mặt trước", dataIndex: "front" },
    { title: "Mặt sau", dataIndex: "back" },
    { title: "Phát âm", dataIndex: "pronunciation" },
    { title: "Trạng thái", dataIndex: "status" },
    {
      title: "Hành động",
      render: (_, record) => (
        <Space>
          <Button onClick={() => handleEdit(record)}>Chỉnh sửa</Button>
          <Button danger onClick={() => handleDelete(record.id)}>
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
        onClick={handleAddFlashcardClick}
        style={{ marginBottom: 16 }}
      >
        Thêm Flashcard
      </Button>
      <Table
        columns={columns}
        dataSource={flashcards}
        loading={loading}
        rowKey="id"
      />
      <Modal
        title={isEditMode ? "Chỉnh sửa Flashcard" : "Thêm Flashcard"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setIsEditMode(false);
          setCurrentFlashcard(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={isEditMode ? handleUpdate : handleAdd}
        >
          <Form.Item
            name="collectionId"
            label="Chọn collection"
            rules={[{ required: true, message: "Vui lòng chọn collection" }]}
          >
            <Select
              placeholder="Chọn collection"
              value={currentFlashcard?.collection?.id}
            >
              {collections.map((collection) => (
                <Option key={collection.id} value={collection.id}>
                  {collection.collection_name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="front"
            label="Mặt trước"
            rules={[{ required: true, message: "Vui lòng nhập mặt trước" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="back"
            label="Mặt sau"
            rules={[{ required: true, message: "Vui lòng nhập mặt sau" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="pronunciation" label="Phát âm">
            <Input />
          </Form.Item>
          <Form.Item name="status" label="Trạng thái">
            <Select>
              <Option value="new">New</Option>
              <Option value="learning">Learning</Option>
              <Option value="re-learning">Re-learning</Option>
              <Option value="young">Young</Option>
              <Option value="mastered">Mastered</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FlashcardManagement;
