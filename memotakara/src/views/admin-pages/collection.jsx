import { useState, useEffect } from "react";
import {
  getCollections,
  createCollection,
  updateCollection,
  deleteCollection,
} from "@/api/admin";

const CollectionManagement = () => {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    const data = await getCollections();
    setCollections(data);
  };

  const handleDelete = async (id) => {
    await deleteCollection(id);
    fetchCollections();
  };

  return (
    <div>
      <h2>Quản lý collections</h2>
      <ul>
        {collections.map((col) => (
          <li key={col.id}>
            {col.name}
            <button onClick={() => handleDelete(col.id)}>Xóa</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CollectionManagement;
