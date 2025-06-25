import { useEffect } from "react";
import { Modal, Form, Input } from "antd";
import { useTranslation } from "react-i18next";

import BtnWhite from "@/components/btn/btn-white";
import BtnBlue from "@/components/btn/btn-blue";

const { TextArea } = Input;

const MemoFCEdit = ({ open, onClose, onSubmit, initialData }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialData && open) {
      form.setFieldsValue({
        front: initialData.front || "",
        back: initialData.back || "",
        pronunciation: initialData.pronunciation || "",
        kanji: initialData.kanji || "",
        image: initialData.image || "",
        extra_data: initialData.extra_data
          ? JSON.stringify(initialData.extra_data, null, 2)
          : "",
      });
    }
  }, [initialData, open, form]);

  const handleFinish = (values) => {
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

    onSubmit({
      ...values,
      extra_data: extraData,
    });
  };

  return (
    <Modal
      open={open}
      title={t("components.flashcard-modal.fc-edit-title")}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={handleFinish}
        autoComplete="off"
      >
        <Form.Item
          label={t("components.flashcard-modal.front")}
          name="front"
          rules={[
            { required: true, message: t("components.flashcard-modal.fc-msg") },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={t("components.flashcard-modal.back")}
          name="back"
          rules={[
            { required: true, message: t("components.flashcard-modal.fc-msg") },
          ]}
        >
          <Input />
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

        <Form.Item>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <BtnWhite
              textKey="cancel"
              onClick={onClose}
              style={{ marginRight: 8 }}
            />
            <BtnBlue
              textKey="save"
              onClick={() => form.submit()}
              layout="horizontal"
            />
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default MemoFCEdit;
