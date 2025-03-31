import { useState } from "react";
import { sendNotification } from "@/api/admin";

const NotificationManagement = () => {
  const [message, setMessage] = useState("");

  const handleSendNotification = async () => {
    await sendNotification(message);
    setMessage("");
  };

  return (
    <div>
      <h2>Quản lý thông báo</h2>
      <textarea value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={handleSendNotification}>Gửi</button>
    </div>
  );
};

export default NotificationManagement;
