import { useState, useEffect } from "react";
import {
  Card,
  Button,
  Progress,
  Slider,
  Tag,
  List,
  Typography,
  Space,
  Row,
  Col,
  Spin,
  Empty,
  Divider,
  Tooltip,
  Badge,
} from "antd";
import {
  SoundOutlined,
  PauseCircleOutlined,
  StepBackwardOutlined,
  StepForwardOutlined,
  ReloadOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const PronunciationComponent = () => {
  // State để quản lý dữ liệu và trạng thái
  const [data, setData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [speechRate, setSpeechRate] = useState(0.8);
  const [availableVoices, setAvailableVoices] = useState([]);

  // Dữ liệu mẫu (thay thế bằng API call thực tế)
  const sampleData = [
    { front: "Hello", tag: "en-US" },
    { front: "Bonjour", tag: "fr-FR" },
    { front: "Hola", tag: "es-ES" },
    { front: "Guten Tag", tag: "de-DE" },
    { front: "こんにちは", tag: "ja-JP" },
    { front: "안녕하세요", tag: "ko-KR" },
    { front: "Привет", tag: "ru-RU" },
    { front: "你好", tag: "zh-CN" },
    { front: "Ciao", tag: "it-IT" },
    { front: "Olá", tag: "pt-BR" },
    { front: "Namaste", tag: "hi-IN" },
    { front: "مرحبا", tag: "ar-SA" },
  ];

  // Khởi tạo dữ liệu và voices
  useEffect(() => {
    // Giả lập API call
    const timer = setTimeout(() => {
      setData(sampleData);
      setIsLoading(false);
    }, 1500);

    // Lấy danh sách voices có sẵn
    const updateVoices = () => {
      const voices = speechSynthesis.getVoices();
      setAvailableVoices(voices);
    };

    updateVoices();
    speechSynthesis.onvoiceschanged = updateVoices;

    return () => clearTimeout(timer);
  }, []);

  // Hàm lấy thông tin ngôn ngữ từ tag
  const getLanguageInfo = (tag) => {
    const languageMap = {
      "en-US": { name: "English (US)", flag: "🇺🇸", color: "blue" },
      "fr-FR": { name: "Français", flag: "🇫🇷", color: "purple" },
      "es-ES": { name: "Español", flag: "🇪🇸", color: "orange" },
      "de-DE": { name: "Deutsch", flag: "🇩🇪", color: "red" },
      "ja-JP": { name: "日本語", flag: "🇯🇵", color: "magenta" },
      "ko-KR": { name: "한국어", flag: "🇰🇷", color: "cyan" },
      "ru-RU": { name: "Русский", flag: "🇷🇺", color: "volcano" },
      "zh-CN": { name: "中文", flag: "🇨🇳", color: "gold" },
      "it-IT": { name: "Italiano", flag: "🇮🇹", color: "green" },
      "pt-BR": { name: "Português", flag: "🇧🇷", color: "lime" },
      "hi-IN": { name: "हिन्दी", flag: "🇮🇳", color: "geekblue" },
      "ar-SA": { name: "العربية", flag: "🇸🇦", color: "pink" },
    };
    return languageMap[tag] || { name: tag, flag: "🌐", color: "default" };
  };

  // Hàm tìm voice phù hợp
  const findBestVoice = (languageTag) => {
    const voices = availableVoices;
    let voice = voices.find((v) => v.lang === languageTag);

    if (!voice) {
      const mainLang = languageTag.split("-")[0];
      voice = voices.find((v) => v.lang.startsWith(mainLang));
    }

    return voice || voices[0];
  };

  // Hàm phát âm
  const speakWord = (word, languageTag) => {
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(word);
      const voice = findBestVoice(languageTag);

      if (voice) {
        utterance.voice = voice;
      }

      utterance.lang = languageTag;
      utterance.rate = speechRate;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);

      speechSynthesis.speak(utterance);
    } else {
      alert("Trình duyệt không hỗ trợ phát âm!");
    }
  };

  // Hàm dừng phát âm
  const stopSpeaking = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
  };

  // Hàm điều hướng
  const nextWord = () => {
    if (currentIndex < data.length - 1) {
      setCurrentIndex(currentIndex + 1);
      stopSpeaking();
    }
  };

  const prevWord = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      stopSpeaking();
    }
  };

  const resetToFirst = () => {
    setCurrentIndex(0);
    stopSpeaking();
  };

  const goToWord = (index) => {
    setCurrentIndex(index);
    stopSpeaking();
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <Card style={{ textAlign: "center", minWidth: 300 }}>
          <Spin size="large" />
          <div style={{ marginTop: 16 }}>
            <Text>Đang tải dữ liệu từ vựng...</Text>
          </div>
        </Card>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <Card>
          <Empty description="Không có dữ liệu từ vựng" />
        </Card>
      </div>
    );
  }

  const currentWord = data[currentIndex];
  const languageInfo = getLanguageInfo(currentWord.tag);
  const progressPercent = ((currentIndex + 1) / data.length) * 100;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "24px",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Header */}
        <Card style={{ marginBottom: 24, textAlign: "center" }}>
          <Title level={2} style={{ margin: 0, color: "#1890ff" }}>
            🎯 Phát Âm Từ Vựng Đa Ngôn Ngữ
          </Title>
          <Text type="secondary">Học phát âm chuẩn với công nghệ AI</Text>
        </Card>

        <Row gutter={[24, 24]}>
          {/* Main Learning Panel */}
          <Col xs={24} lg={16}>
            <Card style={{ height: "100%" }} bodyStyle={{ padding: "32px" }}>
              {/* Progress */}
              <div style={{ marginBottom: 32 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <Text strong>Tiến độ học tập</Text>
                  <Badge
                    count={`${currentIndex + 1}/${data.length}`}
                    style={{ backgroundColor: "#52c41a" }}
                  />
                </div>
                <Progress
                  percent={progressPercent}
                  strokeColor={{
                    "0%": "#108ee9",
                    "100%": "#87d068",
                  }}
                  trailColor="#f0f0f0"
                />
              </div>

              {/* Current Word Display */}
              <div style={{ textAlign: "center", marginBottom: 32 }}>
                <div style={{ marginBottom: 16 }}>
                  <Tag
                    color={languageInfo.color}
                    style={{ fontSize: "14px", padding: "8px 16px" }}
                  >
                    {languageInfo.flag} {languageInfo.name}
                  </Tag>
                </div>

                <Title
                  level={1}
                  style={{
                    fontSize: "4rem",
                    margin: "24px 0",
                    color: "#1890ff",
                    textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
                  }}
                >
                  {currentWord.front}
                </Title>

                {/* Main Play Button */}
                <Button
                  type="primary"
                  size="large"
                  icon={
                    isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />
                  }
                  onClick={() =>
                    isPlaying
                      ? stopSpeaking()
                      : speakWord(currentWord.front, currentWord.tag)
                  }
                  style={{
                    height: "60px",
                    fontSize: "18px",
                    borderRadius: "30px",
                    minWidth: "200px",
                    background: isPlaying
                      ? "#ff4d4f"
                      : "linear-gradient(45deg, #1890ff, #722ed1)",
                    border: "none",
                    boxShadow: "0 4px 15px 0 rgba(24, 144, 255, 0.35)",
                  }}
                >
                  {isPlaying ? "Dừng phát âm" : "Phát âm"}
                </Button>
              </div>

              {/* Navigation Controls */}
              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <Space size="middle">
                  <Tooltip title="Từ trước">
                    <Button
                      icon={<StepBackwardOutlined />}
                      onClick={prevWord}
                      disabled={currentIndex === 0}
                      size="large"
                    >
                      Trước
                    </Button>
                  </Tooltip>

                  <Tooltip title="Về đầu">
                    <Button
                      icon={<ReloadOutlined />}
                      onClick={resetToFirst}
                      size="large"
                    >
                      Đầu
                    </Button>
                  </Tooltip>

                  <Tooltip title="Từ tiếp theo">
                    <Button
                      icon={<StepForwardOutlined />}
                      onClick={nextWord}
                      disabled={currentIndex === data.length - 1}
                      size="large"
                    >
                      Tiếp
                    </Button>
                  </Tooltip>
                </Space>
              </div>

              <Divider />

              {/* Speed Control */}
              <Card size="small" style={{ backgroundColor: "#fafafa" }}>
                <div style={{ marginBottom: 16 }}>
                  <Text strong>
                    <SoundOutlined style={{ marginRight: 8 }} />
                    Tốc độ phát âm: {speechRate}x
                  </Text>
                </div>
                <Slider
                  min={0.5}
                  max={2}
                  step={0.1}
                  value={speechRate}
                  onChange={setSpeechRate}
                  marks={{
                    0.5: "Chậm",
                    1: "Bình thường",
                    1.5: "Nhanh",
                    2: "Rất nhanh",
                  }}
                />
              </Card>
            </Card>
          </Col>

          {/* Word List Sidebar */}
          <Col xs={24} lg={8}>
            <Card
              title={
                <div>
                  📚 Danh sách từ vựng
                  <Badge
                    count={data.length}
                    style={{ marginLeft: 8, backgroundColor: "#1890ff" }}
                  />
                </div>
              }
              style={{ height: "100%" }}
              bodyStyle={{ padding: 0, maxHeight: "600px", overflow: "auto" }}
            >
              <List
                dataSource={data}
                renderItem={(item, index) => {
                  const langInfo = getLanguageInfo(item.tag);
                  const isActive = index === currentIndex;

                  return (
                    <List.Item
                      style={{
                        padding: "12px 16px",
                        cursor: "pointer",
                        backgroundColor: isActive ? "#e6f7ff" : "transparent",
                        borderLeft: isActive
                          ? "4px solid #1890ff"
                          : "4px solid transparent",
                        transition: "all 0.3s ease",
                      }}
                      onClick={() => goToWord(index)}
                    >
                      <List.Item.Meta
                        avatar={
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: 40,
                              height: 40,
                              borderRadius: "50%",
                              backgroundColor: isActive ? "#1890ff" : "#f0f0f0",
                              color: isActive ? "white" : "#666",
                              fontSize: "14px",
                              fontWeight: "bold",
                            }}
                          >
                            {index + 1}
                          </div>
                        }
                        title={
                          <div>
                            <Text
                              strong
                              style={{
                                color: isActive ? "#1890ff" : undefined,
                              }}
                            >
                              {item.front}
                            </Text>
                            {isActive && (
                              <Badge
                                status="processing"
                                style={{ marginLeft: 8 }}
                              />
                            )}
                          </div>
                        }
                        description={
                          <Tag color={langInfo.color} size="small">
                            {langInfo.flag} {langInfo.name}
                          </Tag>
                        }
                      />
                      <Button
                        type="text"
                        icon={<SoundOutlined />}
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          speakWord(item.front, item.tag);
                        }}
                        style={{ color: "#1890ff" }}
                      />
                    </List.Item>
                  );
                }}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default PronunciationComponent;
