
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";

export const LanguageSelector = () => {
  const { language, setLanguage, isRTL } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ar" : "en");
  };

  return (
    <Button
      onClick={toggleLanguage}
      variant="ghost"
      size="sm"
      className="font-medium text-gray-700 hover:text-umrah-purple"
    >
      {language === "en" ? "العربية" : "English"}
    </Button>
  );
};
