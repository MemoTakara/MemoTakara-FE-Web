import { Modal, Form, Input, message } from "antd";
import { useTranslation } from "react-i18next";

import { createFlashcard } from "@/api/flashcard";

const { TextArea } = Input;

const MemoFCCreate = ({ open, onClose, collectionId }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const handleCreate = async () => {
    try {
      const values = await form.validateFields();

      let extraData = null;
      if (values.extra_data?.trim()) {
        try {
          extraData = JSON.parse(values.extra_data);
        } catch (err) {
          return form.setFields([
            {
              name: "extra_data",
              errors: [t("components.create-fc.extra-data")],
            },
          ]);
        }
      }

      const payload = {
        ...values,
        extra_data: extraData,
        collection_id: collectionId,
      };
      await createFlashcard(payload);
      messageApi.success(t("components.create-fc.fc-create-success"));
      onClose();
      form.resetFields();
    } catch (err) {
      if (err?.errorFields) return;
      messageApi.error(t("components.create-fc.fc-create-error"));
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        title={t("components.collection-modal.create-fc")}
        open={open}
        onCancel={onClose}
        onOk={handleCreate}
        okText={t("buttons.create")}
        cancelText={t("buttons.cancel")}
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            label={t("components.flashcard-modal.front")}
            name="front"
            rules={[
              {
                required: true,
                message: t("components.flashcard-modal.fc-msg"),
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label={t("components.flashcard-modal.back")}
            name="back"
            rules={[
              {
                required: true,
                message: t("components.flashcard-modal.fc-msg"),
              },
            ]}
          >
            <TextArea rows={2} />
          </Form.Item>

          <Form.Item
            label={t("components.flashcard-modal.pronunciation")}
            name="pronunciation"
          >
            <Input />
          </Form.Item>

          <Form.Item label={t("components.flashcard-modal.kanji")} name="kanji">
            <Input />
          </Form.Item>

          <Form.Item label={t("components.flashcard-modal.image")} name="image">
            <Input />
          </Form.Item>

          <Form.Item
            label={t("components.flashcard-modal.extra-data")}
            name="extra_data"
          >
            <TextArea rows={1} placeholder='{"hint": "mẹo học"}' />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default MemoFCCreate;
