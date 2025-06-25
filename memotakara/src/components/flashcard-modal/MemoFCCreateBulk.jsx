import { useState } from "react";
import { Modal, Form, Input, Row, Col, message, Divider } from "antd";
import { useTranslation } from "react-i18next";

import { bulkCreateFlashcards } from "@/api/flashcard";
import BtnWhite from "@/components/btn/btn-white";

const { TextArea } = Input;

const MemoFCCreateBulk = ({ open, onClose, collectionId }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const [flashcards, setFlashcards] = useState([{ front: "", back: "" }]);

  const addFlashcard = () => {
    setFlashcards([...flashcards, { front: "", back: "" }]);
  };

  const handleChange = (index, field, value) => {
    const updated = [...flashcards];
    updated[index][field] = value;
    setFlashcards(updated);
  };

  const handleSubmit = async () => {
    try {
      // Validate
      const validated = await Promise.all(
        flashcards.map(async (fc, index) => {
          if (!fc.front || !fc.back) {
            throw new Error(
              `Flashcard #${index + 1}: ${t(
                "components.create-fc.bulk-fc-required"
              )}`
            );
          }
          if (fc.extra_data) {
            try {
              fc.extra_data = JSON.parse(fc.extra_data);
            } catch (err) {
              throw new Error(
                `Flashcard #${index + 1}: ${t(
                  "components.create-fc.extra-data"
                )}`
              );
            }
          }
          return fc;
        })
      );

      await bulkCreateFlashcards({
        collection_id: collectionId,
        flashcards: validated,
      });

      messageApi.success(t("components.create-fc.fc-create-bulk-success"));
      setFlashcards([{ front: "", back: "" }]);
      onClose();
    } catch (err) {
      messageApi.error(
        err.message || t("components.create-fc.fc-create-error")
      );
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        open={open}
        title={t("components.create-fc.fc-create-bulk")}
        onCancel={onClose}
        onOk={handleSubmit}
        okText={t("buttons.create")}
        cancelText={t("buttons.cancel")}
        width={1000}
      >
        <Form layout="vertical" form={form}>
          {flashcards.map((fc, index) => (
            <div
              key={index}
              style={{
                padding: "12px",
                border: "1px solid #f0f0f0",
                borderRadius: 6,
                marginBottom: 24,
                background: "#fafafa",
              }}
            >
              <Divider>Flashcard #{index + 1}</Divider>
              <Row gutter={16}>
                {/* Left column: front + back */}
                <Col span={12}>
                  <Form.Item
                    label={t("components.flashcard-modal.front")}
                    required
                  >
                    <Input
                      value={fc.front}
                      onChange={(e) =>
                        handleChange(index, "front", e.target.value)
                      }
                    />
                  </Form.Item>

                  <Form.Item
                    label={t("components.flashcard-modal.back")}
                    required
                  >
                    <TextArea
                      rows={2}
                      value={fc.back}
                      onChange={(e) =>
                        handleChange(index, "back", e.target.value)
                      }
                    />
                  </Form.Item>
                </Col>

                {/* Right column: optional fields */}
                <Col span={12}>
                  <Form.Item
                    label={t("components.flashcard-modal.pronunciation")}
                  >
                    <Input
                      value={fc.pronunciation}
                      onChange={(e) =>
                        handleChange(index, "pronunciation", e.target.value)
                      }
                    />
                  </Form.Item>

                  <Form.Item label={t("components.flashcard-modal.kanji")}>
                    <Input
                      value={fc.kanji}
                      onChange={(e) =>
                        handleChange(index, "kanji", e.target.value)
                      }
                    />
                  </Form.Item>

                  <Form.Item label={t("components.flashcard-modal.image")}>
                    <Input
                      value={fc.image}
                      onChange={(e) =>
                        handleChange(index, "image", e.target.value)
                      }
                    />
                  </Form.Item>

                  <Form.Item
                    label={t("components.flashcard-modal.extra-data")}
                    tooltip='Ví dụ: {"hint": "mẹo học"}'
                  >
                    <TextArea
                      rows={1}
                      value={fc.extra_data}
                      onChange={(e) =>
                        handleChange(index, "extra_data", e.target.value)
                      }
                      placeholder='{"hint": "mẹo học"}'
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          ))}

          <Form.Item>
            <BtnWhite
              textKey="add-fc"
              onClick={addFlashcard}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default MemoFCCreateBulk;
