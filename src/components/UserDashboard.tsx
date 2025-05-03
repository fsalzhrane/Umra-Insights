
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

type Survey = {
  id: string;
  title: string;
  created_at: string;
  answers: any;
  user_id: string;
};

export const UserDashboard = () => {
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const { data: surveys, isLoading } = useQuery({
    queryKey: ['user-surveys', user?.id],
    queryFn: async () => {
      try {
        if (!user) return [];
        
        const { data, error } = await supabase
          .from('surveys')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Error fetching surveys:", error);
          setError(error.message);
          return [];
        }
        
        return data as Survey[];
      } catch (err) {
        console.error("Unexpected error:", err);
        setError("An unexpected error occurred");
        return [];
      }
    },
    enabled: !!user
  });

  if (isLoading) {
    return <div className="p-8">Loading your surveys...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-500">Error loading surveys: {error}</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Survey History</CardTitle>
      </CardHeader>
      <CardContent>
        {surveys && surveys.length > 0 ? (
          <div className="space-y-4">
            {surveys.map((survey) => (
              <div
                key={survey.id}
                className="flex items-center justify-between border-b pb-4"
              >
                <div>
                  <h3 className="font-medium">{survey.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(survey.created_at).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/survey-details/${survey.id}`)}
                >
                  View Details
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">
            You haven't completed any surveys yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
};
