import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Form, Input, Select, message } from "antd";

import { createCollection } from "@/api/collection";
import BtnBlue from "@/components/btn/btn-blue";

const { Option } = Select;

function MemoCreateCollection({ isVisible, onCancel, onCreate }) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleCreateCollection = async (values) => {
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
      const newCollection = await createCollection(data);
      messageApi.success(t("components.create-collection.create-msg-success"));
      form.resetFields();
      onCreate(newCollection);
      onCancel();
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
            rows={1}
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
          >
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
          initialValue="en"
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
          initialValue="vi"
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
          initialValue="beginner"
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
          <Input.TextArea rows={1} placeholder='{"key": "value"}' />
        </Form.Item>

        <Form.Item>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <BtnBlue
              textKey={loading ? "creating" : "create"}
              disabled={loading}
              onClick={() => form.submit()}
            />
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default MemoCreateCollection;
