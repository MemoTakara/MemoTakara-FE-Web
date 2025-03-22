import { createContext, useState, useContext } from "react";

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

const AppProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);

  return (
    <AppContext.Provider
      value={{ isLoading, setIsLoading, notifications, setNotifications }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
