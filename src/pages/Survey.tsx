
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { EnhancedSurveyForm } from "@/components/EnhancedSurveyForm";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import { checkIfUserCanTakeSurvey } from "@/lib/survey-service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const Survey = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isEligible, setIsEligible] = useState<boolean | null>(null);
  const [ineligibilityReason, setIneligibilityReason] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const checkAuth = async () => {
      // If no user, redirect to login
      if (!user) {
        navigate("/login");
        return;
      }
      
      try {
        setIsLoading(true);
        const { canTakeSurvey, reason } = await checkIfUserCanTakeSurvey(user.id);
        setIsEligible(canTakeSurvey);
        setIneligibilityReason(reason || null);
      } catch (error) {
        console.error("Error checking eligibility:", error);
        toast({
          title: "Error checking eligibility",
          description: "An unexpected error occurred. Please try again later.",
          variant: "destructive",
        });
        setIsEligible(false);
        setIneligibilityReason("An unexpected error occurred. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [user, navigate, toast]);

  // Show login message if not authenticated
  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle className="text-center">Authentication Required</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center mb-6">Please sign in to access the survey.</p>
              <div className="flex justify-center">
                <Button onClick={() => navigate("/login")}>
                  Go to Login
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin text-umrah-purple mx-auto mb-2" />
            <p>Checking eligibility...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isEligible) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle className="text-center text-red-500">Survey Not Available</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center mb-6">{ineligibilityReason}</p>
              <div className="flex justify-center">
                <Button onClick={() => navigate("/dashboard")}>
                  Go to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-3xl mx-auto mb-8">
            <h1 className="text-3xl font-bold text-center mb-2">
              {t("survey.title")}
            </h1>
            <p className="text-center text-gray-600 dark:text-gray-300">
              {t("survey.instruction")}
            </p>
          </div>
          
          <EnhancedSurveyForm />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Survey;
