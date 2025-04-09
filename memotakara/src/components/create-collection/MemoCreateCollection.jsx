import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Form, Input, Select, Button, message } from "antd";
import { createCollection } from "@/api/collection";

const { Option } = Select;

function MemoCreateCollection({ isVisible, onCancel, onCreate }) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleCreateCollection = async (values) => {
    setLoading(true);
    const data = {
      collection_name: values.collection_name,
      description: values.description,
      privacy: values.privacy,
      tag: values.tag,
    };

    try {
      const newCollection = await createCollection(data);
      messageApi.success(t("components.create-collection.create-msg-success"));
      form.resetFields();
      onCreate(newCollection); // Trả về collection mới để cập nhật trong StudySets
      onCancel(); // Đóng modal
    } catch (err) {
      console.error("Error creating collection:", err);
      messageApi.error(t("components.create-collection.create-msg-error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={t("components.create-collection.title")}
      open={isVisible}
      onCancel={onCancel}
      footer={null}
    >
      {contextHolder}
      <Form form={form} onFinish={handleCreateCollection} layout="vertical">
        <Form.Item
          label={t("components.create-collection.collection-name")}
          name="collection_name"
          rules={[
            {
              required: true,
              message: t("components.create-collection.name-required"),
            },
          ]}
        >
          <Input
            placeholder={t("components.create-collection.name-placeholder")}
          />
        </Form.Item>

        <Form.Item
          label={t("components.create-collection.des")}
          name="description"
        >
          <Input.TextArea
            placeholder={t("components.create-collection.des-placeholder")}
            rows={4}
          />
        </Form.Item>

        <Form.Item
          label={t("components.create-collection.privacy")}
          name="privacy"
          rules={[
            {
              required: true,
              message: t("components.create-collection.privacy-required"),
            },
          ]}
        >
          <Select
            placeholder={t("components.create-collection.privacy-placeholder")}
            allowClear
          >
            <Option value={1}>
              {t("components.create-collection.privacy-public")}
            </Option>
            <Option value={0}>
              {t("components.create-collection.privacy-private")}
            </Option>
          </Select>
        </Form.Item>

        <Form.Item label="Tag" name="tag">
          <Input
            placeholder={t("components.create-collection.tag-placeholder")}
          />
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            {loading
              ? t("components.create-collection.btn-creating")
              : t("components.create-collection.btn-create")}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default MemoCreateCollection;
