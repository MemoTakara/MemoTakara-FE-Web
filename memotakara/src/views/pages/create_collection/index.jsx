import "./index.css";
import { useState } from "react";
import { Input, Button, Checkbox, Form, message } from "antd";
import { createCollection } from "@/api/collection";

function CreateCollection() {
  const [collectionName, setCollectionName] = useState("");
  const [description, setDescription] = useState("");
  const [privacy, setPrivacy] = useState(false);
  const [tag, setTag] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (values) => {
    setLoading(true);
    setError(null); // Reset previous error

    const data = {
      collection_name: values.collection_name,
      description: values.description,
      privacy: values.privacy,
      tag: values.tag,
    };

    try {
      const newCollection = await createCollection(data); // Sử dụng API
      message.success("Collection created successfully!");
      console.log("Collection created successfully:", newCollection);
      // Handle successful creation, e.g., redirect or show success message
    } catch (err) {
      console.error("Error creating collection:", err);
      setError("Lỗi khi tạo collection. Vui lòng thử lại.");
      message.error("Lỗi khi tạo collection. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-collection-container">
      <h1>Create a New Collection</h1>
      <Form onFinish={handleSubmit} layout="vertical">
        {/* Collection Name */}
        <Form.Item
          label="Collection Name"
          name="collection_name"
          rules={[
            { required: true, message: "Please input the collection name!" },
          ]}
        >
          <Input
            value={collectionName}
            onChange={(e) => setCollectionName(e.target.value)}
            placeholder="Enter collection name"
          />
        </Form.Item>

        {/* Description */}
        <Form.Item label="Description" name="description">
          <Input.TextArea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
            rows={4}
          />
        </Form.Item>

        {/* Privacy */}
        <Form.Item name="privacy" valuePropName="checked">
          <Checkbox checked={privacy} onChange={() => setPrivacy(!privacy)}>
            Make this collection private
          </Checkbox>
        </Form.Item>

        {/* Tag */}
        <Form.Item label="Tag" name="tag">
          <Input
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            placeholder="Enter tag"
          />
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            {loading ? "Creating..." : "Create Collection"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default CreateCollection;
