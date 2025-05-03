import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/hooks/useLanguage";
import { SurveyProgress } from "@/components/SurveyComponents/SurveyProgress";
import { SurveySection } from "@/components/SurveyComponents/SurveySection";
import { RatingQuestion } from "@/components/RatingQuestion";
import { MultipleChoiceQuestion } from "@/components/SurveyComponents/MultipleChoiceQuestion";
import { CheckboxQuestion } from "@/components/SurveyComponents/CheckboxQuestion";
import { SliderQuestion } from "@/components/SurveyComponents/SliderQuestion";
import { TextQuestion } from "@/components/SurveyComponents/TextQuestion";
import { useAuth } from "@/hooks/useAuth";
import { submitSurvey } from "@/lib/survey-service";

type SurveyResponse = {
  id: string;
  type: "rating" | "choice" | "checkbox" | "slider" | "text";
  value: any;
  comment?: string;
};

interface SurveySectionData {
  id: string;
  title: string;
  description?: string;
  questions: SurveyQuestion[];
}

interface SurveyQuestion {
  id: string;
  type: "rating" | "choice" | "checkbox" | "slider" | "text";
  question: {
    en: string;
    ar: string;
  };
  required?: boolean;
  options?: { value: string; label: { en: string; ar: string } }[];
  allowOther?: boolean;
  multiline?: boolean;
  min?: number;
  max?: number;
  step?: number;
  labels?: { en: string; ar: string }[];
  commentRequired?: boolean;
  placeholder?: { en: string; ar: string };
  maxLength?: number;
}

