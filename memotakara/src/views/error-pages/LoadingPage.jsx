import { Spin } from "antd";

const LoadingPage = () => {
  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "80px",
      }}
    >
      <h2>
        <Spin /> Loading... Please wait!
      </h2>
    </div>
  );
};

export default LoadingPage;
