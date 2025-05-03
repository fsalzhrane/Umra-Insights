
import { PropsWithChildren } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface SurveySectionProps {
  title: string;
  description?: string;
  className?: string;
}

export const SurveySection = ({
  title,
  description,
  children,
  className = "",
}: PropsWithChildren<SurveySectionProps>) => {
  return (
    <Card className={`w-full max-w-3xl mx-auto ${className}`}>
      <CardHeader>
        <CardTitle className="text-center text-2xl">{title}</CardTitle>
        {description && (
          <CardDescription className="text-center">{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};
