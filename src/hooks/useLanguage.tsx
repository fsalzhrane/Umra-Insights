
import React, { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "ar";

type Translations = {
  [key: string]: {
    en: string;
    ar: string;
  };
};

// Enhanced translations
const translations: Translations = {
  // Navigation
  "nav.home": {
    en: "Home",
    ar: "الرئيسية",
  },
  "nav.survey": {
    en: "Survey",
    ar: "الاستبيان",
  },
  "nav.dashboard": {
    en: "Dashboard",
    ar: "لوحة المعلومات",
  },
  "nav.login": {
    en: "Login",
    ar: "تسجيل الدخول",
  },
  "nav.logout": {
    en: "Logout",
    ar: "تسجيل الخروج",
  },
  // Landing Page
  "landing.title": {
    en: "Hajj & Umrah Feedback & Sentiment Analysis System",
    ar: "نظام تحليل آراء وانطباعات الحج والعمرة",
  },
  "landing.subtitle": {
    en: "Improving pilgrim experiences through smart feedback collection and AI analysis",
    ar: "تحسين تجارب الحجاج من خلال جمع الآراء الذكية وتحليل الذكاء الاصطناعي",
  },
  "landing.cta": {
    en: "Take Survey",
    ar: "شارك في الاستبيان",
  },
  "landing.feature1.title": {
    en: "Smart Feedback Collection",
    ar: "جمع الآراء الذكية",
  },
  "landing.feature1.description": {
    en: "Simple surveys designed to capture what matters most to pilgrims",
    ar: "استبيانات بسيطة مصممة لالتقاط ما يهم الحجاج أكثر",
  },
  "landing.feature2.title": {
    en: "AI-Driven Analysis",
    ar: "تحليل مدعوم بالذكاء الاصطناعي",
  },
  "landing.feature2.description": {
    en: "Advanced sentiment analysis to identify trends and issues",
    ar: "تحليل متقدم للمشاعر لتحديد الاتجاهات والقضايا",
  },
  "landing.feature3.title": {
    en: "Real-Time Insights",
    ar: "رؤى في الوقت الفعلي",
  },
  "landing.feature3.description": {
    en: "Data-driven decisions to continuously improve pilgrim experiences",
    ar: "قرارات مبنية على البيانات لتحسين تجارب الحجاج باستمرار",
  },
  // Verification Form
  "verification.title": {
    en: "Verify Your Umrah Status",
    ar: "تحقق من حالة العمرة الخاصة بك",
  },
  "verification.description": {
    en: "Please enter your Nusuk ID or verification code to access the survey",
    ar: "يرجى إدخال معرف نسك الخاص بك أو رمز التحقق للوصول إلى الاستبيان",
  },
  "verification.input.placeholder": {
    en: "Enter your verification code",
    ar: "أدخل رمز التحقق الخاص بك",
  },
  "verification.button": {
    en: "Verify",
    ar: "تحقق",
  },
  // Login Form
  "login.title": {
    en: "Admin Login",
    ar: "تسجيل دخول المسؤول",
  },
  "login.email": {
    en: "Email",
    ar: "البريد الإلكتروني",
  },
  "login.password": {
    en: "Password",
    ar: "كلمة المرور",
  },
  "login.button": {
    en: "Login",
    ar: "تسجيل الدخول",
  },
  // Survey
  "survey.title": {
    en: "Umrah Experience Survey",
    ar: "استبيان تجربة العمرة",
  },
  "survey.instruction": {
    en: "Please rate your experience on a scale from 1 (poor) to 5 (excellent)",
    ar: "يرجى تقييم تجربتك على مقياس من 1 (ضعيف) إلى 5 (ممتاز)",
  },
  "survey.comment.required": {
    en: "Please share why you rated this aspect poorly",
    ar: "يرجى مشاركة سبب تقييمك لهذا الجانب بشكل سيئ",
  },
  "survey.submit": {
    en: "Submit Feedback",
    ar: "إرسال التعليقات",
  },
  
  // New survey translations
  "survey.progress": {
    en: "Survey Progress",
    ar: "تقدم الاستبيان",
  },
  "survey.next": {
    en: "Next",
    ar: "التالي",
  },
  "survey.previous": {
    en: "Previous",
    ar: "السابق",
  },
  "survey.start": {
    en: "Start Survey",
    ar: "ابدأ الاستبيان",
  },
  "survey.complete": {
    en: "Complete Survey",
    ar: "إكمال الاستبيان",
  },
  "survey.required.error": {
    en: "Please answer all required questions",
    ar: "يرجى الإجابة على جميع الأسئلة المطلوبة",
  },
  "survey.other": {
    en: "Other",
    ar: "أخرى",
  },
  "survey.otherPlaceholder": {
    en: "Please specify...",
    ar: "يرجى التحديد...",
  },
  "survey.pleaseExplain": {
    en: "Please explain your rating",
    ar: "يرجى شرح تقييمك",
  },
  "survey.ratingLabels.satisfaction": {
    en: "Very Dissatisfied,Neutral,Very Satisfied",
    ar: "غير راضٍ جدًا,محايد,راضٍ جدًا",
  },
  "survey.ratingLabels.agreement": {
    en: "Strongly Disagree,Neutral,Strongly Agree",
    ar: "لا أوافق بشدة,محايد,أوافق بشدة",
  },
  "survey.ratingLabels.frequency": {
    en: "Never,Sometimes,Always",
    ar: "أبدًا,أحيانًا,دائمًا",
  },
  "survey.saving": {
    en: "Saving your responses...",
    ar: "حفظ إجاباتك...",
  },
  "survey.saved": {
    en: "Progress saved!",
    ar: "تم حفظ التقدم!",
  },
  "survey.section.general": {
    en: "General Experience",
    ar: "التجربة العامة",
  },
  "survey.section.accommodation": {
    en: "Accommodation",
    ar: "الإقامة",
  },
  "survey.section.transportation": {
    en: "Transportation",
    ar: "المواصلات",
  },
  "survey.section.services": {
    en: "Services & Facilities",
    ar: "الخدمات والمرافق",
  },
  "survey.section.feedback": {
    en: "Additional Feedback",
    ar: "ملاحظات إضافية",
  },
  "survey.thank.you": {
    en: "Thank You!",
    ar: "شكرًا لك!",
  },
  "survey.thank.you.message": {
    en: "Your feedback is valuable to us and will help improve the Umrah experience for future pilgrims.",
    ar: "رأيك قيم بالنسبة لنا وسيساعد في تحسين تجربة العمرة للحجاج في المستقبل.",
  },
  
  // Dashboard
  "dashboard.title": {
    en: "Feedback Dashboard",
    ar: "لوحة معلومات التعليقات",
  },
  "dashboard.overall": {
    en: "Overall Satisfaction",
    ar: "الرضا العام",
  },
  "dashboard.top_issues": {
    en: "Top Issues",
    ar: "أهم القضايا",
  },
  "dashboard.trends": {
    en: "Trends Over Time",
    ar: "الاتجاهات مع مرور الوقت",
  },
  "dashboard.download": {
    en: "Download Report",
    ar: "تنزيل التقرير",
  },
};

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: string): string => {
    if (!translations[key]) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    return translations[key][language];
  };

  const isRTL = language === "ar";

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      <div className={isRTL ? "rtl" : "ltr"}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextValue => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
