
import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

// Sample data for sentiment analysis
const SENTIMENT_DATA = [
  { name: "Positive", value: 65, color: "#4ade80" }, // Green
  { name: "Neutral", value: 25, color: "#a3a3a3" },  // Gray
  { name: "Negative", value: 10, color: "#f87171" }, // Red
];

export const SentimentAnalysisChart = () => {
  const [topIssues, setTopIssues] = useState([
    { name: "Loading issues...", count: 0, sentiment: "neutral" },
  ]);

  useEffect(() => {
    const fetchTrendHistory = async () => {
      try {
        // Fetch the most recent trend history
        const { data, error } = await supabase
          .from('trend_history')
          .select('*')
          .order('analysed_at', { ascending: false })
          .limit(1);

        if (error) {
          throw error;
        }

        console.log("Fetched trend history:", data);

        if (data && data.length > 0 && data[0].problems) {
          const problemsData = data[0].problems;
          console.log("Problems data:", problemsData);
          
          if (typeof problemsData === 'object') {
            if (Array.isArray(problemsData)) {
              // Handle old format (just array of strings)
              const mappedIssues = problemsData.map((problem: string, index: number) => ({
                name: problem,
                count: 50 - index * 5,
                sentiment: "negative"
              }));
              setTopIssues(mappedIssues);
              console.log("Mapped issues (array format):", mappedIssues);
            } else if (problemsData.counts && Array.isArray(problemsData.counts)) {
              // Handle new format (object with list and counts)
              const mappedIssues = problemsData.counts.map((item: any) => ({
                name: item.problem as string,
                count: item.count as number,
                sentiment: "negative"
              }));
              setTopIssues(mappedIssues);
              console.log("Mapped issues (counts format):", mappedIssues);
            } else if (problemsData.list && Array.isArray(problemsData.list)) {
              // Handle new format (object with list) but no counts
              const mappedIssues = problemsData.list.map((problem: string, index: number) => ({
                name: problem,
                count: 50 - index * 5,
                sentiment: "negative"
              }));
              setTopIssues(mappedIssues);
              console.log("Mapped issues (list format):", mappedIssues);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching trend history:", error);
      }
    };

    fetchTrendHistory();
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sentiment Analysis</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={SENTIMENT_DATA}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {SENTIMENT_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Top 5 Issues Identified</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topIssues.length > 0 ? (
              topIssues.map((issue, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-lg font-medium text-gray-700">{index + 1}.</span>
                    <span className="ml-2">{issue.name}</span>
                  </div>
                  <div className="bg-umrah-gray-soft text-umrah-purple-dark text-sm font-medium px-2.5 py-0.5 rounded">
                    {issue.count} mentions
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground">No issues found</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
