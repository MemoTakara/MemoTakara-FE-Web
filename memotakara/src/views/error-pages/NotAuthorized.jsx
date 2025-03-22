const NotAuthorized = () => {
  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "80px",
      }}
    >
      <h1>403 - Forbidden</h1>
      <p>Please login to access this page.</p>
      <a href="/">Back to Home Page</a>
    </div>
  );
};

export default NotAuthorized;
