import AuthProvider from "@/contexts/AuthContext";
import ThemeProvider from "@/contexts/ThemeContext";
import LanguageProvider from "@/contexts/LanguageContext";
import AppProvider from "@/contexts/AppContext";

const Providers = ({ children }) => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LanguageProvider>
          <AppProvider>{children}</AppProvider>
        </LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default Providers;
