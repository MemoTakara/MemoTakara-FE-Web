import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Form, Input, Select, Button, message } from "antd";
import { updateCollection } from "@/api/collection";

const { Option } = Select;

function MemoEditCollection({ isVisible, onCancel, onUpdate, collection }) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (collection) {
      form.setFieldsValue({
        collection_name: collection.collection_name,
        description: collection.description,
        privacy: collection.privacy,
        tag: collection.tag,
      });
    }
  }, [collection, form]);

  const handleUpdateCollection = async (values) => {
    setLoading(true);
    try {
      const updated = await updateCollection(collection.id, values);
      messageApi.success(t("components.edit-collection.update-success"));
      onUpdate(updated); // Trả về data mới
      onCancel();
    } catch (err) {
      console.error("Error updating collection:", err);
      messageApi.error(t("components.edit-collection.update-error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={t("components.edit-collection.title")}
      open={isVisible}
      onCancel={onCancel}
      footer={null}
    >
      {contextHolder}
      <Form form={form} onFinish={handleUpdateCollection} layout="vertical">
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
          <Input />
        </Form.Item>

        <Form.Item
          label={t("components.create-collection.des")}
          name="description"
        >
          <Input.TextArea rows={4} />
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
          <Select allowClear>
            <Option value={1}>
              {t("components.create-collection.privacy-public")}
            </Option>
            <Option value={0}>
              {t("components.create-collection.privacy-private")}
            </Option>
          </Select>
        </Form.Item>

        <Form.Item label="Tag" name="tag">
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            {loading
              ? t("components.edit-collection.btn-updating")
              : t("components.edit-collection.btn-update")}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default MemoEditCollection;
