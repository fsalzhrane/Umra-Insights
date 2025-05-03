
import { useLanguage } from "@/hooks/useLanguage";

export const Footer = () => {
  const { t, language } = useLanguage();
  
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto py-6 px-4 overflow-hidden sm:px-6 lg:px-8">
        <div className="mt-4 flex justify-center space-x-6">
          <p className="text-center text-sm text-gray-500">
            &copy; {currentYear} Hajj & Umrah Insights. {language === "en" ? "All rights reserved." : "جميع الحقوق محفوظة."}
          </p>
        </div>
      </div>
    </footer>
  );
};
