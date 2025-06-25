import { Modal, Rate, Input, Form, message } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { rateCollection } from "@/api/collection";

const MemoRateCollection = ({ visible, onCancel, collectionId }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      const res = await rateCollection(collectionId, values);
      if (res?.id) {
        messageApi.success(t("components.create-collection.rate-msg-success"));
        onCancel();
        form.resetFields();
      } else {
        messageApi.error(t("components.create-collection.rate-msg-error"));
      }
    } catch (err) {
      console.log("rate collection", err);
      messageApi.error(t("components.create-collection.rate-msg-error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={t("components.set-item.rate-title")}
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={loading}
      okText={t("buttons.submit")}
      cancelText={t("buttons.cancel")}
    >
      {contextHolder}
      <Form form={form} layout="vertical">
        <Form.Item
          name="rating"
          label={t("components.create-collection.rating")}
          rules={[
            {
              required: true,
              message: t("components.create-collection.rating-required"),
            },
          ]}
        >
          <Rate />
        </Form.Item>
        <Form.Item
          name="review"
          label={t("components.create-collection.review")}
          rules={[
            {
              max: 500,
              message: t("components.create-collection.review-max"),
            },
          ]}
        >
          <Input.TextArea rows={2} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default MemoRateCollection;
