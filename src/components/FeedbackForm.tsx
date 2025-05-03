import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { RatingQuestion } from "./RatingQuestion";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import { submitSurvey } from "@/lib/survey-service";

// Survey questions
const surveyQuestions = [
  {
    id: "q1",
    en: "How would you rate the overall Umrah experience?",
    ar: "كيف تقيم تجربة العمرة بشكل عام؟",
  },
  {
    id: "q2",
    en: "How satisfied were you with the transportation services?",
    ar: "ما مدى رضاك عن خدمات النقل؟",
  },
  {
    id: "q3",
    en: "How would you rate the accommodation facilities?",
    ar: "كيف تقيم مرافق الإقامة؟",
  },
  {
    id: "q4",
    en: "How satisfied were you with the crowd management?",
    ar: "ما مدى رضاك عن إدارة الحشود؟",
  },
  {
    id: "q5",
    en: "How would you rate the clarity of guidance and instructions provided?",
    ar: "كيف تقيم وضوح التوجيهات والتعليمات المقدمة؟",
  },
];

type QuestionResponse = {
  id: string;
  rating: number;
  comment: string;
};

export const FeedbackForm = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [responses, setResponses] = useState<QuestionResponse[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleResponseChange = (id: string, rating: number, comment: string) => {
    setResponses((prev) => {
      const existing = prev.find((r) => r.id === id);
      if (existing) {
        return prev.map((r) => (r.id === id ? { ...r, rating, comment } : r));
      } else {
        return [...prev, { id, rating, comment }];
      }
    });
  };

  const validateResponses = () => {
    // Check if all questions are answered
    if (responses.length < surveyQuestions.length) {
      toast({
        title: "Incomplete Survey",
        description: "Please answer all questions before submitting",
        variant: "destructive",
      });
      return false;
    }

    // Check if comments are provided for low ratings
    for (const response of responses) {
      if (response.rating <= 2 && !response.comment.trim()) {
        toast({
          title: "Comments Required",
          description: "Please provide comments for ratings of 2 or lower",
          variant: "destructive",
        });
        return false;
      }
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to submit your feedback",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    if (!validateResponses()) {
      return;
    }

    setIsSubmitting(true);

    // Format survey data for submission
    const surveyData = {
      title: "Simple Feedback",
      user_id: user.id,
      answers: {
        responses,
        timestamp: new Date().toISOString(),
      }
    };

    // Submit to Supabase
    submitSurvey(surveyData)
      .then(() => {
        setIsSubmitting(false);
        
        toast({
          title: "Feedback Submitted",
          description: "Thank you for sharing your feedback",
        });
        
        // Redirect to dashboard
        navigate("/dashboard");
      })
      .catch(error => {
        setIsSubmitting(false);
        toast({
          title: "Error",
          description: "Failed to submit feedback: " + error.message,
          variant: "destructive",
        });
      });
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-2xl">{t("survey.title")}</CardTitle>
        <p className="text-center text-sm text-gray-500 mt-2">
          {t("survey.instruction")}
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          {surveyQuestions.map((q) => (
            <RatingQuestion
              key={q.id}
              id={q.id}
              question={language === "en" ? q.en : q.ar}
              onChange={handleResponseChange}
            />
          ))}
        </form>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full bg-umrah-purple hover:bg-umrah-purple-dark"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : t("survey.submit")}
        </Button>
      </CardFooter>
    </Card>
  );
};
