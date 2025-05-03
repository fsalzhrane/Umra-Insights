import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SentimentAnalysisChart } from "@/components/SentimentAnalysisChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { getAllSurveysForAdmin } from "@/lib/survey-service";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { SurveyInsights } from "@/components/SurveyInsights";

export const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [surveys, setSurveys] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const [stats, setStats] = useState({
    totalResponses: 0,
    averageSatisfaction: 0,
    positiveResponses: 0,
    negativeResponses: 0,
    neutralResponses: 0
  });
  
  // Get all surveys for admin
  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const data = await getAllSurveysForAdmin();
        setSurveys(data || []);
        
        // Calculate statistics
        if (data && data.length > 0) {
          calculateStats(data);
        }
      } catch (err) {
        console.error("Error fetching admin data:", err);
        setError("Failed to load survey data");
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSurveys();
  }, [toast]);
  
  // Calculate statistics from survey data
  const calculateStats = (surveyData: any[]) => {
    let totalRatings = 0;
    let ratingCount = 0;
    let positive = 0;
    let negative = 0;
    let neutral = 0;
    
    surveyData.forEach(survey => {
      const responses = survey.answers.responses || [];
      
      responses.forEach((response: any) => {
        if (response.type === 'rating' || response.type === 'slider') {
          const value = response.value;
          if (value) {
            totalRatings += value;
            ratingCount++;
            
            // Simple sentiment categorization based on rating
            if (value > 3) positive++;
            else if (value < 3) negative++;
            else neutral++;
          }
        }
      });
    });
    
    setStats({
      totalResponses: surveyData.length,
      averageSatisfaction: ratingCount > 0 ? +(totalRatings / ratingCount).toFixed(2) : 0,
      positiveResponses: positive,
      negativeResponses: negative,
      neutralResponses: neutral
    });
  };
  
  if (isLoading) {
    return (
      <div className="grid gap-6">
        <Card className="p-6">
          <p className="text-center">Loading analytics data...</p>
        </Card>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="grid gap-6">
        <Card className="p-6">
          <p className="text-center text-red-500">{error}</p>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalResponses}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Satisfaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageSatisfaction} / 5</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Sentiment Ratio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.positiveResponses} / {stats.neutralResponses} / {stats.negativeResponses}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Positive / Neutral / Negative</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="analytics">
        <TabsList className="mb-4">
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="responses">Recent Responses</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Sentiment Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <SentimentAnalysisChart />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="responses">
          <Card>
            <CardHeader>
              <CardTitle>Recent Survey Responses</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Key Findings</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {surveys.length > 0 ? (
                    surveys.slice(0, 10).map((survey) => (
                      <TableRow key={survey.id}>
                        <TableCell>{new Date(survey.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>{survey.title}</TableCell>
                        <TableCell>
                          {survey.answers.responses && survey.answers.responses.some(
                            (r: any) => r.type === 'text' && r.value && r.value.length > 0
                          ) ? (
                            <span className="text-green-600">Contains comments</span>
                          ) : (
                            <span className="text-gray-500">No comments provided</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center">No survey responses yet</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="insights">
          <SurveyInsights />
        </TabsContent>
      </Tabs>
    </div>
  );
};
