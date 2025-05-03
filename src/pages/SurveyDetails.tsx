
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getSurveyById } from "@/lib/survey-service";

interface SurveyDetailProps {
  id: string;
  title: string;
  created_at: string;
  answers: any;
}

const SurveyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [survey, setSurvey] = useState<SurveyDetailProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    
    if (!id) return;
    
    setLoading(true);
    getSurveyById(id)
      .then(data => {
        setSurvey(data);
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to load survey details");
        setLoading(false);
      });
  }, [id, user, navigate]);
  
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 bg-background">
          <div className="container mx-auto px-4 py-8">
            <div>Loading survey details...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (error || !survey) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 bg-background">
          <div className="container mx-auto px-4 py-8">
            <Card>
              <CardContent className="pt-6">
                <div className="text-red-500">{error || "Survey not found"}</div>
                <Button className="mt-4" onClick={() => navigate('/dashboard')}>
                  Back to Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle>{survey.title}</CardTitle>
              <p className="text-sm text-muted-foreground">
                Submitted on: {new Date(survey.created_at).toLocaleDateString()}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Survey Responses</h2>
                
                {survey.answers.responses && (
                  <div className="space-y-6">
                    {survey.answers.responses.map((response: any, index: number) => (
                      <div key={response.id || index} className="border-b pb-4">
                        <p className="font-medium">Question: {response.id}</p>
                        <div className="flex items-center mt-2">
                          <span className="font-semibold mr-2">Rating:</span>
                          <span>{response.value}</span>
                        </div>
                        {response.comment && (
                          <div className="mt-2">
                            <span className="font-semibold">Comment:</span>
                            <p className="mt-1 text-gray-600">{response.comment}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="pt-4">
                  <Button onClick={() => navigate('/dashboard')}>
                    Back to Dashboard
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SurveyDetails;
