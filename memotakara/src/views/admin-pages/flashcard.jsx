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
import FormattedDate from "@/components/formatted-date";

const { Option } = Select;

const FlashcardManagement = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [filteredFlashcards, setFilteredFlashcards] = useState([]);
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null); // Giữ thông tin collection đang chọn
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentFlashcard, setCurrentFlashcard] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchFlashcards();
    fetchCollections();
  }, []);

  const fetchFlashcards = async () => {
    setLoading(true);
    try {
      const data = await getAllFlashcards();
      setFlashcards(data);
      setFilteredFlashcards(data); // Khởi tạo dữ liệu lọc
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

  const handleSearch = (value) => {
    setSearchText(value);
    const filteredData = flashcards.filter(
      (flashcard) =>
        flashcard.front.toLowerCase().includes(value.toLowerCase()) ||
        (flashcard.collection?.collection_name || "")
          .toLowerCase()
          .includes(value.toLowerCase())
    );
    setFilteredFlashcards(filteredData);
  };

  const handleCollectionChange = (value) => {
    setSelectedCollection(value);
    // Lọc flashcards theo collection đã chọn
    const filteredData = flashcards.filter(
      (flashcard) => flashcard.collection?.id === value || value === null
    );
    setFilteredFlashcards(filteredData);
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
    { title: "ID", dataIndex: "id", width: 80 },
    {
      title: "Mặt trước",
      dataIndex: "front",
      fixed: "left",
      width: 100,
      sorter: (a, b) => a.front.localeCompare(b.front),
    },
    {
      title: "Mặt sau",
      dataIndex: "back",
      sorter: (a, b) => a.back.localeCompare(b.back),
    },
    { title: "Phát âm", dataIndex: "pronunciation" },
    { title: "Kanji", dataIndex: "kanji", render: (text) => text || "-" },
    {
      title: "Tập tin âm thanh",
      dataIndex: "audio_file",
      render: (text) => text || "-",
    },
    { title: "Hình ảnh", dataIndex: "image", render: (text) => text || "-" },
    { title: "Trạng thái", dataIndex: "status" },
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
      title: "Bộ sưu tập",
      dataIndex: "collection",
      render: (text) => text?.collection_name || "-",
      filters: collections.map((collection) => ({
        text: collection.collection_name,
        value: collection.id,
      })),
      filterMultiple: false,
      onFilter: (value, record) => record.collection?.id === value,
      filterDropdown: () => (
        <Select
          onChange={handleCollectionChange}
          style={{ width: 200 }}
          value={selectedCollection}
        >
          <Option value={null}>Tất cả</Option>
          {collections.map((collection) => (
            <Option key={collection.id} value={collection.id}>
              {collection.collection_name}
            </Option>
          ))}
        </Select>
      ),
      fixed: "right",
    },
    {
      title: "Hành động",
      fixed: "right",
      width: 200,
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
      <div
        style={{
          display: "flex",
          alignItem: "center",
          justifyContent: "space-between",
        }}
      >
        <Button
          type="primary"
          onClick={handleAddFlashcardClick}
          style={{ marginBottom: 16, width: "12%", marginRight: "auto" }}
        >
          Thêm Flashcard
        </Button>

        <Input.Search
          placeholder="Tìm kiếm theo tên collection"
          onSearch={handleSearch}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ marginBottom: 16, width: 300 }}
        />
      </div>
      <Table
        columns={columns}
        dataSource={filteredFlashcards}
        loading={loading}
        rowKey="id"
        bordered
        scroll={{ x: 2000 }}
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
          <Form.Item name="kanji" label="Kanji">
            <Input />
          </Form.Item>
          <Form.Item name="audio_file" label="Tập tin âm thanh">
            <Input type="file" />
          </Form.Item>
          <Form.Item name="image" label="Hình ảnh">
            <Input type="file" />
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