// Survey data structure with sections and questions
const surveyData: SurveySectionData[] = [
  {
    id: "general",
    title: "survey.section.general",
    description: "survey.instruction",
    questions: [
      {
        id: "overall_satisfaction",
        type: "rating",
        question: {
          en: "How would you rate your overall Umrah experience?",
          ar: "كيف تقيم تجربة العمرة الخاصة بك بشكل عام؟",
        },
        required: true,
      },
      {
        id: "visit_purpose",
        type: "choice",
        question: {
          en: "What was the primary purpose of your Umrah visit?",
          ar: "ما هو الغرض الرئيسي من زيارتك للعمرة؟",
        },
        options: [
          { 
            value: "religious", 
            label: { 
              en: "Religious obligation/spiritual fulfillment", 
              ar: "الالتزام الديني / الإشباع الروحي"
            }
          },
          { 
            value: "family", 
            label: { 
              en: "Family tradition", 
              ar: "تقليد عائلي"
            }
          },
          { 
            value: "personal", 
            label: { 
              en: "Personal spiritual journey", 
              ar: "رحلة روحانية شخصية"
            }
          },
        ],
        allowOther: true,
      }
    ]
  },
  {
    id: "accommodation",
    title: "survey.section.accommodation",
    questions: [
      {
        id: "accommodation_rating",
        type: "slider",
        question: {
          en: "How satisfied were you with your accommodation during your stay?",
          ar: "ما مدى رضاك عن مكان إقامتك خلال فترة إقامتك؟",
        },
        min: 1,
        max: 10,
        labels: [
          { en: "Very Dissatisfied", ar: "غير راضٍ جدًا" },
          { en: "Neutral", ar: "محايد" },
          { en: "Very Satisfied", ar: "راضٍ جدًا" },
        ],
        commentRequired: true,
        required: true,
      },
      {
        id: "accommodation_issues",
        type: "checkbox",
        question: {
          en: "Did you experience any of these issues with your accommodation?",
          ar: "هل واجهت أيًا من هذه المشكلات في مكان إقامتك؟",
        },
        options: [
          { 
            value: "cleanliness", 
            label: { 
              en: "Cleanliness issues", 
              ar: "مشاكل في النظافة"
            }
          },
          { 
            value: "noise", 
            label: { 
              en: "Excessive noise", 
              ar: "ضوضاء مفرطة"
            }
          },
          { 
            value: "maintenance", 
            label: { 
              en: "Maintenance problems", 
              ar: "مشاكل الصيانة"
            }
          },
          { 
            value: "staff", 
            label: { 
              en: "Unhelpful staff", 
              ar: "موظفون غير متعاونين"
            }
          },
          { 
            value: "none", 
            label: { 
              en: "No issues", 
              ar: "لا توجد مشاكل"
            }
          }
        ],
        allowOther: true,
      }
    ]
  },
  {
    id: "transportation",
    title: "survey.section.transportation",
    questions: [
      {
        id: "transport_rating",
        type: "rating",
        question: {
          en: "How would you rate the transportation services during your Umrah?",
          ar: "كيف تقيم خدمات النقل خلال العمرة؟",
        },
        required: true,
      },
      {
        id: "transport_modes",
        type: "checkbox",
        question: {
          en: "Which modes of transportation did you use during your visit?",
          ar: "ما وسائل النقل التي استخدمتها خلال زيارتك؟",
        },
        options: [
          { 
            value: "bus", 
            label: { 
              en: "Public buses", 
              ar: "حافلات عامة"
            }
          },
          { 
            value: "taxi", 
            label: { 
              en: "Taxis", 
              ar: "سيارات أجرة"
            }
          },
          { 
            value: "rideshare", 
            label: { 
              en: "Ride sharing services", 
              ar: "خدمات مشاركة الركوب"
            }
          },
          { 
            value: "private", 
            label: { 
              en: "Private transportation", 
              ar: "وسائل نقل خاصة"
            }
          },
          { 
            value: "walking", 
            label: { 
              en: "Walking", 
              ar: "المشي"
            }
          }
        ],
        allowOther: true,
      }
    ]
  },
  {
    id: "services",
    title: "survey.section.services",
    questions: [
      {
        id: "food_rating",
        type: "rating",
        question: {
          en: "How would you rate the food and dining options?",
          ar: "كيف تقيم خيارات الطعام والمطاعم؟",
        },
      },
      {
        id: "services_rating",
        type: "slider",
        question: {
          en: "How would you rate the services and facilities available to pilgrims?",
          ar: "كيف تقيم الخدمات والمرافق المتاحة للحجاج؟",
        },
        min: 1,
        max: 5,
        commentRequired: true,
      }
    ]
  },
  {
    id: "feedback",
    title: "survey.section.feedback",
    questions: [
      {
        id: "improvements",
        type: "text",
        question: {
          en: "What improvements would you suggest for future Umrah pilgrims?",
          ar: "ما التحسينات التي تقترحها لحجاج ا��عمرة في المستقبل؟",
        },
        multiline: true,
        maxLength: 500,
        placeholder: {
          en: "Please share your suggestions for improvements...",
          ar: "يرجى مشاركة اقتراحاتك للتحسينات..."
        }
      },
      {
        id: "positive_experiences",
        type: "text",
        question: {
          en: "What aspects of your Umrah experience did you find most positive?",
          ar: "ما هي جوانب تجربة العمرة التي وجدتها أكثر إيجابية؟",
        },
        multiline: true,
      }
    ]
  }
];

