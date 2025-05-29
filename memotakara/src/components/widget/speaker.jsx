import { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeHigh, faPause } from "@fortawesome/free-solid-svg-icons";

function MemoSpeaker({ text, lang }) {
  const { t } = useTranslation();
  const [voices, setVoices] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const synth = window.speechSynthesis;

    const populateVoiceList = () => {
      const availableVoices = synth.getVoices();
      setVoices(availableVoices);
    };

    // Load voices khi component mount
    populateVoiceList();

    // Lắng nghe sự kiện voices thay đổi
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = populateVoiceList;
    }

    // Cleanup khi component unmount
    return () => {
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }
      setIsPlaying(false);
    };
  }, []);

  // Tìm voice phù hợp với ngôn ngữ
  const findBestVoice = useCallback(
    (targetLang) => {
      if (!voices.length || !targetLang) return null;

      // Tìm voice chính xác với language tag
      let voice = voices.find((v) => v.lang === targetLang);

      // Nếu không tìm thấy, tìm voice với ngôn ngữ chính (ví dụ: en từ en-US)
      if (!voice) {
        const mainLang = targetLang.split("-")[0];
        voice = voices.find((v) => v.lang.startsWith(mainLang));
      }

      // Ưu tiên voice local (không remote)
      if (!voice) {
        voice = voices.find((v) => !v.voiceURI.includes("remote"));
      }

      return voice || voices[0]; // Fallback về voice đầu tiên
    },
    [voices]
  );

  // Hành động khi click nút phát âm
  const handleSpeak = useCallback(() => {
    if (!text || !text.trim()) return;

    const synth = window.speechSynthesis;

    // Nếu đang phát thì dừng
    if (isPlaying) {
      synth.cancel();
      setIsPlaying(false);
      return;
    }

    // Dừng phát âm hiện tại (nếu có)
    if (synth.speaking) {
      synth.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text.trim());

    // Cấu hình ngôn ngữ
    if (lang) {
      utterance.lang = lang;
    }

    // Tìm và set voice phù hợp
    const selectedVoice = findBestVoice(lang);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    // Cấu hình các thông số phát âm
    utterance.rate = 1; // Tốc độ (0.1 - 10)
    utterance.pitch = 1; // Cao độ (0 - 2)
    utterance.volume = 1; // Âm lượng (0 - 1)

    // Event handlers
    utterance.onstart = () => {
      setIsPlaying(true);
    };

    utterance.onend = () => {
      setIsPlaying(false);
    };

    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event.error);
      setIsPlaying(false);
    };

    utterance.onpause = () => {
      setIsPlaying(false);
    };

    utterance.onresume = () => {
      setIsPlaying(true);
    };

    // Bắt đầu phát âm
    synth.speak(utterance);
  }, [text, lang, isPlaying, findBestVoice]);

  // Kiểm tra hỗ trợ Web Speech API
  if (!("speechSynthesis" in window)) {
    return null; // Không hiển thị nếu không hỗ trợ
  }

  return (
    <FontAwesomeIcon
      icon={isPlaying ? faPause : faVolumeHigh}
      style={{
        fontSize: "var(--body-size)",
        color: isPlaying ? "var(--color-danger)" : "var(--color-light-button)",
        marginRight: "5px",
        cursor: "pointer",
        transition: "color 0.3s ease",
      }}
      onClick={handleSpeak}
      title={
        isPlaying
          ? t("components.speaker.stop")
          : t("components.speaker.pronounce")
      }
    />
  );
}

export default MemoSpeaker;
