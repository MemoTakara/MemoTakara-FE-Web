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
    if (collection && isVisible) {
      form.setFieldsValue({
        collection_name: collection.collection_name,
        description: collection.description,
        privacy: collection.privacy,
        language_front: collection.language_front,
        language_back: collection.language_back,
        difficulty_level: collection.difficulty_level,
        tags: collection.tags?.map((tag) => tag.name).join(", "),
        metadata: JSON.stringify(collection.metadata || {}, null, 2),
      });
    }
  }, [collection, isVisible, form]);

  const handleUpdateCollection = async (values) => {
    setLoading(true);

    const tagsArray = values.tags
      ? values.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      : [];

    let metadata = {};
    try {
      if (values.metadata) {
        metadata = JSON.parse(values.metadata);
      }
    } catch (e) {
      messageApi.error(t("components.create-collection.meta-error"));
      setLoading(false);
      return;
    }

    const data = {
      collection_name: values.collection_name,
      description: values.description || "",
      privacy: values.privacy,
      language_front: values.language_front,
      language_back: values.language_back,
      difficulty_level: values.difficulty_level,
      tags: tagsArray,
      metadata,
    };

    try {
      const updated = await updateCollection(collection.id, data);
      messageApi.success(t("components.edit-collection.update-success"));
      onUpdate(updated);
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
          <Input.TextArea rows={1} />
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
          <Select>
            <Option value={1}>
              {t("components.create-collection.privacy-public")}
            </Option>
            <Option value={0}>
              {t("components.create-collection.privacy-private")}
            </Option>
          </Select>
        </Form.Item>

        <Form.Item
          label={t("components.collection-list.front")}
          name="language_front"
          rules={[
            {
              required: true,
              message: t("components.create-collection.front-msg"),
            },
          ]}
        >
          <Select>
            <Option value="vi">{t("components.collection-list.viet")}</Option>
            <Option value="en">{t("components.collection-list.eng")}</Option>
            <Option value="ja">{t("components.collection-list.japan")}</Option>
            <Option value="zh">{t("components.collection-list.china")}</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label={t("components.collection-list.back")}
          name="language_back"
          rules={[
            {
              required: true,
              message: t("components.create-collection.back-msg"),
            },
          ]}
        >
          <Select>
            <Option value="vi">{t("components.collection-list.viet")}</Option>
            <Option value="en">{t("components.collection-list.eng")}</Option>
            <Option value="ja">{t("components.collection-list.japan")}</Option>
            <Option value="zh">{t("components.collection-list.china")}</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label={t("components.collection-list.difficulty")}
          name="difficulty_level"
          rules={[
            {
              required: true,
              message: t("components.create-collection.diff-msg"),
            },
          ]}
        >
          <Select>
            <Option value="beginner">
              {t("components.collection-list.beginner")}
            </Option>
            <Option value="intermediate">
              {t("components.collection-list.intermediate")}
            </Option>
            <Option value="advanced">
              {t("components.collection-list.advanced")}
            </Option>
          </Select>
        </Form.Item>

        <Form.Item
          label={t("components.create-collection.tag-placeholder")}
          name="tags"
        >
          <Input
            placeholder={t("components.create-collection.tag-input-holder")}
          />
        </Form.Item>

        <Form.Item
          label={t("components.create-collection.meta")}
          name="metadata"
          tooltip={t("components.create-collection.meta-tooltip")}
        >
          <Input.TextArea rows={3} placeholder='{"key": "value"}' />
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
