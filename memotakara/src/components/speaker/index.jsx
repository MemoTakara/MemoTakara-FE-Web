import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeHigh } from "@fortawesome/free-solid-svg-icons";

function MemoSpeaker({ text, lang }) {
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    const synth = window.speechSynthesis;

    const populateVoiceList = () => {
      const availableVoices = synth.getVoices();
      setVoices(availableVoices);
    };

    // Đảm bảo danh sách giọng nói được cập nhật
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = populateVoiceList;
    }

    populateVoiceList();
  }, []);

  // Hành động khi click nút phát âm
  const handleSpeak = () => {
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang; // Sử dụng ngôn ngữ từ props

    const selectedVoice = voices.find((voice) => voice.lang === lang);
    if (selectedVoice) {
      utterance.voice = selectedVoice; // Chọn giọng nói tương ứng
    }

    window.speechSynthesis.speak(utterance);
  };

  return (
    <FontAwesomeIcon
      icon={faVolumeHigh}
      style={{
        fontSize: "var(--body-size)",
        color: "var(--color-light-button)",
        marginRight: "5px",
        cursor: "pointer",
      }}
      onClick={handleSpeak}
    />
  );
}

export default MemoSpeaker;
