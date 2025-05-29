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
  Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import config from "@/config";
import {
  getAllFlashcards,
  addFlashcard,
  updateFlashcard,
  deleteFlashcard,
  getCollections,
} from "@/api/admin";
import FormattedDate from "@/components/widget/formatted-date";

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
  const [audioFile, setAudioFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [audioFileList, setAudioFileList] = useState([]);
  const [imageFileList, setImageFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState("");
  const [previewVisible, setPreviewVisible] = useState(false);

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

  // Tìm kiếm theo front, back hoặc tên collection
  const handleSearch = (value) => {
    setSearchText(value);
    const keyword = value.trim().toLowerCase();
    const filteredData = flashcards.filter((flashcard) => {
      const front = flashcard.front?.toLowerCase() || "";
      const back = flashcard.back?.toLowerCase() || "";
      const collName =
        flashcard.collection?.collection_name?.toLowerCase() || "";
      return (
        front.includes(keyword) ||
        back.includes(keyword) ||
        collName.includes(keyword)
      );
    });
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
      const formData = new FormData();
      formData.append("collection_id", values.collectionId);
      formData.append("front", values.front);
      formData.append("back", values.back);
      if (values.pronunciation)
        formData.append("pronunciation", values.pronunciation);
      if (values.kanji) formData.append("kanji", values.kanji);
      formData.append("status", values.status || "new");

      // Sử dụng biến state (fileList) thay vì lấy từ form values
      if (audioFileList.length > 0 && audioFileList[0].originFileObj) {
        formData.append("audio_file", audioFileList[0].originFileObj);
      }
      if (imageFileList.length > 0 && imageFileList[0].originFileObj) {
        formData.append("image", imageFileList[0].originFileObj);
      }

      await addFlashcard(formData);
      messageApi.success("Thêm flashcard thành công");
      fetchFlashcards();
      setIsModalVisible(false);
    } catch (error) {
      messageApi.error(error.message || "Lỗi khi thêm flashcard");
    }
  };

  const handleEdit = (record) => {
    setCurrentFlashcard(record);

    // Chỉ đặt các giá trị cơ bản, không bao gồm file
    form.setFieldsValue({
      collectionId: record.collection?.id,
      front: record.front,
      back: record.back,
      pronunciation: record.pronunciation,
      kanji: record.kanji,
      status: record.statuses?.[0]?.status || "new",
    }); // Hiển thị file âm thanh nếu có
    if (record.audio_file) {
      setAudioFileList([
        {
          uid: "-1",
          name: record.audio_file,
          status: "done",
          url: `${config.storageBaseUrl}/storage/${record.audio_file}`,
        },
      ]);
    } else {
      setAudioFileList([]);
    }

    // Hiển thị hình ảnh nếu có
    if (record.image) {
      setImageFileList([
        {
          uid: "-1",
          name: record.image,
          status: "done",
          url: `${config.storageBaseUrl}/storage/${record.image}`,
        },
      ]);
    } else {
      setImageFileList([]);
    }

    setIsEditMode(true);
    setIsModalVisible(true);
  };

  const handleUpdate = async (values) => {
    try {
      const formData = new FormData();
      formData.append("collection_id", values.collectionId);
      formData.append("front", values.front);
      formData.append("back", values.back);
      if (values.pronunciation)
        formData.append("pronunciation", values.pronunciation);
      if (values.kanji) formData.append("kanji", values.kanji);
      formData.append("status", values.status || "new");

      // Sử dụng biến state (fileList) thay vì lấy từ form values
      if (audioFileList.length > 0 && audioFileList[0].originFileObj) {
        formData.append("audio_file", audioFileList[0].originFileObj);
      }
      if (imageFileList.length > 0 && imageFileList[0].originFileObj) {
        formData.append("image", imageFileList[0].originFileObj);
      }

      await updateFlashcard(currentFlashcard.id, formData);
      messageApi.success("Cập nhật flashcard thành công");
      fetchFlashcards();
      setIsModalVisible(false);
      setIsEditMode(false);
      setCurrentFlashcard(null);
    } catch (error) {
      messageApi.error("Lỗi khi cập nhật flashcard: " + (error.message || ""));
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

  const handleAudioChange = ({ fileList }) => {
    setAudioFileList(fileList);
    if (fileList.length > 0 && fileList[0].originFileObj) {
      setAudioFile(fileList[0].originFileObj);
    } else {
      setAudioFile(null);
    }
  };

  const handleImageChange = ({ fileList }) => {
    setImageFileList(fileList);
    if (fileList.length > 0 && fileList[0].originFileObj) {
      setImageFile(fileList[0].originFileObj);
    } else {
      setImageFile(null);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      width: 80,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Mặt trước",
      dataIndex: "front",
      fixed: "left",
      width: 100,
      // sorter: (a, b) => a.front.localeCompare(b.front),
    },
    {
      title: "Mặt sau",
      dataIndex: "back",
      // sorter: (a, b) => a.back.localeCompare(b.back),
    },
    { title: "Phát âm", dataIndex: "pronunciation" },
    { title: "Kanji", dataIndex: "kanji", render: (text) => text || "-" },
    {
      title: "Tập tin âm thanh",
      dataIndex: "audio_file",
      render: (text) =>
        text ? (
          <audio controls style={{ width: 150 }}>
            <source src={`${config.storageBaseUrl}/storage/${text}`} />
            Trình duyệt không hỗ trợ audio.
          </audio>
        ) : (
          "-"
        ),
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      width: 150,
      render: (text) =>
        text ? (
          <img
            src={`${config.storageBaseUrl}/storage/${text}`}
            alt="flashcard"
            style={{
              width: 80,
              height: "auto",
              objectFit: "cover",
              cursor: "pointer",
            }}
            onClick={() => {
              setPreviewImage(`${config.storageBaseUrl}/storage/${text}`);
              setPreviewVisible(true);
            }}
          />
        ) : (
          "-"
        ),
    },
    {
      title: "Trạng thái",
      dataIndex: "statuses",
      width: 120,
      filters: [
        { text: "new", value: "new" },
        { text: "learning", value: "learning" },
        { text: "re-learning", value: "re-learning" },
        { text: "young", value: "young" },
        { text: "mastered", value: "mastered" },
      ],
      onFilter: (value, record) => {
        // Lọc theo status đầu tiên trong mảng statuses
        const status = record.statuses?.[0]?.status;
        return status === value;
      },
      render: (statuses) =>
        statuses && statuses.length > 0 ? statuses[0].status : "-",
    },
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
      render: (collection) => collection?.collection_name || "-",
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

  const closeModal = () => {
    setIsModalVisible(false);
    setIsEditMode(false);
    setCurrentFlashcard(null);
    form.resetFields();
    setAudioFile(null);
    setImageFile(null);
    setAudioFileList([]);
    setImageFileList([]);
  };

  return (
    <div>
      {contextHolder}
      <div
        style={{
          display: "flex",
          alignItems: "center",
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
          placeholder="Tìm kiếm theo tên collection, từ vựng"
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
        onCancel={closeModal}
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
            <Select placeholder="Chọn collection">
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

          <Form.Item label="Tập tin âm thanh" name="audio_file">
            <Upload
              accept=".mp3,.wav,.m4a,.ogg,.flac"
              maxCount={1}
              beforeUpload={() => false}
              onChange={handleAudioChange}
              fileList={audioFileList}
            >
              <Button icon={<UploadOutlined />}>Chọn âm thanh</Button>
            </Upload>
          </Form.Item>

          <Form.Item label="Hình ảnh" name="image">
            <Upload
              accept="image/*"
              maxCount={1}
              beforeUpload={() => false}
              onChange={handleImageChange}
              listType="picture"
              fileList={imageFileList}
            >
              <Button icon={<UploadOutlined />}>Chọn hình ảnh</Button>
            </Upload>
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

      <Modal
        open={previewVisible}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <img alt="preview" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </div>
  );
};

export default FlashcardManagement;
