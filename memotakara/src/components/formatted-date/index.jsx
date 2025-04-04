const FormattedDate = ({ dateString }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${hours}:${minutes}:${seconds}
    ${day}/${month}/${year}`;
  };

  return (
    <div>
      <p>{formatDate(dateString)}</p>
    </div>
  );
};

export default FormattedDate;