export const EnhancedSurveyForm = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [currentSection, setCurrentSection] = useState<number>(0);
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [certificate, setCertificate] = useState<string | null>(null);
  
  // Add a debounce ref to control toast frequency
  const saveTimeoutRef = useRef<number | null>(null);
  const lastToastTimeRef = useRef(0);
  const MIN_TOAST_INTERVAL = 10000; // 10 seconds between toasts
  
  // Auto-save progress to localStorage with debounced toast
  useEffect(() => {
    if (responses.length > 0) {
      // Always save to localStorage
      localStorage.setItem("surveyResponses", JSON.stringify({
        responses,
        lastUpdated: new Date().toISOString(),
        completedSections: currentSection,
      }));
      
      // But debounce the toast notification
      if (saveTimeoutRef.current !== null) {
        window.clearTimeout(saveTimeoutRef.current);
      }
      
      const now = Date.now();
      if (now - lastToastTimeRef.current > MIN_TOAST_INTERVAL) {
        // Only show toast if enough time has passed since last one
        toast({
          title: t("survey.saved"),
          description: "",
          duration: 2000,
        });
        lastToastTimeRef.current = now;
      }
    }
  }, [responses, currentSection, t, toast]);
  
  // Load saved responses if any
  useEffect(() => {
    const savedData = localStorage.getItem("surveyResponses");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setResponses(parsed.responses || []);
      setCurrentSection(parsed.completedSections || 0);
    }
  }, []);
  
  // Generate a certificate (mock function)
  const generateCertificate = () => {
    const certText = `
      CERTIFICATE OF PARTICIPATION
      
      This is to certify that
      
      ${user?.user_metadata?.full_name || 'Valued Participant'}
      
      has provided valuable feedback to help improve the Umrah experience.
      
      Date: ${new Date().toLocaleDateString()}
    `;
    
    setCertificate(certText);
  };

  const handleRatingChange = (id: string, rating: number, comment: string = "") => {
    setResponses((prev) => {
      const existing = prev.find((r) => r.id === id);
      if (existing) {
        return prev.map((r) => (r.id === id ? { ...r, type: "rating", value: rating, comment } : r));
      } else {
        return [...prev, { id, type: "rating", value: rating, comment }];
      }
    });
  };
  
  const handleChoiceChange = (id: string, value: string, comment: string = "") => {
    setResponses((prev) => {
      const existing = prev.find((r) => r.id === id);
      if (existing) {
        return prev.map((r) => (r.id === id ? { ...r, type: "choice", value, comment } : r));
      } else {
        return [...prev, { id, type: "choice", value, comment }];
      }
    });
  };
  
  const handleCheckboxChange = (id: string, values: string[], comment: string = "") => {
    setResponses((prev) => {
      const existing = prev.find((r) => r.id === id);
      if (existing) {
        return prev.map((r) => (r.id === id ? { ...r, type: "checkbox", value: values, comment } : r));
      } else {
        return [...prev, { id, type: "checkbox", value: values, comment }];
      }
    });
  };
  
  const handleSliderChange = (id: string, value: number, comment: string = "") => {
    setResponses((prev) => {
      const existing = prev.find((r) => r.id === id);
      if (existing) {
        return prev.map((r) => (r.id === id ? { ...r, type: "slider", value, comment } : r));
      } else {
        return [...prev, { id, type: "slider", value, comment }];
      }
    });
  };
  
  const handleTextChange = (id: string, value: string) => {
    setResponses((prev) => {
      const existing = prev.find((r) => r.id === id);
      if (existing) {
        return prev.map((r) => (r.id === id ? { ...r, type: "text", value } : r));
      } else {
        return [...prev, { id, type: "text", value }];
      }
    });
  };
  
  const validateSection = (sectionIndex: number) => {
    const section = surveyData[sectionIndex];
    const requiredQuestions = section.questions.filter(q => q.required);
    
    for (const q of requiredQuestions) {
      const response = responses.find(r => r.id === q.id);
      if (!response) {
        return false;
      }
      
      // For rating and slider questions, check if a response with low rating has a comment
      if ((q.type === 'rating' || q.type === 'slider') && 
          response.value <= 2 && 
          (!response.comment || response.comment.trim() === '')) {
        return false;
      }
    }
    
    return true;
  };
  
  const handleNextSection = () => {
    if (validateSection(currentSection)) {
      if (currentSection < surveyData.length - 1) {
        setCurrentSection(currentSection + 1);
        window.scrollTo(0, 0);
      } else {
        handleSubmit();
      }
    } else {
      toast({
        title: t("survey.required.error"),
        variant: "destructive",
      });
    }
  };
  
  const handlePrevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      window.scrollTo(0, 0);
    }
  };
  
  const handleSubmit = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to submit your feedback",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    
    setIsSubmitting(true);
    
    // Format survey data for submission
    const surveyData = {
      title: "Umrah Feedback",
      user_id: user.id,
      answers: {
        responses,
        submittedAt: new Date().toISOString(),
      }
    };
    
    // Submit to Supabase
    submitSurvey(surveyData)
      .then(() => {
        setIsSubmitting(false);
        setShowThankYou(true);
        generateCertificate();
        
        // Clear the in-progress data
        localStorage.removeItem("surveyResponses");
      })
      .catch(error => {
        setIsSubmitting(false);
        toast({
          title: "Error",
          description: "Failed to submit survey: " + error.message,
          variant: "destructive",
        });
      });
  };
  
  // Render thank you page if submitted
  if (showThankYou) {
    return (
      <SurveySection 
        title={t("survey.thank.you")}
        className="animate-fade-in"
      >
        <div className="py-8 text-center">
          <div className="text-green-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <p className="text-lg mb-6">{t("survey.thank.you.message")}</p>
          
          {certificate && (
            <div className="mb-6 p-6 border rounded-md bg-white dark:bg-gray-800 max-w-md mx-auto">
              <div className="font-serif whitespace-pre-line">
                {certificate}
              </div>
            </div>
          )}
          
          <div className="space-x-4">
            {certificate && (
              <Button 
                onClick={() => {
                  // Mock download as we can't actually create a file in this environment
                  toast({
                    title: "Certificate Downloaded",
                    description: "Thank you for your participation!",
                  });
                }}
                variant="outline"
              >
                Download Certificate
              </Button>
            )}
            
            <Button 
              onClick={() => navigate("/dashboard")}
              className="bg-umrah-purple hover:bg-umrah-purple-dark"
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      </SurveySection>
    );
  }
  
  // Get current section data
  const currentSectionData = surveyData[currentSection];
  
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardContent className="pt-6">
        <SurveyProgress 
          currentStep={currentSection + 1} 
          totalSteps={surveyData.length} 
        />
        
        <SurveySection
          title={t(currentSectionData.title)}
          description={currentSectionData.description ? t(currentSectionData.description) : undefined}
          className="border-0 shadow-none px-0"
        >
          {currentSectionData.questions.map((q) => {
            const response = responses.find(r => r.id === q.id);
            
            if (q.type === "rating") {
              return (
                <RatingQuestion
                  key={q.id}
                  id={q.id}
                  question={language === "en" ? q.question.en : q.question.ar}
                  onChange={handleRatingChange}
                />
              );
            }
            
            if (q.type === "choice") {
              return (
                <MultipleChoiceQuestion
                  key={q.id}
                  id={q.id}
                  question={language === "en" ? q.question.en : q.question.ar}
                  options={q.options?.map(opt => ({
                    value: opt.value,
                    label: language === "en" ? opt.label.en : opt.label.ar
                  })) || []}
                  allowOther={q.allowOther}
                  required={q.required}
                  onChange={handleChoiceChange}
                />
              );
            }
            
            if (q.type === "checkbox") {
              return (
                <CheckboxQuestion
                  key={q.id}
                  id={q.id}
                  question={language === "en" ? q.question.en : q.question.ar}
                  options={q.options?.map(opt => ({
                    value: opt.value,
                    label: language === "en" ? opt.label.en : opt.label.ar
                  })) || []}
                  allowOther={q.allowOther}
                  required={q.required}
                  onChange={handleCheckboxChange}
                />
              );
            }
            
            if (q.type === "slider") {
              return (
                <SliderQuestion
                  key={q.id}
                  id={q.id}
                  question={language === "en" ? q.question.en : q.question.ar}
                  min={q.min}
                  max={q.max}
                  step={q.step}
                  labels={q.labels?.map(label => 
                    language === "en" ? label.en : label.ar
                  )}
                  required={q.required}
                  commentRequired={q.commentRequired}
                  onChange={handleSliderChange}
                />
              );
            }
            
            if (q.type === "text") {
              return (
                <TextQuestion
                  key={q.id}
                  id={q.id}
                  question={language === "en" ? q.question.en : q.question.ar}
                  multiline={q.multiline}
                  placeholder={q.placeholder ? (language === "en" ? q.placeholder.en : q.placeholder.ar) : ""}
                  required={q.required}
                  maxLength={q.maxLength}
                  onChange={handleTextChange}
                />
              );
            }
            
            return null;
          })}
        </SurveySection>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevSection}
          disabled={currentSection === 0}
        >
          {t("survey.previous")}
        </Button>
        
        <Button 
          className="bg-umrah-purple hover:bg-umrah-purple-dark"
          onClick={currentSection === surveyData.length - 1 ? handleSubmit : handleNextSection}
          disabled={isSubmitting}
        >
          {isSubmitting 
            ? t("survey.saving")
            : (currentSection === surveyData.length - 1 
              ? t("survey.complete") 
              : t("survey.next"))
          }
        </Button>
      </CardFooter>
    </Card>
  );
};
